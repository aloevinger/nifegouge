import React, { useState, useEffect} from 'react';
import { getEPDivs, EP_LENGTHS, EP_ANSWERS} from './EPDivsData';
import { getQuadDivs, QUAD_LENGTHS, QUAD_ANSWERS} from './QuadfoldData';

function TW4Cockpit() {
  // Layout width parameters - adjust these to test different configurations
  const LAYOUT_GAP = '20px';            // Gap between columns
  const CONTAINER_MAX_WIDTH = '1100px';// Max width of container when showing EPs
  const SIDE_CONTROLS_WIDTH = '160px';  // Width of left and right image columns
  const CENTER_CONTENT_WIDTH = '650px'; // Max width of the EPs table content

  // Helper function to shuffle array (for randomized order)
  const shuffleIndices = (length) => {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  };

  const [inputData, setInputData] = useState({});
  const [checkResults, setCheckResults] = useState({});
  const [activeHints, setActiveHints] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexArray, setCurrentIndexArray] = useState([shuffleIndices(20)]);
  const [isRandom, setisRandom] = useState(true);
  const [currentDivKey, setCurrentDivKey] = useState('epDivs');
  const [inputAnswers, setInputAnswers] = useState(EP_ANSWERS);
  const [inputLengths, setInputLengths] = useState(EP_LENGTHS);
  
  useEffect(() => {
    if(isRandom) {
      setCurrentIndex(0)
      setCurrentIndexArray(shuffleIndices(20));
    }
  }, []);

  // Dictionary mapping clickable area IDs to their control arrays
  const clickableControls = {
    // Left panel
    'trimIndi' : ['Tri\u200Bm Indicator'],
    'floodLight' : ['floodLight'],
    'sideLight' : ['sideLight'],
    'instLight' : ['instLight'],
    'trimAid': ['tri\u200Bm aid'],
    'ldgLight': ['landing/'],
    'taxiLight': ['taxi light'],
    'anticollLight': ['anti-coll light'],
    'navLight': ['nav light'],
    'trimDisco': ['Tri\u200Bm Disconnect'],
    'flaps': ['flaps'],
    'pcl': ['PCL', 'Speed Brake', 'Accelerate', 'trim'],
    'altLdgGrTest': ['System test', 'alt audio', 'ldg gr audio'],
    'ovrSpdOvrGTest': ['System test', 'ovr spd audio', 'ovr g audio'],
    'aoaSystemTest': ['System test', 'AOA syst'],
    'bingoFuelTest': ['System test', 'bingo fuel audio'],
    'lampTest': ['System test', 'Lamp test'],
    'fireDetection': ['System test', 'Fire detection'],
    'seatHeight': ['sea\u200Bt height'],
    'auxBatTest': ['System test', 'AUX BAT TEST'],
    'cfs': ['CFS'],
    'prop': ['Prop'],
    'fdrlgt': ['FD\u200BR'],
    'firewall': ['Firewall'],
    'antiG': ['anti-g'],

    // Center top panel
    'masterArm': ['Master Arm'],
    'emerLdgGr': ['Emer Ldg Gr'],
    'flapIndi': ['Flap Indicator'],
    'gear': ['Gear'],
    'gearlgt': ['Gea\u200Br Light'],
    'brakes': ['Brakes', 'Rudder Pedals'],
    'com1': ['COM1'],
    'com2': ['COM2'],
    'navcom': ['NAVCOM'],
    'dme': ['DME'],
    'mkr': ['MKR'],
    'vox': ['VOX'],
    'emrnrm': ['EMR/NRM'],
    'ventcon': ['vent control lever'],
    'defog': ['Defog'],
    'elt': ['elt'],
    'parkingBrake': ['Parking Brake'],
    'navMenu': ['MFD ','database','location', 'alignment', "FMS"],
    'tcas': ['TCAS'],
    'tcasrng': ['TCA\u200BS Range'],
    'mastwarn': ["Master Warning"],
    'mastcaut': ["Master Caution"],
    'firelight': ["Fire Light"],
    'redaoa': ["Red Chevron"],
    'amberaoa': ["Amber Donut"],
    'greenaoa': ["Green Chevron"],
    'clock' : ['clock'],
    'aoaindi': ["AOA Indicator"],
    'airspeed': ['Airspeed', ', speed', 'Zoom', 'Glide', 'Accelerate', 'flight instruments', 'PFD'],
    'attitude': ['Attitude', 'flight instruments', 'PFD'],
    'altitude': ['Altitude', 'MSL', 'Climb', 'Descen', 'flight instruments', 'PFD'],
    'vsi': ['VSI'],
    'slipskid': ["slip skid"],
    'turni': ["turn indi"],
    'headi': ["Heading indi"],
    'greset': ['G Reset'],
    'fuelquan': ['Fuel Quantity', 'Fuel B\u200Balance'],
    'np': ['N\u200Bp'],
    'torque': ['Torque', "Engine Instruments"],
    'oilPress': ['Oil Press', "Engine Instruments"],
    'oilTemp': ['Oil Temp', "Engine Instruments"],
    'itt': ['ITT', "Engine Instruments"],
    'n1': ['N1', "Engine Instruments"],
    'hydPress': ['Hyd Press', "Engine Instruments"],
    'bingo': ['Bingo Set'],
    'fuelflow': ['Fuel Flow'],
    'ioat': ['IOAT'],
    'voltamps': ['Volts', 'Amps'],
    'altdelta': ['P\u200Bressurization'],
    'uhf': ['uhf'],
    'vhf': ['vhf'],
    'vor': ['vor'],
    'transponder': ['transponder'],
    'pfdbut': ['flags'],
    'sysbut': ['System button'],
    'hudcage': ['hudcage'],
    'hudlgt': ['hudlgt'],
    'mfdrep': ['mfdrep'],
    'lgthud': ['lgthud'],
    'lgtufcp': ['lgtufcp'],
    'baroset': ['altimeter'],
    'bfi': ['BFI'],
    'bfiset': ['altimete2r'],
    'eicas': ['eicas'],

    // Center buttons
    'ege': ['egress'],
    'iss': ['iss'],
    'seat': ['Seat', 'Ejection Handle', 'strap'],
    'canopy': ['canopy'],
    'fittings': ['fittings', 'strap'],
    'mask': ['mask', 'regulator', 'oxygen hose'],
    'terminate': ['terminate'],
    'expo': ['external power'],
    'loose': ['loose items'],
    'stick': ['Attitude', 'Zoom', 'Glide', 'Controls', 'Descent', 'Climb', 'NWS', 'Nosewheel Steering', 'Nose wheel Steering', 'trim', 't\u200Brim', 'gust lock'],
    'forcedLanding': ['forced landing', 'eject'],
    'pel': ['pel'],
    'elp': ['elp'],
    'airstart': ['airstart'],
    'greenRing': ['green ring'],
    'ttnsf': ['suitable'],
    'evacuate': ['evacuate'],
    'chocks': ['chocks'],
    'propeller': ['pro\u200Bp'],

    // Right panel
    'bat': ['bat\u200B'],
    'gen': ['gen'],
    'aux': ['AUX'],
    'starter': ['starter'],
    'ignition': ['ignition'],
    'fuelbal': ['Fuel Bal'],
    'manfuelbal': ['Fuel\u200B Bal'],
    'avionicsMaster': ['avionics master'],
    'bustie': ['Bus Tie'],
    'probeAntiI': ['Probes Anti-Ice'],
    'boostPump': ['Boost Pump'],
    'pmu': ['pmu'],
    'bleedAir': ['bled air inflow', 'bleed air inflow'],
    'evapBlwr': ['evap blwr'],
    'airCond': ['air cond'],
    'pressurization': ['Pressurization'],
    'ramair': ['Ram Air'],
    'tempcon': ['Temp Control'],
    'obogsFlow': ['Flow I'],
    'obogsSupply': ['OBOGS -', 'supply'],
    'obogsConc': ['OBOGS -', 'concentration'],
    'obogsPress': ['OBOGS -', 'pressure']
  };

  const handleInputsChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
    setCheckResults(prev => ({ ...prev, [field]: '' }));
  };

  const refreshIndices = (currentDiv, random) => {
    const total = currentDiv.length;
    setCurrentIndex(0);

    if(random){
      setCurrentIndexArray(shuffleIndices(total));
    }else{
      setCurrentIndexArray([...Array(total).keys()]);
    }
  }

  const checkAnswers = () => {
    const results = {};
    const answers = inputAnswers;
    const data = inputData;

    Object.keys(answers).forEach(key => {
      //Find input answer and correct answer and remove , - . ( ) ; and spaces
      let userAnswer = data[key] || '';
      userAnswer = userAnswer.replace(/[,\-–;()./ ]/g, '');
      let correctAnswer = Array.isArray(answers[key]) ? answers[key].join('') : answers[key];
      correctAnswer = correctAnswer.replace(/[,\-–;()./ ]/g, '');
      const normalizedUser = userAnswer.toString().trim().toLowerCase();
      const normalizedCorrect = correctAnswer.toString().toLowerCase();

      if (normalizedUser === normalizedCorrect) {
        results[key] = 'correct';
      } else if (normalizedUser === '') {
        results[key] = '';
      } else if(normalizedCorrect.includes(normalizedUser)){
        results[key] = 'partial';
      } else if (normalizedCorrect === ''){
        results[key] = 'correct';
      } else {
        results[key] = 'incorrect';
      }
    });

    setCheckResults(results);
  };

  const resetAnswers = () => {
    setInputData({});
    setCheckResults({});
    setActiveHints({});
  };

  const getInputClass = (field) => {
    if (checkResults[field] === 'correct') return 'correct-answer';
    if (checkResults[field] === 'partial') return 'partial-answer';
    if (checkResults[field] === 'incorrect') return 'incorrect-answer';
    if (checkResults[field] === 'checked') return 'checked-answer';
    return '';
  };

  const getClickClass = (field, type = null) => {
    if (activeHints[field] === 'hint' && type === 'image') return 'correct-answer-hint-image';
    if (activeHints[field] === 'hint' && type === 'button') return 'correct-answer-hint-button';
    if (activeHints[field] === 'hint') return 'correct-answer-hint';
    if (type === 'button') return 'action-button';
    if(!type){return "click-style";}
    return '';
  };

  // Remove all styling from the page except for checked options
  const emptyResults = () => {
    return Object.fromEntries(
      Object.entries(checkResults).filter(([key, value]) =>
        !['partial', 'incorrect', 'correct'].includes(value)
      )
    );
  };

  const findNextEmpty = () =>{
    setActiveHints({})
    const results = checkResults;
    let currentKey = divMap[currentDivKey][0][currentIndexArray[currentIndex]].key;
    const allFields = Object.keys(inputAnswers).filter(key => key.startsWith(currentKey));
    // Find the first non-empty field
    let nextEmptyField = null;
    let emptyNum = 0;
    for (let i = 0; i < allFields.length; i++) {
      const field = allFields[i];

      if (inputData[field] === undefined || inputData[field] === ''||results[field] === 'partial') {
        nextEmptyField = field;
        emptyNum = i;
        break;
      }
    }
    return{nextEmptyField, emptyNum};
  }

  // Find next appropriate input and try it
  const tryNextStep = (controls) => {
    const results = checkResults;
    const {nextEmptyField, emptyNum} = findNextEmpty();
    if(!nextEmptyField){return}
    if(results[nextEmptyField] === 'partial'){controls = [...controls, inputData[nextEmptyField]]}

    let correctAnswers = inputAnswers[nextEmptyField]

    // Find all matching answers in order
    const matchingAnswers = correctAnswers.filter(answer =>
      controls.some(control =>
        answer.toLowerCase().includes(control.toLowerCase()) ||
        control.toLowerCase().includes(answer.toLowerCase())
      )
    );

    if(matchingAnswers.length === correctAnswers.length){
      inputData[nextEmptyField] = matchingAnswers.join('');
      const results = emptyResults();
      results[nextEmptyField] = 'checked';
      setCheckResults(results);
      if(emptyNum + 1 === inputLengths[currentIndexArray[currentIndex]]){
        checkAnswers();
      }
    }else if (matchingAnswers.length > 0){
      inputData[nextEmptyField] = matchingAnswers.join('');
      const results = emptyResults();
      results[nextEmptyField] = 'partial';
      setCheckResults(results);
    }else{
      const results = emptyResults();
      results[nextEmptyField] = 'incorrect';
      setCheckResults(results);
    }
  };

  const nextAnswer = () =>{
    const {nextEmptyField, emptyNum} = findNextEmpty();
    if(!nextEmptyField){return}
    let correctAnswers = inputAnswers[nextEmptyField]
    inputData[nextEmptyField] = correctAnswers.join('');
    const results = emptyResults();
    results[nextEmptyField] = 'checked';
    setCheckResults(results);
    if(emptyNum + 1 === inputLengths[currentIndexArray[currentIndex]]){
      checkAnswers();
      return false
    }
    return true
  }

  const allAnswers = () =>{
    let continueLoop = true;
    while(continueLoop){
      continueLoop = nextAnswer();
    }
  }

  const giveHint =() =>{
    const {nextEmptyField, emptyNum} = findNextEmpty();
    if(!nextEmptyField){return}
    let correctAnswer = inputAnswers[nextEmptyField].join('').toLowerCase();
    console.log(correctAnswer)
    const matches ={};

    Object.keys(clickableControls).forEach(key => {
      const controls = clickableControls[key];
      const hasMatch = controls.some(control =>
        correctAnswer.includes(control.toLowerCase())
      );
      if (hasMatch) {
        matches[key] = 'hint';
      }
    });
    setActiveHints(matches)
  }

  //EP div structures retrieval
  const epDivs = getEPDivs({
    epsData: inputData,
    handleEPsChange: handleInputsChange,
    getInputClass
  });

  //Quad div structures retrieval
  const quadDivs = getQuadDivs({
    getInputClass
  });

  //Map div elements to key for retrival
  const divMap = {
    'epDivs': [epDivs, EP_ANSWERS, EP_LENGTHS],
    'quadDivs': [quadDivs, QUAD_ANSWERS, QUAD_LENGTHS]
  };

  return (
    <>
      <div className="limits-eps-container" style={{maxWidth: CONTAINER_MAX_WIDTH}}>
        <h1 style={{fontSize: '16px', marginBottom: '5px'}}>T-6B INTERACTIVE COCKPIT</h1>
        
        <p className="page-subtitle" style={{fontSize: '11px', marginBottom: '10px'}}>
          Every step can be solved by clicking on the correct control or step button. Clicking on any relevant control will fill the entire step. If you are unsure/can't find the right control, you can always type in the step
        </p>
        <div className="eps-page">
            {/* EPS LAYOUT WITH SIDE CONTROLS */}
            <div style={{display: 'flex', gap: LAYOUT_GAP, alignItems: 'flex-start', justifyContent: 'center'}}>
              {/* LEFT CONTROLS */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: SIDE_CONTROLS_WIDTH, flexShrink: 1, minWidth: '80px'}}>
                {/* Left Panel Image with clickable overlay */}
                <div style={{position: 'relative', width: '100%'}}>
                  <img src="/images/left.png" alt="Left Control" style={{width: '100%', height: 'auto', display: 'block'}} />
                  <div
                    onClick={() => tryNextStep(clickableControls['trimIndi'])}
                    className = {getClickClass('trimIndi')} style={{top: '0.7%', left: '26%', width: '53%', height: '3.8%'}}
                    title="Trim Indicators"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['trimAid'])}
                    className = {getClickClass('trimAid')} style={{top: '7.4%', left: '76%', width: '9%', height: '1.5%'}}
                    title="Trim Aid"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['floodLight'])}
                    className={getClickClass('floodLight')} style={{top: '7.9%', left: '18%', width: '8%', height: '1.4%'}}
                    title="Flood Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['sideLight'])}
                    className={getClickClass('sideLight')} style={{top: '5.8%', left: '37%', width: '8%', height: '1.4%'}}
                    title="Side Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['instLight'])}
                    className={getClickClass('instLight')} style={{top: '7.9%', left: '56.5%', width: '8%', height: '1.4%'}}
                    title="Inst Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ldgLight'])}
                    className={getClickClass('ldgLight')} style={{top: '10.8%', left: '14.8%', width: '9%', height: '2%'}}
                    title="LDG Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['taxiLight'])}
                    className={getClickClass('taxiLight')} style={{top: '11.1%', left: '30%', width: '9%', height: '1.5%'}}
                    title="Taxi Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['anticollLight'])}
                    className={getClickClass('anticollLight')} style={{top: '11.1%', left: '45.2%', width: '9%', height: '1.5%'}}
                    title="Anti-Coll Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['navLight'])}
                    className={getClickClass('navLight')} style={{top: '11.1%', left: '60.1%', width: '9%', height: '1.5%'}}
                    title="Nav Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['trimDisco'])}
                    className={getClickClass('trimDisco')} style={{top: '11%', left: '77.1%', width: '8.6%', height: '1.5%'}}
                    title="Trim Disconnect"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['flaps'])}
                    className={getClickClass('flaps')} style={{top: '23.1%', left: '62%', width: '35%', height: '4.7%'}}
                    title="Flaps"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['pcl'])}
                    className={getClickClass('pcl')} style={{top: '28%', left: '13%', width: '84%', height: '10%'}}
                    title="PCL/Speed Brake"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['altLdgGrTest'])}
                    className={getClickClass('altLdgGrTest')} style={{top: '38.9%', left: '11.9%', width: '9%', height: '1.5%'}}
                    title="ALT/LDG GR Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ovrSpdOvrGTest'])}
                    className={getClickClass('ovrSpdOvrGTest')} style={{top: '38.9%', left: '28%', width: '9%', height: '1.5%'}}
                    title="OVR SPD/OVR G Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['aoaSystemTest'])}
                    className={getClickClass('aoaSystemTest')} style={{top: '41.9%', left: '11.9%', width: '9%', height: '1.5%'}}
                    title="AOA System Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bingoFuelTest'])}
                    className={getClickClass('bingoFuelTest')} style={{top: '41.9%', left: '28%', width: '9%', height: '1.5%'}}
                    title="BINGO FUEL Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['lampTest'])}
                    className={getClickClass('lampTest')} style={{top: '44.6%', left: '11.9%', width: '9%', height: '1.5%'}}
                    title="Lamp Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['fireDetection'])}
                    className={getClickClass('fireDetection')} style={{top: '39%', left: '64.3%', width: '9%', height: '1.5%'}}
                    title="Fire Detection"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['seatHeight'])}
                    className={getClickClass('seatHeight')} style={{top: '40%', left: '78%', width: '9%', height: '1.5%'}}
                    title="Seat Height Adjust"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['auxBatTest'])}
                    className={getClickClass('auxBatTest')} style={{top: '44.4%', left: '63.5%', width: '9%', height: '1.5%'}}
                    title="AUX BAT Test"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['cfs'])}
                    className={getClickClass('cfs')} style={{top: '48.7%', left: '11%', width: '70%', height: '4%'}}
                    title="CFS"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['prop'])}
                    className={getClickClass('prop')} style={{top: '60.9%', left: '54.5%', width: '10%', height: '2%'}}
                    title="Prop Sys Circuit Breaker"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['fdrlgt'])}
                    className={getClickClass('fdrlgt')} style={{top: '84.25%', left: '41.5%', width: '13%', height: '2%'}}
                    title="FDR Lights"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['firewall'])}
                    className={getClickClass('firewall')} style={{top: '86.7%', left: '7%', width: '48%', height: '7.7%'}}
                    title="Firewall Shutoff Handle"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['antiG'])}
                    className={getClickClass('antiG')} style={{top: '95%', left: '43%', width: '18%', height: '3%'}}
                    title="Anti-G test"
                  />
                </div>
              </div>

              {/* CENTER - EPS CONTENT */}
              <div style={{flex: `0 1 ${CENTER_CONTENT_WIDTH}`, width: CENTER_CONTENT_WIDTH, alignItems: 'center', flexShrink: 1, minWidth: '300px'}}>
                <div style={{position: 'relative', width: '100%'}}>
                  <img src="/images/croptop.png" alt="Top Control" style={{width: '100%', height: 'auto', display: 'block', minWidth: 0}} />
                  <div
                    onClick={() => tryNextStep(clickableControls['masterArm'])}
                    className={getClickClass('masterArm')} style={{top: '45.7%', left: '11.8%', width: '2.4%', height: '2.6%'}}
                        title="Master Arm"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['emerLdgGr'])}
                    className={getClickClass('emerLdgGr')} style={{top: '63.7%', left: '6%', width: '5.5%', height: '8%'}}
                        title="Emer Ldg Gr"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['flapIndi'])}
                    className={getClickClass('flapIndi')} style={{top: '66%', left: '12%', width: '5%', height: '6%'}}
                        title="Flap Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['gear'])}
                    className={getClickClass('gear')} style={{top: '78.5%', left: '6.2%', width: '4%', height: '8%'}}
                        title="Landing Gear"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['gearlgt'])}
                    className={getClickClass('gearlgt')} style={{top: '77.1%', left: '4.8%', width: '2.5%', height: '2.9%'}}
                        title="Landing Gear Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['gearlgt'])}
                    className={getClickClass('gearlgt')} style={{top: '75.3%', left: '8%', width: '2.5%', height: '2.9%'}}
                        title="Landing Gear Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['gearlgt'])}
                    className={getClickClass('gearlgt')} style={{top: '77.1%', left: '11.2%', width: '2.5%', height: '2.9%'}}
                        title="Landing Gear Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['brakes'])}
                    className={getClickClass('brakes')} style={{top: '70%', left: '19.8%', width: '18%', height: '27%'}}
                        title="Brakes"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['brakes'])}
                    className={getClickClass('brakes')} style={{top: '70%', left: '62%', width: '18%', height: '27%'}}
                        title="Brakes"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['com1'])}
                    className={getClickClass('com1')} style={{top: '68.2%', left: '43.1%', width: '1.3%', height: '1.5%'}}
                        title="COM1"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['com2'])}
                    className={getClickClass('com2')} style={{top: '68.2%', left: '47.2%', width: '1.3%', height: '1.5%'}}
                        title="COM2"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['navcom'])}
                    className={getClickClass('navcom')} style={{top: '68.1%', left: '51.35%', width: '1.3%', height: '1.5%'}}
                        title="NAV"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['dme'])}
                    className={getClickClass('dme')} style={{top: '70.3%', left: '43.1%', width: '1.3%', height: '1.5%'}}
                        title="DME"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['mkr'])}
                    className={getClickClass('mkr')} style={{top: '70.3%', left: '47.2%', width: '1.3%', height: '1.5%'}}
                        title="MKR"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['vox'])}
                    className={getClickClass('vox')} style={{top: '72.4%', left: '43.1%', width: '1.3%', height: '1.5%'}}
                        title="VOX"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['emrnrm'])}
                    className={getClickClass('emrnrm')} style={{top: '72.4%', left: '49.2%', width: '1.3%', height: '1.5%'}}
                        title="EMR/NRM"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ventcon'])}
                    className={getClickClass('ventcon')} style={{top: '87%', left: '41.6%', width: '1.9%', height: '10.7%'}}
                        title="Vent Control Lever"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['defog'])}
                    className={getClickClass('defog')} style={{top: '90.7%', left: '45.3%', width: '2.5%', height: '3.2%'}}
                        title="Defog"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['elt'])}
                    className={getClickClass('elt')} style={{top: '62.6%', left: '88%', width: '1%', height: '1.6%'}}
                        title="ELT"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['parkingBrake'])}
                    className={getClickClass('parkingBrake')} style={{top: '72.1%', left: '90.7%', width: '2%', height: '9.5%'}}
                        title="Parking Brake"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['navMenu'])}
                    className={getClickClass('navMenu')} style={{top: '33.3%', left: '21.2%', width: '1.3%', height: '1.8%'}}
                        title="NAV Menu"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['mastwarn'])}
                    className={getClickClass('mastwarn')} style={{top: '13.5%', left: '30.1%', width: '2.3%', height: '1.6%'}}
                        title="Master Warn"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['mastcaut'])}
                    className={getClickClass('mastcaut')} style={{top: '13.5%', left: '34.75%', width: '2.3%', height: '1.6%'}}
                        title="Master Caut"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['firelight'])}
                    className={getClickClass('firelight')} style={{top: '9.8%', left: '32.6%', width: '2.1%', height: '2.3%'}}
                        title="Fire Light"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['redaoa'])}
                    className={getClickClass('redaoa')} style={{top: '4.3%', left: '31.6%', width: '1%', height: '1.3%'}}
                        title="AOA Red Chevron"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['amberaoa'])}
                    className={getClickClass('amberaoa')} style={{top: '2.45%', left: '31.6%', width: '1%', height: '1.3%'}}
                        title="AOA Amber Donut"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['greenaoa'])}
                    className={getClickClass('greenaoa')} style={{top: '0.5%', left: '31.6%', width: '1%', height: '1.3%'}}
                        title="AOA Green Donut"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['clock'])}
                    className={getClickClass('clock')} style={{top: '29.6%', left: '32.1%', width: '4%', height: '1.1%'}}
                        title="Clock"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['tcas'])}
                    className={getClickClass('tcas')} style={{top: '42.6%', left: '36.1%', width: '1.4%', height: '1.6%'}}
                        title="TCAS"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['tcasrng'])}
                    className={getClickClass('tcasrng')} style={{top: '50.1%', left: '36.1%', width: '1.4%', height: '1.6%'}}
                        title="RNG"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['aoaindi'])}
                    className={getClickClass('aoaindi')} style={{top: '38.7%', left: '41.6%', width: '1%', height: '9.6%'}}
                        title="AOA Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['airspeed'])}
                    className={getClickClass('airspeed')} style={{top: '38.7%', left: '42.8%', width: '1.7%', height: '9%'}}
                        title="Airspeed"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['attitude'])}
                    className={getClickClass('attitude')} style={{top: '39%', left: '46%', width: '7%', height: '7%'}}
                        title="Attitude"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['altitude'])}
                    className={getClickClass('altitude')} style={{top: '38.6%', left: '54.2%', width: '1.8%', height: '9%'}}
                        title="Altitude"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['vsi'])}
                    className={getClickClass('vsi')} style={{top: '38.6%', left: '56.1%', width: '1.7%', height: '9%'}}
                        title="VSI"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['slipskid'])}
                    className={getClickClass('slipskid')} style={{top: '46.8%', left: '49.4%', width: '0.5%', height: '0.6%'}}
                        title="Slip/Skid Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['turni'])}
                    className={getClickClass('turni')} style={{top: '47.7%', left: '47.9%', width: '3.5%', height: '0.5%'}}
                        title="Turn Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['headi'])}
                    className={getClickClass('headi')} style={{top: '50.8%', left: '45.4%', width: '8.5%', height: '10%'}}
                        title="Heading Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['greset'])}
                    className={getClickClass('greset')} style={{top: '50.1%', left: '58.5%', width: '1.4%', height: '1.3%'}}
                        title="G Reset"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['fuelquan'])}
                    className={getClickClass('fuelquan')} style={{top: '37.4%', left: '65.1%', width: '2.4%', height: '7.3%'}}
                        title="Fuel Quantity/Balance"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['np'])}
                    className={getClickClass('np')} style={{top: '37%', left: '73.7%', width: '2.7%', height: '1.3%'}}
                        title="NP"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['torque'])}
                    className={getClickClass('torque')} style={{top: '38.4%', left: '68.1%', width: '6.6%', height: '5%'}}
                        title="Torque"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['oilPress'])}
                    className={getClickClass('oilPress')} style={{top: '38.4%', left: '75%', width: '5.2%', height: '5%'}}
                        title="Oil Pressure"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['oilTemp'])}
                    className={getClickClass('oilTemp')} style={{top: '44.1%', left: '75%', width: '5.2%', height: '5.4%'}}
                        title="Oil Temperature"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['itt'])}
                    className={getClickClass('itt')} style={{top: '44.1%', left: '69.5%', width: '5.2%', height: '5.4%'}}
                        title="ITT"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['n1'])}
                    className={getClickClass('n1')} style={{top: '50%', left: '69.5%', width: '5.2%', height: '5.4%'}}
                        title="N1"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['hydPress'])}
                    className={getClickClass('hydPress')} style={{top: '50%', left: '75%', width: '5.2%', height: '5.4%'}}
                        title="Hyd Pressure"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bingo'])}
                    className={getClickClass('bingo')} style={{top: '46.5%', left: '61.5%', width: '1.4%', height: '1.3%'}}
                        title="Bingo Fuel Set"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['fuelflow'])}
                    className={getClickClass('fuelflow')} style={{top: '48.5%', left: '64.5%', width: '4.5%', height: '0.6%'}}
                        title="Fuel Flow"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ioat'])}
                    className={getClickClass('ioat')} style={{top: '49.4%', left: '64.5%', width: '4.5%', height: '0.7%'}}
                        title="IOAT"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['voltamps'])}
                    className={getClickClass('voltamps')} style={{top: '50.3%', left: '64.5%', width: '4.5%', height: '1.5%'}}
                        title="Volts/Amps"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['altdelta'])}
                    className={getClickClass('altdelta')} style={{top: '52%', left: '64.5%', width: '4.9%', height: '1.8%'}}
                        title="Cockpit Altitude/Delta P"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['uhf'])}
                    className={getClickClass('uhf')} style={{top: '3.7%', left: '46.4%', width: '1.3%', height: '1.4%'}}
                        title="UHF"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['vhf'])}
                    className={getClickClass('vhf')} style={{top: '6.2%', left: '46.4%', width: '1.3%', height: '1.4%'}}
                        title="VHF"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['vor'])}
                    className={getClickClass('vor')} style={{top: '8.6%', left: '46.4%', width: '1.3%', height: '1.4%'}}
                        title="VOR"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['transponder'])}
                    className={getClickClass('transponder')} style={{top: '11%', left: '46.4%', width: '1.3%', height: '1.4%'}}
                        title="Transponder"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['pfdbut'])}
                    className={getClickClass('pfdbut')} style={{top: '3.5%', left: '56.1%', width: '1.7%', height: '1.9%'}}
                        title="PFD Button"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['sysbut'])}
                    className={getClickClass('sysbut')} style={{top: '5.8%', left: '56.1%', width: '1.7%', height: '1.9%'}}
                        title="SYS Button"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['hudcage'])}
                    className={getClickClass('hudcage')} style={{top: '18.5%', left: '46.3%', width: '0.7%', height: '1.7%'}}
                        title="HUD CAGE Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['hudlgt'])}
                    className={getClickClass('hudlgt')} style={{top: '18.5%', left: '48.6%', width: '0.8%', height: '1.7%'}}
                        title="HUD LGT Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['mfdrep'])}
                    className={getClickClass('mfdrep')} style={{top: '22.3%', left: '48.6%', width: '0.8%', height: '1.7%'}}
                        title="MFD/UFCP Repeat/NORM"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['lgthud'])}
                    className={getClickClass('lgthud')} style={{top: '18.2%', left: '51.2%', width: '1.8%', height: '2.9%'}}
                        title="LGT-HUD"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['lgtufcp'])}
                    className={getClickClass('lgtufcp')} style={{top: '22%', left: '51.25%', width: '1.8%', height: '2.9%'}}
                        title="LGT-UFCP"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['baroset'])}
                    className={getClickClass('baroset')} style={{top: '22%', left: '57.7%', width: '1.8%', height: '2.9%'}}
                        title="BARO SET"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bfi'])}
                    className={getClickClass('bfi')} style={{top: '20.5%', left: '63.2%', width: '8%', height: '8.6%'}}
                        title="BFI"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bfiset'])}
                    className={getClickClass('bfiset')} style={{top: '29.5%', left: '70%', width: '1.6%', height: '2%'}}
                        title="BFI Baro Set"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['eicas'])}
                    className={getClickClass('eicas')} style={{top: '56.1%', left: '63.8%', width: '16.3%', height: '5%'}}
                        title="EICAS Warnings"
                  />
                </div>
                <div style={{display: 'flex', gap: '2px', alignItems: 'flex-start', justifyContent: 'center'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '37.5%', flexShrink: 1, minWidth: '100px'}}>
                    <div className="control-section" style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px'}}>
                      <button className={getClickClass('ege', 'button')} onClick={() => tryNextStep(clickableControls['ege'])}>
                        EGE
                      </button>
                      <button className={getClickClass('iss', 'button')} onClick={() => tryNextStep(clickableControls['iss'])}>
                        ISS
                      </button>
                      <button className={getClickClass('seat', 'button')} onClick={() => tryNextStep(clickableControls['seat'])}>
                        Seat
                      </button>
                      <button className={getClickClass('canopy', 'button')} onClick={() => tryNextStep(clickableControls['canopy'])}>
                        Canopy
                      </button>
                      <button className={getClickClass('fittings', 'button')} onClick={() => tryNextStep(clickableControls['fittings'])}>
                        Fittings
                      </button>
                      <button className={getClickClass('mask', 'button')} onClick={() => tryNextStep(clickableControls['mask'])}>
                        Mask
                      </button>
                      <button className={getClickClass('terminate', 'button')} onClick={() => tryNextStep(clickableControls['terminate'])}>
                        Terminate Maneuver
                      </button>
                      <button className={getClickClass('expo', 'button')} onClick={() => tryNextStep(clickableControls['expo'])}>
                        External Power
                      </button>
                      <button className={getClickClass('loose', 'button')} onClick={() => tryNextStep(clickableControls['loose'])}>
                        Loose Items
                      </button>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '25%', flexShrink: 1, alignItems: 'center', minWidth: '60px'}}>
                    <div
                      className={getClickClass('stick', 'image')}
                      onClick={() => tryNextStep(clickableControls['stick'])}
                      title="Control Stick"
                      style={{cursor: 'pointer', display: 'inline-block', lineHeight: 0}}
                    >
                      <img src="/images/stick.png" alt="Control Stick"
                        style={{width: '100%', height: 'auto', display: 'block', minWidth: 0}}
                      />
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '37.5%', flexShrink: 1, minWidth: '100px'}}>
                    <div className="control-section" style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px'}}>
                      <button className={getClickClass('forcedLanding', 'button')} onClick={() => tryNextStep(clickableControls['forcedLanding'])}>
                        Forced Landing/Eject
                      </button>
                      <button className={getClickClass('pel', 'button')} onClick={() => tryNextStep(clickableControls['pel'])}>
                        PEL
                      </button>
                      <button className={getClickClass('elp', 'button')} onClick={() => tryNextStep(clickableControls['elp'])}>
                        ELP
                      </button>
                      <button className={getClickClass('airstart', 'button')} onClick={() => tryNextStep(clickableControls['airstart'])}>
                        Airstart
                      </button>
                      <button className={getClickClass('greenRing', 'button')} onClick={() => tryNextStep(clickableControls['greenRing'])}>
                        Green ring
                      </button>
                      <button className={getClickClass('ttnsf', 'button')} onClick={() => tryNextStep(clickableControls['ttnsf'])}>
                        TTNSF
                      </button>
                      <button className={getClickClass('evacuate', 'button')} onClick={() => tryNextStep(clickableControls['evacuate'])}>
                        Evacuate
                      </button>
                      <button className={getClickClass('chocks', 'button')} onClick={() => tryNextStep(clickableControls['chocks'])}>
                        Chocks
                      </button>
                      <button className={getClickClass('propeller', 'button')} onClick={() => tryNextStep(clickableControls['propeller'])}>
                        Propeller
                      </button>
                    </div>
                  </div>
                </div>
                
                <div style={{width: '100%', alignItems: 'center', minHeight: '350px', margin: '0 auto'}}>
                {/*The actual damn checklist*/}
                {divMap[currentDivKey][0][currentIndexArray[currentIndex]]}
                </div>
                <div className="navigation-buttons">
                  <button onClick={() => {
                    setCurrentIndex(currentIndex-1);
                    setCheckResults(emptyResults());
                    setActiveHints({});
                  }} 
                    disabled={currentIndex === 0}>
                    Previous
                  </button>
                  <span className="ep-counter" style={{minWidth: '61px'}}>
                    {currentIndex + 1} of {currentIndexArray.length}
                  </span>
                  <button onClick={() => {
                    setCurrentIndex(currentIndex+1);
                    setCheckResults(emptyResults());
                    setActiveHints({});
                  }} 
                    disabled={currentIndex === currentIndexArray.length - 1}>
                    Next
                  </button>
                </div>
              </div>

              {/* RIGHT CONTROLS */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: SIDE_CONTROLS_WIDTH, flexShrink: 1, minWidth: '80px'}}>

                {/* Right Panel Image with clickable overlay */}
                <div style={{position: 'relative', width: '100%'}}>
                  <img src="/images/right.png" alt="Right Control" style={{width: '100%', height: 'auto', display: 'block'}} />
                  <div
                    onClick={() => tryNextStep(clickableControls['bat'])}
                    className={getClickClass('bat')} style={{top: '1.5%', left: '20.3%', width: '10%', height: '2%'}}
                    title="BAT Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['gen'])}
                    className={getClickClass('gen')} style={{top: '1.5%', left: '38.6%', width: '10%', height: '2%'}}
                    title="GEN Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['aux'])}
                    className={getClickClass('aux')} style={{top: '1.5%', left: '55.8%', width: '10%', height: '2%'}}
                    title="AUX BAT Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['starter'])}
                    className={getClickClass('starter')} style={{top: '6.8%', left: '15.5%', width: '10%', height: '2%'}}
                    title="Starter Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ignition'])}
                    className={getClickClass('ignition')} style={{top: '7.15%', left: '32.9%', width: '8%', height: '1.8%'}}
                    title="Ignition Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['fuelbal'])}
                    className={getClickClass('fuelbal')} style={{top: '7.1%', left: '49.5%', width: '9%', height: '2%'}}
                    title="FUEL BAL Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['manfuelbal'])}
                    className={getClickClass('manfuelbal')} style={{top: '7.1%', left: '69%', width: '9%', height: '2%'}}
                    title="MANUAL FUEL BAL Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['avionicsMaster'])}
                    className={getClickClass('avionicsMaster')} style={{top: '12%', left: '12.5%', width: '10%', height: '2.7%'}}
                    title="Avionics Master"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bustie'])}
                    className={getClickClass('bustie')} style={{top: '12.6%', left: '30%', width: '8.2%', height: '2.4%'}}
                    title="Bus Tie"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['probeAntiI'])}
                    className={getClickClass('probeAntiI')} style={{top: '12.3%', left: '46%', width: '8.2%', height: '1.9%'}}
                    title="Probes Anti-Ice"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['boostPump'])}
                    className={getClickClass('boostPump')} style={{top: '12.3%', left: '60%', width: '10%', height: '2%'}}
                    title="Boost Pump Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['pmu'])}
                    className={getClickClass('pmu')} style={{top: '12.3%', left: '75.5%', width: '10%', height: '2%'}}
                    title="PMU Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['bleedAir'])}
                    className={getClickClass('bleedAir')} style={{top: '19.4%', left: '42%', width: '10%', height: '2%'}}
                    title="Bleed Air Inflow"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['evapBlwr'])}
                    className={getClickClass('evapBlwr')} style={{top: '18.7%', left: '11%', width: '20%', height: '3.3%'}}
                    title="EVAP BLWR"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['pressurization'])}
                    className={getClickClass('pressurization')} style={{top: '17.8%', left: '70%', width: '12%', height: '5.1%'}}
                    title="Pressurization Switch"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['airCond'])}
                    className={getClickClass('airCond')} style={{top: '23.9%', left: '8.8%', width: '10%', height: '2%'}}
                    title="Air Cond"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['tempcon'])}
                    className={getClickClass('tempcon')} style={{top: '24.4%', left: '27%', width: '26.5%', height: '4.6%'}}
                    title="Temp Control"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['ramair'])}
                    className={getClickClass('ramair')} style={{top: '25.8%', left: '72%', width: '8%', height: '1.4%'}}
                    title="Ram Air"
                  />
                  {/* OBOGS Controls Area */}
                  <div
                    onClick={() => tryNextStep(clickableControls['obogsFlow'])}
                    className={getClickClass('obogsFlow')} style={{top: '33.3%', left: '16.5%', width: '12.6%', height: '1.2%'}}
                    title="OBOGS Flow Indicator"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['obogsSupply'])}
                    className={getClickClass('obogsSupply')} style={{top: '35.7%', left: '76.5%', width: '10%', height: '4%'}}
                    title="OBOGS Supply Lever"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['obogsConc'])}
                    className={getClickClass('obogsConc')} style={{top: '35.7%', left: '44%', width: '10%', height: '4%'}}
                    title="OBOGS Concentration Lever"
                  />
                  <div
                    onClick={() => tryNextStep(clickableControls['obogsPress'])}
                    className={getClickClass('obogsPress')} style={{top: '35.7%', left: '11.5%', width: '10%', height: '4%'}}
                    title="OBOGS Pressure Lever"
                  />
                </div>
              </div>
            </div>
        </div>
        <div className="button-row" style={{ justifyContent: 'center', marginTop: '0px' }}>
          <button style={{minWidth: '147px'}} onClick={() => {
            setisRandom(!isRandom);
            refreshIndices(divMap[currentDivKey][0], !isRandom);
            setInputData({});
            resetAnswers();}}>
            {isRandom ? "Random " : "Sequential "} Order
          </button>
          <button onClick={giveHint}>Hint</button>
          <button onClick={nextAnswer}>Next Answer/Skip</button>
          <button onClick={allAnswers}>All Answers</button>
          {currentDivKey === 'epDivs' && <button onClick={checkAnswers}>Check</button>}
          <button onClick={resetAnswers}>Reset</button>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '0px', position: 'relative'}}>
          <div style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            height: '2px',
            backgroundColor: '#333',
            zIndex: 0
          }}></div>
          <div style={{display: 'flex', gap: '60px', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1}}>
            <div
              style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}}
              onClick={() => {
                setCurrentDivKey('epDivs');
                refreshIndices(divMap['epDivs'][0], isRandom);
                setInputAnswers(divMap['epDivs'][1]);
                setInputLengths(divMap['epDivs'][2]);
                resetAnswers();
              }}
            >
              <span style={{fontSize: '14px', marginBottom: '5px'}}>EPs</span>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #333',
                backgroundColor: currentDivKey === 'epDivs' ? '#333' : '#fff',
                transition: 'background-color 0.2s'
              }}></div>
            </div>

            <div
              style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}}
              onClick={() => {
                setCurrentDivKey('quadDivs');
                refreshIndices(divMap['quadDivs'][0], isRandom);
                setInputAnswers(divMap['quadDivs'][1]);
                setInputLengths(divMap['quadDivs'][2]);
                resetAnswers();
              }}
            >
              <span style={{fontSize: '14px', marginBottom: '5px'}}>Quadfold</span>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #333',
                backgroundColor: currentDivKey === 'quadDivs' ? '#333' : '#fff',
                transition: 'background-color 0.2s'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TW4Cockpit;