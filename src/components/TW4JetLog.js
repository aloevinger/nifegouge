import React, { useState, useEffect, useMemo } from 'react';

const toHHMM = (mins) => {
  const m = Math.max(0, Math.round(mins));
  return String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0');
};

function TW4JetLog() {
  const [mainRowCount, setMainRowCount] = useState(9);
  const [inputValues, setInputValues] = useState({'r0c4': '1', 'r0c6': '50', 'r0c7': '1050'});
  const [airports, setAirports] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [infoFields, setInfoFields] = useState({
    depElev: '', clncDel: '', gndCont: '', tower: '',
    destElev: '', destApcCont: '', destTower: '', destGndCont: '',
    alternate: '', altElev: '', altApcCont: '', altTower: '', altGndCont: '',
  });
  const [ttcData, setTtcData] = useState([]);
  const [cruiseData, setCruiseData] = useState([]);
  const [selectedAlt, setSelectedAlt] = useState(1000);
  const [depInput, setDepInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [clncFields, setClncFields] = useState({ ttc: '', fuel: '', dist: '', deltaT: '', oat: '', tasClimb: '', lbsPhClimb: '', tasCruise: '', lbsPhCruise: '', ias: '', climbDir: '', climbVel: '', cruiseDir: '', cruiseVel: '', vfrGsCalc: '210', vfrLbsPh: '', vfrAtis: '', vfrWindAtAlt: '', vfrClnc1a: '', vfrClnc1b: 'KNQI APP 119.9  FSS 122.2 (San Angelo)', vfrClnc2a: '', vfrClnc2b: 'TW2 DECON 308.2', vfrClnc3a: '', vfrClnc3b: 'Houston Center 128.12/350.3', vfrClnc4a: '', vfrClnc4b: 'ERAA:' });
  const [splitCells, setSplitCells] = useState({});
  const [showParams, setShowParams] = useState(false);
  const [params, setParams] = useState({
    approachTime: '10',
    approachFuel: '50',
    startFuel: '1100',
    sttoTime: '1',
    sttoFuel: '50',
    holdTime: '15',
    stdReserve: '200',
    tngTime: '5',
    tngFuel: '25',
  });
  const [routeBadges, setRouteBadges] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [vfrMode, setVfrMode] = useState(false);
  const [vfrTng, setVfrTng] = useState({});
  const [vfrApr, setVfrApr] = useState({});
  const [sharedPresets, setSharedPresets] = useState([]);
  const [localPresets, setLocalPresets] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Alternate table rows use r200+ namespace so main table can grow freely
  const ALT_ROWS = [200, 202, 204, 206];

  const handleInputChange = (cellId, value) => {
    setInputValues(prev => ({ ...prev, [cellId]: value }));
  };

  useEffect(() => {
    fetch('/TTC.csv')
      .then(r => r.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(3);
        const parsed = rows.map(row => {
          const p = row.split(',');
          return {
            alt: parseInt(p[0]),
            time: [p[1], p[2], p[3], p[4]].map(v => v.trim() === '' ? null : parseInt(v)),
            fuel: [p[5], p[6], p[7], p[8]].map(v => v.trim() === '' ? null : parseInt(v)),
            dist: [p[9], p[10], p[11], p[12]].map(v => v.trim() === '' ? null : parseInt(v)),
          };
        }).filter(r => !isNaN(r.alt));
        setTtcData(parsed);
      });
  }, []);

  useEffect(() => {
    fetch('/Cruise.csv')
      .then(r => r.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(2);
        setCruiseData(rows.map(row => {
          const p = row.split(',');
          return { alt: parseInt(p[0]), oat: parseFloat(p[1]), ias: parseFloat(p[2]), tas: parseFloat(p[3]), ff: parseFloat(p[4]) };
        }).filter(r => !isNaN(r.alt)));
      });
  }, []);

  useEffect(() => {
    fetch('/Airport Info.csv')
      .then(r => r.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(1);
        setAirports(rows.map(row => {
          const p = row.split(',');
          return { airport: p[0], elev: p[1], atis: p[2], clncDel: p[3], gndCont: p[4], tower: p[5], apcCont: p[6] };
        }));
      });
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openDropdown]);

  useEffect(() => {
    if (!vfrMode) return;
    const ete = formatVFREte((parseFloat(params.tngTime) || 5) * 60);
    const fuel = String(parseFloat(params.tngFuel) || 25);
    setInputValues(prev => {
      const next = { ...prev };
      for (const cellId of Object.keys(vfrTng)) {
        const match = cellId.match(/^r(\d+)c/);
        if (!match) continue;
        const row = parseInt(match[1]);
        next[`r${row}c4`] = ete;
        next[`r${row}c6`] = fuel;
      }
      return next;
    });
  }, [vfrMode, vfrTng, params.tngTime, params.tngFuel]);

  useEffect(() => {
    if (!vfrMode) return;
    const ete = String(parseFloat(params.approachTime) || 10);
    const fuel = String(parseFloat(params.approachFuel) || 50);
    setInputValues(prev => {
      const next = { ...prev };
      for (const row of ALT_ROWS) {
        if (vfrApr[`r${row}c0`]) {
          next[`r${row}c4`] = ete;
          next[`r${row}c6`] = fuel;
        }
      }
      return next;
    });
  }, [vfrMode, vfrApr, params.approachTime, params.approachFuel]);

  // Derive a stable key from alt-row distances so the effect below re-runs only when dist changes.
  // c3 is the only column this effect reads; it never writes c3, so no infinite loop.
  const altDistKey = ALT_ROWS.map(r => inputValues[`r${r}c3`] || '').join(',');
  useEffect(() => {
    if (!vfrMode) return;
    const gs = parseFloat(clncFields.vfrGsCalc);
    if (isNaN(gs) || gs <= 0) return;
    let lbsPh = parseFloat(clncFields.vfrLbsPh);
    if (isNaN(lbsPh)) {
      const denom = 0.0213507*gs - 0.000097065*gs**2 + 1.50819e-7*gs**3 - 1.22171;
      if (denom > 0) lbsPh = Math.round(gs / denom);
      else return;
    }
    setInputValues(prev => {
      const next = { ...prev };
      for (const row of ALT_ROWS) {
        if (vfrApr[`r${row}c0`]) continue; // APR rows handled by their own effect
        const dist = parseFloat(prev[`r${row}c3`] || '');
        if (isNaN(dist) || dist <= 0) { next[`r${row}c4`] = ''; next[`r${row}c6`] = ''; continue; }
        const eteSecs = calcVFREte(dist, gs);
        if (!eteSecs) { next[`r${row}c4`] = ''; next[`r${row}c6`] = ''; continue; }
        next[`r${row}c4`] = String(Math.round(eteSecs / 60));
        next[`r${row}c6`] = String(calcVFRLegFuel(eteSecs, lbsPh));
      }
      return next;
    });
  }, [vfrMode, clncFields.vfrGsCalc, clncFields.vfrLbsPh, vfrApr, altDistKey]);

  useEffect(() => {
    fetch('/presets.json')
      .then(r => r.json())
      .then(data => setSharedPresets(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tw4_jet_presets');
      if (saved) setLocalPresets(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    const startF = parseFloat(params.startFuel) || 0;
    const sttoF = parseFloat(params.sttoFuel) || 0;
    setInputValues(prev => ({
      ...prev,
      'r0c4': vfrMode ? formatVFREte((parseFloat(params.sttoTime) || 0) * 60) : params.sttoTime,
      'r0c6': params.sttoFuel,
      'r0c7': String(startF - sttoF),
    }));
  }, [params.startFuel, params.sttoFuel, params.sttoTime, vfrMode]);

  const cruiseGrouped = useMemo(() => {
    const groups = {};
    cruiseData.forEach(r => {
      if (!groups[r.alt]) groups[r.alt] = [];
      groups[r.alt].push(r);
    });
    return { groups, altList: Object.keys(groups).map(Number).sort((a, b) => a - b) };
  }, [cruiseData]);

  const parseElevation = (text) => {
    const clean = (text || '').replace(/,/g, '');
    const withApos = clean.match(/(\d+)'/);
    if (withApos) return parseInt(withApos[1]);
    const nums = clean.match(/\d+/g);
    return nums ? parseInt(nums[nums.length - 1]) : 0;
  };

  const autoFillTTC = (deltaT, alt, depElevText) => {
    const dt = parseFloat(deltaT);
    if (isNaN(dt) || !alt || ttcData.length === 0) return;
    const row = ttcData.reduce((best, r) =>
      Math.abs(r.alt - alt) < Math.abs(best.alt - alt) ? r : best
    );
    const deltaTOptions = [-20, 0, 10, 20];
    const colIdx = deltaTOptions.reduce((bestI, v, i) =>
      Math.abs(v - dt) < Math.abs(deltaTOptions[bestI] - dt) ? i : bestI
    , 0);
    let ttc = row.time[colIdx];
    let fuel = row.fuel[colIdx];
    let dist = row.dist[colIdx];

    const depElev = parseElevation(depElevText);
    if (depElev > 4499) {
      const roundedElev = Math.round(depElev / 1000) * 1000;
      const elevRow = ttcData.reduce((best, r) =>
        Math.abs(r.alt - roundedElev) < Math.abs(best.alt - roundedElev) ? r : best
      );
      if (ttc != null && elevRow.time[colIdx] != null) ttc = ttc - elevRow.time[colIdx];
      if (fuel != null && elevRow.fuel[colIdx] != null) fuel = fuel - elevRow.fuel[colIdx];
      if (dist != null && elevRow.dist[colIdx] != null) dist = dist - elevRow.dist[colIdx];
    }

    const tasClimb = ttc != null && dist != null && ttc > 0 ? String(Math.round(60 * dist / ttc)) : '';
    const lbsPhClimb = ttc != null && fuel != null && ttc > 0 ? String(Math.round(60 * fuel / ttc)) : '';
    setClncFields(prev => ({
      ...prev,
      ttc: ttc != null ? String(ttc) : '',
      fuel: fuel != null ? String(fuel) : '',
      dist: dist != null ? String(dist) : '',
      tasClimb,
      lbsPhClimb,
    }));
  };

  const autoFillCruise = (oat, alt) => {
    const oatNum = parseFloat(oat);
    if (isNaN(oatNum) || !alt || cruiseData.length === 0) return;

    const { groups: altGroups, altList } = cruiseGrouped;

    // Interpolate (or clamp) within one altitude's rows by OAT
    const interpOat = (rows) => {
      const sorted = [...rows].sort((a, b) => a.oat - b.oat);
      if (oatNum <= sorted[0].oat) return sorted[0];
      if (oatNum >= sorted[sorted.length - 1].oat) return sorted[sorted.length - 1];
      let lo, hi;
      for (let i = 0; i < sorted.length - 1; i++) {
        if (oatNum >= sorted[i].oat && oatNum <= sorted[i + 1].oat) {
          lo = sorted[i]; hi = sorted[i + 1]; break;
        }
      }
      const f = (oatNum - lo.oat) / (hi.oat - lo.oat);
      return {
        tas: lo.tas + f * (hi.tas - lo.tas),
        ff:  lo.ff  + f * (hi.ff  - lo.ff),
        ias: lo.ias + f * (hi.ias - lo.ias),
      };
    };

    const apply = (row) => setClncFields(prev => ({
      ...prev,
      tasCruise:   String(Math.round(row.tas)),
      lbsPhCruise: String(Math.round(row.ff)),
      ias:         String(Math.round(row.ias)),
    }));

    if (alt <= altList[0]) { apply(interpOat(altGroups[altList[0]])); return; }
    if (alt >= altList[altList.length - 1]) { apply(interpOat(altGroups[altList[altList.length - 1]])); return; }

    let lowAlt, highAlt;
    for (let i = 0; i < altList.length - 1; i++) {
      if (alt >= altList[i] && alt <= altList[i + 1]) {
        lowAlt = altList[i]; highAlt = altList[i + 1]; break;
      }
    }
    const altFrac = (alt - lowAlt) / (highAlt - lowAlt);
    const lo = interpOat(altGroups[lowAlt]);
    const hi = interpOat(altGroups[highAlt]);
    const interp = (a, b) => Math.round(a + altFrac * (b - a));
    setClncFields(prev => ({
      ...prev,
      tasCruise:   String(interp(lo.tas, hi.tas)),
      lbsPhCruise: String(interp(lo.ff,  hi.ff)),
      ias:         String(interp(lo.ias, hi.ias)),
    }));
  };

  const autoFillVFRCruise = (gs) => {
    const gsNum = parseFloat(gs);
    if (isNaN(gsNum) || gsNum <= 0) return;
    const denom = 0.0213507 * gsNum
      - 0.000097065 * gsNum ** 2
      + 1.50819e-7  * gsNum ** 3
      - 1.22171;
    if (denom <= 0) return;
    const ff = gsNum / denom;
    setClncFields(prev => ({ ...prev, vfrLbsPh: String(Math.round(ff)) }));
  };

  const setInfoField = (key, val) => setInfoFields(prev => ({...prev, [key]: val}));
  const cleanVal = val => (!val || val.trim() === '-') ? '' : val.trim();

  const selectAirport = (ap, type) => {
    if (type === 'dep') {
      const newDepElev = `${ap.airport} ${ap.elev}`;
      setInfoFields(prev => ({...prev,
        depElev: newDepElev,
        clncDel: cleanVal(ap.clncDel),
        gndCont: cleanVal(ap.gndCont),
        tower: cleanVal(ap.tower),
      }));
      if (clncFields.deltaT) autoFillTTC(clncFields.deltaT, selectedAlt, newDepElev);
      setClncFields(prev => ({...prev, vfrAtis: (ap.atis || '').trim()}));
      autoFillVFRCruise(clncFields.vfrGsCalc);
    } else if (type === 'dest') {
      setInfoFields(prev => ({...prev,
        destElev: `${ap.airport} ${ap.elev}`,
        destApcCont: cleanVal(ap.apcCont),
        destTower: cleanVal(ap.tower),
        destGndCont: cleanVal(ap.gndCont),
      }));
    } else if (type === 'alt') {
      setInfoFields(prev => ({...prev,
        alternate: ap.airport,
        altElev: cleanVal(ap.elev),
        altApcCont: cleanVal(ap.apcCont),
        altTower: cleanVal(ap.tower),
        altGndCont: cleanVal(ap.gndCont),
      }));
    }
    setOpenDropdown(null);
  };

  const renderAirportDropdown = (type) => openDropdown === type && (
    <div
      style={{position: 'absolute', zIndex: 200, background: 'white', border: '1px solid #999',
        maxHeight: '130px', overflowY: 'auto', minWidth: '160px', left: 0, top: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}
      onClick={e => e.stopPropagation()}
    >
      {airports.map(ap => (
        <div key={ap.airport}
          onClick={() => selectAirport(ap, type)}
          style={{padding: '3px 6px', cursor: 'pointer', fontSize: '0.75em', borderBottom: '1px solid #f0f0f0'}}
          onMouseEnter={e => e.currentTarget.style.background = '#e8f0fe'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          {ap.airport} {ap.elev}
        </div>
      ))}
    </div>
  );

  const formatEteSum = (mins) => {
    if (mins == null) return '';
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    return `${h}+${String(m).padStart(2, '0')}`;
  };

  const calcVFREte = (dist, gs) => {
    if (!gs || gs <= 0 || isNaN(dist) || isNaN(gs)) return null;
    return Math.round(dist / gs * 3600 / 6) * 6;
  };

  const calcVFRLegFuel = (eteSecs, lbsPh) =>
    !isNaN(lbsPh) ? Math.ceil(Math.round(eteSecs / 60 * lbsPh / 60) / 5) * 5 : 0;

  const formatVFREte = (secs) => {
    if (secs == null || isNaN(secs)) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}+${String(s).padStart(2, '0')}`;
  };

  const formatVFREta = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h === 0) return `${m}+${String(s).padStart(2, '0')}`;
    return `${h}+${String(m).padStart(2, '0')}+${String(s).padStart(2, '0')}`;
  };

  const sumCells = (ids) => {
    const total = ids.reduce((acc, id) => {
      const num = parseFloat((inputValues[id] || '').match(/-?\d+(\.\d+)?/)?.[0]);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    return total > 0 ? Math.round(total * 10) / 10 : null;
  };

  // Sums ETE cells that may contain "mm+ss" (VFR) or plain minutes (IFR/alt).
  // Returns total seconds, or null if all empty.
  const sumEteSecs = (ids) => {
    let totalSecs = 0;
    let any = false;
    for (const id of ids) {
      const val = (inputValues[id] || '').trim();
      if (!val) continue;
      any = true;
      const vfrMatch = val.match(/^(\d+)\+(\d{2})$/);
      if (vfrMatch) {
        totalSecs += parseInt(vfrMatch[1]) * 60 + parseInt(vfrMatch[2]);
      } else {
        const n = parseFloat(val.match(/-?\d+(\.\d+)?/)?.[0]);
        if (!isNaN(n)) totalSecs += Math.round(n * 60);
      }
    }
    return any ? totalSecs : null;
  };

  const renderFreqInput = (value, onChange) => {
    const match = value.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const main = match ? match[1].trim() : value;
    const qualifier = match ? match[2] : null;
    return (
      <div style={{position: 'relative'}}>
        <input type="text" value={main} onChange={onChange} />
        {qualifier && qualifier !== 'C' && (
          <span style={{position: 'absolute', top: -6, right: 2, fontSize: '0.75em', lineHeight: 1, color: '#555', pointerEvents: 'none'}}>
            {qualifier}
          </span>
        )}
        {qualifier === 'C' && (
          <img src="/ctaf.png" alt="CTAF" style={{position: 'absolute', top: -6, right: 1, width: 10, height: 10, pointerEvents: 'none'}} />
        )}
      </div>
    );
  };

  const renderFreqCell = (key, label, tdProps = {}) => (
    <td {...tdProps}>
      <span className="info-label">{label}</span>
      {renderFreqInput(infoFields[key] || '', (e) => setInfoField(key, e.target.value))}
    </td>
  );

  const renderCell = (cellId, rowSpan, colSpan) => {
    const vfrFontStyle = vfrMode ? {fontSize: '0.85em'} : undefined;
    if (splitCells[cellId]) {
      const { top, bottom } = splitCells[cellId];
      return (
        <td id={cellId} rowSpan={rowSpan || undefined} colSpan={colSpan || undefined} style={{padding: 0, border: '1px solid black', verticalAlign: 'middle', ...vfrFontStyle}}>
          <div style={{borderBottom: '1px solid #000', textAlign: 'center', padding: '1px 3px'}}>{top}</div>
          <div style={{textAlign: 'center', padding: '1px 3px'}}>{bottom}</div>
        </td>
      );
    }
    return (
      <td id={cellId} {...(rowSpan && { rowSpan })} {...(colSpan && { colSpan })}>
        <input
          value={inputValues[cellId] || ''}
          onChange={(e) => handleInputChange(cellId, e.target.value)}
          style={vfrFontStyle}
        />
      </td>
    );
  };

  const ROUTE_OPTIONS = ['Route', 'Direct To', '1 Approach', '2 Approaches', '3 Approaches', 'Hold'];

  const handleRouteOption = (cellId, opt) => {
    setOpenDropdown(null);
    const topRow = parseInt(cellId.match(/^r(\d+)c0$/)?.[1]);
    const countMatch = opt.match(/^(\d+) Approach/);
    if (countMatch) {
      const count = parseInt(countMatch[1]);
      const ete = count * (parseFloat(params.approachTime) || 0);
      const fuel = count * (parseFloat(params.approachFuel) || 0);
      setInputValues(prev => ({...prev, [`r${topRow}c4`]: String(ete), [`r${topRow}c6`]: String(fuel)}));
      setRouteBadges(prev => ({...prev, [cellId]: count}));
    } else if (opt === 'Hold') {
      setRouteBadges(prev => ({...prev, [cellId]: 'H'}));
    } else if (opt === 'Direct To') {
      setInputValues(prev => ({...prev, [`${cellId}_a`]: 'D→'}));
      setRouteBadges(prev => { const n = {...prev}; delete n[cellId]; return n; });
    } else {
      setRouteBadges(prev => { const n = {...prev}; delete n[cellId]; return n; });
    }
  };

  const renderRouteToCell = (cellId) => {
    const aId = `${cellId}_a`;
    const bId = `${cellId}_b`;
    const dropKey = `route_${cellId}`;
    const badge = routeBadges[cellId];
    const isApproach = typeof badge === 'number';
    return (
      <td id={cellId} rowSpan={2} style={{verticalAlign: isApproach ? 'middle' : 'top', padding: '2px', position: 'relative'}}>
        {badge != null && (
          <span style={{position: 'absolute', top: 2, right: 3, fontSize: '0.65em', fontWeight: 'bold', color: '#333', pointerEvents: 'none', lineHeight: 1}}>
            {badge}
          </span>
        )}
        {isApproach ? (
          <div style={{position: 'relative', paddingRight: '14px', display: 'flex', alignItems: 'center'}}>
            <input
              value={inputValues[aId] || ''}
              onChange={e => handleInputChange(aId, e.target.value)}
              style={{textAlign: 'left', width: '100%', boxSizing: 'border-box', fontSize: '1.1em'}}
            />
            <span
              onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === dropKey ? null : dropKey); }}
              style={{position: 'absolute', bottom: 0, right: 0, cursor: 'pointer', userSelect: 'none', padding: '0 2px'}}
            >▾</span>
          </div>
        ) : (
          <div style={{position: 'relative', paddingRight: '14px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              <input
                value={inputValues[aId] || ''}
                onChange={e => handleInputChange(aId, e.target.value)}
                style={{textAlign: 'left', width: '100%', boxSizing: 'border-box'}}
              />
              <input
                value={inputValues[bId] || ''}
                onChange={e => handleInputChange(bId, e.target.value)}
                style={{textAlign: 'left', width: '100%', boxSizing: 'border-box'}}
              />
            </div>
            <span
              onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === dropKey ? null : dropKey); }}
              style={{position: 'absolute', bottom: 0, right: 0, cursor: 'pointer', userSelect: 'none', padding: '0 2px'}}
            >▾</span>
          </div>
        )}
        {openDropdown === dropKey && (
          <div
            style={{position: 'absolute', zIndex: 200, background: 'white', border: '1px solid #999',
              maxHeight: '150px', overflowY: 'auto', minWidth: '120px', left: 0, top: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}
            onClick={e => e.stopPropagation()}
          >
            {ROUTE_OPTIONS.map(opt => (
              <div key={opt}
                onClick={() => handleRouteOption(cellId, opt)}
                style={{padding: '3px 6px', cursor: 'pointer', fontSize: '0.75em', borderBottom: '1px solid #f0f0f0'}}
                onMouseEnter={e => e.currentTarget.style.background = '#e8f0fe'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </td>
    );
  };

  const vfrNameFontSize = (text) => {
    const len = (text || '').length;
    if (len <= 8) return '0.95em';
    if (len <= 11) return '0.78em';
    if (len <= 14) return '0.61em';
    return '0.50em';
  };

  const renderVFRCheckCell = (cellId, flagState, setFlagState, label, labelWidth) => {
    const aId = `${cellId}_a`;
    const bId = `${cellId}_b`;
    const isChecked = !!flagState[cellId];
    return (
      <td id={cellId} rowSpan={2} style={{verticalAlign: 'top', padding: '2px', position: 'relative'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>
          <input
            value={inputValues[aId] || ''}
            onChange={e => handleInputChange(aId, e.target.value)}
            placeholder="FP code"
            style={{textAlign: 'left', width: '100%', boxSizing: 'border-box', fontSize: '0.62em', padding: '1px 2px', height: '1.6em', background: 'transparent', border: 'none', outline: 'none'}}
          />
          <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}>
            <input
              value={inputValues[bId] || ''}
              onChange={e => handleInputChange(bId, e.target.value)}
              style={{textAlign: 'left', flex: 1, boxSizing: 'border-box', fontSize: vfrNameFontSize(inputValues[bId]), background: 'transparent', border: 'none', outline: 'none'}}
            />
            <label style={{cursor: 'pointer', fontSize: '0.65em', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '1px', flexShrink: 0}}>
              <span style={{minWidth: labelWidth, textAlign: 'right', display: 'inline-block'}}>{isChecked ? label : ''}</span>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={e => setFlagState(prev => {
                  const n = {...prev};
                  if (e.target.checked) n[cellId] = true; else delete n[cellId];
                  return n;
                })}
                style={{width: '10px', height: '10px', margin: 0}}
              />
            </label>
          </div>
        </div>
      </td>
    );
  };

  const pairHasData = (pairIdx) => {
    const top = pairIdx * 2;
    const bot = top + 1;
    const hasVal = (id) => (inputValues[id] || '').trim() !== '';
    if (hasVal(`r${top}c0_a`) || hasVal(`r${top}c0_b`)) return true;
    const otherTopCols = ['c1','c2','c3','c4','c5','c6','c7','c8'];
    const botCols = ['c0','c1','c2'];
    return (
      otherTopCols.some(col => hasVal(`r${top}${col}`)) ||
      botCols.some(col => hasVal(`r${bot}${col}`)) ||
      Object.keys(splitCells).some(k => k.startsWith(`r${top}c`) || k.startsWith(`r${bot}c`))
    );
  };

  const handleAddRow = () => {
    setMainRowCount(prev => Math.min(prev + 1, 20));
  };

  const handleRemoveRow = () => {
    // Never remove below 1 row (STTO only), never remove a row with data
    if (mainRowCount <= 1) return;
    const lastPair = mainRowCount - 1;
    if (!pairHasData(lastPair)) {
      setMainRowCount(prev => prev - 1);
    }
  };

  const handleVFRSolve = () => {
    const gs = parseFloat(clncFields.vfrGsCalc);
    const lbsPh = parseFloat(clncFields.vfrLbsPh);
    const newVals = { ...inputValues };

    const sttoTimeMin = parseFloat(params.sttoTime) || 0;
    const sttoFuel = parseFloat(params.sttoFuel) || 0;
    const startFuel = parseFloat(params.startFuel) || 0;
    newVals['r0c4'] = formatVFREte(sttoTimeMin * 60);
    newVals['r0c6'] = String(sttoFuel);
    let efr = startFuel - sttoFuel;
    newVals['r0c7'] = String(efr);
    newVals['r0c5'] = '';

    let etaAccumSecs = 0;
    let firstActualSet = false;
    const mainRows = Array.from({ length: mainRowCount }, (_, i) => i * 2);

    for (let pairIdx = 1; pairIdx < mainRowCount; pairIdx++) {
      const row = pairIdx * 2;
      const cellId = `r${row}c0`;
      const isTng = !!vfrTng[cellId];
      const dist = parseFloat(inputValues[`r${row}c3`] || '');

      let eteSecs, legFuel;
      if (isTng) {
        eteSecs = (parseFloat(params.tngTime) || 5) * 60;
        legFuel = parseFloat(params.tngFuel) || 25;
      } else if (!isNaN(dist) && !isNaN(gs) && gs > 0) {
        eteSecs = calcVFREte(dist, gs);
        if (eteSecs == null) continue;
        legFuel = calcVFRLegFuel(eteSecs, lbsPh);
      } else {
        continue;
      }

      newVals[`r${row}c4`] = formatVFREte(eteSecs);
      newVals[`r${row}c6`] = String(legFuel);
      efr -= legFuel;
      newVals[`r${row}c7`] = String(efr);

      if (!firstActualSet) {
        newVals[`r${row}c5`] = '0+00';
        firstActualSet = true;
      } else {
        etaAccumSecs += eteSecs; // ETA = last ETA + this leg's ETE
        newVals[`r${row}c5`] = formatVFREta(etaAccumSecs);
      }
    }

    for (const row of ALT_ROWS) {
      const cellId = `r${row}c0`;
      const isApr = !!vfrApr[cellId];
      const dist = parseFloat(inputValues[`r${row}c3`] || '');
      let eteSecs, legFuel;
      if (isApr) {
        eteSecs = (parseFloat(params.approachTime) || 10) * 60;
        legFuel = parseFloat(params.approachFuel) || 50;
      } else if (!isNaN(dist) && !isNaN(gs) && gs > 0) {
        eteSecs = calcVFREte(dist, gs);
        if (eteSecs == null) continue;
        legFuel = calcVFRLegFuel(eteSecs, lbsPh);
      } else {
        continue;
      }
      newVals[`r${row}c4`] = String(Math.round(eteSecs / 60));
      newVals[`r${row}c6`] = String(legFuel);
      efr -= legFuel;
      newVals[`r${row}c7`] = String(efr);
    }

    // Continuation fuel: bottom-up pass; last stop shows contFuelStart (200), each row above adds that leg's fuel
    const allRowsBottomUp = [...[...ALT_ROWS].reverse(), ...[...mainRows].reverse()];
    let contFuel = parseFloat(params.stdReserve) || 200;
    for (const row of allRowsBottomUp) {
      const legFuelStr = (newVals[`r${row}c6`] || inputValues[`r${row}c6`] || '').trim();
      if (!legFuelStr) { newVals[`r${row}c8`] = ''; continue; }
      newVals[`r${row}c8`] = String(Math.round(contFuel));
      contFuel += parseFloat(legFuelStr) || 0;
    }

    setSplitCells({});
    setInputValues(newVals);
  };

  const handleSolve = () => {
    if (vfrMode) { handleVFRSolve(); return; }
    const climbDistTotal = parseFloat(clncFields.dist);
    if (isNaN(climbDistTotal) || climbDistTotal <= 0) return;

    const climbDIR = parseFloat(clncFields.climbDir);
    const climbVEL = parseFloat(clncFields.climbVel);
    const climbTAS = parseFloat(clncFields.tasClimb);
    const cruiseDIR = parseFloat(clncFields.cruiseDir);
    const cruiseVEL = parseFloat(clncFields.cruiseVel);
    const cruiseTAS = parseFloat(clncFields.tasCruise);
    const lbsPhClimb = parseFloat(clncFields.lbsPhClimb);
    const lbsPhCruise = parseFloat(clncFields.lbsPhCruise);

    const calcGS = (tas, dir, vel, tc) => {
      if (isNaN(tas) || isNaN(dir) || isNaN(vel) || isNaN(tc)) return null;
      return Math.round(tas + (-vel * Math.cos((dir - tc) * Math.PI / 180)));
    };
    const calcETE = (dist, gs) => (gs > 0 ? Math.round(60 * dist / gs) : null);
    const calcFuel = (ete, lbsPh) => (ete != null && !isNaN(lbsPh) ? Math.ceil(Math.round(ete * lbsPh / 60) / 5) * 5 : null);

    const mainRows = Array.from({length: mainRowCount}, (_, i) => i * 2);
    let cumDist = 0;
    let turnoverRow = null;
    let turnoverClimb = 0;
    let turnoverCruise = 0;

    for (const row of mainRows) {
      const d = parseFloat(inputValues[`r${row}c3`] || '');
      if (isNaN(d) || d === 0) continue;
      if (cumDist + d > climbDistTotal) {
        turnoverRow = row;
        turnoverClimb = Math.round((climbDistTotal - cumDist) * 10) / 10;
        turnoverCruise = Math.round((d - turnoverClimb) * 10) / 10;
        break;
      }
      cumDist += d;
    }

    const newSplit = {};
    const newVals = { ...inputValues };
    const applyHold = (row, ete, fuel, holdMins) => {
      const holdFuel = calcFuel(holdMins, lbsPhCruise);
      const totalEte = ete + holdMins;
      const totalFuel = (fuel ?? 0) + (holdFuel ?? 0);
      newSplit[`r${row}c4`] = { top: `${ete}/${holdMins}`, bottom: String(totalEte) };
      newSplit[`r${row}c6`] = { top: `${fuel ?? ''}/${holdFuel ?? ''}`, bottom: String(totalFuel) };
      newVals[`r${row}c4`] = String(totalEte);
      newVals[`r${row}c6`] = String(totalFuel);
    };

    for (const row of mainRows) {
      const d = parseFloat(inputValues[`r${row}c3`] || '');
      if (isNaN(d) || d === 0) continue;
      const tc = parseFloat((inputValues[`r${row}c2`] || '').replace(/[^\d.-]/g, ''));
      const isHold = routeBadges[`r${row}c0`] === 'H';
      const holdMins = parseFloat(params.holdTime) || 0;

      if (turnoverRow === null || row < turnoverRow) {
        const gs = calcGS(climbTAS, climbDIR, climbVEL, tc);
        if (gs !== null) {
          newVals[`r${row}c8`] = String(gs);
          const ete = calcETE(d, gs);
          if (ete !== null) {
            const fuel = calcFuel(ete, lbsPhClimb);
            if (isHold) {
              applyHold(row, ete, fuel, holdMins);
            } else {
              newVals[`r${row}c4`] = String(ete);
              if (fuel !== null) newVals[`r${row}c6`] = String(fuel);
            }
          }
        }
      } else if (row === turnoverRow) {
        const climbGS = calcGS(climbTAS, climbDIR, climbVEL, tc);
        const cruiseGS = calcGS(cruiseTAS, cruiseDIR, cruiseVEL, tc);
        newSplit[`r${row}c3`] = { top: `${turnoverClimb}/${turnoverCruise}`, bottom: String(d) };
        newSplit[`r${row}c8`] = { top: climbGS !== null ? String(climbGS) : '', bottom: cruiseGS !== null ? String(cruiseGS) : '' };

        const climbETE = climbGS !== null ? calcETE(turnoverClimb, climbGS) : null;
        const cruiseETE = cruiseGS !== null ? calcETE(turnoverCruise, cruiseGS) : null;
        const totalETE = (climbETE ?? 0) + (cruiseETE ?? 0);
        const climbFuel = calcFuel(climbETE, lbsPhClimb);
        const cruiseFuel = calcFuel(cruiseETE, lbsPhCruise);
        const totalFuel = (climbFuel ?? 0) + (cruiseFuel ?? 0);

        if (isHold) {
          const holdFuel = calcFuel(holdMins, lbsPhCruise);
          const grandTotalETE = totalETE + holdMins;
          const grandTotalFuel = totalFuel + (holdFuel ?? 0);
          newSplit[`r${row}c4`] = { top: `${climbETE ?? ''}/${cruiseETE ?? ''}/${holdMins}`, bottom: String(grandTotalETE) };
          newSplit[`r${row}c6`] = { top: `${climbFuel ?? ''}/${cruiseFuel ?? ''}/${holdFuel ?? ''}`, bottom: String(grandTotalFuel) };
          newVals[`r${row}c4`] = String(grandTotalETE);
          newVals[`r${row}c6`] = String(grandTotalFuel);
        } else {
          newSplit[`r${row}c4`] = { top: `${climbETE ?? ''}/${cruiseETE ?? ''}`, bottom: String(totalETE) };
          newSplit[`r${row}c6`] = { top: `${climbFuel ?? ''}/${cruiseFuel ?? ''}`, bottom: String(totalFuel) };
          newVals[`r${row}c4`] = String(totalETE);
          newVals[`r${row}c6`] = String(totalFuel);
        }
      } else {
        const gs = calcGS(cruiseTAS, cruiseDIR, cruiseVEL, tc);
        if (gs !== null) {
          newVals[`r${row}c8`] = String(gs);
          const ete = calcETE(d, gs);
          if (ete !== null) {
            const fuel = calcFuel(ete, lbsPhCruise);
            if (isHold) {
              applyHold(row, ete, fuel, holdMins);
            } else {
              newVals[`r${row}c4`] = String(ete);
              if (fuel !== null) newVals[`r${row}c6`] = String(fuel);
            }
          }
        }
      }
    }

    // EFR chain: STTO departure fuel = 1100 - leg fuel, then decrement per leg
    const sttoFuel = parseFloat(newSplit['r0c6'] ? newSplit['r0c6'].bottom : newVals['r0c6'] || '');
    let runningEFR = !isNaN(sttoFuel) ? Math.round((parseFloat(params.startFuel) || 1100) - sttoFuel) : NaN;
    let lastTopEFR = NaN;
    if (!isNaN(runningEFR)) {
      newVals['r0c7'] = String(runningEFR);
      lastTopEFR = runningEFR;
      for (let i = 1; i < mainRows.length; i++) {
        const row = mainRows[i];
        const fuelStr = newSplit[`r${row}c6`] ? newSplit[`r${row}c6`].bottom : newVals[`r${row}c6`];
        const legFuel = parseFloat(fuelStr || '');
        if (isNaN(legFuel)) break;
        runningEFR = Math.round(runningEFR - legFuel);
        newVals[`r${row}c7`] = String(runningEFR);
        lastTopEFR = runningEFR;
      }
    }

    // Alternate route table — all cruise, EFR continues from lastTopEFR
    let altRunningEFR = lastTopEFR;
    for (const row of ALT_ROWS) {
      const d = parseFloat(inputValues[`r${row}c3`] || '');
      if (isNaN(d) || d === 0) continue;
      const tc = parseFloat((inputValues[`r${row}c2`] || '').replace(/[^\d.-]/g, ''));
      const gs = calcGS(cruiseTAS, cruiseDIR, cruiseVEL, tc);
      if (gs !== null) {
        newVals[`r${row}c8`] = String(gs);
        const ete = calcETE(d, gs);
        if (ete !== null) {
          newVals[`r${row}c4`] = String(ete);
          const fuel = calcFuel(ete, lbsPhCruise);
          if (fuel !== null) {
            newVals[`r${row}c6`] = String(fuel);
            if (!isNaN(altRunningEFR)) {
              altRunningEFR = Math.round(altRunningEFR - fuel);
              newVals[`r${row}c7`] = String(altRunningEFR);
            }
          }
        }
      }
    }

    setSplitCells(newSplit);
    setInputValues(newVals);
  };

  const fuelDisplay = useMemo(() => {
    const eteCells = Array.from({length: mainRowCount}, (_, i) => `r${i * 2}c4`);
    const totalETE = sumCells(eteCells);
    if (totalETE == null) return '';
    const lbsPh = vfrMode ? parseFloat(clncFields.vfrLbsPh) : parseFloat(clncFields.lbsPhCruise);
    if (isNaN(lbsPh) || lbsPh === 0) return '';
    const efrCells = Array.from({length: mainRowCount}, (_, i) => `r${(mainRowCount - 1 - i) * 2}c7`);
    let finalEFR = null;
    for (const id of efrCells) {
      const v = parseFloat(inputValues[id] || '');
      if (!isNaN(v)) { finalEFR = v; break; }
    }
    if (finalEFR === null) return '';
    return formatEteSum(finalEFR / lbsPh * 60);
  }, [inputValues, clncFields.lbsPhCruise, clncFields.vfrLbsPh, vfrMode, mainRowCount]);

  const timeDisplay = useMemo(() => {
    const t = sumCells(ALT_ROWS.map(r => `r${r}c4`));
    return t != null ? formatEteSum(t) : '';
  }, [inputValues]);

  const fuelPlan = useMemo(() => {
    const approachFuelParam = parseFloat(params.approachFuel) || 0;
    const sttoFuelParam     = parseFloat(params.sttoFuel)     || 0;
    const startFuelParam    = parseFloat(params.startFuel)    || 0;
    const stdReserveParam   = parseFloat(params.stdReserve)   || 0;

    const readCell = (id) => {
      const v = parseFloat((inputValues[id] || '').match(/-?\d+(\.\d+)?/)?.[0]);
      return isNaN(v) ? 0 : v;
    };

    const mainRows = Array.from({length: mainRowCount}, (_, i) => i * 2);
    const totalTopFuel = mainRows.reduce((sum, row) => sum + readCell(`r${row}c6`), 0);
    const totalAltFuel = ALT_ROWS.reduce((sum, row) => sum + readCell(`r${row}c6`), 0);

    let item1, item2, item3;
    if (vfrMode) {
      // APR-checked alt rows → Approaches (item3); T&G stays in Route to Dest (item1)
      const aprFuel = ALT_ROWS.reduce((sum, row) =>
        vfrApr[`r${row}c0`] ? sum + readCell(`r${row}c6`) : sum, 0);
      item1 = totalTopFuel - sttoFuelParam;
      item2 = totalAltFuel - aprFuel;
      item3 = aprFuel;
    } else {
      const totalApproachCount = Object.values(routeBadges)
        .filter(b => typeof b === 'number')
        .reduce((sum, b) => sum + b, 0);
      item1 = totalTopFuel - sttoFuelParam - (totalApproachCount * approachFuelParam);
      item2 = totalAltFuel;
      item3 = approachFuelParam * (1 + totalApproachCount);
    }

    const item4 = item1 + item2 + item3;
    const item5 = Math.max(item4 * 0.1, stdReserveParam);
    const item6 = sttoFuelParam;
    const item7 = item4 + item5 + item6;
    const item8 = startFuelParam;
    const item9 = item8 - item7;

    const fmt = (v) => String(Math.round(v));
    return [
      [fmt(item1), fmt(item6)],
      [fmt(item2), fmt(item7)],
      [fmt(item3), fmt(item8)],
      [fmt(item4), fmt(item9)],
      [fmt(item5), null],
    ];
  }, [inputValues, routeBadges, vfrMode, vfrApr, params, mainRowCount]);

  const handleClear = () => {
    setInputValues(prev => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        // Keep STTO pair (r0c*, r1c*) and fuel plan (fs_*); clear everything else
        if (/^r0c/.test(k) || /^r1c/.test(k) || k.startsWith('fs_')) {
          next[k] = v;
        }
      }
      return next;
    });
    setRouteBadges({});
    setSplitCells({});
    setVfrTng({});
    setVfrApr({});
  };

  const capturePreset = (name) => ({
    id: Date.now().toString(),
    name,
    mode: vfrMode ? 'VFR' : 'IFR',
    mainRowCount,
    inputValues: Object.fromEntries(
      Object.entries(inputValues).filter(([k]) => !/c[45678]$/.test(k))
    ),
    clncFields: { ...clncFields },
    routeBadges: { ...routeBadges },
    vfrTng: { ...vfrTng },
    vfrApr: { ...vfrApr },
    selectedAlt,
    depInput,
    destInput,
    infoFields: { ...infoFields },
  });

  const applyPreset = (preset) => {
    const nextVfrMode = preset.mode === 'VFR';
    const nextVfrTng = preset.vfrTng || {};
    const nextVfrApr = preset.vfrApr || {};

    const startF = parseFloat(params.startFuel) || 0;
    const sttoF = parseFloat(params.sttoFuel) || 0;
    const nextInputValues = { ...(preset.inputValues || {}) };

    // STTO — params don't change on preset load so the STTO effect won't fire
    nextInputValues['r0c4'] = nextVfrMode ? formatVFREte((parseFloat(params.sttoTime) || 0) * 60) : params.sttoTime;
    nextInputValues['r0c6'] = params.sttoFuel;
    nextInputValues['r0c7'] = String(startF - sttoF);

    if (nextVfrMode) {
      // T&G rows
      const tngEte = formatVFREte((parseFloat(params.tngTime) || 5) * 60);
      const tngFuel = String(parseFloat(params.tngFuel) || 25);
      for (const [cellId, isTng] of Object.entries(nextVfrTng)) {
        if (!isTng) continue;
        const match = cellId.match(/^r(\d+)c/);
        if (!match) continue;
        const row = parseInt(match[1]);
        nextInputValues[`r${row}c4`] = tngEte;
        nextInputValues[`r${row}c6`] = tngFuel;
      }

      // APR rows
      const aprEte = String(parseFloat(params.approachTime) || 10);
      const aprFuel = String(parseFloat(params.approachFuel) || 50);
      for (const row of ALT_ROWS) {
        if (nextVfrApr[`r${row}c0`]) {
          nextInputValues[`r${row}c4`] = aprEte;
          nextInputValues[`r${row}c6`] = aprFuel;
        }
      }
    }

    setVfrMode(nextVfrMode);
    setMainRowCount(preset.mainRowCount || 9);
    setInputValues(nextInputValues);
    setClncFields(prev => ({ ...prev, ...(preset.clncFields || {}) }));
    setRouteBadges(preset.routeBadges || {});
    setVfrTng(nextVfrTng);
    setVfrApr(nextVfrApr);
    setSelectedAlt(preset.selectedAlt || 1000);
    setDepInput(preset.depInput || '');
    setDestInput(preset.destInput || '');
    setInfoFields(prev => ({ ...prev, ...(preset.infoFields || {}) }));
    setSplitCells({});
    setShowPresets(false);
  };

  const saveLocalPreset = (name) => {
    if (!name.trim()) return;
    const trimmed = name.trim();
    const allNames = [...localPresets, ...sharedPresets].map(p => p.name?.toLowerCase());
    if (allNames.includes(trimmed.toLowerCase())) {
      alert(`A preset named "${trimmed}" already exists.`);
      return;
    }
    const preset = capturePreset(trimmed);
    const updated = [...localPresets, preset];
    setLocalPresets(updated);
    localStorage.setItem('tw4_jet_presets', JSON.stringify(updated));
    setPresetName('');
  };

  const deleteLocalPreset = (id) => {
    const updated = localPresets.filter(p => p.id !== id);
    setLocalPresets(updated);
    localStorage.setItem('tw4_jet_presets', JSON.stringify(updated));
  };

  const exportPresetFile = (name) => {
    if (!name.trim()) return;
    const preset = {
      ...capturePreset(name.trim()),
      id: name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preset-${preset.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setPresetName('');
  };

  const renderVFRNotesCells = (top) => (
    <>
      <td rowSpan={2} style={{textAlign: 'center', border: '1px solid black', fontSize: '0.85em', verticalAlign: 'middle', padding: '1px 2px'}}>
        {inputValues[`r${top}c8`] || ''}
      </td>
      <td rowSpan={2} style={{fontSize: '0.75em'}}>
        <input
          value={inputValues[`r${top}c9`] || ''}
          onChange={e => handleInputChange(`r${top}c9`, e.target.value)}
          style={{fontSize: 'inherit'}}
        />
      </td>
    </>
  );

  const renderMainRowPair = (pairIdx) => {
    const top = pairIdx * 2;
    const bot = top + 1;
    return (
      <React.Fragment key={top}>
        <tr>
          {vfrMode ? renderVFRCheckCell(`r${top}c0`, vfrTng, setVfrTng, 'T&G', '20px') : renderRouteToCell(`r${top}c0`)}
          {renderCell(`r${top}c1`)}
          {renderCell(`r${top}c2`, 2)}
          {renderCell(`r${top}c3`, 2)}
          {renderCell(`r${top}c4`, 2)}
          {renderCell(`r${top}c5`)}
          {renderCell(`r${top}c6`, 2)}
          {renderCell(`r${top}c7`)}
          {vfrMode ? renderVFRNotesCells(top) : renderCell(`r${top}c8`, 2)}
        </tr>
        <tr>
          {renderCell(`r${bot}c0`)}
          {renderCell(`r${bot}c1`)}
          {renderCell(`r${bot}c2`)}
        </tr>
      </React.Fragment>
    );
  };

  const renderTotalRow = (tTop, tBot, distIds, eteIds, fuelIds, isAlt = false) => (
    <React.Fragment>
      <tr>
        <td rowSpan={2} style={{fontSize: '1.5em', textAlign: 'center', padding: '1px 3px', border: '1px solid black'}}>Total</td>
        {renderCell(`r${tTop}c1`)}
        {renderCell(`r${tTop}c2`, 2)}
        <td id={`r${tTop}c3`} rowSpan={2} style={{textAlign: 'center', border: '1px solid black'}}>
          {sumCells(distIds) ?? ''}
        </td>
        <td id={`r${tTop}c4`} rowSpan={2} style={{textAlign: 'center', border: '1px solid black'}}>
          {vfrMode && !isAlt
            ? (() => { const secs = sumEteSecs(eteIds); return secs != null ? formatVFREta(secs) : ''; })()
            : formatEteSum(sumCells(eteIds))}
        </td>
        {renderCell(`r${tTop}c5`)}
        <td id={`r${tTop}c6`} rowSpan={2} style={{textAlign: 'center', border: '1px solid black'}}>
          {(() => { const s = sumCells(fuelIds); return s != null ? s + '#' : ''; })()}
        </td>
        {renderCell(`r${tTop}c7`)}
        {vfrMode ? <td rowSpan={2} colSpan={2} style={{border: '1px solid black'}} /> : renderCell(`r${tTop}c8`, 2)}
      </tr>
      <tr>
        {renderCell(`r${tBot}c0`)}
        {renderCell(`r${tBot}c1`)}
        {renderCell(`r${tBot}c2`)}
      </tr>
    </React.Fragment>
  );

  const mainDataRows = Array.from({length: mainRowCount}, (_, i) => i * 2);
  const mainTotalTop = mainRowCount * 2;
  const mainTotalBot = mainRowCount * 2 + 1;

  const generateFlightPlan = async () => {
    try {
      const { PDFDocument, PDFName, PDFArray, PDFString } = await import('pdf-lib');
      const pdfBytes = await fetch('/DD-1801.pdf').then(r => r.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      pdfDoc.context.trailerInfo.Encrypt = undefined;

      // Build field list by walking page annotations directly (bypasses encrypted form API)
      const fieldList = [];
      const ctx = pdfDoc.context;
      for (const page of pdfDoc.getPages()) {
        const annotsRaw = page.node.get(PDFName.of('Annots'));
        if (!annotsRaw) continue;
        let annots;
        try { annots = ctx.lookup(annotsRaw); } catch (_) { continue; }
        if (!annots || typeof annots.size !== 'function') continue;
        for (let i = 0; i < annots.size(); i++) {
          try {
            const annotDict = ctx.lookup(annots.get(i));
            if (!annotDict || typeof annotDict.get !== 'function') continue;
            const subtype = annotDict.get(PDFName.of('Subtype'));
            if (!subtype || subtype.toString() !== '/Widget') continue;
            const ft = annotDict.get(PDFName.of('FT'));
            if (!ft || ft.toString() !== '/Tx') continue;
            const rect = ctx.lookup(annotDict.get(PDFName.of('Rect')));
            if (!rect || typeof rect.get !== 'function') continue;
            const n = (obj) => { const r = ctx.lookup(obj); return typeof r?.asNumber === 'function' ? r.asNumber() : parseFloat(r?.toString() || '0'); };
            const x = n(rect.get(0)), y = n(rect.get(1)), x2 = n(rect.get(2)), y2 = n(rect.get(3));
            fieldList.push({ annotDict, x, y, w: x2 - x, h: y2 - y });
          } catch (_) {}
        }
      }

      const setVal = (entry, text) => {
        try { entry.annotDict.set(PDFName.of('V'), PDFString.of(text)); entry.annotDict.delete(PDFName.of('AP')); } catch (_) {}
      };

      const fillChars = (yLo, yHi, xLo, xHi, text, label) => {
        const cells = fieldList
          .filter(f => f.y >= yLo && f.y <= yHi && f.x >= xLo && f.x <= xHi)
          .sort((a, b) => a.x - b.x);
        if (label) console.log(`fillChars [${label}] matched ${cells.length} cells:`, cells.map(c => ({x: Math.round(c.x), y: Math.round(c.y)})));
        const groups = [];
        let lastX = -999;
        for (const c of cells) {
          if (c.x - lastX > 2) { groups.push([c]); lastX = c.x; }
          else groups[groups.length - 1].push(c);
        }
        for (let i = 0; i < Math.min(groups.length, text.length); i++)
          for (const c of groups[i]) setVal(c, text[i]);
      };

      const fillText = (yLo, yHi, xLo, xHi, text) => {
        for (const f of fieldList.filter(f => f.y >= yLo && f.y <= yHi && f.x >= xLo && f.x <= xHi))
          setVal(f, text);
      };

      // ── Compute values ──────────────────────────────────────────────

      // Speed: leading-0 + cruise TAS  e.g. TAS 230 → "0230"
      const tas = vfrMode
        ? Math.round(parseFloat(clncFields.vfrGsCalc) || 0)
        : Math.round(parseFloat(clncFields.tasCruise) || 0);
      const speedStr = 'N0' + String(tas).padStart(3, '0');

      // Level: VFR in vfr mode; A090 for 9,000 ft MSL, FL220 for 22,000 ft MSL
      const levelStr = vfrMode ? 'VFR' : (selectedAlt >= 18000
        ? 'FL' + String(Math.round(selectedAlt / 100)).padStart(3, '0')
        : 'A'  + String(Math.round(selectedAlt / 100)).padStart(3, '0'));

      // Airport codes: first word of each info field
      const code = (s) => (s || '').trim().split(/\s+/)[0].toUpperCase().substring(0, 4);
      const depAirport  = code(infoFields.depElev);
      const destAirport = code(infoFields.destElev);
      const altnAirport = code(infoFields.alternate);

      // Total EET from main route table (minutes → HHMM)
      const mainRowsArr = Array.from({length: mainRowCount}, (_, i) => i * 2);
      // VFR ETE stored as "mm+ss"; IFR stored as plain minutes
      const parseEteMins = (val) => {
        if (!val) return 0;
        const vfrMatch = val.match(/^(\d+)\+(\d{2})$/);
        if (vfrMatch) return parseInt(vfrMatch[1]) + parseInt(vfrMatch[2]) / 60;
        const n = parseFloat(val.match(/-?\d+(\.\d+)?/)?.[0]);
        return isNaN(n) ? 0 : n;
      };
      const totalETE = mainRowsArr.reduce((sum, row) => sum + parseEteMins(inputValues[`r${row}c4`] || ''), 0);
      const eetStr = toHHMM(totalETE);

      // Fuel endurance = total ETE + remaining fuel time (EFR ÷ lbs/hr)
      const lbsPh = vfrMode ? (parseFloat(clncFields.vfrLbsPh) || 0) : (parseFloat(clncFields.lbsPhCruise) || 0);
      let finalEFR = 0;
      for (let i = mainRowCount - 1; i >= 0; i--) {
        const v = parseFloat(inputValues[`r${i * 2}c7`] || '');
        if (!isNaN(v)) { finalEFR = v; break; }
      }
      const reserveMins = lbsPh > 0 ? finalEFR / lbsPh * 60 : 0;
      const fuelStr = toHHMM(totalETE + reserveMins);

      // Route string (Block 15c)
      const mm = (mins) => String(Math.round(mins)).padStart(2, '0');
      const routeParts = [];
      if (vfrMode) {
        const hasNums = (s) => /\d/.test(s);
        const vfrDest = destInput.trim().toUpperCase();
        // Find last non-T&G pairIdx that has a code (to check against destination)
        let lastNonTngIdx = -1;
        for (let pairIdx = 0; pairIdx < mainRowCount; pairIdx++) {
          const top = pairIdx * 2;
          const cellId = `r${top}c0`;
          const code = ((inputValues[`${cellId}_a`] || '') || (inputValues[`${cellId}_b`] || '')).trim();
          if (code && !vfrTng[cellId]) lastNonTngIdx = pairIdx;
        }
        let prevCode = null;
        for (let pairIdx = 0; pairIdx < mainRowCount; pairIdx++) {
          const top = pairIdx * 2;
          const cellId = `r${top}c0`;
          const aCode = (inputValues[`${cellId}_a`] || '').trim();
          const bCode = (inputValues[`${cellId}_b`] || '').trim();
          const code = aCode || bCode;
          const isTng = !!vfrTng[cellId];
          if (!code && !isTng) continue;
          // Skip last waypoint if it matches the destination
          if (!isTng && pairIdx === lastNonTngIdx && code.toUpperCase() === vfrDest) continue;
          if (isTng) {
            // Append T&G time suffix to the previous waypoint entry
            const suffix = `/D00+${mm(parseFloat(params.tngTime) || 5)}`;
            if (routeParts.length > 0) {
              routeParts[routeParts.length - 1] += suffix;
            }
          } else if (prevCode !== null && hasNums(prevCode) && hasNums(code)) {
            routeParts.push(code);
            prevCode = code;
          } else {
            routeParts.push(`DCT  ${code}`);
            prevCode = code;
          }
        }
      } else {
        const ifrDest = destInput.trim().toUpperCase();
        // Find last non-approach pairIdx with a botVal (to check against destination)
        let lastNonAprIdx = -1;
        for (let pairIdx = 0; pairIdx < mainRowCount; pairIdx++) {
          const top = pairIdx * 2;
          const cellId = `r${top}c0`;
          const botVal = (inputValues[`${cellId}_b`] || '').trim();
          if (botVal && typeof routeBadges[cellId] !== 'number') lastNonAprIdx = pairIdx;
        }
        for (let pairIdx = 0; pairIdx < mainRowCount; pairIdx++) {
          const top = pairIdx * 2;
          const cellId = `r${top}c0`;
          const topVal = (inputValues[`${cellId}_a`] || '').trim();
          const botVal = (inputValues[`${cellId}_b`] || '').trim();
          const badge = routeBadges[cellId];
          const isApproach = typeof badge === 'number';
          const isHold = badge === 'H';
          const isDirect = !topVal || topVal === 'D→';
          if (isApproach) {
            const field = topVal && topVal !== 'D→' ? topVal : botVal;
            if (!field) continue;
            const eteMins = Math.round(parseFloat(inputValues[`r${top}c4`] || '') || 0);
            routeParts.push(`DCT  ${field}/D00+${mm(eteMins)}`);
          } else {
            if (!botVal) continue;
            // Skip last waypoint if it matches the destination
            if (pairIdx === lastNonAprIdx && botVal.toUpperCase() === ifrDest) continue;
            const holdSuffix = isHold ? `/D00+${mm(parseFloat(params.holdTime) || 0)}` : '';
            routeParts.push(isDirect ? `DCT  ${botVal}${holdSuffix}` : `${topVal}  ${botVal}${holdSuffix}`);
          }
        }
      }
      routeParts.push('DCT');
      // Split route across two PDF lines; line 1 holds ~66 chars based on field width
      const LINE1_LIMIT = 66;
      const line1Parts = [], line2Parts = [];
      let line1Len = 0;
      for (const part of routeParts) {
        const addLen = (line1Parts.length > 0 ? 2 : 0) + part.length;
        if (line2Parts.length === 0 && line1Len + addLen <= LINE1_LIMIT) {
          line1Parts.push(part);
          line1Len += addLen;
        } else {
          line2Parts.push(part);
        }
      }
      const routeLine1 = line1Parts.join('  ');
      const routeLine2 = line2Parts.join('  ');

      // Other information string (Block 18)
      const now = new Date();
      const dof = String(now.getFullYear()).slice(2)
        + String(now.getMonth() + 1).padStart(2, '0')
        + String(now.getDate()).padStart(2, '0');
      const sep = '   '; // triple space
      const dleEntries = [];
      const apEntries = [];
      for (let pairIdx = 0; pairIdx < mainRowCount; pairIdx++) {
        const top = pairIdx * 2;
        const cellId = `r${top}c0`;
        const badge = routeBadges[cellId];
        const topVal = (inputValues[`${cellId}_a`] || '').trim();
        const botVal = (inputValues[`${cellId}_b`] || '').trim();
        if (badge === 'H' && botVal) {
          const hMins = Math.round(parseFloat(params.holdTime) || 0);
          dleEntries.push(`DLE/${botVal}${toHHMM(hMins)}`);
        } else if (typeof badge === 'number' && badge > 0) {
          const field = topVal && topVal !== 'D→' ? topVal : botVal;
          if (field) apEntries.push(`${badge > 1 ? 'MULTIPLE APP' : 'APP'} ${field}`);
        }
      }
      const otherParts = ['PBN/B2C2D2S1', 'SUR/260B', `DOF/${dof}`, ...dleEntries, 'REG/166000', 'OPR/DOD'];
      if (apEntries.length > 0) otherParts.push(`RMK/REQUEST ${apEntries.join(' ')}`);
      const OTHER_LIMIT = 110;
      const other1Parts = [], other2Parts = [];
      let other1Len = 0;
      for (const part of otherParts) {
        const addLen = (other1Parts.length > 0 ? 3 : 0) + part.length;
        if (other2Parts.length === 0 && other1Len + addLen <= OTHER_LIMIT) {
          other1Parts.push(part);
          other1Len += addLen;
        } else {
          other2Parts.push(part);
        }
      }
      const otherLine1 = other1Parts.join(sep);
      const otherLine2 = other2Parts.join(sep);

      // ── Fill fields ─────────────────────────────────────────────────
      // Positions derived from raw PDF rect analysis (y = distance from bottom of page)

      // 8 Flight rules (I = IFR, V = VFR) — block 8, first cell of second char group at y≈671
      fillChars(610, 640, 405, 415, vfrMode ? 'V' : 'I');

      // 15a Speed
      fillChars(555, 578, 35, 110, speedStr);
      // 15b Level
      fillChars(555, 578, 135, 212, levelStr);
      // 13 Departure ICAO — logged so we can verify the match
      fillChars(580, 607, 35, 220, depAirport, 'DEP');
      // 16a Destination ICAO
      fillChars(416, 436, 92, 154, destAirport);
      // 16b Total EET
      fillChars(416, 436, 207, 269, eetStr);
      // 16c ALTN aerodrome
      fillChars(416, 436, 336, 399, altnAirport);
      // 15c Route line 1 (right of Level field)
      fillText(555, 578, 220, 600, routeLine1);
      // 15c Route line 2 (continuation line below)
      fillText(530, 553, 15, 600, routeLine2);
      // 18 Other information line 1
      fillText(387, 410, 35, 600, otherLine1);
      // 18 Other information line 2
      fillText(362, 385, 15, 600, otherLine2);
      // 19a Endurance
      fillText(212, 232, 62, 138, fuelStr);

      // ── Save and display ─────────────────────────────────────────────
      const filled = await pdfDoc.save();
      const blob = new Blob([filled], { type: 'application/pdf' });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Failed to generate flight plan:', err);
    }
  };

  const handleKeyNav = (e) => {
    const { key } = e;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
    if (e.target.tagName !== 'INPUT') return;
    e.preventDefault();

    const allInputs = Array.from(e.currentTarget.querySelectorAll('input'));
    const current = e.target;
    const cr = current.getBoundingClientRect();
    const cx = (cr.left + cr.right) / 2;
    const cy = (cr.top  + cr.bottom) / 2;

    let best = null;
    let bestScore = Infinity;

    for (const inp of allInputs) {
      if (inp === current) continue;
      const r = inp.getBoundingClientRect();
      const rx = (r.left + r.right) / 2;
      const ry = (r.top  + r.bottom) / 2;
      const dx = rx - cx;
      const dy = ry - cy;
      let score;
      if      (key === 'ArrowUp'    && dy < -2)  score = (-dy) + Math.abs(dx) * 3;
      else if (key === 'ArrowDown'  && dy >  2)  score =   dy  + Math.abs(dx) * 3;
      else if (key === 'ArrowLeft'  && dx < 0)   score = (-dx) + Math.abs(dy) * 10;
      else if (key === 'ArrowRight' && dx > 0)   score =   dx  + Math.abs(dy) * 10;
      else continue;
      if (score < bestScore) { bestScore = score; best = inp; }
    }

    if (best) { best.focus(); best.select(); }
  };

  return (
    <div className="jetlog-container" onKeyDown={handleKeyNav}>
      {pdfUrl ? (
        <>
          <div style={{fontSize: '0.68em', color: '#888', textAlign: 'center', marginBottom: '2px'}}>
            Route may be more verbose than necessary. Make route as concise as possible.
          </div>
          <div style={{textAlign: 'center', padding: '8px 0'}}>
            <button onClick={() => setPdfUrl(prev => { URL.revokeObjectURL(prev); return null; })}>← Return to Jet Log</button>
          </div>
          <iframe src={pdfUrl} style={{width: '100%', height: 'calc(100vh - 50px)', border: 'none', display: 'block'}} title="DD-1801 Flight Plan" />
        </>
      ) : (
      <>
      <div style={{fontSize: '0.68em', color: '#888', textAlign: 'center', marginBottom: '2px'}}>
        {vfrMode
          ? 'Input GS and Dist for each leg; check T&G/APR boxes as appropriate; and click Solve. Lbs/hr is auto calculated from GS for standard day sea level — if a different condition is desired, enter it manually. The "FP code" box should contain the radial-DME or lat/long definition of points as they will be written on the flight plan.'
          : 'Check that the Jet Log Parameters are set as you like. Input winds, ΔT, altitude, and OAT; MC and Dist for legs; mark approaches and holds as appropriate; and click solve. Input total distance into the DIST cell, the solver will split it into climb and cruise dist.'}
      </div>
      <div className="button-container" style={{justifyContent: 'center'}}>
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleRemoveRow}>Remove Row</button>
        <button onClick={() => setShowParams(true)}>Parameters</button>
        <button onClick={() => setShowPresets(s => !s)}>Preset Routes</button>
        <button onClick={generateFlightPlan}>Generate 1801 Flight Plan</button>
        <button
          onClick={() => { setVfrMode(m => { const next = !m; const newAlt = next ? 3000 : 1000; setSelectedAlt(newAlt); if (next) autoFillVFRCruise(clncFields.vfrGsCalc); return next; }); }}
          style={{fontWeight: 'bold', background: vfrMode ? '#1e40af' : undefined, color: vfrMode ? 'white' : undefined}}
        >{vfrMode ? 'VFR' : 'IFR'}</button>
      </div>

      <div className="jetlog-wrapper">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          <input type="text" value={depInput} onChange={e => { const v = e.target.value; setDepInput(v); const match = airports.find(ap => ap.airport.toUpperCase() === v.trim().toUpperCase()); if (match) selectAirport(match, 'dep'); }} style={{width: '70px', border: '1px solid #999', borderRadius: '3px', padding: '2px 4px', fontSize: '0.85em', backgroundColor: '#f4f4f4'}} />
          <span style={{fontSize: '1.1em'}}>→</span>
          <input type="text" value={destInput} onChange={e => { const v = e.target.value; setDestInput(v); const match = airports.find(ap => ap.airport.toUpperCase() === v.trim().toUpperCase()); if (match) selectAirport(match, 'dest'); }} style={{width: '70px', border: '1px solid #999', borderRadius: '3px', padding: '2px 4px', fontSize: '0.85em', backgroundColor: '#f4f4f4'}} />
        </div>
        <span style={{fontWeight: 'bold', fontSize: '0.85em'}}>FLIGHT LOG</span>
        <select value={selectedAlt} onChange={e => { const v = parseInt(e.target.value); setSelectedAlt(v); if (clncFields.deltaT) autoFillTTC(clncFields.deltaT, v, infoFields.depElev); if (clncFields.oat) autoFillCruise(clncFields.oat, v); if (vfrMode) autoFillVFRCruise(clncFields.vfrGsCalc); }} style={{fontSize: '0.8em', padding: '2px 4px', border: '1px solid #999', borderRadius: '3px', backgroundColor: '#f4f4f4'}}>
          {vfrMode ? (
            Array.from({length: 6}, (_, i) => 2000 + i * 500).map(alt => (
              <option key={alt} value={alt}>{alt.toLocaleString()}' AGL</option>
            ))
          ) : (
            <>
              {Array.from({length: 17}, (_, i) => (i + 1) * 1000).map(alt => (
                <option key={alt} value={alt}>{alt.toLocaleString()}' MSL</option>
              ))}
              {Array.from({length: 14}, (_, i) => 180 + i * 10).map(fl => (
                <option key={fl} value={fl * 100}>FL{fl}</option>
              ))}
            </>
          )}
        </select>
      </div>
      <table className="jetlog-info-table">
        <tbody>
          <tr>
            <td style={{position: 'relative'}}>
              <span className="info-label">DEP ELEV</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="text" value={infoFields.depElev} onChange={e => { const v = e.target.value; const match = airports.find(ap => ap.airport.toUpperCase() === v.trim().toUpperCase()); if (match) { selectAirport(match, 'dep'); } else { setInfoField('depElev', v); if (clncFields.deltaT) autoFillTTC(clncFields.deltaT, selectedAlt, v); if (vfrMode) autoFillVFRCruise(clncFields.vfrGsCalc); } }} style={{flex: 1}} />
                <span onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === 'dep' ? null : 'dep'); }} style={{cursor: 'pointer', padding: '0 2px', userSelect: 'none'}}>▾</span>
              </div>
              {renderAirportDropdown('dep')}
            </td>
            {renderFreqCell('clncDel', 'CLNC DEL')}
            {renderFreqCell('gndCont', 'GND CONT')}
            {renderFreqCell('tower', 'TOWER')}
          </tr>
          {vfrMode ? (
            <tr>
              <td style={{verticalAlign: 'top'}}>
                <span className="info-label">ATIS</span>
                {renderFreqInput(clncFields.vfrAtis || '', e => setClncFields(prev => ({...prev, vfrAtis: e.target.value})))}
              </td>
              <td style={{verticalAlign: 'top'}}><span className="info-label">WIND AT ALT</span><input type="text" value={clncFields.vfrWindAtAlt} onChange={e => setClncFields(prev => ({...prev, vfrWindAtAlt: e.target.value}))} /></td>
              <td style={{verticalAlign: 'top'}}>
                <span className="info-label">TAS</span>
                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px', marginTop: '2px'}}>
                  <span className="info-label" style={{whiteSpace: 'nowrap'}}>GS:</span>
                  <input type="text" style={{width: '42px'}} value={clncFields.vfrGsCalc} onChange={e => { const v = e.target.value; setClncFields(prev => ({...prev, vfrGsCalc: v})); autoFillVFRCruise(v); }} />
                </div>
              </td>
              <td style={{verticalAlign: 'top'}}>
                <span className="info-label">LBS PH</span>
                <input type="text" value={clncFields.vfrLbsPh} onChange={e => setClncFields(prev => ({...prev, vfrLbsPh: e.target.value}))} />
              </td>
            </tr>
          ) : (
            <tr>
              <td style={{verticalAlign: 'top'}}><span className="info-label">ALT CORR</span><input type="text" /></td>
              <td style={{verticalAlign: 'top'}}><span className="info-label">TIME OFF</span><input type="text" /></td>
              <td style={{verticalAlign: 'top'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <span className="info-label">TAS</span>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Climb:</span><input type="text" style={{width: '40px'}} value={clncFields.tasClimb} onChange={e => setClncFields(prev => ({...prev, tasClimb: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Cruise:</span><input type="text" style={{width: '40px'}} value={clncFields.tasCruise} onChange={e => setClncFields(prev => ({...prev, tasCruise: e.target.value}))} /></div>
                  </div>
                </div>
              </td>
              <td style={{verticalAlign: 'top'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <span className="info-label">LBS PH</span>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Climb:</span><input type="text" style={{width: '40px'}} value={clncFields.lbsPhClimb} onChange={e => setClncFields(prev => ({...prev, lbsPhClimb: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Cruise:</span><input type="text" style={{width: '40px'}} value={clncFields.lbsPhCruise} onChange={e => setClncFields(prev => ({...prev, lbsPhCruise: e.target.value}))} /></div>
                  </div>
                </div>
              </td>
            </tr>
          )}
          {vfrMode ? (
            <tr>
              <td colSpan={4} style={{height: '48px', verticalAlign: 'top'}}>
                <span className="info-label">CLEARANCE</span>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', padding: '2px', height: 'calc(100% - 14px)'}}>
                  {['1a','1b','2a','2b','3a','3b','4a','4b'].map(k => (
                    <input key={k} type="text" value={clncFields[`vfrClnc${k}`] || ''} onChange={e => setClncFields(prev => ({...prev, [`vfrClnc${k}`]: e.target.value}))} />
                  ))}
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4} style={{height: '48px', verticalAlign: 'top'}}>
                <div style={{display: 'flex', gap: '4px', marginTop: '2px', alignItems: 'stretch'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>
                    <span className="info-label">CLEARANCE</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>TTC:</span><input type="text" style={{width: '40px'}} value={clncFields.ttc} onChange={e => setClncFields(prev => ({...prev, ttc: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Fuel:</span><input type="text" style={{width: '40px'}} value={clncFields.fuel} onChange={e => setClncFields(prev => ({...prev, fuel: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Dist:</span><input type="text" style={{width: '40px'}} value={clncFields.dist} onChange={e => setClncFields(prev => ({...prev, dist: e.target.value}))} /></div>
                  </div>
                  <div style={{flex: 1, alignSelf: 'stretch'}} />
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', paddingBottom: '45px', paddingRight: '60px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>IAS:</span><input type="text" style={{width: '36px'}} value={clncFields.ias} onChange={e => setClncFields(prev => ({...prev, ias: e.target.value}))} /></div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1px', paddingTop: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Climb:</span><input type="text" placeholder="DIR" style={{width: '28px', backgroundColor: !clncFields.climbDir ? '#dbeafe' : ''}} value={clncFields.climbDir} onChange={e => setClncFields(prev => ({...prev, climbDir: e.target.value}))} /><input type="text" placeholder="VEL" style={{width: '28px', backgroundColor: !clncFields.climbVel ? '#dbeafe' : ''}} value={clncFields.climbVel} onChange={e => setClncFields(prev => ({...prev, climbVel: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>Cruise:</span><input type="text" placeholder="DIR" style={{width: '28px', backgroundColor: !clncFields.cruiseDir ? '#dbeafe' : ''}} value={clncFields.cruiseDir} onChange={e => setClncFields(prev => ({...prev, cruiseDir: e.target.value}))} /><input type="text" placeholder="VEL" style={{width: '28px', backgroundColor: !clncFields.cruiseVel ? '#dbeafe' : ''}} value={clncFields.cruiseVel} onChange={e => setClncFields(prev => ({...prev, cruiseVel: e.target.value}))} /></div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap'}}>ΔT:</span><input type="text" style={{width: '28px', backgroundColor: !clncFields.deltaT ? '#dbeafe' : ''}} value={clncFields.deltaT} onChange={e => { const v = e.target.value; setClncFields(prev => ({...prev, deltaT: v})); if (v) autoFillTTC(v, selectedAlt, infoFields.depElev); }} /><span className="info-label" style={{display: 'inline', whiteSpace: 'nowrap', marginLeft: '4px'}}>OAT:</span><input type="text" style={{width: '28px', backgroundColor: !clncFields.oat ? '#dbeafe' : ''}} value={clncFields.oat} onChange={e => { const v = e.target.value; setClncFields(prev => ({...prev, oat: v})); if (v) autoFillCruise(v, selectedAlt); }} /></div>
                  </div>
                </div>
              </td>
            </tr>
          )}
          <tr>
            <td style={{position: 'relative'}}>
              <span className="info-label">DEST ELEV</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="text" value={infoFields.destElev} onChange={e => { const v = e.target.value; const match = airports.find(ap => ap.airport.toUpperCase() === v.trim().toUpperCase()); if (match) selectAirport(match, 'dest'); else setInfoField('destElev', v); }} style={{flex: 1}} />
                <span onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === 'dest' ? null : 'dest'); }} style={{cursor: 'pointer', padding: '0 2px', userSelect: 'none'}}>▾</span>
              </div>
              {renderAirportDropdown('dest')}
            </td>
            {renderFreqCell('destApcCont', 'APC CONT')}
            {renderFreqCell('destTower', 'TOWER')}
            {renderFreqCell('destGndCont', 'GND CONT')}
          </tr>
        </tbody>
      </table>

      <table className="jetlog-table">
        <colgroup>
          <col style={{width: '23%'}} />
          {vfrMode ? (
            <>
              {Array.from({length: 7}, (_, i) => <col key={i} style={{width: '8.5%'}} />)}
              <col style={{width: '8%'}} />
              <col style={{width: '8%'}} />
            </>
          ) : (
            Array.from({length: 8}, (_, i) => <col key={i} style={{width: '9.625%'}} />)
          )}
        </colgroup>
        <thead>
          <tr>
            <th rowSpan="2">ROUTE<br/>TO</th>
            <th>IDENT</th>
            <th rowSpan="2">CUS</th>
            <th rowSpan="2">DIST</th>
            <th rowSpan="2">ETE</th>
            <th>ETA</th>
            <th rowSpan="2">LEG<br/>FUEL</th>
            <th>EFR</th>
            {vfrMode ? (
              <th colSpan="2" rowSpan="2">
                NOTES
                {inputValues['r0c8'] && <div style={{fontSize: '0.75em', fontWeight: 'normal', textAlign: 'left', paddingLeft: '2px'}}>{Math.round(parseFloat(inputValues['r0c8']) + (parseFloat(params.sttoFuel) || 0))}</div>}
              </th>
            ) : (
              <th rowSpan="2">GS</th>
            )}
          </tr>
          <tr>
            <th>CHAN</th>
            <th>ATA</th>
            <th>AFR</th>
          </tr>
        </thead>
        <tbody>
          {/* Pair 0: STTO */}
          <tr>
            <td rowSpan={2} style={{fontSize: '1.5em', textAlign: 'center', padding: '1px 3px', border: '1px solid black'}}>STTO</td>
            {renderCell('r0c1')}
            {renderCell('r0c2', 2)}
            {renderCell('r0c3', 2)}
            {renderCell('r0c4', 2)}
            {renderCell('r0c5')}
            {renderCell('r0c6', 2)}
            {renderCell('r0c7')}
            {vfrMode ? renderVFRNotesCells(0) : renderCell('r0c8', 2)}
          </tr>
          <tr>
            {renderCell('r1c0')}
            {renderCell('r1c1')}
            {renderCell('r1c2')}
          </tr>

          {/* Dynamic main route rows (pairs 1+) */}
          {Array.from({length: mainRowCount - 1}, (_, idx) => renderMainRowPair(idx + 1))}

          {/* Main table Total row */}
          {renderTotalRow(
            mainTotalTop, mainTotalBot,
            mainDataRows.map(r => `r${r}c3`),
            mainDataRows.map(r => `r${r}c4`),
            mainDataRows.map(r => `r${r}c6`),
          )}
        </tbody>
      </table>

      <table className="jetlog-info-table">
        <colgroup>
          {Array.from({length: 40}).map((_, i) => <col key={i} style={{width: '2.5%'}} />)}
        </colgroup>
        <tbody>
          <tr>
            <td colSpan={10} style={{position: 'relative'}}>
              <span className="info-label">ALTERNATE</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="text" value={infoFields.alternate} onChange={e => { const v = e.target.value; const match = airports.find(ap => ap.airport.toUpperCase() === v.trim().toUpperCase()); if (match) selectAirport(match, 'alt'); else setInfoField('alternate', v); }} style={{flex: 1}} />
                <span onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === 'alt' ? null : 'alt'); }} style={{cursor: 'pointer', padding: '0 2px', userSelect: 'none'}}>▾</span>
              </div>
              {renderAirportDropdown('alt')}
            </td>
            <td colSpan={10}><span className="info-label">ROUTE</span><input type="text" value={inputValues['altroute'] || ''} onChange={e => handleInputChange('altroute', e.target.value)} /></td>
            <td colSpan={10}><span className="info-label">ALTITUDE</span><input type="text" placeholder="Hundreds of ft" value={inputValues['altalt'] || ''} onChange={e => handleInputChange('altalt', e.target.value)} /></td>
            <td colSpan={5}><span className="info-label">FUEL</span><div style={{textAlign: 'center', fontSize: '0.75em', paddingTop: '1px'}}>{fuelDisplay}</div></td>
            <td colSpan={5}><span className="info-label">TIME</span><div style={{textAlign: 'center', fontSize: '0.75em', paddingTop: '1px'}}>{timeDisplay}</div></td>
          </tr>
          <tr>
            <td colSpan={10}><span className="info-label">ALT ELEV</span><input type="text" value={infoFields.altElev} onChange={e => setInfoField('altElev', e.target.value)} /></td>
            {renderFreqCell('altApcCont', 'APC CONT', {colSpan: 10})}
            {renderFreqCell('altTower', 'TOWER', {colSpan: 10})}
            {renderFreqCell('altGndCont', 'GND CONT', {colSpan: 10})}
          </tr>
        </tbody>
      </table>

      <table className="jetlog-table">
        <colgroup>
          <col style={{width: '23%'}} />
          {vfrMode ? (
            <>
              {Array.from({length: 7}, (_, i) => <col key={i} style={{width: '8.5%'}} />)}
              <col style={{width: '8%'}} />
              <col style={{width: '8%'}} />
            </>
          ) : (
            Array.from({length: 8}, (_, i) => <col key={i} style={{width: '9.625%'}} />)
          )}
        </colgroup>
        <tbody>
          {/* Alternate route rows */}
          {ALT_ROWS.map(top => {
            const bot = top + 1;
            return (
              <React.Fragment key={top}>
                <tr>
                  {vfrMode ? renderVFRCheckCell(`r${top}c0`, vfrApr, setVfrApr, 'APR', '24px') : renderRouteToCell(`r${top}c0`)}
                  {renderCell(`r${top}c1`)}
                  {renderCell(`r${top}c2`, 2)}
                  {renderCell(`r${top}c3`, 2)}
                  {renderCell(`r${top}c4`, 2)}
                  {renderCell(`r${top}c5`)}
                  {renderCell(`r${top}c6`, 2)}
                  {renderCell(`r${top}c7`)}
                  {vfrMode ? renderVFRNotesCells(top) : renderCell(`r${top}c8`, 2)}
                </tr>
                <tr>
                  {renderCell(`r${bot}c0`)}
                  {renderCell(`r${bot}c1`)}
                  {renderCell(`r${bot}c2`)}
                </tr>
              </React.Fragment>
            );
          })}

          {/* Alternate table Total row */}
          {renderTotalRow(
            208, 209,
            ALT_ROWS.map(r => `r${r}c3`),
            ALT_ROWS.map(r => `r${r}c4`),
            ALT_ROWS.map(r => `r${r}c6`),
            true,
          )}
        </tbody>
      </table>

      <div style={{fontWeight: 'bold', textAlign: 'center', fontSize: '0.85em', marginTop: '6px', marginBottom: '1px', letterSpacing: '0.04em'}}>
        T-6B FUEL PLAN (Pounds of Fuel)
      </div>
      <table className="jetlog-table" style={{marginTop: '0'}}>
        <colgroup>
          <col style={{width: '40%'}} />
          <col style={{width: '10%'}} />
          <col style={{width: '40%'}} />
          <col style={{width: '10%'}} />
        </colgroup>
        <tbody>
          {(() => {
            const leftLabels  = ['1. CLIMB/ROUTE TO DEST', '2. ROUTE TO ALTERNATE', '3. APPROACHES', '4. TOTAL 1,2,3', '5. RESERVE 10% OF 4 (minimum 20 min @ max endurance 10,000 feet)'];
            const rightLabels = ['6. START/TAXI', '7. TOTAL REQUIRED (4,5,6)', '8. TOTAL FUEL ABOARD', '9. SPARE FUEL', null];
            return fuelPlan.map(([leftVal, rightVal], i) => (
              <tr key={i}>
                <td style={{padding: '1px 2px'}}>
                  <span className="info-label" style={{textAlign: 'left', display: 'block'}}>{leftLabels[i]}</span>
                </td>
                <td style={{padding: '1px 2px', textAlign: 'center', fontSize: '0.85em', verticalAlign: 'middle'}}>
                  {leftVal}
                </td>
                {rightVal !== null ? (
                  <React.Fragment>
                    <td style={{padding: '1px 2px'}}>
                      <span className="info-label" style={{textAlign: 'left', display: 'block'}}>{rightLabels[i]}</span>
                    </td>
                    <td style={{padding: '1px 2px', textAlign: 'center', fontSize: '0.85em', verticalAlign: 'middle'}}>
                      {rightVal}
                    </td>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <td style={{background: '#e8e8e8'}} />
                    <td style={{background: '#e8e8e8'}} />
                  </React.Fragment>
                )}
              </tr>
            ));
          })()}
        </tbody>
      </table>
      </div>

      {showParams && (
        <div
          style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={() => setShowParams(false)}
        >
          <div
            style={{background: 'white', borderRadius: '8px', padding: '24px 28px',
              minWidth: '300px', boxShadow: '0 6px 24px rgba(0,0,0,0.3)'}}
            onClick={e => e.stopPropagation()}
          >
            <div style={{fontWeight: 'bold', fontSize: '1em', marginBottom: '16px', textAlign: 'center', letterSpacing: '0.05em'}}>PARAMETERS</div>
            {[
              {label: 'Approach Time (min)', key: 'approachTime'},
              {label: 'Approach Fuel (lbs)', key: 'approachFuel'},
              {label: 'Start Fuel (lbs)',    key: 'startFuel'},
              {label: 'STTO Time (min)',     key: 'sttoTime'},
              {label: 'STTO Fuel (lbs)',     key: 'sttoFuel'},
              {label: 'Hold Time (min)',         key: 'holdTime', vfrHide: true},
              {label: 'STD Reserve Fuel (lbs)', key: 'stdReserve'},
              {label: 'T&G Time (min)',          key: 'tngTime'},
              {label: 'T&G Fuel (lbs)',          key: 'tngFuel'},
            ].filter(p => !vfrMode || !p.vfrHide).map(({label, key}) => (
              <div key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '16px'}}>
                <label style={{fontSize: '0.85em', whiteSpace: 'nowrap', color: '#333'}}>{label}</label>
                <input
                  type="text"
                  value={params[key]}
                  onChange={e => setParams(prev => ({...prev, [key]: e.target.value}))}
                  style={{width: '72px', textAlign: 'right', padding: '3px 5px'}}
                />
              </div>
            ))}
            <button
              onClick={() => setShowParams(false)}
              style={{marginTop: '12px', width: '100%'}}
            >Done</button>
          </div>
        </div>
      )}

      {showPresets && (
        <div
          style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={() => setShowPresets(false)}
        >
          <div
            style={{background: 'white', borderRadius: '8px', padding: '24px 28px',
              minWidth: '320px', maxHeight: '80vh', overflowY: 'auto',
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)', color: '#333'}}
            onClick={e => e.stopPropagation()}
          >
            <div style={{fontWeight: 'bold', fontSize: '1em', marginBottom: '14px', textAlign: 'center', letterSpacing: '0.05em'}}>PRESETS</div>

            {sharedPresets.length > 0 && (
              <>
                <div style={{fontSize: '0.7em', fontWeight: 'bold', color: '#888', marginBottom: '6px', letterSpacing: '0.05em'}}>SHARED</div>
                {sharedPresets.map(p => (
                  <div key={p.id}
                    style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', padding: '3px 0'}}
                    onClick={() => applyPreset(p)}
                  >
                    <span style={{fontSize: '0.65em', padding: '1px 5px', borderRadius: '3px',
                      background: p.mode === 'VFR' ? '#1e40af' : '#444', color: 'white', flexShrink: 0}}>
                      {p.mode}
                    </span>
                    <span style={{fontSize: '0.85em'}}>{p.name}</span>
                  </div>
                ))}
                <hr style={{margin: '10px 0', borderColor: '#e5e7eb'}} />
              </>
            )}

            <div style={{fontSize: '0.7em', fontWeight: 'bold', color: '#888', marginBottom: '6px', letterSpacing: '0.05em'}}>MY PRESETS</div>
            {localPresets.length === 0 && (
              <div style={{fontSize: '0.8em', color: '#aaa', marginBottom: '8px'}}>None saved yet.</div>
            )}
            {localPresets.map(p => (
              <div key={p.id} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', padding: '3px 0'}}>
                <span style={{fontSize: '0.65em', padding: '1px 5px', borderRadius: '3px',
                  background: p.mode === 'VFR' ? '#1e40af' : '#444', color: 'white', flexShrink: 0}}>
                  {p.mode}
                </span>
                <span style={{flex: 1, fontSize: '0.85em', cursor: 'pointer'}} onClick={() => applyPreset(p)}>{p.name}</span>
                <button
                  onClick={() => deleteLocalPreset(p.id)}
                  style={{fontSize: '0.7em', padding: '1px 5px', background: '#fee2e2',
                    border: '1px solid #fca5a5', borderRadius: '3px', cursor: 'pointer', flexShrink: 0}}
                >✕</button>
              </div>
            ))}

            <hr style={{margin: '12px 0', borderColor: '#e5e7eb'}} />
            <div style={{fontSize: '0.75em', color: '#666', marginBottom: '6px'}}>Save current flight plan as preset:</div>
            <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
              <input
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveLocalPreset(presetName); }}
                placeholder="Preset name…"
                style={{flex: 1, minWidth: '120px', padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: '4px'}}
              />
              <button onClick={() => saveLocalPreset(presetName)} style={{fontSize: '0.8em'}}>Save</button>
              {process.env.NODE_ENV === 'development' && (
                <button onClick={() => exportPresetFile(presetName)} style={{fontSize: '0.8em'}} title="Download JSON to add to shared library">Export ↓</button>
              )}
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default TW4JetLog;
