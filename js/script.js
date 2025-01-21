const highScore = document.querySelector("#highest-score");
const sound = document.querySelector(".volume");

const themeSound = new Audio("./music/kbc_theme.mp3");

fetch("./data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString))) 
  .then((decodedDataAsObject) => {
    if (Number(localStorage.getItem("highestScore")) < 10)
      highScore.firstElementChild.innerText = `0${localStorage.getItem("highestScore")} / ${
        decodedDataAsObject.length
      }`;
    else
      highScore.firstElementChild.innerText = `${localStorage.getItem("highestScore")} / ${
        decodedDataAsObject.length
      }`;
  });

if (localStorage.getItem("highestScore") === null) {
  highScore.classList.add("hide");
}

if (sessionStorage.getItem('state') === null) {
    sessionStorage.setItem('state', 'play');
}

sound.addEventListener("click", () => {
  if (sessionStorage.getItem('state') === 'pause') {
    sessionStorage.setItem('state', 'play');
    sound.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`; 
    themeSound.pause(); 
  } else if (sessionStorage.getItem('state') === 'play') {
    sessionStorage.setItem('state', 'pause');
    sound.innerHTML = `<i class="fa-solid fa-volume-high"></i>`; 
    themeSound.play(); 
  }
});
