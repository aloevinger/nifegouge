// ─────────────────────────────────────────────────────────────────────────────
//  FAM4204  —  Electrical System Modal Content
//  Sources: ELEC.pdf (TO 1T-6B-1CL-1 / NAVAIR A1-T6BAA-FCL-100),
//           Briefing_Outlines.pdf (FAM4204)
//  Structure mirrors HydraulicModalData.js — add ELEC_INFO component data later.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
//  VERBATIM
// ─────────────────────────────────────────────────────────────────────────────

export const ELEC_VERBATIM = {
  heading: 'Electrical System NATOPS Intro (helpful to memorize)',
  quote: `"The electrical system includes a 28 VDC, 300 amp starter/generator, an aerobatic 24 VDC lead-acid battery, a 24 VDC auxiliary battery, and an external power receptacle. Electrical power is distributed through the battery and generator buses connected by the bus tie switch. Circuit breakers, providing protection, are located in both cockpits; battery bus on the left console panels and generator bus on the right. Black circuit breaker collar extensions are installed to provide easy identification and operation of high-use circuit breakers."`,
};

// ─────────────────────────────────────────────────────────────────────────────
//  NUMBERS
// ─────────────────────────────────────────────────────────────────────────────

export const ELEC_NUMBERS = {
  heading: 'Electrical System Numbers',
  items: [
    // ── Starter / Generator ──────────────────────────────────────────────────
    {
      value: '28 VDC  /  300 A',
      label: 'Starter/generator rated output voltage and amperage',
      highlight: false,
    },
    {
      value: '28.0 – 28.5 V',
      label: 'Normal generator voltage — ground and inflight',
      highlight: false,
    },
    {
      value: '+50 to −2 A',
      label: 'Normal ammeter range inflight (positive = battery charging)',
      highlight: false,
    },
    {
      value: '≥ 25 V',
      label: 'Minimum generator voltage required to charge the battery',
      highlight: true,
    },
    {
      value: '≥ 27 V',
      label: 'Minimum generator voltage during ops checks',
      highlight: true,
    },
    // ── Main Battery ─────────────────────────────────────────────────────────
    {
      value: '24 VDC  /  42 Ah',
      label: 'Main battery — voltage and capacity',
      highlight: false,
    },
    {
      value: '≥ 23.5 V',
      label: 'Minimum battery voltage to attempt a battery ground start',
      highlight: true,
    },
    {
      value: '≥ 22 V',
      label: 'Minimum battery voltage to connect external power',
      highlight: true,
    },
    {
      value: '~30 min',
      label: 'Battery bus operation time with Bus Tie OPEN and generator failed',
      highlight: true,
    },
    // ── Auxiliary Battery ────────────────────────────────────────────────────
    {
      value: '24 VDC  /  4 Ah  (5 Ah HR)',
      label: 'Auxiliary battery — voltage and capacity',
      highlight: false,
    },
    {
      value: '~30 min',
      label: 'Aux battery endurance powering BFI, Standby VHF (COM2), and Fire 1',
      highlight: true,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  EICAS MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

export const ELEC_EICAS = {
  heading: 'Electrical System EICAS Messages',
  items: [
    // ── Warnings ─────────────────────────────────────────────────────────────
    {
      label: 'GEN BUS',
      color: 'warning',
      cause:
        'Actual loss of the generator bus (and associated avionics buses). Items on the battery bus remain powered as long as the battery and bus tie are functional.',
      response: 'Execute GENERATOR BUS INOPERATIVE. Place BUS TIE switch — NORM. Land as soon as practical.',
    },
    {
      label: 'BAT BUS',
      color: 'warning',
      cause:
        'Actual loss of the battery bus (and associated avionics buses), or failure of the current limiter on the battery bus side. May be accompanied by multiple CAS messages: TRIM OFF, OIL PX, HYDR FL LO, PMU STATUS. Most noticeable failures are the UFCP, center MFD, and right MFD.',
      response: 'Execute BATTERY BUS INOPERATIVE. Descend below 10,000 ft MSL (OBOGS/pressurization lost), open Bus Tie, select Aux Bat ON, Standby VHF ON, execute Landing Gear Emergency Extension prior to landing.',
    },
    {
      label: 'GEN',
      color: 'warning',
      cause:
        'Generator is inoperative — DC voltmeter will read below 25 V and ammeter will show discharging. Note: GEN also illuminates normally whenever the starter/generator is acting as a starter (cannot be both simultaneously).',
      response: 'Execute GENERATOR INOPERATIVE. STARTER switch — NORM (both), GEN switch — ON (front or back), GEN RESET — depress and hold for a minimum of 1 second. If generator remains inoperative, descend below 10,000 ft, GEN switch OFF (both), BUS TIE — OPEN. Land as soon as practical.',
    },
    {
      label: 'ADC FAIL',
      color: 'warning',
      cause:
        'Air data computer has failed (total or partial). Primary airspeed, altimeter, and VSI will be inoperative. TAD, aural gear warning, and transponder mode C also inoperative. Expect PMU STATUS caution after landing.',
      response: 'Execute AIR DATA COMPUTER FAILURE. Reference backup flight instrument as required. Check ADC circuit breaker (right front console) — reset if open.',
    },
    {
      label: 'EDM FAIL',
      color: 'warning',
      cause:
        'Engine data manager has failed. Pilot will lose ability to directly monitor engine, fuel, electrical, and hydraulic systems and cockpit pressurization. CAS messages CKPT PX, CKPT ALT, HYD FL LO, FUEL BAL, L FUEL LO, R FUEL LO, and FUEL BAL will display but are no longer monitoring their systems. PMU should remain online.',
      response: 'Execute ENGINE DATA MANAGER FAIL. Check EDM circuit breakers (left and right front console) — reset if open. If engine instrument displays on EICAS page do not return, land as soon as practical.',
    },
    // ── Cautions ─────────────────────────────────────────────────────────────
    {
      label: 'BUS TIE',
      color: 'caution',
      cause:
        'BUS TIE switch is open (normal if intentionally opened) or the bus tie relay has failed — battery and generator buses are isolated from each other.',
      response: 'Execute BUS TIE INOPERATIVE. BUS TIE switch — NORM. If caution remains, land as soon as practical.',
    },
    {
      label: 'IAC XTALK FAIL',
      color: 'caution',
      cause:
        'Loss of cross-talk communication between IAC 1 and IAC 2. Baro set, heading/airspeed bugs, minimums, radio altitude, mag/true compass setting, bingo fuel, clock, and G reset will operate independently in each cockpit. RPT ERROR will post if NORM/REPEAT switch is in REPEAT.',
      response: 'Execute IAC XTALK FAILURE. MFD/UFP REPEAT/NORM switch — NORM (both cockpits). Confirm PFD altimeter settings in each cockpit.',
    },
    {
      label: 'XPDR FAIL',
      color: 'caution',
      cause:
        'Transponder has failed. Other TCAS- and ADS-B-equipped aircraft and ATC may lose your transponder information. Placing transponder in standby will cause loss of all transponder functions (mode C, S, TCAS, ADS-B).',
      response: 'Execute XPDR FAILURE. Check XPDR circuit breaker (right front console) — reset if open. Confirm with ATC that transponder is not transmitting correctly and comply with ATC direction.',
    },
    {
      label: 'ADS-B FAIL',
      color: 'caution',
      cause:
        'Transponder indicates an ADS-B Out function failure. ADS-B information used by other ADS-B-equipped aircraft and ATC may be missing or in error. Direct effects on own-ship are minor.',
      response: 'Execute ADS-B OUT FAILURE. Confirm with ATC that ADS-B information is missing or in error. Comply with ATC direction and adjust mission as required.',
    },
    {
      label: 'IAC (1/2) FAIL',
      color: 'caution',
      cause:
        'The respective IAC has failed — loss of MFD displays or erratic displays in the associated cockpit. Front cockpit failures indicate IAC 1 failure; rear cockpit indicates IAC 2 failure.',
      response: 'Execute IAC FAILURE. Reference backup flight instrument, place NORM/REPEAT switch to NORM (both cockpits), check IAC1/IAC2 circuit breakers — reset if open. If failures persist, pull and reset failed IAC circuit breaker after 5 seconds. Land as soon as practical.',
    },
    {
      label: 'IRS FAIL',
      color: 'caution',
      cause:
        'Loss of attitude or heading display on HUD and MFD — inertial reference system has failed.',
      response: 'Execute IRS FAILURE. Reference backup flight instrument as required. Check IRS circuit breaker (left and right front console) — reset if open. Place aircraft in straight and level unaccelerated flight and monitor alignment status. Land as soon as practical.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  EMERGENCY PROCEDURES
// ─────────────────────────────────────────────────────────────────────────────

export const ELEC_EPS = {
  heading: 'Electrical System Emergency Procedures',
  items: [
    // ── 1 ─────────────────────────────────────────────────────────────────────
    {
      title: 'IAC FAILURE (SINGLE/DUAL)',
      subtitle: 'Loss of MFD Displays / Erratic Displays / Integrated Avionics System Synchronization Errors',
      memory: false,
      indications: [
        'Loss of MFD displays or erratic displays in one or both cockpits.',
        'Front cockpit failures/erratic displays indicate IAC 1 failure; rear cockpit indicates IAC 2 failure.',
        'Integrated avionics system synchronization errors.',
      ],
      procedure: [
        '1. Backup flight instrument — REFERENCE AS REQUIRED.',
        '2. NORM/REPEAT switch — NORM (BOTH COCKPITS).',
        '3. IAC1 and IAC2 circuit breakers (left and right front console) — CHECK, RESET IF OPEN.',
        'If IAC/MFD failures or erratic displays persist:',
        '4. Failed IAC circuit breaker(s) (left and right front console) — PULL, RESET AFTER 5 SECONDS.',
        'If IAC/MFD failures, erratic displays, or IAC synchronization errors persist:',
        '5. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 2 ─────────────────────────────────────────────────────────────────────
    {
      title: 'IRS FAILURE',
      subtitle: 'Loss of Attitude or Heading Display on HUD and MFD',
      memory: false,
      indications: [
        'Loss of attitude or heading display on HUD and MFD.',
      ],
      procedure: [
        '1. Backup flight instrument — REFERENCE AS REQUIRED.',
        '2. IRS circuit breaker (left and right front console) — CHECK, RESET IF OPEN.',
        '3. Place aircraft in straight and level unaccelerated flight and monitor alignment status.',
        '4. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 3 ─────────────────────────────────────────────────────────────────────
    {
      title: 'MFD FAILURE OR AVIONICS BUS FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'Loss of one or more MFD displays.',
        'May be accompanied by other avionics failures if an avionics bus has failed.',
      ],
      procedure: [
        'FOR MFD FAILURE WITH NO OTHER INDICATIONS:',
        '1. NORM/REPEAT switch in failed cockpit — REPEAT.',
        '2. MFD circuit breaker (left MFD right console, right and center MFD left console) — CHECK, RESET IF OPEN.',
        'FOR MFD FAILURE WITH OTHER AVIONICS FAILURES, BUT WITHOUT GEN BUS OR BAT BUS WARNING:',
        '3. FWD/AFT AVI circuit breakers (left and right front console) — CHECK, RESET IF OPEN.',
        '4. Backup flight instruments — REFERENCE AS REQUIRED.',
        'IF FWD AVIONICS GEN BUS REMAINS INOPERATIVE:',
        '5. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL if FWD avionics gen bus remains inoperative.',
    },
    // ── 4 ─────────────────────────────────────────────────────────────────────
    {
      title: 'UFCP FAILURE',
      subtitle: 'Blank UFCP Entry Windows / Data Entry Knob or System Button Non-Functioning',
      memory: false,
      indications: [
        'Blank UFCP entry windows.',
        'Data entry knob or system button non-functioning.',
      ],
      procedure: [
        '1. UFCP circuit breaker (left front console or left rear console) — CHECK, RESET IF OPEN.',
        '2. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 5 ─────────────────────────────────────────────────────────────────────
    {
      title: 'BACKUP FLIGHT INSTRUMENT DISPLAY FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'Backup flight instrument (BFI) display is blank or failed.',
      ],
      procedure: [
        '1. Place aircraft in straight and level unaccelerated flight.',
        '2. STBY INST circuit breaker (left front/left rear console) — CHECK, RESET IF OPEN.',
        '3. AFT STBY circuit breaker (left front console) — CHECK, RESET IF OPEN.',
        'If display does not return:',
        '4. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 6 ─────────────────────────────────────────────────────────────────────
    {
      title: 'ENGINE DATA MANAGER FAIL',
      subtitle: 'EDM FAIL Warning, or EDM A INOP / EDM B INOP Advisory — Total or Partial Loss of Engine Data Manager Information',
      memory: false,
      indications: [
        'EDM FAIL warning on EICAS.',
        'EDM A INOP or EDM B INOP advisory on EICAS.',
        'If EDM FAIL warning remains: total loss of engine data manager — CKPT PX, CKPT ALT, HYD FL LO, FUEL BAL, L FUEL LO, R FUEL LO, and FUEL BAL will display but are no longer monitoring their systems.',
      ],
      procedure: [
        '1. EDM circuit breakers (left and right front console) — CHECK, RESET IF OPEN.',
        'If engine instrument displays on EICAS page do not return:',
        '2. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL if engine instrument displays do not return.',
    },
    // ── 7 ─────────────────────────────────────────────────────────────────────
    {
      title: 'AIR DATA COMPUTER FAILURE',
      subtitle: 'ADC FAIL Warning, or ADC A INOP / ADC B INOP Advisory — Total or Partial Loss of Air Data Computer Information',
      memory: false,
      indications: [
        'ADC FAIL warning on EICAS.',
        'ADC A INOP or ADC B INOP advisory.',
        'If ADC FAIL warning remains: primary airspeed, altimeter, and VSI will be inoperative. TAD, aural gear warning, and transponder mode C also lost. Expect PMU STATUS caution after landing.',
      ],
      procedure: [
        '1. Backup flight instrument — REFERENCE AS REQUIRED.',
        '2. ADC circuit breaker (right front console) — CHECK, RESET IF OPEN.',
      ],
      landing: 'No specific landing criteria — use backup instruments and AOA.',
    },
    // ── 8 ─────────────────────────────────────────────────────────────────────
    {
      title: 'LOSS OF ICS/AUDIO',
      subtitle: '',
      memory: false,
      indications: [
        'Loss of intercom or audio in one or both cockpits.',
      ],
      procedure: [
        '1. Switch COMM lead to auxiliary cord (affected cockpit) — INITIATE AS REQUIRED.',
        '2. AUDIO circuit breaker (right front/rear and left front/rear console) — CHECK, RESET IF OPEN.',
        'If audio not re-established:',
        '3. EMR/NRM switch — SELECT EMR (BOTH).',
      ],
      landing: 'No specific landing criteria.',
    },
    // ── 9 ─────────────────────────────────────────────────────────────────────
    {
      title: 'AOA COMPUTER FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'Loss of AOA indication in the HUD.',
        'Loss of AOA indexer with landing gear down.',
      ],
      procedure: [
        '1. AOA circuit breaker (left front console) — CHECK, RESET IF OPEN.',
        '2. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 10 ────────────────────────────────────────────────────────────────────
    {
      title: 'GENERATOR INOPERATIVE',
      subtitle: '',
      memory: false,
      indications: [
        'GEN caution on EICAS.',
        'DC voltmeter below 25 V and ammeter discharging.',
      ],
      procedure: [
        '1. STARTER switch — NORM (BOTH).',
        '2. GEN switch — ON (FRONT OR BACK).',
        '3. GEN RESET switch — DEPRESS AND HOLD FOR A MINIMUM OF 1 SECOND.',
        'If generator remains inoperative (DC voltmeter below 25 V and ammeter discharging):',
        '4. Descent below 10,000 ft MSL — INITIATE (AS REQUIRED).',
        '5. GEN switch — OFF (BOTH).',
        '6. BUS TIE switch — OPEN (BUS TIE caution and GEN BUS warning illuminate).',
        '7. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 11 ────────────────────────────────────────────────────────────────────
    {
      title: 'GENERATOR BUS INOPERATIVE',
      subtitle: '',
      memory: false,
      indications: [
        'GEN BUS warning on EICAS.',
        'Actual loss of generator bus and associated avionics buses.',
        'Generator bus items lost — see Generator Bus Inoperative table.',
      ],
      procedure: [
        '1. BUS TIE switch — NORM.',
        '2. Land as soon as practical.',
      ],
      nwcs: [
        '1N — With an operating generator and the BUS TIE switch in NORM, the generator will continue to charge the battery and power the battery buses. Items on the generator bus will remain inoperative.',
      ],
      landing: 'Land as soon as PRACTICAL.',
    },
    // ── 12 ────────────────────────────────────────────────────────────────────
    {
      title: 'BATTERY BUS INOPERATIVE',
      subtitle: '',
      memory: false,
      indications: [
        'BAT BUS warning on EICAS.',
        'Actual loss of the battery bus (and associated avionics buses), or current limiter on battery bus side has failed.',
        'BAT BUS warning accompanied by multiple failures — TRIM OFF, OIL PX, HYDR FL LO, PMU STATUS.',
        'Most noticeable failures: UFCP, center MFD, and right MFD.',
        'If BAT BUS warning is accompanied by other indications of battery bus failure, execute procedure below.',
      ],
      procedure: [
        '1. Descent below 10,000 ft MSL — INITIATE (AS REQUIRED).',
        '2. BUS TIE switch — OPEN.',
        '3. AUX BAT switch — ON.',
        '4. Standby VHF — ON.',
        '5. LANDING GEAR EMERGENCY EXTENSION — EXECUTE PRIOR TO LANDING.',
      ],
      landing: 'Execute Landing Gear Emergency Extension prior to landing.',

    },
    // ── 13 ────────────────────────────────────────────────────────────────────
    {
      title: 'BUS TIE INOPERATIVE',
      subtitle: '',
      memory: false,
      indications: [
        'BUS TIE caution on EICAS.',
        'BUS TIE switch open or bus tie relay has failed — battery and generator buses isolated.',
      ],
      procedure: [
        '1. BUS TIE switch — NORM.',
        'If BUS TIE caution remains illuminated:',
        '2. Land as soon as practical.',
      ],
      landing: 'Land as soon as PRACTICAL if BUS TIE caution remains.',
    },
    // ── 14 ────────────────────────────────────────────────────────────────────
    {
      title: 'BATTERY AND GENERATOR FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'Both battery and generator have failed — complete loss of main electrical power.',
        'All MFDs, EICAS, and most aircraft systems will be inoperative.',
      ],
      procedure: [
        '1. Descent below 10,000 ft MSL — INITIATE (AS REQUIRED).',
        '2. AUX BAT switch — ON.',
        '3. Land as soon as possible.',
      ],
      landing: 'Land as soon as POSSIBLE.',
    },
    // ── 15 ────────────────────────────────────────────────────────────────────
    {
      title: 'ELECTRICAL FIRE',
      subtitle: '',
      memory: true,
      indications: [
        'Smoke, fumes, or burning smell in cockpit with suspected electrical source.',
        'Possible visible smoke or discoloration near electrical components.',
      ],
      procedure: [
        '*1. OBOGS — CHECK (BOTH):',
        '    a. OBOGS supply lever — ON.',
        '    b. OBOGS concentration lever — MAX.',
        '    c. OBOGS pressure lever — EMERGENCY.',
        '2. Descent below 10,000 ft MSL — INITIATE (AS REQUIRED).',
        '3. PRESSURIZATION switch — RAM/DUMP.',
        '4. BLEED AIR INFLOW switch — OFF.',
        'If smoke/fire persists:',
        '5. BAT and GEN switches — OFF.',
        '6. AUX BAT switch — OFF (AS REQUIRED).',
        '7. CFS handle safety pin — REMOVE (BOTH).',
        '8. CFS — ROTATE 90° COUNTERCLOCKWISE AND PULL (IF NECESSARY).',
        'If smoke/fire ceases:',
        '9. Restore electrical power — AS REQUIRED.',
        '10. Land as soon as possible.',
      ],
      landing: 'Land as soon as POSSIBLE.',
    },
    // ── 16 ────────────────────────────────────────────────────────────────────
    {
      title: 'IAC XTALK FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'IAC XTALK amber advisory on EICAS.',
        'Loss of cross-talk communication between IAC 1 and IAC 2.',
        'RPT ERROR may post if MFD/UFP REPEAT/NORM switch is in REPEAT position.',
      ],
      procedure: [
        '1. MFD/UFP REPEAT/NORM switch — NORM (BOTH COCKPITS).',
      ],
      landing: 'No specific landing criteria.',
    },
    // ── 17 ────────────────────────────────────────────────────────────────────
    {
      title: 'ADS-B OUT FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'ADS-B FAIL advisory on EICAS.',
        'Transponder indicates ADS-B Out function failure.',
      ],
      procedure: [
        '1. Confirm with Air Traffic Control (ATC) that ADS-B information is missing or in error. Comply with ATC direction and adjust mission as required.',
      ],
      landing: 'No specific landing criteria.',
    },
    // ── 18 ────────────────────────────────────────────────────────────────────
    {
      title: 'XPDR FAILURE',
      subtitle: '',
      memory: false,
      indications: [
        'XPDR FAIL advisory on EICAS.',
        'Transponder has failed or is transmitting in error.',
      ],
      procedure: [
        '1. XPDR circuit breaker (right front console) — CHECK, RESET IF OPEN.',
        'IF NORMAL OPERATION DOES NOT RESUME:',
        '2. Confirm with Air Traffic Control (ATC) that transponder is not transmitting correctly. Comply with ATC direction and adjust mission as required.',
      ],
      landing: 'No specific landing criteria.',
    },
  ],
};
