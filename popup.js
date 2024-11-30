// Initialize points and passive rate from localStorage
let points = parseFloat(localStorage.getItem('points')) || 0;
let passiveRate = parseFloat(localStorage.getItem('passiveRate')) || 0;

// Retrieve purchased items from localStorage
let purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || {};

// Elements
const cow = document.getElementById('cow');
const clickCountDisplay = document.getElementById('click-count');
const itemsContainer = document.getElementById('items');

// Shop items configuration with levels
const shopItems = [
  { id: 1, name: "Passive Points", baseCost: 50, baseEffect: 0.5 },
  { id: 2, name: "Golden Cow", baseCost: 100, baseEffect: 2 },
  { id: 3, name: "Auto Clicker", baseCost: 200, baseEffect: 5 },
  { id: 4, name: "Magic Hay", baseCost: 500, baseEffect: 10 }
];

// Load shop items dynamically into the UI
function loadShop() {
  itemsContainer.innerHTML = ''; // Clear container before adding updated items
  shopItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const currentLevel = purchasedItems[item.id]?.level || 0;
    const cost = item.baseCost * Math.pow(2, currentLevel);
    const effect = item.baseEffect * Math.pow(2, currentLevel);

    itemDiv.innerHTML = `
      <span>${item.name} Increase (Level ${currentLevel})</span>
      <p>Cost: ${cost.toFixed(1)}</p>
      <p>Effect: +${effect.toFixed(1)} Points/sec</p>
      <button id="buy-${item.id}" ${points < cost || currentLevel >= 5 ? 'disabled' : ''}>
        ${currentLevel >= 5 ? "Max Level" : "Upgrade"}
      </button>
    `;

    itemsContainer.appendChild(itemDiv);

    const button = document.getElementById(`buy-${item.id}`);
    if (currentLevel < 5) {
      button.addEventListener('click', () => buyItem(item, currentLevel, cost, effect));
    }
  });
}

// Update shop buttons dynamically based on points and purchases
function updateShop() {
  shopItems.forEach(item => {
    const button = document.getElementById(`buy-${item.id}`);
    const currentLevel = purchasedItems[item.id]?.level || 0;
    const cost = item.baseCost * Math.pow(2, currentLevel);
    if (button) {
      if (currentLevel >= 5) {
        button.textContent = "Max Level";
        button.disabled = true;
      } else {
        button.disabled = points < cost;
      }
    }
  });
}

// Handle cow click (increase points and show dance animation)
cow.addEventListener('mousedown', () => {
  points++;
  updateDisplay();
  cow.src = 'cow-dance.gif'; // Change to dancing cow GIF
});

cow.addEventListener('mouseup', () => {
  setTimeout(() => {
    cow.src = 'cow.png'; // Change back to static cow image
  }, 200);
});

// Passive points increment every second
setInterval(() => {
  points += passiveRate;
  updateDisplay();
  updateShop();
  localStorage.setItem('points', points); // Save points to localStorage
}, 1000);

// Buy or upgrade shop items
function buyItem(item, currentLevel, cost, effect) {
  if (points >= cost && currentLevel < 5) {
    points -= cost; // Deduct points for the item

    // Update the purchased item levels
    if (!purchasedItems[item.id]) {
      purchasedItems[item.id] = { level: 1 };
    } else {
      purchasedItems[item.id].level++;
    }

    // Apply the item's effect
    if (item.id === 1) {
      // Increase passive rate for "Passive Points"
      passiveRate += effect;
    }

    // Save updated data to localStorage
    localStorage.setItem('points', points);
    localStorage.setItem('passiveRate', passiveRate);
    localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));

    // Reload the shop to reflect changes in the UI
    loadShop();
    updateDisplay();
  }
}

// Update the points display
function updateDisplay() {
  clickCountDisplay.textContent = `Points: ${points.toFixed(1)}`;
}

// Initialize the app
loadShop();
updateDisplay();


// Reset game data (for development use only)
function resetGame() {
  if (confirm("Are you sure you want to reset the game? This cannot be undone.")) {
    localStorage.clear(); // Clear all saved game data
    points = 0;
    passiveRate = 0;
    purchasedItems = {};

    // Reinitialize game state
    loadShop();
    updateDisplay();

    alert("Game has been reset!");
  }
}

// Attach event listener to the reset button
document.getElementById('reset-game').addEventListener('click', resetGame);
