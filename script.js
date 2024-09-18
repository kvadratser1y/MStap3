let taps = 0;
let energy = 100;
let lastTapTime = new Date();

const tapButton = document.getElementById('tapButton');
const tapCountElement = document.getElementById('tapCount');
const energyElement = document.getElementById('energy');
const rankElement = document.getElementById('rank');
const resetTimerElement = document.getElementById('resetTimer');

tapButton.addEventListener('click', () => {
    if (energy > 0) {
        taps++;
        energy--;
        updateDisplay();
        lastTapTime = new Date();
    }
});

function updateDisplay() {
    tapCountElement.textContent = taps;
    energyElement.textContent = energy;
    rankElement.textContent = calculateRank();
}

function calculateRank() {
    if (taps >= 1000000000) return 'Hellsteel🔥';
    if (taps >= 100000000) return 'Diamond💎';
    if (taps >= 1000000) return 'Gold🥇';
    if (taps >= 100000) return 'Iron🛠️';
    if (taps >= 10000) return 'Copper🥉';
    return 'Bronze🟫';
}

setInterval(() => {
    if (energy < 100) {
        energy++;
        updateDisplay();
    }

    const now = new Date();
    const timeSinceLastTap = (now - lastTapTime) / 1000; // in seconds
    const timeUntilReset = 24 * 60 * 60 - timeSinceLastTap;
    
    if (timeUntilReset <= 0) {
        taps = 0;
        updateDisplay();
        lastTapTime = now;
    } else {
        const hours = Math.floor(timeUntilReset / 3600);
        const minutes = Math.floor((timeUntilReset % 3600) / 60);
        const seconds = Math.floor(timeUntilReset % 60);
        resetTimerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}, 1000);

