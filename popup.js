// Initialize points from localStorage
let points = parseFloat(localStorage.getItem('points')) || 0;
let passiveRate = 0; // Initially, no passive points
const cow = document.getElementById('cow');
const clickCountDisplay = document.getElementById('click-count');
const itemsContainer = document.getElementById('items');

// Shop items configuration
const shopItems = [
  { id: 1, name: "Passive Points: +0.5/sec", cost: 50, effect: 0.5 },
  { id: 2, name: "Golden Cow", cost: 100, effect: 2 },
  { id: 3, name: "Auto Clicker", cost: 200, effect: 5 },
  { id: 4, name: "Magic Hay", cost: 500, effect: 10 }
];

// Load shop items dynamically into the UI
function loadShop() {
  shopItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.innerHTML = `
      <span>${item.name}</span>
      <button id="buy-${item.id}" ${points < item.cost ? 'disabled' : ''}>Buy (${item.cost})</button>
    `;
    itemsContainer.appendChild(itemDiv);

    // Add event listener to the button
    const button = document.getElementById(`buy-${item.id}`);
    button.addEventListener('click', () => buyItem(item));
  });
}

// Update shop buttons dynamically based on points
function updateShop() {
  shopItems.forEach(item => {
    const button = document.getElementById(`buy-${item.id}`);
    if (button) {
      button.disabled = points < item.cost;
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

// Buy shop items
function buyItem(item) {
  if (points >= item.cost) {
    points -= item.cost; // Deduct points for the item
    if (item.id === 1) {
      // Increase passive rate for the first item
      passiveRate += item.effect;
    }
    updateDisplay();
    updateShop();
    localStorage.setItem('points', points); // Save updated points
  }
}

// Update the points display
function updateDisplay() {
  clickCountDisplay.textContent = `Points: ${points.toFixed(1)}`;
}

// Initialize the app
loadShop();
updateDisplay();
