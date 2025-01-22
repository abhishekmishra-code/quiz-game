// Select root element for CSS variable manipulation
const root = document.querySelector(":root");

// Select important elements from the DOM
const optionsContainer = document.querySelector(".options");
const question = document.querySelector(".question h6");
const options = document.querySelector(".options");
const serialNum = document.querySelector("#serial-num span");
const nextBtn = document.querySelector("#next");
const sound = document.querySelector(".volume");
const timer = document.querySelector(".timer span");
const logo = document.querySelector(".quiz-logo");

// Load sound effects for the quiz
const wrongSound = new Audio("../music/wrong-answer.wav");
const correctSound = new Audio("../music/Audience_Clapping.mp3");
const ticTicSound = new Audio("../music/Kbc_Timer_Tik_Tik_Kbc_Clock.mp3");

// Initialize variables for score tracking and quiz data
let currentScore = 0;
let data;
let questionNumber = 0;

if (localStorage.getItem("currentScore") !== null)
  currentScore = Number(localStorage.getItem("currentScore"));
else localStorage.setItem("currentScore", currentScore);

// Disable right-click on the page
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Toggle sound on/off when clicking the sound icon
sound.addEventListener("click", () => {
  sound.classList.toggle("pause");
  music();
});

// Fetch quiz data, decode it, and set initial content
fetch("../data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString))) // Decode base64 JSON
  .then((decodedDataAsObject) => {
    data = decodedDataAsObject;
    setContent(data);

    // Start the timer and play the ticking sound initially
    startTimer();
    ticTicSound.play();
  });

// restart the quiz
logo.addEventListener("click", () => {
  localStorage.removeItem("stage");
  localStorage.removeItem("game");
});

// Handle option selection
optionsContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  // Prevent further clicks if options are disabled
  if (optionsContainer.classList.contains("disabled")) {
    return;
  }

  // Check if the clicked target is an option
  if (e.target !== optionsContainer) {
    nextBtn.disabled = false; // Enable the Next button
    ticTicSound.pause(); // Pause ticking sound

    // Mark correct and incorrect answers
    [...options.children].forEach((el) => {
      if (el.innerText === data[questionNumber].answer) {
        el.classList.add("correct"); // Highlight correct answer
        optionsContainer.classList.add("disabled");
      } else if (e.target.innerText !== data[questionNumber].answer) {
        e.target.classList.add("incorrect"); // Highlight incorrect answer
        wrongSound.play(); // Play wrong answer sound
        optionsContainer.classList.add("disabled");
      }
    });
  }

  // Update score if the correct answer was selected
  if (e.target.innerText === data[questionNumber].answer) {
    if (e.isTrusted) {
      correctSound.play(); // Play correct answer sound
      currentScore++;
    }
    // localStorage.setItem('currentScore', `${Number(localStorage.getItem('currentScore'))++}`)
  }
});

// Handle Next button click to move to the next question
nextBtn.addEventListener("click", () => {
  localStorage.removeItem("game");
  localStorage.setItem("stage", `${data[questionNumber].quesNum}`);
  nextBtn.disabled = true; // Disable Next button
  ticTicSound.currentTime = 0; // Reset ticking sound
  correctSound.pause(); // Pause correct sound if playing
  timer.innerText = 30; // Reset timer
  startTimer(); // Restart timer
  resetColor(); // Reset colors
  music(); // Restart music if needed

  // Save current score in local storage
  localStorage.setItem("currentScore", currentScore);

  // Check if it's the last question and navigate to results
  if (data[questionNumber].quesNum == data.length) {
    window.location.replace("result.html");
  }

  questionNumber++; // Increment question number
  optionsContainer.classList.remove("disabled"); // Enable options

  // Reset option colors and prepare for the next question
  [...options.children].forEach((el) => {
    if (el.classList.contains("correct")) {
      el.classList.remove("correct");
    } else if (el.classList.contains("incorrect")) {
      el.classList.remove("incorrect");
    }

    // Highlight the correct answer for the next question
    if (el.innerText === data[questionNumber]?.answer) {
      el.classList.add("correct");
    }
  });

  setContent(data); // Update content for the next question
});

// Function to set content for a question
function setContent(data) {
  if (Number(localStorage.getItem("stage")) !== null) {
    questionNumber = Number(localStorage.getItem("stage"));
  }
  question.innerText = data[questionNumber].question; // Set question text
  [...options.children].forEach((el, i) => {
    el.innerText = data[questionNumber].option[i]; // Set options text
  });
  serialNum.innerText = `${data[questionNumber].quesNum} / ${data.length}`; // Update question number display
}

// Function to start and manage the timer
function startTimer() {
  let time;

  // Set timer duration
  if (
    (localStorage.getItem("stage") !== null &&
      data[questionNumber].quesNum != localStorage.getItem("stage")) ||
    localStorage.getItem("game") == "started"
  ) {
    console.log(Number(localStorage.getItem("stage")) !== null);
    console.log(data[questionNumber].quesNum != localStorage.getItem("stage"));
    time = 0;
  } else {
    localStorage.setItem("game", "started");
    time = 29;
  }

  const timerId = setInterval(() => {
    // End timer if time runs out or options are disabled
    if (time <= 0 || optionsContainer.classList.contains("disabled")) {
      ticTicSound.pause(); // Pause ticking sound
      [...options.children].forEach((el) => {
        if (el.innerText === data[questionNumber].answer) el.click(); // Auto-select correct answer
      });
      clearInterval(timerId); // Stop timer
      timer.innerText = `00`;
      // if (timer.innerText === "01") timer.innerText = `00`;
    }

    // Update timer display if still active
    if (time >= 0 && !optionsContainer.classList.contains("disabled")) {
      if (time < 10) {
        timer.innerText = `0${time--}`; // Display with leading zero
      } else {
        timer.innerText = time--;
      }
    }

    // Change colors based on remaining time
    if (time < 15) {
      root.style.setProperty("--bodyColor", "#D4D69F");
      root.style.setProperty("--timerColor", "#C5B100");
    }
    if (time < 5) {
      root.style.setProperty("--bodyColor", "#DBADAD");
      root.style.setProperty("--timerColor", "#C50C00");
    }
  }, 1000);
  ticTicSound.play(); // Play ticking sound
}

// Function to reset colors to default
function resetColor() {
  root.style.setProperty("--bodyColor", "#CCE2C2");
  root.style.setProperty("--timerColor", "rgba(2, 164, 9, 0.43)");
}

// Function to toggle music based on sound button state
function music() {
  if (sound.classList.contains("pause")) {
    sound.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`; // Show muted icon
    ticTicSound.pause(); // Pause ticking sound
  } else {
    sound.innerHTML = `<i class="fa-solid fa-volume-high"></i>`; // Show sound icon
    if (!optionsContainer.classList.contains("disabled")) {
      ticTicSound.play(); // Play ticking sound if allowed
    }
  }
}
