import React, { useState, useEffect } from 'react';

function Weather() {
  const [depPressure, setDepPressure] = useState('');
  const [assignedAlt, setAssignedAlt] = useState('');
  const [arrivalElev, setArrivalElev] = useState('');
  const [arrivalPressure, setArrivalPressure] = useState('');
  const [situation, setSituation] = useState('');
  
  // User inputs
  const [errorInput, setErrorInput] = useState('');
  const [trueAltInput, setTrueAltInput] = useState('');
  const [absAltInput, setAbsAltInput] = useState('');
  const [indAltInput, setIndAltInput] = useState('');
  
  // Validation states
  const [errorClass, setErrorClass] = useState('');
  const [trueAltClass, setTrueAltClass] = useState('');
  const [absAltClass, setAbsAltClass] = useState('');
  const [indAltClass, setIndAltClass] = useState('');

  const generate = () => {
    // Clear previous inputs and validation
    setErrorInput('');
    setTrueAltInput('');
    setAbsAltInput('');
    setIndAltInput('');
    setErrorClass('');
    setTrueAltClass('');
    setAbsAltClass('');
    setIndAltClass('');
    setSituation('');
    
    // Generate random values
    const depPres = (Math.random() * 2.16 + 28.84).toFixed(2);
    const assAlt = Math.floor(Math.random() * 70) * 100 + 3000;
    const fieldEle = Math.floor(Math.random() * 20) * 100 + 100;
    const arrPres = (Math.random() * 2.16 + 28.84).toFixed(2);
    
    setDepPressure(depPres);
    setAssignedAlt(assAlt);
    setArrivalElev(fieldEle);
    setArrivalPressure(arrPres);
  };

  const solve = () => {
    // Clear validation classes
    setErrorClass('');
    setTrueAltClass('');
    setAbsAltClass('');
    setIndAltClass('');
    
    const depPres = parseFloat(depPressure);
    const assAlt = parseFloat(assignedAlt);
    const fieldEle = parseFloat(arrivalElev);
    const arrPres = parseFloat(arrivalPressure);
    
    // Calculate situation
    const situationText = arrPres <= depPres ? "H → L" : "L → H";
    setSituation(situationText);
    
    // Calculate values
    const error = Math.abs((depPres - arrPres) * 1000);
    const trueAlt = (arrPres - (depPres - assAlt / 1000)) * 1000;
    const absolute = trueAlt - fieldEle;
    const indiAlt = (depPres - (arrPres - fieldEle / 1000)) * 1000;
    
    // Set the calculated values
    setErrorInput(Math.round(error).toString());
    setTrueAltInput(Math.round(trueAlt).toString());
    setAbsAltInput(Math.round(absolute).toString());
    setIndAltInput(Math.round(indiAlt).toString());
  };

  const checkWork = () => {
    const depPres = parseFloat(depPressure);
    const assAlt = parseFloat(assignedAlt);
    const fieldEle = parseFloat(arrivalElev);
    const arrPres = parseFloat(arrivalPressure);
    
    // Calculate correct values
    const error = Math.abs((depPres - arrPres) * 1000);
    const trueAlt = (arrPres - (depPres - assAlt / 1000)) * 1000;
    const absolute = trueAlt - fieldEle;
    const indiAlt = (depPres - (arrPres - fieldEle / 1000)) * 1000;
    
    const correctAnswers = [error, trueAlt, absolute, indiAlt];
    const userAnswers = [
      parseFloat(errorInput) || 0,
      parseFloat(trueAltInput) || 0,
      parseFloat(absAltInput) || 0,
      parseFloat(indAltInput) || 0
    ];
    const setClasses = [setErrorClass, setTrueAltClass, setAbsAltClass, setIndAltClass];
    
    for (let i = 0; i < 4; i++) {
      const pError = Math.abs(100 * (userAnswers[i] - correctAnswers[i]) / correctAnswers[i]);
      if (pError < 2) {
        setClasses[i]('bg-green');
      } else if (pError < 5) {
        setClasses[i]('bg-yellow');
      } else {
        setClasses[i]('bg-red');
      }
    }
  };

  // Generate initial problem on mount
  useEffect(() => {
    generate();
  }, []);

  return (
    <>      
      <div className="setai-container">
        <h1>SETAI Problem Generator</h1>
        
        <table className="setai-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Departure Pressure</td>
              <td style={{ textAlign: 'center' }}>{depPressure}</td>
              <td>inHg</td>
            </tr>
            <tr>
              <td>Assigned Altitude</td>
              <td style={{ textAlign: 'center' }}>{assignedAlt}</td>
              <td>ft</td>
            </tr>
            <tr>
              <td>Arrival Field Elevation</td>
              <td style={{ textAlign: 'center' }}>{arrivalElev}</td>
              <td>ft</td>
            </tr>
            <tr>
              <td>Arrival Pressure</td>
              <td style={{ textAlign: 'center' }}>{arrivalPressure}</td>
              <td>inHg</td>
            </tr>
            <tr>
              <td><b>S</b>ituation</td>
              <td style={{ textAlign: 'center' }}>{situation}</td>
              <td>-</td>
            </tr>
            <tr>
              <td><b>E</b>rror</td>
              <td>
                <input
                  type="text"
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  className={errorClass}
                />
              </td>
              <td>ft</td>
            </tr>
            <tr>
              <td><b>T</b>rue Altitude</td>
              <td>
                <input
                  type="text"
                  value={trueAltInput}
                  onChange={(e) => setTrueAltInput(e.target.value)}
                  className={trueAltClass}
                />
              </td>
              <td>ft</td>
            </tr>
            <tr>
              <td><b>A</b>bsolute Altitude</td>
              <td>
                <input
                  type="text"
                  value={absAltInput}
                  onChange={(e) => setAbsAltInput(e.target.value)}
                  className={absAltClass}
                />
              </td>
              <td>ft</td>
            </tr>
            <tr>
              <td><b>I</b>ndicated Altitude</td>
              <td>
                <input
                  type="text"
                  value={indAltInput}
                  onChange={(e) => setIndAltInput(e.target.value)}
                  className={indAltClass}
                />
              </td>
              <td>ft</td>
            </tr>
          </tbody>
        </table>
        
        <div className="button-row">
          <button onClick={generate}>Generate</button>
          <button onClick={checkWork}>Check</button>
          <button onClick={solve}>Solve</button>
        </div>
      </div>
    </>
  );
}

export default Weather;