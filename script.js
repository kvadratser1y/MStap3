let nickname = localStorage.getItem('nickname');
let taps = parseInt(localStorage.getItem('taps')) || 0;
let energy = parseInt(localStorage.getItem('energy')) || 5000;
let lastTapTime = new Date(localStorage.getItem('lastTapTime')) || new Date();
let rebirths = parseInt(localStorage.getItem('rebirths')) || 0;
let tapMultiplier = parseInt(localStorage.getItem('tapMultiplier')) || 1;
let dailyRewardsCollected = JSON.parse(localStorage.getItem('dailyRewardsCollected')) || {};

const tapButton = document.getElementById('tapButton');
const tapCountElement = document.getElementById('tapCount');
const energyElement = document.getElementById('energy');
const rankElement = document.getElementById('rank');
const resetTimerElement = document.getElementById('resetTimer');
const rebirthsElement = document.getElementById('rebirths');
const userNicknameElement = document.getElementById('userNickname');

const dailyRewards = [
    '1 day - 10000 taps ✅',
    '2 day - 10 keys ✅',
    '3 day - 20000 taps ✅',
    '4 day - 15 keys ✅',
    '5 day - 5000 taps ✅',
    '6 day - 6000 taps ✅',
    '7 day - Super Reward 🎁 ✅',
    '8 day - 8000 taps ✅',
    '9 day - 9000 taps ✅',
    '10 day - 10000 taps ✅',
    '11 day - 11000 taps ✅',
    '12 day - 12000 taps ✅',
    '13 day - 13000 taps ✅',
    '14 day - Super Reward 🎁 ✅',
    '15 day - 15000 taps ✅',
    '16 day - 16000 taps ✅',
    '17 day - 17000 taps ✅',
    '18 day - 18000 taps ✅',
    '19 day - 19000 taps ✅',
    '20 day - 20000 taps ✅',
    '21 day - Super Reward 🎁 ✅',
    '22 day - 22000 taps ✅',
    '23 day - 23000 taps ✅',
    '24 day - 24000 taps ✅',
    '25 day - 25000 taps ✅',
    '26 day - 26000 taps ✅',
    '27 day - 27000 taps ✅',
    '28 day - Super Reward 🎁 ✅',
    '29 day - 29000 taps ✅',
    '30 day - 30000 taps ✅'
];

function updateDisplay() {
    tapCountElement.textContent = taps;
    energyElement.textContent = energy;
    rankElement.textContent = calculateRank();
    rebirthsElement.textContent = rebirths;
    saveProgress();
}

function calculateRank() {
    if (taps >= 1000000000) return 'Hellsteel🔥';
    if (taps >= 100000000) return 'Diamond💎';
    if (taps >= 1000000) return 'Gold🥇';
    if (taps >= 100000) return 'Iron🛠️';
    if (taps >= 10000) return 'Copper🥉';
    return 'Bronze🟫';
}

tapButton.addEventListener('click', () => {
    if (energy > 0) {
        taps += tapMultiplier;
        energy--;
        updateDisplay();
        lastTapTime = new Date();
        saveProgress();
    }
});

function updateDailyRewards() {
    const dailyRewardsElement = document.getElementById('dailyRewards');
    dailyRewardsElement.innerHTML = dailyRewards.map((reward, index) => {
        const collected = dailyRewardsCollected[index] ? '✅' : '❌';
        return `<p>${reward} ${collected}</p>`;
    }).join('');
}

function saveNickname() {
    const inputVal = document.getElementById('nicknameInput').value;
    if (inputVal) {
        localStorage.setItem('nickname', inputVal);
        nickname = inputVal;
        document.getElementById('userNickname').textContent = inputVal;
        document.getElementById('nicknameModal').style.display = 'none';
    }
}

function saveProgress() {
    localStorage.setItem('taps', taps);
    localStorage.setItem('energy', energy);
    localStorage.setItem('lastTapTime', lastTapTime);
    localStorage.setItem('rebirths', rebirths);
    localStorage.setItem('tapMultiplier', tapMultiplier);
    localStorage.setItem('dailyRewardsCollected', JSON.stringify(dailyRewardsCollected));
}

function closePage() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById('game').style.display = 'flex';
}

function generateReferralLink() {
    const randomString = Math.random().toString(36).substring(7);
    return `t.me/MStap_bot/${randomString}`;
}

setInterval(() => {
    const now = new Date();
    const timeSinceLastTap = (now - lastTapTime) / 1000;
    const timeUntilReset = Math.max(24 * 60 * 60 - timeSinceLastTap, 0);
    
    const hours = Math.floor(timeUntilReset / 3600);
    const minutes = Math.floor((timeUntilReset % 3600) / 60);
    const seconds = Math.floor(timeUntilReset % 60);
    
    resetTimerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeUntilReset <= 0) {
        taps = 0;
        updateDisplay();
        lastTapTime = now;
        saveProgress();
    }
}, 1000);

setInterval(() => {
    if (energy < 5000) {
        energy++;
        updateDisplay();
        saveProgress();
    }
}, 3600000);

window.onload = function() {
    if (!nickname) {
        document.getElementById('nicknameModal').style.display = 'block';
    } else {
        document.getElementById('userNickname').textContent = nickname;
    }
    updateDisplay();
    updateDailyRewards();
};

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        
        if (pageId !== 'home') {
            document.getElementById(`${pageId}Page`
