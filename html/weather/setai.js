document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("solveBtn").addEventListener("click", solve);
document.getElementById("checkBtn").addEventListener("click", checkWork);


function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {
    generateSetai();
}

function generateSetai(){
    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("bg-green", "bg-yellow", "bg-red");
        input.value = "";
    });
    document.getElementById("situationCell").innerText = "";
    let depPres = (Math.round(Math.random()*216)/100+28.84).toFixed(2);
    let assAlt = Math.floor(Math.random()*70)*100+3000;
    let fieldEle = Math.floor(Math.random()*20)*100+100;
    let arrPres = (Math.round(Math.random()*216)/100+28.84).toFixed(2);
    document.getElementById("depPressCell").innerText = depPres;
    document.getElementById("assignedAltCell").innerText = assAlt;
    document.getElementById("arrivalElevCell").innerText = fieldEle;
    document.getElementById("arrivalPressCell").innerText = arrPres;
}


function solve() {
  solveSetai();
}

function solveSetai(visualize = true){
    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("bg-green", "bg-yellow", "bg-red");
    });
    let depPres = document.getElementById("depPressCell").innerText;
    let assAlt = document.getElementById("assignedAltCell").innerText;
    let fieldEle = document.getElementById("arrivalElevCell").innerText;
    let arrPres = document.getElementById("arrivalPressCell").innerText;
    let situatuion = "L \u279C H";
    if(arrPres <= depPres){situatuion = "H \u279C L";}
    let error = Math.abs((depPres-arrPres)*1000);
    let trueAlt = (arrPres-(depPres-assAlt/1000))*1000;
    let absolute = trueAlt - fieldEle;
    let indiAlt = (depPres-(arrPres-fieldEle/1000))*1000;
    if(!visualize){return [error, trueAlt, absolute, indiAlt]}
    document.getElementById("situationCell").innerText = situatuion;
    document.getElementById("errorInput").value = Math.round(error);
    document.getElementById("trueAltInput").value = Math.round(trueAlt);
    document.getElementById("absAltInput").value = Math.round(absolute);
    document.getElementById("indAltInput").value = Math.round(indiAlt);
}

function checkWork(){
    [error, trueAlt, absolute, indiAlt] = solveSetai(false);
    let uerror = document.getElementById("errorInput").value;
    let utrueAlt = document.getElementById("trueAltInput").value;
    let uabsolute = document.getElementById("absAltInput").value;
    let uindiAlt = document.getElementById("indAltInput").value;
    let correctAnswers = [error, trueAlt, absolute, indiAlt]
    let userAnswers = [uerror, utrueAlt, uabsolute, uindiAlt]
    let ids = ["errorInput", "trueAltInput", "absAltInput", "indAltInput"]

    for(i=0; i<4; i++){
        let pError = Math.abs(100*(userAnswers[i]-correctAnswers[i])/correctAnswers[i]);
        const input = document.getElementById(ids[i]);
        if (pError < 2) {
            input.classList.add("bg-green");
        } else if (pError < 5) {
            input.classList.add("bg-yellow");
        } else {
            input.classList.add("bg-red");
        }
    }
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
