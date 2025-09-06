import React, { useState, useEffect, useRef } from 'react';

function LimitsEPs() {
  const [showEPs, setShowEPs] = useState(false);
  const [limitsData, setLimitsData] = useState({});
  const [epsData, setEpsData] = useState({});
  const [checkResults, setCheckResults] = useState({});

  // Answer keys based on the PDF
  const limitsAnswers = {
    // Instruments
    tachMin: '2100-2450',
    tachMax: '2700',
    oilTempNormal: '100-245',
    oilTempMax: '245',
    oilPressMin: '25',
    oilPressNormal: '60-90',
    oilPressMax: '115',
    oilQuantMin: '6',
    oilQuantNormal: '6-7',
    oilQuantMax: '8',
    carbTemp: '-15 to 5',
    starterDuty: 'Crank 10 sec, Cool 20 sec, after 3 cycles 10 min cooling',
    maxWeight: '2550',
    baggage: '120',
    fuelCapacity: '43',
    maxCrosswind: '15',
    maxBank: '60',
    serviceCeiling: '14,200',
    wingspan: '36',
    // Load Factors
    flapsUpMax: '3.8 to -1.52',
    flapsDownMax: '3 to 0',
    // V-Speeds
    vne: '158',
    vno: '127',
    va: '105',
    vfe: '85',
    vy: '73',
    vx: '62',
    vglide: '68',
    vr: '55',
    vs: '50',
    vso: '40'
  };

  // Updated answer key - include empty strings for second inputs where appropriate
    const epsAnswers = {
    // Engine Fail After Takeoff / Forced Landing
    efat1: 'Airspeed',
    efat1val: '68 KIAS',
    efat2: 'Turn Towards Nearest Suitable Landing Site',
    efat2val: '', // BLANK - no second value
    efat3: 'Fuel Selector',
    efat3val: 'OFF',
    efat4: 'Mixture',
    efat4val: 'IDLE CUTOFF',
    efat5: 'Flaps',
    efat5val: 'AS REQUIRED',
    efat6: 'Mags',
    efat6val: 'OFF',
    efat7: 'Master',
    efat7val: 'OFF',
    efat8: 'Doors',
    efat8val: 'UNLATCHED',
    
    // Engine Failure In Flight
    efif1: 'Airspeed',
    efif1val: '68KIAS',
    efif2: 'Turn towards nearest suitable landing site',
    efif2val: '', // BLANK
    efif3: 'Fuel Selector',
    efif3val: 'BOTH',
    efif4: 'Mixture',
    efif4val: 'FULL RICH',
    efif5: 'Throttle',
    efif5val: 'FULL',
    efif6: 'Carb Heat',
    efif6val: 'ON',
    efif7: 'Mags',
    efif7val: 'BOTH (Start if prop stopped)',
    efif8: 'Master',
    efif8val: 'ON',
    efif9: 'Primer',
    efif9val: 'IN/LOCKED',
    
    // Engine Fire In Flight
    efiff1: 'Fuel Selector',
    efiff1val: 'OFF',
    efiff2: 'Mixture',
    efiff2val: 'IDLE CUTOFF',
    efiff3: 'Declare',
    efiff3val: 'MAYDAY',
    efiff4: 'Master',
    efiff4val: 'OFF',
    efiff5: 'Cabin Heat / Air',
    efiff5val: 'OFF',
    efiff6: 'Turn Towards Nearest Suitable Landing Site',
    efiff6val: '', // BLANK
    
    // Abort Takeoff
    abort1: 'Throttle',
    abort1val: 'IDLE',
    abort2: 'Brakes',
    abort2val: 'AS REQ',
    abort3: 'Maintain Directional Control',
    abort3val: '', // BLANK
    abort4: 'Emergency Shutdown on Deck',
    abort4val: 'EXECUTE',
    
    // Emergency Shutdown on Deck
    esd1: 'Fuel Selector',
    esd1val: 'OFF',
    esd2: 'Mixture',
    esd2val: 'IDLE CUTOFF',
    esd3: 'Mags',
    esd3val: 'OFF',
    esd4: 'Master',
    esd4val: 'OFF',
    esd5: 'Aircraft',
    esd5val: 'EVACUATE AS REQ',
    
    // Engine Fire During Start
    efds1: 'Cranking',
    efds1val: 'CONTINUE',
    efds2: 'Throttle',
    efds2val: '1700 RPM (5 sec)',
    efds3: 'Emergency Shutdown On Deck',
    efds3val: 'EXECUTE',
    efds4: 'Throttle',
    efds4val: 'FULL',
    efds5: 'Emergency Shutdown on Deck',
    efds5val: 'EXECUTE',
    
    // Elec Fire In Flight
    elec1: 'Master',
    elec1val: 'OFF',
    elec2: 'Avionics Power Switch',
    elec2val: 'OFF',
    elec3: 'All Electrical Equipment',
    elec3val: 'OFF',
    elec4: 'Vents / Cabin Air',
    elec4val: 'CLOSED',
    elec5: 'Fire Extinguisher',
    elec5val: 'ACTIVATE AS REQ',
    elec6: 'Cabin Windows',
    elec6val: 'OPEN AS REQ',
    elec7: 'Land As Soon As Possible',
    elec7val: '', // BLANK
    };

  const handleLimitsChange = (field, value) => {
    setLimitsData(prev => ({ ...prev, [field]: value }));
    setCheckResults(prev => ({ ...prev, [field]: '' }));
  };

  const handleEPsChange = (field, value) => {
    setEpsData(prev => ({ ...prev, [field]: value }));
    setCheckResults(prev => ({ ...prev, [field]: '' }));
  };

  const checkAnswers = () => {
    const results = {};
    const answers = showEPs ? epsAnswers : limitsAnswers;
    const data = showEPs ? epsData : limitsData;

    Object.keys(answers).forEach(key => {
      const userAnswer = data[key] || '';
      const correctAnswer = answers[key];
      
      // For EP pairs, only highlight if the pair input has content
      if (showEPs && key.endsWith('val')) {
        const baseKey = key.replace('val', '');
        const pairValue = data[baseKey] || '';
        
        // Only check the 'val' field if the main field has content
        if (pairValue.trim() === '') {
          results[key] = ''; // Don't highlight if pair is empty
          return;
        }
      }
      
      // Check if the answer contains a range (has 'to' or '-' with numbers on both sides)
      const isRange = /\d\s*(to|-)\s*-?\d/.test(correctAnswer);
      
      if (isRange) {
        // For any range values, normalize both answers
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
        // Normal comparison for other fields
        const normalizedUser = userAnswer.toString().trim().toLowerCase();
        const normalizedCorrect = correctAnswer.toString().toLowerCase();
        
        if (normalizedUser === normalizedCorrect) {
          results[key] = 'correct';
        } else if (normalizedUser === '') {
          results[key] = '';
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
    if (checkResults[field] === 'incorrect') return 'incorrect-answer';
    return '';
  };

  // Auto-resize inputs based on content
  useEffect(() => {
    const resizeInput = (input) => {
      if (!input) return;
      
      // Create a temporary span to measure text width
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.fontSize = window.getComputedStyle(input).fontSize;
      span.style.fontFamily = window.getComputedStyle(input).fontFamily;
      span.textContent = input.value || input.placeholder || '';
      
      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);
      
      // Set minimum widths and add padding
      const isFirstInput = input.parentElement?.children[0] === input;
      const minWidth = isFirstInput ? 100 : 60;
      const padding = -20; // Account for input padding
      const newWidth = Math.max(minWidth, textWidth + padding);
      
      input.style.width = `${newWidth}px`;
      input.style.flexBasis = `${newWidth}px`;
    };

    const handleInputChange = (e) => {
      resizeInput(e.target);
    };

    // Add event listeners to all EP inputs
    const epInputs = document.querySelectorAll('.ep-input-pair input');
    epInputs.forEach(input => {
      input.addEventListener('input', handleInputChange);
      // Initial resize
      resizeInput(input);
    });

    // Cleanup
    return () => {
      const epInputs = document.querySelectorAll('.ep-input-pair input');
      epInputs.forEach(input => {
        input.removeEventListener('input', handleInputChange);
      });
    };
  }, [epsData, showEPs]); // Re-run when data changes or when switching views

  return (
    <div className="limits-eps-container">
      <h1>{showEPs ? 'Emergency Procedures' : 'Aircraft Limits'}</h1>
      
      {!showEPs ? (
        // Limits Table
        <div className="limits-table-container">
          <table className="limits-table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Min</th>
                <th>Normal</th>
                <th>Caution</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tachometer</td>
                <td></td>
                <td><input type="text" value={limitsData.tachMin || ''} onChange={(e) => handleLimitsChange('tachMin', e.target.value)} className={getInputClass('tachMin')} placeholder="RPM" /></td>
                <td></td>
                <td><input type="text" value={limitsData.tachMax || ''} onChange={(e) => handleLimitsChange('tachMax', e.target.value)} className={getInputClass('tachMax')} placeholder="RPM" /></td>
              </tr>
              <tr>
                <td>Oil Temp</td>
                <td></td>
                <td><input type="text" value={limitsData.oilTempNormal || ''} onChange={(e) => handleLimitsChange('oilTempNormal', e.target.value)} className={getInputClass('oilTempNormal')} placeholder="°F" /></td>
                <td></td>
                <td><input type="text" value={limitsData.oilTempMax || ''} onChange={(e) => handleLimitsChange('oilTempMax', e.target.value)} className={getInputClass('oilTempMax')} placeholder="°F" /></td>
              </tr>
              <tr>
                <td>Oil Press</td>
                <td><input type="text" value={limitsData.oilPressMin || ''} onChange={(e) => handleLimitsChange('oilPressMin', e.target.value)} className={getInputClass('oilPressMin')} placeholder="PSI" /></td>
                <td><input type="text" value={limitsData.oilPressNormal || ''} onChange={(e) => handleLimitsChange('oilPressNormal', e.target.value)} className={getInputClass('oilPressNormal')} placeholder="PSI" /></td>
                <td></td>
                <td><input type="text" value={limitsData.oilPressMax || ''} onChange={(e) => handleLimitsChange('oilPressMax', e.target.value)} className={getInputClass('oilPressMax')} placeholder="PSI" /></td>
              </tr>
              <tr>
                <td>Oil Quantity</td>
                <td><input type="text" value={limitsData.oilQuantMin || ''} onChange={(e) => handleLimitsChange('oilQuantMin', e.target.value)} className={getInputClass('oilQuantMin')} placeholder="qts" /></td>
                <td><input type="text" value={limitsData.oilQuantNormal || ''} onChange={(e) => handleLimitsChange('oilQuantNormal', e.target.value)} className={getInputClass('oilQuantNormal')} placeholder="qts" /></td>
                <td></td>
                <td><input type="text" value={limitsData.oilQuantMax || ''} onChange={(e) => handleLimitsChange('oilQuantMax', e.target.value)} className={getInputClass('oilQuantMax')} placeholder="qts" /></td>
              </tr>
              <tr>
                <td>Carb. Air Temp</td>
                <td></td>
                <td></td>
                <td><input type="text" value={limitsData.carbTemp || ''} onChange={(e) => handleLimitsChange('carbTemp', e.target.value)} className={getInputClass('carbTemp')} placeholder="°C" style={{ width: '100%' }} /></td>
                <td></td>
              </tr>
              <tr>
                <td>Starter Duty Cycle</td>
                <td colSpan={4}><input type="text" value={limitsData.starterDuty || ''} onChange={(e) => handleLimitsChange('starterDuty', e.target.value)} className={getInputClass('starterDuty')} style={{ width: '100%' }} /></td>
              </tr>
              <tr>
                <td>Max Weight</td>
                <td><input type="text" value={limitsData.maxWeight || ''} onChange={(e) => handleLimitsChange('maxWeight', e.target.value)} className={getInputClass('maxWeight')} placeholder="lbs" /></td>
              </tr>
              <tr>
                <td>Baggage Allowance</td>
                <td><input type="text" value={limitsData.baggage || ''} onChange={(e) => handleLimitsChange('baggage', e.target.value)} className={getInputClass('baggage')} placeholder="lbs" /></td>
              </tr>
              <tr>
                <td>Fuel Capacity</td>
                <td><input type="text" value={limitsData.fuelCapacity || ''} onChange={(e) => handleLimitsChange('fuelCapacity', e.target.value)} className={getInputClass('fuelCapacity')} placeholder="gal" /></td>
              </tr>
              <tr>
                <td>Max Crosswind</td>
                <td><input type="text" value={limitsData.maxCrosswind || ''} onChange={(e) => handleLimitsChange('maxCrosswind', e.target.value)} className={getInputClass('maxCrosswind')} placeholder="kts" /></td>
              </tr>
              <tr>
                <td>Max Angle of Bank</td>
                <td><input type="text" value={limitsData.maxBank || ''} onChange={(e) => handleLimitsChange('maxBank', e.target.value)} className={getInputClass('maxBank')} placeholder="°" /></td>
              </tr>
              <tr>
                <td>Service Ceiling</td>
                <td><input type="text" value={limitsData.serviceCeiling || ''} onChange={(e) => handleLimitsChange('serviceCeiling', e.target.value)} className={getInputClass('serviceCeiling')} placeholder="ft" /></td>
              </tr>
              <tr>
                <td>Wingspan</td>
                <td><input type="text" value={limitsData.wingspan || ''} onChange={(e) => handleLimitsChange('wingspan', e.target.value)} className={getInputClass('wingspan')} placeholder="ft" /></td>
              </tr>
              <tr>
                <td>Limit Load Factors:</td>
                <td></td>
              </tr>
              <tr>
                <td>Flaps Up:</td>
                <td><input type="text" value={limitsData.flapsUpMax || ''} onChange={(e) => handleLimitsChange('flapsUpMax', e.target.value)} className={getInputClass('flapsUpMax')} placeholder="+ to -" /></td>
              </tr>
              <tr>
                <td>Flaps Down:</td>
                <td><input type="text" value={limitsData.flapsDownMax || ''} onChange={(e) => handleLimitsChange('flapsDownMax', e.target.value)} className={getInputClass('flapsDownMax')} placeholder="+ to -" /></td>
              </tr>
              <tr>
                <td>V<sub>NE</sub></td>
                <td><input type="text" value={limitsData.vne || ''} onChange={(e) => handleLimitsChange('vne', e.target.value)} className={getInputClass('vne')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>NO</sub></td>
                <td><input type="text" value={limitsData.vno || ''} onChange={(e) => handleLimitsChange('vno', e.target.value)} className={getInputClass('vno')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>A</sub></td>
                <td><input type="text" value={limitsData.va || ''} onChange={(e) => handleLimitsChange('va', e.target.value)} className={getInputClass('va')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>FE</sub></td>
                <td><input type="text" value={limitsData.vfe || ''} onChange={(e) => handleLimitsChange('vfe', e.target.value)} className={getInputClass('vfe')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>Y</sub></td>
                <td><input type="text" value={limitsData.vy || ''} onChange={(e) => handleLimitsChange('vy', e.target.value)} className={getInputClass('vy')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>X</sub></td>
                <td><input type="text" value={limitsData.vx || ''} onChange={(e) => handleLimitsChange('vx', e.target.value)} className={getInputClass('vx')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>glide</sub></td>
                <td><input type="text" value={limitsData.vglide || ''} onChange={(e) => handleLimitsChange('vglide', e.target.value)} className={getInputClass('vglide')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>R</sub></td>
                <td><input type="text" value={limitsData.vr || ''} onChange={(e) => handleLimitsChange('vr', e.target.value)} className={getInputClass('vr')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>S</sub></td>
                <td><input type="text" value={limitsData.vs || ''} onChange={(e) => handleLimitsChange('vs', e.target.value)} className={getInputClass('vs')} placeholder="KIAS" /></td>
              </tr>
              <tr>
                <td>V<sub>SO</sub></td>
                <td><input type="text" value={limitsData.vso || ''} onChange={(e) => handleLimitsChange('vso', e.target.value)} className={getInputClass('vso')} placeholder="KIAS" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        // Emergency Procedures
        <div className="eps-container">
        <div className="eps-two-column">
            {/* Left Column */}
            <div className="eps-column">
            <div className="ep-section">
                <h3>ENG FAIL AFTER TAKEOFF / FORCED LANDING</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat1')} value={epsData.efat1 || ''} onChange={(e) => handleEPsChange('efat1', e.target.value)} />
                    <input type="text" className={getInputClass('efat1val')} value={epsData.efat1val || ''} onChange={(e) => handleEPsChange('efat1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat2')} value={epsData.efat2 || ''} onChange={(e) => handleEPsChange('efat2', e.target.value)} />
                    <input type="text" className={getInputClass('efat2val')} value={epsData.efat2val || ''} onChange={(e) => handleEPsChange('efat2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat3')} value={epsData.efat3 || ''} onChange={(e) => handleEPsChange('efat3', e.target.value)} />
                    <input type="text" className={getInputClass('efat3val')} value={epsData.efat3val || ''} onChange={(e) => handleEPsChange('efat3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat4')} value={epsData.efat4 || ''} onChange={(e) => handleEPsChange('efat4', e.target.value)} />
                    <input type="text" className={getInputClass('efat4val')} value={epsData.efat4val || ''} onChange={(e) => handleEPsChange('efat4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat5')} value={epsData.efat5 || ''} onChange={(e) => handleEPsChange('efat5', e.target.value)} />
                    <input type="text" className={getInputClass('efat5val')} value={epsData.efat5val || ''} onChange={(e) => handleEPsChange('efat5val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *6. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat6')} value={epsData.efat6 || ''} onChange={(e) => handleEPsChange('efat6', e.target.value)} />
                    <input type="text" className={getInputClass('efat6val')} value={epsData.efat6val || ''} onChange={(e) => handleEPsChange('efat6val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *7. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat7')} value={epsData.efat7 || ''} onChange={(e) => handleEPsChange('efat7', e.target.value)} />
                    <input type="text" className={getInputClass('efat7val')} value={epsData.efat7val || ''} onChange={(e) => handleEPsChange('efat7val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *8. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efat8')} value={epsData.efat8 || ''} onChange={(e) => handleEPsChange('efat8', e.target.value)} />
                    <input type="text" className={getInputClass('efat8val')} value={epsData.efat8val || ''} onChange={(e) => handleEPsChange('efat8val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>

            <div className="ep-section">
                <h3>ENGINE FAILURE IN FLIGHT</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif1')} value={epsData.efif1 || ''} onChange={(e) => handleEPsChange('efif1', e.target.value)} />
                    <input type="text" className={getInputClass('efif1val')} value={epsData.efif1val || ''} onChange={(e) => handleEPsChange('efif1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif2')} value={epsData.efif2 || ''} onChange={(e) => handleEPsChange('efif2', e.target.value)} />
                    <input type="text" className={getInputClass('efif2val')} value={epsData.efif2val || ''} onChange={(e) => handleEPsChange('efif2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step decision-point">
                    • If Restart Will Be Attempted
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif3')} value={epsData.efif3 || ''} onChange={(e) => handleEPsChange('efif3', e.target.value)} />
                    <input type="text" className={getInputClass('efif3val')} value={epsData.efif3val || ''} onChange={(e) => handleEPsChange('efif3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif4')} value={epsData.efif4 || ''} onChange={(e) => handleEPsChange('efif4', e.target.value)} />
                    <input type="text" className={getInputClass('efif4val')} value={epsData.efif4val || ''} onChange={(e) => handleEPsChange('efif4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif5')} value={epsData.efif5 || ''} onChange={(e) => handleEPsChange('efif5', e.target.value)} />
                    <input type="text" className={getInputClass('efif5val')} value={epsData.efif5val || ''} onChange={(e) => handleEPsChange('efif5val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *6. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif6')} value={epsData.efif6 || ''} onChange={(e) => handleEPsChange('efif6', e.target.value)} />
                    <input type="text" className={getInputClass('efif6val')} value={epsData.efif6val || ''} onChange={(e) => handleEPsChange('efif6val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *7. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif7')} value={epsData.efif7 || ''} onChange={(e) => handleEPsChange('efif7', e.target.value)} />
                    <input type="text" className={getInputClass('efif7val')} value={epsData.efif7val || ''} onChange={(e) => handleEPsChange('efif7val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *8. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif8')} value={epsData.efif8 || ''} onChange={(e) => handleEPsChange('efif8', e.target.value)} />
                    <input type="text" className={getInputClass('efif8val')} value={epsData.efif8val || ''} onChange={(e) => handleEPsChange('efif8val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *9. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efif9')} value={epsData.efif9 || ''} onChange={(e) => handleEPsChange('efif9', e.target.value)} />
                    <input type="text" className={getInputClass('efif9val')} value={epsData.efif9val || ''} onChange={(e) => handleEPsChange('efif9val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>

            <div className="ep-section">
                <h3>ENGINE FIRE IN FLIGHT</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff1')} value={epsData.efiff1 || ''} onChange={(e) => handleEPsChange('efiff1', e.target.value)} />
                    <input type="text" className={getInputClass('efiff1val')} value={epsData.efiff1val || ''} onChange={(e) => handleEPsChange('efiff1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff2')} value={epsData.efiff2 || ''} onChange={(e) => handleEPsChange('efiff2', e.target.value)} />
                    <input type="text" className={getInputClass('efiff2val')} value={epsData.efiff2val || ''} onChange={(e) => handleEPsChange('efiff2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff3')} value={epsData.efiff3 || ''} onChange={(e) => handleEPsChange('efiff3', e.target.value)} />
                    <input type="text" className={getInputClass('efiff3val')} value={epsData.efiff3val || ''} onChange={(e) => handleEPsChange('efiff3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff4')} value={epsData.efiff4 || ''} onChange={(e) => handleEPsChange('efiff4', e.target.value)} />
                    <input type="text" className={getInputClass('efiff4val')} value={epsData.efiff4val || ''} onChange={(e) => handleEPsChange('efiff4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff5')} value={epsData.efiff5 || ''} onChange={(e) => handleEPsChange('efiff5', e.target.value)} />
                    <input type="text" className={getInputClass('efiff5val')} value={epsData.efiff5val || ''} onChange={(e) => handleEPsChange('efiff5val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *6. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efiff6')} value={epsData.efiff6 || ''} onChange={(e) => handleEPsChange('efiff6', e.target.value)} />
                    <input type="text" className={getInputClass('efiff6val')} value={epsData.efiff6val || ''} onChange={(e) => handleEPsChange('efiff6val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Right Column */}
            <div className="eps-column">
            <div className="ep-section">
                <h3>ABORT TAKEOFF</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('abort1')} value={epsData.abort1 || ''} onChange={(e) => handleEPsChange('abort1', e.target.value)} />
                    <input type="text" className={getInputClass('abort1val')} value={epsData.abort1val || ''} onChange={(e) => handleEPsChange('abort1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('abort2')} value={epsData.abort2 || ''} onChange={(e) => handleEPsChange('abort2', e.target.value)} />
                    <input type="text" className={getInputClass('abort2val')} value={epsData.abort2val || ''} onChange={(e) => handleEPsChange('abort2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('abort3')} value={epsData.abort3 || ''} onChange={(e) => handleEPsChange('abort3', e.target.value)} />
                    <input type="text" className={getInputClass('abort3val')} value={epsData.abort3val || ''} onChange={(e) => handleEPsChange('abort3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step decision-point">
                    •IF DUE TO FIRE/ENG FAIL
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('abort4')} value={epsData.abort4 || ''} onChange={(e) => handleEPsChange('abort4', e.target.value)} />
                    <input type="text" className={getInputClass('abort4val')} value={epsData.abort4val || ''} onChange={(e) => handleEPsChange('abort4val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>

            <div className="ep-section">
                <h3>EMERGENCY SHUTDOWN ON DECK</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('esd1')} value={epsData.esd1 || ''} onChange={(e) => handleEPsChange('esd1', e.target.value)} />
                    <input type="text" className={getInputClass('esd1val')} value={epsData.esd1val || ''} onChange={(e) => handleEPsChange('esd1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('esd2')} value={epsData.esd2 || ''} onChange={(e) => handleEPsChange('esd2', e.target.value)} />
                    <input type="text" className={getInputClass('esd2val')} value={epsData.esd2val || ''} onChange={(e) => handleEPsChange('esd2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('esd3')} value={epsData.esd3 || ''} onChange={(e) => handleEPsChange('esd3', e.target.value)} />
                    <input type="text" className={getInputClass('esd3val')} value={epsData.esd3val || ''} onChange={(e) => handleEPsChange('esd3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('esd4')} value={epsData.esd4 || ''} onChange={(e) => handleEPsChange('esd4', e.target.value)} />
                    <input type="text" className={getInputClass('esd4val')} value={epsData.esd4val || ''} onChange={(e) => handleEPsChange('esd4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('esd5')} value={epsData.esd5 || ''} onChange={(e) => handleEPsChange('esd5', e.target.value)} />
                    <input type="text" className={getInputClass('esd5val')} value={epsData.esd5val || ''} onChange={(e) => handleEPsChange('esd5val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>

            <div className="ep-section">
                <h3>ENGINE FIRE DURING START</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efds1')} value={epsData.efds1 || ''} onChange={(e) => handleEPsChange('efds1', e.target.value)} />
                    <input type="text" className={getInputClass('efds1val')} value={epsData.efds1val || ''} onChange={(e) => handleEPsChange('efds1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step note-text">
                    Continue until engine starts or until mags selected off.
                </div>
                <div className="ep-step decision-point">
                    •IF ENGINE STARTS
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efds2')} value={epsData.efds2 || ''} onChange={(e) => handleEPsChange('efds2', e.target.value)} />
                    <input type="text" className={getInputClass('efds2val')} value={epsData.efds2val || ''} onChange={(e) => handleEPsChange('efds2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efds3')} value={epsData.efds3 || ''} onChange={(e) => handleEPsChange('efds3', e.target.value)} />
                    <input type="text" className={getInputClass('efds3val')} value={epsData.efds3val || ''} onChange={(e) => handleEPsChange('efds3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step decision-point">
                    •IF ENGINE FAILS TO START
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efds4')} value={epsData.efds4 || ''} onChange={(e) => handleEPsChange('efds4', e.target.value)} />
                    <input type="text" className={getInputClass('efds4val')} value={epsData.efds4val || ''} onChange={(e) => handleEPsChange('efds4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('efds5')} value={epsData.efds5 || ''} onChange={(e) => handleEPsChange('efds5', e.target.value)} />
                    <input type="text" className={getInputClass('efds5val')} value={epsData.efds5val || ''} onChange={(e) => handleEPsChange('efds5val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>

            <div className="ep-section">
                <h3>ELEC FIRE IN FLIGHT</h3>
                <div className="ep-steps">
                <div className="ep-step">
                    *1. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec1')} value={epsData.elec1 || ''} onChange={(e) => handleEPsChange('elec1', e.target.value)} />
                    <input type="text" className={getInputClass('elec1val')} value={epsData.elec1val || ''} onChange={(e) => handleEPsChange('elec1val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *2. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec2')} value={epsData.elec2 || ''} onChange={(e) => handleEPsChange('elec2', e.target.value)} />
                    <input type="text" className={getInputClass('elec2val')} value={epsData.elec2val || ''} onChange={(e) => handleEPsChange('elec2val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *3. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec3')} value={epsData.elec3 || ''} onChange={(e) => handleEPsChange('elec3', e.target.value)} />
                    <input type="text" className={getInputClass('elec3val')} value={epsData.elec3val || ''} onChange={(e) => handleEPsChange('elec3val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *4. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec4')} value={epsData.elec4 || ''} onChange={(e) => handleEPsChange('elec4', e.target.value)} />
                    <input type="text" className={getInputClass('elec4val')} value={epsData.elec4val || ''} onChange={(e) => handleEPsChange('elec4val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step decision-point">
                    •IF FIRE REMAINS
                </div>
                <div className="ep-step">
                    *5. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec5')} value={epsData.elec5 || ''} onChange={(e) => handleEPsChange('elec5', e.target.value)} />
                    <input type="text" className={getInputClass('elec5val')} value={epsData.elec5val || ''} onChange={(e) => handleEPsChange('elec5val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *6. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec6')} value={epsData.elec6 || ''} onChange={(e) => handleEPsChange('elec6', e.target.value)} />
                    <input type="text" className={getInputClass('elec6val')} value={epsData.elec6val || ''} onChange={(e) => handleEPsChange('elec6val', e.target.value)} />
                    </div>
                </div>
                <div className="ep-step">
                    *7. 
                    <div className="ep-input-pair">
                    <input type="text" className={getInputClass('elec7')} value={epsData.elec7 || ''} onChange={(e) => handleEPsChange('elec7', e.target.value)} />
                    <input type="text" className={getInputClass('elec7val')} value={epsData.elec7val || ''} onChange={(e) => handleEPsChange('elec7val', e.target.value)} />
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.9em', textAlign: 'center' }}>
            * DENOTES CRITICAL MEMORY ITEMS • DENOTES DECISION CONTINUATION
        </p>
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
  );
}

export default LimitsEPs;