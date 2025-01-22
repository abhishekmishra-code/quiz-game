// Select elements to display the result bar and score
const resultBar = document.querySelector(".result-bar");
const score = document.querySelector("#score span");
const retryBtn = document.querySelector("#retry-btn");

// Fetch quiz data, decode it, and display the score and result bar
fetch("../data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString))) // Decode base64 JSON
  .then((decodedDataAsObject) => {
    // Check and format the score for single-digit values
    if (Number(localStorage.getItem("currentScore")) < 10)
      score.innerText = `0${localStorage.getItem("currentScore")} / ${
        decodedDataAsObject.length
      }`;
    else
      score.innerText = `${localStorage.getItem("currentScore")} / ${
        decodedDataAsObject.length
      }`;

    // Calculate and set the width of the result bar based on the score percentage
    resultBar.style.width = `${
      (Number(localStorage.getItem("currentScore")) /
        decodedDataAsObject.length) *
      100
    }%`;
  });

// Update the highest score in local storage if the current score exceeds it
if (
  Number(localStorage.getItem("currentScore")) >
  Number(localStorage.getItem("highestScore"))
)
  localStorage.setItem("highestScore", localStorage.getItem("currentScore"));

retryBtn.addEventListener("click", () => {
  localStorage.removeItem("currentScore");
});

localStorage.removeItem("stage");
localStorage.removeItem("game");
