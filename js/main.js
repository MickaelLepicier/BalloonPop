"use strict";

let gBalloonsData;

let gBalloonData;

let gScoreData;

let winConditions;

let gInterval;

// TODO - change the names of the class (HTML) and in JS to make it clearer

// Noga - I broke the code, wo-oh-oh.

function init() {
  gBalloonsData = { balloons: [], amount: 10, popCount: 0, balloonsOut: [] };

  gBalloonData = { leftDistance: 0, maxSpeed: 2 };

  gScoreData = {
    timeData: { startTime: 0, currTime: "100:100", bestTime: "100:100" },
    levelData: { levelValue: 0, currLevel: "", bestLevel: "" },
  };

  winConditions = { life: 3, win: false };

  renderLife(winConditions.life);
  renderMsg();
}

function createBalloons(amount, speed) {
  let balloons = [];

  for (let i = 0; i < amount; i++) {
    const balloon = createBalloon(i, speed);
    balloons.push(balloon);
  }

  return balloons;
}

function createBalloon(id, maxSpeed) {
  const bottom = -getRandomIntInclusive(10, 30);
  let speed = Math.random() * maxSpeed;
  if (speed < 0.3) speed += 0.3;

  return { id, bottom, speed };
}

// ------------------------------------------------------------------------------------------------------

// MODEL
function playGame() {
  resetGame();

  renderMsgAndBtns(false);
  renderLife(winConditions.life);
  renderBestScore(false);
  renderBalloons();

  gInterval = setInterval(moveBalloons, 100);
}

function moveBalloons() {
  // model

  const blsD = gBalloonsData; // blsD = balloonsData
  const blD = gBalloonsData; // blD = balloonData
  const wC = winConditions; // wC = winConditions

  // dom
  const elBalloon = document.querySelectorAll(".balloon");

  if (blsD.popCount === blsD.amount) {
    wC.win = true;
    win("You Won!");
  }

  for (let i = 0; i < elBalloon.length; i++) {
    const isOut = blD.balloonsOut.includes(blsD.balloons[i].id);
    const balloonEscaped = elBalloon[i].style.display === "block";

    // update MODEL
    blsD.balloons[i].bottom += blsD.balloons[i].speed;

    // update DOM
    elBalloon[i].style.bottom = blsD.balloons[i].bottom + "vh";

    if (blsD.balloons[i].bottom >= 105 && !isOut && balloonEscaped) {
      blD.balloonsOut.push(blsD.balloons[i].id);

      wC.life--;

      blsD.amount--;

      renderLife(wC.life);

      if (wC.life === 0) {
        wC.win = false;
        win("You Lost!");
      }
    }
  }
}

function popBalloon(elBalloon) {
  const blsD = gBalloonsData; // blsD = balloonsData

  elBalloon.style.display = "none";

  blsD.popCount++;

  const popSound = new Audio("sound/oof.mp3");
  popSound.play();
}

function onLevel(elBtn) {
  const scoreLevel = gScoreData.levelData;
  const text = elBtn.textContent;
  let value = 0;

  if (text === "Easy") {
    gBalloonData.maxSpeed = 2;
    value = 1;
  } else if (text === "Normal") {
    gBalloonData.maxSpeed = 3;
    value = 2;
  } else if (text === "Hard") {
    gBalloonData.maxSpeed = 4;
    value = 3;
  } else if (text === "Extreme") {
    gBalloonData.maxSpeed = 5;
    value = 4;
  }

  scoreLevel.currLevel = { text, value };

  playGame();
}

function time() {
  const sdTime = gScoreData.timeData; // sdTime = scoreData Time
  const sdLevel = gScoreData.levelData; // sdLevel = scoreData Level

  let currTime = new Date().getTime();

  const totalMillSec = currTime - sdTime.startTime;

  let seconds = Math.floor((totalMillSec / 1000) % 60);
  let milliSeconds = Math.floor((totalMillSec % 1000) / 10);

  seconds = String(seconds).padStart(2, "0");
  milliSeconds = String(milliSeconds).padStart(2, "0");

  sdTime.currTime = `${seconds}:${milliSeconds}`;

  if (checkScore(+seconds)) {
    sdTime.bestTime = sdTime.currTime;
    sdLevel.bestLevel = sdLevel.currLevel.text;

    renderBestScore(true);
    return;
  }
  renderBestScore(false);
}

function checkScore(currSeconds) {
  const sdTime = gScoreData.timeData; // sdTime = scoreData Time
  const sdLevel = gScoreData.levelData; // sdLevel = scoreData Level
  const wC = winConditions; // wC = win Condition

  if (!wC.win) return false;

  const bestTime = sdTime.bestTime.split(":");
  const bestSeconds = +bestTime[0];

  if (sdLevel.currLevel.value >= sdLevel.levelValue) {
    if (bestSeconds > currSeconds) {
      sdLevel.levelValue = sdLevel.currLevel.value;
      return true;
    }
    return false;
  }

  return false;
}

function win(msg) {
  renderMsgAndBtns(true);
  renderMsg(msg);
  clearInterval(gInterval);
  time();
}

function resetGame() {
  const blsD = gBalloonsData; // blsD = balloonsData
  const blD = gBalloonData; // blD = balloonData
  const sdTime = gScoreData.timeData; // sdTime = scoreData Time
  const wC = winConditions; // wC = winConditions

  const elBalloons = document.querySelector(".balloons");
  elBalloons.innerHTML = "";

  blsD.amount = 10;
  blsD.popCount = 0;
  blsD.balloonsOut = [];

  blD.leftDistance = 0;
  wC.life = 3;
  sdTime.startTime = new Date().getTime();
  wC.win = false;

  blsD.balloons = createBalloons(blsD.amount, blD.maxSpeed);
}

// ------------------------------------------------------------------------------------------------------

// DOM - RENDER FUNCTIONS

function renderBalloons() {
  const blsD = gBalloonsData; // blsD = balloonsData
  const blD = gBalloonData; // blD = balloonData

  // const balloons = gBalloonsData.balloons;
  // const balloonLeftDistance = gBalloonData.leftDistance;

  const elBalloons = document.querySelector(".balloons");
  const emojis = [
    "🐲",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "🙀",
    "😧",
    "🥸",
    "💂🏼‍♂️",
    "🧙🏼‍♂️",
    "👨🏼‍🚀",
    "🧌",
    "🐶",
    "💩",
    "🐻",
    "🦊",
    "🦁",
    "🐮",
    "🌸",
    "🌞",
    "⛄",
    "🍎",
  ];

  for (let i = 0; i < blsD.balloons.length; i++) {
    const randomColor = getRandomColor();
    const randomIdx = getRandomIntInclusive(0, emojis.length - 1);

    const style = `style="display: block; background-color:${randomColor}; left:${blD.leftDistance}%; bottom:${blsD.balloons[i].bottom}vh; "`;

    blD.leftDistance += 10;

    elBalloons.innerHTML += `<div class="balloon" onclick="popBalloon(this)" ${style} > ${emojis[randomIdx]}</div>`;
  }
}

function renderLife(lifeAmount) {
  const elLife = document.querySelector(".life");
  let life = "";

  for (let i = 0; i < lifeAmount; i++) {
    life += "🩷";
  }

  elLife.innerText = life;
}

function renderBestScore(bestScore) {
  const sdTime = gScoreData.timeData; // sdTime = scoreData Time
  const sdLevel = gScoreData.levelData; // sdLevel = scoreData Level
  const wC = winConditions; // wC = winConditions

  const elScoreContainer = document.querySelector(".score-container");
  const elCurrScore = document.querySelector(".curr-score");
  const elBestScore = document.querySelector(".best-score");

  if (!wC.win) {
    elScoreContainer.style.display = "none";
    return;
  }

  elCurrScore.innerText = `Your current score is: \n Time: ${sdTime.currTime} | Level: ${sdLevel.currLevel.text} `;

  elBestScore.innerText = bestScore
    ? `Congratulation! your new best score is: \n Time: ${sdTime.bestTime} | Level: ${sdLevel.bestLevel}`
    : `Your best score is: \n Time: ${sdTime.bestTime} | Level: ${sdLevel.bestLevel} `;

  elScoreContainer.style.display = "block";
}

function renderMsgAndBtns(isShown) {
  const elMsgAndBtns = document.querySelector(".greets-btns-container");
  elMsgAndBtns.style.display = isShown ? "block" : "none";
}

function renderMsg(msg) {
  const elMsg = document.querySelector(".greeting");
  const elLife = document.querySelector(".life");
  let sound;

  if (msg === "You Won!") {
    elLife.innerText = "🌟";
    elMsg.innerText = msg;
    sound = new Audio("sound/ohyeah.mp3");
    sound.play();
  } else if (msg === "You Lost!") {
    elLife.innerText = "👻";
    elMsg.innerText = msg;
    sound = new Audio("sound/aww.mp3");
    sound.play();
  } else {
    elMsg.innerText =
      "Welcome to Balloon Pop game! \n Press one of the buttons below to start, Good Luck!";
  }
}

// ------------------------------------------------------------------------------------------------------

// UTILLs

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  var color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
