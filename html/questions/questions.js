let allQuestions = [];
let currentIndex = -1;
let currentQuestion = null;
let selectedQuestionIndices = [];
let filteredQuestions = [];
let mode = ""
let attempts = [];

document.getElementById("topic").addEventListener("change", () => {
  generateQuestions(document.getElementById("topic").value, document.getElementById("nLecture").value, parseInt(document.getElementById("nQuestions").value));
  loadNextQuestion();
});
document.getElementById("nLecture").addEventListener("change", () => {
  generateQuestions(document.getElementById("topic").value, document.getElementById("nLecture").value, parseInt(document.getElementById("nQuestions").value));
  loadNextQuestion();
});
document.getElementById("nQuestions").addEventListener("change", () => {
  generateQuestions(document.getElementById("topic").value, document.getElementById("nLecture").value, parseInt(document.getElementById("nQuestions").value));
  loadNextQuestion();
});
window.addEventListener("DOMContentLoaded", () => {
  loadExcelFile();
});

function loadExcelFile() {
  fetch('/questions/questions.xlsx')
    .then(res => res.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      allQuestions = json.slice(1)  // Skip header
        .filter(row => row[0]);
      let topics = [...new Set(
        allQuestions
          .map(row => row[0]) // Extract the topic
          .filter(topic => typeof topic === "string" && topic.trim() !== "") // Remove blanks
          .map(topic => topic.toLowerCase()) // Normalize case
      )];
      selectedTopic = topics[Math.floor(topics.length*Math.random())];
      document.getElementById("topic").value = selectedTopic.trim();
      generateQuestions(selectedTopic, "All",allQuestions.length);
      loadNextQuestion();
    })
}

function loadNextQuestion() {
  if (currentIndex >= selectedQuestionIndices.length) {
    showReviewScreen();
    return
  }
  const qData = filteredQuestions[selectedQuestionIndices[currentIndex]];
  currentIndex++;
  currentQuestion = qData;
  setQNumberBadge(currentIndex, selectedQuestionIndices.length);

  const questionText = qData[2];
  const correct = qData[3];
  const incorrect = [qData[4], qData[5], qData[6]].filter(Boolean);
  const allAnswers = prepareAnswerOptions([correct, ...incorrect]);

  document.getElementById("questionText").textContent = questionText;
  renderAnswerOptions(allAnswers);
}

function setQNumberBadge(n, total) {
  const badge = document.getElementById("qNumberBadge");
  if (badge) {
    badge.textContent = `Q ${n}/${total}`;
  }
}


//Shuffles the answers with special attention for "of the above" options
function prepareAnswerOptions(answers) {
  let specialOptions = ["all of the above", "none of the above"];
  const lastOptions = answers.filter(opt =>
    specialOptions.some(special => opt.toLowerCase().includes(special))
  );
  const otherOptions = answers.filter(opt =>
    !specialOptions.some(special => opt.toLowerCase().includes(special))
  );

  return [...shuffle(otherOptions), ...lastOptions];
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

//Generates random question indicies 
function generateQuestions(topic, lecture, n = 10000) {
  console.log(topic, lecture, n)
  filteredQuestions = allQuestions.filter(q => {
    const topicMatch = q[0].toLowerCase() === topic;
    const lectureMatch = lecture === "All" || String(q[1]) === lecture;
    return topicMatch && lectureMatch;
  });
  const total = filteredQuestions.length;
  if(parseFloat(n) > total || n === "All"|| isNaN(n)){n=total;}
  console.log(filteredQuestions)
  console.log(total)
  let indices = [];
  while (indices.length < n) {
    const rand = Math.floor(Math.random() * total);
    if (!indices.includes(rand)) {
      indices.push(rand);
    }
  }
  console.log(indices)
  selectedQuestionIndices = indices;
  currentIndex = 0;
}

//Displays the provided options into the answer list
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
    handleSubmit(submitBtn);
  });
  form.appendChild(submitBtn);
}

function handleSubmit(button) {
  const correctAnswer = currentQuestion[3];
  const labels = document.querySelector('form[name="primaryAnswers"]').querySelectorAll("label");
  

  let chosenValue = null;
  labels.forEach(label => {
    const input = label.querySelector("input");
    if (input && input.checked) {
      chosenValue = input.value;
    }
  });

  labels.forEach(label => {
    const input = label.querySelector("input");
    label.classList.remove("selected");

    if (input.value === correctAnswer) {
      label.classList.add("correct");
    } else if (input.checked) {
      label.classList.add("wrong");
    }
  });
  
  // Record attempt
  attempts.push({
    question: currentQuestion[2],
    chosen: chosenValue,
    correct: correctAnswer
  });

  labels.forEach(label => {
    label.addEventListener("click", () => {
      labels.forEach(l => l.classList.remove("selected"));
    });
  });

  // Turn button into Next Question (or Review if last)
  const isLast = currentIndex >= selectedQuestionIndices.length;
  button.textContent = isLast ? "Review" : "Next Question";

  const nextHandler = (e) => {
    e.preventDefault();
    if (isLast) {
      showReviewScreen();
    } else {
      loadNextQuestion();
    }
  };
  // Remove previous click handlers by cloning or removeEventListener reference (simplest: clone)
  const newBtn = button.cloneNode(true);
  newBtn.addEventListener("click", nextHandler);
  button.replaceWith(newBtn);
}

function resetModal() {
  // Reset title
  const title = document.getElementById("modalTitle");
  title.textContent = "Submit a new question you think should be added";
  title.style.fontSize = "1.25rem";

  // Reset submit button text
  document.getElementById("modalSubmit").textContent = "Submit New Question (expect short delay)";

  // Hide red "bad question" button
  document.getElementById("badQuestionBtn").style.display = "none";

  // Clear dropdowns and lecture number
  document.getElementById("topic").value = "aero";
  document.getElementById("nLectureInput").value = "";

  // Clear textareas
  const fields = [
    "inputQuestion",
    "correctAnswer",
    "incorrectAnswer1",
    "incorrectAnswer2",
    "incorrectAnswer3"
  ];

  fields.forEach(name => {
    const el = document.querySelector(`textarea[name="${name}"]`);
    if (el) {
      el.value = "";
    }
  });
}

function openModal() {
  resetModal();
  mode = "new"
  document.getElementById("submitModal").style.display = "block";
}

function closeModal() {
  document.getElementById("submitModal").style.display = "none";
}

function submitModalQuestion() {
  const topic = document.getElementById("topic").value;
  const lectN = document.getElementById("nLectureInput").value;
  const question = document.getElementById("submitQuestionText").value.trim();
  let options = [
    document.querySelector("textarea[name='correctAnswer']").value.trim(),
    document.querySelector("textarea[name='incorrectAnswer1']").value.trim(),
    document.querySelector("textarea[name='incorrectAnswer2']").value.trim(),
    document.querySelector("textarea[name='incorrectAnswer3']").value.trim()
  ];
  let id = ""
  if(mode === "edit"){
    id = currentQuestion[7];
  }
  if(!question || options.some(ans => !ans)) {
    alert("Please complete all fields.");
    return;
  }

  const submission = {
    mode: mode,
    topic: topic, 
    lecture: lectN,
    question: question,
    options: options,
    id: id
  };

  console.log(JSON.stringify(submission))
  fetch("https://script.google.com/macros/s/AKfycbxZYDa0GlMHQtpE6zhvFuPZWCu5JzsDDhg7mEd3cRCqsFlg84g81_yoyj24Nrkuc072/exec", {
  //fetch("https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzSRfplvV9lQmswXqYmh_OfNc5tBiddv-cMtO3P15Rzz7tSpoBjcMVhA7LaIQJ1gxM9/exec", {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(submission),
    headers: {
        "Content-Type": "text/plain;charset=utf-8",
    }
  })
    .then(res => res.text()) // Use text() to see what's coming back
    .then(text => {
      console.log("Raw response:", text);
      const data = JSON.parse(text);
      if (data.success) {
        alert("Submitted!");
        closeModal();
      }
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

document.addEventListener("input", function (e) {
  if (e.target.tagName.toLowerCase() === "textarea") {
    e.target.style.height = (e.target.scrollHeight) + "px"; // Set to scroll height
  }
});

document.getElementById("thumbsDownBtn").addEventListener("click", () => {
  mode = "edit"
  const questionText = document.getElementById("questionText")?.innerText || "";

  const answers = [...document.querySelectorAll("#answerForm label")].map(label =>
    label.textContent.trim()
  );

  const [correct, ...incorrects] = answers;
  
  const title = document.getElementById("modalTitle");
  title.textContent = "What’s wrong with this question? Please suggest an edit and make sure the first answer the correct one";
  title.style.fontSize = "1.1rem";
  // Populate modal fields
  const questionEl = document.querySelector("textarea[name='inputQuestion']");
  const correctEl = document.querySelector("textarea[name='correctAnswer']");
  const incorrect1El = document.querySelector("textarea[name='incorrectAnswer1']");
  const incorrect2El = document.querySelector("textarea[name='incorrectAnswer2']");
  const incorrect3El = document.querySelector("textarea[name='incorrectAnswer3']");

  questionEl.value = questionText;
  correctEl.value = correct || "";
  incorrect1El.value = incorrects[0] || "";
  incorrect2El.value = incorrects[1] || "";
  incorrect3El.value = incorrects[2] || "";

  
  document.getElementById("modalSubmit").textContent = "Submit Edits";
  document.getElementById("nLectureInput").value = allQuestions[currentIndex][1];
  // Show red 'bad question' button
  document.getElementById("badQuestionBtn").style.display = "block";
  // Show the modal
  document.getElementById("submitModal").style.display = "block";
  // Resize after setting value
  [questionEl, correctEl, incorrect1El, incorrect2El, incorrect3El].forEach(el => {
    autoResize(el);
    el.value = el.value;
  });
  
});

function autoResize(textarea) {
  textarea.style.height = textarea.scrollHeight + "px"; // Adjust to new content
}

function showReviewScreen() {
  // Hide the Q&A and feedback
  document.querySelector(".qa-container").style.display = "none";
  const feedbackRow = document.querySelector(".feedback-row");
  if (feedbackRow) feedbackRow.style.display = "none";

  // Build review
  const container = document.getElementById("reviewScreen");
  container.innerHTML = ""; // clear

  const topicDropdown = document.getElementById("topic");
  const selectedTopicText = topicDropdown.options[topicDropdown.selectedIndex].text;
  const title = document.createElement("h2");
  title.textContent = `${selectedTopicText} Review`;
  container.appendChild(title);

  // ---Score ---
  const total = attempts.length;
  const correctCount = attempts.filter(a => a.chosen === a.correct).length;
  const scoreEl = document.createElement("div");
  scoreEl.style.marginBottom = "16px";
  scoreEl.style.fontWeight = "600";
  scoreEl.textContent = `Score: ${correctCount} / ${total}`;
  container.appendChild(scoreEl);

  attempts.forEach((a, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "review-item";

    const q = document.createElement("div");
    q.className = "review-q";
    q.textContent = `Q${idx + 1}. ${a.question}`;
    wrap.appendChild(q);

    const yourA = document.createElement("div");
    yourA.className = "review-a";
    yourA.textContent = `Your answer: ${a.chosen ?? "(no selection)"}`;
    wrap.appendChild(yourA);

    if (a.chosen !== a.correct) {
      yourA.classList.add("wrong");
      const corr = document.createElement("div");
      corr.className = "review-correct";
      corr.textContent = `Correct: ${a.correct}`;
      wrap.appendChild(corr);
    }

    container.appendChild(wrap);
  });

  // Reset button
  const reset = document.createElement("button");
  reset.className = "review-reset";
  reset.textContent = "Reset";
  reset.addEventListener("click", () => {
    // simplest “reset page”
    window.location.reload();
  });
  container.appendChild(reset);

  // Show review
  container.style.display = "block";
}
