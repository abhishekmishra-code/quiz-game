const resultBar = document.querySelector(".result-bar");
const score = document.querySelector("#score span");

fetch("../data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString))) 
  .then((decodedDataAsObject) => {
    if (Number(localStorage.getItem("currentScore")) < 10)
      score.innerText = `0${localStorage.getItem("currentScore")} / ${
        decodedDataAsObject.length
      }`;
    else
      score.innerText = `${localStorage.getItem("currentScore")} / ${
        decodedDataAsObject.length
      }`;

    resultBar.style.width = `${Number(localStorage.getItem("currentScore")) / decodedDataAsObject.length * 100}%`;
  });

if (
  Number(localStorage.getItem("currentScore")) >
  Number(localStorage.getItem("highestScore"))
)
  localStorage.setItem("highestScore", localStorage.getItem("currentScore"));
