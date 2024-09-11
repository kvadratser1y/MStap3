// Инициализация переменных
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 5000;
let lastEnergyRefill = localStorage.getItem('lastEnergyRefill') ? parseInt(localStorage.getItem('lastEnergyRefill')) : Date.now();
let nickname = localStorage.getItem('nickname');

// Элементы DOM
const tapCountElement = document.getElementById('tap-count');
const energyCountElement = document.getElementById('energy-count');
const energyTimerElement = document.getElementById('energy-timer');
const nicknameDisplay = document.getElementById('nickname-display');
const tapButton = document.getElementById('tap-button');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const errorMessage = document.getElementById('error-message');
const gameSection = document.getElementById('game-section');
const nicknameSection = document.getElementById('nickname-section');
const leaderboardTable = document.getElementById('leaderboard').querySelector('tbody');

// Элемент для эффекта нажатия
const tapEffect = document.getElementById('tap-effect');

// Проверяем, есть ли ник в localStorage
if (nickname) {
    // Переходим сразу в игру, если ник уже сохранен
    nicknameDisplay.textContent = `Your Nickname: ${nickname}`;
    nicknameSection.style.display = 'none';
    gameSection.style.display = 'block';

    // Обновляем текст с тапами и энергией при загрузке страницы
    tapCountElement.textContent = tapCount;
    energyCountElement.textContent = energy;
    updateLeaderboard(); // Обновляем таблицу лидеров

} else {
    // Если ника нет, отображаем форму ввода ника
    nicknameSection.style.display = 'block';
}

// Проверяем, прошло ли достаточно времени для восстановления энергии
const checkEnergyRefill = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;
    const timeRemaining = 3600000 - timePassed;

    if (timePassed >= 3600000) {
        energy = 5000;
        lastEnergyRefill = now;
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
        localStorage.setItem('energy', energy);
        energyCountElement.textContent = energy;
        energyTimerElement.textContent = ''; // Скрываем таймер, если энергия восстановлена
    } else {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        energyTimerElement.textContent = `Energy refills in: ${minutes}m ${seconds}s`;
    }
};

// Функция обработки нажатий
tapButton.addEventListener('click', (e) => {
    if (energy > 0) {
        tapCount++;
        energy--;

        tapCountElement.textContent = tapCount;
        energyCountElement.textContent = energy;

        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);

        // Показ эффекта нажатия
        const { left, top } = e.target.getBoundingClientRect();
        tapEffect.style.left = `${left + e.target.clientWidth / 2 - 25}px`;
        tapEffect.style.top = `${top + e.target.clientHeight / 2 - 25}px`;
        tapEffect.style.opacity = 1;
        tapEffect.style.transform = 'translateY(-100px)';

        setTimeout(() => {
            tapEffect.style.opacity = 0;
            tapEffect.style.transform = 'translateY(-200px)';
        }, 500);

        updateLeaderboard(); // Обновляем таблицу лидеров после каждого тапа
    } else {
        alert('Out of energy! Wait or purchase a subscription.');
    }
});

// Проверяем восстановление энергии каждые 1 секунду
setInterval(checkEnergyRefill, 1000);

// Обработка формы для выбора ника
nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputNickname = nicknameInput.value.trim();

    const nicknameRegex = /^[a-zA-Z]{1,8}[0-9]{0,2}$/;

    if (nicknameRegex.test(inputNickname)) {
        localStorage.setItem('nickname', inputNickname);
        localStorage.setItem('tapCount', 0);
        localStorage.setItem('energy', 5000);
        window.location.reload();
    } else {
        errorMessage.textContent = 'Nickname must contain only letters and up to 2 digits.';
    }
});

// Обновляем таблицу лидеров
function updateLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || {};
    leaderboardData[nickname] = tapCount;

    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

    leaderboardTable.innerHTML = '';

    for (const player in leaderboardData) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const tapsCell = document.createElement('td');
        nameCell.textContent = player;
        tapsCell.textContent = leaderboardData[player];
        row.appendChild(nameCell);
        row.appendChild(tapsCell);
        leaderboardTable.appendChild(row);
    }
}
