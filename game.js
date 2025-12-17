const boardSize = 100;
let currentPosition = 1;
let playerElement;

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const events = [
  { type: "story", content: "Remember our first date? That awkward hello turned into endless conversations." },
  { type: "challenge", content: "Challenge: Send a virtual kiss emoji to your partner right now!" },
  { type: "question", content: "Question: What was the first thing you noticed about me?" },
  { type: "story", content: "Story: The day we shared our first laugh over a silly meme." },
  { type: "challenge", content: "Challenge: Plan a surprise for tomorrow, even if small." },
  { type: "question", content: "Question: What's your favorite memory from our early days?" },
  { type: "story", content: "Story: Walking hand in hand under the stars." },
  { type: "challenge", content: "Challenge: Write a short love note and hide it somewhere." },
  { type: "question", content: "Question: If we could relive one day, which would it be?" },
  { type: "story", content: "Story: The first time I said I love you." },
  { type: "challenge", content: "Challenge: Cook a meal together tonight." },
  { type: "question", content: "Question: What song reminds you of us?" },
  { type: "story", content: "Story: Our first road trip adventure." },
  { type: "challenge", content: "Challenge: Take a silly selfie and share it." },
  { type: "question", content: "Question: What's one thing you love about our relationship?" },
  { type: "story", content: "Story: The night we stayed up talking until dawn." },
  { type: "challenge", content: "Challenge: Plan a picnic for the weekend." },
  { type: "question", content: "Question: What's your dream date with me?" },
  { type: "story", content: "Story: When I surprised you with flowers." },
  { type: "challenge", content: "Challenge: Dance to our favorite song." },
  // Add more up to 100
];

// Fill the rest
const templates = {
  story: ["Story: The moment we first held hands.", "Story: Our first kiss under the moonlight.", "Story: Building memories one day at a time.", "Story: Laughing until our sides hurt.", "Story: Supporting each other through tough times."],
  challenge: [
    "Challenge: Compliment your partner sincerely.",
    "Challenge: Share a secret you've never told.",
    "Challenge: Create a playlist of our songs.",
    "Challenge: Write down three things you appreciate.",
    "Challenge: Give a spontaneous hug.",
  ],
  question: [
    "Question: What's your favorite color on me?",
    "Question: If I were an animal, what would I be?",
    "Question: What's one adventure we should try?",
    "Question: How do you like to be comforted?",
    "Question: What's your love language?",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  for (let i = events.length; i < 100; i++) {
    const type = ["story", "challenge", "question"][Math.floor(Math.random() * 3)];
    const content = templates[type][Math.floor(Math.random() * templates[type].length)];
    events.push({ type, content });
  }

  createBoard();
  playerElement = document.createElement("div");
  playerElement.className = "player";
  document.querySelector('.square[data-number="1"]').appendChild(playerElement);

  document.getElementById("rollDice").addEventListener("click", rollDice);
  document.getElementById("cheatBtn").addEventListener("click", cheatToWin);
  document.getElementById("continueBtn").addEventListener("click", closeModal);
  document.getElementById("playAgainBtn").addEventListener("click", playAgain);
});

function createBoard() {
  const board = document.getElementById("board");
  for (let i = 100; i >= 1; i--) {
    const square = document.createElement("div");
    square.className = "square";
    square.dataset.number = i;
    square.textContent = i;
    if (snakes[i]) square.classList.add("snake");
    if (ladders[i]) square.classList.add("ladder");
    board.appendChild(square);
  }
}

function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  document.getElementById("message").textContent = `You rolled a ${dice}!`;
  movePlayer(dice);
}

function movePlayer(steps) {
  const newPosition = Math.min(currentPosition + steps, 100);
  updatePlayerPosition(newPosition);
  currentPosition = newPosition;

  // Check for snakes or ladders
  if (snakes[currentPosition]) {
    setTimeout(() => {
      updatePlayerPosition(snakes[currentPosition]);
      currentPosition = snakes[currentPosition];
      showEvent("Snake! Slithering down...", events[currentPosition - 1]);
    }, 1000);
  } else if (ladders[currentPosition]) {
    setTimeout(() => {
      updatePlayerPosition(ladders[currentPosition]);
      currentPosition = ladders[currentPosition];
      showEvent("Ladder! Climbing up!", events[currentPosition - 1]);
    }, 1000);
  } else {
    showEvent("You landed here!", events[currentPosition - 1]);
  }

  document.getElementById("currentPosition").textContent = `Current Position: ${currentPosition}`;
  if (currentPosition === 100) {
    showWinModal();
  }
}

function updatePlayerPosition(position) {
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => (square.innerHTML = square.dataset.number));
  document.querySelector(`.square[data-number="${position}"]`).appendChild(playerElement);
}

function showEvent(title, event) {
  document.getElementById("eventTitle").textContent = title;
  document.getElementById("eventContent").textContent = `${event.type.charAt(0).toUpperCase() + event.type.slice(1)}: ${event.content}`;
  document.getElementById("eventModal").style.display = "block";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}

function showWinModal() {
  document.getElementById("winModal").style.display = "block";
  // Hide the modal content but keep the modal overlay if needed
  document.querySelector(".modal-content.win-content").style.opacity = "0";
  document.querySelector(".modal-content.win-content").style.pointerEvents = "none";
  setTimeout(triggerFireworks, 3000);

  // Redirect to index.html after 20 seconds of flower animation
  setTimeout(() => {
    window.location.href = "index.html";
  }, 20000);
}

function cheatToWin() {
  currentPosition = 100;
  updatePlayerPosition(100);
  document.getElementById("currentPosition").textContent = "Current Position: 100";
  document.getElementById("message").textContent = "Cheated to victory!";
  showWinModal();
}

function playAgain() {
  document.getElementById("winModal").style.display = "none";
  document.querySelector(".modal-content.win-content").style.opacity = "1";
  document.querySelector(".modal-content.win-content").style.pointerEvents = "auto";
  currentPosition = 1;
  updatePlayerPosition(1);
  document.getElementById("currentPosition").textContent = "Current Position: 1";
  document.getElementById("message").textContent = "";
}

function triggerFireworks() {
  const canvas = document.getElementById("fireworksCanvas");
  const flower = document.getElementById("flower");

  canvas.style.display = "block";
  flower.classList.add("show-flower");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  const particles = [];
  const colors = ["#ff1493", "#ff69b4", "#ffc0cb", "#ffb6d9", "#ff85c0", "#ff00ff", "#ff0080", "#ff4da6"];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 7 + 3;
      this.speedX = (Math.random() - 0.5) * 18;
      this.speedY = (Math.random() - 0.5) * 18 - 3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.002; // slower decay for 20 seconds
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += 0.12; // gravity
      this.life -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create multiple burst patterns from multiple locations
  function createBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  }

  let burstCount = 0;
  const maxBursts = 30; // increased for 20 seconds duration
  const burstInterval = setInterval(() => {
    if (burstCount < maxBursts) {
      // Create bursts from different positions around the screen
      const positions = [
        [window.innerWidth * 0.15, window.innerHeight * 0.2],
        [window.innerWidth * 0.85, window.innerHeight * 0.2],
        [window.innerWidth * 0.5, window.innerHeight * 0.1],
        [window.innerWidth * 0.2, window.innerHeight * 0.5],
        [window.innerWidth * 0.8, window.innerHeight * 0.5],
        [window.innerWidth * 0.1, window.innerHeight * 0.8],
        [window.innerWidth * 0.9, window.innerHeight * 0.8],
        [window.innerWidth * 0.5, window.innerHeight * 0.9],
        [window.innerWidth * 0.3, window.innerHeight * 0.3],
        [window.innerWidth * 0.7, window.innerHeight * 0.3],
        [window.innerWidth * 0.25, window.innerHeight * 0.75],
        [window.innerWidth * 0.75, window.innerHeight * 0.75],
        [window.innerWidth * 0.15, window.innerHeight * 0.6],
        [window.innerWidth * 0.85, window.innerHeight * 0.6],
        [window.innerWidth * 0.5, window.innerHeight * 0.5],
      ];

      const pos = positions[burstCount % positions.length];
      createBurst(pos[0], pos[1], 60);
      burstCount++;
    } else {
      clearInterval(burstInterval);
    }
  }, 400);

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Continue animating if there are still particles or bursts are happening
    if (particles.length > 0 || burstCount < maxBursts) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete
      canvas.style.display = "none";
      flower.classList.remove("show-flower");
    }
  }

  animate();
}
