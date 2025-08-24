let xMode = false;
let originalTableHTML;
let currentId = null;
let hintStage = 0;
window.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("table");
  originalTableHTML = table.innerHTML;
  attachEditListeners();
});

document.getElementById("autoGougeBtn").addEventListener("click", autoGougeJetLog);
document.getElementById("resetBtn").addEventListener("click", resetJetLogTable);
document.getElementById("checkBtn").addEventListener("click", () => {checkWork();});
document.getElementById("solveNextBtn").addEventListener("click", () => {solveNextCell()});
document.getElementById("solveRowBtn").addEventListener("click", () => {solveNextRow()});
document.getElementById("solveAllBtn").addEventListener("click", () => {solveAll()});

// Toggle X-Mode on button click
document.getElementById("toggleXModeBtn").addEventListener("click", () => {
  xMode = !xMode;
  document.getElementById("toggleXModeBtn").textContent = xMode ? "Exit X-Mode" : "Enter X-Mode";

  document.querySelectorAll("td").forEach(cell => {
    cell.style.cursor = xMode ? "pointer" : "default";
  });
});

// Click to toggle X
document.addEventListener("click", (e) => {
  if (!xMode) return;

  const td = e.target.closest("td");
  if (!td) return;

  const isXed = td.classList.contains("xcell");

  if (isXed) {
    // Remove X and restore input
    td.classList.remove("xcell");
    const value = td.dataset.original || "";
    td.innerHTML = `<input value="${value}">`;
  } else {
    // Add X and store input value
    const input = td.querySelector("input");
    if (input) {
      td.dataset.original = input.value;
      td.innerHTML = "";
      td.classList.add("xcell");
    }
  }
  attachEditListeners();
});

//Hint Button
document.getElementById("hintBtn").addEventListener("click", () => {
  const nextId = findNextSolvableCell();
  if (!nextId) return;

  const inputs = cellGraph[nextId].dependsOn;

  if (hintStage === 0) {
    // Stage 1: Glow the unsolved cell in blue
    removeGlowFromAllCells() 
    makeCellGlow(nextId, "blue");
    document.getElementById("hintBtn").innerHTML = "Another<br>Hint";
    hintStage = 1;
  } else {
    // Stage 2: Glow the input cells in green
    inputs.forEach(inputId => makeCellGlow(inputId, "green"));
    document.getElementById("hintBtn").innerHTML = "Hint";
    hintStage = 0;
  }
});

function attachEditListeners() {
  const inputs = document.querySelectorAll("td input");
  
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const td = input.closest("td");
      if (td?.id && cellGraph[td.id]) {
        cellGraph[td.id].solved = false;
        removeGlowFromAllCells() 
      }
    });
  });
}

function autoGougeJetLog() {
  const rows = document.querySelectorAll("tbody tr");
  removeGlowFromAllCells()
  const matrix = [
    [0, 1, 1, 1, 1, 1, 1, 1, "FF: ", "TAS: "],
    [1, 0, 0, "PRE-FLIGHT WINDS: "],
    [0, 1, 0, 0, 0, 0, 0, 0, "HW/TW: ", "GS: "],
    [1, 0, 0, 1, 1, "XW: ", "CA: ", "TH: "],
    ["TAKEOFF", 1, 1, 1, 1, 1, 1, 1, "FF: ", "TAS: "],
    [1, 0, 0, "IN-FLIGHT WINDS: "],
    [0, 1, 0, 0, 0, 1, 0, 1, "HW/TW: ", "GS: "],
    [1, "      TRK", 0, 0, 0, "XW: ", "DA: ", "TH: "],
    [0, 1, 0, 0, 0, 0, 0, 0, "HW/TW: ", "GS: "],
    [1, 0, 0, 1, 1, "XW: ", "CA: ", "TH: "],
];

  rows.forEach((tr, rowIndex) => {
    const cells = tr.querySelectorAll("td");
    cells.forEach((td, colIndex) => {
      const val = matrix[rowIndex]?.[colIndex];

      if (val === 1) {
        const input = td.querySelector("input");
        if (input) {
          td.dataset.original = input.value;
          td.innerHTML = "";
        }
        td.classList.add("xcell");
      } else if (typeof val === "string") {
        td.classList.remove("xcell");
        const value = td.dataset.original || "";
        td.innerHTML = `<input value="${value}">`;
        const input = td.querySelector("input");
        if (input) {
          input.value = val;
        } else {
          td.textContent = val;
        }
      } else {
        td.classList.remove("xcell");
        const value = td.dataset.original || "";
        td.innerHTML = `<input value="${value}">`;
      }
    });
  });
  attachEditListeners();
}

function resetJetLogTable() {
  const table = document.querySelector("table");
  if (originalTableHTML) {
    table.innerHTML = originalTableHTML;
  }
  attachEditListeners();
}

const cellGraph = {
  "r0c8": {dependsOn: [], solver: () => givenF(), next: "r0c9", solved: false, denominator: null},
  "r0c9": {dependsOn: [], solver: () => givenF(), next: "r1c1", solved: false, denominator: null},
  "r1c1": {dependsOn: [], solver: () => givenF(), next: "r1c2", solved: false, denominator: null},
  "r1c2": {dependsOn: [], solver: () => givenF(), next: "r1c3", solved: false, denominator: null},
  "r1c3": {dependsOn: [], solver: () => givenF(), next: "r2c2", solved: false, denominator: null},
  "r2c2": {dependsOn: [], solver: () => givenF(), next: "r2c3", solved: false, denominator: null},
  "r2c3": {dependsOn: [], solver: () => givenF(), next: "r2c8", solved: false, denominator: null},
  "r2c8": {dependsOn: ["r1c3", "r2c2"], solver: ([winds, course]) => hwtwF(winds, course), next: "r3c5", solved: false, denominator: 150},
  "r3c5": {dependsOn: ["r1c3", "r2c2"], solver: ([winds, course]) => xwF(winds, course), next: "r2c9", solved: false, denominator: 100},
  "r2c9": {dependsOn: ["r0c9", "r2c8"], solver: ([tas, hwtw]) => gsF(tas, hwtw), next: "r3c6", solved: false, denominator: 200},
  "r3c6": {dependsOn: ["r0c9", "r3c5"], solver: ([tas, xw]) => caF(tas, xw), next: "r3c7", solved: false, denominator: 100},
  "r3c7": {dependsOn: ["r2c2", "r3c6"], solver: ([course, ca]) => thF(course, ca), next: "r2c4", solved: false, denominator: 100},
  "r2c4": {dependsOn: ["r2c9", "r2c3"], solver: ([gs, dist]) => eteF(gs, dist), next: "r3c2", solved: false, denominator: 100},
  "r3c2": {dependsOn: ["r2c4"], solver: ([ete]) => altEteF(ete), next: "r2c5", solved: false, denominator: null},
  "r2c5": {dependsOn: ["r1c1", "r2c4"], solver: ([ata, ete]) => etaF(ata, ete), next: "r2c6", solved: false, denominator: null},
  "r2c6": {dependsOn: ["r0c8", "r2c4"], solver: ([pph, ete]) => fuelF(pph, ete), next: "r2c7", solved: false, denominator: 200},
  "r2c7": {dependsOn: ["r1c2", "r2c6"], solver: ([afr, fuel]) => efrF(afr, fuel), next: "r4c8", solved: false, denominator: 200},
  "r4c8": {dependsOn: [], solver: () => givenF(), next: "r4c9", solved: false, denominator: null},
  "r4c9": {dependsOn: [], solver: () => givenF(), next: "r5c1", solved: false, denominator: null},
  "r5c1": {dependsOn: [], solver: () => givenF(), next: "r5c2", solved: false, denominator: null},
  "r5c2": {dependsOn: [], solver: () => givenF(), next: "r6c4", solved: false, denominator: null},
  "r6c4": {dependsOn: [], solver: () => givenF(), next: "r7c2", solved: false, denominator: null},
  "r7c2": {dependsOn: ["r6c4"], solver: ([ete]) => altEteF(ete), next: "r7c3", solved: false, denominator: null},
  "r7c3": {dependsOn: ["r5c1", "r6c4"], solver: ([ata, ete]) => etaF(ata, ete), next: "r6c2", solved: false, denominator: null},
  "r6c2": {dependsOn: [], solver: () => givenF(), next: "r6c3", solved: false, denominator: null},
  "r6c3": {dependsOn: [], solver: () => givenF(), next: "r7c7", solved: false, denominator: null},
  "r7c7": {dependsOn: ["r3c7"], solver: ([th]) => iThF(th), next: "r7c6", solved: false, denominator: 2},
  "r7c6": {dependsOn: ["r6c2", "r7c7"], solver: ([course, th]) => daF(course, th), next: "r6c9", solved: false, denominator: 100},
  "r6c9": {dependsOn: ["r6c4", "r6c3"], solver: ([ete, dist]) => iGsF(ete, dist), next: "r7c5", solved: false, denominator: 20},
  "r7c5": {dependsOn: ["r4c9", "r7c6"], solver: ([tas, da]) => iXwF(tas, da), next: "r6c8", solved: false, denominator: 100},
  "r6c8": {dependsOn: ["r4c9", "r6c9"], solver: ([tas, gs]) => iHwtwF(tas, gs), next: "r5c3", solved: false, denominator: 150},
  "r5c3": {dependsOn: ["r7c5", "r6c8"], solver: ([xw, hwtw]) => inflightF(xw,hwtw), next: "r6c6", solved: false, denominator: null},
  "r6c6": {dependsOn: ["r4c8", "r6c4"], solver: ([pph, ete]) => fuelF(pph, ete), next: "r7c4", solved: false, denominator: 200},
  "r7c4": {dependsOn: ["r5c2", "r6c6"], solver: ([afr, fuel]) => efrF(afr,fuel), next: "r8c2", solved: false, denominator: 200},
  "r8c2": {dependsOn: [], solver: () => givenF(), next: "r8c3", solved: false, denominator: null},
  "r8c3": {dependsOn: [], solver: () => givenF(), next: "r8c8", solved: false, denominator: null},
  "r8c8": {dependsOn: ["r5c3", "r8c2"], solver: ([winds, course]) => hwtwF(winds, course), next: "r9c5", solved: false, denominator: 150},
  "r9c5": {dependsOn: ["r5c3", "r8c2"], solver: ([winds, course]) => xwF(winds, course), next: "r8c9", solved: false, denominator: 100},
  "r8c9": {dependsOn: ["r4c9", "r8c8"], solver: ([tas, hwtw]) => gsF(tas, hwtw), next: "r9c6", solved: false, denominator: 200},
  "r9c6": {dependsOn: ["r4c9", "r9c5"], solver: ([tas, xw]) => caF(tas, xw), next: "r9c7", solved: false, denominator: 100},
  "r9c7": {dependsOn: ["r8c2", "r9c6"], solver: ([course, ca]) => thF(course, ca), next: "r8c4", solved: false, denominator: 100},
  "r8c4": {dependsOn: ["r8c9", "r8c3"], solver: ([gs, dist]) => eteF(gs, dist), next: "r9c2", solved: false, denominator: 100},
  "r9c2": {dependsOn: ["r8c4"], solver: ([ete]) => altEteF(ete), next: "r8c5", solved: false, denominator: null},
  "r8c5": {dependsOn: ["r7c3", "r8c4"], solver: ([ata, ete]) => etaF(ata, ete), next: "r8c6", solved: false, denominator: null},
  "r8c6": {dependsOn: ["r4c8", "r8c4"], solver: ([pph, ete]) => fuelF(pph, ete), next: "r8c7", solved: false, denominator: 200},
  "r8c7": {dependsOn: ["r7c4", "r8c6"], solver: ([afr, fuel]) => efrF(afr, fuel), next: null, solved: false, denominator: 200}
};

function isFilled(cellId) {
  const input = getInputValue(cellId);
  return /\d/.test(input);
}

function getInputValue(cellId) {
  const cell = document.getElementById(cellId);
  const input = cell?.querySelector("input");
  const value = input?.value ?? "";
  const match = value.match(/\d+(\.\d+)?[\dA-Za-z\s:\/\-]*/);

  return match ? match[0].trim() : "";
}

function setInputValue(cellId, value) {
  const cell = document.getElementById(cellId);
  const input = cell?.querySelector("input");
  if (input) {
    const original = input.value ?? "";
    const match = original.match(/^(.*?)(-?\d[\d\s\S]*)?$/);
    const prefix = match ? match[1] : "";

    input.value = prefix + value;
  }
}

function getRowIndex(cellId) {
  return parseInt(cellId.match(/^r(\d+)c\d+$/)?.[1], 10);
}

function findNextSolvableCell(startId = "r0c8") {
  currentId = startId;
  while (currentId) {
    const cell = cellGraph[currentId];
    if (!cell) break;
    if (cell.solved || isFilled(currentId)) {
      currentId = cell.next;
      continue;
    }
    return currentId;
  }
  return null; // All done
}

function solveNextCell() {
  removeGlowFromAllCells()
  currentId = findNextSolvableCell()
  while (currentId) {
    const cell = cellGraph[findNextSolvableCell(currentId)];
    const inputs = cell.dependsOn.map(getInputValue);
    const result = cell.solver(inputs);
    if (result === null){return null}
    setInputValue(currentId, result);
    cell.solved = true;
    return { solved: currentId, next: cell.next };
  }

  return null; // Nothing left to solve
}

function solveNextRow() {
  let {solved, next} = solveNextCell() || {};
  if (!solved || !next) return;

  while (next) {
    const baseRow = getRowIndex(solved);
    const row = getRowIndex(next);
    if (row > baseRow && row % 2 === 0) break;

    const result = solveNextCell(next);
    if (!result) break;

    ({ solved, next } = result);
  }
}

function solveAll() {
  let result = solveNextCell();
  while (result && result.next) {
    result = solveNextCell();
  }
}

function extractNumbers(ansRaw) {
  // Special case for formats like "330/28"
  if (String(ansRaw).includes("/")) {
    return ansRaw.split("/").map(s => parseFloat(s)).filter(n => !isNaN(n));
  }

  // Fallback: extract first number only
  const match = String(ansRaw).match(/-?\d+(\.\d+)?/);
  return match ? [parseFloat(match[0])] : [];
}

function checkWork(){
  removeGlowFromAllCells()
  let checkId = "r0c8";
  while (checkId) {
    const cell = cellGraph[checkId];
    if (!cell) break;
    if (!cell.solved && !isFilled(checkId)) {
      break
    }
    if (cell.solved) {
      checkId = cell.next;
      continue
    }
    if (cell.denominator === null) {
      checkId = cell.next;
      continue
    }
    const inputs = cell.dependsOn.map(getInputValue);
    const result = extractNumbers(cell.solver(inputs));
    ansList = extractNumbers(getInputValue(checkId));
    let maxpercent = 0;
    if (result.length > 1) {
        for (let i = 0; i < result.length; i++) {
            let expected = result[i];
            let actual = ansList[i];
            let diff = Math.abs(actual - expected);
            let percent = 0
            if (i===0){percent = diff}else{percent = (diff)*2;}
            if(percent > maxpercent) maxpercent = percent;
        }
    } else {
        const expected = result[0];
        const actual = ansList[0];
        const diff = Math.abs(actual - expected);
        maxpercent = (diff / cell.denominator) * 100;
    }
    console.log(result, ansList)
    console.log(maxpercent);
    if (maxpercent <= 2) {
      makeCellGlow(checkId, "green");
    } else if (maxpercent <= 10) {
      makeCellGlow(checkId, "yellow");
    } else {
      makeCellGlow(checkId, "red");
    }
    checkId = cell.next;
  }
}

const glowColorMap = {
  yellow: {
    start: '#fff9c7',
    mid: '#fff36b',
    end: '#fff9c7'
  },
  red: {
    start: '#fac7c7ff',
    mid: '#ffaaaa',
    end: '#fac7c7ff'
  },
  blue: {
    start: '#c7d7fa',
    mid: '#6b95ff',
    end: '#c7d7fa'
  },
  green: {
    start: '#c7fada',
    mid: '#6bff95',
    end: '#c7fada'
  }
};

function makeCellGlow(cellId, colorName) {
  const cell = document.getElementById(cellId);
  const colors = glowColorMap[colorName];

  if (cell && colors) {
    // Set glow colors dynamically
    cell.style.setProperty('--glow-start', colors.start);
    cell.style.setProperty('--glow-mid', colors.mid);
    cell.style.setProperty('--glow-end', colors.end);

    // Apply glow class
    cell.classList.add("glow");
  }
}

function removeGlowFromAllCells() {
  const allInputs = document.querySelectorAll("td");

  allInputs.forEach(input => {
    input.classList.remove("glow");
  });
}

function givenF(){
    if(isFilled(currentId)){
        return "";
    }
    else{
        makeCellGlow(currentId, "red")
        return null
    }
}

function hwtwF(winds, course){
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const windMatch = winds.match(/(\d{1,3})\s*\/\s*(\d{1,3})/);
    if(!windMatch){
        alert("Invalid Wind input! Must be dir/kts format");
        return null
    }
    const dir = parseFloat(windMatch[1]);
    const kts = parseFloat(windMatch[2]);
    const hwtw = Math.round(-kts * Math.cos((dir - tc) * Math.PI / 180));
    let hwtwText = "";
    if (hwtw < 0) hwtwText = -hwtw + "H";
    else if (hwtw > 0) hwtwText = hwtw + "T";
    else hwtwText = "0";
    return hwtwText
}

function xwF(winds, course){
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const windMatch = winds.match(/(\d{1,3})\s*\/\s*(\d{1,3})/);
    if(!windMatch){
        alert("Invalid Wind input! Must be dir/kts format");
        return null
    }
    const dir = parseFloat(windMatch[1]);
    const kts = parseFloat(windMatch[2]);
    const xw = kts * Math.sin((dir - tc) * Math.PI / 180);
    let xwText = "";
    if (Math.round(xw) < 0) xwText = Math.round(-xw) + "L";
    else if (Math.round(xw) > 0) xwText = Math.round(xw) + "R";
    else xwText = "0";
    return xwText
}

function gsF(tas, hwtw){
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = hwtw.match(/(-?\d+)(?:\s*\w+)?\s*([HT])/i);
    if(!match){
        alert("Invalid HWTW input! Must be 'kts T' or 'kts H' format");
        return null
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    hwtw =  direction === "H" ? -Math.abs(value) : Math.abs(value);
    const gs = tas + hwtw;
    return gs +"kts"
}

function caF(tas, xw){
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = xw.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if(!match){
        alert("Invalid XW input! Must be 'kts L' or 'kts R' format");
        return null
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    xw =  direction === "L" ? -Math.abs(value) : Math.abs(value);
    const rawCaDeg = 180 / Math.PI * Math.asin(xw / tas);
    const ca = Math.round(rawCaDeg * Math.sign(rawCaDeg) * Math.sign(xw));
    let caText = "";
    if (ca < 0) caText = -ca + "L";
    else if (ca > 0) caText = ca + "R";
    else caText = "0";
    return caText
}

function thF(course, ca){
    const match = ca.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if(!match){
        alert("Invalid CA input! Must be 'kts L' or 'kts R' format");
        return null
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    ca =  direction === "L" ? -Math.abs(value) : Math.abs(value);
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let th = (tc + ca)%360;
    if (th< 0){th += 360};
    return th +"T"
}

function eteF(gs, dist){
    gs = parseFloat(gs.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    dist = parseFloat(dist.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let ete = Math.round(600*dist/gs)/10;
    return ete
}

function altEteF(ete){
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let hrs = Math.floor(ete/60);
    let mins = Math.floor(ete % 60);
    let secs = Math.round(60*(ete - Math.floor(ete)));
    altText = hrs + "+" + mins + "+" + secs;
    return altText
}

function etaF(ata, ete){
    const match = ata.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match) {
        alert("Invalid ATA format. Must be HH:MM or HH:MM:SS formats");
        return null
    }
    const ahrs = parseInt(match[1], 10);
    const amins = parseInt(match[2], 10);
    const asecs = parseInt(match[3] ?? "0", 10);
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let secs = 60*(ete - Math.floor(ete));
    let mins = Math.floor(ete % 60);
    let hrs = Math.round((Math.floor(ete/60)+ahrs+Math.floor((mins+amins)/60))%24);
    mins = Math.round((mins+amins+Math.floor((secs+asecs)/60))%60);
    secs = Math.round((secs+asecs)%60);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function fuelF(pph, ete){
    pph = parseFloat(pph.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let fuel = Math.round(pph*ete/60); 
    return fuel +"#"
}

function efrF(afr, fuel){
    afr = parseFloat(afr.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    fuel = parseFloat(fuel.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let efr = afr - fuel;
    return efr+"#"
}

function iThF(th){
    return th
}

function daF(course, th){
    trk = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    th = parseFloat(th.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let da = trk - th;
    if (Math.abs(da) > 180) {
        da = da - Math.sign(da) * 360;
    }
    let daText = Math.round(da); 
    daText = daText < 0 ? `${-daText} L` : daText > 0 ? `${daText} R` : "0";
    return daText
}

function iGsF(ete, dist){
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    dist = parseFloat(dist.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let gs = Math.round(dist/(ete/60));
    return gs+"kts";
}

function iXwF(tas, da){
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = da.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if(!match){
        alert("Invalid DA input! Must be 'kts L' or 'kts R' format");
        return null
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    da =  direction === "L" ? -Math.abs(value) : Math.abs(value);
    let xw = -1 * Math.sin(da * Math.PI / 180) * tas * Math.sign(da) * Math.sign(Math.sin(da * Math.PI / 180) * tas);
    xw = Math.round(xw);
    let xwText = Math.round(xw) < 0 ? `${Math.round(-xw)}L` :
               Math.round(xw) > 0 ? `${Math.round(xw)}R` : "0";
    return xwText
}

function iHwtwF(tas, gs){
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    gs = parseFloat(gs.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    hwtw = gs - tas;
    let hwtwText = "";
    if (hwtw < 0) hwtwText = -hwtw + "H";
    else if (hwtw > 0) hwtwText = hwtw + "T";
    else hwtwText = "0kts";
    return hwtwText
}

function inflightF(xw, hwtw){
    const match = xw.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if(!match){
        alert("Invalid XW input! Must be 'kts L' or 'kts R' format");
        return null
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    xw =  direction === "L" ? -Math.abs(value) : Math.abs(value);
    const matchh = hwtw.match(/(-?\d+)(?:\s*\w+)?\s*([HT])/i);
    if(!matchh){
        alert("Invalid HWTW input! Must be 'kts T' or 'kts H' format");
        return null
    }
    const valueh = parseFloat(matchh[1]);
    const directionh = matchh[2].toUpperCase();
    hwtw =  directionh === "H" ? -Math.abs(valueh) : Math.abs(valueh);
    let dir = 0;
    if (Math.sign(hwtw) > 0) {
        dir = Math.round((trk - 180) % 360 - Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
    } else {
        dir = Math.round(trk + Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
    }
    if (dir < 0) dir += 360;

    let vel = Math.round(Math.sqrt(xw * xw + hwtw * hwtw));

    let winds = dir +"/"+ vel+"kts";
    return winds
}