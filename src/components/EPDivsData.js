import React from 'react';

/**
 * Array of individual Emergency Procedure divs
 * Each item is a function that takes props and returns a complete EP section
 *
 * Usage:
 * const epDivs = getEPDivs(props);
 * const singleEP = epDivs[4]; // Get a specific EP
 */

// Define styles for EP divs
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

export const getEPDivs = ({ epsData, handleEPsChange, getInputClass }) => {

  return [
    // 0. ABORT START PROCEDURE
    (
      <div key="as" style={epSectionStyle}>
        <div style={epHeaderStyle}>ABORT START PROCEDURE</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}> 1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('as1')} value={epsData.as1 || ''} onChange={(e) => handleEPsChange('as1', e.target.value)} />
        </div>
      </div>
    ),

    // 1. EMERGENCY ENGINE SHUTDOWN ON THE GROUND
    (
      <div key="eesg" style={epSectionStyle}>
        <div style={epHeaderStyle}>EMERGENCY ENGINE SHUTDOWN ON THE GROUND</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('eesg1')} value={epsData.eesg1 || ''} onChange={(e) => handleEPsChange('eesg1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('eesg2')} value={epsData.eesg2 || ''} onChange={(e) => handleEPsChange('eesg2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('eesg3')} value={epsData.eesg3 || ''} onChange={(e) => handleEPsChange('eesg3', e.target.value)} />
        </div>
      </div>
    ),

    // 2. EMERGENCY GROUND EGRESS
    (
      <div key="ege" style={epSectionStyle}>
        <div style={epHeaderStyle}>EMERGENCY GROUND EGRESS</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege1')} value={epsData.ege1 || ''} onChange={(e) => handleEPsChange('ege1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege2')} value={epsData.ege2 || ''} onChange={(e) => handleEPsChange('ege2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege3')} value={epsData.ege3 || ''} onChange={(e) => handleEPsChange('ege3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege4')} value={epsData.ege4 || ''} onChange={(e) => handleEPsChange('ege4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF CANOPY CANNOT BE OPENED OR SITUATION REQUIRES RIGHT SIDE EGRESS:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege5')} value={epsData.ege5 || ''} onChange={(e) => handleEPsChange('ege5', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>6.</span>
          <input type="text" style={{...epInputStyle, fontSize: '8px'}} className={getInputClass('ege6')} value={epsData.ege6 || ''} onChange={(e) => handleEPsChange('ege6', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>7.</span>
          <input type="text" style={{...epInputStyle, fontSize: '7px'}} className={getInputClass('ege7')} value={epsData.ege7 || ''} onChange={(e) => handleEPsChange('ege7', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>8.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege8')} value={epsData.ege8 || ''} onChange={(e) => handleEPsChange('ege8', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>9.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ege9')} value={epsData.ege9 || ''} onChange={(e) => handleEPsChange('ege9', e.target.value)} />
        </div>
      </div>
    ),

    // 3. ABORT
    (
      <div key="abort" style={epSectionStyle}>
        <div style={epHeaderStyle}>ABORT</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('abort1')} value={epsData.abort1 || ''} onChange={(e) => handleEPsChange('abort1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('abort2')} value={epsData.abort2 || ''} onChange={(e) => handleEPsChange('abort2', e.target.value)} />
        </div>
      </div>
    ),

    // 4. ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF
    (
      <div key="efiat" style={epSectionStyle}>
        <div style={epHeaderStyle}>ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF (SUFFICIENT RUNWAY REMAINING STRAIGHT AHEAD)</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efiat1')} value={epsData.efiat1 || ''} onChange={(e) => handleEPsChange('efiat1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efiat2')} value={epsData.efiat2 || ''} onChange={(e) => handleEPsChange('efiat2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efiat3')} value={epsData.efiat3 || ''} onChange={(e) => handleEPsChange('efiat3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efiat4')} value={epsData.efiat4 || ''} onChange={(e) => handleEPsChange('efiat4', e.target.value)} />
        </div>
      </div>
    ),

    // 5. ENGINE FAILURE DURING FLIGHT
    (
      <div key="efdf" style={epSectionStyle}>
        <div style={epHeaderStyle}>ENGINE FAILURE DURING FLIGHT</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf1')} value={epsData.efdf1 || ''} onChange={(e) => handleEPsChange('efdf1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf2')} value={epsData.efdf2 || ''} onChange={(e) => handleEPsChange('efdf2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf3')} value={epsData.efdf3 || ''} onChange={(e) => handleEPsChange('efdf3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf4')} value={epsData.efdf4 || ''} onChange={(e) => handleEPsChange('efdf4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF CONDITIONS DO NOT WARRANT AN AIRSTART:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf5')} value={epsData.efdf5 || ''} onChange={(e) => handleEPsChange('efdf5', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>6.</span>
          <input type="text" style={epInputStyle} className={getInputClass('efdf6')} value={epsData.efdf6 || ''} onChange={(e) => handleEPsChange('efdf6', e.target.value)} />
        </div>
      </div>
    ),

    // 6. IMMEDIATE AIRSTART
    (
      <div key="ia" style={epSectionStyle}>
        <div style={epHeaderStyle}>IMMEDIATE AIRSTART (PMU NORM)</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia1')} value={epsData.ia1 || ''} onChange={(e) => handleEPsChange('ia1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia2')} value={epsData.ia2 || ''} onChange={(e) => handleEPsChange('ia2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia3')} value={epsData.ia3 || ''} onChange={(e) => handleEPsChange('ia3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={{...epInputStyle, fontSize: '10px'}} className={getInputClass('ia4')} value={epsData.ia4 || ''} onChange={(e) => handleEPsChange('ia4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF AIRSTART IS UNSUCCESSFUL:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia5')} value={epsData.ia5 || ''} onChange={(e) => handleEPsChange('ia5', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>6.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia6')} value={epsData.ia6 || ''} onChange={(e) => handleEPsChange('ia6', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>7.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia7')} value={epsData.ia7 || ''} onChange={(e) => handleEPsChange('ia7', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF AIRSTART IS SUCCESSFUL:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>8.</span>
          <input type="text" style={{...epInputStyle, fontSize: '8px'}} className={getInputClass('ia8')} value={epsData.ia8 || ''} onChange={(e) => handleEPsChange('ia8', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>9.</span>
          <input type="text" style={epInputStyle} className={getInputClass('ia9')} value={epsData.ia9 || ''} onChange={(e) => handleEPsChange('ia9', e.target.value)} />
        </div>
      </div>
    ),

    // 7. UNCOMMANDED POWER CHANGES
    (
      <div key="upc" style={epSectionStyle}>
        <div style={epHeaderStyle}>UNCOMMANDED POWER CHANGES / LOSS OF POWER/ UNCOMMANDED PROPELLER FEATHER</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc1')} value={epsData.upc1 || ''} onChange={(e) => handleEPsChange('upc1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc2')} value={epsData.upc2 || ''} onChange={(e) => handleEPsChange('upc2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={{...epInputStyle, fontSize: '7px'}} className={getInputClass('upc3')} value={epsData.upc3 || ''} onChange={(e) => handleEPsChange('upc3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc4')} value={epsData.upc4 || ''} onChange={(e) => handleEPsChange('upc4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc5')} value={epsData.upc5 || ''} onChange={(e) => handleEPsChange('upc5', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF POWER IS INSUFFICIENT TO COMPLETE PEL:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>6.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc6')} value={epsData.upc6 || ''} onChange={(e) => handleEPsChange('upc6', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>7.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc7')} value={epsData.upc7 || ''} onChange={(e) => handleEPsChange('upc7', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>8.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc8')} value={epsData.upc8 || ''} onChange={(e) => handleEPsChange('upc8', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>9.</span>
          <input type="text" style={epInputStyle} className={getInputClass('upc9')} value={epsData.upc9 || ''} onChange={(e) => handleEPsChange('upc9', e.target.value)} />
        </div>
      </div>
    ),

    // 8. COMPRESSOR STALLS
    (
      <div key="cs" style={epSectionStyle}>
        <div style={epHeaderStyle}>COMPRESSOR STALLS</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs1')} value={epsData.cs1 || ''} onChange={(e) => handleEPsChange('cs1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs2')} value={epsData.cs2 || ''} onChange={(e) => handleEPsChange('cs2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs3')} value={epsData.cs3 || ''} onChange={(e) => handleEPsChange('cs3', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs4')} value={epsData.cs4 || ''} onChange={(e) => handleEPsChange('cs4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF POWER IS INSUFFICIENT TO COMPLETE PEL:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs5')} value={epsData.cs5 || ''} onChange={(e) => handleEPsChange('cs5', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>6.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs6')} value={epsData.cs6 || ''} onChange={(e) => handleEPsChange('cs6', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>7.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cs7')} value={epsData.cs7 || ''} onChange={(e) => handleEPsChange('cs7', e.target.value)} />
        </div>
      </div>
    ),

    // 9. INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT
    (
      <div key="idcf" style={epSectionStyle}>
        <div style={{...epHeaderStyle, fontSize: '11px'}}>INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('idcf1')} value={epsData.idcf1 || ''} onChange={(e) => handleEPsChange('idcf1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('idcf2')} value={epsData.idcf2 || ''} onChange={(e) => handleEPsChange('idcf2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('idcf3')} value={epsData.idcf3 || ''} onChange={(e) => handleEPsChange('idcf3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('idcf4')} value={epsData.idcf4 || ''} onChange={(e) => handleEPsChange('idcf4', e.target.value)} />
        </div>
      </div>
    ),

    // 10. FIRE IN FLIGHT
    (
      <div key="fif" style={epSectionStyle}>
        <div style={epHeaderStyle}>FIRE IN FLIGHT</div>
        <div style={decisionPointStyle}>IF FIRE IS CONFIRMED:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fif1')} value={epsData.fif1 || ''} onChange={(e) => handleEPsChange('fif1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fif2')} value={epsData.fif2 || ''} onChange={(e) => handleEPsChange('fif2', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF FIRE IS EXTINGUISHED:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fif3')} value={epsData.fif3 || ''} onChange={(e) => handleEPsChange('fif3', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF FIRE DOES NOT EXTINGUISH OR FORCED LANDING IS IMPRACTICAL:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fif4')} value={epsData.fif4 || ''} onChange={(e) => handleEPsChange('fif4', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF FIRE IS NOT CONFIRMED:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>5.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fif5')} value={epsData.fif5 || ''} onChange={(e) => handleEPsChange('fif5', e.target.value)} />
        </div>
      </div>
    ),

    // 11. SMOKE AND FUME ELIMINATION/ELECTRICAL FIRE
    (
      <div key="sfe" style={epSectionStyle}>
        <div style={epHeaderStyle}>SMOKE AND FUME ELIMINATION/ELECTRICAL FIRE</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('sfe1')} value={epsData.sfe1 || ''} onChange={(e) => handleEPsChange('sfe1', e.target.value)} />
        </div>
        <div style={subStepStyle}>
          <span style={{minWidth: '20px'}}>a.</span>
          <input type="text" style={epInputStyle} className={getInputClass('sfe1a')} value={epsData.sfe1a || ''} onChange={(e) => handleEPsChange('sfe1a', e.target.value)} />
        </div>
        <div style={subStepStyle}>
          <span style={{minWidth: '20px'}}>b.</span>
          <input type="text" style={epInputStyle} className={getInputClass('sfe1b')} value={epsData.sfe1b || ''} onChange={(e) => handleEPsChange('sfe1b', e.target.value)} />
        </div>
        <div style={subStepStyle}>
          <span style={{minWidth: '20px'}}>c.</span>
          <input type="text" style={epInputStyle} className={getInputClass('sfe1c')} value={epsData.sfe1c || ''} onChange={(e) => handleEPsChange('sfe1c', e.target.value)} />
        </div>
      </div>
    ),

    // 12. CHIP DETECTOR WARNING
    (
      <div key="cdw" style={epSectionStyle}>
        <div style={epHeaderStyle}>CHIP DETECTOR WARNING</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={{...epInputStyle, fontSize: '7px'}} className={getInputClass('cdw1')} value={epsData.cdw1 || ''} onChange={(e) => handleEPsChange('cdw1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('cdw2')} value={epsData.cdw2 || ''} onChange={(e) => handleEPsChange('cdw2', e.target.value)} />
        </div>
      </div>
    ),

    // 13. OIL SYSTEM MALFUNCTION OR LOW OIL PRESSURE
    (
      <div key="osm" style={epSectionStyle}>
        <div style={epHeaderStyle}>OIL SYSTEM MALFUNCTION OR LOW OIL PRESSURE</div>
        <div style={decisionPointStyle}>IF ONLY AMBER OIL PX caution ILLUMINATES:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('osm1')} value={epsData.osm1 || ''} onChange={(e) => handleEPsChange('osm1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={{...epInputStyle, fontSize: '8px'}} className={getInputClass('osm2')} value={epsData.osm2 || ''} onChange={(e) => handleEPsChange('osm2', e.target.value)} />
        </div>
        <div style={decisionPointStyle}>IF RED OIL PX WARNING ILLUMINATES AND/OR AMBER OIL PX CAUTION REMAINS ILLUMINATED FOR 5 SECONDS:</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={{...epInputStyle, fontSize: '7px'}} className={getInputClass('osm3')} value={epsData.osm3 || ''} onChange={(e) => handleEPsChange('osm3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('osm4')} value={epsData.osm4 || ''} onChange={(e) => handleEPsChange('osm4', e.target.value)} />
        </div>
      </div>
    ),

    // 14. LOW FUEL PRESSURE
    (
      <div key="lfp" style={epSectionStyle}>
        <div style={epHeaderStyle}>LOW FUEL PRESSURE</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('lfp1')} value={epsData.lfp1 || ''} onChange={(e) => handleEPsChange('lfp1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('lfp2')} value={epsData.lfp2 || ''} onChange={(e) => handleEPsChange('lfp2', e.target.value)} />
        </div>
      </div>
    ),

    // 15. HIGH FUEL FLOW
    (
      <div key="hff" style={epSectionStyle}>
        <div style={epHeaderStyle}>HIGH FUEL FLOW</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('hff1')} value={epsData.hff1 || ''} onChange={(e) => handleEPsChange('hff1', e.target.value)} />
        </div>
      </div>
    ),

    // 16. OBOGS FAILURE/OVERTEMP/PHYSIOLOGICAL SYMPTOMS
    (
      <div key="obogs" style={epSectionStyle}>
        <div style={{...epHeaderStyle, fontSize: '11px'}}>OBOGS FAILURE/OVERTEMP/PHYSIOLOGICAL SYMPTOMS</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('obogs1')} value={epsData.obogs1 || ''} onChange={(e) => handleEPsChange('obogs1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('obogs2')} value={epsData.obogs2 || ''} onChange={(e) => handleEPsChange('obogs2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('obogs3')} value={epsData.obogs3 || ''} onChange={(e) => handleEPsChange('obogs3', e.target.value)} />
        </div>
      </div>
    ),

    // 17. EJECT
    (
      <div key="eject" style={epSectionStyle}>
        <div style={epHeaderStyle}>EJECT</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('eject1')} value={epsData.eject1 || ''} onChange={(e) => handleEPsChange('eject1', e.target.value)} />
        </div>
      </div>
    ),

    // 18. FORCED LANDING
    (
      <div key="fl" style={epSectionStyle}>
        <div style={epHeaderStyle}>FORCED LANDING</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={{...epInputStyle, fontSize: '10px'}} className={getInputClass('fl1')} value={epsData.fl1 || ''} onChange={(e) => handleEPsChange('fl1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fl2')} value={epsData.fl2 || ''} onChange={(e) => handleEPsChange('fl2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={{...epInputStyle, fontSize: '7px'}} className={getInputClass('fl3')} value={epsData.fl3 || ''} onChange={(e) => handleEPsChange('fl3', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>4.</span>
          <input type="text" style={epInputStyle} className={getInputClass('fl4')} value={epsData.fl4 || ''} onChange={(e) => handleEPsChange('fl4', e.target.value)} />
        </div>
      </div>
    ),

    // 19. PRECAUTIONARY EMERGENCY LANDING (PEL)
    (
      <div key="pel" style={epSectionStyle}>
        <div style={epHeaderStyle}>PRECAUTIONARY EMERGENCY LANDING (PEL)</div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>1.</span>
          <input type="text" style={epInputStyle} className={getInputClass('pel1')} value={epsData.pel1 || ''} onChange={(e) => handleEPsChange('pel1', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>2.</span>
          <input type="text" style={epInputStyle} className={getInputClass('pel2')} value={epsData.pel2 || ''} onChange={(e) => handleEPsChange('pel2', e.target.value)} />
        </div>
        <div style={epStepStyle}>
          <span style={{minWidth: '20px'}}>3.</span>
          <input type="text" style={epInputStyle} className={getInputClass('pel3')} value={epsData.pel3 || ''} onChange={(e) => handleEPsChange('pel3', e.target.value)} />
        </div>
      </div>
    )
  ];
};

// T-6B Emergency Procedures Answer Keys
export const EP_ANSWERS = {
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
  upc3: ['PROP SYS CIRCUIT BREAKER (Left Front Console) - PULL, ', 'IF N\u200Bp STABLE BELOW 40%'],
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

export const EP_LENGTHS = [1, 3, 9, 2, 4, 6, 9, 9, 7, 4, 5, 4, 2, 4, 2, 1, 3, 1, 4, 3];