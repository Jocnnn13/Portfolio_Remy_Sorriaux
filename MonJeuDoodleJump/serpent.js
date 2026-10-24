document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  const scoreDisplay = document.createElement("div");

  scoreDisplay.id = "score-display";
  scoreDisplay.innerHTML = "Score: 0";
  grid.appendChild(scoreDisplay);

  let doodlerLeftSpace = 370;
  let startPoint = 250;
  let doodlerletBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 8;
  let platforms = [];
  let upTimerId, downTimerId, movePlatformsTimerId;
  let isJumping = true;
  let score = 0;

  let direction = null;
  let isMoving = false;
  let lastMoveTime = 0;
  const moveInterval = 16;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.innerHTML = `<img src="../Élément/chien.svg" alt="chien" style="width:90px; height:auto;">`;
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0] ? platforms[0].left : 370;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerletBottomSpace + "px";
  }

  class Platform {
    constructor(newplatformBottom) {
      this.bottom = newplatformBottom;
      this.left = Math.random() * 715;
      this.visual = document.createElement("div");
      this.estTouchee = false;

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.background = "none";
      visual.style.border = "none";
      visual.innerHTML = `<img src="../Élément/Nuage.svg" alt="nuage" style="width:125px; height:auto;">`;
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newplatformBottom = 100 + i * platGap;
      platforms.push(new Platform(newplatformBottom));
    }
  }

  function movePlatforms() {
    if (doodlerletBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        platform.visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          platforms[0].visual.remove();
          platforms.shift();
          platforms.push(new Platform(600));
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerletBottomSpace += 25;
      doodler.style.bottom = doodlerletBottomSpace + "px";
      if (doodlerletBottomSpace > startPoint + 200) fall();
    }, 20);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerletBottomSpace -= 5;
      doodler.style.bottom = doodlerletBottomSpace + "px";
      if (doodlerletBottomSpace <= 0) gameOver();

      platforms.forEach((platform) => {
        if (
          doodlerletBottomSpace >= platform.bottom &&
          doodlerletBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerletBottomSpace;
          jump();
          if (!platform.estTouchee) {
            score++;
            scoreDisplay.innerHTML = "Score: " + score;
            platform.estTouchee = true;
          }
        }
      });
    }, 20);
  }

  function gameOver() {
    isGameOver = true;
    direction = null;
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    grid.innerHTML = `<div style="color:#1c1c1c; text-align:center; font-family:sans-serif; margin-top:200px;">
                        <h1>Tu as perdu !</h1>
                        <h2>Score: ${score}</h2>
                        <p>G pour recommencer</p>
                      </div>`;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(movePlatformsTimerId);
  }

  function moveLoop(timestamp) {
    if (direction === null) {
      isMoving = false;
      return;
    }
    if (timestamp - lastMoveTime >= moveInterval) {
      if (direction === "left" && doodlerLeftSpace > 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + "px";
      } else if (direction === "right" && doodlerLeftSpace < 740) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + "px";
      }
      lastMoveTime = timestamp;
    }
    requestAnimationFrame(moveLoop);
  }

  function moveLeft() {
    direction = "left";
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(moveLoop);
    }
  }

  function moveRight() {
    direction = "right";
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(moveLoop);
    }
  }

  function moveStraight() {
    direction = null;
  }

  function control(e) {
    if (e.repeat) return;
    if (e.key === "Escape") {
      window.parent.postMessage("closeGameModal", "*");
      return;
    }
    if (isGameOver && (e.key === "g" || e.key === "G")) {
      resetGame();
      return;
    }
    if (e.key === "ArrowLeft") moveLeft();
    else if (e.key === "ArrowRight") moveRight();
    else if (e.key === "ArrowUp") moveStraight();
  }

  function controlUp(e) {
    if (e.key === "ArrowLeft" && direction === "left") moveStraight();
    else if (e.key === "ArrowRight" && direction === "right") moveStraight();
  }

  document.addEventListener("keydown", control);
  document.addEventListener("keyup", controlUp);

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      movePlatformsTimerId = setInterval(movePlatforms, 30);
      jump();
    }
  }

  function resetGame() {
    isGameOver = false;
    score = 0;
    doodlerLeftSpace = 370;
    startPoint = 250;
    doodlerletBottomSpace = startPoint;
    platforms = [];
    isJumping = true;
    direction = null;
    isMoving = false;

    grid.innerHTML = "";
    scoreDisplay.id = "score-display";
    scoreDisplay.innerHTML = "Score: 0";
    grid.appendChild(scoreDisplay);

    start();
  }

  start();
});

document.addEventListener("mousemove", (e) => {
  window.parent.postMessage(
    { type: "mouseMove", x: e.clientX, y: e.clientY },
    "*",
  );
});

window.addEventListener("keydown", function (e) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }
});
