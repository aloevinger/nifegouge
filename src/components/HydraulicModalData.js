// ─────────────────────────────────────────────────────────────────────────────
//  FAM4202  —  Hydraulic System Modal Content + InfoModal Component
//  Source: Briefing_Outlines.pdf
//  Keep all modal text and the shared InfoModal component here.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';

const FONT = "'Courier New', Courier, monospace";
const MC = {
  bg:     '#080f18',
  stroke: '#2e4a5a',
  text:   '#c8d8e8',
  muted:  '#5a7a8a',
};

export const HYD_VERBATIM = {
  heading: 'Hydraulic System Natops Intro (helpful to memorize)',
  quote: `"The hydraulic system consists of one engine driven pump with approximately a 5 quart capacity. The system incorporates a pressure relief valve (3250 to 3500 psi) in the main and emergency systems to prevent damage from high system pressure."`
};

export const HYD_NUMBERS = {
  heading: 'Hydraulic System Numbers',
  items: [
  {
    value: '3000 ± 120 psi',
    label: 'Normal operating pressure — main and emergency systems',
    highlight: false,
  },
  {
    value: '< 1800  /  > 3500 psi',
    label: 'HYD PX out-of-limits (CHK ENG)',
    highlight: true,
  },
  {
    value: '3250 – 3500 psi',
    label: 'Pressure relief valve activation range',
    highlight: false,
  },
  {
    value: '5 qt  /  1 qt',
    label: 'Total system capacity  /  HYD FL LO caution threshold',
    highlight: true,
  },
  {
    value: '2400 ± 150 psi',
    label: 'EHYD PX LO caution threshold (accumulator)',
    highlight: true,
  },
  {
    value: '0.25 GPM  /  0.5 qt',
    label: 'Emergency hydraulic fuse limit  /  max fluid loss allowed by fuse',
    highlight: false,
  },
  {
    value: '600 fpm  (3.7 G)  —  185 ± 5 psi tire',
    label: 'Normal landing limit at normal tire pressure',
    highlight: false,
  },
  {
    value: '780 fpm  (5.1 G)  —  225 ± 5 psi tire',
    label: 'Maximum landing limit at max tire pressure',
    highlight: false,
  },
  {
    value: '< 1800  /  > 3500 psi',
    label: 'HYD PRESS gauge — amber caution arcs',
    highlight: false,
  },
  {
    value: '2880 – 3120 psi',
    label: 'HYD PRESS gauge — green (normal) arc',
    highlight: false,
  },
  ],
};

export const HYD_EICAS = {
  heading: 'Hydraulic System EICAS Messages',
  items: [
  {
    label: 'HYD FL LO',
    color: 'caution',   // amber
    cause: 'Fluid level in reservoir below 1 quart.',
    response: 'Execute HYDRAULIC SYSTEM MALFUNCTIONS emergency procedure.',
  },
  {
    label: 'EHYD PX LO',
    color: 'caution',   // amber
    cause: 'Accumulator pressure (as measured by the Px transducer just outside the accumulator) drops below 2400 ± 150 psi.',
    response: 'Execute HYDRAULIC SYSTEM MALFUNCTIONS emergency procedure.',
  },
  {
    label: 'CHK ENG',
    color: 'caution',   // amber
    cause: 'HYD pressure below 1800 psi or above 3500 psi.',
    response: 'Monitor HYD PX gauge. Execute any applicable EPs.',
  },
  {
    label: 'NWS ON',
    color: 'advisory',  // green
    cause: 'Nose wheel steering is armed and active.',
    response: 'Advisory only. Ensure NWS is off prior to minimum-radius differential braking turns.',
  },
  {
    label: 'SPDBRK OUT',
    color: 'advisory',  // green
    cause: 'Speed brake is deployed.',
    response: 'Advisory only. Speed brake retracts automatically at MAX PCL or on flap extension.',
  },
  ],
};

export const HYD_EPS = {
  heading: 'Hydraulic System Emergency Procedures',
  items: [
  {
    title: 'HYDRAULIC SYSTEM MALFUNCTIONS',
    memory: false,
    indications: [
      'HYD FL LO or EHYD PX LO caution',
      'Abnormal hydraulic pressure reading',
    ],
    procedure: [
      'Monitor HYD PX gauge.',
      'Check circuit breakers.',
      'Risk of leak or loss of engine driven pump — make rapid gear extension the top priority.',
      'Land as soon as PRACTICAL.',
    ],
    nwcs: [],
    landing: 'Land as soon as PRACTICAL.',
  },
  {
    title: 'LANDING GEAR MALFUNCTION',
    memory: false,
    indications: [
      'Gear fails to indicate down and locked after handle lowered',
      'Asymmetric or partial gear indication',
    ],
    procedure: [
      'Lower gear handle below 150 KIAS.',
      'Check gear-position lights, HYD PX, and circuit breakers.',
      'Cycle gear handle UP, then perform prescribed maneuvers to attempt gear extension.',
      'Land as soon as any safe gear indication is received.',
    ],
    nwcs: [],
    landing: 'Land as soon as any safe gear indication is received. No specific minimum landing criteria.',
  },
  {
    title: 'LANDING WITH UNSAFE GEAR INDICATIONS',
    memory: false,
    indications: [
      'One or more gear not indicated down and locked',
    ],
    procedure: [
      'Full gear-UP landing is the preferred configuration.',
      'Reduce fuel load. Select LDG flaps.',
      'Do NOT land with only nose gear down.',
      'If only main gears are down, keep nose off ground as long as possible.',
      'If only one main gear is down, keep the other wing up as long as possible.',
      'Execute ESOD once landing is assured.',
    ],
    nwcs: [],
    landing: 'No specific minimum landing criteria.',
  },
  {
    title: 'LANDING GEAR EMERGENCY EXTENSION',
    memory: false,
    indications: [
      'Normal gear extension has failed',
    ],
    procedure: [
      'Below 150 KIAS — lower gear handle.',
      'Pull EMER LDG GR extension handle.',
      'Verify gear-position lights.',
    ],
    nwcs: [],
    landing: 'No specific minimum landing criteria.',
  },
  {
    title: 'LANDING WITH COCKED NOSE WHEEL',
    memory: false,
    indications: [
      'Nose wheel not aligned with aircraft centerline',
    ],
    procedure: [
      'Treat essentially the same as a nose-gear-up landing.',
      'After touchdown, check directional control.',
      'If directional control is good — taxi back.',
      'If directional control is bad — get a tow.',
    ],
    nwcs: [],
    landing: 'Check directional control immediately after touchdown.',
  },
  ],
};

// ── Component info data ───────────────────────────────────────────────
export const HYD_INFO = {
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
  relief: {
    title: '3500 psi System Relief Valve',
    items: [
      'Protects the main hydraulic system from over-pressurization',
      'Opens at 3250–3500 psi to vent excess pressure back to reservoir',
      'Passive valve — no cockpit control',
      'Separate from the emergency system relief valve',
    ],
  },
  pxtx: {
    title: 'Pressure Transmitter (PX TX)',
    items: [
      'Converts hydraulic system pressure to an electrical signal',
      'Feeds the HYD PRESS gauge on the EICAS display',
      'Triggers CHK ENG caution if pressure falls below 1800 or exceeds 3500 psi',
      'Located on the airframe side of the firewall',
    ],
  },
  overboard: {
    title: 'Overboard Relief Valve',
    items: [
      'Protects the reservoir from over-pressurization by bleed air',
      'Vents excess pressure overboard when reservoir pressure exceeds limits',
      'Passive valve — no cockpit control',
    ],
  },
  returnfilter: {
    title: 'Return Filter',
    items: [
      'Filters fluid returning from actuators before re-entering reservoir',
      'Protects reservoir and pump from downstream contamination',
    ],
  },
  cvalve: {
    title: 'Check Valve',
    items: [
      'Prevents backflow from airframe side toward the engine driven pump',
      'Allows one-directional flow only — supply to system',
    ],
  },
  ecvalve: {
    title: 'Emergency Check Valve',
    items: [
      'Prevents backflow from the emergency system into the main supply line',
      'Ensures accumulator pressure is isolated when main system is pressurized',
    ],
  },
  ldggear: {
    title: 'Landing Gear System',
    items: [
      'Three actuators: LH Main, Nose Gear, RH Main',
      'Normal extend/retract cycle approximately 6 seconds',
      'Separate gear-door selector valve controls door sequencing',
      'Emergency extension via accumulator through LDG GR EMER EXT SEL VLV',
      'Gear handle must be below 150 KIAS before extension',
    ],
  },
  fuse: {
    title: 'Hydraulic Fuse',
    items: [
      'Limits fluid loss in the emergency system to 0.5 quarts maximum',
      'Triggers at flow rate exceeding 0.25 GPM',
      'Closes permanently once triggered — non-resettable in flight',
      'Protects accumulator pressure from depleting due to a downstream leak',
    ],
  },
  hyddump: {
    title: 'Hydraulic Dump Handle',
    items: [
      'Vents accumulator pressure to return — used on ground for maintenance',
      'Rapidly reduces emergency system pressure to zero',
    ],
  },
  erelief: {
    title: 'Emergency Pressure Relief Valve',
    items: [
      'Protects emergency system from over-pressurization',
      'Opens at 3500 psi to vent excess pressure',
      'Separate from the main system relief valve',
    ],
  },
  emerldggr: {
    title: 'LDG Gear Emergency Extension Selector Valve',
    items: [
      'Opened by pulling the EMER LDG GR handle',
      'Directs accumulator pressure to gear actuators for emergency extension',
      'Bypasses normal electrical gear selector — purely mechanical/hydraulic',
      'Gear cannot be retracted after emergency extension',
    ],
  },
  emerflaps: {
    title: 'Flap Emergency Extension Solenoid',
    items: [
      'Electrically actuated solenoid — energized when EMER LDG GR handle is pulled',
      'Directs accumulator pressure to flap actuators',
      'Allows emergency flap extension when main system has failed',
    ],
  },
};

// ── Shared Info Modal ─────────────────────────────────────────────────
// Props:
//   title   — string, displayed as section heading
//   items   — string[], rendered as bullet list
//   photos  — (future) array of { src, caption } objects
//   onClose — function called to dismiss
export function InfoModal({ title, items = [], photos = [], onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(4,10,20,0.82)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: MC.bg,
          border: `0.5px solid ${MC.stroke}`,
          borderRadius: 7,
          width: '100%', maxWidth: 480,
          maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          fontFamily: FONT,
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowY: 'auto', padding: '14px 18px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: MC.text }}>
              {title?.toUpperCase()}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: MC.muted, fontSize: 16, lineHeight: 1, padding: '0 0 0 12px', flexShrink: 0,
              }}
            >×</button>
          </div>

          {items.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 14, color: MC.muted, fontSize: 11, lineHeight: 1.8 }}>
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}

          {photos.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ borderRadius: 4, overflow: 'hidden', border: `0.5px solid ${MC.stroke}` }}>
                  <img src={photo.src} alt={photo.caption ?? ''} style={{ width: '100%', display: 'block' }} />
                  {photo.caption && (
                    <div style={{ padding: '5px 10px', fontSize: 9, color: MC.muted, letterSpacing: '0.06em' }}>
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
