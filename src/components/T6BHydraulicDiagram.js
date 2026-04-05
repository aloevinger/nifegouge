import { useState, useRef, useEffect } from 'react';

// ── Keyframe animations injected once into the document ──────────────
const KEYFRAMES = `
  @keyframes hydFlowS { to { stroke-dashoffset: -24; } }
  @keyframes hydFlowE { to { stroke-dashoffset: -18; } }
  @keyframes hydFlowR { to { stroke-dashoffset: -20; } }
  @keyframes hydBlink  { 0%,100%{opacity:1} 50%{opacity:.18} }
  @keyframes fuseBlowFlash { 0%{opacity:0} 15%{opacity:1} 35%{opacity:0.1} 55%{opacity:1} 75%{opacity:0.1} 90%{opacity:1} 100%{opacity:1} }
`;

// ── Color constants ──────────────────────────────────────────────────
const C = {
  supply:   '#378ADD',
  emerg:    '#EF9F27',
  ret:      '#888780',
  bg:       '#080f18',
  box:      'rgba(12,22,36,0.95)',
  stroke:   '#2e3e52',
  text:     '#c8d8e8',
  muted:    '#6a8a9a',
  caution:  '#FAC775',
  advisory: 'rgba(80,130,40,0.22)',
};

// ── Text style presets (SVG) ─────────────────────────────────────────
const FONT = "'Courier New', monospace";
const T = {
  h: { fontFamily: FONT, fill: C.text,  fontSize: 10, fontWeight: 700, textAnchor: 'middle', dominantBaseline: 'central' },
  s: { fontFamily: FONT, fill: C.muted, fontSize: 9,  textAnchor: 'middle', dominantBaseline: 'central' },
  t: { fontFamily: FONT, fill: C.muted, fontSize: 8,  textAnchor: 'middle', dominantBaseline: 'central' },
  caution:  { fontFamily: FONT, fill: '#4a2a08', fontSize: 8.5, fontWeight: 700, textAnchor: 'middle', dominantBaseline: 'central' },
  advisory: { fontFamily: FONT, fill: '#1a3a08', fontSize: 8.5, fontWeight: 700, textAnchor: 'middle', dominantBaseline: 'central' },
};

// ── Animated flow path ───────────────────────────────────────────────
// v: 'supply' | 'emerg' | 'ret'
// paused: pauses supply & return when HYD FL LO is active
function F({ d, v = 'supply', paused = false, emergPaused = false }) {
  const cfg = {
    supply: {
      pipeColor: '#C34937',
      fluidColor: C.supply,
      pipeWidth: 4,
      fluidWidth: 2,
      strokeDasharray: '8 4',
      animation: 'hydFlowS 1s linear infinite'
    },
    emerg:  {
      pipeColor: '#F8F36D',
      fluidColor: C.emerg,
      pipeWidth: 4,
      fluidWidth: 2,
      strokeDasharray: '6 4',
      animation: 'hydFlowE 1.2s linear infinite'
    },
    ret:    {
      pipeColor: '#62A061',
      fluidColor: C.ret,
      pipeWidth: 4,
      fluidWidth: 1.5,
      strokeDasharray: '5 5',
      animation: 'hydFlowR 1.6s linear infinite'
    },
    sel:    {
      pipeColor: '#592976',
      fluidColor: C.ret,
      pipeWidth: 4,
      fluidWidth: 2,
      strokeDasharray: '8 4',
      animation: 'hydFlowR 1.2s linear infinite'
    },
    elec:    {
      fluidColor: C.text,
      fluidWidth: 2,
      strokeDasharray: '8 4',
    },
    man:    {
      fluidColor: C.text,
      fluidWidth: 2,
      strokeDasharray: '5 5',
    },
  };
  const c = cfg[v];
  const fluidStyle = {
    stroke: c.fluidColor,
    strokeWidth: c.fluidWidth,
    strokeDasharray: c.strokeDasharray,
    animation: c.animation,
    fill: 'none'
  };
  if (paused && v !== 'emerg') {
    fluidStyle.animationPlayState = 'paused';
    fluidStyle.opacity = 0.3;
  }
  if (emergPaused && v === 'emerg') {
    fluidStyle.animationPlayState = 'paused';
    fluidStyle.opacity = 0.3;
  }

  return (
    <g>
      {/* Solid pipe line */}
      <path d={d} stroke={c.pipeColor} strokeWidth={c.pipeWidth} fill="none"
        opacity={(paused && v !== 'emerg') || (emergPaused && v === 'emerg') ? 0.3 : 0.6} />
      {/* Animated fluid line */}
      <path d={d} style={fluidStyle} />
    </g>
  );
}

// ── Clickable component box ──────────────────────────────────────────
function Box({ x, y, w, h, rx = 4, id, sel, onSel, hi = C.supply, children }) {
  const active = sel === id;
  return (
    <g style={{ cursor: id ? 'pointer' : 'default' }}
       onClick={id ? () => onSel(id) : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={active ? `${hi}18` : C.box}
        stroke={active ? hi : C.stroke}
        strokeWidth={active ? 0.8 : 0.5} />
      {children}
    </g>
  );
}

// ── Info panel content ───────────────────────────────────────────────
const INFO = {
  reservoir: {
    title: 'Hydraulic Reservoir',
    items: [
      'System capacity: 5 quarts total',
      'Pressurized by engine bleed air — ≤50 psi',
      'HYD FL LO caution when quantity drops below 1 quart',
      'All subsystem return lines feed back to reservoir',
    ],
  },
  edp: {
    title: 'Engine Driven Pump (EDP)',
    items: [
      'Single pump, engine driven — no electric backup',
      'Normal output: 3000 ±120 psi',
      'Downstream check valve prevents backflow into engine',
      'Pressure monitored by transmitter → EICAS',
    ],
  },
  fwsov: {
    title: 'Firewall Shutoff Valve (FW SOV)',
    items: [
      'Closes when FIRE T-handle is pulled',
      'Isolates engine-side hydraulics from airframe plumbing',
      'Cable-actuated — no electrical dependency',
      'Located at the firewall',
    ],
  },
  filter: {
    title: 'Hydraulic Filter',
    items: [
      'Filters contaminants from pressurized supply line',
      'Located on airframe (cockpit) side of firewall',
    ],
  },
  slide: {
    title: 'Slide Valve Assembly',
    items: [
      'Regulates and controls system pressure',
      'Routes pressurized fluid to selector manifold',
      'Unloads system when no demand exists',
    ],
  },
  accum: {
    title: 'Emergency Accumulator',
    items: [
      'Helium precharge provides stored hydraulic pressure',
      'EHYD PX LO caution if pressure drops below 2400 ±150 psi',
      'Independent of engine — operates after flameout',
      'Feeds Emergency Selector Manifold for gear and flap extension',
    ],
  },
  nws: {
    title: 'Nose Wheel Steering (NWS)',
    items: [
      'Powered by main hydraulic system ONLY — no emergency backup',
      'NWS ON advisory (green) illuminates when armed',
      '±12° nose wheel centering authority',
      'NWS Selector Valve in Selector Manifold',
    ],
  },
  gear: {
    title: 'Landing Gear',
    items: [
      'Three actuators: LH Main, Nose Gear, RH Main',
      'Normal extend/retract cycle approximately 6 seconds',
      'Emergency extension via accumulator → LDG GR EMER EXT SEL VLV',
      'Separate gear and door selector valves in manifold',
    ],
  },
  flaps: {
    title: 'Flaps',
    items: [
      'TO (takeoff) detent: 23° deflection',
      'LDG (landing) detent: 50° deflection',
      'Separate TO and LDG selector valves in manifold',
      'Emergency extension via accumulator → FLAP EMER EXT SOLENOID',
    ],
  },
  spdbrk: {
    title: 'Speed Brake',
    items: [
      'SPDBRK OUT advisory (green) when deployed',
      'Spring-return actuator — main system powered',
      'NO emergency backup',
      'S.B. Selector Valve in Selector Manifold',
    ],
  },
};

// ── HYD PRESS EICAS Gauge ────────────────────────────────────────────
// pressure: PSI value (0–4100). Hand and readout update automatically.
function HydPressGauge({ pressure = 3040, size = 160, embedded = false }) {
  const MAX = 4100;
  const START_ANG = 230; // degrees from top, clockwise → 7 o'clock = 0 PSI
  const SWEEP     = 225; // total sweep → 4 o'clock = MAX PSI

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.43;
  const arcW   = size * 0.045; // skinny arc band
  const innerR = outerR - arcW;

  function polar(angleDeg, r) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function psiToAngle(psi) {
    return START_ANG + (Math.max(0, Math.min(psi, MAX)) / MAX) * SWEEP;
  }

  function arcBand(psiStart, psiEnd, fill) {
    const a1 = psiToAngle(psiStart);
    const a2 = psiToAngle(psiEnd);
    const [x1, y1] = polar(a1, outerR);
    const [x2, y2] = polar(a2, outerR);
    const [x3, y3] = polar(a2, innerR);
    const [x4, y4] = polar(a1, innerR);
    const laf = (a2 - a1) > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 ${laf} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${laf} 0 ${x4} ${y4} Z`}
        fill={fill}
      />
    );
  }

  function needleCol(psi) {
    if (psi < 1800 || psi >= 3500)  return '#DDDB55'; // amber
    if (psi >= 2880 && psi < 3120)  return '#4a9030'; // green
    return '#d8d8d8';                                   // white
  }

  function numberCol(psi) {
    if (psi < 1800 || psi >= 3500) return '#DDDB55'; // amber
    return '#d8d8d8';                                  // white (never green)
  }

  const needleAngle = psiToAngle(pressure);
  const [nx,  ny]  = polar(needleAngle,      outerR * 0.84); // tip
  const [b1x, b1y] = polar(needleAngle + 90, size * 0.028);  // base left
  const [b2x, b2y] = polar(needleAngle - 90, size * 0.028);  // base right

  const majorTicks = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000];

  const content = (
    <>
      {/* Bezel / background */}
      <circle cx={cx} cy={cy} r={outerR + 5} fill="#0a0a0a" stroke="#1e2e3e" strokeWidth={1.5} />
      {arcBand(0, 1800, '#DDDB55')}
      {arcBand(1800, 2880, '#d8d8d8')}
      {arcBand(2880, 3120, '#4a9030')}
      {arcBand(3120, 3500, '#d8d8d8')}
      {arcBand(3500, 4100, '#DDDB55')}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="#080f18" />
      {majorTicks.map(psi => {
        const ang = psiToAngle(psi);
        const [ox, oy] = polar(ang, innerR - 1);
        const [ix, iy] = polar(ang, innerR - size * 0.04);
        return <line key={psi} x1={ox} y1={oy} x2={ix} y2={iy} stroke="white" strokeWidth={1.2} />;
      })}
      {[1200, 2400, 3600].map(psi => {
        const ang = psiToAngle(psi);
        const [lx, ly] = polar(ang, innerR - size * 0.13);
        return (
          <text key={psi} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fill="#c8d8e8" fontSize={size * 0.082} fontFamily={FONT}>
            {psi}
          </text>
        );
      })}
      <polygon points={`${nx},${ny} ${b1x},${b1y} ${b2x},${b2y}`} fill={needleCol(pressure)} />
      <circle cx={cx} cy={cy} r={size * 0.028} fill="#8a9aaa" />
      <text x={cx} y={cy + size * 0.15} textAnchor="middle" dominantBaseline="central"
        fill={numberCol(pressure)} fontSize={size * 0.18} fontFamily={FONT} fontWeight="bold">
        {pressure}
      </text>
      <text x={cx} y={cy + size * 0.28} textAnchor="middle" dominantBaseline="central"
        fill="#6a8a9a" fontSize={size * 0.07} fontFamily={FONT}>PSI</text>
      <text x={cx} y={cy + size * 0.35} textAnchor="middle" dominantBaseline="central"
        fill="#6a8a9a" fontSize={size * 0.068} fontFamily={FONT}>HYD PRESS</text>
    </>
  );

  if (embedded) return content;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {content}
    </svg>
  );
}

// ── Main component — drop this into any tab ──────────────────────────
export default function T6BHydraulicDiagram() {
  const [sel,      setSel]      = useState(null);
  const [hydFlo,   setHydFlo]   = useState(false);   // HYD FL LO fault
  const [ehydPx,   setEhydPx]   = useState(false);   // EHYD PX LO fault
  const [hydPsi,   setHydPsi]   = useState(3040);    // HYD PRESS gauge value
  const [gearPhase, setGearPhase] = useState('up');  // landing gear state machine
  const gearTimers    = useRef([]);
  const [flapPos,   setFlapPos]   = useState('UP');  // actual flap position — dial + accumulator
  const [selectorPos, setSelectorPos] = useState('UP'); // lever visual only
  const [nwsOn,     setNwsOn]     = useState(false); // nose wheel steering
  const [largeEhydSim, setLargeEhydSim] = useState(false);
  const [fuseBlown,    setFuseBlown]    = useState(false);
  const svgRef        = useRef(null);
  const flapDragging  = useRef(false);

  // ── Flap drag constants ──────────────────────────────────────────────
  const FLAP_SNAP_Y = { UP: 663, TO: 682, LDG: 701 };

  const clientToSvgY = (clientY) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    return (clientY - rect.top) * (820 / rect.height);
  };

  const handleFlapMouseDown = (e) => {
    e.preventDefault();
    flapDragging.current = true;
  };

  const handleFlapMouseMove = (e) => {
    if (!flapDragging.current) return;
    const svgY = clientToSvgY(e.clientY);
    const nearest = Object.entries(FLAP_SNAP_Y).reduce((best, [pos, y]) =>
      Math.abs(y - svgY) < Math.abs(FLAP_SNAP_Y[best] - svgY) ? pos : best, 'UP');
    setFlapPos(nearest);
  };

  // ── Speed brake drag ────────────────────────────────────────────────
  const sbDragging      = useRef(false);
  const sbOffsetRef     = useRef(0);
  const [sbOffset,    setSbOffset]    = useState(0);
  const [sbDeployed,  setSbDeployed]  = useState(false);
  const SB_CX = 50, SB_RANGE = 18, SB_THRESH = 8;

  const handleSbMouseDown = (e) => { if (emerGrPulled) return; e.preventDefault(); sbDragging.current = true; };

  // ── PSI slider drag ───────────────────────────────────────────────────
  const psiSliderDragging = useRef(false);

  // ── Reservoir fluid divider drag ─────────────────────────────────────
  const [resDivPct, setResDivPct] = useState(50);
  const resDivDragging = useRef(false);

  // ── Accumulator fluid level drag ─────────────────────────────────────
  const [accumLvlPct, setAccumLvlPct] = useState(80);
  const accumDragging = useRef(false);

  // ── EMER LDG GR handle pulled ─────────────────────────────────────────
  const [emerGrPulled, setEmerGrPulled] = useState(false);
  const emerAnimRef = useRef(null);

  useEffect(() => {
    if (!emerGrPulled) return;
    const startVal = accumLvlPct;
    const target = 40;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setAccumLvlPct(startVal + (target - startVal) * ease);
      if (t < 1) emerAnimRef.current = requestAnimationFrame(animate);
    };
    emerAnimRef.current = requestAnimationFrame(animate);
    return () => { if (emerAnimRef.current) cancelAnimationFrame(emerAnimRef.current); };
  }, [emerGrPulled]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Normal-operation background loop ─────────────────────────────────
  // • Accumulator refills to 85%
  // • While accumulator is filling, reservoir slowly drains left
  // • Reservoir auto-fills to 35% floor in normal op
  // • HYD pressure drifts back toward green band (3000 PSI)
  useEffect(() => {
    if (emerGrPulled || largeEhydSim || ehydPx || hydFlo) return;
    const ACCUM_RATE    = 85 / 14000;  // units/ms — refill in ~14 s
    const RES_DRAIN     = 1.5;         // units/sec — drains while accum filling
    const RES_FILL      = 8.0;         // units/sec — fills back to 35% floor
    const PSI_RATE      = 150;         // PSI/sec drift toward 3000
    let accumTracked    = null;
    let lastTime        = null;
    let rafId;
    const tick = (now) => {
      if (lastTime !== null) {
        const deltaMs  = now - lastTime;
        const deltaSec = deltaMs / 1000;
        const wasFillingAccum = accumTracked !== null && accumTracked < 85;
        // Accumulator refill
        setAccumLvlPct(prev => {
          const next = prev >= 85 ? prev : Math.min(85, prev + ACCUM_RATE * deltaMs);
          accumTracked = next;
          return next;
        });
        // Reservoir: drain while accum fills (never below 35), auto-fill if below 35
        setResDivPct(prev => {
          if (wasFillingAccum && prev > 35) return Math.max(35, prev - RES_DRAIN * deltaSec);
          if (prev < 35)                    return Math.min(35, prev + RES_FILL  * deltaSec);
          return prev;
        });
        // HYD pressure drift toward green band — suspended while user drags slider
        if (!psiSliderDragging.current) {
          setHydPsi(prev => {
            if (prev >= 2880 && prev <= 3120) return prev;
            const dir = prev < 3000 ? 1 : -1;
            const next = prev + dir * PSI_RATE * deltaSec;
            if (dir > 0 && next >= 2880) return 2880;
            if (dir < 0 && next <= 3120) return 3120;
            return Math.round(next);
          });
        }
      }
      lastTime = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [emerGrPulled, largeEhydSim, ehydPx, hydFlo]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hydraulic dump — animate accumulator to 15% ──────────────────────
  const hydDumpAnimRef = useRef(null);
  const handleHydDump = () => {
    if (hydDumpAnimRef.current) cancelAnimationFrame(hydDumpAnimRef.current);
    const target   = 15;
    const startTime = performance.now();
    const startVal  = accumLvlPct;
    const duration  = 2500;
    const RES_RATE  = 3; // same rate reservoir moves left while filling
    let lastFrameTime = startTime;
    const animate = (now) => {
      const frameDelta = (now - lastFrameTime) / 1000;
      lastFrameTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setAccumLvlPct(startVal + (target - startVal) * ease);
      setResDivPct(prev => Math.min(100, prev + RES_RATE * frameDelta));
      if (t < 1) hydDumpAnimRef.current = requestAnimationFrame(animate);
    };
    hydDumpAnimRef.current = requestAnimationFrame(animate);
  };

  // ── Large EHYD leak animation ─────────────────────────────────────────
  useEffect(() => {
    if (!largeEhydSim) { setFuseBlown(false); return; }
    const ACCUM_RATE  = 5.5;   // units drained per second
    const RES_RATE    = 2.8;   // reservoir divider moves left per second (pre-fuse)
    const FUSE_AT_MS  = 4000;
    let fuseTriggered = false;
    let lastTime = null;
    let rafId;
    const startTime = performance.now();
    const tick = (now) => {
      if (lastTime === null) lastTime = now;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const elapsed = now - startTime;
      // Blow fuse at 4 seconds
      if (elapsed >= FUSE_AT_MS && !fuseTriggered) {
        fuseTriggered = true;
        setFuseBlown(true);
      }
      // Drain accumulator always
      setAccumLvlPct(prev => Math.max(0, prev - ACCUM_RATE * delta));
      // Move reservoir left only before fuse blows
      if (!fuseTriggered) {
        setResDivPct(prev => Math.max(0, prev - RES_RATE * delta));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); setFuseBlown(false); };
  }, [largeEhydSim]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Small EHYD leak — cascade: reservoir → HYD press → accumulator ────
  useEffect(() => {
    if (!ehydPx) return;
    const RES_RATE   = 1.5;  // units/sec — slow reservoir drain
    const PSI_RATE   = 280;  // PSI/sec — drains once reservoir hits 0
    const ACCUM_RATE = 3.0;  // units/sec — drains once PSI < 1800
    let resCur = 100, psiCur = 3040;
    let lastTime = null;
    let rafId;
    const tick = (now) => {
      if (lastTime === null) { lastTime = now; rafId = requestAnimationFrame(tick); return; }
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Phase 1: drain reservoir
      setResDivPct(prev => { resCur = prev; return Math.max(0, prev - RES_RATE * delta); });
      // Phase 2: once reservoir empty, drain HYD pressure
      if (resCur <= 0) {
        setHydPsi(prev => { psiCur = prev; return Math.max(0, prev - PSI_RATE * delta); });
      } else {
        setHydPsi(prev => { psiCur = prev; return prev; });
      }
      // Phase 3: once PSI < 1800, drain accumulator
      if (psiCur < 1800) {
        setAccumLvlPct(prev => Math.max(0, prev - ACCUM_RATE * delta));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ehydPx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main HYD leak — same cascade as small EHYD but accumulator never moves
  useEffect(() => {
    if (!hydFlo) return;
    const RES_RATE = 1.5;
    const PSI_RATE = 280;
    let resCur = 100, psiCur = 3040;
    let lastTime = null;
    let rafId;
    const tick = (now) => {
      if (lastTime === null) { lastTime = now; rafId = requestAnimationFrame(tick); return; }
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setResDivPct(prev => { resCur = prev; return Math.max(0, prev - RES_RATE * delta); });
      if (resCur <= 0) {
        setHydPsi(prev => { psiCur = prev; return Math.max(0, prev - PSI_RATE * delta); });
      } else {
        setHydPsi(prev => { psiCur = prev; return prev; });
      }
      // Accumulator intentionally untouched
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hydFlo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync flap indicator to selector when handle is released
  useEffect(() => {
    if (!emerGrPulled) setFlapPos(selectorPos);
  }, [emerGrPulled]); // eslint-disable-line react-hooks/exhaustive-deps

  const FLAP_ORDER = { UP: 0, TO: 1, LDG: 2 };

  // Selector always moves freely.
  // When handle pulled, actual flap position (dial + accumulator) only ratchets toward LDG.
  const setFlapSafe = (pos) => {
    setSelectorPos(pos);
    if (emerGrPulled && FLAP_ORDER[pos] <= FLAP_ORDER[flapPos]) return;
    setFlapPos(pos);
    if (pos === 'TO' || pos === 'LDG') setSbDeployed(false);
  };

  // ── Accumulator drain when emer handle pulled and flaps move ─────────
  useEffect(() => {
    if (!emerGrPulled) return;
    const target = flapPos === 'LDG' ? 15 : flapPos === 'TO' ? 25 : null;
    if (target === null) return;
    const startVal = accumLvlPct;
    const duration = 1200;
    const startTime = performance.now();
    let rafId;
    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setAccumLvlPct(startVal + (target - startVal) * ease);
      if (t < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [flapPos, emerGrPulled]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Combined SVG mouse handlers ──────────────────────────────────────
  const handleSvgMouseMove = (e) => {
    // flap drag
    if (flapDragging.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgY = (e.clientY - rect.top) * (820 / rect.height);
      const nearest = Object.entries(FLAP_SNAP_Y).reduce((best, [pos, y]) =>
        Math.abs(y - svgY) < Math.abs(FLAP_SNAP_Y[best] - svgY) ? pos : best, 'UP');
      setFlapSafe(nearest);
    }
    // speed brake drag — always moves visually, state change gated below
    if (sbDragging.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = (e.clientX - rect.left) * (680 / rect.width);
      const offset = Math.max(-SB_RANGE, Math.min(SB_RANGE, svgX - SB_CX));
      sbOffsetRef.current = offset;
      setSbOffset(offset);
    }
    // reservoir divider drag
    if (resDivDragging.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = (e.clientX - rect.left) * (680 / rect.width);
      const pct = Math.max(0, Math.min(85, ((svgX - 238) / 100) * 100));
      setResDivPct(pct);
    }
    // psi slider drag
    if (psiSliderDragging.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = (e.clientX - rect.left) * (680 / rect.width);
      const psi = Math.round(Math.max(0, Math.min(4100, ((svgX - 514) / 154) * 4100)) / 10) * 10;
      setHydPsi(psi);
    }
    // accumulator level drag
    if (accumDragging.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgY = (e.clientY - rect.top) * (820 / rect.height);
      const pct = Math.max(0, Math.min(85, ((260 + 60 - svgY) / 60) * 100));
      setAccumLvlPct(pct);
    }
  };

  const handleSvgMouseUp = () => {
    flapDragging.current = false;
    if (sbDragging.current) {
      if (flapPos === 'UP') {  // only change state when flaps are UP
        const off = sbOffsetRef.current;
        if (off > SB_THRESH)       setSbDeployed(false); // dragged right → IN
        else if (off < -SB_THRESH) setSbDeployed(true);  // dragged left  → OUT
      }
      setSbOffset(0);
      sbOffsetRef.current = 0;
      sbDragging.current = false;
    }
    resDivDragging.current = false;
    accumDragging.current = false;
    psiSliderDragging.current = false;
  };

  const pick = (id) => setSel(s => s === id ? null : id);
  const info = sel ? INFO[sel] : null;
  const paused      = emerGrPulled || ((hydFlo || ehydPx) && hydPsi < 1800);
  const emergPaused = accumLvlPct <= 0;

  // ── Gear light states: [greenLit, redLit] for [LH, Nose, RH] ────────
  const GEAR_LIGHTS = {
    up:        [[0,0],[0,0],[0,0]],
    to_down_1: [[0,1],[0,1],[0,1]],
    to_down_2: [[0,1],[1,0],[0,1]],
    to_down_3: [[1,1],[1,0],[1,1]],
    down:      [[1,0],[1,0],[1,0]],
    to_up_1:   [[1,1],[0,1],[1,1]],
    to_up_2:   [[0,1],[0,0],[0,1]],
    to_up_3:   [[0,1],[0,0],[0,1]],
  };
  const gearLights = emerGrPulled ? [[1,1],[1,0],[1,1]] : (GEAR_LIGHTS[gearPhase] ?? GEAR_LIGHTS.up);
  const gearLocked = gearPhase !== 'up' && gearPhase !== 'down';
  const gearLabel  = gearPhase.startsWith('to_up') || gearPhase === 'up' ? 'UP' : 'DOWN';

  const handleGearClick = () => {
    if (gearLocked) return;
    gearTimers.current.forEach(clearTimeout);
    if (gearPhase === 'up') {
      setGearPhase('to_down_1');
      gearTimers.current = [
        setTimeout(() => setGearPhase('to_down_2'), 2000),
        setTimeout(() => setGearPhase('to_down_3'), 4000),
        setTimeout(() => setGearPhase('down'),       6000),
      ];
    } else {
      setNwsOn(false);
      setGearPhase('to_up_1');
      gearTimers.current = [
        setTimeout(() => setGearPhase('to_up_2'), 2000),
        setTimeout(() => setGearPhase('to_up_3'), 4000),
        setTimeout(() => setGearPhase('up'),       6000),
      ];
    }
  };

  // ── small helper: caution/advisory rect + label ──────────────────
  const CautionBar = ({ x, y, w, label, active, blink = false, type = 'caution' }) => (
    <>
      <rect x={x} y={y} width={w} height={19} rx={2}
        fill={active
          ? (type === 'caution' ? C.caution : C.advisory)
          : 'rgba(20,30,44,0.7)'}
        stroke={active
          ? (type === 'caution' ? '#BA7517' : '#639922')
          : C.stroke}
        strokeWidth={0.5}
        style={active && blink ? { animation: 'hydBlink 1.2s ease-in-out infinite' } : {}} />
      <text x={x + w / 2} y={y + 10}
        style={active
          ? (type === 'caution' ? T.caution : T.advisory)
          : { ...T.t, fill: '#2e3e52' }}>
        {label}
      </text>
    </>
  );

  const SmallBox = ({ x, y, w = 91, label, accent }) => (
    <>
      <rect x={x} y={y} width={w} height={18} rx={2}
        fill={accent ? 'rgba(239,159,39,0.1)' : 'rgba(16,26,40,0.8)'}
        stroke={accent ? '#BA7517' : C.stroke} strokeWidth={0.5} />
      <text x={x + w / 2} y={y + 9}
        style={{ ...T.t, fill: accent ? C.emerg : C.muted }}>
        {label}
      </text>
    </>
  );

  return (
    <div style={{ background: C.bg, width: '100%' }}>
    <div style={{
      background: C.bg, borderRadius: 8, padding: 12,
      fontFamily: FONT, color: C.text,
      minWidth: 340, maxWidth: 900, margin: '0 auto',
    }}>
      <style>{KEYFRAMES}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.14em', color: '#4a7fa8' }}>
          T-6B TEXAN II — HYDRAULIC SYSTEM
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { active: hydFlo,        set: setHydFlo,        label: 'MAIN HYD LEAK',       bg: C.caution, border: '#BA7517', tc: '#4a2a08' },
            { active: ehydPx,        set: setEhydPx,        label: 'SMALL EHYD LEAK',     bg: C.emerg,   border: '#BA7517', tc: '#4a2a08' },
            { active: largeEhydSim,  set: setLargeEhydSim,  label: 'LARGE EHYD LEAK',     bg: '#cc2222', border: '#991010', tc: '#f8e0e0' },
          ].map(({ active, set, label, bg, border, tc }) => (
            <button key={label} onClick={() => set(v => !v)} style={{
              background: active ? bg : 'transparent',
              border: `1px solid ${active ? border : C.stroke}`,
              color: active ? tc : C.muted,
              padding: '3px 9px', fontSize: 9, borderRadius: 3, cursor: 'pointer',
              letterSpacing: '0.08em', fontFamily: FONT,
              fontWeight: active ? 700 : 400,
            }}>
              {active ? `● ${label}` : `▷ SIM ${label}`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 8, fontSize: 9, color: C.muted, letterSpacing: '0.06em' }}>
        {[
          { stroke: '#C34937', sw: 2.5, label: 'PRESSURIZED SUPPLY' },
          { stroke: '#F8F36D', sw: 2.5, label: 'EMERGENCY' },
          { stroke: '#62A061', sw: 2.5, label: 'RETURN' },
          { stroke: '#592976', sw: 2.5, label: 'SELECTOR' },
          { stroke: C.text,   sw: 1.5, da: '8 4', label: 'ELECTRICAL' },
          { stroke: C.text,   sw: 1.5, da: '5 5', label: 'MANUAL' },
        ].map(({ stroke, sw, da, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="22" height="5" style={{ overflow: 'visible' }}>
              <line x1="0" y1="2.5" x2="22" y2="2.5"
                stroke={stroke} strokeWidth={sw} strokeDasharray={da} />
            </svg>
            {label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: '#2a4a5a' }}>CLICK COMPONENTS FOR DETAILS</span>
      </div>

      {/* ── SVG Schematic ── */}
      {/*
        Layout summary (all coordinates in SVG units, viewBox 680×820):
          EDP:                 x=462  y=18   w=196 h=62
          Check Valve:         cx=450 cy=47  r=10
          FW Shutoff Valve:    x=260  y=22   w=128 h=55   — supply enters right, exits bottom
          Firewall marker:     x=395  y=12 → y=95  (dashed vertical)
          Power Package:       x=10   y=10   w=196 h=168  (dashed outline)
          Reservoir:           x=18   y=38   w=140 h=100
          Filter:              x=268  y=100  w=112 h=36
          Press Transmitter:   x=395  y=100  w=152 h=36
          Slide Valve:         x=222  y=166  w=185 h=44
          3500 psi RV:         x=428  y=166  w=158 h=44
          Distribution bar:    y=250  x=50→218
          Selector Manifold:   x=10   y=270  w=220 h=500 (VERTICAL)
            NWS:               x=18   y=288  w=204 h=110
            Gear:              x=18   y=408  w=204 h=110
            Flaps:             x=18   y=528  w=204 h=110
            Speed Brake:       x=18   y=648  w=204 h=110
          Emer Accumulator:    x=480  y=260  w=168 h=108
          Emer Sel Manifold:   x=480  y=390  w=172 h=140
          Return bus:          y=780  x=8→460

        Supply circuit (blue):
          EDP(462,47) → CV(450,47) → FW SOV right(388,47)
          FW SOV exit bottom(324,77) → Filter(324,100)
          Filter bottom(324,136) → Slide Valve(324,166)
          Slide Valve exit(314,210) → splits:
            - Left to Distrib bar(50,250)
            - Right to Accumulator(590,260)
          Distrib bar(50,250)→(218,250) → drops to each sub at x=120

        Emergency circuit (amber):
          Accum bottom(564,368) → Emer Sel Manifold top(564,390)

        Return circuit (gray):
          Each sub bottom(x,398/518/638/758) → return bus(x,780)
          Bus (8,780)→(460,780) → up left rail (8,780)→(8,88)→(18,88) into Reservoir
      */}
      <div style={{ position: 'relative' }}>

      <svg ref={svgRef} viewBox="0 0 680 820" width="100%" style={{ display: 'block' }}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onMouseLeave={handleSvgMouseUp}>

        {/* ── HYD PRESS gauge — embedded, scales with SVG ── */}
        {(() => {
          const gx = 550, gy = 8, gs = 120;
          const sliderX = gx, sliderY = gy + gs + 6, sliderW = gs, sliderH = 5;
          const thumbX = sliderX + (hydPsi / 4100) * sliderW;
          const msgY = sliderY + sliderH + 12;
          const cautions = [
            resDivPct < 15         && { key: 'hfl', label: 'HYD FL LO',  color: C.caution, blink: true },
            (hydPsi < 1800 || hydPsi > 3500) && { key: 'chk', label: 'CHK ENG',   color: C.caution, blink: true },
            accumLvlPct < 50       && { key: 'epx', label: 'EHYD PX LO', color: C.caution, blink: true },
            sbDeployed             && { key: 'spd', label: 'SPDBRK OUT', color: '#2ecc40',  blink: false },
            nwsOn                  && { key: 'nws', label: 'NWS ON',     color: '#2ecc40',  blink: false },
          ].filter(Boolean);
          return (
            <g>
              {/* Gauge */}
              <svg x={gx} y={gy} width={gs} height={gs} viewBox={`0 0 ${gs} ${gs}`}>
                <HydPressGauge pressure={Math.round(hydPsi/10)*10} size={gs} embedded />
              </svg>
              {/* PSI slider track */}
              <rect x={sliderX} y={sliderY} width={sliderW} height={sliderH} rx={2}
                fill="#111e2a" stroke="#2e3e52" strokeWidth={0.5} />
              {/* Thumb */}
              <rect x={thumbX - 4} y={sliderY - 3} width={8} height={sliderH + 6} rx={2}
                fill="#5ab030" stroke="#3a8020" strokeWidth={0.5}
                style={{ cursor: 'ew-resize' }}
                onMouseDown={e => { e.preventDefault(); e.stopPropagation(); psiSliderDragging.current = true; }} />
              {/* Status messages */}
              {cautions.map(({ key, label, color, blink }, i) => (
                <text key={key} x={sliderX} y={msgY + i * 13}
                  style={{
                    fontFamily: FONT, fontSize: 10, fontWeight: 700,
                    fill: color, letterSpacing: '0.08em',
                    animation: blink ? 'hydBlink 1.2s ease-in-out 4 forwards' : 'none',
                  }}>
                  {label}
                </text>
              ))}
            </g>
          );
        })()}

        {/* ────────────── SVG DEFINITIONS ────────────── */}
        <defs>
          {/* Crosshatch pattern for filters */}
          <pattern id="crosshatch" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M0,0 L4,4 M4,0 L0,4" stroke={C.stroke} strokeWidth="0.5" />
          </pattern>
          {/* Glow filter for emergency activation */}
          <filter id="emerGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ────────────── ANIMATED FLOW LINES ────────────── */}

        {/* Supply: EDP → Check Valve */}
        <F d="M430 50 L430 60" paused={paused} />
        
        {/* Supply: Check Valve → Filter*/}
        <F d="M430 80 L430 90" paused={paused} />

        {/* Supply: Check Valve → NWS Selector*/}
        <F d="M430 85 L510 85 L510 300 L440 300" paused={paused} />
        <F d="M420 300 L400 300" paused={paused} />

        {/* Supply: Filter → Relief Valve*/}
        <F d="M430 110 L430 130" paused={paused} />
        {/* Supply: Filter → Reservoir*/}
        <F d="M430 115 L340 115" paused={paused} />
        {/* Supply: Filter → PX TX*/}
        <F d="M430 122 L450 122" paused={paused} />

        {/* Supply: Relief Valve → Slide Valve */}
        <F d="M430 170 L430 186" paused={paused} />

        {/* Supply: Slide Valve → Distribution to other selector valves */}
        <F d="M430 230 L430 750" paused={paused} />
        <F d="M430 395 L400 395" paused={paused} />
        <F d="M430 490 L400 490" paused={paused} />
        <F d="M430 585 L400 585" paused={paused} />
        <F d="M430 670 L400 670" paused={paused} />
        <F d="M430 750 L400 750" paused={paused} />

        {/* Supply: → Emergency System (also blocked when fuse blows) */}
        <F d="M430 480 L475 480" paused={paused || fuseBlown} />
        <F d="M495 480 L535 480" paused={paused || fuseBlown} />
        <F d="M555 480 L592 480" paused={paused || fuseBlown} />

        {/* Emergency: Selector Valve→ Solenoid */}
        <F d="M595 445 L595 550" v="emerg" emergPaused={emergPaused} />

        {/* Emergency: Selector Valve →Accumulator */}
        <F d="M595 360 L595 370" v="emerg" emergPaused={emergPaused} />
        <F d="M595 340 L595 350" v="emerg" emergPaused={emergPaused} />
        <F d="M595 320 L595 330" v="emerg" emergPaused={emergPaused} />

        {/* Emergency: Selector Valve → Gears/Slide Valve */}
        <F d="M555 405 L460 405 L460 445 L440 445" v="emerg" emergPaused={emergPaused} />
        <F d="M420 445 L140 445" v="emerg" emergPaused={emergPaused} />
        <F d="M490 405 L490 310" v="emerg" emergPaused={emergPaused} />
        <F d="M490 290 L490 210 L470 210" v="emerg" emergPaused={emergPaused} />
        <F d="M142 443 L142 415" v="emerg" emergPaused={emergPaused} />
        <F d="M210 443 L210 415" v="emerg" emergPaused={emergPaused} />
        <F d="M280 443 L280 415" v="emerg" emergPaused={emergPaused} />
        <F d="M220 447 L220 470" v="emerg" emergPaused={emergPaused} />

        

        {/* Emergency: Selector Solenoid → Flaps Actuator */}
        <F d="M555 590 L500 590 L500 710 L440 710" v="emerg" emergPaused={emergPaused} />
        <F d="M420 710 L250 710" v="emerg" emergPaused={emergPaused} />

        {/* Selector: NWS selector valve → Actuators */}
        <F d="M330 285 L260 285" v="sel" paused={paused} />
        <text x="295" y="280"  style={T.s}>LEFT</text>
        <F d="M330 315 L260 315" v="sel" paused={paused} />
        <text x="295" y="320"  style={T.s}>RIGHT</text>

        {/* Selector: GEAR selector valve → Actuators */}
        <F d="M330 365 L150 365 L150 375" v="sel" paused={paused} />
        <F d="M220 365 L220 375" v="sel" paused={paused} />
        <F d="M290 365 L290 375" v="sel" paused={paused} />
        <text x="295" y="360"  style={T.s}>UP</text>
        <F d="M330 425 L287 425" v="sel" paused={paused} />
        <F d="M273 425 L217 425" v="sel" paused={paused} />
        <F d="M203 425 L160 425 L160 415" v="sel" paused={paused} />
        <F d="M230 425 L230 415" v="sel" paused={paused} />
        <F d="M300 425 L300 415" v="sel" paused={paused} />
        <text x="300" y="430"  style={T.s}>DOWN</text>

        {/* Selector: DOOR selector valve → Actuators */}
        <F d="M330 475 L260 475" v="sel" paused={paused} />
        <text x="295" y="470"  style={T.s}>DOWN</text>
        <F d="M330 505 L260 505" v="sel" paused={paused} />
        <text x="295" y="510"  style={T.s}>UP</text>

        {/* Selector: SPD BRAKE selector valve → Actuators */}
        <F d="M330 570 L260 570" v="sel" paused={paused} />
        <text x="295" y="565"  style={T.s}>IN</text>
        <F d="M330 600 L260 600" v="sel" paused={paused} />
        <text x="295" y="605"  style={T.s}>OUT</text>

        
        {/* Selector: FLAPS selector valve → Actuators */}
        <F d="M330 670 L240 670 L240 690" v="sel" paused={paused} />
        <text x="295" y="665"  style={T.s}>TO</text>
        <F d="M330 750 L240 750 L240 730" v="sel" paused={paused} />
        <text x="295" y="755"  style={T.s}>LDG</text>

        {/* Return: NWS selector valve → Return line */}
        <F d="M330 265 L100 265" v="ret" paused={paused} />

        {/* Return: Gear selector valve → Return line */}
        <F d="M365 360 L365 345 L100 345" v="ret" paused={paused} />

        {/* Return: Door selector valve → Return line */}
        <F d="M365 525 L365 540 L100 540" v="ret" paused={paused} />

        {/* Return: Speed Brake selector valve → Return line */}
        <F d="M365 620 L365 625 L100 625" v="ret" paused={paused} />

        {/* Return: Flaps TO selector valve → Return line */}
        <F d="M330 650 L100 650" v="ret" paused={paused} />

        {/* Return: Flaps LDG selector valve → Return line */}
        <F d="M330 770 L100 770" v="ret" paused={paused} />

        {/* Return: Return filter */}
        <F d="M100 770 L100 145 L200 145" v="ret" paused={paused} />

        {/* Return: Filter → Reservoir */}
        <F d="M220 145 L240 145" v="ret" paused={paused} />

        {/* Return: Filter → Overboard RV */}
        <F d="M225 145 L225 115" v="ret" paused={paused} />

        {/* Return: Reservoir → Firewall SH */}
        <F d="M240 85 L240 50" v="ret" paused={paused} />

        {/* Return: Firewall SH → Pump */}
        <F d="M300 30 L370 30" v="ret" paused={paused} />

        {/* Return: Slide Valve → filter */}
        <F d="M390 210 L190 210" v="ret" paused={paused} />

        {/* Return: Relief Valve → filter */}
        <F d="M390 150 L360 150 L360 210" v="ret" paused={paused} />

        {/* Return: Emergency system → filter */}
        <F d="M585 335 L550 335 L550 345 L460 345 L460 240 L190 240 L190 145" v="ret" paused={paused} />
        <F d="M585 355 L550 355 L550 347" v="ret" paused={paused} />

        {/* ────────────── FIXED CONNECTION LINES ────────────── */}
        {/* Electrical: EICAS PX*/}
        <F d="M500 115 L530 115 L530 70 L550 70" v="elec"/>
        {/* Electrical: NWS*/}
        <F d="M50 315 L50 338 L370 338 L370 330" v="elec"/>
        {/* Electrical: FLAPS*/}
        <F d="M598 658 L598 628" v="elec"/>
        <F d="M595 695 L400 695" v="elec"/>
        <F d="M450 695 L450 735 L400 735" v="elec"/>
        {/* Electrical: LDG GEAR*/}
        <F d="M70 470 L130 470 L130 450 L365 450 L365 430" v="elec"/>
        <F d="M365 450 L365 455" v="elec"/>
        {/* Electrical: SPD BRK*/}
        <F d="M50 560 L50 555 L330 555" v="elec"/>
        {/* Manual: HYD DUMP*/}
        <F d="M655 320 L655 335 L610 335" v="man"/>

        {/* ────────────── COMPONENT BOXES ────────────── */}

        {/* Power Package dashed outline */}
        <rect x="140" y="65" width="365" height="170" rx="6"
          fill="none" stroke="#1e3040" strokeWidth="0.5" strokeDasharray="6 4" />
        <text x="185" y="225"
          style={{ ...T.t, fill: '#1e3a4a', letterSpacing: '0.1em', fontSize: 7.5 }}>
          POWER PACKAGE
        </text>

        {/* Reservoir */}
        <Box x={238} y={80} w={100} h={80} id="reservoir" sel={sel} onSel={pick}>
          {/* Fluid fill — green (return) left, red (supply) right, draggable divider */}
          {(() => {
            const rx = 238, ry = 80, rw = 100, rh = 80;
            const divX = rx + (resDivPct / 100) * rw;
            return (
              <>
                <rect x={rx + 2} y={ry + 2} width={Math.max(0, divX - rx - 2)} height={rh - 4} rx={2}
                  fill="#62A061" opacity={0.45} style={{ pointerEvents: 'none' }} />
                <rect x={divX} y={ry + 2} width={Math.max(0, rx + rw - divX - 2)} height={rh - 4}
                  fill="#C34937" opacity={0.45} style={{ pointerEvents: 'none' }} />
                <line x1={divX} y1={ry + 2} x2={divX} y2={ry + rh - 2}
                  stroke="#000000" strokeWidth={2.5}
                  style={{ cursor: 'ew-resize' }}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); resDivDragging.current = true; }} />
                {/* 1 QT low-level marker at 15% */}
                <line x1={rx + 15} y1={ry + 2} x2={rx + 15} y2={ry + rh - 2}
                  stroke="#ffffff" strokeWidth={1} strokeDasharray="3 2"
                  style={{ pointerEvents: 'none' }} />
                <text x={rx+10} y={ry - 6} dominantBaseline="hanging"
                  style={{ fontFamily: FONT, fontSize: 5, fill: '#ffffff', pointerEvents: 'none' }}>
                  1 QT
                </text>
              </>
            );
          })()}
          <text x="288" y="170"  style={T.h}>RESERVOIR</text>
        </Box>

        {/* Overboard Relief Valve */}
        <Box x={150} y={85} w={80} h={30}>
          <text x="190" y="95" style={T.h}>Overboard</text>
          <text x="190" y="107" style={T.h}>Releif Valve</text>
        </Box>

        {/* Return Line Filter */}
        <Box x={200} y={140} w={20} h={10} id="filter" sel={sel} onSel={pick}>
          <rect x="200" y="140" width="20" height="10" fill="url(#crosshatch)" />
        </Box>

        {/* FW Shutoff Valve */}
        <Box x={200} y={10} w={100} h={40} id="fwsov" sel={sel} onSel={pick} hi="#E24B4A">
          <text x="250" y="25" style={T.h}>FIREWALL</text>
          <text x="250" y="38" style={T.h}>SHUTOFF VALVE</text>
        </Box>

        {/* Engine Driven Pump */}
        <Box x={370} y={10} w={120} h={40} id="edp" sel={sel} onSel={pick}>
          <text x="430" y="25" style={T.h}>ENGINE DRIVEN PUMP</text>
          <text x="430" y="38" style={T.s}>3000 ±120 psi nominal</text>
        </Box>

        {/* Check Valve */}
       <Box x={425} y={60} w={10} h={20} id="cvalve" sel={sel} onSel={pick}>
         {/* Down arrow */}
         <path d="M430 65 L430 75 M427 72 L430 75 L433 72"
           stroke={C.supply} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
       </Box>

        {/* Filter */}
        <Box x={425} y={90} w={10} h={20} id="filter" sel={sel} onSel={pick}>
          <rect x="425" y="90" width="10" height="20" fill="url(#crosshatch)" />
        </Box>

        {/* Pressure Transmitter */}
        <Box x={450} y={105} w={50} h={20}>
          <text x="475" y="116" style={T.h}>PX TX</text>
        </Box>

        {/* 3500 psi System Relief Valve */}
        <Box x={390} y={130} w={80} h={40}>
          <text x="430" y="145" style={T.h}>3500 psi</text>
          <text x="430" y="157" style={T.h}>Relief Valve</text>
        </Box>

        {/* Slide Valve glow when emer pulled */}
        {emerGrPulled && (
          <rect x={390} y={186} width={80} height={44} rx={4}
            fill="none" stroke={C.emerg} strokeWidth={2}
            filter="url(#emerGlow)" opacity={0.9} />
        )}
        {/* Slide Valve Assembly */}
        <Box x={390} y={186} w={80} h={44} id="slide" sel={sel} onSel={pick}>
          <text x="430" y="203" style={T.h}>SLIDE VALVE</text>
          <text x="430" y="215" style={T.h}>ASSEMBLY</text>
        </Box>
        {/* ────────────── SELECTOR MANIFOLD (VERTICAL) ────────────── */}
        <rect x="110" y="250" width="300" height="550" rx="5"
          fill="none" stroke="#1e3040" strokeWidth="0.5" strokeDasharray="6 4" />
        <text x="260" y="255"
          style={{ ...T.t, fill: '#1e3a4a', letterSpacing: '0.1em', fontSize: 7.5 }}>
          SELECTOR MANIFOLD
        </text>

        {/* NWS */}
        <Box x={330} y={260} w={70} h={70} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="365" y="279" style={T.h}>NWS</text>
          <text x="365" y="291" style={T.h}>Electrical</text>
          <text x="365" y="303" style={T.h}>Selector</text>
          <text x="365" y="315" style={T.h}>Valve</text>
        </Box>
      
        <circle cx="250" cy="300" r="20"
          fill={C.box} stroke={C.stroke} strokeWidth="0.5" />

        {/* Landing Gear */}
        <Box x={330} y={360} w={70} h={70} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="365" y="379" style={T.h}>LDG GEAR</text>
          <text x="365" y="391" style={T.h}>Electrical</text>
          <text x="365" y="403" style={T.h}>Selector</text>
          <text x="365" y="415" style={T.h}>Valve</text>
        </Box>
        <Box x={260} y={375} w={60} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="290" y="388" style={T.h}>NOSE GEAR</text>
          <text x="290" y="400" style={T.h}>Actuator</text>
        </Box>
        <Box x={190} y={375} w={60} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="220" y="388" style={T.h}>RH GEAR</text>
          <text x="220" y="400" style={T.h}>Actuator</text>
        </Box>
        <Box x={120} y={375} w={60} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="150" y="388" style={T.h}>LH GEAR</text>
          <text x="150" y="400" style={T.h}>Actuator</text>
        </Box>
        
        {/* Emergency Check Valve */}
       <Box x={535} y={475} w={20} h={10} id="cvalve" sel={sel} onSel={pick}>
         {/* Down arrow */}
         <path d="M540 480 L550 480 M547 477 L550 480 L547 483"
           stroke={C.supply} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
       </Box>

       {/* Hydraulic Fuse */}
       <Box x={475} y={475} w={20} h={10} id="fuse" sel={sel} onSel={pick}>
          <text x="485" y="490" style={T.s}>HYDRAULIC</text>
          <text x="485" y="500" style={T.s}>FUSE</text>
       </Box>
       {/* Fuse blow effects */}
       {fuseBlown && (
         <g>
           {/* Dramatic glow ring */}
           <rect x={475} y={475} width={20} height={10} rx={2}
             fill="none" stroke="#ff2020" strokeWidth={3}
             filter="url(#emerGlow)"
             style={{ animation: 'fuseBlowFlash 1.2s ease-out 1 forwards' }} />
           {/* Permanent red X */}
           <line x1={477} y1={477} x2={493} y2={483} stroke="#ff2020" strokeWidth={2} strokeLinecap="round" />
           <line x1={493} y1={477} x2={477} y2={483} stroke="#ff2020" strokeWidth={2} strokeLinecap="round" />
         </g>
       )}

        <Box x={330} y={455} w={70} h={70} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="365" y="474" style={T.h}>LDG DOOR</text>
          <text x="365" y="486" style={T.h}>Electrical</text>
          <text x="365" y="498" style={T.h}>Selector</text>
          <text x="365" y="510" style={T.h}>Valve</text>
        </Box>
        <Box x={180} y={470} w={80} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="220" y="483" style={T.h}>Inboard Door</text>
          <text x="220" y="495" style={T.h}>Actuator</text>
        </Box>

        {/* ── NWS Button ── */}
        <circle cx={50} cy={300} r={11}
          fill="#c01818" stroke="#3a0404" strokeWidth={0.8}
          style={{ cursor: gearPhase === 'down' ? 'pointer' : 'default' }}
          onClick={() => { if (gearPhase === 'down' && !emerGrPulled) setNwsOn(v => !v); }} />

        {/* ── Landing Gear Indicator (no border, no labels) ── */}
        <g>
          {/* Three gear position lights: LH (shifted down) · NOSE · RH (shifted down) */}
          {[
            { lx: 30, dy: 8, li: 0 },
            { lx: 50, dy: 0, li: 1 },
            { lx: 70, dy: 8, li: 2 },
          ].map(({ lx, dy, li }) => {
            const [green, red] = gearLights[li];
            return (
              <g key={li}>
                <rect x={lx - 8} y={418 + dy} width={16} height={9} rx={1}
                  fill={green ? '#2db52d' : '#081408'} stroke="#182818" strokeWidth={0.4} />
                <rect x={lx - 8} y={427 + dy} width={16} height={9} rx={1}
                  fill={red   ? '#c02020' : '#0e0404'} stroke="#280a0a" strokeWidth={0.4} />
              </g>
            );
          })}

          {/* Gear handle circle — locked during transition */}
          {(() => {
            const gearRed = ((emerGrPulled && gearPhase === 'up') || flapPos === 'LDG') && gearPhase !== 'down';
            return (
              <>
                {gearRed && (
                  <circle cx={50} cy={470} r={20}
                    fill="none" stroke="#ff2020" strokeWidth={3}
                    filter="url(#emerGlow)" opacity={0.95} />
                )}
                <circle cx={50} cy={470} r={20}
                  fill={gearRed ? '#8b1010' : gearPhase === 'down' ? '#b8b8a8' : '#686860'}
                  stroke="#c0c0b0" strokeWidth={1}
                  style={{ cursor: gearLocked ? 'not-allowed' : 'pointer' }}
                  onClick={handleGearClick} />
              </>
            );
          })()}
          <text x={50} y={470} textAnchor="middle" dominantBaseline="central"
            style={{ fontFamily: FONT, fontSize: 7.5, fontWeight: 700, fill: '#1a1a14',
                     cursor: gearLocked ? 'not-allowed' : 'pointer' }}
            onClick={handleGearClick}>
            {gearLabel}
          </text>
        </g>

        {/* ── Flap 3-Position Slider (draggable) ── */}
        {(() => {
          const trackX = 595, trackY = 660, trackW = 6, trackH = 44;
          const ty = FLAP_SNAP_Y[selectorPos];
          return (
            <g>
              {/* Track */}
              <rect x={trackX} y={trackY} width={trackW} height={trackH} rx={3}
                fill="#111e2a" stroke="#2e3e52" strokeWidth={0.5} />
              {/* Notch lines + labels + click zones */}
              {['UP','TO','LDG'].map(pos => (
                <g key={pos} style={{ cursor: 'pointer' }} onClick={() => setFlapSafe(pos)}>
                  <text x={trackX + trackW + 10} y={FLAP_SNAP_Y[pos]}
                    textAnchor="start" dominantBaseline="central"
                    style={{ ...T.t, fontSize: 7, fill: selectorPos === pos ? '#c8d8e8' : '#3a4a5a' }}>
                    {pos}
                  </text>
                  <rect x={trackX - 6} y={FLAP_SNAP_Y[pos] - 9} width={trackW + 12} height={18}
                    fill="transparent" />
                </g>
              ))}
              {/* Draggable thumb */}
              <rect x={trackX - 2.5} y={ty - 2.5} width={trackW + 5} height={5} rx={2}
                fill="#8090a0" stroke="#b0bcc8" strokeWidth={0.6}
                style={{ cursor: 'grab' }}
                onMouseDown={handleFlapMouseDown} />
            </g>
          );
        })()}

        {/* ── Flap Position Indicator Dial ── */}
        {(() => {
          const dcx = 595, dcy = 737, dr = 18;
          const angleMap = { UP: 30, TO: 90, LDG: 150 };
          function dp(ang, r) {
            const rad = (ang - 90) * Math.PI / 180;
            return [dcx + r * Math.cos(rad), dcy + r * Math.sin(rad)];
          }
          const [nx, ny] = dp(angleMap[flapPos], dr * 0.78);
          return (
            <g>
              <circle cx={dcx} cy={dcy} r={dr + 4} fill="#080f18" stroke="#2e3e52" strokeWidth={0.8} />
              <circle cx={dcx} cy={dcy} r={dr} fill="#0d1620" />
              {Object.entries(angleMap).map(([label, ang]) => {
                const [lx, ly] = dp(ang, dr + 9);
                return (
                  <text key={label} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                    style={{ ...T.t, fontSize: 7, fill: flapPos === label ? '#c8d8e8' : '#3a4a5a' }}>
                    {label}
                  </text>
                );
              })}
              <text x={dcx-10} y={dcy + 6} textAnchor="middle"
                style={{ ...T.t, fontSize: 6, fill: C.muted }}>FLAPS</text>
              <line x1={dcx} y1={dcy} x2={nx} y2={ny}
                stroke="#c8d8e8" strokeWidth={1.5} strokeLinecap="round" />
              <circle cx={dcx} cy={dcy} r={2.5} fill="#8a9aaa" />
            </g>
          );
        })()}

        {/* ── Speed Brake Drag Handle (circular) ── */}
        {(() => {
          const trackX = 22, trackCY = 580, trackW = 56, trackH = 5;
          const tcx = SB_CX + sbOffset;
          const r = 14;
          const stripeXs = [-8, -5, -2, 1, 4, 7];
          return (
            <g>
              {/* Track groove */}
              <rect x={trackX} y={trackCY - trackH / 2} width={trackW} height={trackH} rx={3}
                fill="#0d1620" stroke="#2e3e52" strokeWidth={0.5} />
              {/* Circular thumb */}
              <circle cx={tcx} cy={trackCY} r={r}
                fill="#7a7e88" stroke="#505460" strokeWidth={0.7}
                style={{ cursor: 'ew-resize', userSelect: 'none' }}
                onMouseDown={handleSbMouseDown} />
              {/* Texture stripes */}
              {stripeXs.map(ox => (
                <line key={ox}
                  x1={tcx + ox} y1={trackCY - r + 3}
                  x2={tcx + ox} y2={trackCY + r - 3}
                  stroke="#454850" strokeWidth={0.8}
                  style={{ pointerEvents: 'none' }} />
              ))}
            </g>
          );
        })()}

        {/* Speed Brake */}
        <Box x={330} y={550} w={70} h={70} id="spdbrk" sel={sel} onSel={pick} hi="#534AB7">
          <text x="365" y="569" style={T.h}>SPD BRAKE</text>
          <text x="365" y="581" style={T.h}>Electrical</text>
          <text x="365" y="593" style={T.h}>Selector</text>
          <text x="365" y="605" style={T.h}>Valve</text>
        </Box>
        <Box x={180} y={565} w={80} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="220" y="578" style={T.h}>Speed Brake</text>
          <text x="220" y="590" style={T.h}>Actuator</text>
        </Box>

        {/* Flaps */}
        <Box x={330} y={635} w={70} h={70} id="flaps" sel={sel} onSel={pick} hi="#639922">
          <text x="365" y="654" style={T.h}>Flaps TO</text>
          <text x="365" y="666" style={T.h}>Electrical</text>
          <text x="365" y="678" style={T.h}>Selector</text>
          <text x="365" y="690" style={T.h}>Valve</text>
        </Box>
        <Box x={330} y={715} w={70} h={70} id="flaps" sel={sel} onSel={pick} hi="#639922">
          <text x="365" y="734" style={T.h}>Flaps LDG</text>
          <text x="365" y="746" style={T.h}>Electrical</text>
          <text x="365" y="758" style={T.h}>Selector</text>
          <text x="365" y="770" style={T.h}>Valve</text>
        </Box>
        <Box x={190} y={690} w={60} h={40} id="nws" sel={sel} onSel={pick} hi="#639922">
          <text x="220" y="703" style={T.h}>Flaps</text>
          <text x="220" y="715" style={T.h}>Actuator</text>
        </Box>

        {/* ────────────── EMERGENCY SELECTOR MANIFOLD ────────────── */}
        

        {/* HYDRAULIC DUMP — black box to the right of accumulator */}
        {(() => {
          const bx = 640, by = 262, bw = 26, bh = 56;
          const cx1 = bx + 8, cx2 = bx + 18; // two text columns
          const hydraulic = ['H','Y','D','R','A','U','L','I','C'];
          const dump      = ['D','U','M','P'];
          return (
            <g style={{ cursor: 'pointer' }} onClick={handleHydDump}>
              <rect x={bx} y={by} width={bw} height={bh} rx={3}
                fill="#000000" stroke="#3a3a3a" strokeWidth={0.6} />
              {hydraulic.map((ch, i) => (
                <text key={i} x={cx1} y={by + 5 + i * 5.5} textAnchor="middle" dominantBaseline="central"
                  style={{ fontFamily: FONT, fontSize: 5, fill: '#b0b8c8' }}>
                  {ch}
                </text>
              ))}
              {dump.map((ch, i) => (
                <text key={i} x={cx2} y={by + 16 + i * 5.5} textAnchor="middle" dominantBaseline="central"
                  style={{ fontFamily: FONT, fontSize: 5, fill: '#b0b8c8' }}>
                  {ch}
                </text>
              ))}
            </g>
          );
        })()}

        {/* Emergency Accumulator (amber accent) */}
        <Box x={555} y={260} w={80} h={60} id="accum" sel={sel} onSel={pick} hi={C.emerg}>
          {/* Fluid level — empty above line, yellow emergency fluid below */}
          {(() => {
            const bx = 555, by = 260, bw = 80, bh = 60;
            const lineY = by + (1 - accumLvlPct / 100) * bh;
            return (
              <>
                <rect x={bx + 2} y={lineY} width={bw - 4} height={Math.max(0, by + bh - lineY - 2)} rx={1}
                  fill={C.emerg} opacity={0.4} style={{ pointerEvents: 'none' }} />
                <line x1={bx + 2} y1={lineY} x2={bx + bw - 2} y2={lineY}
                  stroke="#000000" strokeWidth={2}
                  style={{ cursor: 'ns-resize' }}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); accumDragging.current = true; }} />
              </>
            );
          })()}
          <text x="595" y="250"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            EMER ACCUMULATOR
          </text>
          <text x="595" y="265"
            style={{ ...T.s, fontSize: 6, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            HELIUM PRECHARGE
          </text>
        </Box>

        <Box x={585} y={330} w={20} h={10} id="accum" sel={sel} onSel={pick} hi={C.emerg}>
        </Box>

        <Box x={585} y={350} w={20} h={10} id="accum" sel={sel} onSel={pick} hi={C.emerg}>
          <text x="645" y="350"
            style={{ ...T.s, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            3500 PSI px
          </text>
          <text x="645" y="360"
            style={{ ...T.s, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            RELEASE VALVE
          </text>
        </Box>

        {/* LDG GEAR EMER EXT glow when handle pulled */}
        {emerGrPulled && (
          <rect x={555} y={370} width={80} height={75} rx={4}
            fill="none" stroke={C.emerg} strokeWidth={2}
            filter="url(#emerGlow)" opacity={0.9} />
        )}
        <Box x={555} y={370} w={80} h={75} id="accum" sel={sel} onSel={pick} hi={C.emerg}>
          <text x="595" y="383"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            LDG GEAR
          </text>
          <text x="595" y="395"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            EMERGENCY
          </text>
          <text x="595" y="407"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            EXTENSION
          </text>
          <text x="595" y="419"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            SELECTOR
          </text>
          <text x="595" y="431"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            VALVE
          </text>
        </Box>

        <Box x={555} y={550} w={80} h={75} id="accum" sel={sel} onSel={pick} hi={C.emerg}>
          <text x="595" y="563"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            FLAP
          </text>
          <text x="595" y="575"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            EMERGENCY
          </text>
          <text x="595" y="587"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            EXTENSION
          </text>
          <text x="595" y="599"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            SELECTOR
          </text>
          <text x="595" y="611"
            style={{ ...T.h, fill: ehydPx || fuseBlown ? C.emerg : '#b09a5a' }}>
            SOLENOID
          </text>
        </Box>

        {/* ── EMER LDG GR Handle (2D diamond) ── */}
        {(() => {
          const cx = 657, cy = 408, hw = 15, hh = 40, r = 4, r1=5, r2 = 7;
          const diamond = `
            M ${cx-hw},${cy - r}
            L ${cx-r}, ${cy-hh}
            A ${r1}, ${r1}, 0, 0, 1, ${cx+r}, ${cy-hh}
            L ${cx+hw},${cy - r}
            A ${r2}, ${r2}, 0, 0, 1, ${cx+hw}, ${cy+r}
            L ${cx+r}, ${cy+hh}
            A ${r1}, ${r1}, 0, 0, 1, ${cx-r}, ${cy+hh}
            L ${cx-hw},${cy + r}
            A ${r2}, ${r2}, 0, 0, 1, ${cx-hw}, ${cy-r}`;
          return (
            <g style={{ cursor: 'pointer' }} onClick={() => setEmerGrPulled(v => !v)}>
              <defs>
                <clipPath id="emerGrClip">
                  <path d={diamond} />
                </clipPath>
              </defs>
              {/* Glow ring when pulled */}
              {emerGrPulled && (
                <path d={diamond} fill="none" stroke={C.emerg} strokeWidth={3}
                  filter="url(#emerGlow)" opacity={0.95} />
              )}
              {/* Diamond body — yellow base */}
              <path d={diamond} fill="#d4a800" stroke="#2a1e00" strokeWidth="1.2" />
              {/* Hazard stripes clipped to diamond — start above tip so top stripe goes all the way across */}
              {Array.from({ length: 14 }, (_, i) => (
                <line key={i}
                  x1={515 + i * 13} y1={350}
                  x2={515 + i * 13 + 100} y2={450}
                  stroke="#1a1200" strokeWidth="5.5"
                  clipPath="url(#emerGrClip)" />
              ))}
              {/* Yellow center strip down the middle */}
              <rect x={cx - 4} y={cy - hh - 5} width={8} height={hh * 2 + 10}
                fill="#d4a800" clipPath="url(#emerGrClip)" />
              {/* Border overlay */}
              <path d={diamond} fill="none" stroke="#2a1e00" strokeWidth="1.2" />
              {/* EMER label above circle — letters stacked vertically */}
              {['E','M','E','R'].map((letter, i) => (
                <text key={i} x={cx} y={cy - 31 + i * 5} textAnchor="middle" dominantBaseline="central"
                  style={{ fontFamily: FONT, fontSize: 6, fontWeight: 700, fill: '#1a1200' }}>
                  {letter}
                </text>
              ))}
              {/* Silver circle — centered */}
              <circle cx={cx} cy={cy} r="7"
                fill="#909098" stroke="#2a2a32" strokeWidth="0.8" />
              <circle cx={cx - 2} cy={cy - 2} r="2.5"
                fill="#c8c8d0" opacity="0.6" />
              {/* LDG GR label below circle */}
              {['L','D','G', ' ','G','R'].map((letter, i) => (
                <text key={i} x={cx} y={cy + 10 + i * 5} textAnchor="middle" dominantBaseline="central"
                  style={{ fontFamily: FONT, fontSize: 6, fontWeight: 700, fill: '#1a1200' }}>
                  {letter}
                </text>
              ))}
            </g>
          );
        })()}

        <rect x="515" y="325" width="165" height="310" rx="5"
          fill="none" stroke="#6a4a18" strokeWidth="0.5" strokeDasharray="4 3" />
        <text x="595" y="645"
          style={{ ...T.t, fill: '#7a5520', letterSpacing: '0.06em', fontSize: 7.5 }}>
          EMER SELECTOR MANIFOLD
        </text>

      </svg>
      </div>

      {/* ── Info Panel ── */}
      <div style={{
        marginTop: 10, padding: '10px 14px',
        background: 'rgba(8,16,28,0.97)',
        border: `0.5px solid ${info ? '#378ADD' : C.stroke}`,
        borderRadius: 5, fontSize: 10, lineHeight: 1.8,
        letterSpacing: '0.04em', minHeight: 42,
        transition: 'border-color .2s',
      }}>
        {info ? (
          <>
            <div style={{
              fontWeight: 700, letterSpacing: '0.12em',
              marginBottom: 5, color: C.text, fontSize: 10,
            }}>
              {info.title.toUpperCase()}
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, color: C.muted }}>
              {info.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </>
        ) : (
          <span style={{ color: '#2a4a5a', fontSize: 9, letterSpacing: '0.08em' }}>
            ▸  CLICK ANY COMPONENT TO VIEW OPERATING DETAILS
          </span>
        )}
      </div>
    </div>
    </div>
  );
}
