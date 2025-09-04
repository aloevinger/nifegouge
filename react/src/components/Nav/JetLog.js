import React, { useState, useEffect, useRef } from 'react';

function JetLog() {
  const [xMode, setXMode] = useState(false);
  const [hintStage, setHintStage] = useState(0);
  const [currentId, setCurrentId] = useState('r0c8');
  const [cellGraph, setCellGraph] = useState({});
  const [xedCells, setXedCells] = useState(new Set());
  const [inputValues, setInputValues] = useState({});
  const tableRef = useRef(null);

  // Initialize the cell graph with all the solving logic
  useEffect(() => {
    const graph = {
      "r0c8": {dependsOn: [], solver: () => givenF('r0c8'), next: "r0c9", solved: false, denominator: null},
      "r0c9": {dependsOn: [], solver: () => givenF('r0c9'), next: "r1c1", solved: false, denominator: null},
      "r1c1": {dependsOn: [], solver: () => givenF('r1c1'), next: "r1c2", solved: false, denominator: null},
      "r1c2": {dependsOn: [], solver: () => givenF('r1c2'), next: "r1c3", solved: false, denominator: null},
      "r1c3": {dependsOn: [], solver: () => givenF('r1c3'), next: "r2c2", solved: false, denominator: null},
      "r2c2": {dependsOn: [], solver: () => givenF('r2c2'), next: "r2c3", solved: false, denominator: null},
      "r2c3": {dependsOn: [], solver: () => givenF('r2c3'), next: "r2c8", solved: false, denominator: null},
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
      "r4c8": {dependsOn: [], solver: () => givenF('r4c8'), next: "r4c9", solved: false, denominator: null},
      "r4c9": {dependsOn: [], solver: () => givenF('r4c9'), next: "r5c1", solved: false, denominator: null},
      "r5c1": {dependsOn: [], solver: () => givenF('r5c1'), next: "r5c2", solved: false, denominator: null},
      "r5c2": {dependsOn: [], solver: () => givenF('r5c2'), next: "r6c4", solved: false, denominator: null},
      "r6c4": {dependsOn: [], solver: () => givenF('r6c4'), next: "r7c2", solved: false, denominator: null},
      "r7c2": {dependsOn: ["r6c4"], solver: ([ete]) => altEteF(ete), next: "r7c3", solved: false, denominator: null},
      "r7c3": {dependsOn: ["r5c1", "r6c4"], solver: ([ata, ete]) => etaF(ata, ete), next: "r6c2", solved: false, denominator: null},
      "r6c2": {dependsOn: [], solver: () => givenF('r6c2'), next: "r6c3", solved: false, denominator: null},
      "r6c3": {dependsOn: [], solver: () => givenF('r6c3'), next: "r7c7", solved: false, denominator: null},
      "r7c7": {dependsOn: ["r3c7"], solver: ([th]) => iThF(th), next: "r7c6", solved: false, denominator: 2},
      "r7c6": {dependsOn: ["r6c2", "r7c7"], solver: ([course, th]) => daF(course, th), next: "r6c9", solved: false, denominator: 100},
      "r6c9": {dependsOn: ["r6c4", "r6c3"], solver: ([ete, dist]) => iGsF(ete, dist), next: "r7c5", solved: false, denominator: 20},
      "r7c5": {dependsOn: ["r4c9", "r7c6"], solver: ([tas, da]) => iXwF(tas, da), next: "r6c8", solved: false, denominator: 100},
      "r6c8": {dependsOn: ["r4c9", "r6c9"], solver: ([tas, gs]) => iHwtwF(tas, gs), next: "r5c3", solved: false, denominator: 150},
      "r5c3": {dependsOn: ["r7c5", "r6c8"], solver: ([xw, hwtw]) => inflightF(xw, hwtw), next: "r6c6", solved: false, denominator: null},
      "r6c6": {dependsOn: ["r4c8", "r6c4"], solver: ([pph, ete]) => fuelF(pph, ete), next: "r7c4", solved: false, denominator: 200},
      "r7c4": {dependsOn: ["r5c2", "r6c6"], solver: ([afr, fuel]) => efrF(afr, fuel), next: "r8c2", solved: false, denominator: 200},
      "r8c2": {dependsOn: [], solver: () => givenF('r8c2'), next: "r8c3", solved: false, denominator: null},
      "r8c3": {dependsOn: [], solver: () => givenF('r8c3'), next: "r8c8", solved: false, denominator: null},
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
    setCellGraph(graph);
  }, []);

  // Helper functions
  const isFilled = (cellId) => {
    const input = getInputValue(cellId);
    return /\d/.test(input);
  };

  const getInputValue = (cellId) => {
    const value = inputValues[cellId] || "";
    const match = value.match(/\d+(\.\d+)?[\dA-Za-z\s:\/\-]*/);
    return match ? match[0].trim() : "";
  };

  const setInputValue = (cellId, value) => {
    const original = inputValues[cellId] || "";
    const match = original.match(/^(.*?)(-?\d[\d\s\S]*)?$/);
    const prefix = match ? match[1] : "";
    setInputValues(prev => ({ ...prev, [cellId]: prefix + value }));
  };

  const getRowIndex = (cellId) => {
    return parseInt(cellId.match(/^r(\d+)c\d+$/)?.[1], 10);
  };

  const removeGlowFromAllCells = () => {
    document.querySelectorAll("td").forEach(cell => {
      cell.classList.remove("glow");
    });
  };

  const makeCellGlow = (cellId, colorName) => {
    const cell = document.getElementById(cellId);
    const colors = {
      yellow: { start: '#fff9c7', mid: '#fff36b', end: '#fff9c7' },
      red: { start: '#fac7c7ff', mid: '#ffaaaa', end: '#fac7c7ff' },
      blue: { start: '#c7d7fa', mid: '#6b95ff', end: '#c7d7fa' },
      green: { start: '#c7fada', mid: '#6bff95', end: '#c7fada' }
    };

    if (cell && colors[colorName]) {
      cell.style.setProperty('--glow-start', colors[colorName].start);
      cell.style.setProperty('--glow-mid', colors[colorName].mid);
      cell.style.setProperty('--glow-end', colors[colorName].end);
      cell.classList.add("glow");
    }
  };

  // Handler for input changes
  const handleInputChange = (cellId, value) => {
    setInputValues(prev => ({ ...prev, [cellId]: value }));
    setCellGraph(prev => {
      if (prev[cellId]) {
        return {
          ...prev,
          [cellId]: { ...prev[cellId], solved: false }
        };
      }
      return prev;
    });
    removeGlowFromAllCells();
  };

  // Solver functions
  const givenF = (cellId) => {
    if (isFilled(cellId)) {
      return "";
    } else {
      makeCellGlow(cellId, "red");
      return null;
    }
  };

  const hwtwF = (winds, course) => {
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const windMatch = winds.match(/(\d{1,3})\s*\/\s*(\d{1,3})/);
    if (!windMatch) {
      alert("Invalid Wind input! Must be dir/kts format");
      return null;
    }
    const dir = parseFloat(windMatch[1]);
    const kts = parseFloat(windMatch[2]);
    const hwtw = Math.round(-kts * Math.cos((dir - tc) * Math.PI / 180));
    if (hwtw < 0) return -hwtw + "H";
    else if (hwtw > 0) return hwtw + "T";
    else return "0";
  };

  const xwF = (winds, course) => {
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const windMatch = winds.match(/(\d{1,3})\s*\/\s*(\d{1,3})/);
    if (!windMatch) {
      alert("Invalid Wind input! Must be dir/kts format");
      return null;
    }
    const dir = parseFloat(windMatch[1]);
    const kts = parseFloat(windMatch[2]);
    const xw = kts * Math.sin((dir - tc) * Math.PI / 180);
    if (Math.round(xw) < 0) return Math.round(-xw) + "L";
    else if (Math.round(xw) > 0) return Math.round(xw) + "R";
    else return "0";
  };

  const gsF = (tas, hwtw) => {
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = hwtw.match(/(-?\d+)(?:\s*\w+)?\s*([HT])/i);
    if (!match) {
      alert("Invalid HWTW input! Must be 'kts T' or 'kts H' format");
      return null;
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    hwtw = direction === "H" ? -Math.abs(value) : Math.abs(value);
    const gs = tas + hwtw;
    return gs + "kts";
  };

  const caF = (tas, xw) => {
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = xw.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if (!match) {
      alert("Invalid XW input! Must be 'kts L' or 'kts R' format");
      return null;
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    xw = direction === "L" ? -Math.abs(value) : Math.abs(value);
    const rawCaDeg = 180 / Math.PI * Math.asin(xw / tas);
    const ca = Math.round(rawCaDeg * Math.sign(rawCaDeg) * Math.sign(xw));
    if (ca < 0) return -ca + "L";
    else if (ca > 0) return ca + "R";
    else return "0";
  };

  const thF = (course, ca) => {
    const match = ca.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if (!match) {
      alert("Invalid CA input! Must be 'deg L' or 'deg R' format");
      return null;
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    ca = direction === "L" ? -Math.abs(value) : Math.abs(value);
    const tc = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let th = (tc + ca) % 360;
    if (th < 0) th += 360;
    return th + "T";
  };

  const eteF = (gs, dist) => {
    gs = parseFloat(gs.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    dist = parseFloat(dist.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let ete = Math.round(600 * dist / gs) / 10;
    return ete;
  };

  const altEteF = (ete) => {
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let hrs = Math.floor(ete / 60);
    let mins = Math.floor(ete % 60);
    let secs = Math.round(60 * (ete - Math.floor(ete)));
    return hrs + "+" + mins + "+" + secs;
  };

  const etaF = (ata, ete) => {
    const match = ata.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match) {
      alert("Invalid ATA format. Must be HH:MM or HH:MM:SS formats");
      return null;
    }
    const ahrs = parseInt(match[1], 10);
    const amins = parseInt(match[2], 10);
    const asecs = parseInt(match[3] ?? "0", 10);
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let secs = 60 * (ete - Math.floor(ete));
    let mins = Math.floor(ete % 60);
    let hrs = Math.round((Math.floor(ete / 60) + ahrs + Math.floor((mins + amins) / 60)) % 24);
    mins = Math.round((mins + amins + Math.floor((secs + asecs) / 60)) % 60);
    secs = Math.round((secs + asecs) % 60);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const fuelF = (pph, ete) => {
    pph = parseFloat(pph.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let fuel = Math.round(pph * ete / 60);
    return fuel + "#";
  };

  const efrF = (afr, fuel) => {
    afr = parseFloat(afr.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    fuel = parseFloat(fuel.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let efr = afr - fuel;
    return efr + "#";
  };

  const iThF = (th) => th;

  const daF = (course, th) => {
    let trk = parseFloat(course.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    th = parseFloat(th.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let da = trk - th;
    if (Math.abs(da) > 180) {
      da = da - Math.sign(da) * 360;
    }
    let daText = Math.round(da);
    return daText < 0 ? `${-daText} L` : daText > 0 ? `${daText} R` : "0";
  };

  const iGsF = (ete, dist) => {
    ete = parseFloat(ete.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    dist = parseFloat(dist.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let gs = Math.round(dist / (ete / 60));
    return gs + "kts";
  };

  const iXwF = (tas, da) => {
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    const match = da.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if (!match) {
      alert("Invalid DA input! Must be 'deg L' or 'deg R' format");
      return null;
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    da = direction === "L" ? -Math.abs(value) : Math.abs(value);
    let xw = -1 * Math.sin(da * Math.PI / 180) * tas * Math.sign(da) * Math.sign(Math.sin(da * Math.PI / 180) * tas);
    xw = Math.round(xw);
    return Math.round(xw) < 0 ? `${Math.round(-xw)}L` :
           Math.round(xw) > 0 ? `${Math.round(xw)}R` : "0";
  };

  const iHwtwF = (tas, gs) => {
    tas = parseFloat(tas.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    gs = parseFloat(gs.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    let hwtw = gs - tas;
    if (hwtw < 0) return -hwtw + "H";
    else if (hwtw > 0) return hwtw + "T";
    else return "0kts";
  };

  const inflightF = (xw, hwtw) => {
    const match = xw.match(/(-?\d+)(?:\s*\w+)?\s*([LR])/i);
    if (!match) {
      alert("Invalid XW input! Must be 'kts L' or 'kts R' format");
      return null;
    }
    const value = parseFloat(match[1]);
    const direction = match[2].toUpperCase();
    xw = direction === "L" ? -Math.abs(value) : Math.abs(value);
    
    const matchh = hwtw.match(/(-?\d+)(?:\s*\w+)?\s*([HT])/i);
    if (!matchh) {
      alert("Invalid HWTW input! Must be 'kts T' or 'kts H' format");
      return null;
    }
    const valueh = parseFloat(matchh[1]);
    const directionh = matchh[2].toUpperCase();
    hwtw = directionh === "H" ? -Math.abs(valueh) : Math.abs(valueh);
    
    // Need to get track from r6c2 or r7c7
    const trk = parseFloat(getInputValue("r6c2").match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
    
    let dir = 0;
    if (Math.sign(hwtw) > 0) {
      dir = Math.round((trk - 180) % 360 - Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
    } else {
      dir = Math.round(trk + Math.sign(xw) * (180 / Math.PI * Math.atan(Math.abs(xw / hwtw)))) % 360;
    }
    if (dir < 0) dir += 360;

    let vel = Math.round(Math.sqrt(xw * xw + hwtw * hwtw));
    return dir + "/" + vel + "kts";
  };

  // Main action functions
  const findNextSolvableCell = (startId = 'r0c8') => {
    let id = startId;
    while (id && cellGraph[id]) {
      const cell = cellGraph[id];
      if (!cell.solved && !isFilled(id)) {
        return id;
      }
      id = cell.next;
    }
    return null;
  };

  const solveNextCell = () => {
    removeGlowFromAllCells();
    const nextId = findNextSolvableCell();
    if (!nextId || !cellGraph[nextId]) return null;
    const cell = cellGraph[nextId];
    const inputs = cell.dependsOn.map(getInputValue);
    const result = cell.solver(inputs);
    
    if (result === null) return null;
    
    setInputValue(nextId, result);
    const newGraph = { ...cellGraph };
    newGraph[nextId].solved = true;
    setCellGraph(newGraph);
    setCurrentId(nextId);
    
    return { solved: nextId, next: cell.next };
  };

  const solveNextRow = () => {
    let result = solveNextCell();
    if (!result) return;

    const baseRow = getRowIndex(result.solved);
    
    while (result && result.next) {
      const nextRow = getRowIndex(result.next);
      if (nextRow > baseRow && nextRow % 2 === 0) break;
      
      result = solveNextCell();
      if (!result) break;
    }
  };

  const solveAll = () => {
    let result = solveNextCell();
    while (result && result.next) {
      result = solveNextCell();
    }
  };

  const checkWork = () => {
    removeGlowFromAllCells();
    let checkId = "r0c8";
    
    while (checkId && cellGraph[checkId]) {
      const cell = cellGraph[checkId];
      
      if (!cell.solved && !isFilled(checkId)) break;
      if (cell.solved || cell.denominator === null) {
        checkId = cell.next;
        continue;
      }
      
      const inputs = cell.dependsOn.map(getInputValue);
      const result = cell.solver(inputs);
      const userValue = getInputValue(checkId);
      
      // Extract numbers for comparison
      const resultNum = parseFloat(result?.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
      const userNum = parseFloat(userValue?.match(/-?\d+(\.\d+)?/)?.[0] ?? 0);
      
      const diff = Math.abs(userNum - resultNum);
      const percent = (diff / cell.denominator) * 100;
      
      if (percent <= 2) {
        makeCellGlow(checkId, "green");
      } else if (percent <= 10) {
        makeCellGlow(checkId, "yellow");
      } else {
        makeCellGlow(checkId, "red");
      }
      
      checkId = cell.next;
    }
  };

  const hint = () => {
    const nextId = findNextSolvableCell();
    if (!nextId || !cellGraph[nextId]) return;

    const inputs = cellGraph[nextId].dependsOn;

    if (hintStage === 0) {
      removeGlowFromAllCells();
      makeCellGlow(nextId, "blue");
      setHintStage(1);
    } else {
      inputs.forEach(inputId => makeCellGlow(inputId, "green"));
      setHintStage(0);
    }
  };

  const autoGougeJetLog = () => {
    removeGlowFromAllCells();
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

    const newXedCells = new Set();
    const newInputValues = { ...inputValues };

    matrix.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        const cellId = `r${rowIndex}c${colIndex}`;
        
        if (val === 1) {
          newXedCells.add(cellId);
        } else if (typeof val === "string") {
          newInputValues[cellId] = val;
        }
      });
    });

    setXedCells(newXedCells);
    setInputValues(newInputValues);
  };

  const resetJetLogTable = () => {
    setXedCells(new Set());
    setInputValues({});
    setCellGraph(prev => {
      const resetGraph = {};
      Object.keys(prev).forEach(key => {
        resetGraph[key] = { ...prev[key], solved: false };
      });
      return resetGraph;
    });
    removeGlowFromAllCells();
  };

  const handleCellClick = (e, cellId) => {
    if (!xMode) return;
    e.stopPropagation();

    if (xedCells.has(cellId)) {
      setXedCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellId);
        return newSet;
      });
    } else {
      setXedCells(prev => new Set([...prev, cellId]));
    }
  };

  const renderCell = (cellId, rowSpan, colSpan) => {
    const isXed = xedCells.has(cellId);
    const cellProps = {
      id: cellId,
      ...(rowSpan && { rowSpan }),
      ...(colSpan && { colSpan }),
      className: isXed ? 'xcell' : '',
      onClick: (e) => handleCellClick(e, cellId)
    };

    return (
      <td {...cellProps}>
        {!isXed && (
          <input
            value={inputValues[cellId] || ''}
            onChange={(e) => handleInputChange(cellId, e.target.value)}
          />
        )}
      </td>
    );
  };

  return (
    <div className="jetlog-container">
      <h1>Jet Log</h1>
      
      <div className="button-container">
        <button onClick={resetJetLogTable}>Reset</button>
        <button onClick={() => setXMode(!xMode)}>
          {xMode ? 'Exit\nX-Mode' : 'Enter\nX-Mode'}
        </button>
        <button onClick={autoGougeJetLog}>Auto-Gouge<br/>Jet Log</button>
        <button onClick={checkWork}>Check</button>
        <button onClick={hint}>
          {hintStage === 0 ? 'Hint' : 'Another\nHint'}
        </button>
        <button onClick={solveNextCell}>Solve Next<br/>Box</button>
        <button onClick={solveNextRow}>Solve Next<br/>Row</button>
        <button onClick={solveAll}>Solve All</button>
      </div>

      <table ref={tableRef} className="jetlog-table">
        <thead>
          <tr>
            <th rowSpan="2">ROUTE<br/>TO</th>
            <th>IDENT</th>
            <th>TC</th>
            <th rowSpan="2">DIST</th>
            <th rowSpan="2">ETE</th>
            <th>ETA</th>
            <th rowSpan="2">LEG<br/>FUEL</th>
            <th>EFR</th>
            <th rowSpan="2" colSpan="3">NOTES</th>
          </tr>
          <tr>
            <th>CHAN</th>
            <th>MH</th>
            <th>ATA</th>
            <th>AFR</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows 0-1 */}
          <tr>
            {renderCell('r0c0', 2)}
            {renderCell('r0c1')}
            {renderCell('r0c2', 2)}
            {renderCell('r0c3', 2)}
            {renderCell('r0c4', 2)}
            {renderCell('r0c5')}
            {renderCell('r0c6', 2)}
            {renderCell('r0c7')}
            {renderCell('r0c8', null, 2)}
            {renderCell('r0c9')}
          </tr>
          <tr>
            {renderCell('r1c0')}
            {renderCell('r1c1')}
            {renderCell('r1c2')}
            {renderCell('r1c3', null, 3)}
          </tr>
          
          {/* Rows 2-3 */}
          <tr>
            {renderCell('r2c0', 2)}
            {renderCell('r2c1')}
            {renderCell('r2c2')}
            {renderCell('r2c3', 2)}
            {renderCell('r2c4')}
            {renderCell('r2c5')}
            {renderCell('r2c6', 2)}
            {renderCell('r2c7')}
            {renderCell('r2c8', null, 2)}
            {renderCell('r2c9')}
          </tr>
          <tr>
            {renderCell('r3c0')}
            {renderCell('r3c1')}
            {renderCell('r3c2')}
            {renderCell('r3c3')}
            {renderCell('r3c4')}
            {renderCell('r3c5')}
            {renderCell('r3c6')}
            {renderCell('r3c7')}
          </tr>
          
          {/* Rows 4-5 */}
          <tr>
            {renderCell('r4c0', 2)}
            {renderCell('r4c1')}
            {renderCell('r4c2', 2)}
            {renderCell('r4c3', 2)}
            {renderCell('r4c4', 2)}
            {renderCell('r4c5')}
            {renderCell('r4c6', 2)}
            {renderCell('r4c7')}
            {renderCell('r4c8', null, 2)}
            {renderCell('r4c9')}
          </tr>
          <tr>
            {renderCell('r5c0')}
            {renderCell('r5c1')}
            {renderCell('r5c2')}
            {renderCell('r5c3', null, 3)}
          </tr>
          
          {/* Rows 6-7 */}
          <tr>
            {renderCell('r6c0', 2)}
            {renderCell('r6c1')}
            {renderCell('r6c2')}
            {renderCell('r6c3', 2)}
            {renderCell('r6c4')}
            {renderCell('r6c5')}
            {renderCell('r6c6', 2)}
            {renderCell('r6c7')}
            {renderCell('r6c8', null, 2)}
            {renderCell('r6c9')}
          </tr>
          <tr>
            {renderCell('r7c0')}
            {renderCell('r7c1')}
            {renderCell('r7c2')}
            {renderCell('r7c3')}
            {renderCell('r7c4')}
            {renderCell('r7c5')}
            {renderCell('r7c6')}
            {renderCell('r7c7')}
          </tr>
          
          {/* Rows 8-9 */}
          <tr>
            {renderCell('r8c0', 2)}
            {renderCell('r8c1')}
            {renderCell('r8c2')}
            {renderCell('r8c3', 2)}
            {renderCell('r8c4')}
            {renderCell('r8c5')}
            {renderCell('r8c6', 2)}
            {renderCell('r8c7')}
            {renderCell('r8c8', null, 2)}
            {renderCell('r8c9')}
          </tr>
          <tr>
            {renderCell('r9c0')}
            {renderCell('r9c1')}
            {renderCell('r9c2')}
            {renderCell('r9c3')}
            {renderCell('r9c4')}
            {renderCell('r9c5')}
            {renderCell('r9c6')}
            {renderCell('r9c7')}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default JetLog;