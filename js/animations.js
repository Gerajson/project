/**
 * Волшебные анимации интерфейса (без маскота)
 * Добавляет живость: пульсация иконок меню, волшебная пыль на кнопках, 
 * танец букв в заголовках, радужное свечение полей, конфетти-буквы в коллекции, 
 * кастомный курсор-кисть в мастерской.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Пульсация иконок в главном меню (уже есть в CSS, но можно усилить)
    // Делаем более заметной: добавляем класс .menu-card-icon при наведении на карточку
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.menu-card-icon').style.animation = 'float 1s ease-in-out infinite';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('.menu-card-icon').style.animation = 'float 3s ease-in-out infinite';
        });
    });

    // 2. Волшебная пыль при наведении на кнопки
    function spawnSparkles(e) {
        const btn = e.currentTarget;
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = (e.clientX - btn.getBoundingClientRect().left) + 'px';
        sparkle.style.top = (e.clientY - btn.getBoundingClientRect().top) + 'px';
        sparkle.style.setProperty('--tx', (Math.random() * 20 - 10) + 'px');
        sparkle.style.setProperty('--ty', (Math.random() * -20 - 5) + 'px');
        btn.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', spawnSparkles);
    });

    // 3. Танец букв в заголовках (один раз при появлении)
    function animateTitle(selector) {
        const el = document.querySelector(selector);
        if (!el || el.dataset.animated) return;
        el.dataset.animated = true;
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.animation = `letterDance 0.4s ${i * 0.03}s ease both`;
            el.appendChild(span);
        });
    }
    // Запускаем при активации соответствующего экрана (можно по вызову, но проще через MutationObserver или при смене экранов)
    // Для простоты добавим вызовы в switchScreen: расширим app.js, но чтобы не трогать его,
    // просто будем проверять через небольшие интервалы или добавим события.
    // Сделаем доступным глобально:
    window.animateTitle = animateTitle;

    // 4. Радужное свечение активных полей
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes rainbowGlow {
            0% { box-shadow: 0 0 0 3px rgba(118,95,222,0.3); }
            50% { box-shadow: 0 0 0 3px rgba(231,219,118,0.5), 0 0 15px rgba(255,97,112,0.3); }
            100% { box-shadow: 0 0 0 3px rgba(118,95,222,0.3); }
        }
        .input:focus, .textarea:focus {
            animation: rainbowGlow 2s ease-in-out infinite;
        }
        .sparkle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #FFD166;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            animation: sparkleFade 0.6s ease-out forwards;
        }
        @keyframes sparkleFade {
            0% { opacity: 1; transform: translate(0,0) scale(1); }
            100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        @keyframes letterDance {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    // 5. Конфетти-буквы на фоне коллекции
    function createLetterConfetti() {
        const container = document.querySelector('.bestiary-container') || document.getElementById(SELECTORS.screens.collection);
        if (!container || container.dataset.confettiActive) return;
        container.dataset.confettiActive = true;
        const letters = ['A','B','C','D','E','?','!','✦'];
        setInterval(() => {
            const letter = document.createElement('span');
            letter.className = 'letter-confetti';
            letter.textContent = letters[Math.floor(Math.random() * letters.length)];
            letter.style.left = Math.random() * 100 + '%';
            letter.style.animationDuration = (Math.random() * 2 + 3) + 's';
            letter.style.fontSize = (Math.random() * 14 + 12) + 'px';
            container.appendChild(letter);
            setTimeout(() => letter.remove(), 4000);
        }, 800);
    }
    // Добавим стиль
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .letter-confetti {
                position: absolute;
                bottom: 0;
                opacity: 0.6;
                color: rgba(118,95,222,0.5);
                font-weight: bold;
                animation: floatUp 4s linear infinite;
                pointer-events: none;
                z-index: 0;
            }
            @keyframes floatUp {
                0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        </style>
    `);
    window.createLetterConfetti = createLetterConfetti;

    // 6. Кастомный курсор-кисть в мастерской
    const workshopScreen = document.getElementById(SELECTORS.screens.workshop);
    if (workshopScreen) {
        workshopScreen.style.cursor = 'url(assets/icon_camera.svg) 16 16, auto'; // замени на свою иконку кисти
    }

    // Автоматически запускаем анимации при входе на соответствующие экраны
    // Используем наблюдатель за активным экраном, чтобы не менять app.js
    const observer = new MutationObserver(() => {
        const active = document.querySelector('.screen.active');
        if (!active) return;
        if (active.id === SELECTORS.screens.menu) {
            // пульсация уже работает
        } else if (active.id === SELECTORS.screens.school) {
            animateTitle('.intro-heading');
        } else if (active.id === SELECTORS.screens.workshop) {
            animateTitle('.workshop-title');
            // курсор уже установлен
        } else if (active.id === SELECTORS.screens.collection) {
            animateTitle('.bestiary-title');
            createLetterConfetti();
        }
    });
    observer.observe(document.getElementById('app'), { attributes: true, subtree: true, attributeFilter: ['class'] });

});
window.triggerConfetti = function triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    for (let i = 0; i < 18; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-24px';
        piece.style.animationDelay = (Math.random() * 0.25) + 's';
        container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 1400);
};
