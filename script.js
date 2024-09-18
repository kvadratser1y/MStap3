let taps = 0;
let energy = 5000;
let lastTapTime = new Date();
let rebirths = 0;
let tapMultiplier = 1;
let hourlyBonus = 0;

const tapButton = document.getElementById('tapButton');
const tapCountElement = document.getElementById('tapCount');
const energyElement = document.getElementById('energy');
const rankElement = document.getElementById('rank');
const resetTimerElement = document.getElementById('resetTimer');
const rebirthsElement = document.getElementById('rebirths');
const userNicknameElement = document.getElementById('userNickname');

// Симуляция загрузки
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
}, 2000);

// Симуляция получения никнейма из Telegram
setTimeout(() => {
    userNicknameElement.textContent = 'CoolUser123';
}, 2500);

tapButton.addEventListener('click', () => {
    if (energy > 0) {
        taps += tapMultiplier;
        energy--;
        updateDisplay();
        lastTapTime = new Date();
    }
});

function updateDisplay() {
    tapCountElement.textContent = taps;
    energyElement.textContent = energy;
    rankElement.textContent = calculateRank();
    rebirthsElement.textContent = rebirths;
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

// Восстановление энергии каждый час
setInterval(() => {
    if (energy < 5000) {
        energy = Math.min(energy + 100, 5000);
        updateDisplay();
    }
    taps += hourlyBonus;
    updateDisplay();
}, 3600000);

// Сохранение данных
function saveData() {
    localStorage.setItem('gameData', JSON.stringify({
        taps,
        energy,
        lastTapTime,
        rebirths,
        tapMultiplier,
        hourlyBonus
    }));
}

// Загрузка данных
function loadData() {
    const savedData = JSON.parse(localStorage.getItem('gameData'));
    if (savedData) {
        taps = savedData.taps;
        energy = savedData.energy;
        lastTapTime = new Date(savedData.lastTapTime);
        rebirths = savedData.rebirths;
        tapMultiplier = savedData.tapMultiplier;
        hourlyBonus = savedData.hourlyBonus;
        updateDisplay();
    }
}

// Вызов функции загрузки данных при старте
loadData();

// Сохранение данных каждые 5 секунд
setInterval(saveData, 5000);

// Обработка перерождений
function rebirth() {
    if (taps >= 1000000) {
        rebirths++;
        tapMultiplier += 2;
        hourlyBonus += 10000;
        taps = 0;
        updateDisplay();
        alert(`Congratulations! You've been reborn! New tap multiplier: ${tapMultiplier}x, Hourly bonus: ${hourlyBonus}`);
    } else {
        alert("You need at least 1,000,000 taps to rebirth!");
    }
}

// Генерация реферальной ссылки
function generateReferralLink() {
    const randomString = Math.random().toString(36).substring(7);
    return `t.me/MStap_bot/${randomString}`;
}

// Обработка переключения страниц
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        if (pageId !== 'home') {
            document.getElementById(`${pageId}Page`).style.display = 'flex';
        }
    });
});

