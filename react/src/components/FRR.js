import React, { useState, useEffect, useCallback } from 'react';

function FRR() {
  const [questionType, setQuestionType] = useState('vfr');
  const [complexMode, setComplexMode] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [answerChoices, setAnswerChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showArrow, setShowArrow] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [showCompassImg, setShowCompassImg] = useState(false);
  const [altitudeLines, setAltitudeLines] = useState([]);
  const [indicatorRotation, setIndicatorRotation] = useState(0);
  const [compassRotation, setCompassRotation] = useState(0);
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Game state variables for runway calculations
  const [directionG, setDirectionG] = useState(null);
  const [toG, setToG] = useState(null);
  const [relativeG, setRelativeG] = useState(null);
  const [randPosiG, setRandPosiG] = useState(0);
  const [randPosi2G, setRandPosi2G] = useState(null);
  const [indicatorG, setIndicatorG] = useState(null);
  const [flagDirectionG, setFlagDirectionG] = useState(null);

  // Utility function
  const randBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate VFR question
  const generateVfr = useCallback(() => {
    setAnswerText('');
    setAltitudeLines([]);
    let vis = randBetween(2, 8);
    let rand = Math.random();
    let airClass = rand < 0.1 ? "A" : "E";

    let clouds = ["FEW", "SCT", "FEW", "SCT", "BKN", "OVC"];
    let layers = randBetween(2, 3);
    let cloudLayers = [];
    let altitude = randBetween(30, 70) * 100;
    
    for (let i = 0; i < layers; i++) {
      let cloud = randBetween(2, 5);
      if (i === 0) cloud = randBetween(0, 3);
      let cloudLayer = clouds[cloud] + " at " + altitude.toLocaleString();
      cloudLayers.push(cloudLayer);
      altitude += randBetween(10, 50) * 100;
    }
    
    let ceils = ["BKN", "OVC"];
    let ceil = randBetween(0, 1);
    let ceilLayer = ceils[ceil] + " at " + altitude.toLocaleString();
    cloudLayers.push(ceilLayer);

    let heading = 0;
    let course = 0;
    let headRand = Math.random();
    
    if (headRand < 0.3) {
      heading = randBetween(177, 183);
      course = heading + randBetween(1, 6) * Math.sign(180.01 - heading);
    } else if (headRand < 0.6) {
      heading = randBetween(357, 363);
      course = heading + randBetween(1, 6) * Math.sign(360.01 - heading);
    } else {
      heading = randBetween(0, 360);
      course = heading + randBetween(-6, 6);
    }
    
    heading = heading % 360;
    course = course % 360;
    if (course < 0) course += 360;

    let ceilingAltitude = 1000000;
    for (let line of cloudLayers) {
      if ((line.includes("BKN") || line.includes("OVC"))) {
        const altMatch = line.match(/(\d{1,3}(?:,\d{3})*)/);
        if (altMatch) {
          altitude = parseInt(altMatch[0].replace(/,/g, ""), 10);
          if (altitude < ceilingAltitude) {
            ceilingAltitude = altitude;
          }
        }
      }
    }
    
    if (ceilingAltitude > 10400 && vis < 5) vis = 5;

    let output = `Class ${airClass} Airspace\n`;
    output += `Visibility: ${vis} SM\n`;
    cloudLayers.forEach(layer => output += `${layer}'\n`);
    output += `Mag Heading: ${heading}°\n`;
    output += `Mag Course: ${course}°`;

    setQuestionText(output);
  }, []);

  // Generate Runway question
  const generateRunway = useCallback(() => {
    setAnswerText('');
    setSelectedAnswer('');
    setUserAnswer('');
    setSubmitButtonText('Submit');
    setIsAnswered(false);
    // Clear visualizations
    setShowArrow(false);
    setShowIndicator(false);
    setShowCompassImg(false);
    
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const direction = randBetween(0, 7);
    const dirRand = Math.random();
    let to = true;
    if (dirRand > 0.5) to = false;
    
    const relRand = Math.random();
    let relative = true;
    if (relRand > 0.75) relative = false;
    
    let relPositions = ["towards", "to the left of", "away from", "to the right of"];
    const randPosi = randBetween(0, 3);
    let relPosition = relPositions[randPosi];
    let randPosi2 = null;
    
    if (complexMode) {
      if (Math.random() < 0.6) {
        randPosi2 = randBetween(0, 1) * 2 + (randPosi + 1) % 2;
        relPosition = relPosition + " and " + relPositions[randPosi2];
      }
    }
    
    let aircraftPosi = "";
    if (to) {
      aircraftPosi = "Your aircraft is approaching the airfield heading towards the " + directions[direction] + ".";
    } else {
      aircraftPosi = "Your aircraft is approaching the airfield from the " + directions[direction] + ".";
    }
    
    let flagPosi = "";
    let indicators = ["spar of the tetrahedron", "wind sock"];
    let indicator = randBetween(0, 1);
    let flagDirection = null;
    
    if (relative) {
      flagPosi = " The " + indicators[indicator] + " is pointing, relative to your heading, " + relPosition + " you.";
    } else {
      flagDirection = randBetween(0, 7);
      if (!complexMode) flagDirection = randBetween(0, 3) * 2 + direction % 2;
      flagPosi = " The " + indicators[indicator] + " is pointing to the " + directions[flagDirection] + ".";
    }
    
    let fullQ = aircraftPosi + flagPosi + " Which runway will you expect to use?";
    setQuestionText(fullQ);
    
    // Store state for solving
    setDirectionG(direction);
    setToG(to);
    setRelativeG(relative);
    setRandPosiG(randPosi);
    setRandPosi2G(randPosi2);
    setIndicatorG(indicator);
    setFlagDirectionG(flagDirection);
    
    // Set answer options based on complexity and direction
    let options;
    if (!complexMode && direction % 2 === 0) {
      options = ["Runway 18", "Runway 27", "Runway 36", "Runway 09"];
    } else if (!complexMode) {
      options = ["Runway 23", "Runway 32", "Runway 05", "Runway 14"];
    } else {
      options = ["Runway 18", "Runway 23", "Runway 27", "Runway 32", "Runway 36", "Runway 05", "Runway 09", "Runway 14"];
    }
    setAnswerChoices(options);
  }, [complexMode]);

  // Generate function
  const generate = useCallback(() => {
    if (questionType === 'vfr') {
      generateVfr();
      setAnswerChoices([]);
    } else {
      generateRunway();
    }
  }, [questionType, generateVfr, generateRunway]);

  // Solve VFR with visualization
  // In the solveVfr function, we need to ensure we have a valid ceiling altitude
const solveVfr = () => {
  const lines = questionText.split('\n').map(line => line.trim());
  setAltitudeLines([]);
  
  let airClass = "";
  let visibility = null;
  let ceilingAltitude = 1000000;
  let course = null;

  for (let line of lines) {
    if (line.startsWith("Class")) {
      airClass = line.split("Class")[1].trim();
      if (airClass === "A Airspace") {
        setAnswerText("VFR flight not allowed (Class A)");
        return;
      }
    }

    if (line.startsWith("Visibility:")) {
      const visMatch = line.match(/\d+/);
      if (visMatch) {
        visibility = parseInt(visMatch[0]);
        if (visibility < 3) {
          setAnswerText("VFR flight not allowed (Visibility < 3)");
          return;
        }
      }
    }

    if ((line.includes("BKN") || line.includes("OVC"))) {
      const altMatch = line.match(/(\d{1,3}(?:,\d{3})*)/);
      if (altMatch) {
        let altitude = parseInt(altMatch[0].replace(/,/g, ""), 10);
        if (altitude < ceilingAltitude) {
          ceilingAltitude = altitude;
        }
      }
    }

    if (line.startsWith("Mag Course:")) {
      const courseMatch = line.match(/\d+/);
      if (courseMatch) {
        course = parseInt(courseMatch[0]);
      }
    }
  }

  // Check if we found a valid ceiling
  if (ceilingAltitude === 1000000) {
    setAnswerText("Unable to determine ceiling altitude");
    return;
  }

  // Create altitude lines
  const newLines = [];
  
  // First line - ceiling
  newLines.push({
    lineAlt: ceilingAltitude,
    text: "",
    textAlt: ceilingAltitude,
    ceiling: ceilingAltitude  // Add ceiling reference
  });

  let clearance = 1000;
  if (ceilingAltitude < 10000) {
    clearance = 500;
  }
  
  let firstAlt = ceilingAltitude - clearance;
  
  // Second line - clearance
  newLines.push({
    lineAlt: firstAlt,
    text: `-${clearance}`,
    textAlt: firstAlt + clearance/2,
    ceiling: ceilingAltitude
  });
  
  let finalAlt = Math.round((firstAlt) / 1000) * 1000 - 500;
  let dif = finalAlt - firstAlt;
  
  if (dif !== 0) {
    newLines.push({
      lineAlt: finalAlt,
      text: `${dif}`,
      textAlt: finalAlt - dif/2,
      ceiling: ceilingAltitude
    });
  }
  
  let thousand = Math.floor(finalAlt / 1000);
  let adjust = false;
  
  if (course < 180) {
    if (thousand % 2 === 0) {
      finalAlt -= 1000;
      adjust = true;
    }
  } else {
    if (thousand % 2 === 1) {
      finalAlt -= 1000;
      adjust = true;
    }
  }
  
  if (adjust) {
    newLines.push({
      lineAlt: finalAlt,
      text: "-1000",
      textAlt: finalAlt + 500,
      ceiling: ceilingAltitude
    });
  }

  setAltitudeLines(newLines);
  setAnswerText(`Maximum VFR Cruising Altitude: ${finalAlt?.toLocaleString() ?? "N/A"}'`);
};

  // Visualize runway - adds to existing visualizations
  const visualizeRunway = () => {
    if (toG === null) return;
    
    const rotation = calculateIndicatorRotation();
    setIndicatorRotation(rotation);
    setShowArrow(true);
    setShowIndicator(true);
  };

  // Insert compass - adds to existing visualizations
  const insertCompass = () => {
    if (toG === null) return;
    
    let direction = directionG;
    if (toG) {
      direction = (direction + 4) % 8;
    }
    const rotation = -45 * (direction - 4);
    setCompassRotation(rotation);
    setShowCompassImg(true);
  };

  // Calculate rotation for indicator
  const calculateIndicatorRotation = () => {
    let direction = directionG;
    let randPosiAve = 2 * randPosiG;
    
    if (toG) {
      direction = (direction + 4) % 8;
    }
    
    if (randPosi2G != null) {
      randPosiAve = randPosiG + randPosi2G;
    }
    
    let runwayindex;
    if (!relativeG) {
      if (indicatorG === 0) {
        runwayindex = (flagDirectionG + 4) % 8;
      } else {
        runwayindex = flagDirectionG;
      }
    } else {
      runwayindex = (direction + randPosiAve) % 8;
      if (indicatorG === 0) {
        runwayindex = (runwayindex + 4) % 8;
      }
      if ([randPosiG, randPosi2G].includes(0) && [randPosiG, randPosi2G].includes(3)) {
        runwayindex = (runwayindex + 4) % 8;
      }
    }
    
    let rotation = -45 * (direction - runwayindex);
    if (indicatorG === 1) rotation = (rotation + 180) % 360;
    return rotation;
  };

  // Solve Runway
  const solveRunway = () => {
    const runways = ["Runway 18", "Runway 23", "Runway 27", "Runway 32", "Runway 36", "Runway 05", "Runway 09", "Runway 14"];
    let runwayAnswer = "";
    let runwayindex = null;
    let direction = directionG;
    let randPosiAve = 2 * randPosiG;
    
    if (toG) {
      direction = (direction + 4) % 8;
    }
    
    if (randPosi2G != null) {
      randPosiAve = randPosiG + randPosi2G;
    }
    
    if (!relativeG) {
      if (indicatorG === 0) {
        runwayindex = (flagDirectionG + 4) % 8;
      } else {
        runwayindex = flagDirectionG;
      }
    } else {
      runwayindex = (direction + randPosiAve) % 8;
      if (indicatorG === 0) {
        runwayindex = (runwayindex + 4) % 8;
      }
      if ([randPosiG, randPosi2G].includes(0) && [randPosiG, randPosi2G].includes(3)) {
        runwayindex = (runwayindex + 4) % 8;
      }
    }
    
    runwayAnswer = runways[runwayindex];
    setSelectedAnswer(runwayAnswer);
    setIsAnswered(true);
    setSubmitButtonText('Next Question');
  };

  // Handle submit button click
  const handleSubmitClick = () => {
    if (!isAnswered) {
      // First click - submit answer
      solveRunway();
    } else {
      // Second click - generate new question
      generate();
    }
  };

  // Main solve function
  const solve = () => {
    if (questionType === 'vfr') {
      solveVfr();
    } else {
      solveRunway();
    }
  };

  // Initialize on mount
  useEffect(() => {
    generate();
  }, [generate]);

  // Handle question type change
  useEffect(() => {
    generate();
  }, [questionType, complexMode, generate]);

  return (
    
    <>
        <div className="frr-content">
            <div className="frr-left-section">
            <div className="button-row">
                <button onClick={generate}>Generate</button>
                {questionType === 'vfr' && (
                <button onClick={solve}>Solve</button>
                )}
                {questionType === 'runway' && (
                <>
                    <button onClick={visualizeRunway}>Visualize</button>
                    <button onClick={insertCompass}>Compass</button>
                </>
                )}
            </div>

            <div className="radio-list">
                <label className={questionType === 'vfr' ? 'softSelected' : ''}>
                <input
                    type="radio"
                    name="questionType"
                    value="vfr"
                    checked={questionType === 'vfr'}
                    onChange={(e) => setQuestionType(e.target.value)}
                />
                VFR Cruising Altitude
                </label>
                <label className={questionType === 'runway' ? 'softSelected' : ''}>
                <input
                    type="radio"
                    name="questionType"
                    value="runway"
                    checked={questionType === 'runway'}
                    onChange={(e) => setQuestionType(e.target.value)}
                />
                Runway Indicators
                </label>
                {questionType === 'runway' && (
                <label style={{ marginLeft: '20px' }}>
                    <input
                    type="checkbox"
                    checked={complexMode}
                    onChange={(e) => setComplexMode(e.target.checked)}
                    />
                    Complex Question
                </label>
                )}
            </div>

            <div className="qa-container">
                <div className="qa-box question-area">
                {questionText}
                </div>

                {questionType === 'vfr' && answerText && (
                <div className="qa-box answer-area">
                    {answerText}
                </div>
                )}

                {questionType === 'runway' && answerChoices.length > 0 && (
                <div className="qa-box">
                    <div className="radio-list" id="answerForm">
                    {answerChoices.map((choice, index) => (
                        <label
                        key={index}
                        className={
                            selectedAnswer && choice === selectedAnswer ? 'correct' : 
                            selectedAnswer && userAnswer === choice && choice !== selectedAnswer ? 'wrong' : 
                            !selectedAnswer && userAnswer === choice ? 'selected' : ''
                        }
                        onClick={() => {
                            if (!selectedAnswer) {
                            setUserAnswer(choice);
                            }
                        }}
                        >
                        <input
                            type="radio"
                            name="answerChoice"
                            value={choice}
                            checked={userAnswer === choice}
                            onChange={() => {}}
                            disabled={!!selectedAnswer}
                        />
                        {choice}
                        </label>
                    ))}
                    <button 
                        type="button"
                        className="submitBtn"
                        onClick={handleSubmitClick}
                        style={{ marginTop: '10px' }}
                    >
                        {submitButtonText}
                    </button>
                    </div>
                </div>
                )}
            </div>
            </div>

            <div className="Wheel-Container" id="wheel-container" style={{ position: 'relative', width: '500px', height: '500px' }}>
            {/* VFR Altitude Lines */}
            {questionType === 'vfr' && altitudeLines.length > 0 && altitudeLines.map((line, index) => (
                <React.Fragment key={index}>
                <div style={{
                    position: 'absolute',
                    left: '40px',
                    right: '40px',
                    top: `${15 + ((line.ceiling || 10000) - line.lineAlt) / 3500 * 500}px`,
                    height: '2px',
                    backgroundColor: '#000',
                    zIndex: 3
                }} />
                <div style={{
                    position: 'absolute',
                    left: '2px',
                    top: `${9 + ((line.ceiling || 10000) - line.lineAlt) / 3500 * 500}px`,
                    fontSize: '12px',
                    color: '#000',
                    zIndex: 4
                }}>
                    {line.lineAlt.toLocaleString()}
                </div>
                {line.text && (
                    <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${10 + ((line.ceiling || 10000) - line.textAlt) / 3500 * 500}px`,
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    color: '#000',
                    zIndex: 4
                    }}>
                    {line.text}
                    </div>
                )}
                </React.Fragment>
            ))}
            
            {/* Runway Visualizations - All can show at once */}
            {questionType === 'runway' && (
                <>
                {/* Compass - Behind everything */}
                {showCompassImg && (
                    <img
                    src="/images/heading.png"
                    alt="Compass"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${compassRotation}deg)`,
                        width: '250px',
                        zIndex: 5  // Lower z-index so it's behind
                    }}
                    />
                )}
                
                {/* Arrow - Moved down */}
                {showArrow && (
                    <img
                    src="/images/arrowfrr.png"
                    alt="Aircraft Arrow"
                    style={{
                        position: 'absolute',
                        bottom: '100%',  // Moved down from 0%
                        left: '50%',
                        transform: 'translate(-50%, 150%)',  // Adjusted transform
                        width: '60px',  // Back to original size
                        zIndex: 10
                    }}
                    />
                )}
                
                {/* Indicator (Tetra or Sock) - Smaller and moved up */}
                {showIndicator && (
                    <img
                    src={indicatorG === 0 ? '/images/tetra.png' : '/images/sock.png'}
                    alt={indicatorG === 0 ? 'Tetrahedron' : 'Windsock'}
                    style={{
                        position: 'absolute',
                        top: '5%',  // Moved up from 15%
                        left: '10%',  // Moved left from 15%
                        transform: `rotate(${indicatorRotation}deg)`,
                        width: '60px',  // Reduced from 100px
                        zIndex: 11
                    }}
                    />
                )}
                </>
            )}
            </div>
        </div>
    </>
  );
}

export default FRR;