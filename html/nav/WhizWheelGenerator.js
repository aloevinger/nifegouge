document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("solveBtn").addEventListener("click", solve);
document.getElementById("checkBtn").addEventListener("click", checkWork);
let trigger = "Distance"
window.addEventListener("DOMContentLoaded", () => {attachEditListeners();});

function attachEditListeners() {
  const inputs = document.querySelectorAll("td input");
  
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      input.dataset.solved = "0";
      resetBackground() 
    });
  });
}

function getSelectedQuestionType() {
  const radios = document.getElementsByName("questionType");
  for (const radio of radios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

function clearInputFields() {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach(row => {
    const variableCell = row.cells[1];
    const valueCell = row.cells[2];
    const valueInput = valueCell?.querySelector("input");
    const unitCell = row.cells[3];
    valueInput?.classList.remove("bg-green", "bg-yellow", "bg-red");
    
    if (variableCell) variableCell.textContent = "";
    if (valueInput) {
      valueInput.value = "";
      valueInput.style.display = "none";
      valueInput.dataset.solved = "0";
    }
    if (unitCell) unitCell.textContent = "";
  });
  document.querySelectorAll(".explanation-row").forEach(row => {
    row.style.display = "none";
    row.querySelector(".explanation-cell").textContent = "";
  });
}

function resetBackground() {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach(row => {
    const valueCell = row.cells[2];
    const valueInput = valueCell?.querySelector("input");
    valueInput?.classList.remove("bg-green", "bg-yellow", "bg-red");
  });
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {
  clearInputFields();
  const rows = document.querySelectorAll("tbody tr");
  const selectedType = getSelectedQuestionType();
  if (!selectedType) {
    alert("Please select a question type first.");
    return;
  }

  trigger = selectedType;
  switch (selectedType) {
    case "Distance":
    case "Speed":
    case "Time":
      generateDST(selectedType);
      insertDSTWheel();
      break;
    case "Fuel Consumption":
      generateFConsume();
      insertDSTWheel();
      break;
    case "Fuel Conversions":
      generateFConvert();
      insertDSTWheel();
      break;
    case "Airspeed":
      generateAirspeed();
      insertDSTWheel();
      break;
    case "Preflight Winds":
      generatePreflight();
      insertWindWheel();
      break;
    case "In Flight Winds":
      generateInflight();
      insertWindWheel();
      break;
    case "Lollipop":
      generateLollipop();
      insertWindWheel();
      break;
    case "Time Conversion":
      generateTime();
      insertHat();
      break;
    default:
      alert("You don fucked up A A ron");
  }
}

function generateDST(selectedType) {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  // Set variable labels
  rows[0].cells[1].textContent = "Distance";
  rows[1].cells[1].textContent = "Speed";
  rows[2].cells[1].textContent = "Time";
  // Show and initialize input fields for these three rows
  for (let i = 0; i < 3; i++) {
    const input = rows[i].cells[2].querySelector("input");
    if (input) {
      input.style.display = "inline-block";
    }
  }

  let speed = randBetween(22, 130) * 5;
  let dist = 0;

  if (rand < 0.2) {
    dist = randBetween(2, 10) / 2;
  }
  if (rand >= 0.2 && rand < 0.4) {
    dist = randBetween(2, 19) * 5;
  }
  if (rand >= 0.4 && rand < 0.9) {
    dist = randBetween(22, 199) * 5;
  }
  if (rand >= 0.9) {
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

  rows[0].cells[2].querySelector("input").value = dist;
  rows[1].cells[2].querySelector("input").value = speed;
  rows[2].cells[2].querySelector("input").value = time;
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[2].querySelector("input").dataset.solved = "1";

  rows[0].cells[3].textContent = "nm";
  rows[1].cells[3].textContent = "kts";
  rows[2].cells[3].innerHTML = `
    <select class="unit-select">
      <option value="hrs" ${units === 'hrs' ? 'selected' : ''}>hrs</option>
      <option value="mins" ${units === 'mins' ? 'selected' : ''}>mins</option>
      <option value="secs" ${units === 'secs' ? 'selected' : ''}>secs</option>
    </select>`;

  // Clear answer cell (simulate Apps Script behavior)
  if (selectedType === "Distance") {
    rows[0].cells[2].querySelector("input").value = "";
    rows[0].cells[2].querySelector("input").dataset.solved = "0";
    rows[0].cells[3].textContent = "";
  } else if (selectedType === "Speed") {
    rows[1].cells[2].querySelector("input").value = "";
    rows[1].cells[2].querySelector("input").dataset.solved = "0";
    rows[1].cells[3].textContent = "";
  } else if (selectedType === "Time") {
    rows[2].cells[2].querySelector("input").value = "";
    rows[2].cells[2].querySelector("input").dataset.solved = "0";
    rows[2].cells[3].textContent = "";
  }
}

function generateFConsume() {
  const rows = document.querySelectorAll("tbody tr");
  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");

  // Set variable labels
  rows[0].cells[1].textContent = "Fuel Flow";
  rows[1].cells[1].textContent = "Time";
  rows[2].cells[1].textContent = "Fuel Quantity";

  // Show and initialize input fields for these three rows
  for (let i = 0; i < 3; i++) {
    const input = rows[i].cells[2].querySelector("input");
    if (input) {
      input.style.display = "inline-block";
    }
  }

  const rand = Math.random();

  let fflow = 0;
  if (rand < 0.5) {
    fflow = randBetween(27, 199) * 5;
  } else {
    fflow = randBetween(11, 50) * 100;
  }

  let fquan = 0;
  if (rand < 0.3) {
    fquan = randBetween(100, 999);
  } else if (rand < 0.9) {
    fquan = randBetween(100, 999) * 10;
  } else {
    fquan = randBetween(20, 60) * 500;
  }

  let gquan = fquan / 6.8;
  gquan = Number(gquan.toFixed(1));

  let time = fquan / fflow;
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

  const vrand = Math.ceil(3 * Math.random());
  const urand = Math.random();

  let quan = 0;
  let quanUnit = "";
  if (urand < 0.25) {
    quan = gquan;
    quanUnit = "gal";
    explanationRow.style.display = "table-row";
    explanationCell.textContent = "Assume 6.8 lbs/gal";
  } else {
    quan = fquan;
    quanUnit = "lbs";
  }

  rows[0].cells[2].querySelector("input").value = fflow;
  rows[1].cells[2].querySelector("input").value = time;
  rows[2].cells[2].querySelector("input").value = quan;
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[2].querySelector("input").dataset.solved = "1";

  rows[0].cells[3].textContent = "lbs per hour";
  rows[1].cells[3].textContent = units;
  rows[2].cells[3].innerHTML = `
    <select class="unit-select">
      <option value="lbs" ${quanUnit === 'lbs' ? 'selected' : ''}>lbs</option>
      <option value="gal" ${quanUnit === 'gal' ? 'selected' : ''}>gal</option>
    </select>`;
  rows[vrand - 1].cells[2].querySelector("input").value = "";
  rows[vrand - 1].cells[3].textContent = "";
  rows[vrand - 1].cells[2].querySelector("input").dataset.solved = "0";
  if (vrand === 3){
    explanationRow.style.display = "none";
  }
} 

function generateFConvert() {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  // Set variable labels and unit labels
  rows[0].cells[1].textContent = "Fuel Weight";
  rows[1].cells[1].textContent = "Fuel";
  rows[2].cells[1].textContent = "Fuel";
  rows[0].cells[3].textContent = "lbs per gal";
  rows[1].cells[3].textContent = "lbs";
  rows[2].cells[3].textContent = "gals";

  // Make sure input fields are visible
  for (let i = 0; i < 3; i++) {
    const input = rows[i].cells[2].querySelector("input");
    if (input) {
      input.style.display = "inline-block";
    }
  }

  let fweight = 6 + randBetween(4, 8) / 10;
  let flbs = 0;

  if (rand < 0.5) {
    flbs = randBetween(100, 999) * 10;
  } else {
    flbs = randBetween(20, 60) * 500;
  }

  const fgal = Math.round(flbs / (10 * fweight)) * 10;
  const vrand = Math.ceil(2 * Math.random());

  rows[0].cells[2].querySelector("input").value = fweight;
  rows[1].cells[2].querySelector("input").value = flbs;
  rows[2].cells[2].querySelector("input").value = fgal;
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[2].querySelector("input").dataset.solved = "1";

  // Clear the randomly selected answer field
  const ansInput = rows[vrand].cells[2].querySelector("input");
  if (ansInput){
    ansInput.dataset.solved = "0";
    ansInput.value = ""};
}

function generateAirspeed() {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  // Set variable labels and units
  const labels = ["CALT", "ALTIM", "TEMP", "", "PALT", "CAS", "TAS"];
  const units = ["ft", "inHg", "C", "", "ft", "kts", "kts"];

  for (let i = 0; i < 7; i++) {
  if (i === 3) continue;
    rows[i].cells[1].textContent = labels[i];
    rows[i].cells[3].textContent = units[i];
    const input = rows[i].cells[2].querySelector("input");
    if (input) input.style.display = "inline-block";
  }

  let calt = rand < 0.5 ? randBetween(180, 999) * 10 : randBetween(20, 45) * 500;
  let cas = rand > 0.15 ? randBetween(22, 70) * 5 : randBetween(80, 100) * 5;
  let altim = 29.92 + randBetween(-23, 10) / 10;
  altim = Number(altim.toFixed(2));
  let temp = randBetween(0, 9) * 5 - 25;
  let palt = Math.round((29.92 - altim) * 1000 + calt);
  let tas = Math.round(tasFromCas(temp, palt, cas));

  const values = [calt, altim, temp, "", palt, cas, tas];
  const vrand = Math.random();
  let hiddenIndex = vrand < 0.3 ? 5 : 6;
  if(rand <=0.15)hiddenIndex = 6;

  for (let i = 0; i < values.length+1; i++) {
    if (i === 3||i === 4) continue;
    const input = rows[i].cells[2].querySelector("input");
    if (input){
      input.dataset.solved = "1";
      input.value = values[i]};
  }

  // Clear answer field
  const ansInput = rows[hiddenIndex].cells[2].querySelector("input");
  if (ansInput){
    ansInput.dataset.solved = "0";
    ansInput.value = "";
  } 
}

function generatePreflight() {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  const labels = ["TC", "TAS", "DIR", "", "VEL", "XW", "CA", "TH", "HW/TW", "GS"];
  const units = ["° T", "kts", "° T", "", "kts", "kts", "° T", "° T", "kts", "kts"];

  for (let i = 0; i < labels.length; i++) {
    if (i === 3) continue;
    rows[i].cells[1].textContent = labels[i];
    rows[i].cells[3].textContent = units[i];
    const input = rows[i].cells[2].querySelector("input");
    if (input) {
      input.style.display = "inline-block";
    }
  }

  let tas = rand < 0.75 ? randBetween(100, 400) : randBetween(400, 990);
  let kts = (rand < 0.125 || rand > 0.875) ? randBetween(12, 20) * 5 : randBetween(10, 50);
  let tc = randBetween(0, 359);
  let dir = randBetween(0, 72) * 5;

  rows[0].cells[2].querySelector("input").value = tc;
  rows[1].cells[2].querySelector("input").value = tas;
  rows[2].cells[2].querySelector("input").value = dir;
  rows[4].cells[2].querySelector("input").value = kts;
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[2].querySelector("input").dataset.solved = "1";
  rows[4].cells[2].querySelector("input").dataset.solved = "1";
} 

function generateInflight() {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  const labels = ["TH", "TAS", "TRK", "", "GS", "DA", "XW", "HW/TW", "DIR", "VEL"];
  const units = ["° T", "kts", "° T", "", "kts", "ft", "kts", "kts", "° T", "kts"];

  for (let i = 0; i < labels.length; i++) {
    if (i === 3) continue;
    rows[i].cells[1].textContent = labels[i];
    rows[i].cells[3].textContent = units[i];
    const input = rows[i].cells[2].querySelector("input");
    if (input) input.style.display = "inline-block";
  }

  const th = randBetween(0, 359);
  let tas = rand < 0.75 ? randBetween(100, 400) : randBetween(400, 950);

  let trk;
  if (rand < 0.5) {
    trk = th + randBetween(7, 9) * Math.sign(rand - 0.5);
  } else {
    trk = th + randBetween(2, 6) * Math.sign(rand - 0.5);
  }
  if (trk < 0 || trk > 360) {
    trk = trk - Math.sign(trk) * 360;
  }

  let gs;
  if (rand < 0.125 || rand > 0.875) {
    gs = tas + Math.round(randBetween(12, 30) * 2.5) * Math.sign(rand - 0.5);
  } else {
    gs = tas + Math.round(randBetween(10, 50) * 0.5) * Math.sign(rand - 0.5);
  }

  const values = [th, tas, trk, "", gs];

  for (let i = 0; i < values.length; i++) {
    if (i === 3) continue;
    const input = rows[i].cells[2].querySelector("input");
    if (input) {
      input.dataset.solved = "1"
      input.value = values[i];}
  }
}

function generateLollipop() {
  const rand = Math.random();
  const rows = document.querySelectorAll("tbody tr");

  const labels = [
    "BDHI Reading", "BDHI Distance", "Target Radial", "",
    "Target Distance", "Course", "Distance"
  ];
  const units = ["° M", "nm", "° M", "", "nm", "° M", "nm"];

  for (let i = 0; i < labels.length; i++) {
    if (i === 3) continue;
    rows[i].cells[1].textContent = labels[i];
    rows[i].cells[3].textContent = units[i];
    const input = rows[i].cells[2].querySelector("input");
    if (input) input.style.display = "inline-block";
  }

  let bdhiC = randBetween(0, 359);
  let targetC = 0;
  if (rand < 0.5) {
    targetC = (bdhiC - 180 + randBetween(40, 180) * Math.sign(Math.random() - 0.5)) % 360;
    if (targetC < 0) targetC += 360;
    bdhiC = `${bdhiC} TO`;
  } else {
    targetC = (bdhiC + randBetween(40, 180) * Math.sign(Math.random() - 0.5)) % 360;
    if (targetC < 0) targetC += 360;
    bdhiC = `${bdhiC} FROM`;
  }

  const bdhirand = Math.random();
  let dist = bdhirand < 0.5 ? randBetween(20, 60) : randBetween(60, 130);

  const targetrand = Math.random();
  let targdist = (targetrand < 0.5 || bdhirand < 0.5) ? randBetween(10, 50) : randBetween(30, 100);

  const values = [bdhiC, dist, targetC, "", targdist];

  for (let i = 0; i < values.length; i++) {
    if (i === 3) continue;
    const input = rows[i].cells[2].querySelector("input");
    if (input){
      input.dataset.solved = "1";
      input.value = values[i];}
  }
}

function generateTime() {
  const rows = document.querySelectorAll("tbody tr");

  // Set variable labels
  rows[0].cells[1].textContent = "Duration";
  rows[1].cells[1].textContent = "ZD Departure";
  rows[2].cells[1].textContent = "ZD Arrival";
  rows[4].cells[1].textContent = "Depature Time LT";
  rows[5].cells[1].textContent = "Depature Time UTC";
  rows[7].cells[1].textContent = "Arrival Time LT";
  rows[6].cells[1].textContent = "Arrival Time UTC";
  // Show and initialize input fields for these three rows
  for (let i = 0; i < 8; i++) {
    if (i === 3) continue;
    const input = rows[i].cells[2].querySelector("input");
    if (input) input.style.display = "inline-block";
  }

  let time1 = randBetween(0, 23) * 100+randBetween(0,59);
  let duration = randBetween(2, 17)*100+randBetween(0,59);
  let zd = randBetween(-12, 12);
  let zd2 = (zd + Math.floor(duration/100) + randBetween(-3, 3)+12)%25-12;
  let zulutime = (time1 - zd*100)%2400;
  if(zulutime<0){zulutime+=2400;}
  let mins2 = zulutime%100 + duration%100;
  let hrs2 = Math.floor(zulutime/100)+Math.floor(duration/100)+Math.floor(mins2/60);
  let zulutime2 = (hrs2*100+mins2%60)%2400;
  let time2 = (zulutime2 + zd2*100)%2400;
  if(time2<0){time2+=2400;}

  let durationText = Math.floor(duration/100) + "+" + duration%100

  rows[0].cells[2].querySelector("input").value = durationText;
  rows[1].cells[2].querySelector("input").value = zd;
  rows[2].cells[2].querySelector("input").value = zd2;
  rows[4].cells[2].querySelector("input").value = time1.toString().padStart(4, "0");
  rows[5].cells[2].querySelector("input").value = zulutime.toString().padStart(4, "0");
  rows[6].cells[2].querySelector("input").value = zulutime2.toString().padStart(4, "0");
  rows[7].cells[2].querySelector("input").value = time2.toString().padStart(4, "0");
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[2].querySelector("input").dataset.solved = "1";
  rows[4].cells[2].querySelector("input").dataset.solved = "1";
  rows[5].cells[2].querySelector("input").dataset.solved = "1";
  rows[6].cells[2].querySelector("input").dataset.solved = "1";
  rows[7].cells[2].querySelector("input").dataset.solved = "1";

  rows[4].cells[3].textContent = "LT";
  rows[5].cells[3].textContent = "UTC";
  rows[7].cells[3].textContent = "LT";
  rows[6].cells[3].textContent = "UTC";

  const nums = [4, 5, 6, 7];
  const shuffled = nums.sort(() => 0.5 - Math.random());
  indices = shuffled.slice(0, 3);
  rows[indices[0]].cells[2].querySelector("input").value = "";
  rows[indices[1]].cells[2].querySelector("input").value = "";
  rows[indices[2]].cells[2].querySelector("input").value = "";
  rows[indices[0]].cells[2].querySelector("input").dataset.solved = "0";
  rows[indices[1]].cells[2].querySelector("input").dataset.solved = "0";
  rows[indices[2]].cells[2].querySelector("input").dataset.solved = "0";
}

function solve(visualize = true) {
  resetBackground() 
  let solutions = null;
  switch (trigger) {
    case "Distance":
      solutions = solveGenericDST(visualize);
      break;
    case "Speed":
      solutions = solveGenericDST(visualize);
      break;
    case "Time":
      solutions = solveGenericDST(visualize);
      break;
    case "Fuel Consumption":
      solutions = solveFConsume(visualize);
      break;
    case "Fuel Conversions":
      solutions = solveFConvert(visualize);
      break;
    case "Airspeed":
      solutions = solveAirspeed(visualize);
      break;
    case "Preflight Winds":
      solutions = solvePreflight(visualize);
      break;
    case "In Flight Winds":
      solutions = solveInflight(visualize);
      break;
    case "Lollipop":
      solutions = solveLollipop(visualize);
      break;
    case "Time Conversion":
      solutions = solveTime(visualize);
      break;
    default:
      alert("You don fucked up A A ron");
  }
  return solutions;
}

function solveGenericDST(visualize = true){
  let solutions = null;
  const rows = document.querySelectorAll("tbody tr");
  if(rows[0].cells[2].querySelector("input").dataset.solved=="0"){
    solutions = solveDST(visualize);
  }else if(rows[1].cells[2].querySelector("input").dataset.solved=="0"){
    solutions = solveSTD(visualize);
  }else if(rows[2].cells[2].querySelector("input").dataset.solved=="0"){
    solutions = solveTDS(visualize);
  }
  return solutions;
}

function solveDST(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");

  const speed = parseFloat(rows[1].cells[2].querySelector("input").value);
  const time1 = parseFloat(rows[2].cells[2].querySelector("input").value);
  const unit = rows[2].cells[3].querySelector("select")?.value || "hrs";
  let time = time1;

  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");
  let explainTxt = ""
  if (unit === "secs") {
    time = time1/3600;
    explainTxt = "Secs so use the high speed scale 36 under speed";
  } else if (unit === "mins") {
    time = time1 / 60;
    explainTxt = "Mins so use the standard scale 60 under speed";
  } else {
    explainTxt = "Hrs so use the 10 under speed";
  }

  let dist = speed * time;
  dist = Number(dist.toFixed(1));
  if(!visualize){return [[dist, 0, dist]]}
  
  explanationRow.style.display = "table-row";
  explanationCell.textContent = explainTxt;
  rows[0].cells[2].querySelector("input").value = dist;
  rows[0].cells[2].querySelector("input").dataset.solved = "1";
  rows[0].cells[3].textContent = "nm";
  
  outerDeg = turnToDegrees(dist);
  innerDeg = turnToDegrees(time1);
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solveSTD(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");

  const dist = parseFloat(rows[0].cells[2].querySelector("input").value);
  const time1 = parseFloat(rows[2].cells[2].querySelector("input").value);
  const unit = rows[2].cells[3].querySelector("select")?.value || "hrs";
  let time = time1;
  let inner = 10;

  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");
  let explainTxt = "";
  if (unit === "secs") {
    time = time1 / 3600;
    inner = 36;
    explainTxt = "Secs so use the high speed scale 36 under speed";
  } else if (unit === "mins") {
    time = time1 / 60;
    inner = 60;
    explainTxt = "Mins so use the standard scale 60 under speed";
  } else {
    explainTxt = "Hrs so use the 10 under speed";
  }

  let speed = dist / time;
  speed = Number(speed.toFixed(1));
  
  if(!visualize){return [[speed, 1, speed]]}

  explanationRow.style.display = "table-row";
  explanationCell.textContent = explainTxt;
  rows[1].cells[2].querySelector("input").value = speed;
  rows[1].cells[2].querySelector("input").dataset.solved = "1";
  rows[1].cells[3].textContent = "kts";

  outerDeg = turnToDegrees(speed);
  innerDeg = turnToDegrees(inner);
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solveTDS(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");

  const dist = parseFloat(rows[0].cells[2].querySelector("input").value);
  const speed = parseFloat(rows[1].cells[2].querySelector("input").value);
  let time = dist / speed;
  let units = "";

  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");
  let explainTxt = ""

  if (time > 1.66) {
    time = Number(time.toFixed(1));
    units = "hrs";
    explainTxt = "Distance is much greater than speed, so use the 10 under speed and hrs";
  } else if (time > 0.027) {
    time *= 60;
    time = Number(time.toFixed(1));
    units = "mins";
    explainTxt = "Distance is not too small or large, so use the 60 under speed and mins";
  } else {
    time *= 3600;
    time = Number(time.toFixed(1));
    units = "secs";
    explainTxt = "Distance is much smaller than speed, so use the 36 under speed and secs";
  }
  if(!visualize){return [[time, 2, time]]}

  explanationRow.style.display = "table-row";
  explanationCell.textContent = explainTxt;

  rows[2].cells[2].querySelector("input").value = time;
  rows[2].cells[2].querySelector("input").dataset.solved = "1";
  rows[2].cells[3].innerHTML = `
    <select class="unit-select">
      <option value="hrs" ${units === 'hrs' ? 'selected' : ''}>hrs</option>
      <option value="mins" ${units === 'mins' ? 'selected' : ''}>mins</option>
      <option value="secs" ${units === 'secs' ? 'selected' : ''}>secs</option>
    </select>`;

  outerDeg = turnToDegrees(dist);
  innerDeg = turnToDegrees(time);
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solveFConsume(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");
  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");
  let explainTxt = "";

  let qnum = -1;
  for (let i of [0, 1, 2]) {
    const input = rows[i].cells[2].querySelector("input");
    if (input && input.dataset.solved=="0") {
      qnum = i;
      break;
    }
  }

  if (qnum === 0) {
    let fquan = parseFloat(rows[2].cells[2].querySelector("input").value);
    let quanUnit = rows[2].cells[3].querySelector("select")?.value || "hrs";
    let time = parseFloat(rows[1].cells[2].querySelector("input").value);
    let unit = rows[1].cells[3].textContent;

    if (quanUnit === "gal") fquan *= 6.8;

    let inner = 10;
    if (unit === "secs") {
      time = time / 3600;
      inner = 36;
      explainTxt = "Secs so use the high speed scale 36 under flow rate";
    } else if (unit === "mins") {
      time = time / 60;
      inner = 60;
      explainTxt = "Mins so use the standard scale 60 under flow rate";
    } else {
      explainTxt = "Hrs so use the 10 under flow rate";
    }

    const fflow = Number((fquan / time).toFixed(1));
    if(!visualize){return [[fflow, 0, fflow]]}
    rows[0].cells[2].querySelector("input").value = fflow;
    rows[0].cells[2].querySelector("input").dataset.solved = "1";
    rows[0].cells[3].textContent = "lbs per hour";

    outerDeg = turnToDegrees(fflow);
    innerDeg = turnToDegrees(inner);
  } else if (qnum === 1) {
    const fflow = parseFloat(rows[0].cells[2].querySelector("input").value);
    let fquan = parseFloat(rows[2].cells[2].querySelector("input").value);
    let quanUnit = rows[2].cells[3].querySelector("select")?.value || "hrs";
    if (quanUnit === "gal") fquan *= 6.8;

    let time = fquan / fflow;
    let unit = "";

    if (time > 1.66) {
      time = Number(time.toFixed(1));
      unit = "hrs";
      explainTxt = "Quantity is much greater than flow, so use the 10 under flow and hrs";
    } else if (time > 0.027) {
      time *= 60;
      time = Number(time.toFixed(1));
      unit = "mins";
      explainTxt = "Quantity is not too small or large, so use the 60 under flow and mins";
    } else {
      time *= 3600;
      time = Number(time.toFixed(1));
      unit = "secs";
      explainTxt = "Quantity is much smaller than flow, so use the 36 under flow and secs";
    }
    if(!visualize){return [[time, 1, time]]}

    rows[1].cells[2].querySelector("input").value = time;
    rows[1].cells[2].querySelector("input").dataset.solved = "1";
    rows[1].cells[3].textContent = unit;

    outerDeg = turnToDegrees(fquan);
    innerDeg = turnToDegrees(time);
  } else if (qnum === 2) {
    const fflow = parseFloat(rows[0].cells[2].querySelector("input").value);
    const time1 = parseFloat(rows[1].cells[2].querySelector("input").value);
    const unit = rows[1].cells[3].textContent;
    let time = time1;

    if (unit === "secs") {
      time = time1 / 3600;
      explainTxt = "Secs so use the high speed scale 36 under flow rate";
    } else if (unit === "mins") {
      time = time1 / 60;
      explainTxt = "Mins so use the standard scale 60 under flow rate";
    } else {
      explainTxt = "Hrs so use the 10 under flow rate";
    }

    const fquan = Number((fflow * time).toFixed(1));
    if(!visualize){return [[fquan, 2, fquan]]}
    rows[2].cells[2].querySelector("input").value = fquan;
    rows[2].cells[2].querySelector("input").dataset.solved = "1";
    rows[2].cells[3].innerHTML = `
      <select class="unit-select">
        <option value="lbs" selected>lbs</option>
        <option value="gal">gal</option>
      </select>`;

    outerDeg = turnToDegrees(fquan);
    innerDeg = turnToDegrees(time1);
  }else {
    outerDeg = 0;
    innerDeg = 0;
    if(!visualize){return}
    explainTxt = "Nothing's blank, nothing to solve";
  }
  
  explanationRow.style.display = "table-row";
  explanationCell.textContent = explainTxt;
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solveFConvert(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");
  const explanationRow = document.querySelectorAll(".explanation-row")[0]; 
  const explanationCell = explanationRow.querySelector(".explanation-cell");

  let qnum = -1;
  for (let i of [1, 2]) {
    const input = rows[i].cells[2].querySelector("input");
    if (input && input.dataset.solved=="0") {
      qnum = i;
      break;
    }
  }

  const fweight = parseFloat(rows[0].cells[2].querySelector("input").value);

  if (qnum === 1) {
    const fgal = parseFloat(rows[2].cells[2].querySelector("input").value);
    const flbs = Number((fgal * fweight).toFixed(1));
    if(!visualize){return [[flbs, 1, flbs]]}

    rows[1].cells[2].querySelector("input").value = flbs;
    rows[1].cells[2].querySelector("input").dataset.solved = "1";
    rows[1].cells[3].textContent = "lbs";
    
    outerDeg = turnToDegrees(flbs);
    innerDeg = turnToDegrees(fgal);
  } else if (qnum === 2) {
    const flbs = parseFloat(rows[1].cells[2].querySelector("input").value);
    const fgal = Number((flbs / fweight).toFixed(1));
    if(!visualize){return [[fgal, 2, fgal]]}

    rows[2].cells[2].querySelector("input").value = fgal;
    rows[2].cells[2].querySelector("input").dataset.solved = "1";
    rows[2].cells[3].textContent = "gal";
    
    outerDeg = turnToDegrees(flbs);
    innerDeg = turnToDegrees(fgal);
  } else {
    outerDeg = 0;
    innerDeg = 0;
    if(!visualize){return}
    explanationRow.style.display = "table-row";
    explanationCell.textContent = "Nothing's blank, nothing to solve.";
  }
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solveAirspeed(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");

  // Adjusted for HTML layout: 3rd row is explanation row, so use rows[0], [1], [2], [3], [4], [5], [6]
  const calt = parseFloat(rows[0].cells[2].querySelector("input").value);
  const altim = parseFloat(rows[1].cells[2].querySelector("input").value);
  const temp = parseFloat(rows[2].cells[2].querySelector("input").value);
  
  const paltInput = rows[4].cells[2].querySelector("input");
  const casInput = rows[5].cells[2].querySelector("input");
  const tasInput = rows[6].cells[2].querySelector("input");

  let qnum = -1;
  if (casInput && casInput.dataset.solved =="0") {
    qnum = 5;
  } else if (tasInput && tasInput.dataset.solved =="0") {
    qnum = 6;
  }

  let palt = 0;
  if (isNaN(calt)) {
    palt = parseFloat(paltInput.value); // Use side-cell for PALT if CALT empty
  } else {
    palt = (29.92 - altim) * 1000 + calt;
  }
  if(qnum === -1 && !visualize){return [[palt, 4, palt]];}

  if (qnum === 5) {
    const tas = parseFloat(tasInput.value);
    let cas = casFromTas(temp, palt, tas);
    cas = Math.round(cas);
    if(!visualize){return [[palt, 4, palt], [cas, 5, cas]]}

    paltInput.value = Math.round(palt);
    paltInput.dataset.solved ="1";
    casInput.value = cas;
    casInput.dataset.solved ="1";

    const palt_k = palt / 1000;
    const inNum = 0.00510393 * Math.pow(palt_k, 2) - 1.13231 * palt_k + 75.00346;
    const logCAS = Math.log10(cas);
    const outnum = Math.pow(10, 1.696 * logCAS - 0.446626 * Math.pow(logCAS, 2) + 0.0752139 * Math.pow(logCAS, 3) - 0.72681);

    outerDeg = turnToDegrees(outnum);
    innerDeg = turnToDegrees(inNum);
  } else if (qnum === 6) {
    const cas = parseFloat(casInput.value);
    let tas = tasFromCas(temp, palt, cas);
    tas = Math.round(tas);
    if(!visualize){return [[palt, 4, palt], [tas, 6, tas]]}

    paltInput.value = Math.round(palt);
    paltInput.dataset.solved ="1";
    tasInput.value = tas;
    tasInput.dataset.solved ="1";

    const palt_k = palt / 1000;
    const inNum = 0.00510393 * Math.pow(palt_k, 2) - 1.13231 * palt_k + 75.00346;
    const logCAS = Math.log10(cas);
    const outnum = Math.pow(10, 1.696 * logCAS - 0.446626 * Math.pow(logCAS, 2) + 0.0752139 * Math.pow(logCAS, 3) - 0.72681);

    outerDeg = turnToDegrees(outnum);
    innerDeg = turnToDegrees(inNum);
  } else {
    if(!visualize){return}
    outerDeg = 0;
    innerDeg = 0;
  }
  
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
}

function solvePreflight(visualize = true) {
  removeDots();
  const rows = document.querySelectorAll("tbody tr");

  const tc = parseFloat(rows[0].cells[2].querySelector("input").value);
  const tas = parseFloat(rows[1].cells[2].querySelector("input").value);
  const dir = parseFloat(rows[2].cells[2].querySelector("input").value);
  let kts = parseFloat(rows[4].cells[2].querySelector("input").value);

  const xw = kts * Math.sin((dir - tc) * Math.PI / 180);
  const rawCaDeg = 180 / Math.PI * Math.asin(xw / tas);
  const ca = Math.round(rawCaDeg * Math.sign(rawCaDeg) * Math.sign(xw));

  const th = tc + ca;
  const hwtw = Math.round(-kts * Math.cos((dir - tc) * Math.PI / 180));
  const gs = tas + hwtw;

  let xwText = "";
  if (Math.round(xw) < 0) xwText = Math.round(-xw) + " L";
  else if (Math.round(xw) > 0) xwText = Math.round(xw) + " R";
  else xwText = "0";

  let caText = "";
  if (ca < 0) caText = -ca + " L";
  else if (ca > 0) caText = ca + " R";
  else caText = "0";

  let hwtwText = "";
  if (hwtw < 0) hwtwText = -hwtw + " H";
  else if (hwtw > 0) hwtwText = hwtw + " T";
  else hwtwText = "0";

  if(!visualize){return [[xw, 5, 100], [ca, 6, 100], [th, 7, 100], [hwtw, 8, 150], [gs, 9, 200]]}
  
  // Flag if wind speed exceeds 60
  if (kts > 60) {
    rows[4].cells[3].textContent = "kts| Use 2x numbers";
  }
  // Write output to rows 5–9 (skip row 3 explanation)
  rows[5].cells[2].querySelector("input").value = xwText;
  rows[6].cells[2].querySelector("input").value = caText;
  rows[7].cells[2].querySelector("input").value = Math.round(th);
  rows[8].cells[2].querySelector("input").value = hwtwText;
  rows[9].cells[2].querySelector("input").value = gs;
  rows[5].cells[2].querySelector("input").dataset.solved = "1";
  rows[6].cells[2].querySelector("input").dataset.solved = "1";
  rows[7].cells[2].querySelector("input").dataset.solved = "1";
  rows[8].cells[2].querySelector("input").dataset.solved = "1";
  rows[9].cells[2].querySelector("input").dataset.solved = "1";

  // Rotated image display
  let arrowDeg = dir - tc;
  if (arrowDeg < 0) arrowDeg += 360;

  let innerDeg = 360 - tc;

  outerDeg = turnToDegrees(tas);

  let xw1 = xw;
  let hwtw1 = hwtw;
  if (kts > 60) {
    kts = kts / 2;
    hwtw1 = hwtw1 / 2;
    xw1 = xw1 / 2;
  }
  const scale = kts / 50;
  
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wind Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wind Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
  const arrowImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Arrow");
  if (arrowImg) {
    arrowImg.style.transform = `translate(-50%, -50%) rotate(${arrowDeg+1}deg) scale(${scale})`;
  }
  const horiImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Hori");
  if (horiImg) {
    horiImg.style.transform = `translate(-50%, -50%) translateY(${2.2*hwtw1}px) scale(${xw1/50})`;
  }
  const vertiImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Verti");
  if (vertiImg) {
    vertiImg.style.transform = `translate(-50%, -50%) translateX(${2.2*xw1}px) scale(${-hwtw1/50})`;
  }
}

function solveInflight(visualize = true) {
  removeDots();
  const rows = document.querySelectorAll("tbody tr");

  const th = parseFloat(rows[0].cells[2].querySelector("input").value);
  const tas = parseFloat(rows[1].cells[2].querySelector("input").value);
  const trk = parseFloat(rows[2].cells[2].querySelector("input").value);
  const gs = parseFloat(rows[4].cells[2].querySelector("input").value);

  let da = trk - th;
  if (Math.abs(da) > 180) {
    da = da - Math.sign(da) * 360;
  }

  let xw = -1 * Math.sin(da * Math.PI / 180) * tas * Math.sign(da) * Math.sign(Math.sin(da * Math.PI / 180) * tas);
  let hwtw = gs - tas;

  let dir = 0;
  if (Math.sign(hwtw) > 0) {
    dir = Math.round((trk - 180) % 360 - Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
  } else {
    dir = Math.round(trk + Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
  }
  if (dir < 0) dir += 360;

  let vel = Math.round(Math.sqrt(xw * xw + hwtw * hwtw));
  let xw1 = xw;
  let hwtw1 = hwtw;

  let xwText = Math.round(xw) < 0 ? `${Math.round(-xw)} L` :
               Math.round(xw) > 0 ? `${Math.round(xw)} R` : "0";

  let daText = Math.round(da);
  daText = daText < 0 ? `${-daText} L` : daText > 0 ? `${daText} R` : "0";

  let hwtwText = Math.round(hwtw);
  hwtwText = hwtwText < 0 ? `${-hwtwText} H` : hwtwText > 0 ? `${hwtwText} T` : "0";

  if(!visualize){return [[da, 5, 100], [xw, 6, 100], [hwtw, 7, 150], [dir, 8, 100], [vel, 9, 200]]}
  if (Math.abs(xw) > 60) rows[6].cells[3].textContent = "kts| Use 2x numbers";

  if (Math.abs(hwtw) > 60) rows[7].cells[3].textContent = "kts| Use 2x numbers";
  // Output to rows[5]–[9]
  rows[5].cells[2].querySelector("input").value = daText;
  rows[6].cells[2].querySelector("input").value = xwText;
  rows[7].cells[2].querySelector("input").value = hwtwText;
  rows[8].cells[2].querySelector("input").value = dir;
  rows[9].cells[2].querySelector("input").value = vel;
  rows[5].cells[2].querySelector("input").dataset.solved = "1";
  rows[6].cells[2].querySelector("input").dataset.solved = "1";
  rows[7].cells[2].querySelector("input").dataset.solved = "1";
  rows[8].cells[2].querySelector("input").dataset.solved = "1";
  rows[9].cells[2].querySelector("input").dataset.solved = "1";

  // Rotation logic
  const innerDeg = 360 - trk;
  let arrowDeg = dir-trk;
  if (arrowDeg < 0){arrowDeg=arrowDeg+360}
  outerDeg = turnToDegrees(tas);

  if (vel > 60) {
    vel /= 2;
    hwtw1 /= 2;
    xw1 /= 2;
  }
  const scale = vel / 50;
  
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wind Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  const backImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Back Wind Wheel");
  if (backImg) {
    backImg.style.transform = `translate(-50%, -50%) rotate(${outerDeg}deg)`;
  }
  const arrowImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Arrow");
  if (arrowImg) {
    arrowImg.style.transform = `translate(-50%, -50%) rotate(${arrowDeg+1}deg) scale(${scale})`;
  }
  const horiImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Hori");
  if (horiImg) {
    horiImg.style.transform = `translate(-50%, -50%) translateY(${2.2*hwtw1}px) scale(${xw1/50})`;
  }
  const vertiImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Verti");
  if (vertiImg) {
    vertiImg.style.transform = `translate(-50%, -50%) translateX(${2.2*xw1}px) scale(${-hwtw1/50})`;
  }
}

function solveLollipop(visualize = true) {
  removeArrows();
  const rows = document.querySelectorAll("tbody tr");

  let t1Raw = rows[0].cells[2].querySelector("input").value;
  let r1 = parseFloat(rows[1].cells[2].querySelector("input").value);
  let t2 = parseFloat(rows[2].cells[2].querySelector("input").value);
  let r2 = parseFloat(rows[4].cells[2].querySelector("input").value);

  let t1 = 0;
  if (t1Raw.includes("TO")) {
    t1 = Number(t1Raw.match(/\d+/g).join("")) - 180;
  } else {
    t1 = Number(t1Raw.match(/\d+/g).join(""));
  }
  if (t1 < 0) t1 += 360;

  const x1 = r1 * Math.cos(t1 * Math.PI / 180);
  const y1 = r1 * Math.sin(-t1 * Math.PI / 180);
  const x2 = r2 * Math.cos(t2 * Math.PI / 180);
  const y2 = r2 * Math.sin(-t2 * Math.PI / 180);

  const r3 = Math.round(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
  let t3 = Math.round(Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI);
  if ((x2 - x1) < 0) t3 -= 180;
  if (t3 < 0) t3 += 360;
  t3 = 360 - t3;

  let innerDeg = 360 - t3;

  
  if(!visualize){return [[t3, 5, 100], [r3, 6, 100]]}
  // Output
  rows[5].cells[2].querySelector("input").value = t3;
  rows[6].cells[2].querySelector("input").value = r3;
  rows[5].cells[2].querySelector("input").dataset.solved = "1";
  rows[6].cells[2].querySelector("input").dataset.solved = "1";

  // Scale and rotation logic
  let scale = (r1 > 70 || r2 > 70) ? 0.5 : 1;
  
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Front Wind Wheel");
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) rotate(${innerDeg}deg)`;
  }
  insertDot(r2, t2, t3, "Target", scale);
  insertDot(r1, t1, t3, "Dot", scale);
}

function solveTime(visualize = true) {
  const rows = document.querySelectorAll("tbody tr");
  let duration = rows[0].cells[2].querySelector("input").value;
  const [hours, minutes] = duration.split("+").map(Number);
  let zd = parseFloat(rows[1].cells[2].querySelector("input").value);
  let zd2 =  parseFloat(rows[2].cells[2].querySelector("input").value);
  let time1 = 0
  let zulutime = 0
  let time2 = 0
  let zulutime2 = 0
  if(rows[4].cells[2].querySelector("input").value !=""){
    time1 = rows[4].cells[2].querySelector("input").value
    zulutime = zuluLocal(time1, zd)
    let mins2 = zulutime%100 + minutes;
    let hrs2 = Math.floor(zulutime/100)+hours+Math.floor(mins2/60);
    zulutime2 = (hrs2*100+mins2%60)%2400;
    time2 = zuluLocal(zulutime2, -zd2);
  }else if(rows[5].cells[2].querySelector("input").value !=""){
    zulutime = rows[5].cells[2].querySelector("input").value
    time1  = zuluLocal(zulutime, -zd);
    let mins2 = zulutime%100 + minutes;
    let hrs2 = Math.floor(zulutime/100)+hours+Math.floor(mins2/60);
    zulutime2 = (hrs2*100+mins2%60)%2400;
    time2  = zuluLocal(zulutime2, -zd2);
  } else if(rows[6].cells[2].querySelector("input").value !=""){
    zulutime2 = rows[6].cells[2].querySelector("input").value
    time2 = zuluLocal(zulutime2, -zd2);
    let mins2 = zulutime2%100 - minutes;
    let hrs = 0;
    if(mins2<0){
      hrs = -1;
      mins2 += 60;
    }
    let hrs2 = Math.floor(zulutime2/100)-hours+hrs;
    if(hrs2<0){hrs2+=24};
    zulutime = (hrs2*100+mins2%60)%2400;
    time1 = zuluLocal(zulutime, -zd)
  }else if(rows[7].cells[2].querySelector("input").value !=""){
    time2 = rows[7].cells[2].querySelector("input").value
    zulutime2 = zuluLocal(time2, zd2)
    let mins2 = zulutime2%100 - minutes;
    let hrs = 0;
    if(mins2<0){
      hrs = -1;
      mins2 += 60;
    }
    let hrs2 = Math.floor(zulutime2/100)-hours+hrs;
    if(hrs2<0){hrs2+=24};
    zulutime = (hrs2*100+mins2%60)%2400;
    time1 = zuluLocal(zulutime, -zd);
  }

  if(!visualize){return [[time1, 4, 50], [zulutime, 5, 50], [zulutime2, 6, 50], [time2, 7, 50]]}
  rows[4].cells[2].querySelector("input").value = time1.toString().padStart(4, "0");
  rows[5].cells[2].querySelector("input").value = zulutime.toString().padStart(4, "0");
  rows[6].cells[2].querySelector("input").value = zulutime2.toString().padStart(4, "0");
  rows[7].cells[2].querySelector("input").value = time2.toString().padStart(4, "0");
  rows[4].cells[2].querySelector("input").dataset.solved = "1";
  rows[5].cells[2].querySelector("input").dataset.solved = "1";
  rows[6].cells[2].querySelector("input").dataset.solved = "1";
  rows[7].cells[2].querySelector("input").dataset.solved = "1";

  document.getElementById("depZD").textContent = "("+rows[1].cells[2].querySelector("input").value+")";
  document.getElementById("ete").textContent = rows[0].cells[2].querySelector("input").value;
  document.getElementById("destZD").textContent = "("+rows[2].cells[2].querySelector("input").value+")";
  document.getElementById("depLocal").textContent = rows[4].cells[2].querySelector("input").value+ " " + rows[4].cells[3].textContent;
  document.getElementById("depZulu").textContent = rows[5].cells[2].querySelector("input").value+ " " + rows[5].cells[3].textContent;
  document.getElementById("destLocal").textContent = rows[7].cells[2].querySelector("input").value+ " " + rows[5].cells[3].textContent;
  document.getElementById("destZulu").textContent = rows[6].cells[2].querySelector("input").value+ " " + rows[6].cells[3].textContent;
}

function checkWork(){
    const rows = document.querySelectorAll("tbody tr");
    let solutions = solve(false);
    console.log(solutions)
    if(solutions === null || !solutions){return}
    for(i=0; i<solutions.length; i++){
        let solution = solutions[i][0]
        let row = solutions[i][1]
        let denom = solutions[i][2]
        const input = rows[row].cells[2].querySelector("input");
        if(input.dataset.solved == "1"){continue}
        let uSolution = parseFloat(input.value);
        if (/[lLhH]/.test(input.value)) {
            uSolution *= -1;
        }
        if (isNaN(uSolution)) continue;
        let pError;
        if (solution === 0) {
            pError = Math.abs(uSolution) < 0.01 ? 0 : 100; 
        } else {
            pError = Math.abs(100 * (uSolution - solution) / denom);
        }
        input.classList.remove("bg-green", "bg-yellow", "bg-red");
        if (pError <= 2) {
            input.classList.add("bg-green");
        } else if (pError <= 5) {
            input.classList.add("bg-yellow");
        } else {
            input.classList.add("bg-red");
        }
    }
}

function tasFromCas(temp, palt, cas){
  const x1 = 0.000167710133972731;
  const x2 = -0.0483548613736768;
  const x3 = 4.5070725375605;

  let psi = 101325*Math.pow((288.15/(288.15-(6.5/1000)*(palt*0.3048))),(9.80665*28.9644/(8.31432*1000*(-6.5/1000))));
  let qc = 101325*(Math.pow((1+0.2*Math.pow((0.514444444*cas/340.29),2)),(7/2))-1);
  let m = Math.sqrt(5*(Math.pow(qc/psi+1, 2/7)-1));
  let a = Math.sqrt(1.4*287.053*(temp +273.15));
  let tas = -x1*Math.pow(m*a*1.94384,2)+(1-x2)*(m*a*1.94384)-x3;

  return tas; 
}

function casFromTas(temp, palt, tas){
  const x1 = 0.000167710133972731;
  const x2 = -0.0483548613736768;
  const x3 = 4.5070725375605;

  tas = (-(x2-1) - Math.sqrt(Math.pow((x2-1), 2)-4*x1*(x3+0.514444444*tas)))/(2*x1)
  let a = Math.sqrt(1.4*287.053*(temp +273.15));
  let m = tas/a;
  let psi = 101325*Math.pow((288.15/(288.15-(6.5/1000)*(palt*0.3048))),(9.80665*28.9644/(8.31432*1000*(-6.5/1000))));
  let qc = psi*(Math.pow((1+0.2*Math.pow(m,2)),(7/2))-1);
  let cas = 340.29*Math.sqrt(5*(Math.pow(qc/101325+1, 2/7)-1))*1.94384;

  return cas; 
}

function insertDSTWheel() {
  const container = document.getElementById("wheel-container");

  // Check if images are already present
  const hasFront = Array.from(container.children).some(img => img.alt === "Front Wheel");
  const hasBack = Array.from(container.children).some(img => img.alt === "Back Wheel");

  if (hasFront && hasBack) return; // Images already exist

  // Clear any leftover images (if needed)
  container.innerHTML = "";

  // Insert new images
  const backImg = document.createElement("img");
  backImg.src = "images/Back Wheel.png";
  backImg.alt = "Back Wheel";
  backImg.style.width = "500px";
  backImg.style.transform = "translate(-50%, -50%) rotate(-0.1deg)";
  backImg.style.position = "absolute";
  backImg.style.top = "50%";
  backImg.style.left = "50%";

  // Insert front image (rotated 0.5° left)
  const frontImg = document.createElement("img");
  frontImg.src = "images/Front Wheel.png";
  frontImg.alt = "Front Wheel";
  frontImg.style.width = "430px";
  frontImg.style.transform = "translate(-50%, -50%) rotate(-0.5deg)";
  frontImg.style.position = "absolute";
  frontImg.style.top = "50%";

  container.appendChild(backImg);
  container.appendChild(frontImg);
}

function insertWindWheel(){
  const container = document.getElementById("wheel-container");

  // Check if images are already present
  const hasFront = Array.from(container.children).some(img => img.alt === "Front Wind Wheel");
  const hasMiddle = Array.from(container.children).some(img => img.alt === "Middle Wind Wheel");
  const hasBack = Array.from(container.children).some(img => img.alt === "Back Wind Wheel");

  if (hasFront && hasMiddle && hasBack) return; // Images already exist

  // Clear any leftover images (if needed)
  container.innerHTML = "";

  const backImg = document.createElement("img");
  backImg.src = "images/Back Wind Wheel.png";
  backImg.alt = "Back Wind Wheel";
  backImg.style.width = "500px";
  backImg.style.transform = "translate(-50%, -50%) rotate(0.1deg)";
  backImg.style.position = "absolute";
  backImg.style.top = "50%";
  backImg.style.left = "50%";

  const middleImg = document.createElement("img");
  middleImg.src = "images/Middle Wind Wheel.png";
  middleImg.alt = "Middle Wind Wheel";
  middleImg.style.width = "442px";
  middleImg.style.transform = "translate(-50%, -50%)";
  middleImg.style.position = "absolute";
  middleImg.style.top = "50%";

  const frontImg = document.createElement("img");
  frontImg.src = "images/Front Wind Wheel.png";
  frontImg.alt = "Front Wind Wheel";
  frontImg.style.width = "376px";
  frontImg.style.transform = "translate(-50%, -50%)";
  frontImg.style.position = "absolute";
  frontImg.style.top = "50%";

  const arrowImg = document.createElement("img");
  arrowImg.src = "images/arrow.png";
  arrowImg.alt = "Arrow";
  arrowImg.style.width = "500px";
  arrowImg.style.transform = "translate(-50%, -50%) scale(0.01)";
  arrowImg.style.position = "absolute";
  arrowImg.style.top = "50%";
  arrowImg.style.left = "50%";

  const horiImg = document.createElement("img");
  horiImg.src = "images/hori.png";
  horiImg.alt = "Hori";
  horiImg.style.width = "500px";
  horiImg.style.transform = "translate(-50%, -50%) scale(0.01)";
  horiImg.style.position = "absolute";
  horiImg.style.top = "50%";
  horiImg.style.left = "50%";

  const vertiImg = document.createElement("img");
  vertiImg.src = "images/verti.png";
  vertiImg.alt = "Verti";
  vertiImg.style.width = "500px";
  vertiImg.style.transform = "translate(-50%, -50%) scale(0.01)";
  vertiImg.style.position = "absolute";
  vertiImg.style.top = "50%";
  vertiImg.style.left = "50%";

  const dotImg = document.createElement("img");
  dotImg.src = "images/dot.png";
  dotImg.alt = "Dot";
  dotImg.style.width = "500px";
  dotImg.style.transform = "translate(-50%, -50%) scale(0.01)";
  dotImg.style.position = "absolute";
  dotImg.style.top = "50%";
  dotImg.style.left = "50%";

  const targetImg = document.createElement("img");
  targetImg.src = "images/target.png";
  targetImg.alt = "Target";
  targetImg.style.width = "500px";
  targetImg.style.transform = "translate(-50%, -50%) scale(0.01)";
  targetImg.style.position = "absolute";
  targetImg.style.top = "50%";
  targetImg.style.left = "50%";

  container.appendChild(backImg);
  container.appendChild(middleImg);
  container.appendChild(frontImg);
  container.appendChild(arrowImg);
  container.appendChild(horiImg);
  container.appendChild(vertiImg);
  container.appendChild(dotImg);
  container.appendChild(targetImg);
}

function turnToDegrees(input){
  let mid = 360*(Math.log10(input/(Math.pow(10,Math.floor((Math.log10(input))-1))))-1);
  return mid*-1;
}

function insertDot(r1, t1, tref, alt, scale) {
  let t2 = (t1+270-tref)%360;
  if(t2<0){t2 = t2 + 360;}
  t2 = 360 - t2;
  x1 = r1*Math.cos(t2*Math.PI/180)*2.2*scale;
  y1 = -r1*Math.sin(t2*Math.PI/180)*2.2*scale;
  const frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === alt);
  if (frontImg) {
    frontImg.style.transform = `translate(-50%, -50%) translateX(${x1}px) translateY(${y1}px)`;
  }
}

function removeDots(){
  let frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Target");
  if (frontImg) {
    frontImg.style.transform = `scale(0.01)`;
  }
  frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Dot");
  if (frontImg) {
    frontImg.style.transform = `scale(0.01)`;
  }
}

function removeArrows(){
  let frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Arrow");
  if (frontImg) {
    frontImg.style.transform = `scale(0.01)`;
  }
  frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Hori");
  if (frontImg) {
    frontImg.style.transform = `scale(0.01)`;
  }
  frontImg = Array.from(document.getElementById("wheel-container").children)
    .find(img => img.alt === "Verti");
  if (frontImg) {
    frontImg.style.transform = `scale(0.01)`;
  }
}

function insertHat() {
  const rows = document.querySelectorAll("tbody tr");
  const container = document.getElementById("wheel-container");

  // Remove everything else first (optional, based on your layout logic)
  container.innerHTML = "";

  // Add the hat image
  const hatImg = document.createElement("img");
  hatImg.src = "images/bottomhat.png";
  hatImg.id = "hat-image";
  hatImg.alt = "Hat";
  hatImg.style.position = "absolute";
  hatImg.style.top = "100px";
  hatImg.style.left = "300px";
  hatImg.style.width = "500px"; 
  hatImg.style.zIndex = "1";

  container.appendChild(hatImg);

  // Add interactive text inputs
  const fields = [
    { id: "depLocal", top: "10px", left: "75px", placeholder: rows[4].cells[2].querySelector("input").value + " " + rows[4].cells[3].textContent},
    { id: "depZD", top: "40px", left: "100px", placeholder: "("+rows[1].cells[2].querySelector("input").value+")"},
    { id: "depZulu", top: "165px", left: "75px", placeholder: rows[5].cells[2].querySelector("input").value + " " + rows[5].cells[3].textContent},
    { id: "ete", top: "165px", left: "250px", placeholder: rows[0].cells[2].querySelector("input").value},
    { id: "destLocal", top: "10px", left: "425px", placeholder: rows[7].cells[2].querySelector("input").value + " " + rows[7].cells[3].textContent},
    { id: "destZD", top: "40px", left: "400px", placeholder: "("+rows[2].cells[2].querySelector("input").value+")"},
    { id: "destZulu", top: "165px", left: "425px", placeholder: rows[6].cells[2].querySelector("input").value + " " + rows[6].cells[3].textContent},
  ];

  fields.forEach(({ id, top, left, placeholder }) => {
  const text = document.createElement("div");
  text.id = id;
  text.className = "hat-label";
  text.textContent = placeholder; // Or use empty string if you want it blank initially
  text.style.position = "absolute";
  text.style.top = top;
  text.style.left = left;
  text.style.width = "90px";
  text.style.padding = "4px";
  text.style.textAlign = "center";
  text.style.borderRadius = "4px";
  text.style.zIndex = "0";
  container.appendChild(text);
  });
}

function zuluLocal(time, zd){
  let zulutime = ((Math.floor(time/100) - zd)%24);
  if(zulutime<0){zulutime+=24;}
  zulutime = zulutime*100+time%100
  return zulutime
}