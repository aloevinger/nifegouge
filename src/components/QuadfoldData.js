/**
 * Array of individual Quadfold divs
 * Each item is a function that takes props and returns a complete section
 *
 * Usage:
 * const quadDivs = getQuadDivs(props);
 * const singleQuad = quadDivs[0]; // Get a specific item
 */

// Define styles for Quad divs
const btFontSize = '10px'
const asFontSize = '10px'
const quadSectionStyle = {
  marginBottom: '6px',
  border: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
  maxWidth: "350px",
  margin: '0 auto'
};

const quadHeaderStyle = {
  backgroundColor: '#000',
  color: 'white',
  padding: '6px 12px',
  fontSize: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #000'
};

const quadStepStyle = {
  padding: '4px 6px',
  display: 'flex',
  alignItems: 'center',
  gap: '0px',
  borderBottom: '1px solid #ddd',
  fontSize: '11px',
  backgroundColor: 'white'
};

const quadSubStepStyle = {
  padding: '4px 12px 4px 32px',
  fontSize: '9px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
  textAlign: 'right'
};

export const getQuadDivs = ({getInputClass}) => {

  return [
    // 0. COCKPIT (ALL FLIGHTS)
    (
        <div key="qbt" style={{display: 'flex', gap: '5px', alignItems: 'flex-start', justifyContent: 'center'}}>
            {/* LEFT CONTROLS */}
            <div style={{display: 'flex', flexDirection: 'column', width: '350px', minWidth: '250px'}}>
                <div key="qbt" style={{...quadSectionStyle, maxWidth: 'none', width: '100%', margin: '0'}}>
                    <div style={quadHeaderStyle}>COCKPIT (ALL FLIGHTS)</div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt1')}>1. Strap in ---------- COMPLETE</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt2')}>2. BAT switch ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt3')}>3. Regulator anti-suffocation valve ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt4')}>4. External Power ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt5')}>5. Seat height ---------- ADJUST</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt6')}>6. Rudder pedals ---------- ADJUST</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt7')}>7. Flight controls ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt8')}>8. Fire detection system ---------- TEST (FIRE 1 and FIRE 2)</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt9')}>9. Lamp test switch ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt10')}>10. Flaps ---------- UP</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt11')}>11. Exterior lights ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt12')}>12. TRIM DISCONNECT switch ---------- NORM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt13')}>13. Interior lights ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt14')}>14. TRIM AID switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt15')}>15. Trim operation ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt16')}>16. EMER LDG GR handle ---------- CHECK STOWED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt17')}>17. Clock ---------- SET</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt18')}>18. UFCP lower panel switches ---------- SET</span>
                    </div>
                </div>
            </div>
            {/* Right CONTROLS */}
            <div style={{display: 'flex', flexDirection: 'column', width: '350px', minWidth: '250px'}}>
                <div key="qbt" style={{...quadSectionStyle, maxWidth: 'none', width: '100%', margin: '0'}}>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt19')}>19. Audio panel ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt20')}>20. DEFOG switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt21')}>21. ELT switch ---------- ARM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt22')}>22. PARKING BRAKE ---------- RESET</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt23')}>23. Chocks ---------- REMOVED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt24')}>24. GEN switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt25')}>25. FUEL BAL switch ---------- AUTO</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt26')}>26. MANUAL FUEL BAL switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt27')}>27. AVIONICS MASTER switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt28')}>28. BUS TIE switch ---------- NORM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt29')}>29. PROBES ANTI-ICE switch ---------- CHECK, OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt30')}>30. BOOST PUMP switch ---------- CHECK, ARM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt31')}>31. PMU switch ---------- NORM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt32')}>32. EVAP BLWR control ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt33')}>33. AIR COND switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt34')}>34. BLEED AIR INFLOW switch ---------- OFF</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt35')}>35. PRESSURIZATION switch ---------- NORM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt36')}>36. RAM AIR FLOW switch ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: btFontSize}}>
                    <span className={getInputClass('qbt37')}>37. TEMP CONTROL switch ---------- AUTO</span>
                    </div>
                </div>
            </div>
        </div>
    ),      

    // 1. HIGH IOAT AT START (>80° C)
    (
      <div key="qhias" style={quadSectionStyle}>
        <div style={{...quadHeaderStyle, backgroundColor: '#d32f2f'}}>HIGH IOAT AT START (&gt;80° C)</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias1')}>1. PCL ---------- VERIFY OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias2')}>2. PMU ---------- RESET IF NECESSARY</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias3')}>3. PMU switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias4')}>4. Propeller Area ---------- CLEAR</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias5')}>5. STARTER switch ---------- MANUAL FOR 20 SEC MAX</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias6')}>6. STARTER switch ---------- NORM</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias7')}>7. Repeat Steps 4-6 if IOAT is greater than 80°C</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias8')}>8. PMU switch ---------- NORM</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qhias9')}>9. Continue with Engine Start</span>
        </div>
      </div>
    ),

    // 2. ENGINE START (AUTO)
    (
      <div key="qes" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>ENGINE START (AUTO)</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes1')}>1. Canopy ---------- CLOSED AND LATCHED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes2')}>2. Navigation and anti-collision lights ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes3')}>3. PMU FAIL/PMU STATUS message ---------- EXTINGUISHED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes4')}>4. PCL ---------- ADVANCE TO START POSITION</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes5')}>5. Propeller area ---------- CLEAR</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes6')}>6. STARTER switch ---------- AUTO/RESET</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes7')}>7. Engine Start ---------- MONITOR</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes8')}>8. PCL ---------- ADVANCE PAST TWO CLICKS, THEN IDLE, AT OR ABOVE 60% N1</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qes9')}>9. External power ---------- DISCONNECTED</span>
        </div>
      </div>
    ),

    // 3. MOTORING RUN PROCEDURE
    (
      <div key="qmrp" style={quadSectionStyle}>
        <div style={{...quadHeaderStyle, backgroundColor: '#d32f2f'}}>MOTORING RUN PROCEDURE</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qmrp1')}>1. PCL ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qmrp2')}>2. IGNITION switch ---------- NORM</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qmrp3')}>3. Propeller area ---------- CLEAR</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qmrp4')}>4. STARTER switch ---------- MANUAL for 20 sec</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qmrp5')}>5. STARTER switch ---------- NORM</span>
        </div>
      </div>
    ),

    // 4. Before Taxi
    (
        
        <div key="qas" style={{display: 'flex', gap: '5px', alignItems: 'flex-start', justifyContent: 'center'}}>
            {/* LEFT CONTROLS */}
            <div style={{display: 'flex', flexDirection: 'column', width: '350px', minWidth: '250px'}}>
                <div key="qas" style={{...quadSectionStyle, maxWidth: 'none', width: '100%', margin: '0'}}>
                    <div style={quadHeaderStyle}>BEFORE TAXI</div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas1')}>1. GEN switch ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas2')}>2. AUX BAT switch ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas3')}>3. BLED AIR INFLOW switch ---------- NORM</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas4')}>4. EVAP BLWR control ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas5')}>5. AIR COND switch ---------- AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas6')}>6. AVIONICS MASTER switch ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas7')}>7. OBOGS supply lever ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas8')}>8. Oxygen mask ---------- ON AND SECURE</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas9')}>9. OBOGS ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas10')}>10. Anti-G test ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas11')}>11. System test panel ---------- CHECK</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11a')}>a. Lamp test switch -------------------- CHECK</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11b')}>b. AOA system test switch -------------- TEST</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11c')}>c. ALT audio switch ----------------------- TEST</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11d')}>d. LDG GR audio swtich ---------------- TEST</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11e')}>e. OVR SPD audio switch -------------- TEST</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11f')}>f. OVR G audio switch ------------------- TEST</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas11g')}>g. BINGO FUEL audio switch ---------- TEST</span>
                    </div>
                </div>
            </div>
            {/* Right CONTROLS */}
            <div style={{display: 'flex', flexDirection: 'column', width: '350px', minWidth: '250px'}}>
                <div key="qas" style={{...quadSectionStyle, maxWidth: 'none', width: '100%', margin: '0'}}>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas12')}>12. Speed brake ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas13')}>13. Flaps ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas14')}>14. TRIM AID switch ---------- ON</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span>(Verify TAD OFF extinguished & Rudder Trim set to T/O)</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas15')}>15. Nosewheel steering ---------- ON</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas16')}>16. PARKING BRAKE ---------- RELEASE</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas17')}>17. Brakes ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas18')}>18. TCAS ---------- ON/TEST</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas19')}>19. UFCP and MFD ---------- CHECK AND SET</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19a')}>a. Database, location, and alignment --- CHECK</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19b')}>b. UHF -------------------------------- AS REQUIRED</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19c')}>c. VHF --------------------------------- AS REQUIRED</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19d')}>d. VOR -------------------------------- AS REQUIRED</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19e')}>e. Transponder and FLT NO ------------------- SET</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19f')}>f. FMS --------------------------------- AS REQUIRED</span>
                    </div>
                    <div style={quadSubStepStyle}>
                    <span className={getInputClass('qas19g')}>g. Altitude, G, speed, fuel flags - AS REQUIRED</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas20')}>20. Flight instruments ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas21')}>21. Altimeters ---------- SET AND CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas22')}>22. EICAS display ---------- CHECK</span>
                    </div>
                    <div style={{...quadStepStyle, fontSize: asFontSize}}>
                    <span className={getInputClass('qas23')}>23. Landing/taxi lights ---------- AS REQUIRED</span>
                    </div>
                </div>
            </div>
        </div>
    ),

    // 5. TAXI
    (
      <div key="qtaxi" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>TAXI</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qtaxi1')}>1. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qtaxi2')}>2. Heading and turn and slip indicators ---------- CHECK</span>
        </div>
      </div>
    ),

    // 6. OVERSPEED GOVERNOR CHECK
    (
      <div key="qogc" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>OVERSPEED GOVERNOR CHECK</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc1')}>1. Brakes ---------- HOLD AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc2')}>2. PCL ---------- IDLE</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc3')}>3. PMU switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc4')}>4. PCL ---------- ADVANCE AND VERIFY NP STABILIZES at 100±2%</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc5')}>5. PCL ---------- ADVANCE AT LEAST AN ADDITIONAL 5% TORQUE AND VERIFY NP STABILIZES AT 100±2%</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc6')}>6. PCL ---------- IDLE</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qogc7')}>7. PMU switch ---------- NORM</span>
        </div>
      </div>
    ),

    // 7. BEFORE TAKEOFF
    (
      <div key="qbto" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>BEFORE TAKEOFF</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto1')}>1. Minimum power by 60 KIAS ---------- COMPUTE</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto2')}>2. Speed brake ---------- RETRACTED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto3')}>3. Flaps ---------- TO</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto4')}>4. Trim ---------- SET FOR TAKEOFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto5')}>5. Fuel quantity and balance ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto6')}>6. Engine instruments ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto7')}>7. DVR control ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto8')}>8. Electrical system ---------- VERIFY &gt;27 volts &amp; +50 amps OR LESS</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto9')}>9. DEFOG switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto10')}>10. Seat safety pin ---------- REMOVED AND STOWED (BOTH)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbto11')}>11. ISS mode selector ---------- AS REQUIRED</span>
        </div>
      </div>
    ),

    // 8. LINEUP CHECK
    (
      <div key="qlc" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>LINEUP CHECK</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qlc1')}>1. Exterior lights ---------- ON</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qlc2')}>2. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qlc3')}>3. PROBES ANTI-ICE switch ---------- ON</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qlc4')}>4. Nosewheel steering ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qlc5')}>5. EICAS display ---------- CHECK</span>
        </div>
      </div>
    ),

    // 9. AFTER TAKEOFF
    (
      <div key="qat" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>AFTER TAKEOFF</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qat1')}>1. Gear ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qat2')}>2. Flaps ---------- UP</span>
        </div>
      </div>
    ),

    // 10. CLIMB (PASSING 10,000 FEET)
    (
      <div key="qclimb" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>CLIMB (PASSING 10,000 FEET)</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qclimb1')}>1. OBOGS ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qclimb2')}>2. DEFOG switch ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qclimb3')}>3. Vent control lever ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qclimb4')}>4. Pressurization system ---------- CHECK</span>
        </div>
      </div>
    ),

    // 11. OPERATIONS CHECK
    (
      <div key="qoc" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>OPERATIONS CHECK</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc1')}>1. Hydraulic pressure ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc2')}>2. Electrical systems ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc3')}>3. Fuel quantity/balance ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc4')}>4. OBOGS ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc5')}>5. Engine instruments ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qoc6')}>6. Pressurization ---------- CHECK</span>
        </div>
      </div>
    ),

    // 12. PRE-STALL, SPIN, AND AEROBATIC CHECKS
    (
      <div key="qpssa" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>PRE-STALL, SPIN, AND AEROBATIC CHECKS</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qpssa1')}>1. Loose items ---------- STOWED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qpssa2')}>2. Engine instruments ---------- CHECKED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qpssa3')}>3. Fuel balance ---------- CHECK LESS THAN 50 POUNDS</span>
        </div>
      </div>
    ),

    // 13. DESCENT
    (
      <div key="qdesc" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>DESCENT</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qdesc1')}>1. PFD ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qdesc2')}>2. Altimeters ---------- SET</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qdesc3')}>3. MASTER ARM switch ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qdesc4')}>4. DEFOG switch ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qdesc5')}>5. Vent control lever ---------- AS REQUIRED</span>
        </div>
      </div>
    ),

    // 14. BEFORE LANDING
    (
      <div key="qbl" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>BEFORE LANDING</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl1')}>1. DEFOG switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl2')}>2. Engine instruments ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl3')}>3. Gear ---------- DOWN</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl4')}>4. Brakes ---------- CHECK, AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl5')}>5. FLAPS ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbl6')}>6. Speed brake ---------- RETRACTED</span>
        </div>
      </div>
    ),

    // 15. FULL STOP/TAXI BACK CHECKLIST
    (
      <div key="qfstb" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>FULL STOP/TAXI BACK CHECKLIST</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb1')}>1. PROBES ANTI-ICE switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb2')}>2. Flaps ---------- TO</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb3')}>3. Trim ---------- Set for Takeoff</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb4')}>4. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb5')}>5. Fuel quantity and balance ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb6')}>6. Engine instruments ---------- CHECK</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb7')}>7. DEFOG switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb8')}>8. Minimum power by 60 KIAS ---------- COMPUTE</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb9')}>9. Exterior lights ---------- ON</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb10')}>10. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb11')}>11. PROBES ANTI-ICE switch ---------- ON</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb12')}>12. Nose wheel steering ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qfstb13')}>13. EICAS display ---------- CHECK</span>
        </div>
      </div>
    ),

    // 16. AFTER LANDING
    (
      <div key="qal" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>AFTER LANDING</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal1')}>1. ISS mode selector ---------- SOLO OR CMD FWD</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal2')}>2. Seat safety pin ---------- INSTALL</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal3')}>3. PROBES ANTI-ICE switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal4')}>4. Flaps ---------- UP</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal5')}>5. Trim interrupt button ---------- DEPRESS</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal6')}>6. Trim ---------- SET FOR TAKEOFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal7')}>7. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal8')}>8. TCAS ---------- STBY</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qal9')}>9. BLEED AIR INFLOW switch ---------- OFF</span>
        </div>
      </div>
    ),

    // 17. ENGINE SHUTDOWN
    (
      <div key="qesd" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>ENGINE SHUTDOWN</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd1')}>1. PARKING BRAKE ---------- SET</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd2')}>2. Landing and taxi lights ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd3')}>3. Transponder ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd4')}>4. AVIONICS MASTER switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd5')}>5. RAM AIR FLOW switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd6')}>6. AIR COND switch ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd7')}>7. EVAP BLWR control ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd8')}>8. Oxygen mask ---------- REMOVE</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd9')}>9. OBOGS ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd10')}>10. PCL ---------- IDLE &gt;60 SECONDS, THEN OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd11')}>11. CANOPY ---------- OPEN (AS REQUIRED)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd12')}>12. PMU STATUS message ---------- EXTINGUISHED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd13')}>13. FDR light ---------- EXTINGUISHED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd14')}>14. Gust lock ---------- ENGAGE (AS REQUIRED)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd15')}>15. Interior/exterior lights ---------- OFF</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qesd16')}>16. GEN, BAT, and AUX BAT switches ---------- OFF</span>
        </div>
      </div>
    ),

    // 18. BEFORE LEAVING AIRCRAFT
    (
      <div key="qbla" style={quadSectionStyle}>
        <div style={quadHeaderStyle}>BEFORE LEAVING AIRCRAFT</div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla1')}>1. CFS handle safety pins ---------- INSTALL</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla2')}>2. DTS/DVR cartridge ---------- REMOVE (AS REQUIRED)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla3')}>3. ISS mode selector ---------- SOLO</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla4')}>4. Oxygen hose and communication cord ---------- STOW WITH LOOP FORWARD</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla5')}>5. HUD combiner cover ---------- INSTALL</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla6')}>6. Wheel chocks ---------- INSTALL (AS REQUIRED)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla7')}>7. PARKING BRAKE ---------- AS REQUIRED</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla8')}>8. Canopy ---------- CLOSED (AS REQUIRED)</span>
        </div>
        <div style={quadStepStyle}>
          <span className={getInputClass('qbla9')}>9. Exterior walk-around inspection ---------- VISUALLY CHECK</span>
        </div>
      </div>
    )
  ];
};

// Export helper data
export const QUAD_ANSWERS = {
  // COCKPIT (ALL FLIGHTS)
  qbt1: ["Strap in ---------- COMPLETE"],
  qbt2: ["BAT\u200B switch ---------- ON", "VOLTS"],
  qbt3: ["Regulator anti-suffocation valve ---------- CHECK"],
  qbt4: ["External Power ---------- AS REQUIRED", "VOLTS"],
  qbt5: ["Sea\u200Bt height ---------- ADJUST"],
  qbt6: ["Rudder pedals ---------- ADJUST"],
  qbt7: ["Flight controls ---------- CHECK"],
  qbt8: ["Fire detection ", "Master Warning", "Fire Light"],
  qbt9: ["Lamp test ", "Gear", "Gea\u200Br Light", "FD\u200BR", "Master Warning", "Fire Light", "Master Caution", "COM1", "COM2", "EICAS"],
  qbt10: ["Flaps ---------- UP"],
  qbt11: ["landing/", "taxi light", "anti-coll light", "nav light"],
  qbt12: ["TRI\u200BM DISCONNECT switch ---------- NORM"],
  qbt13: ['floodLight', 'sideLight', 'instLight'],
  qbt14: ["TRI\u200BM AID switch ---------- OFF"],
  qbt15: ["PCL", "NWS"],
  qbt16: ["EMER LDG GR handle ---------- CHECK STOWED"],
  qbt17: ["Clock ---------- SET"],
  qbt18: ['hudcage', 'hudlgt', 'mfdrep', 'lgthud', 'lgtufcp'],
  qbt19: ['COM1','COM2', 'NAVCOM', 'DME', 'MKR', 'VOX','EMR/NRM'],
  qbt20: ["DEFOG switch ---------- OFF"],
  qbt21: ["ELT switch ---------- ARM"],
  qbt22: ["PARKING BRAKE ---------- RESET"],
  qbt23: ["Chocks ---------- REMOVED"],
  qbt24: ["GEN switch ---------- OFF"],
  qbt25: ["FUEL BAL switch ---------- AUTO"],
  qbt26: ["MANUAL FUEL\u200B BAL switch ---------- OFF"],
  qbt27: ["AVIONICS MASTER switch ---------- OFF"],
  qbt28: ["BUS TIE switch ---------- NORM"],
  qbt29: ["PROBES ANTI-ICE switch ---------- CHECK, OFF", "EICAS"],
  qbt30: ["BOOST PUMP switch ---------- CHECK, ARM", "EICAS"],
  qbt31: ["PMU switch ---------- NORM"],
  qbt32: ["EVAP BLWR control ---------- AS REQUIRED"],
  qbt33: ["AIR COND switch ---------- OFF"],
  qbt34: ["BLEED AIR INFLOW switch ---------- OFF"],
  qbt35: ["PRESSURIZATION switch ---------- NORM"],
  qbt36: ["RAM AIR FLOW switch ---------- AS REQUIRED"],
  qbt37: ["TEMP CONTROL switch ---------- AUTO"],

  // HIGH IOAT AT START
  qhias1: ["PCL ---------- VERIFY OFF"],
  qhias2: ["PMU ---------- RESET IF NECESSARY"],
  qhias3: ["PMU switch ---------- OFF"],
  qhias4: ["Pro\u200Bp\u200Beller Area ---------- CLEAR"],
  qhias5: ["STARTER switch ---------- MANUAL FOR 20 SEC MAX"],
  qhias6: ["STARTER switch ---------- NORM"],
  qhias7: ["Repeat Steps 4-6 if IOAT is greater than 80°C"],
  qhias8: ["PMU switch ---------- NORM"],
  qhias9: [""],

  // ENGINE START (AUTO)
  qes1: ["Canopy ---------- CLOSED AND LATCHED"],
  qes2: ["anti-coll light", "nav light"],
  qes3: ["EICAS"],
  qes4: ["PCL ---------- ADVANCE TO START POSITION", "EICAS"],
  qes5: ["Pro\u200Bp\u200Beller area ---------- CLEAR"],
  qes6: ["STARTER switch ---------- AUTO/RESET"],
  qes7: ["Hyd Press", "ITT", "N1", "EICAS", "Fuel Flow"],
  qes8: ["PCL", "N1", "ITT"],
  qes9: ["External power ---------- DISCONNECTED"],

  // MOTORING RUN PROCEDURE
  qmrp1: ["PCL ---------- OFF"],
  qmrp2: ["IGNITION switch ---------- NORM"],
  qmrp3: ["Pro\u200Bp\u200Beller area ---------- CLEAR"],
  qmrp4: ["STARTER switch ---------- MANUAL for 20 sec"],
  qmrp5: ["STARTER switch ---------- NORM"],

  // BEFORE TAXI
  qas1: ["GEN switch ---------- ON", "VOLTS"],
  qas2: ["AUX BAT switch ---------- ON"],
  qas3: ["BLED AIR INFLOW switch ---------- NORM"],
  qas4: ["EVAP BLWR control ---------- AS REQUIRED"],
  qas5: ["AIR COND switch ---------- AS REQUIRED"],
  qas6: ["AVIONICS MASTER switch ---------- ON"],
  qas7: ["OBOGS supply lever ---------- ON"],
  qas8: ["Oxyg\u200Ben mask ---------- ON AND SECURE"],
  qas9: ["concentration", "pressure", "flow i"],
  qas10: ["Anti-G test ---------- CHECK"],
  qas11: ["System test panel ---------- CHECK"],
  qas11a: ["Lamp test ", "Gear", "Gea\u200Br Light", "FD\u200BR", "Master Warning", "Fire Light", "Master Caution", "COM1", "COM2", "EICAS"],
  qas11b: ["AOA system \u200Btest switch ---------- CHECK", "Amber Donut", "Red Chevron", "Green Chevron", "AOA Indicator", "Controls"],
  qas11c: ["ALT audio switch ---------- CHECK"],
  qas11d: ["LDG GR audio swtich ---------- CHECK"],
  qas11e: ["OVR SPD audio switch ---------- CHECK"],
  qas11f: ["OVR G audio switch ---------- CHECK"],
  qas11g: ["BINGO FUEL audio switch ---------- CHECK"],
  qas12: ["Speed brake ---------- CHECK", "EICAS"],
  qas13: ["Flaps ---------- CHECK", "Flap Indicator", "EICAS", "Speed Brake"],
  qas14: ["TRI\u200BM AID switch ---------- ON", "EICAS"],
  qas15: ["Nosewheel steering ---------- ON"],
  qas16: ["PARKING BRAKE ---------- RELEASE"],
  qas17: ["Brakes ---------- CHECK"],
  qas18: ["TCAS ---------- ON/TEST", "TCA\u200BS Range", "UHF"],
  qas19: ["UFCP and MFD ---------- CHECK AND SET"],
  qas19a: ["Database, location, and alignment --- CHECK"],
  qas19b: ["UHF -------------------------------- AS REQUIRED"],
  qas19c: ["VHF --------------------------------- AS REQUIRED"],
  qas19d: ["VOR -------------------------------- AS REQUIRED"],
  qas19e: ["Transponder and FLT NO ------------------- SET"],
  qas19f: ["FMS --------------------------------- AS REQUIRED"],
  qas19g: ["Altitud\u200Be, G, spee\u200Bd, fue\u200Bl flags - AS REQUIRED", "G Reset", "Bingo Set", "System Button"],
  qas20: ["Flight instruments ---------- CHECK"],
  qas21: ["Altimeters ---------- SET AND CHECK", 'altimete2r'],
  qas22: ["EICAS display ---------- CHECK"],
  qas23: ["landing/", "taxi light"],

  // TAXI
  qtaxi1: ["Transponder ---------- AS REQUIRED"],
  qtaxi2: ["slip skid", "heading indi", "turn indi"],

  // OVERSPEED GOVERNOR CHECK
  qogc1: ["Brakes ---------- HOLD AS REQUIRED"],
  qogc2: ["PCL ---------- IDLE", "N1"],
  qogc3: ["PMU switch ---------- OFF", "N1"],
  qogc4: ["PCL", "N\u200BP"],
  qogc5: ["PCL", "TORQUE", "N\u200BP"],
  qogc6: ["PCL ---------- IDLE", "N1"],
  qogc7: ["PMU switch ---------- NORM", "N1", "N\u200BP"],

  // BEFORE TAKEOFF
  qbto1: ["Torque"],
  qbto2: ["EICAS"],
  qbto3: ["Flaps ---------- TO", "Flap Indicator"],
  qbto4: ["Tri\u200Bm Indicator"],
  qbto5: ["Fuel quantity and balance ---------- CHECK"],
  qbto6: ["Engine instruments ---------- CHECK"],
  qbto7: ["DVR control ---------- AS REQUIRED"],
  qbto8: ["Electrical system ---------- VERIFY >27 volts & +50 amps OR LESS"],
  qbto9: ["DEFOG switch ---------- OFF"],
  qbto10: ["Seat safety pin ---------- REMOVED AND STOWED (BOTH)"],
  qbto11: ["ISS mode selector ---------- AS REQUIRED"],

  // LINEUP CHECK
  qlc1: ["landing/", "taxi light", "anti-coll light"],
  qlc2: ["Transponder ---------- AS REQUIRED"],
  qlc3: ["PROBES ANTI-ICE switch ---------- ON", "EICAS"],
  qlc4: ["Nosewheel steering ---------- OFF", "EICAS"],
  qlc5: ["EICAS display ---------- CHECK"],

  // AFTER TAKEOFF
  qat1: ["Gear ---------- AS REQUIRED", "Altitude", "vsi"],
  qat2: ["Flaps ---------- UP", "airspeed", "Gea\u200Br Light"],

  // CLIMB (PASSING 10,000 FEET)
  qclimb1: ["concentration", "Flow I"],
  qclimb2: ["DEFOG switch ---------- AS REQUIRED"],
  qclimb3: ["Vent control lever ---------- AS REQUIRED"],
  qclimb4: ["P\u200Bressurization system ---------- CHECK"],

  // OPERATIONS CHECK
  qoc1: ["Hyd press"],
  qoc2: ["Volts"],
  qoc3: ["Fuel quantity/balance ---------- CHECK"],
  qoc4: ["Flow I"],
  qoc5: ["Engine instruments ---------- CHECK"],
  qoc6: ["P\u200Bressurization ---------- CHECK"],

  // PRE-STALL, SPIN, AND AEROBATIC CHECKS
  qpssa1: ["Loose items ---------- STOWED"],
  qpssa2: ["Engine instruments ---------- CHECKED"],
  qpssa3: ["Fuel b\u200Balance ---------- CHECK LESS THAN 50 POUNDS"],

  // DESCENT
  qdesc1: ["PFD ---------- CHECK", "BFI"],
  qdesc2: ["Altimeters ---------- SET", "altimete2r"],
  qdesc3: ["MASTER ARM switch ---------- AS REQUIRED"],
  qdesc4: ["DEFOG switch ---------- AS REQUIRED"],
  qdesc5: ["Vent control lever ---------- AS REQUIRED"],

  // BEFORE LANDING
  qbl1: ["DEFOG switch ---------- OFF"],
  qbl2: ["Engine instruments ---------- CHECK"],
  qbl3: ["Gear ---------- DOWN", "Gea\u200Br Light"],
  qbl4: ["Brakes ---------- CHECK, AS REQUIRED"],
  qbl5: ["FLAPS ---------- AS REQUIRED", "Flap Indicator"],
  qbl6: ["EICAS"],

  // FULL STOP/TAXI BACK CHECKLIST
  qfstb1: ["PROBES ANTI-ICE switch ---------- OFF"],
  qfstb2: ["Flaps ---------- TO", "Flap Indicator"],
  qfstb3: ["Tri\u200Bm indicator"],
  qfstb4: ["Transponder ---------- AS REQUIRED"],
  qfstb5: ["Fuel quantity and balance ---------- CHECK"],
  qfstb6: ["Engine instruments ---------- CHECK"],
  qfstb7: ["DEFOG switch ---------- OFF"],
  qfstb8: ["TORQUE"],
  qfstb9: ["landing/", "taxi light", "anti-coll light", "nav light"],
  qfstb10: ["Transponder ---------- AS REQUIRED"],
  qfstb11: ["PROBES ANTI-ICE switch ---------- ON"],
  qfstb12: ["Nose wheel steering ---------- OFF"],
  qfstb13: ["EICAS display ---------- CHECK"],

  // AFTER LANDING
  qal1: ["ISS mode selector ---------- SOLO OR CMD FWD"],
  qal2: ["Seat safety pin ---------- INSTALL"],
  qal3: ["PROBES ANTI-ICE switch ---------- OFF", "EICAS"],
  qal4: ["Flaps ---------- UP", "Flap Indicator"],
  qal5: ["T\u200Brim interrupt button ---------- DEPRESS", "EICAS"],
  qal6: ["Tri\u200Bm indicator"],
  qal7: ["Transponder ---------- AS REQUIRED"],
  qal8: ["TCAS ---------- STBY"],
  qal9: ["BLEED AIR INFLOW switch ---------- OFF"],

  // ENGINE SHUTDOWN
  qesd1: ["PARKING BRAKE ---------- SET"],
  qesd2: ["landing/", "taxi light"],
  qesd3: ["Transponder ---------- AS REQUIRED"],
  qesd4: ["AVIONICS MASTER switch ---------- OFF"],
  qesd5: ["RAM AIR FLOW switch ---------- OFF"],
  qesd6: ["AIR COND switch ---------- OFF"],
  qesd7: ["EVAP BLWR control ---------- OFF"],
  qesd8: ["Oxyg\u200Ben mask ---------- REMOVE"],
  qesd9: ["supply", "pressure", 'concentration'],
  qesd10: ["PCL ---------- IDLE >60 SECONDS, THEN OFF", "ITT", "N1", "Fuel Flow"],
  qesd11: ["CANOPY ---------- OPEN (AS REQUIRED)"],
  qesd12: ["EICAS"],
  qesd13: ["FD\u200BR light ---------- EXTINGUISHED"],
  qesd14: ["Gust lock ---------- ENGAGE (AS REQUIRED)"],
  qesd15: ["landing/", "taxi light", "anti-coll light", "nav light", 'floodLight', 'sideLight', 'instLight'],
  qesd16: ['BAT\u200B, ', 'GEN, ', 'AND AUX BAT SWITCHES - OFF'],

  // BEFORE LEAVING AIRCRAFT
  qbla1: ["CFS handle safety pins ---------- INSTALL"],
  qbla2: ["DTS/DVR cartridge ---------- REMOVE (AS REQUIRED)"],
  qbla3: ["ISS mode selector ---------- SOLO"],
  qbla4: ["Oxyg\u200Ben hose and communication cord ---------- STOW WITH LOOP FORWARD"],
  qbla5: ["HUD combiner cover ---------- INSTALL"],
  qbla6: ["Wheel chocks ---------- INSTALL (AS REQUIRED)"],
  qbla7: ["PARKING BRAKE ---------- AS REQUIRED"],
  qbla8: ["Canopy ---------- CLOSED (AS REQUIRED)"],
  qbla9: ["Exterior walk-around inspection ---------- VISUALLY CHECK"]
};

export const QUAD_LENGTHS = [37, 8, 9, 5, 37, 2, 7, 11, 5, 2, 4, 6, 3, 5, 6, 13, 9, 16, 9];