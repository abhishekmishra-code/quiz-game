const root = document.querySelector(":root");
const optionsContainer = document.querySelector(".options");
const question = document.querySelector(".question h6");
const options = document.querySelector(".options");
const serialNum = document.querySelector("#serial-num span");
const nextBtn = document.querySelector("#next");
const sound = document.querySelector(".volume");
const timer = document.querySelector(".timer span");
const wrongSound = new Audio("../music/wrong-answer.wav");
const correctSound = new Audio("../music/Audience_Clapping.mp3");
const ticTicSound = new Audio("../music/Kbc_Timer_Tik_Tik_Kbc_Clock.mp3");

let currentScore = 0;
let data;
let questionNumber = 0;

startTimer();
ticTicSound.play();

document.addEventListener("contextmenu", (event) => event.preventDefault());

sound.addEventListener("click", () => {
  sound.classList.toggle("pause");
  music();
});

fetch("../data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString)))
  .then((decodedDataAsObject) => {
    data = decodedDataAsObject;
    setContent(data);
  });

optionsContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  if (optionsContainer.classList.contains("disabled")) {
    return;
  }

  if (e.target !== optionsContainer) {
    nextBtn.disabled = false;
    ticTicSound.pause();

    [...options.children].forEach((el) => {
      if (el.innerText === data[questionNumber].answer) {
        el.classList.add("correct");
        optionsContainer.classList.add("disabled");
      } else if (e.target.innerText !== data[questionNumber].answer) {
        e.target.classList.add("incorrect");
        wrongSound.play();
        optionsContainer.classList.add("disabled");
      }
    });
  }

  if (e.target.innerText === data[questionNumber].answer) {
    if (e.isTrusted) correctSound.play();
    currentScore++;
  }
});

nextBtn.addEventListener("click", () => {
  nextBtn.disabled = true;
  ticTicSound.currentTime = 0;
  correctSound.pause();
  timer.innerText = 30;
  startTimer();
  resetColor();
  music();

  localStorage.setItem("currentScore", currentScore);

  if (data[questionNumber].quesNum == data.length) {
    window.location.replace("result.html");
  }

  questionNumber++;
  optionsContainer.classList.remove("disabled");

  [...options.children].forEach((el) => {
    if (el.classList.contains("correct")) {
      el.classList.remove("correct");
    } else if (el.classList.contains("incorrect")) {
      el.classList.remove("incorrect");
    }

    if (el.innerText === data[questionNumber]?.answer) {
      el.classList.add("correct");
    }
  });

  setContent(data);
});

function setContent(data) {
  question.innerText = data[questionNumber].question;
  [...options.children].forEach((el, i) => {
    el.innerText = data[questionNumber].option[i];
  });
  serialNum.innerText = `${data[questionNumber].quesNum} / ${data.length}`;
}

function startTimer() {
  let time = 29;
  const timerId = setInterval(() => {
    if (time <= 0 || optionsContainer.classList.contains("disabled")) {
      ticTicSound.pause();
      [...options.children].forEach((el) => {
        if (el.innerText === data[questionNumber].answer) el.click();
      });
      clearInterval(timerId);
      if (timer.innerText === "01") timer.innerText = `00`;
    }

    if (time >= 0 && !optionsContainer.classList.contains("disabled")) {
      if (time < 10) {
        timer.innerText = `0${time--}`;
      } else {
        timer.innerText = time--;
      }
    }

    if (time < 15) {
      root.style.setProperty("--bodyColor", "#D4D69F");
      root.style.setProperty("--timerColor", "#C5B100");
    }
    if (time < 5) {
      root.style.setProperty("--bodyColor", "#DBADAD");
      root.style.setProperty("--timerColor", "#C50C00");
    }
  }, 1000);
  ticTicSound.play();
}

function resetColor() {
  root.style.setProperty("--bodyColor", "#CCE2C2");
  root.style.setProperty("--timerColor", "rgba(2, 164, 9, 0.43)");
}

function music() {
  if (sound.classList.contains("pause")) {
    sound.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    ticTicSound.pause();
  } else {
    sound.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    if (!optionsContainer.classList.contains("disabled")) {
      ticTicSound.play();
    }
  }
}
