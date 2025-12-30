const startupScreen = document.getElementById("startupScreen");
const startBtn = document.getElementById("startGameBtn");

startBtn.addEventListener("click", () => {
  // Fade out startup screen
  startupScreen.style.opacity = "0";
  startupScreen.style.pointerEvents = "none";

  setTimeout(() => {
    startupScreen.style.display = "none";
  }, 600);

  // Unlock speech & audio (important for iOS)
  speakCall(); 
  speechSynthesis.cancel();

  // Prevent screen sleep
  keepAwake?.();
});

function playSound(id) {
  const sound = document.getElementById(id);
  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});

}

/* ------PLAYER PANEL----- */
document.addEventListener("DOMContentLoaded", () => {

  const playerListEl = document.getElementById("playerList");
  const potTotalEl = document.getElementById("potTotal");

  let players = [];
  let potTotal = 0;

  document.getElementById("addPlayerBtn").onclick = () => {
    const nameInput = document.getElementById("playerNameInput");
    const name = nameInput.value.trim();
    if (!name) return;

    players.push({ name, bet: 0 });
    nameInput.value = "";
    renderPlayers();
  };

  document.getElementById("addBetBtn").onclick = () => {
    const betInput = document.getElementById("betAmount");
    const amount = parseFloat(betInput.value);
    if (isNaN(amount) || amount <= 0) return;

    players.forEach(p => p.bet += amount);
    potTotal += amount * players.length;

    betInput.value = "";
    renderPlayers();
  };

  function renderPlayers() {
    playerListEl.innerHTML = "";

    players.forEach((p, index) => {
      const li = document.createElement("li");
      li.className = "player";

      li.innerHTML = `
        <span>${p.name}</span>
        <span>$${p.bet.toFixed(2)}</span>
        <button data-index="${index}">🏆</button>
      `;

      li.querySelector("button").onclick = () => declareWinner(index);
      playerListEl.appendChild(li);
    });

    potTotalEl.textContent = `Pot: $${potTotal.toFixed(2)}`;
  }

function declareWinner(index) {
  const winner = players[index];

  showVictoryScreen(winner.name, potTotal);

  players.forEach(p => p.bet = 0);
  potTotal = 0;
  renderPlayers();
}

function showVictoryScreen(name, amount) {
  document.getElementById("winnerName").textContent = name;
  document.getElementById("winnerAmount").textContent =
    amount > 0 ? `Wins $${amount.toFixed(2)} 🎊` : "";

  playSound("bingoAudio");
  startFireworks();

  document.getElementById("victoryScreen").classList.add("active");
}

document.getElementById("newGameBtn").onclick = () => {
  document.getElementById("victoryScreen").classList.remove("active");
  resetGame();
};
  
const resizeBtn = document.getElementById("resizeToggle");
const app = document.getElementById("app");

resizeBtn.addEventListener("click", () => {
  app.classList.toggle("compact");
  resizeBtn.textContent = app.classList.contains("compact")
    ? "Normal View"
    : "Compact View";
});

}); // 👈 THIS closes DOMContentLoaded





