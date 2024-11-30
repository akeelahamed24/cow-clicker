// Initialize points and passive rate from localStorage
let points = parseFloat(localStorage.getItem("points")) || 0;
let passiveRate = parseFloat(localStorage.getItem("passiveRate")) || 0;

// Retrieve purchased items from localStorage
let purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || {};

// Elements
const cow = document.getElementById("cow");
const clickCountDisplay = document.getElementById("click-count");
const itemsContainer = document.getElementById("items");

// Shop items configuration with levels
const shopItems = [
  { id: 1, name: "Passive Points", baseCost: 50, baseEffect: 0.5 },
  {
    id: 2,
    name: "Golden Cow",
    baseCost: 100,
    baseEffect: 2,
    passiveEffect: "goldenTouch",
  },
  { id: 3, name: "Auto Clicker", baseCost: 200, baseEffect: 5 },
  {
    id: 4,
    name: "Magic Hay",
    baseCost: 500,
    baseEffect: 10,
    passiveEffect: "haystorm",
  },
];

function applyGoldenCowEffects() {
  const goldenTouchInterval = setInterval(() => {
    // Golden Touch: Bonus multipliers for clicking
    showMessage("The Golden Cow has blessed you! Milk it for bonus points!");
    const originalClickHandler = cow.onclick;
    cow.onclick = () => {
      points += 2 + Math.random() * 4; // 2x to 5x bonus
      updateDisplay();
    };
    setTimeout(() => {
      cow.onclick = originalClickHandler; // Revert to original
    }, 10000);
  }, 60000); // Trigger every 60 seconds

  const goldenOverflowInterval = setInterval(() => {
    const bonusPoints = passiveRate * 0.2;
    points += bonusPoints;
    showMessage(
      `The Golden Cow overflows with wealth! You gained ${bonusPoints.toFixed(
        1
      )} points!`
    );
    updateDisplay();
  }, 30000); // Trigger every 30 seconds
}

function applyMagicHayEffects() {
  const haystormInterval = setInterval(() => {
    // Haystorm: Spawn clickable hay bales
    const hayBale = document.createElement("div");
    hayBale.classList.add("hay-bale");
    hayBale.textContent = "+50";
    document.body.appendChild(hayBale);

    hayBale.style.left = `${Math.random() * 80}%`;
    hayBale.style.top = `${Math.random() * 80}%`;

    hayBale.addEventListener("click", () => {
      points += 50;
      updateDisplay();
      hayBale.remove();
    });

    setTimeout(() => hayBale.remove(), 5000); // Remove after 5 seconds
  }, 30000); // Trigger every 30 seconds

  const hayFeverInterval = setInterval(() => {
    showMessage(
      "You're in a hay fever frenzy! Double the fun, double the points!"
    );
    const originalClickHandler = cow.onclick;
    cow.onclick = () => {
      points += 2; // Double points
      updateDisplay();
    };
    setTimeout(() => {
      cow.onclick = originalClickHandler;
    }, 15000);
  }, 60000); // Trigger every minute
}

// Load shop items dynamically into the UI
function loadShop() {
  itemsContainer.innerHTML = ""; // Clear container before adding updated items
  shopItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const currentLevel = purchasedItems[item.id]?.level || 0;
    const cost = item.baseCost * Math.pow(2, currentLevel);
    const effect = item.baseEffect * Math.pow(2, currentLevel);

    itemDiv.innerHTML = `
      <span>${item.name} Increase (Level ${currentLevel})</span>
      <p>Cost: ${cost.toFixed(1)}</p>
      <p>Effect: +${effect.toFixed(1)} Points/sec</p>
      <button id="buy-${item.id}" ${
      points < cost || currentLevel >= 5 ? "disabled" : ""
    }>
        ${currentLevel >= 5 ? "Max Level" : "Upgrade"}
      </button>
    `;

    itemsContainer.appendChild(itemDiv);

    const button = document.getElementById(`buy-${item.id}`);
    if (currentLevel < 5) {
      button.addEventListener("click", () =>
        buyItem(item, currentLevel, cost, effect)
      );
    }
  });
}

// Update shop buttons dynamically based on points and purchases
function updateShop() {
  shopItems.forEach((item) => {
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
cow.addEventListener("mousedown", () => {
  points++;
  updateDisplay();

  const hasGoldenCow = purchasedItems[2]?.level > 0; // Check if Golden Cow is bought
  const hasMagicHay = purchasedItems[4]?.level > 0; // Check if Magic Hay is bought

  if (hasGoldenCow && hasMagicHay) {
    cow.src = "cow-dance-both.gif"; // Dancing GIF for both items
  } else if (hasGoldenCow) {
    cow.src = "cow-dance-gold.gif"; // Dancing GIF for Golden Cow
  } else if (hasMagicHay) {
    cow.src = "cow-dance-hay.gif"; // Dancing GIF for Magic Hay
  } else {
    cow.src = "cow-dance.gif"; // Default dancing GIF
  }
});

cow.addEventListener("mouseup", () => {
  setTimeout(() => {
    const hasGoldenCow = purchasedItems[2]?.level > 0; // Check if Golden Cow is bought
    const hasMagicHay = purchasedItems[4]?.level > 0; // Check if Magic Hay is bought

    if (hasGoldenCow && hasMagicHay) {
      cow.src = "cow-both.png"; // Static image for both items
    } else if (hasGoldenCow) {
      cow.src = "cow-golden.png"; // Static image for Golden Cow
    } else if (hasMagicHay) {
      cow.src = "cow-hay.png"; // Static image for Magic Hay
    } else {
      cow.src = "cow.png"; // Default static image
    }
  }, 200); // Delay to allow the dance GIF to display briefly
});

// Passive points increment every second
setInterval(() => {
  points += passiveRate;
  updateDisplay();
  updateShop();
  localStorage.setItem("points", points); // Save points to localStorage
}, 1000);

function updateCowImage() {
  const hasGoldenCow = purchasedItems[2]?.level > 0; // Check if Golden Cow is bought
  const hasMagicHay = purchasedItems[4]?.level > 0; // Check if Magic Hay is bought

  if (hasGoldenCow && hasMagicHay) {
    cow.src = "cow-both.png"; // Both items purchased
  } else if (hasGoldenCow) {
    cow.src = "cow-golden.png"; // Only Golden Cow purchased
  } else if (hasMagicHay) {
    cow.src = "cow-hay.png"; // Only Magic Hay purchased
  } else {
    cow.src = "cow.png"; // Default cow image
  }
}

// Buy or upgrade shop items
function buyItem(item, currentLevel, cost, effect) {
  if (points >= cost && currentLevel < 5) {
    points -= cost;

    if (!purchasedItems[item.id]) {
      purchasedItems[item.id] = { level: 1 };
    } else {
      purchasedItems[item.id].level++;
    }

    if (item.id === 1) {
      passiveRate += effect; // Increase passive points
    } else if (item.passiveEffect === "goldenTouch" && currentLevel === 0) {
      applyGoldenCowEffects(); // Trigger Golden Cow effects
    } else if (item.passiveEffect === "haystorm" && currentLevel === 0) {
      applyMagicHayEffects(); // Trigger Magic Hay effects
    }

    // Update cow image based on purchased items
    updateCowImage();

    // Save to localStorage
    localStorage.setItem("points", points);
    localStorage.setItem("passiveRate", passiveRate);
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));

    // Reload the shop and update the UI
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
updateCowImage(); // Set the cow image based on saved purchases

// Reset game data (for development use only)
function resetGame() {
  if (
    confirm("Are you sure you want to reset the game? This cannot be undone.")
  ) {
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
document.getElementById("reset-game").addEventListener("click", resetGame);
