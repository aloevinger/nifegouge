document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("solveBtn").addEventListener("click", solve);
document.getElementById("visualizeBtn").addEventListener("click", visualizeRunway);
document.getElementById("compassBtn").addEventListener("click", insertCompass);
window.addEventListener("DOMContentLoaded", () => {generate();});
let trigger = "vfr"
let directionG = null; 
let toG = null; 
let relativeG = null; 
let randPosiG = 0; 
let randPosi2G = null; 
let indicatorG = null; 
let flagDirectionG = null; 
let vfrIndicator = false;

function getSelectedQuestionType() {
  const radios = document.getElementsByName("questionType");
  for (const radio of radios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

const radioButtons = document.getElementsByName("questionType");
const answers = document.getElementById("answerText");
radioButtons.forEach(radio => {
  radio.addEventListener("change", () => {
    document.querySelectorAll('.radio-list label').forEach(label => {
      label.classList.remove('softSelected');
    });
    if (radio.checked) {
      radio.parentElement.classList.add('softSelected');
    }
    const container2 = document.getElementById("wheel-container");
    const answerArea = document.getElementById("answerText");
    answerArea.innerHTML = "";
    container2.innerHTML = "";
    if (radio.value === "runway" && radio.checked) {
      solveBtn.style.display = "none";
      visualizeBtn.style.display = "inline-block";
      compassBtn.style.display = "inline-block";
      complexOptions.style.display = "block";
      answerChoices.style.display = "block";
      answers.style.display = "none";
      trigger = "runway"
      renderRunwayOptions();
      generate();
    } else {
      solveBtn.style.display = "inline-block";
      visualizeBtn.style.display = "none";
      compassBtn.style.display = "none";
      complexOptions.style.display = "none";
      answerChoices.style.display = "none";
      answers.style.display = "block";
      vfrIndicator = false;
      generate();
    }
  });
});
// Update options when complex checkbox is toggled
const complexCheckbox = document.getElementById("complexCheckbox");
complexCheckbox.addEventListener("change", renderRunwayOptions);

// Render radio options
function renderRunwayOptions() {
  const complex = complexCheckbox.checked;
  const options = complex
    ? ["Runway 18", "Runway 23", "Runway 27", "Runway 32", "Runway 36", "Runway 05", "Runway 09", "Runway 14"]
    : ["Runway 23", "Runway 32", "Runway 05", "Runway 14"];

  renderAnswerOptions(options);
}

function renderAnswerOptions(options, containerId = "answerForm", name = "answerChoice") {
  const form = document.getElementById(containerId);
  if (!form) return;

  form.innerHTML = options.map(opt => `
    <label>
      <input type="radio" name="${name}" value="${opt}"> ${opt}
    </label>
  `).join("");

  // Add selection handling
  const labels = form.querySelectorAll("label");
  labels.forEach(label => {
    label.addEventListener("click", () => {
      labels.forEach(l => l.classList.remove("selected"));
      label.classList.add("selected");
    });
  });

  // Show the container if it was hidden
  document.getElementById("answerChoices").style.display = "block";

  // Append the submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "submitBtn";
  submitBtn.textContent = "Submit";
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();  // Prevent form from submitting traditionally
    solve();
  });
  form.appendChild(submitBtn);
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {
  const selectedType = getSelectedQuestionType();
  if (!selectedType) {
    alert("Please select a question type first.");
    return;
  }

  trigger = selectedType;
  switch (selectedType) {
    case "vfr":
      generateVfr();
      break;
    case "runway":
      [directionG, toG, relativeG, randPosiG, randPosi2G, indicatorG, flagDirectionG] = generateRunway();
      break;
    default:
      alert("You don fucked up A A ron");
  }
}

function generateVfr(){
    vfrIndicator = true;
    const container = document.getElementById("wheel-container");
    const answerArea = document.getElementById("answerText");
    answerArea.innerHTML = "";
    container.innerHTML = "";
    let vis = randBetween(2,10)
    let rand = Math.random()
    let airClass = rand < 0.1 ? "A" : "E";

    let clouds = ["FEW", "SCT", "FEW", "SCT", "BKN", "OVC"]
    let layers = randBetween(2,3);
    let cloudLayers = [];
    let altitude = randBetween(30,70)*100;
    for(i=0; i<layers; i++){
        let cloud = randBetween(2,5);
        if(i==0){cloud = randBetween(0,3);}
        let cloudLayer = clouds[cloud]+" at "+altitude.toLocaleString();
        cloudLayers.push(cloudLayer)
        altitude += randBetween(10, 50)*100;
    }
    let ceils = ["BKN", "OVC"]
    let ceil = randBetween(0,1)
    let ceilLayer = ceils[ceil]+" at "+altitude.toLocaleString();
    cloudLayers.push(ceilLayer)

    let heading = 0;
    let course = 0;
    let headRand = Math.random();
    if(headRand <0.3){
        heading = randBetween(177, 183);
        course = heading + randBetween(1,6)*Math.sign(180.01-heading);
    } else if(headRand <0.6){
        heading = randBetween(357, 363);
        course = heading + randBetween(1,6)*Math.sign(360.01-heading);
    } else {
        heading = randBetween(0, 360);
        course = heading + randBetween(-6,6);
    } 
    heading = heading%360
    course = course%360
    if(course<0){course+=360}

    let ceilingAltitude = 1000000;
    for (let line of cloudLayers) {
      if ((line.includes("BKN") || line.includes("OVC"))) {
        const altMatch = line.match(/(\d{1,3}(?:,\d{3})*)/);  // Look for 3+ digit number
        if (altMatch) {
          altitude = parseInt(altMatch[0].replace(/,/g, ""), 10);
          if(altitude < ceilingAltitude){
              ceilingAltitude = altitude;
          }
        }
      }
    }
    if(ceilingAltitude>10400 && vis <5){ vis=5;}

    const questionArea = document.getElementById("questionText");
    if (questionArea) {
        let output = `Class ${airClass} Airspace<br>`;
        output += `Visibility: ${vis} SM<br>`;
        cloudLayers.forEach(layer => output += `${layer}'<br>`);
        output += `Mag Heading: ${heading}°<br>`;
        output += `Mag Course: ${course}°`;

        questionArea.innerHTML = output;
    }
}

function generateRunway(){
    document.querySelectorAll('input[name="answerChoice"]').forEach(input => {
      const label = input.parentElement;
      label.classList.remove("correct", "wrong", "selected");
      input.checked = false;
    });
    const container = document.getElementById("wheel-container");
    container.innerHTML = "";
    const existingVis = container.querySelectorAll(".vis-img");
    existingVis.forEach(el => el.remove());
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const direction = randBetween(0,7)
    const dirRand = Math.random();
    let to = true
    if(dirRand>0.5) to = false;
    const relRand = Math.random();
    let relative = true
    if(relRand>0.7) relative = false;
    const complex = complexCheckbox.checked;
    let relPositions = ["towards", "to the left of", "away from", "to the right of"]
    const randPosi = randBetween(0,3);
    let relPosition = relPositions[randPosi];
    let randPosi2 = null;
    if(complex){
        if(Math.random() < 0.6){
            randPosi2 = randBetween(0,1)*2+(randPosi+1)%2;
            relPosition = relPosition +" and " + relPositions[randPosi2]; 
        }
    }
    let aircraftPosi = "";
    if(to){
        aircraftPosi = "Your aircraft is approaching the airfield heading towards the " + directions[direction]+".";
    } else{
        aircraftPosi = "Your aircraft is approaching the airfield from the " + directions[direction]+".";
    }
    let flagPosi = ""
    let indicators = ["spar of the tetrahedron", "wind sock"]
    let indicator = randBetween(0,1)
    let flagDirection = null;
    if(relative){
        flagPosi = " The " + indicators[indicator] + " is pointing, relative to your heading, " + relPosition +" you.";
    } else{
        flagDirection = randBetween(0,7);
        if(!complex){flagDirection = randBetween(0,3)*2+direction%2}
        flagPosi = " The " + indicators[indicator] + " is pointing to the " + directions[flagDirection] +".";   
    }
    let fullQ = aircraftPosi + flagPosi + " Which runway will you expect to use?"
    const questionArea = document.getElementById("questionText");
    if (questionArea) {
        questionArea.innerHTML = fullQ;
    }
    if(!complex && direction%2 == 0){
        const options = ["Runway 18", "Runway 27", "Runway 36", "Runway 09"];
        renderAnswerOptions(options);
    } else if(!complex){
        const options = ["Runway 23", "Runway 32", "Runway 05", "Runway 14"];
        renderAnswerOptions(options);
    }
    return [direction, to, relative, randPosi, randPosi2, indicator, flagDirection];
}

function solve() {
  switch (trigger) {
    case "vfr":
      solveVfr();
      break;
    case "runway":
      solveRunway();
      break;
    default:
      alert("You don fucked up A A ron");
  }
}

function solveVfr(){
  const questionArea = document.getElementById("questionText");
  const answerArea = document.getElementById("answerText");
  const lines = questionArea.innerHTML.split("<br>").map(line => line.trim());
  if(!vfrIndicator) return;

  let airClass = "";
  let visibility = null;
  let ceilingAltitude = 1000000;
  let course = null;

  for (let line of lines) {
    // 1. Airspace check
    if (line.startsWith("Class")) {
      airClass = line.split("Class")[1].trim();
      if (airClass === "A Airspace") {
        answerArea.innerHTML = "VFR flight not allowed (Class A)";
        return;
      }
    }

    // 2. Visibility check
    if (line.startsWith("Visibility:")) {
      const visMatch = line.match(/\d+/);
      if (visMatch) {
        visibility = parseInt(visMatch[0]);
        if (visibility < 3) {
          answerArea.innerHTML = "VFR flight not allowed (Visibility < 3)";
          return;
        }
      }
    }

    // 3. Cloud layer (first BKN or OVC)
    if ((line.includes("BKN") || line.includes("OVC"))) {
      const altMatch = line.match(/(\d{1,3}(?:,\d{3})*)/);  // Look for 3+ digit number
      if (altMatch ) {
        altitude = parseInt(altMatch[0].replace(/,/g, ""), 10);
        if(altitude < ceilingAltitude){
            ceilingAltitude = altitude;
        }
      }
    }

    // 4. Course
    if (line.startsWith("Mag Course:")) {
      const courseMatch = line.match(/\d+/);
      if (courseMatch) {
        course = parseInt(courseMatch[0]);
      }
    }
  }
  insertAltitudeLine(ceilingAltitude, ceilingAltitude);
  let clearance = 1000;
  if(ceilingAltitude<10000){
    clearance = 500;
  }
  let firstAlt = ceilingAltitude-clearance;
  insertAltitudeLine(ceilingAltitude, firstAlt, -clearance, firstAlt+clearance/2);
  let finalAlt = Math.round((firstAlt)/1000)*1000-500;
  let dif = finalAlt - firstAlt;
  if(dif != 0){insertAltitudeLine(ceilingAltitude, finalAlt, dif, finalAlt-dif/2);}
  let thousand = Math.floor(finalAlt/1000);
  adjust = false
  if(course < 180){
    if(thousand%2 === 0){
      finalAlt -= 1000;
      adjust = true;
    }
  }else{
    if(thousand%2 === 1){
      finalAlt -= 1000;
      adjust = true;
    }
  }
  if(adjust){insertAltitudeLine(ceilingAltitude, finalAlt, -1000, finalAlt+500);}
  // If passed checks
  let result = `Maximum VFR Cruising Altitude: ${finalAlt?.toLocaleString() ?? "N/A"}'`;

  answerArea.innerHTML = result;
}

function solveRunway(visualize = true){
    const runways = ["Runway 18", "Runway 23", "Runway 27", "Runway 32", "Runway 36", "Runway 05", "Runway 09", "Runway 14"];
    let runwayAnswer = "";
    let runwayindex = null;
    let direction = directionG;
    let randPosiAve = 2*randPosiG;
    if(toG){
        direction = (direction+4)%8;
    }
    if(randPosi2G != null){
        randPosiAve = randPosiG+randPosi2G;
    }
    if(!relativeG){
        if(indicatorG == 0){
            runwayindex = (flagDirectionG+4)%8;
        }else{
            runwayindex = flagDirectionG;
        }
    }else{
        runwayindex = (direction +randPosiAve)%8;
        if(indicatorG == 0){
            runwayindex = (runwayindex+4)%8;
        }
        if([randPosiG, randPosi2G].includes(0) && [randPosiG, randPosi2G].includes(3)){
            runwayindex = (runwayindex+4)%8;
        }
    }
    runwayAnswer = runways[runwayindex];
    let rotation = -45*(direction - runwayindex);
    if(indicatorG == 1){rotation = (rotation+180)%360}
    if(!visualize){return rotation}

 let selectedInput = null;

  document.querySelectorAll('input[name="answerChoice"]').forEach(input => {
    if (input.checked) selectedInput = input;
  });

  // Determine correct answer and apply styles
  document.querySelectorAll('input[name="answerChoice"]').forEach(input => {
    const label = input.parentElement;
    label.classList.remove("correct", "wrong", "selected");

    if (input.value === runwayAnswer) {
      input.checked = true;
      label.classList.add("correct");
    } else if (input === selectedInput) {
      label.classList.add("wrong");
    }    
  });
}

function insertAltitudeLine(ceiling, lineAlt, text = "", textAlt = null) {
  const container = document.getElementById("wheel-container");
  const containerHeight = container.clientHeight;

  const lineY = 15+((ceiling - lineAlt))/3500 * containerHeight;
  const textY = 15+((ceiling - textAlt))/3500 * containerHeight;

  // Create the horizontal line
  const line = document.createElement("div");
  line.style.position = "absolute";
  line.style.left = "40px";
  line.style.right = "40px";
  line.style.top = `${lineY}px`;
  line.style.height = "2px";
  line.style.backgroundColor = "#000";
  line.style.zIndex = "3";
  container.appendChild(line);

  // Add the altitude label to the left of the line
  const altLabel = document.createElement("div");
  altLabel.textContent = `${lineAlt.toLocaleString()}`;
  altLabel.style.position = "absolute";
  altLabel.style.left = "2px";
  altLabel.style.top = `${lineY-6}px`;
  altLabel.style.fontSize = "12px";
  altLabel.style.color = "#000";
  altLabel.style.zIndex = "4";
  container.appendChild(altLabel);

  // Optional: Add the centered text label at textAlt position
  if (text) {
    const textLabel = document.createElement("div");
    textLabel.textContent = text;
    textLabel.style.position = "absolute";
    textLabel.style.left = "50%";
    textLabel.style.top = `${textY-5}px`;
    textLabel.style.transform = "translateX(-50%)";
    textLabel.style.fontSize = "12px";
    textLabel.style.color = "#000";
    textLabel.style.zIndex = "4";
    container.appendChild(textLabel);
  }
}

function visualizeRunway() {
  const container = document.getElementById("wheel-container");
  if(toG === null) {return;}
  const rotation = solveRunway(false);

  // Bottom centered arrow
  const arrow = document.createElement("img");
  arrow.src = "arrow.png";
  arrow.alt = "Aircraft Arrow";
  arrow.className = "vis-img";
  arrow.style.position = "absolute";
  arrow.style.bottom = "100%";
  arrow.style.left = "50%";
  arrow.style.transform = "translate(-50%,150%)";
  arrow.style.width = "60px"; // Adjust size if needed
  container.appendChild(arrow);

  // Top-left corner indicator (sock or tetra)
  const indicator = document.createElement("img");
  indicator.src = indicatorG === 0 ? "tetra.png" : "sock.png";
  indicator.alt = indicatorG === 0 ? "Tetrahedron" : "Windsock";
  indicator.className = "vis-img";
  indicator.style.position = "absolute";
  indicator.style.top = "5%";
  indicator.style.left = "10%";
  indicator.style.transform = `rotate(${rotation}deg)`;
  indicator.style.width = "60px"; // Adjust size if needed
  container.appendChild(indicator);
}

function insertCompass() {
  const container = document.getElementById("wheel-container");
  if(toG === null) {return;}
  let direction = directionG;
  if(toG){
     direction = (direction+4)%8;
  }
  const rotation = -45*(direction-4)

  // Top-left corner indicator (sock or tetra)
  const compass = document.createElement("img");
  compass.src = "heading.png";
  compass.alt = "compass";
  compass.className = "vis-img";
  compass.style.position = "absolute";
  compass.style.top = "50%";
  compass.style.left = "50%";
  compass.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  compass.style.width = "250px"; // Adjust size if needed
  container.appendChild(compass);
}

