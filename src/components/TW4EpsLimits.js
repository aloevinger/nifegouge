import React, { useState, useEffect, useRef } from 'react';
import { getEPDivs, EP_NAMES, EP_LENGTHS, getRandomEPIndex, shuffleIndices} from './EPDivsData';

function TW4EpsLimits() {
  // Layout width parameters - adjust these to test different configurations
  const LAYOUT_GAP = '20px';            // Gap between columns
  const EPS_CONTAINER_MAX_WIDTH = '1200px';// Max width of container when showing EPs
  const SIDE_CONTROLS_WIDTH = '180px';  // Width of left and right image columns
  const CENTER_CONTENT_WIDTH = '750px'; // Max width of the EPs table content

  const [showEPs, setShowEPs] = useState(false);
  const [limitsData, setLimitsData] = useState({});
  const [epsData, setEpsData] = useState({});
  const [checkResults, setCheckResults] = useState({});
  const [currentEPIndex, setCurrentEPIndex] = useState(0);
  const [currentEPIndexArray, setCurrentEPIndexArray] = useState([shuffleIndices(20)]);
  const [isRandom, setisRandom] = useState(true);
  useEffect(() => {
    if(isRandom) {
      setCurrentEPIndexArray(shuffleIndices(20));
    }
  }, []); 
  // T-6B Limits Answer Keys
  const limitsAnswers = {
    // Engine Operating Limits Table
    takeoffTorque: '100',
    takeoffITT: '820',
    takeoffN1: '104',
    takeoffNp: '100',
    takeoffOilPressMin: '90',
    takeoffOilPressMax: '120',
    takeoffOilTempMin: '10',
    takeoffOilTempMax: '105',
    idleTorqueMin: '1',
    idleTorqueMax: '10',
    idleITT: '750',
    idleN1GroundBottom: '60',
    idleN1GroundTop: '61',
    idleN1Flight: '67',
    idleNpGroundBottom: '46',
    idleNpGroundTop: '50',
    idleOilPress: '90',
    idleOilTempGroundMin: '-40',
    idleOilTempGroundMax: '105',
    idleOilTempFlightMin: '10',
    idleOilTempFlightMax: '105',
    idleOilTempCautionMin: '106',
    idleOilTempCautionMax: '110',
    startITT5sec: '871-1000',
    startITTTime: '5',
    startOilPress: '200',
    startOilTemp: '-40',
    transientTorque5secMin: '101',
    transientTorque5secMax: '107',
    transientTorqueTime: '5',
    transientITT20sec: '821-870',
    transientITTTime: '20',
    transientN1: '104',
    transientNp20sec: '110',
    transientNpTime: '20',
    transientOilPressMin: '40',
    transientOilPressMax: '130',
    transientOilTemp10minMin: '106',
    transientOilTemp10minMax: '110',
    transientOilTempTime: '10',
    // Notes
    note21: "100",
    note22: "2",
    note41: "62",
    note42: "80",
    note51: "15",
    note52: "40",
    note53: "5",
    note61: "90",
    note62: "120",
    note63: "90",
    note71: "20",
    note81: "100",
    note82: "2",
    note83: "102",
    note101: "102",
    note102: "107",
    note103: "107",
    // Airspeed Limitations
    vleVfe: '150',
    vmo: '316',
    mmo: '0.67',
    turbPen: '207',
    // Starter Cycle Limitations
    starterCycles: '20 SEC',
    coolingFirst: '30 SEC',
    coolingSecond: '2 MIN',
    coolingThird: '5 MIN',
    coolingFourth: '30 MIN',
    // Flight Maneuvering Limitations
    invertedFlight: '60',
    zeroG: '5',
    negG: '60',
    negG25: '30',
    minPosG: '60',
    negOne: '-1',
    // Prohibited Maneuvers
    prohib1: 'INVERTED STALLS',
    prohib2: 'INVERTED SPINS',
    prohib3: 'SPINS WITH PCL ABOVE IDLE',
    prohib4: 'SPINS WITH THE LANDING GEAR FLAPS OR SPEED BRAKE EXTENDED',
    prohib5: 'SPINS WITH PMU OFF',
    prohib6: 'AGGRAVATED SPINS PAST TWO TURNS',
    prohib7: 'SPINS BELOW 10000 FEET PRESSURE ALTITUDE',
    prohib8: 'SPINS ABOVE 22000 FEET PRESSURE ALTITUDE',
    prohib9: 'ABRUPT CROSS-CONTROLLED (SNAP) MANEUVERS',
    prohib10: 'AEROBATIC MANEUVERS SPINS OR STALLS WITH A FUEL IMBALANCE GREATER THAN 50 POUNDS BETWEEN WINGS',
    prohib11: 'TAIL SLIDES',
    // Acceleration Limitations
    symCleanPos: '7.0',
    symCleanNeg: '-3.5',
    symGearFlapsPos: '2.5',
    symGearFlapsNeg: '0.0',
    asymCleanPos: '4.7',
    asymCleanNeg: '-1.0',
    asymGearFlapsPos: '2.0',
    asymGearFlapsNeg: '0.0',
    bankAngleChange: '180',
    // Other Limitations
    minBattStart: '23.5',
    maxCrosswindDry: '25',
    maxCrosswindWet: '10',
    maxCrosswindIcy: '5',
    iceFeet: '5000',
    iceType: 'LIGHT RIME',
    minBattVolt: '22.0',
    hydCautionMin: '1800',
    hydCautionMax: '3500',
    fuelCaution: '110',
    cockpitPress: '3.6',
    cockpitPressTol: '0.2',
    maxTailwind: '10',
    maxFuelFlow: '799'
  };
  // T-6B Emergency Procedures Answer Keys
  const epsAnswers = {
    // GROUND EMERGENCIES
    // ABORT START PROCEDURE
    as1: ['PCL - OFF ', 'or STARTER switch - AUTO/RESET'],
    
    // EMERGENCY ENGINE SHUTDOWN ON THE GROUND
    eesg1: ['PCL - OFF'],
    eesg2: ['FIREWALL SHUTOFF HANDLE - PULL'],
    eesg3: ['EMERGENCY GROUND EGRESS - AS REQUIRED'],
    
    // EMERGENCY GROUND EGRESS
    ege1: ['ISS MODE SELECTOR - SOLO'],
    ege2: ['SEAT SAFETY PIN - INSTALL (BOTH)'],
    ege3: ['PARKING BRAKE - AS REQUIRED'],
    ege4: ['CANOPY - OPEN'],
    ege5: ['CFS HANDLE SAFETY PIN - REMOVE (BOTH)'],
    ege6: ['CFS HANDLE - ROTATE 90 DEGREES COUNTERCLOCKWISE AND PULL (BOTH)'],
    ege7: ['UPPER FITTINGS, LOWER FITTINGS, AND LEG RESTRAINT GARTERS - RELEASE (BOTH)'],
    ege8: ['BAT\u200B, ', 'GEN, ', 'AND AUX BAT SWITCHES - OFF'],
    ege9: ['EVACUATE AIRCRAFT'],
    
    // TAKEOFF EMERGENCIES
    // ABORT
    abort1: ['PCL - IDLE'],
    abort2: ['BRAKES - AS REQUIRED'],
    
    // ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF
    efiat1: ['AIRSPEED - 110 KNOTS (MINIMUM)'],
    efiat2: ['PCL - AS REQUIRED'],
    efiat3: ['EMER LDG GR HANDLE - PULL (AS REQUIRED)'],
    efiat4: ['FLAPS - AS REQUIRED'],
    
    // IN-FLIGHT EMERGENCIES
    // ENGINE FAILURE DURING FLIGHT
    efdf1: ['ZOOM/GLIDE - 125 KNOTS (MINIMUM)'],
    efdf2: ['PCL - OFF'],
    efdf3: ['INTERCEPT ELP'],
    efdf4: ['AIRSTART - ATTEMPT IF WARRANTED'],
    efdf5: ['FIREWALL SHUTOFF HANDLE - PULL'],
    efdf6: ['EXECUTE FORCED LANDING OR EJECT'],
    
    // IMMEDIATE AIRSTART (PMU NORM)
    ia1: ['PCL - OFF'],
    ia2: ['STARTER SWITCH - AUTO/RESET'],
    ia3: ['PCL - IDLE, ', 'ABOVE 13% N1'],
    ia4: ['ENGINE INSTRUMENTS - MONITOR ITT, ', 'N1, ', 'AND OIL PRESSURE'],
    ia5: ['PCL - OFF'],
    ia6: ['FIREWALL SHUTOFF HANDLE - PULL'],
    ia7: ['EXECUTE FORCED LANDING OR EJECT'],
    ia8: ['PCL AS REQUIRED ', 'AFTER N1 REACHES IDLE RPM (APPROXIMATELY 67% N1)'],
    ia9: ['PEL - EXECUTE'],
    
    // UNCOMMANDED POWER CHANGES / LOSS OF POWER/ UNCOMMANDED PROPELLER FEATHER
    upc1: ['PCL - MID RANGE'],
    upc2: ['PMU SWITCH - OFF'],
    upc3: ['PROP SYS CIRCUIT BREAKER (Left Front Console) - PULL, ', 'IF Np STABLE BELOW 40%'],
    upc4: ['PCL - AS REQUIRED'],
    upc5: ['PEL - EXECUTE'],
    upc6: ['PROP SYS CIRCUIT BREAKER - RESET, AS REQUIRED'],
    upc7: ['PCL - OFF'],
    upc8: ['FIREWALL SHUTOFF HANDLE - PULL'],
    upc9: ['EXECUTE FORCED LANDING OR EJECT'],
    
    // COMPRESSOR STALLS
    cs1: ['PCL - SLOWLY RETARD BELOW STALL THRESHOLD'],
    cs2: ['DEFOG SWITCH - ON'],
    cs3: ['PCL - SLOWLY ADVANCE (AS REQUIRED)'],
    cs4: ['PEL - EXECUTE'],
    cs5: ['PCL - OFF'],
    cs6: ['FIREWALL SHUTOFF HANDLE - PULL'],
    cs7: ['EXECUTE FORCED LANDING OR EJECT'],
    
    // INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT
    idcf1: ['PCL - IDLE'],
    idcf2: ['CONTROLS - NEUTRAL'],
    idcf3: ['ALTITUDE - CHECK'],
    idcf4: ['RECOVER FROM UNUSUAL ATTITUDE'],
    
    // FIRE IN FLIGHT
    fif1: ['PCL - OFF'],
    fif2: ['FIREWALL SHUTOFF HANDLE - PULL'],
    fif3: ['FORCED LANDING - EXECUTE'],
    fif4: ['EJECT (BOTH)'],
    fif5: ['PEL - EXECUTE'],
    
    // SMOKE AND FUME ELIMINATION/ELECTRICAL FIRE
    sfe1: ['OBOGS - CHECK (BOTH)'],
    sfe1a: ['OBOGS supply lever - ON'],
    sfe1b: ['OBOGS concentration lever - MAX'],
    sfe1c: ['OBOGS pressure lever - EMERGENCY'],
    
    // CHIP DETECTOR WARNING
    cdw1: ['PCL - MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS'],
    cdw2: ['PEL - EXECUTE'],
    
    // OIL SYSTEM MALFUNCTION OR LOW OIL PRESSURE
    osm1: ['TERMINATE MANEUVER'],
    osm2: ['CHECK OIL PRESSURE; IF OIL PRESSURE IS NORMAL, CONTINUE OPERATIONS'],
    osm3: ['PCL - MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS'],
    osm4: ['PEL - EXECUTE'],
    
    // LOW FUEL PRESSURE
    lfp1: ['PEL - EXECUTE'],
    lfp2: ['BOOST PUMP SWITCH - ON'],
    
    // HIGH FUEL FLOW
    hff1: ['PEL - EXECUTE'],
    
    // OBOGS FAILURE/OVERTEMP/PHYSIOLOGICAL SYMPTOMS
    obogs1: ['GREEN RING - PULL (AS REQUIRED) (BOTH)'],
    obogs2: ['DESCENT BELOW 10,000 FEET MSL - INITIATE'],
    obogs3: ['OBOGS SUPPLY LEVER - OFF (BOTH)'],
    
    // EJECT
    eject1: ['EJECTION HANDLE - PULL (BOTH)'],
    
    // LANDING EMERGENCIES
    // FORCED LANDING
    fl1: ['AIRSPEED - 125 KIAS PRIOR TO EXTENDING LANDING GEAR'],
    fl2: ['EMER LDG GR HANDLE - PULL (AS REQUIRED)'],
    fl3: ['AIRSPEED - 120 KIAS MINIMUM UNTIL INTERCEPTING FINAL; 110 KIAS MINIMUM ON FINAL'],
    fl4: ['FLAPS - AS REQUIRED'],
    
    // PRECAUTIONARY EMERGENCY LANDING (PEL)
    pel1: ['TURN TO NEAREST SUITABLE FIELD'],
    pel2: ['CLIMB OR ACCELERATE TO INTERCEPT ELP'],
    pel3: ['GEAR, ', 'FLAPS, ', 'SPEED BRAKE - UP']
  };

  const handleLimitsChange = (field, value) => {
    setLimitsData(prev => ({ ...prev, [field]: value }));
    setCheckResults(prev => ({ ...prev, [field]: '' }));
  };

  const handleEPsChange = (field, value) => {
    setEpsData(prev => ({ ...prev, [field]: value }));
    setCheckResults(prev => ({ ...prev, [field]: '' }));
  };

  const refreshIndices = () => {
    setCurrentEPIndex(0);
    if(isRandom){
      setCurrentEPIndexArray(shuffleIndices(20));
    }else{
      setCurrentEPIndexArray([...Array(20).keys()]);
    }
  }

  const checkAnswers = () => {
    const results = {};
    const answers = showEPs ? epsAnswers : limitsAnswers;
    const data = showEPs ? epsData : limitsData;

    Object.keys(answers).forEach(key => {
      //Find input answer and correct answer and remove , - . ( ) ; and spaces
      let userAnswer = data[key] || '';
      userAnswer = userAnswer.replace(/[,\-–;().\/ ]/g, '');
      let correctAnswer = Array.isArray(answers[key]) ? answers[key].join('') : answers[key];
      correctAnswer = correctAnswer.replace(/[,\-–;().\/ ]/g, '');
      
      //Regex expression to determine if the answer is a range. ## - ## or ## to ##
      const isRange = /\d\s*(to|-)\s*-?\d/.test(correctAnswer);
      
      if (isRange) {
        const normalizedUser = userAnswer.toString().replace(/\s+/g, '').replace(/to/i, '-');
        const normalizedCorrect = correctAnswer.replace(/\s+/g, '').replace(/to/i, '-');
        
        if (normalizedUser === normalizedCorrect) {
          results[key] = 'correct';
        } else if (userAnswer === '') {
          results[key] = '';
        } else {
          results[key] = 'incorrect';
        }
      } else {
        const normalizedUser = userAnswer.toString().trim().toLowerCase();
        const normalizedCorrect = correctAnswer.toString().toLowerCase();

        if (normalizedUser === normalizedCorrect) {
          results[key] = 'correct';
        } else if (normalizedUser === '') {
          results[key] = '';
        } else if(normalizedCorrect.includes(normalizedUser)){
          results[key] = 'partial';
        } else {
          results[key] = 'incorrect';
        }
      }
    });

    setCheckResults(results);
  };

  const resetAnswers = () => {
    if (showEPs) {
      setEpsData({});
    } else {
      setLimitsData({});
    }
    setCheckResults({});
  };

  const getInputClass = (field) => {
    if (checkResults[field] === 'correct') return 'correct-answer';
    if (checkResults[field] === 'partial') return 'partial-answer';
    if (checkResults[field] === 'incorrect') return 'incorrect-answer';
    return '';
  };

  // Find next appropriate input and try it
  const tryNextEPStep = (controls) => {
    let currentKey = epDivs[currentEPIndexArray[currentEPIndex]].key;
    const allFields = Object.keys(epsAnswers).filter(key => key.startsWith(currentKey));
    const results = checkResults;
    // Find the first non-empty field
    let nextEmptyField = null;
    let emptyNum = 0;

    for (let i = 0; i < allFields.length; i++) {
      const field = allFields[i];
      
      if (epsData[field] == undefined || epsData[field] == ''||results[field] == 'partial') {
        nextEmptyField = field;
        emptyNum = i;
        break;
      }
    }
    if(!nextEmptyField){return}
    if(results[nextEmptyField] == 'partial'){controls = [...controls, epsData[nextEmptyField]]}

    let correctAnswers = epsAnswers[nextEmptyField]
    
    // Find all matching answers in order
    const matchingAnswers = correctAnswers.filter(answer =>
      controls.some(control =>
        answer.toLowerCase().includes(control.toLowerCase()) ||
        control.toLowerCase().includes(answer.toLowerCase())
      )
    );
    
    if(matchingAnswers.length == correctAnswers.length){
      epsData[nextEmptyField] = matchingAnswers.join('');
      const results = {};
      setCheckResults(results);
      if(emptyNum + 1 === EP_LENGTHS[currentEPIndexArray[currentEPIndex]]){
        checkAnswers();
      }
    }else if (matchingAnswers.length > 0){
      epsData[nextEmptyField] = matchingAnswers.join('');
      const results = {};
      results[nextEmptyField] = 'partial';
      setCheckResults(results);
    }else{
      const results = {};
      results[nextEmptyField] = 'incorrect';
      setCheckResults(results);
    }
  };

  const limitTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '-2px',
    border: '2px solid #000',
    widthMax: "700px"
  };

  const limitThStyle = {
    border: '1px solid #000',
    padding: '6px',
    backgroundColor: '#ddd',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '12px'
  };

  const limitTdStyle = {
    border: '1px solid #000',
    padding: '2px',
    textAlign: 'center',
    fontSize: '10px'
  };

  const inputStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #606060ff',
    background: 'white',
    textAlign: 'center',
    padding: '2px',
    fontSize: '11px',
    fontFamily: 'inherit'
  };

  const categoryHeaderStyle = {
    border: '1px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#000',
    color: 'white',
    padding: '6px 12px',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'center',
  };

  const epSectionStyle = {
    marginBottom: '6px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    maxWidth: "350px",
    margin: '0 auto'
  };

  const epHeaderStyle = {
    backgroundColor: '#ef5350',
    color: 'white',
    padding: '6px 12px',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'center',
    borderBottom: '1px solid #000'
  };

  const epStepStyle = {
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    borderBottom: '1px solid #ddd',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: 'white'
  };

  const epInputStyle = {
    flex: 1,
    padding: '2px',
    fontSize: '11px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontFamily: 'inherit'
  };

  const decisionPointStyle = {
    fontStyle: 'italic',
    padding: '6px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    fontSize: '11px'
  };

  const subStepStyle = {
    padding: '4px 12px 4px 32px',
    fontSize: '10px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  };

  //EP div structures retrieval
  const epDivs = getEPDivs({
    epsData,
    handleEPsChange,
    getInputClass,
    styles: {
      epSectionStyle,
      epHeaderStyle,
      epStepStyle,
      epInputStyle,
      decisionPointStyle,
      subStepStyle
    }
  });

  return (
    <>
      <div className="limits-eps-container" style={showEPs ? {maxWidth: EPS_CONTAINER_MAX_WIDTH} : {}}>
        <h1 style={{fontSize: '16px', marginBottom: '5px'}}>T-6B {showEPs ? 'EMERGENCY PROCEDURE CRITICAL ACTION MEMORY ITEMS' : 'OPERATING LIMITATIONS'}</h1>
        
        <p className="page-subtitle" style={{fontSize: '11px', marginBottom: '10px'}}>
          {showEPs 
            ? 'Every step can be solved by clicking on the correct control or step button. Clicking on any relevant control will fill the entire step. If you are unsure/can\'t find the right control, you can always type in the step'
            : 'For values with a range use the format "min-max" or "min to max"'
          }
        </p>
        
        {!showEPs ? (
          <div className="limits-page">
            {/* ENGINE OPERATING LIMITS TABLE */}
            <table style={limitTableStyle}>
              <thead>
                <tr>
                  <th style={limitThStyle} colSpan="7">ENGINE OPERATING LIMITS TABLE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={limitTdStyle}>POWER SETTING</td>
                  <td style={limitTdStyle}>TORQUE %</td>
                  <td style={limitTdStyle}>ITT C MAX</td>
                  <td style={limitTdStyle}>N1 % (1)</td>
                  <td style={limitTdStyle}>NP % (4)</td>
                  <td style={limitTdStyle}>OIL PRESSURE psi</td>
                  <td style={limitTdStyle}>OIL TEMP C</td>
                </tr>
                <tr>
                  <td style={limitTdStyle}>TAKEOFF/MAX</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffTorque')} value={limitsData.takeoffTorque || ''} onChange={(e) => handleLimitsChange('takeoffTorque', e.target.value)} /> (8)</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffITT')} value={limitsData.takeoffITT || ''} onChange={(e) => handleLimitsChange('takeoffITT', e.target.value)} /> MAX</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffN1')} value={limitsData.takeoffN1 || ''} onChange={(e) => handleLimitsChange('takeoffN1', e.target.value)} /> MAX</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffNp')} value={limitsData.takeoffNp || ''} onChange={(e) => handleLimitsChange('takeoffNp', e.target.value)} /> MAX (2)</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffOilPressMin')} value={limitsData.takeoffOilPressMin || ''} onChange={(e) => handleLimitsChange('takeoffOilPressMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffOilPressMax')} value={limitsData.takeoffOilPressMax || ''} onChange={(e) => handleLimitsChange('takeoffOilPressMax', e.target.value)} /> (6)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffOilTempMin')} value={limitsData.takeoffOilTempMin || ''} onChange={(e) => handleLimitsChange('takeoffOilTempMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('takeoffOilTempMax')} value={limitsData.takeoffOilTempMax || ''} onChange={(e) => handleLimitsChange('takeoffOilTempMax', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={limitTdStyle}>IDLE</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleTorqueMin')} value={limitsData.idleTorqueMin || ''} onChange={(e) => handleLimitsChange('idleTorqueMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleTorqueMax')} value={limitsData.idleTorqueMax || ''} onChange={(e) => handleLimitsChange('idleTorqueMax', e.target.value)} /> %(9) (ground)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '25px'}} className={getInputClass('idleITT')} value={limitsData.idleITT || ''} onChange={(e) => handleLimitsChange('idleITT', e.target.value)} /> MAX</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '25px'}} className={getInputClass('idleN1GroundBottom')} value={limitsData.idleN1GroundBottom || ''} onChange={(e) => handleLimitsChange('idleN1GroundBottom', e.target.value)} /> <span style={{fontSize: '9px'}}>to</span>
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleN1GroundTop')} value={limitsData.idleN1GroundTop || ''} onChange={(e) => handleLimitsChange('idleN1GroundTop', e.target.value)} /><span style={{fontSize: '9px'}}>(ground)</span><br/>
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleN1Flight')} value={limitsData.idleN1Flight || ''} onChange={(e) => handleLimitsChange('idleN1Flight', e.target.value)} /> <span style={{fontSize: '9px'}}>Min (flight)</span>
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleNpGroundBottom')} value={limitsData.idleNpGroundBottom || ''} onChange={(e) => handleLimitsChange('idleNpGroundBottom', e.target.value)} /> to
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleNpGroundTop')} value={limitsData.idleNpGroundTop || ''} onChange={(e) => handleLimitsChange('idleNpGroundTop', e.target.value)} /> <br/>(ground)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilPress')} value={limitsData.idleOilPress || ''} onChange={(e) => handleLimitsChange('idleOilPress', e.target.value)} /> Min</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempGroundMin')} value={limitsData.idleOilTempGroundMin || ''} onChange={(e) => handleLimitsChange('idleOilTempGroundMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempGroundMax')} value={limitsData.idleOilTempGroundMax || ''} onChange={(e) => handleLimitsChange('idleOilTempGroundMax', e.target.value)} /> (Grnd)<br/>
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempFlightMin')} value={limitsData.idleOilTempFlightMin || ''} onChange={(e) => handleLimitsChange('idleOilTempFlightMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempFlightMax')} value={limitsData.idleOilTempFlightMax || ''} onChange={(e) => handleLimitsChange('idleOilTempFlightMax', e.target.value)} /> (Flt)<br/>
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempCautionMin')} value={limitsData.idleOilTempCautionMin || ''} onChange={(e) => handleLimitsChange('idleOilTempCautionMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('idleOilTempCautionMax')} value={limitsData.idleOilTempCautionMax || ''} onChange={(e) => handleLimitsChange('idleOilTempCautionMax', e.target.value)} /> (7)
                  </td>
                </tr>
                <tr>
                  <td style={limitTdStyle}>START</td>
                  <td style={{...limitTdStyle, background: '#606060ff', fontWeight: 'bold'}}>- - -</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '90px'}} className={getInputClass('startITT5sec')} value={limitsData.startITT5sec || ''} onChange={(e) => handleLimitsChange('startITT5sec', e.target.value)} /> <br/>
                    (<input type="text" style={{...inputStyle, width: '20px'}} className={getInputClass('startITTTime')} value={limitsData.startITTTime || ''} onChange={(e) => handleLimitsChange('startITTTime', e.target.value)} />  sec)
                  </td>
                  <td style={{...limitTdStyle, background: '#606060ff', fontWeight: 'bold'}}>---</td>
                  <td style={{...limitTdStyle, background: '#606060ff', fontWeight: 'bold'}}>---</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('startOilPress')} value={limitsData.startOilPress || ''} onChange={(e) => handleLimitsChange('startOilPress', e.target.value)} /> Max</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('startOilTemp')} value={limitsData.startOilTemp || ''} onChange={(e) => handleLimitsChange('startOilTemp', e.target.value)} /> Min</td>
                </tr>
                <tr>
                  <td style={limitTdStyle}>TRANSIENT</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientTorque5secMin')} value={limitsData.transientTorque5secMin || ''} onChange={(e) => handleLimitsChange('transientTorque5secMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientTorque5secMax')} value={limitsData.transientTorque5secMax || ''} onChange={(e) => handleLimitsChange('transientTorque5secMax', e.target.value)} />  <br/>
                    (<input type="text" style={{...inputStyle, width: '20px'}} className={getInputClass('transientTorqueTime')} value={limitsData.transientTorqueTime || ''} onChange={(e) => handleLimitsChange('transientTorqueTime', e.target.value)} /> sec) (10)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '90px'}} className={getInputClass('transientITT20sec')} value={limitsData.transientITT20sec || ''} onChange={(e) => handleLimitsChange('transientITT20sec', e.target.value)} />  <br/>
                   (<input type="text" style={{...inputStyle, width: '20px'}} className={getInputClass('transientITTTime')} value={limitsData.transientITTTime || ''} onChange={(e) => handleLimitsChange('transientITTTime', e.target.value)} /> sec)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientN1')} value={limitsData.transientN1 || ''} onChange={(e) => handleLimitsChange('transientN1', e.target.value)} /> MAX</td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '25px'}} className={getInputClass('transientNp20sec')} value={limitsData.transientNp20sec || ''} onChange={(e) => handleLimitsChange('transientNp20sec', e.target.value)} />
                    <span style={{fontSize: '9px'}}>(</span><input type="text" style={{...inputStyle, width: '20px'}} className={getInputClass('transientNpTime')} value={limitsData.transientNpTime || ''} onChange={(e) => handleLimitsChange('transientNpTime', e.target.value)} /><span style={{fontSize: '9px'}}>sec) (3)</span>
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientOilPressMin')} value={limitsData.transientOilPressMin || ''} onChange={(e) => handleLimitsChange('transientOilPressMin', e.target.value)} /> to 
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientOilPressMax')} value={limitsData.transientOilPressMax || ''} onChange={(e) => handleLimitsChange('transientOilPressMax', e.target.value)} /> (5)
                  </td>
                  <td style={limitTdStyle}><input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientOilTemp10minMin')} value={limitsData.transientOilTemp10minMin || ''} onChange={(e) => handleLimitsChange('transientOilTemp10minMin', e.target.value)} /> to
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('transientOilTemp10minMax')} value={limitsData.transientOilTemp10minMax || ''} onChange={(e) => handleLimitsChange('transientOilTemp10minMax', e.target.value)} />  <br/>
                    (<input type="text" style={{...inputStyle, width: '20px'}} className={getInputClass('transientOilTempTime')} value={limitsData.transientOilTempTime || ''} onChange={(e) => handleLimitsChange('transientOilTempTime', e.target.value)} /> minutes)
                  </td>
                </tr>
              </tbody>
            </table>

            {/* NOTES TABLE */}
            <table style={limitTableStyle}>
              <thead>
                <tr>
                  <th style={limitThStyle} colSpan="2">NOTES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>1.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    N<sub>1</sub> values presented for PMU ON. With PMU OFF, N<sub>1</sub> may vary from these values.
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>2.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    With PMU OFF, permissible maximum N<sub>P</sub> is {' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note21')} value={limitsData['note21'] || ''} onChange={(e) => handleLimitsChange('note21', e.target.value)} />{' +/- '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note22')} value={limitsData['note22'] || ''} onChange={(e) => handleLimitsChange('note22', e.target.value)} />{'%.'}
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>3.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Permissible at any operating condition “power setting” for completion of an in-flight emergency. 
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>4.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Avoid stabilized ground operation from{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note41')} value={limitsData['note41'] || ''} onChange={(e) => handleLimitsChange('note41', e.target.value)} />{' to '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note42')} value={limitsData['note42'] || ''} onChange={(e) => handleLimitsChange('note42', e.target.value)} />{'% '}N<sub>P</sub>
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>5.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Operation in this range permitted only during aerobatics or spins, and{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note51')} value={limitsData['note51'] || ''} onChange={(e) => handleLimitsChange('note51', e.target.value)} />{' to '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note52')} value={limitsData['note52'] || ''} onChange={(e) => handleLimitsChange('note52', e.target.value)} />{' psi for '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note53')} value={limitsData['note53'] || ''} onChange={(e) => handleLimitsChange('note53', e.target.value)} />{' seconds with PCL at IDLE'}
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>6.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Normal oil pressure during steady state conditions is{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note61')} value={limitsData['note61'] || ''} onChange={(e) => handleLimitsChange('note61', e.target.value)} />{' to '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note62')} value={limitsData['note62'] || ''} onChange={(e) => handleLimitsChange('note62', e.target.value)} />{' psi. Operation at oil pressure less than '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note63')} value={limitsData['note63'] || ''} onChange={(e) => handleLimitsChange('note63', e.target.value)} />{' '}
                     psi at flight idle or above is indicative of oil system malfunction. 
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>7.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Acceptable for ground operation at and below{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note71')} value={limitsData['note71'] || ''} onChange={(e) => handleLimitsChange('note71', e.target.value)} />{'% torque'}
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>8.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    The PMU will govern maximum torque at{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note81')} value={limitsData['note81'] || ''} onChange={(e) => handleLimitsChange('note81', e.target.value)} />{' +/- '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note82')} value={limitsData['note82'] || ''} onChange={(e) => handleLimitsChange('note82', e.target.value)} />{' %. Torque above '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note83')} value={limitsData['note83'] || ''} onChange={(e) => handleLimitsChange('note83', e.target.value)} />{' '}
                    % at a constant PCL setting and steady flight is indicative of a governing system malfunction. 
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>9.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    Allowable torque range with N<sub>P</sub> stabilized and PCL at IDLE. 
                  </td>
                </tr>
                <tr>
                  <td style={{...limitTdStyle, width: '3%', fontWeight: 'bold'}}>10.</td>
                  <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>
                    With the PMU on, torque between{' '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note101')} value={limitsData['note101'] || ''} onChange={(e) => handleLimitsChange('note101', e.target.value)} />{' to '}
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note102')} value={limitsData['note102'] || ''} onChange={(e) => handleLimitsChange('note102', e.target.value)} />{' '}
                    % is possible following rapid PCL movement or aerobatic maneuvers. Torque above
                    <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('note103')} value={limitsData['note103'] || ''} onChange={(e) => handleLimitsChange('note103', e.target.value)} />{' '}
                    % is a limiting system malfunction.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* TWO COLUMN LAYOUT WITH SEPARATE TABLES */}
            <div style={{display: 'flex', gap: '0px', alignItems: 'flex-start'}}>
              {/* LEFT COLUMN */}
              <div style={{flex: 1}}>
                {/* AIRSPEED LIMITATIONS */}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={limitThStyle} colSpan="2">AIRSPEED LIMITATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">MAXIMUM AIRSPEED GEAR DOWN (V<sub>LE</sub>) & FLAP DOWN (V<sub>FE</sub>){' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('vleVfe')} value={limitsData.vleVfe || ''} onChange={(e) => handleLimitsChange('vleVfe', e.target.value)} />{' KIAS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">MAX OPERATING (V<sub>MO</sub>){' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('vmo')} value={limitsData.vmo || ''} onChange={(e) => handleLimitsChange('vmo', e.target.value)} />{' KIAS '}
                        / MAX MACH (M<sub>MO</sub>){' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('mmo')} value={limitsData.mmo || ''} onChange={(e) => handleLimitsChange('mmo', e.target.value)} />{' MACH'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">TURBULENT AIR PENETRATION SPEED, MAXIMUM:{' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('turbPen')} value={limitsData.turbPen || ''} onChange={(e) => handleLimitsChange('turbPen', e.target.value)} />{' KIAS'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* PROHIBITED MANEUVERS */}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={{...limitThStyle, paddingTop: '20px', paddingBottom: '20px'}} colSpan="2">PROHIBITED MANEUVERS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">1. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib1')} value={limitsData.prohib1 || ''} onChange={(e) => handleLimitsChange('prohib1', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">2. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib2')} value={limitsData.prohib2 || ''} onChange={(e) => handleLimitsChange('prohib2', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">3. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib3')} value={limitsData.prohib3 || ''} onChange={(e) => handleLimitsChange('prohib3', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">4. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib4')} value={limitsData.prohib4 || ''} onChange={(e) => handleLimitsChange('prohib4', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">5. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib5')} value={limitsData.prohib5 || ''} onChange={(e) => handleLimitsChange('prohib5', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">6. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib6')} value={limitsData.prohib6 || ''} onChange={(e) => handleLimitsChange('prohib6', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">7. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib7')} value={limitsData.prohib7 || ''} onChange={(e) => handleLimitsChange('prohib7', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">8. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib8')} value={limitsData.prohib8 || ''} onChange={(e) => handleLimitsChange('prohib8', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">9. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib9')} value={limitsData.prohib9 || ''} onChange={(e) => handleLimitsChange('prohib9', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">
                        <span style={{display: 'inline'}}>10. </span>
                        <textarea
                          style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 30px)', height: 'auto', minHeight: '20px', resize: 'none', display: 'inline-block', verticalAlign: 'top', overflow: 'hidden'}}
                          className={getInputClass('prohib10')}
                          value={limitsData.prohib10 || ''}
                          onChange={(e) => {
                            handleLimitsChange('prohib10', e.target.value);
                            // Auto-resize height based on content
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">11. <input type="text" style={{...inputStyle, textAlign: 'left', width: 'calc(100% - 20px)'}} className={getInputClass('prohib11')} value={limitsData.prohib11 || ''} onChange={(e) => handleLimitsChange('prohib11', e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">THE AIRCRAFT HAS BEEN APPROVED ONLY FOR TRANSIT THROUGH <input type="text" style={{...inputStyle, width: '50px'}} className={getInputClass('iceFeet')} value={limitsData.iceFeet || ''} onChange={(e) => handleLimitsChange('iceFeet', e.target.value)} /> FEET OF <input type="text" style={{...inputStyle, width: '90px'}} className={getInputClass('iceType')} value={limitsData.iceType || ''} onChange={(e) => handleLimitsChange('iceType', e.target.value)} /> ICE.</td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MINIMUM BATTERY VOLTAGE:{' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('minBattVolt')} value={limitsData.minBattVolt || ''} onChange={(e) => handleLimitsChange('minBattVolt', e.target.value)} />{' VOLTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">HYDRAULIC CAUTION: &lt; 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('hydCautionMin')} value={limitsData.hydCautionMin || ''} onChange={(e) => handleLimitsChange('hydCautionMin', e.target.value)} /> PSI, &gt; 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('hydCautionMax')} value={limitsData.hydCautionMax || ''} onChange={(e) => handleLimitsChange('hydCautionMax', e.target.value)} /> PSI
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">FUEL CAUTION LIGHT: &lt; 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('fuelCaution')} value={limitsData.fuelCaution || ''} onChange={(e) => handleLimitsChange('fuelCaution', e.target.value)} /> 
                        POUNDS IN RESPECTIVE WING TANK
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">COCKPIT PRESSURIZATION SCHEDULE LIMIT: 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('cockpitPress')} value={limitsData.cockpitPress || ''} onChange={(e) => handleLimitsChange('cockpitPress', e.target.value)} /> 
                        +/- <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('cockpitPressTol')} value={limitsData.cockpitPressTol || ''} onChange={(e) => handleLimitsChange('cockpitPressTol', e.target.value)} /> PSI</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{flex: 1}}>
                {/* STARTER CYCLE LIMITATIONS */}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={limitThStyle} colSpan="2">STARTER CYCLE LIMITATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">STARTER DUTY CYCLE IS LIMITED TO FOUR{' '}
                        <input type="text" style={{...inputStyle, width: '45px'}} className={getInputClass('starterCycles')} value={limitsData.starterCycles || ''} onChange={(e) => handleLimitsChange('starterCycles', e.target.value)} />{' '}
                        CYCLES
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">COOLING PERIOD AFTER FIRST STARTER CYCLE{' '}
                        <input type="text" style={{...inputStyle, width: '45px'}} className={getInputClass('coolingFirst')} value={limitsData.coolingFirst || ''} onChange={(e) => handleLimitsChange('coolingFirst', e.target.value)} /> 
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">COOLING PERIOD AFTER SECOND STARTER CYCLE{' '}
                        <input type="text" style={{...inputStyle, width: '45px'}} className={getInputClass('coolingSecond')} value={limitsData.coolingSecond || ''} onChange={(e) => handleLimitsChange('coolingSecond', e.target.value)} /> 
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">COOLING PERIOD AFTER THIRD STARTER CYCLE{' '}
                        <input type="text" style={{...inputStyle, width: '45px'}} className={getInputClass('coolingThird')} value={limitsData.coolingThird || ''} onChange={(e) => handleLimitsChange('coolingThird', e.target.value)} /> 
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">COOLING PERIOD AFTER FOURTH STARTER CYCLE{' '}
                        <input type="text" style={{...inputStyle, width: '45px'}} className={getInputClass('coolingFourth')} value={limitsData.coolingFourth || ''} onChange={(e) => handleLimitsChange('coolingFourth', e.target.value)} /> 
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/*FLIGHT MANUEVERING LIMITATIONS*/}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={limitThStyle} colSpan="2">FLIGHT MANUEVERING LIMITATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px', width: '70%'}}>INVERTED FLIGHT</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('invertedFlight')} value={limitsData.invertedFlight || ''} onChange={(e) => handleLimitsChange('invertedFlight', e.target.value)} />{' sec'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>INTENTIONAL ZERO G FLIGHT</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('zeroG')} value={limitsData.zeroG || ''} onChange={(e) => handleLimitsChange('zeroG', e.target.value)} />{' sec'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>NEGATIVE G OPERATIONS</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('negG')} value={limitsData.negG || ''} onChange={(e) => handleLimitsChange('negG', e.target.value)} />{' sec'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>DO NOT EXCEED -2.5 G FOR LONGER THAN</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('negG25')} value={limitsData.negG25 || ''} onChange={(e) => handleLimitsChange('negG25', e.target.value)} />{' sec'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MIN. POS Gs UPRIGHT BEFORE ADDITIONAL NEG Gs </td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('minPosG')} value={limitsData.minPosG || ''} onChange={(e) => handleLimitsChange('minPosG', e.target.value)} />{' sec'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* ACCELERATION LIMITATIONS */}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={limitThStyle} colSpan="2">ACCELERATION LIMITATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px', width: '60%'}}>SYMMETRIC CLEAN</td>
                      <td style={limitTdStyle}>+ <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('symCleanPos')} value={limitsData.symCleanPos || ''} onChange={(e) => handleLimitsChange('symCleanPos', e.target.value)} /> TO 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('symCleanNeg')} value={limitsData.symCleanNeg || ''} onChange={(e) => handleLimitsChange('symCleanNeg', e.target.value)} /> Gs
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>SYMMETRIC GEAR & FLAPS EXTENDED</td>
                      <td style={limitTdStyle}>+ <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('symGearFlapsPos')} value={limitsData.symGearFlapsPos || ''} onChange={(e) => handleLimitsChange('symGearFlapsPos', e.target.value)} /> TO 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('symGearFlapsNeg')} value={limitsData.symGearFlapsNeg || ''} onChange={(e) => handleLimitsChange('symGearFlapsNeg', e.target.value)} /> Gs
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>ASYMMETRIC CLEAN</td>
                      <td style={limitTdStyle}>+ <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('asymCleanPos')} value={limitsData.asymCleanPos || ''} onChange={(e) => handleLimitsChange('asymCleanPos', e.target.value)} /> TO 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('asymCleanNeg')} value={limitsData.asymCleanNeg || ''} onChange={(e) => handleLimitsChange('asymCleanNeg', e.target.value)} /> Gs
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>ASYMMETRIC GEAR & FLAPS EXTENDED</td>
                      <td style={limitTdStyle}>+ <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('asymGearFlapsPos')} value={limitsData.asymGearFlapsPos || ''} onChange={(e) => handleLimitsChange('asymGearFlapsPos', e.target.value)} /> TO 
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('asymGearFlapsNeg')} value={limitsData.asymGearFlapsNeg || ''} onChange={(e) => handleLimitsChange('asymGearFlapsNeg', e.target.value)} /> Gs
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}} colSpan="2">UNCOORDINATED ROLLING MANEUVERS INITIATED AT {' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('negOne')} value={limitsData.negOne || ''} onChange={(e) => handleLimitsChange('negOne', e.target.value)} /> {' '}
                         G SHALL BE LIMITED TO A  {' '}
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('bankAngleChange')} value={limitsData.bankAngleChange || ''} onChange={(e) => handleLimitsChange('bankAngleChange', e.target.value)} /> {' '}
                        DEGREE BANK ANGLE CHANGE
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* OTHER LIMITATIONS */}
                <table style={limitTableStyle}>
                  <thead>
                    <tr>
                      <th style={limitThStyle} colSpan="2">OTHER LIMITATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px', width: '70%'}}>MIN VOLTAGE FOR BATTERY START</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('minBattStart')} value={limitsData.minBattStart || ''} onChange={(e) => handleLimitsChange('minBattStart', e.target.value)} />{' VOLTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MAX CROSSWIND FOR DRY RUNWAY</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('maxCrosswindDry')} value={limitsData.maxCrosswindDry || ''} onChange={(e) => handleLimitsChange('maxCrosswindDry', e.target.value)} />{' KNOTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MAX CROSSWIND FOR WET RUNWAY</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('maxCrosswindWet')} value={limitsData.maxCrosswindWet || ''} onChange={(e) => handleLimitsChange('maxCrosswindWet', e.target.value)} />{' KNOTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MAX CROSSWIND FOR ICY RUNWAY</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('maxCrosswindIcy')} value={limitsData.maxCrosswindIcy || ''} onChange={(e) => handleLimitsChange('maxCrosswindIcy', e.target.value)} />{' KNOTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MAX TAILWIND COMPONENT FOR TAKEOFF</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('maxTailwind')} value={limitsData.maxTailwind || ''} onChange={(e) => handleLimitsChange('maxTailwind', e.target.value)} />{' KNOTS'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{...limitTdStyle, textAlign: 'left', paddingLeft: '8px'}}>MAXIMUM FUEL FLOW</td>
                      <td style={limitTdStyle}>
                        <input type="text" style={{...inputStyle, width: '30px'}} className={getInputClass('maxFuelFlow')} value={limitsData.maxFuelFlow || ''} onChange={(e) => handleLimitsChange('maxFuelFlow', e.target.value)} />{' PPH OR LESS'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : ( 
          
        <div className="eps-page">
            {/* EPS LAYOUT WITH SIDE CONTROLS */}
            <div style={{display: 'flex', gap: LAYOUT_GAP, alignItems: 'flex-start', justifyContent: 'center'}}>
              {/* LEFT CONTROLS */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: SIDE_CONTROLS_WIDTH, flexShrink: 0.8, minWidth: '80px'}}>
                {/* Left Panel Image with clickable overlay */}
                <div style={{position: 'relative', width: '100%'}}>
                  <img src="/images/left.png" alt="Left Control" style={{width: '100%', height: 'auto', display: 'block'}} />
                  {/* Flaps */}
                  <div
                    onClick={() => tryNextEPStep(['flaps'])}
                    className = "click-style" style={{top: '23%', left: '60%', width: '35%', height: '4.7%'}}
                    title="Flaps"
                  />
                  {/* Throttle/PCL/Speed Brake */}
                  <div
                    onClick={() => tryNextEPStep(['PCL', 'Speed Brake'])}
                    className = "click-style" style={{top: '28%', left: '10%', width: '84%', height: '10%'}}
                    title="PCL/Speed Brake"
                  />
                  {/*Canopy Fracture System*/}
                  <div
                    onClick={() => tryNextEPStep(['CFS'])}
                    className = "click-style" style={{top: '48.7%', left: '10%', width: '70%', height: '4%'}}
                    title="CFS"
                  />
                  {/*Prop Sys Circuit Breaker*/}
                  <div
                    onClick={() => tryNextEPStep(['Prop'])}
                    className = "click-style" style={{top: '60.9%', left: '54%', width: '10%', height: '2%'}}
                    title="Prop Sys Circuit Breaker"
                  />
                  {/* Firewall Shutoff Handle*/}
                  <div
                    onClick={() => tryNextEPStep(['Firewall'])}
                    className = "click-style" style={{top: '85.5%', left: '7%', width: '50%', height: '9%'}}
                    title="Firewall Shutoff Handle"
                  />
                </div>
              </div>

          {/* CENTER - EPS CONTENT */}
          <div style={{flex: `0 1 ${CENTER_CONTENT_WIDTH}`, width: CENTER_CONTENT_WIDTH, alignItems: 'center', flexShrink: 1, minWidth: '300px'}}>
            <div style={{position: 'relative', width: '100%'}}>
              <img src="/images/croptop.png" alt="Top Control" style={{width: '100%', height: 'auto', display: 'block', minWidth: 0}} />
              <div
                onClick={() => tryNextEPStep(['Emer Ldg Gr'])}
                className = "click-style" style={{top: '60%', left: '6%', width: '5.5%', height: '9%'}}
                    title="Emer Ldg Gr"
              />
              <div
                onClick={() => tryNextEPStep(['Gear'])}
                className = "click-style" style={{top: '76%', left: '6%', width: '4%', height: '12%'}}
                    title="Landing Gear"
              />
              <div
                onClick={() => tryNextEPStep(['Brakes'])}
                className = "click-style" style={{top: '67%', left: '19%', width: '18.5%', height: '30%'}}
                    title="Brakes"
              />
              <div
                onClick={() => tryNextEPStep(['Brakes'])}
                className = "click-style" style={{top: '67%', left: '63%', width: '18.5%', height: '30%'}}
                    title="Brakes"
              />
              <div
                onClick={() => tryNextEPStep(['Defog'])}
                className = "click-style" style={{top: '89.5%', left: '45.2%', width: '2.5%', height: '4%'}}
                    title="Defog"
              />
              <div
                onClick={() => tryNextEPStep(['Parking Brake'])}
                className = "click-style" style={{top: '69.5%', left: '90%', width: '3%', height: '10.5%'}}
                    title="Parking Brake"
              />
              <div
                onClick={() => tryNextEPStep(['Airspeed', 'Speed', 'Zoom', 'Glide'])}
                className = "click-style" style={{top: '33%', left: '42.5%', width: '2%', height: '10%'}}
                    title="Airspeed"
              />
              <div
                onClick={() => tryNextEPStep(['Attitude'])}
                className = "click-style" style={{top: '33%', left: '46.5%', width: '6%', height: '10.5%'}}
                    title="Attitude"
              />
              <div
                onClick={() => tryNextEPStep(['Altitude', 'MSL'])}
                className = "click-style" style={{top: '33%', left: '54%', width: '3.6%', height: '10.5%'}}
                    title="Altitude"
              />
              <div
                onClick={() => tryNextEPStep(['Np'])}
                className = "click-style" style={{top: '31%', left: '73.5%', width: '2.8%', height: '1.4%'}}
                    title="NP"
              />
              <div
                onClick={() => tryNextEPStep(['Torque'])}
                className = "click-style" style={{top: '32.7%', left: '68%', width: '6.5%', height: '5.4%'}}
                    title="Torque"
              />
              <div
                onClick={() => tryNextEPStep(['Oil Press'])}
                className = "click-style" style={{top: '32.7%', left: '74.8%', width: '5.2%', height: '5.4%'}}
                    title="Oil Pressure"
              />
              <div
                onClick={() => tryNextEPStep(['Oil Temp'])}
                className = "click-style" style={{top: '38.7%', left: '74.8%', width: '5.2%', height: '6%'}}
                    title="Oil Temperature"
              />
              <div
                onClick={() => tryNextEPStep(['ITT'])}
                className = "click-style" style={{top: '38.7%', left: '69.5%', width: '5.2%', height: '6%'}}
                    title="ITT"
              />
              <div
                onClick={() => tryNextEPStep(['N1'])}
                className = "click-style" style={{top: '45%', left: '69.5%', width: '5.2%', height: '6%'}}
                    title="N1"
              />
              <div
                onClick={() => tryNextEPStep(['Hyd Press'])}
                className = "click-style" style={{top: '45%', left: '74.8%', width: '5.2%', height: '6%'}}
                    title="Hyd Pressure"
              />
            </div>
            <div style={{display: 'flex', gap: '2px', alignItems: 'flex-start', justifyContent: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '37.5%', flexShrink: 1, minWidth: '100px'}}>
                <div className="control-section" style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px'}}>
                  <button className="action-button" onClick={() => tryNextEPStep(['egress'])}>
                    EGE
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['iss'])}>
                    ISS
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['Seat', "Ejection Handle"])}>
                    Seat
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['canopy'])}>
                    Canopy
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['fittings'])}>
                    Fittings
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['terminate'])}>
                    Terminate Maneuver
                  </button>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '25%', flexShrink: 1, alignItems: 'center', minWidth: '60px'}}>
                <img src="/images/stick.png" alt="Control Stick"
                style={{width: '100%', height: 'auto', display: 'block', cursor: 'pointer', minWidth: 0}}
                onClick={() => tryNextEPStep(['Attitude', 'Speed', 'Zoom', 'Glide', 'Control', 'Descent'])}
                title="Control Stick"/>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '37.5%', flexShrink: 1, minWidth: '100px'}}>
                <div className="control-section" style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px'}}>
                  <button className="action-button" onClick={() => tryNextEPStep(['forced landing', 'eject'])}>
                    Forced Landing/Eject
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['pel'])}>
                    PEL
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['elp'])}>
                    ELP
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['airstart'])}>
                    Airstart
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['green ring'])}>
                    Green ring
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['suitable'])}>
                    TTNSF
                  </button>
                  <button className="action-button" onClick={() => tryNextEPStep(['evacuate'])}>
                    Evacuate
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{width: '100%', alignItems: 'center', minHeight: '350px', margin: '0 auto'}}>
            {epDivs[currentEPIndexArray[currentEPIndex]]}</div>
            <div className="navigation-buttons">
              <button style={{minWidth: '147px'}} onClick={() => {
                setisRandom(!isRandom);
                refreshIndices();
                setEpsData({})}}>
                {isRandom ? "Sequential " : "Random "} Order
              </button>
              <button onClick={() => setCurrentEPIndex(currentEPIndex-1)} disabled={currentEPIndex === 0}>
                Previous
              </button>
              <span className="ep-counter" style={{minWidth: '61px'}}>
                {currentEPIndex + 1} of {currentEPIndexArray.length}
              </span>
              <button onClick={() => setCurrentEPIndex(currentEPIndex+1)} disabled={currentEPIndex === currentEPIndexArray.length - 1}>
                Next
              </button>
              <button style={{color: 'transparent'}}>
                NWC and all steps
              </button>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: SIDE_CONTROLS_WIDTH, flexShrink: 0.8, minWidth: '80px'}}>

            {/* Right Panel Image with clickable overlay */}
            <div style={{position: 'relative', width: '100%'}}>
              <img src="/images/right.png" alt="Right Control" style={{width: '100%', height: 'auto', display: 'block'}} />
              {/* BAT Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['bat\u200B'])}
                className = "click-style" style={{top: '1.5%', left: '20%', width: '10%', height: '2%'}}
                title="BAT Switch"
              />
              {/* GEN Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['gen'])}
                className = "click-style" style={{top: '1.5%', left: '38.5%', width: '10%', height: '2%'}}
                title="GEN Switch"
              />
              {/* AUX BAT Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['AUX'])}
                className = "click-style" style={{top: '1.5%', left: '55.5%', width: '10%', height: '2%'}}
                title="AUX BAT Switch"
              />
              {/* STARTER Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['starter'])}
                className = "click-style" style={{top: '6.8%', left: '15%', width: '10%', height: '2%'}}
                title="Starter Switch"
              />
              {/* PMU Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['pmu'])}
                className = "click-style" style={{top: '12.3%', left: '75%', width: '10%', height: '2%'}}
                title="PMU Switch"
              />
              {/* BOOST PUMP Switch Clickable Area */}
              <div
                onClick={() => tryNextEPStep(['boost pump'])}
                className = "click-style" style={{top: '12.3%', left: '59.5%', width: '10%', height: '2%'}}
                title="Boost Pump Switch"
              />
              {/* OBOGS Controls Area */}
              <div
                onClick={() => tryNextEPStep(['OBOGS - Ch', 'supply'])}
                className = "click-style" style={{top: '35.7%', left: '76%', width: '10%', height: '4%'}}
                title="OBOGS Supply Lever"
              />
              <div
                onClick={() => tryNextEPStep(['OBOGS - Ch', 'concentration'])}
                className = "click-style" style={{top: '35.7%', left: '43.5%', width: '10%', height: '4%'}}
                title="OBOGS Concentration Lever"
              />
              <div
                onClick={() => tryNextEPStep(['OBOGS - Ch', 'pressure'])}
                className = "click-style" style={{top: '35.7%', left: '11%', width: '10%', height: '4%'}}
                title="OBOGS Pressure Lever"
              />
            </div>
          </div>
        </div>
        </div>
        )}
        <div className="button-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => setShowEPs(!showEPs)}>
            Switch to {showEPs ? 'Limits' : 'Emergency Procedures'}
          </button>
          <button onClick={checkAnswers}>Check Answers</button>
          <button onClick={resetAnswers}>Reset</button>
        </div>
      </div>
    </>
  );
}

export default TW4EpsLimits;
