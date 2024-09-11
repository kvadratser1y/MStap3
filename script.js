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

// Добавляем элемент для эффекта
const tapEffect = document.createElement('div');
tapEffect.id = 'tap-effect';
document.body.appendChild(tapEffect);

// Проверяем, есть ли ник в localStorage
if (nickname) {
    // Переходим сразу в игру, если ник уже сохранен
    nicknameDisplay.textContent = `Ваш ник: ${nickname}`;
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

    // Если прошло больше часа (3600000 миллисекунд), восстанавливаем 5000 энергии
    if (timePassed >= 3600000) {
        energy = 5000;
        lastEnergyRefill = now;
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
        localStorage.setItem('energy', energy);
        energyCountElement.textContent = energy;
        energyTimerElement.textContent = ''; // Скрываем таймер, если энергия восстановлена
    } else {
        // Показываем таймер, сколько времени осталось до восстановления энергии
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        energyTimerElement.textContent = `Энергия восстановится через: ${minutes} минут и ${seconds} секунд`;
    }
};

// Обновляем количество тапов и энергию
tapButton.addEventListener('click', (e) => {
    if (energy > 0) {
        tapCount++;
        energy--;

        tapCountElement.textContent = tapCount;
        energyCountElement.textContent = energy;

        // Сохраняем в localStorage
        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);

        // Показ эффекта нажатия
        const { left, top } = e.target.getBoundingClientRect();
        tapEffect.style.left = `${left + e.target.clientWidth / 2 - 25}px`; // Центрируем по горизонтали
        tapEffect.style.top = `${top + e.target.clientHeight / 2 - 25}px`; // Центрируем по вертикали
        tapEffect.style.opacity = 1;
        tapEffect.style.transform = 'translateY(-100px)';

        setTimeout(() => {
            tapEffect.style.opacity = 0;
            tapEffect.style.transform = 'translateY(-200px)';
        }, 50);

        updateLeaderboard(); // Обновляем таблицу лидеров после каждого тапа
    } else {
        alert('Недостаточно энергии! Подождите или купите подписку.');
    }
});

// Проверяем восстановление энергии каждые 1 секунду
setInterval(checkEnergyRefill, 1000);

// Проверка энергии при загрузке страницы
checkEnergyRefill();

// Обработка формы для выбора ника
nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputNickname = nicknameInput.value.trim();

    // Проверка на валидность ника (латинские буквы и максимум 2 цифры)
    const nicknameRegex = /^[a-zA-Z]{1,8}[0-9]{0,2}$/;

    if (nicknameRegex.test(inputNickname)) {
        localStorage.setItem('nickname', inputNickname);
        localStorage.setItem('tapCount', 0); // Обнуляем счетчик для нового пользователя
        localStorage.setItem('energy', 5000); // Восстанавливаем энергию
        window.location.reload(); // Перезагружаем страницу, чтобы ник обновился
    } else {
        errorMessage.textContent = 'Ник должен состоять из латинских букв и содержать максимум 2 цифры.';
    }
});

// Обновляем таблицу лидеров
function updateLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || {};
    leaderboardData[nickname] = tapCount;

    // Сохраняем обновленные данные в localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

    // Очищаем таблицу
    leaderboardTable.innerHTML = '';

    // Заполняем таблицу новыми данными
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
