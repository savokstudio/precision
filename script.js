/* ——— Element References ——— */
const game = document.querySelector(".game");
const dot = document.querySelector(".moving-dot");
const target = document.querySelector(".target-zone");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const startScreen = document.querySelector(".start-screen");

/* ——— Game State ——— */
let y = 0;
let speed = 2;
let score = 0;
let gameStarted = false;

let best = Number(localStorage.getItem("tap-best")) || 0;
bestEl.textContent = best;

/* ——— Main Loop ——— */
function loop() {
  if (gameStarted) {
    y += speed * 0.92 + speed * 0.08; // slight ease

    if (y > 500) {
      y = -40; // reset to top
    }

    dot.style.top = y + "px";
  }

  requestAnimationFrame(loop);
}

loop();

/* ——— Start Game ——— */
function startGame() {
  gameStarted = true;
  startScreen.classList.add("hidden");

  // reset state
  y = 0;
  speed = 2;
  score = 0;
  scoreEl.textContent = 0;

  // ensure dot is centered visually
  dot.style.transform = "translateX(-50%) scale(1)";
  dot.style.opacity = "1";
}

/* ——— Input Handler ——— */
game.addEventListener("click", () => {
  if (!gameStarted) {
    startGame();
    return;
  }

  const dotRect = dot.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const hit =
    dotRect.bottom > targetRect.top + 10 &&
    dotRect.top < targetRect.bottom - 10;

  if (hit) {
    handleHit();
  } else {
    handleMiss();
  }
});

/* ——— Hit Logic ——— */
function handleHit() {
  score++;
  scoreEl.textContent = score;
  // streak glow at milestones
if (score === 10 || score === 20 || score === 30 || score === 40) {
  game.classList.add("streak-glow");
  setTimeout(() => {
    game.classList.remove("streak-glow");
  }, 350);
}

  // difficulty curve
if (score < 10) {
  speed = 2 + score * 0.18;          // warmup
} else if (score < 25) {
  speed = 2 + 10 * 0.18 + (score - 10) * 0.28;  // flow zone
} else {
  speed = 2 + 10 * 0.18 + 15 * 0.28 + (score - 25) * 0.12; // challenge zone
  if (speed > 10) speed = 10;        // cap
}

  // update best
  if (score > best) {
    best = score;
    bestEl.textContent = best;
    localStorage.setItem("tap-best", best);
  }

  // target pulse
  target.style.background = "rgba(0,255,160,0.32)";
  setTimeout(() => {
    target.style.background = "rgba(0,255,160,0.12)";
  }, 120);

  // perfect-hit glow
  target.classList.add("glow");
  setTimeout(() => {
    target.classList.remove("glow");
  }, 150);

  // dot pulse (preserve centering)
  dot.style.transform = "translateX(-50%) scale(1.15)";
  setTimeout(() => {
    dot.style.transform = "translateX(-50%) scale(1)";
  }, 120);

  // score animation
  scoreEl.style.opacity = "0.4";
  scoreEl.style.transform = "scale(1.15)";
  setTimeout(() => {
    scoreEl.style.opacity = "1";
    scoreEl.style.transform = "scale(1)";
  }, 120);
}

/* ——— Miss Logic (with restart animation) ——— */
function handleMiss() {
  // background flash
  game.style.background = "#2a0000";
  setTimeout(() => {
    game.style.background = "#111";
  }, 120);

  // fade out dot
  dot.style.transition = "opacity 0.18s ease";
  dot.style.opacity = "0";

  setTimeout(() => {
    // reset state while invisible
    y = 0;
    speed = 2;
    score = 0;
    scoreEl.textContent = 0;

    dot.style.top = "-40px";
    dot.style.transform = "translateX(-50%) scale(1)";

    // fade back in
    dot.style.opacity = "1";
  }, 180);
}
