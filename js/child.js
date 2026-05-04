let currentChildID = null;
let lastAddedBeastId = null;
let introCurrentIndex = 0;
let introCards = [];

// ------------------- Школа (правила + карусель) -------------------
function initSchool() {
    currentChildID = getOrCreateChildID();
    const rulesContainer = document.getElementById('rules-container');
    const examplesContainer = document.getElementById('examples-container');

    // Показываем правила, прячем примеры
    rulesContainer.style.display = 'block';
    examplesContainer.style.display = 'none';

    // Запускаем модуль правил (из school-rules.js)
    if (typeof SchoolRules !== 'undefined') {
        SchoolRules.init(rulesContainer, examplesContainer);
    }
}

// Эта функция вызывается из school-rules.js после завершения всех правил
window.initExamples = function() {
    const container = document.getElementById(SELECTORS.containers.introCards); // #intro-cards
    const prevBtn = document.getElementById('btn-intro-prev');
    const nextBtn = document.getElementById('btn-intro-next');
    const counter = document.getElementById('intro-counter');
    const finishBtn = document.getElementById('btn-intro-finish');

    // Делаем контейнер примеров видимым (на случай, если display ещё не flex)
    document.getElementById('examples-container').style.display = 'flex';

    container.innerHTML = '';
    introCards = [];
    INTRO_EXAMPLES.forEach((ex, i) => {
        const card = document.createElement('div');
        card.className = 'intro-card';
        card.style.transform = `translateX(${i * 100}%)`;
        card.innerHTML = `<img src="${ex.image}" alt="${ex.word}"><div class="word">${ex.word}</div><div class="transcription">${ex.transcription}</div><div class="translation">${ex.translation}</div><div class="description">${ex.description}</div>`;
        container.appendChild(card);
        introCards.push(card);
    });
    introCurrentIndex = 0;
    updateIntroView(prevBtn, nextBtn, counter, finishBtn);

    // Удаляем старые обработчики, чтобы не дублировались при повторном входе
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    const newFinish = finishBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    finishBtn.parentNode.replaceChild(newFinish, finishBtn);

    newPrev.addEventListener('click', () => {
        if (introCurrentIndex > 0) {
            introCurrentIndex--;
            updateIntroView(newPrev, newNext, counter, newFinish);
        }
    });
    newNext.addEventListener('click', () => {
        if (introCurrentIndex < INTRO_EXAMPLES.length - 1) {
            introCurrentIndex++;
            updateIntroView(newPrev, newNext, counter, newFinish);
        }
    });
    newFinish.addEventListener('click', () => {
        const schoolScreen = document.getElementById(SELECTORS.screens.school);
        const workshopScreen = document.getElementById(SELECTORS.screens.workshop);
        window.switchScreen(schoolScreen, workshopScreen);
        if (typeof initWorkshop === 'function') initWorkshop();
    });
};

// Обновление отображения карусели
function updateIntroView(prevBtn, nextBtn, counter, finishBtn) {
    introCards.forEach((card, i) => {
        card.style.transform = `translateX(${(i - introCurrentIndex) * 100}%)`;
        card.style.opacity = i === introCurrentIndex ? '1' : '0.4';
    });
    counter.textContent = `${introCurrentIndex + 1} / ${INTRO_EXAMPLES.length}`;
    prevBtn.disabled = introCurrentIndex === 0;
    nextBtn.disabled = introCurrentIndex === INTRO_EXAMPLES.length - 1;
    if (introCurrentIndex === INTRO_EXAMPLES.length - 1) finishBtn.classList.remove('hidden');
    else finishBtn.classList.add('hidden');
}

// ------------------- Мастерская -------------------
function initWorkshop() {
    if (!currentChildID) currentChildID = getOrCreateChildID();
    const wordInput = document.getElementById('input-word');
    const transInput = document.getElementById('input-translation');
    const descInput = document.getElementById('input-description');
    const uploadBtn = document.getElementById(SELECTORS.buttons.upload);
    const fileInput = document.getElementById('input-upload');
    const saveBtn = document.getElementById(SELECTORS.buttons.saveBeast);
    const loader = document.getElementById('upload-loader');
    let uploadedImageData = null;

    function checkForm() {
        saveBtn.disabled = !(wordInput.value.trim() && transInput.value.trim() && uploadedImageData);
    }

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        uploadBtn.classList.add('hidden');
        loader.classList.remove('hidden');
        try {
            uploadedImageData = await compressImage(file);
            uploadBtn.textContent = 'Рисунок выбран';
            uploadBtn.classList.remove('hidden');
            loader.classList.add('hidden');
            checkForm();
        } catch (err) {
            alert('Ошибка загрузки рисунка');
            uploadBtn.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    wordInput.addEventListener('input', checkForm);
    transInput.addEventListener('input', checkForm);

    saveBtn.addEventListener('click', () => {
        if (!uploadedImageData) return;
        const word = wordInput.value.trim();
        const translation = transInput.value.trim();
        const description = descInput.value.trim();
        const beast = addBeast(currentChildID, word, translation, description, uploadedImageData);
        lastAddedBeastId = beast.id;
        // Очищаем форму
        wordInput.value = ''; transInput.value = ''; descInput.value = '';
        uploadedImageData = null; uploadBtn.textContent = 'Загрузить рисунок'; saveBtn.disabled = true;
        // Переходим в коллекцию с анимацией
        const workshopScreen = document.getElementById(SELECTORS.screens.workshop);
        const collectionScreen = document.getElementById(SELECTORS.screens.collection);
        window.switchScreen(workshopScreen, collectionScreen);
        showCollection(true);
        if (typeof triggerConfetti === 'function') triggerConfetti();
    });

    // Ссылка на школу
    document.getElementById('btn-go-school-from-workshop').addEventListener('click', () => {
        const workshopScreen = document.getElementById(SELECTORS.screens.workshop);
        const schoolScreen = document.getElementById(SELECTORS.screens.school);
        window.switchScreen(workshopScreen, schoolScreen);
        initSchool();
    });
}

// ------------------- Коллекция -------------------
function showCollection(animateLast = false) {
    if (!currentChildID) currentChildID = getOrCreateChildID();
    const grid = document.getElementById(SELECTORS.containers.bestiaryGrid);
    const emptyState = document.getElementById('bestiary-empty');
    const beasts = loadBeasts(currentChildID);
    grid.innerHTML = '';

    if (beasts.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        beasts.forEach(beast => {
            const card = document.createElement('div');
            card.className = 'bestiary-card';
            if (animateLast && beast.id === lastAddedBeastId) { card.classList.add('beast-enter'); lastAddedBeastId = null; }
            card.innerHTML = `
                <img class="card-image" src="${beast.image}" alt="${beast.word}">
                <div class="card-info">
                    <div class="card-word">${beast.word} — ${beast.translation}</div>
                    <div class="card-desc">${beast.description}</div>
                    <div class="card-date">${beast.date}</div>
                </div>`;
            card.addEventListener('click', () => showModal(beast.image, `${beast.word} (${beast.translation})`, beast.date));
            grid.appendChild(card);
        });
    }
}