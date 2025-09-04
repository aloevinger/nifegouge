import React, { useState, useEffect } from 'react';

function WhizWheel() {
  const [questionType, setQuestionType] = useState('Distance');
  const [questionData, setQuestionData] = useState({
    Distance: { value: '', unit: 'nm' },
    Speed: { value: '', unit: 'kts' },
    Time: { value: '', unit: 'mins' }
  });
  const [explanationText, setExplanationText] = useState('');
  const [wheelRotation, setWheelRotation] = useState({ inner: 0, outer: 0 });

  const randBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const clearInputFields = () => {
    setQuestionData({
      Distance: { value: '', unit: 'nm' },
      Speed: { value: '', unit: 'kts' },
      Time: { value: '', unit: 'mins' }
    });
    setExplanationText('');
  };

  const generateDST = (selectedType) => {
    clearInputFields();
    const rand = Math.random();
    
    let speed = randBetween(22, 130) * 5;
    let dist = 0;

    if (rand < 0.2) {
      dist = randBetween(2, 10) / 2;
    } else if (rand < 0.4) {
      dist = randBetween(2, 19) * 5;
    } else if (rand < 0.9) {
      dist = randBetween(22, 199) * 5;
    } else {
      dist = randBetween(20, 49) * 50;
    }

    let time = dist / speed;
    let units = "";

    if (time > 1.66) {
      time = Number(time.toFixed(1));
      units = "hrs";
    } else if (time > 0.027) {
      time = time * 60;
      time = Number(time.toFixed(1));
      units = "mins";
    } else {
      time = time * 3600;
      time = Number(time.toFixed(1));
      units = "secs";
    }

    const newData = {
      Distance: { value: dist, unit: 'nm' },
      Speed: { value: speed, unit: 'kts' },
      Time: { value: time, unit: units }
    };

    // Clear the answer field
    if (selectedType === 'Distance') {
      newData.Distance.value = '';
    } else if (selectedType === 'Speed') {
      newData.Speed.value = '';
    } else if (selectedType === 'Time') {
      newData.Time.value = '';
    }

    setQuestionData(newData);
  };

  const generate = () => {
    switch (questionType) {
      case 'Distance':
      case 'Speed':
      case 'Time':
        generateDST(questionType);
        break;
      // Add other cases here
      default:
        alert("Question type not implemented yet");
    }
  };

  const solveDST = () => {
    const dist = parseFloat(questionData.Distance.value) || 0;
    const speed = parseFloat(questionData.Speed.value) || 0;
    const time = parseFloat(questionData.Time.value) || 0;
    const timeUnit = questionData.Time.unit;
    
    let result = '';
    let explanation = '';

    if (!questionData.Distance.value && speed && time) {
      // Solve for distance
      let timeInHours = time;
      if (timeUnit === 'mins') {
        timeInHours = time / 60;
        explanation = "Mins so use the standard scale 60 under speed";
      } else if (timeUnit === 'secs') {
        timeInHours = time / 3600;
        explanation = "Secs so use the high speed scale 36 under speed";
      } else {
        explanation = "Hrs so use the 10 under speed";
      }
      
      const distance = speed * timeInHours;
      setQuestionData(prev => ({
        ...prev,
        Distance: { ...prev.Distance, value: distance.toFixed(1) }
      }));
      result = `Distance: ${distance.toFixed(1)} nm`;
    }
    // Add other solve cases here

    setExplanationText(explanation);
    return result;
  };

  const solve = () => {
    switch (questionType) {
      case 'Distance':
      case 'Speed':
      case 'Time':
        solveDST();
        break;
      default:
        alert("Solve not implemented for this type");
    }
  };

  const checkWork = () => {
    // Implement check work functionality
    console.log("Check work not yet implemented");
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="whiz-container">
      <h1>Navigation Problem Generator</h1>
      
      <div className="whiz-layout">
        <div className="form-section">
          <table>
            <thead>
              <tr>
                <th>Question Type</th>
                <th>Variable</th>
                <th>Value</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input 
                    type="radio" 
                    name="questionType" 
                    value="Distance" 
                    checked={questionType === 'Distance'}
                    onChange={(e) => setQuestionType(e.target.value)}
                  /> Distance
                </td>
                <td>Distance</td>
                <td>
                  <input 
                    type="text"
                    value={questionData.Distance.value}
                    onChange={(e) => setQuestionData(prev => ({
                      ...prev,
                      Distance: { ...prev.Distance, value: e.target.value }
                    }))}
                  />
                </td>
                <td>{questionData.Distance.unit}</td>
              </tr>
              <tr>
                <td>
                  <input 
                    type="radio" 
                    name="questionType" 
                    value="Speed"
                    checked={questionType === 'Speed'}
                    onChange={(e) => setQuestionType(e.target.value)}
                  /> Speed
                </td>
                <td>Speed</td>
                <td>
                  <input 
                    type="text"
                    value={questionData.Speed.value}
                    onChange={(e) => setQuestionData(prev => ({
                      ...prev,
                      Speed: { ...prev.Speed, value: e.target.value }
                    }))}
                  />
                </td>
                <td>{questionData.Speed.unit}</td>
              </tr>
              <tr>
                <td>
                  <input 
                    type="radio" 
                    name="questionType" 
                    value="Time"
                    checked={questionType === 'Time'}
                    onChange={(e) => setQuestionType(e.target.value)}
                  /> Time
                </td>
                <td>Time</td>
                <td>
                  <input 
                    type="text"
                    value={questionData.Time.value}
                    onChange={(e) => setQuestionData(prev => ({
                      ...prev,
                      Time: { ...prev.Time, value: e.target.value }
                    }))}
                  />
                </td>
                <td>
                  {questionType === 'Time' ? (
                    <select 
                      value={questionData.Time.unit}
                      onChange={(e) => setQuestionData(prev => ({
                        ...prev,
                        Time: { ...prev.Time, unit: e.target.value }
                      }))}
                    >
                      <option value="hrs">hrs</option>
                      <option value="mins">mins</option>
                      <option value="secs">secs</option>
                    </select>
                  ) : (
                    questionData.Time.unit
                  )}
                </td>
              </tr>
              {explanationText && (
                <tr className="explanation-row">
                  <td></td>
                  <td colSpan="3" className="explanation-cell">{explanationText}</td>
                </tr>
              )}
              {/* Add more question types here */}
            </tbody>
          </table>

          <div className="buttons">
            <button onClick={generate}>Generate</button>
            <button onClick={checkWork}>Check</button>
            <button onClick={solve}>Solve</button>
          </div>
        </div>

        <div className="Wheel-Container" id="wheel-container">
          {/* Wheel visualization will go here */}
        </div>
      </div>
    </div>
  );
}

export default WhizWheel;