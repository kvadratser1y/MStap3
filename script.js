// Initialize variables
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 5000;
let lastEnergyRefill = localStorage.getItem('lastEnergyRefill') ? parseInt(localStorage.getItem('lastEnergyRefill')) : Date.now();
let nickname = localStorage.getItem('nickname');

// DOM Elements
const tapCountElement = document.getElementById('tap-count');
const energyCountElement = document.getElementById('energy-count');
const nicknameDisplay = document.getElementById('nickname-display');
const tapButton = document.getElementById('tap-button');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const errorMessage = document.getElementById('error-message');
const gameSection = document.getElementById('game-section');
const nicknameSection = document.getElementById('nickname-section');
const tapEffect = document.getElementById('tap-effect');

// Function to update tap count and energy display
const updateDisplay = () => {
    tapCountElement.textContent = tapCount;
    energyCountElement.textContent = energy;
};

// Function to check energy refill
const checkEnergyRefill = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;

    // If more than an hour has passed, refill energy
    if (timePassed >= 3600000) {
        energy = 5000;
        lastEnergyRefill = now;
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
        localStorage.setItem('energy', energy);
        updateDisplay();
    }
};

// Function to handle tap button click
const handleTap = (e) => {
    if (energy > 0) {
        tapCount++;
        energy--;

        updateDisplay();

        // Save to localStorage
        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);

        // Handle tap effect
        createTapEffect(e);

    } else {
        alert('Not enough energy! Please wait or buy a subscription.');
    }
};

// Function to create tap effect
const createTapEffect = (e) => {
    const buttonRect = tapButton.getBoundingClientRect();

    // Position the tap effect at the center of the button
    const x = buttonRect.left + buttonRect.width / 2 - 25; // 25 is half of tap-effect width
    const y = buttonRect.top + buttonRect.height / 2 - 25;

    tapEffect.style.left = `${x}px`;
    tapEffect.style.top = `${y}px`;
    tapEffect.style.opacity = 1;
    tapEffect.style.transform = 'translateY(-100px)';

    // After animation, reset the tap effect
    setTimeout(() => {
        tapEffect.style.opacity = 0;
        tapEffect.style.transform = 'translateY(-200px)';
    }, 700);
};

// Function to initialize the game
const initializeGame = () => {
    nicknameDisplay.textContent = `Your Nickname: ${nickname}`;
    nicknameSection.style.display = 'none';
    gameSection.style.display = 'block';
    updateDisplay();
};

// Event Listener for tap button
tapButton.addEventListener('click', handleTap);

// Event Listener for nickname form submission
nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputNickname = nicknameInput.value.trim();

    // Validate nickname: only Latin letters and up to 2 numbers
    const nicknameRegex = /^[a-zA-Z]{1,8}[0-9]{0,2}$/;

    if (nicknameRegex.test(inputNickname)) {
        nickname = inputNickname;
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('tapCount', 0); // Reset tap count for new user
        localStorage.setItem('energy', 5000); // Reset energy
        localStorage.setItem('lastEnergyRefill', Date.now());
        initializeGame();
    } else {
        errorMessage.textContent = 'Nickname must consist of Latin letters and contain up to 2 numbers.';
    }
});

// On page load, check if nickname exists
window.onload = () => {
    if (nickname) {
        initializeGame();
    } else {
        nicknameSection.style.display = 'block';
    }

    // Update display in case values are loaded from localStorage
    updateDisplay();

    // Check energy refill on load
    checkEnergyRefill();

    // Set interval to check energy refill every minute
    setInterval(checkEnergyRefill, 60000);
};
