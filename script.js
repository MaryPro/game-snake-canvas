const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

const scoreBarWidth = 200;
const gameZoneWidth = canvas.width - scoreBarWidth;
const tileCount = 20;
const tileSize = gameZoneWidth / tileCount - 2;

let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let highscore = 0;

function drawGame() {
  changeSnakePosition();

  if (isGameOver()) {
    return;
  }

  clearGameScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  clearScoreScreen();

  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "#ffff";
    ctx.font = "50px Verdana";

    ctx.fillText("Game Over!", gameZoneWidth / 8, canvas.height / 2);

    if (highscore < score) {
      highscore = score;
      ctx.fillStyle = "#ffff";
      ctx.font = "30px Verdana";

      ctx.fillText("New highscore!", gameZoneWidth / 5, canvas.height / 1.5);
      clearScoreScreen();
      drawScore();
    }

    createRestartButton();
  }

  return gameOver;
}

function restartGame() {
  speed = 7;

  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;

  appleX = 5;
  appleY = 5;

  xVelocity = 0;
  yVelocity = 0;

  score = 0;

  drawGame();
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "30px Verdana";
  ctx.fillText("Score " + score, canvas.width - scoreBarWidth + 20, 100);

  ctx.fillStyle = "black";
  ctx.font = "20px Verdana";
  ctx.fillText(
    "Highscore " + highscore,
    canvas.width - scoreBarWidth + 20,
    150
  );
}

function clearGameScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameZoneWidth, canvas.height);
}

function clearScoreScreen() {
  ctx.fillStyle = "#8C8C8CFF";
  ctx.fillRect(canvas.width - scoreBarWidth, 0, gameZoneWidth, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize / 2,
    appleY * tileCount + tileSize / 2,
    tileSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
  }
}

document.body.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    if (yVelocity === 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }

  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
    if (yVelocity === -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    if (xVelocity === 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    if (xVelocity === -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
}

function createRestartButton() {
  const body = document.querySelector("body");
  const button = document.createElement("button");
  button.setAttribute("id", "restartBtn");
  button.textContent = "Restart";
  body.appendChild(button);

  button.addEventListener("click", () => {
    restartGame();
    body.removeChild(button);
  });
}

drawGame();
