// ─────────────────────────────────────────────────────────────────────────────
//  T-6B Propeller System — Modal Content + PropBriefingModal Component
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';

const FONT = "'Courier New', Courier, monospace";
const MC = {
  bg:     '#080f18',
  stroke: '#2e4a5a',
  text:   '#c8d8e8',
  muted:  '#5a7a8a',
};

// ─────────────────────────────────────────────────────────────────────────────
//  TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

export const PROP_VERBATIM = {
  heading: 'Propeller System NATOPS Intro (helpful to memorize)',
  quote: `"The power turbine drives the aluminum 97-inch, fourbladed, constant-speed, variable-pitch, non-reversing, feathering propeller through the reduction gearbox. The propeller system is designed to maintain a constant speed of 2000 RPM (100% NP) during most flight conditions."`,
};
 
// ─────────────────────────────────────────────────────────────────────────────
//  NUMBERS
// ─────────────────────────────────────────────────────────────────────────────
 
export const PROP_NUMBERS = {
  heading: 'Propeller System Numbers',
  items: [
    { section: 'Propeller Physical Specs' },
    {
      value: '100%  MAX',
      label: 'NP maximum — normal operations with PMU on.',
      highlight: true,
    },
    {
      value: '100 ± 2%',
      label: 'Mechanical overspeed governor limit — activates when PMU is OFF',
      highlight: true,
    },
    {
      value: '46 – 50%  (ground)',
      label: 'NP ground idle range',
      highlight: true,
    },
    {
      value: '62 – 80%  NP',
      label: 'Avoid stabilized ground operation in this range (ground resonance)',
      highlight: true,
    },
    {
      value: '110%  (20 sec)',
      label: 'NP transient limit — permissible during in-flight emergency completion',
      highlight: 'caution',
    },
    {
      value: '2000 RPM  =  100% NP',
      label: 'Design constant-speed — maintained during most flight conditions',
      highlight: false,
    },
    {
      value: '15°',
      label: 'Fine (flat/low) pitch — minimum blade angle, maximum drag',
      highlight: false,
    },
    {
      value: '86°',
      label: 'Feather pitch — maximum blade angle, minimum drag for engine-out glide',
      highlight: false,
    },
    {
      value: '~2,750 ft-lbs',
      label: '100% torque at sea level, no airspeed (approximate)',
      highlight: false,
    },
    {
      value: '~2,900 ft-lbs',
      label: '100% torque at altitude — available up to roughly 12,000–16,000 ft MSL',
      highlight: false,
    },
  ],
};
 
// ─────────────────────────────────────────────────────────────────────────────
//  EICAS MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
 
export const PROP_EICAS = {
  heading: 'Propeller System EICAS Messages',
  items: [
    {
      label: 'PMU FAIL',
      color: 'warning',
      cause:
        'PMU has failed completely. Loss of automatic fuel scheduling, propeller governing, ground idle control, NP limiting above 80% at altitude, auto-abort capability, and airstart protection. Propeller will revert to mechanical overspeed governor (100 ± 2% NP). Engine remains controllable via PCL but response is no longer linear and limits are not automatically enforced.',
      response:
        'Execute PMU FAILURE EP. PCL — set minimum practical power, PMU — OFF, check circuit breakers, attempt PMU reset. If PMU cannot be restored, land as soon as practical.',
    },
    {
      label: 'PMU STATUS',
      color: 'caution',
      cause:
        'PMU has detected and accomodated a fault in-flight, or WOW switch failure. PMU remains online but has logged a detected anomaly. Also illuminates during normal ground operations when the WOW switch disagrees.',
      response:
        'Execute PMU FAULT EP. On the ground: toggle PMU switch. In the air: no corrective action available — PMU has deteected a discrepency in the WOW switch.',
    },
  ],
};
 
// ─────────────────────────────────────────────────────────────────────────────
//  EMERGENCY PROCEDURES
// ─────────────────────────────────────────────────────────────────────────────
 
export const PROP_EPS = {
  heading: 'Propeller System Emergency Procedures',
  items: [
    {
      title: 'UNCOMMANDED POWER CHANGES/LOSS OF POWER/UNCOMMANDED PROP FEATHER',
      subtitle: 'Used Whenever Unexpected Power Loss or Thrust Reduction Occurs',
      memory: true,
      indications: [
        'Most apparent indication: uncommanded reduction in power or thrust.',
        'May include: NP spike due to feather, torque decay, N1 decay, lower fuel flow.',
        'Could indicate PMU fault, PIU fault, oil/engine/fuel system contamination, propeller dump solenoid failure, or prop sleeve touchdown.',
        'Uncommanded propeller feather: rapid NP drop below 40% without pilot input. Torque spike.',
      ],
      procedure: [
        'PCL — MID RANGE.',
        'PMU SWITCH — OFF.',
        'PROP SYS CIRCUIT BREAKER (left front console) — PULL, IF NP STABLE BELOW 40%.',
        'PCL — AS REQUIRED.',
        'If power is sufficient for continued flight:',
        'PEL — EXECUTE.',
        'If power is insufficient to complete PEL:',
        'PROP SYS circuit breaker — RESET; AS REQUIRED.',
        'PCL — OFF.',
        'FIREWALL SHUTOFF handle — PULL.',
        'Execute Forced Landing or Eject.',
      ],
      landing: 'PEL if power sufficient. Forced Landing or Eject if power insufficient to complete PEL.',
    },
    {
      title: 'PMU FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'Simultaneous PMU FAIL warning and PMU STATUS caution on EICAS.',
        'Possible step change in power.',
      ],
      procedure: [
        'PCL — MINIMUM PRACTICAL FOR FLIGHT.',
        'PMU switch — OFF.',
        'IGN, START, and PMU circuit breakers (left front console) — CHECK, RESET IF NECESSARY.',
        'PMU switch — NORM (attempt second reset if necessary).',
        'If PMU reset is unsuccessful:',
        'PMU switch — OFF.',
        'Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL if PMU cannot be restored.',
    },
    {
      title: 'PMU FAULT',
      subtitle: '',
      memory: false,
      indications: [
        'PMU STATUS caution on EICAS.',
      ],
      procedure: [
        'ON GROUND: PMU switch — OFF, THEN NORM. If PMU STATUS caution remains illuminated, confirm source of fault prior to flight.',
        'IN FLIGHT: PMU has detected a discrepancy in the weight-on-wheels switch. A reset is not possible.',
      ],
      landing: 'No specific landing criteria.',
    },
  ],
};
 
// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENT INFO  —  click-through detail for diagram elements
// ─────────────────────────────────────────────────────────────────────────────
 
export const PROP_INFO = {

  propservo: {
    title: 'Prop Servo Valve',
    items: [
      'Used when engine is shut down with PCL and PMU in NORM — does not function if PMU is OFF.',
      'PMU sends a signal to the valve upon PCL cutoff.',
      'Quickly drains oil out of the pitch change mechanism, allowing springs and counterweights to drive blades to feather.',
      'Activates alongside the Feather Dump Solenoid Valve when PCL is moved to cutoff.',
    ],
    photos: [],
  },

  featherdump: {
    title: 'Feather Dump Solenoid Valve',
    items: [
      'Activated by micro-switches when PCL is moved to cutoff position.',
      'Receives power from the PROP SYS circuit breaker.',
      'Does not require any signal from the PMU — functions regardless of PMU state.',
      'Activates alongside the Prop Servo Valve when PCL is moved to cutoff.',
    ],
    photos: [],
  },

  piu: {
    title: 'PIU (Propeller Interface Unit)',
    items: [
      'Located on top of the RGB.',
      'Responds to power requests from the PMU by regulating oil flow to the pitch change mechanism.',
      'Electronically governed by the PMU to maintain 100% NP under normal operations.',
      'Contains a backup mechanical overspeed governor — used if PMU is turned off or fails.',
      'Backup governor keeps prop RPM at 100±2% NP.',
    ],
    photos: [{ src: '/systems/prop/piu.png', caption: 'PIU mounted on top of the RGB' }],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  BRIEFING MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function PropBriefingModal({ tab, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const COLOR_CAUTION  = '#FAC775';
  const COLOR_ADVISORY = '#5dcc5d';
  const COLOR_WARNING  = '#ff5555';

  const eicasColor = (type) => {
    if (type === 'warning')  return { bg: 'rgba(180,30,30,0.18)',  border: '#cc3333', label: COLOR_WARNING };
    if (type === 'advisory') return { bg: 'rgba(30,100,30,0.18)',  border: '#3a7a3a', label: COLOR_ADVISORY };
    return                          { bg: 'rgba(120,80,10,0.18)',  border: '#8a6010', label: COLOR_CAUTION };
  };

  const sectionStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: `0.5px solid ${MC.stroke}`,
    borderRadius: 5,
    padding: '10px 14px',
    marginBottom: 10,
  };

  let content = null;

  if (tab === 'verbatim') {
    content = (
      <>
        <div style={{ fontSize: 11, color: MC.muted, letterSpacing: '0.06em', marginBottom: 14 }}>
          {PROP_VERBATIM.heading}
        </div>
        <div style={{
          ...sectionStyle,
          background: 'rgba(55,138,221,0.06)',
          border: '0.5px solid #378ADD55',
          fontStyle: 'italic',
          color: '#a8c8e0',
          fontSize: 12,
          lineHeight: 1.75,
          marginBottom: 18,
        }}>
          {PROP_VERBATIM.quote}
        </div>
      </>
    );
  }

  if (tab === 'numbers') {
    content = (
      <>
        <div style={{ fontSize: 11, color: MC.muted, letterSpacing: '0.06em', marginBottom: 14 }}>
          {PROP_NUMBERS.heading}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, background: 'transparent' }}>
          <thead>
            <tr>
              <th style={{ color: MC.muted, textAlign: 'left', padding: '4px 8px', borderBottom: `0.5px solid ${MC.stroke}`, fontWeight: 400, letterSpacing: '0.08em', fontSize: 10, background: 'transparent' }}>
                VALUE
              </th>
              <th style={{ color: MC.muted, textAlign: 'left', padding: '4px 8px', borderBottom: `0.5px solid ${MC.stroke}`, fontWeight: 400, letterSpacing: '0.08em', fontSize: 10, background: 'transparent' }}>
                MEANING
              </th>
            </tr>
          </thead>
          <tbody>
            {PROP_NUMBERS.items.map((row, i) => (
              <tr key={i} style={{ background: row.highlight ? 'rgba(250,199,117,0.06)' : 'transparent' }}>
                <td style={{
                  padding: '8px 8px',
                  borderBottom: `0.5px solid ${MC.stroke}22`,
                  color: row.highlight ? COLOR_CAUTION : '#5ab8e8',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  verticalAlign: 'top',
                  minWidth: 120,
                }}>
                  {row.value}
                </td>
                <td style={{
                  padding: '8px 8px',
                  borderBottom: `0.5px solid ${MC.stroke}22`,
                  color: MC.muted,
                  lineHeight: 1.6,
                }}>
                  {row.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  if (tab === 'eicas') {
    content = (
      <>
        <div style={{ fontSize: 11, color: MC.muted, letterSpacing: '0.06em', marginBottom: 14 }}>
          {PROP_EICAS.heading}
        </div>
        {PROP_EICAS.items.map((msg) => {
          const col = eicasColor(msg.color);
          return (
            <div key={msg.label} style={{
              ...sectionStyle,
              background: col.bg,
              border: `0.5px solid ${col.border}`,
              marginBottom: 10,
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', color: col.label, marginBottom: 8 }}>
                {msg.label}
              </div>
              <div style={{ marginBottom: 5 }}>
                <span style={{ color: MC.muted, fontSize: 9, letterSpacing: '0.08em' }}>CAUSE — </span>
                <span style={{ color: MC.text, fontSize: 11, lineHeight: 1.6 }}>{msg.cause}</span>
              </div>
              <div>
                <span style={{ color: MC.muted, fontSize: 9, letterSpacing: '0.08em' }}>RESPONSE — </span>
                <span style={{ color: MC.text, fontSize: 11, lineHeight: 1.6 }}>{msg.response}</span>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (tab === 'eps') {
    content = (
      <>
        <div style={{ fontSize: 11, color: MC.muted, letterSpacing: '0.06em', marginBottom: 14 }}>
          {PROP_EPS.heading}
        </div>
        {PROP_EPS.items.map((ep, i) => (
          <div key={ep.title} style={{ ...sectionStyle, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                background: 'rgba(55,138,221,0.12)', border: '0.5px solid #378ADD66',
                color: '#5ab8e8', fontSize: 9, fontWeight: 700, padding: '2px 7px',
                borderRadius: 3, letterSpacing: '0.1em',
              }}>
                EP {i + 1}
              </span>
              <span style={{ fontWeight: 700, color: MC.text, fontSize: 11, letterSpacing: '0.1em' }}>
                {ep.title}
              </span>
              {ep.memory && (
                <span style={{
                  background: 'rgba(255,80,80,0.15)', border: '0.5px solid #cc333366',
                  color: COLOR_WARNING, fontSize: 8, fontWeight: 700, padding: '2px 6px',
                  borderRadius: 3, letterSpacing: '0.1em',
                }}>★ MEMORY</span>
              )}
            </div>

            {ep.indications.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ color: MC.muted, fontSize: 9, letterSpacing: '0.1em', marginBottom: 4 }}>INDICATIONS</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#a8b8c8', fontSize: 11, lineHeight: 1.7 }}>
                  {ep.indications.map((ind, j) => <li key={j}>{ind}</li>)}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: ep.landing ? 8 : 0 }}>
              <div style={{ color: MC.muted, fontSize: 9, letterSpacing: '0.1em', marginBottom: 4 }}>PROCEDURE</div>
              <div style={{ fontSize: 11, lineHeight: 1.8 }}>
                {(() => {
                  let count = 0;
                  return ep.procedure.map((step, j) => {
                    if (/^if\b/i.test(step.trim()) || step.trim().endsWith(':')) {
                      return (
                        <div key={j} style={{ color: MC.muted, fontStyle: 'italic', margin: '4px 0 2px', paddingLeft: 8, borderLeft: `2px solid ${MC.stroke}` }}>
                          {step}
                        </div>
                      );
                    }
                    count++;
                    const text = step.replace(/^\d+\.\s*/, '');
                    return (
                      <div key={j} style={{ color: MC.text, display: 'flex', gap: 8, paddingLeft: 4, alignItems: 'baseline' }}>
                        <span style={{ color: MC.muted, fontSize: 10, minWidth: 14, flexShrink: 0, textAlign: 'right' }}>{count}.</span>
                        <span>{text}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {ep.landing && (
              <div style={{
                marginTop: 8, padding: '5px 10px',
                background: 'rgba(55,138,221,0.06)', borderLeft: '2px solid #378ADD66',
                color: '#7ab8d8', fontSize: 10, lineHeight: 1.5,
              }}>
                <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: MC.muted, fontSize: 9 }}>
                  LANDING CRITERIA —{' '}
                </span>
                {ep.landing}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(4,10,20,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: MC.bg,
          border: `0.5px solid ${MC.stroke}`,
          borderRadius: 7,
          width: '100%', maxWidth: 680,
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          fontFamily: FONT,
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ overflowY: 'auto', padding: '14px 18px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: MC.muted, fontSize: 16, lineHeight: 1, padding: '0 4px' }}
            >×</button>
          </div>
          {content}
        </div>
        <div style={{
          padding: '6px 18px', borderTop: `0.5px solid ${MC.stroke}22`,
          color: '#2a4a5a', fontSize: 8, letterSpacing: '0.08em', flexShrink: 0,
        }}>
          CLICK OUTSIDE OR PRESS ESC TO CLOSE
        </div>
      </div>
    </div>
  );
}
