// Select the highest score display element and sound toggle button
const highScore = document.querySelector("#highest-score");
const sound = document.querySelector(".volume");
const startBtn = document.querySelector('#start')

// Load the theme music for the quiz\const themeSound = new Audio("../music/kbc_theme.mp3");
const themeSound = new Audio("./music/kbc_theme.mp3");


if (localStorage.getItem('stage') !== null  || localStorage.getItem('game') == 'started') {
  window.location.replace("./pages/quiz-question.html");
}


// Fetch quiz data, decode it, and update the highest score display
fetch("./data/quiz.json")
  .then((res) => res.text())
  .then((encodedJsonString) => JSON.parse(atob(encodedJsonString))) // Decode base64 JSON
  .then((decodedDataAsObject) => {
    // Format and display the highest score
    if (Number(localStorage.getItem("highestScore")) < 10)
      highScore.firstElementChild.innerText = `0${localStorage.getItem("highestScore")} / ${
        decodedDataAsObject.length
      }`;
    else
      highScore.firstElementChild.innerText = `${localStorage.getItem("highestScore")} / ${
        decodedDataAsObject.length
      }`;
  });

// Hide the highest score element if no highest score exists
if (localStorage.getItem("highestScore") === null) {
  highScore.classList.add("hide");
}

// Initialize the session state for theme sound playback
if (sessionStorage.getItem('state') === null) {
    sessionStorage.setItem('state', 'play');
}

// Add event listener to toggle sound playback
sound.addEventListener("click", () => {
  // Pause or play the theme sound based on the current state
  if (sessionStorage.getItem('state') === 'pause') {
    sessionStorage.setItem('state', 'play');
    sound.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`; // Update icon to muted
    themeSound.pause(); // Pause the theme sound
  } else if (sessionStorage.getItem('state') === 'play') {
    sessionStorage.setItem('state', 'pause');
    sound.innerHTML = `<i class="fa-solid fa-volume-high"></i>`; // Update icon to playing
    themeSound.play(); // Play the theme sound
  }
});
