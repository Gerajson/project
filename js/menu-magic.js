/**
 * menu-magic.js — Волшебные анимации главного меню
 * Полностью автономен: сам добавляет слои в DOM, управляет анимациями.
 * Используй window.initMenuMagic() при входе в меню.
 */
(function() {
    let starAnimationId = null;
    let particleInterval = null;

    // Главная функция инициализации
    window.initMenuMagic = function() {
        const menuScreen = document.getElementById('screen-menu');
        if (!menuScreen) return;

        // Контейнер main-menu (если его нет, создаём)
        let mainMenu = menuScreen.querySelector('.main-menu');
        if (!mainMenu) {
            mainMenu = document.createElement('div');
            mainMenu.className = 'main-menu';
            menuScreen.appendChild(mainMenu);
        }

        // 1. АКВАРЕЛЬНЫЙ ФОН
        if (!document.getElementById('menu-bg-layer')) {
            const bg = document.createElement('div');
            bg.id = 'menu-bg-layer';
            mainMenu.appendChild(bg);
        }

        // 2. ОБЛАКА
        if (!document.querySelector('.menu-clouds')) {
            const clouds = document.createElement('div');
            clouds.className = 'menu-clouds';
            for (let i = 1; i <= 4; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'menu-cloud';
                cloud.id = 'menu-cloud' + i;
                clouds.appendChild(cloud);
            }
            mainMenu.appendChild(clouds);
        }

        // 3. ЗВЁЗДНОЕ НЕБО
        let canvas = document.getElementById('menuStarCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'menuStarCanvas';
            mainMenu.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = menuScreen.clientWidth;
            canvas.height = menuScreen.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const stars = [];
        const COUNT = 100;
        class Star {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.r = Math.random() * 2.2 + 0.5;
                this.alpha = Math.random() * 0.6 + 0.4;
                this.speed = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.y -= this.speed * 0.4;
                if (this.y < -5) { this.y = canvas.height + 5; this.x = Math.random() * canvas.width; }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,209,102,${this.alpha})`;
                ctx.shadowColor = '#FFD166';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        // Заполняем звёздами при первом запуске
        if (stars.length === 0) {
            for (let i = 0; i < COUNT; i++) stars.push(new Star());
        }

        // Останавливаем предыдущую анимацию звёзд, если была
        if (starAnimationId) cancelAnimationFrame(starAnimationId);
        function animateStars() {
            // Останавливаемся, если экран меню больше не активен
            if (!document.getElementById('screen-menu')?.classList.contains('active')) {
                starAnimationId = null;
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => { s.update(); s.draw(); });
            starAnimationId = requestAnimationFrame(animateStars);
        }
        starAnimationId = requestAnimationFrame(animateStars);

        // 4. ПАРЯЩИЕ ЧАСТИЦЫ
        let particlesLayer = document.getElementById('menu-particles-layer');
        if (!particlesLayer) {
            particlesLayer = document.createElement('div');
            particlesLayer.id = 'menu-particles-layer';
            mainMenu.appendChild(particlesLayer);
        }
        // Очищаем старые частицы и интервал
        particlesLayer.innerHTML = '';
        if (particleInterval) clearInterval(particleInterval);

        function addParticle() {
            if (!document.getElementById('screen-menu')?.classList.contains('active')) return;
            const p = document.createElement('div');
            p.className = 'menu-particle';
            const icons = ['🍎', '✨', '✏️', '⭐', '🔮', '📖', '🌸', '💫'];
            p.textContent = icons[Math.floor(Math.random() * icons.length)];
            p.style.left = Math.random() * 100 + '%';
            p.style.top = '-5%';
            p.style.animationDuration = (Math.random() * 6 + 5) + 's';
            particlesLayer.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
        particleInterval = setInterval(addParticle, 900);
        // Стартовая пачка частиц
        for (let i = 0; i < 12; i++) setTimeout(addParticle, i * 200);

        // 5. МАСКОТ (с подсказками)
        if (!document.getElementById('menu-mascot-container')) {
            const mascotContainer = document.createElement('div');
            mascotContainer.id = 'menu-mascot-container';
            // Берём путь к маскоту из глобального ASSETS (должен быть объявлен в config.js)
            const mascotSrc = (typeof ASSETS !== 'undefined' && ASSETS.mascot) 
                ? ASSETS.mascot 
                : 'assets/mascot_dino.png';
            mascotContainer.innerHTML = `
                <div id="menu-mascot-cloud"></div>
                <div id="menu-speech-bubble">Привет! Я Дино 🦖</div>
                <img id="menu-mascot-img" src="${mascotSrc}" alt="Динозаврик" />
            `;
            mainMenu.appendChild(mascotContainer);

            // Всплывающие подсказки
            const bubble = document.getElementById('menu-speech-bubble');
            function showBubble(msg, time = 2500) {
                if (bubble) {
                    bubble.textContent = msg;
                    bubble.classList.add('show');
                    clearTimeout(window._bubbleTimer);
                    window._bubbleTimer = setTimeout(() => bubble.classList.remove('show'), time);
                }
            }
            // Привязываем подсказки к кнопкам меню
            const attach = (selector, msg) => {
                const el = document.querySelector(selector);
                if (el) el.addEventListener('mouseenter', () => showBubble(msg));
            };
            attach('#btn-go-school', 'Узнай 6 правил! 📚');
            attach('#btn-go-workshop', 'Придумай ассоциацию! 🎨');
            attach('#btn-go-collection', 'Твои существа ждут! 📖');
            attach('#btn-go-parent', 'Только для взрослых 🤫');
            mascotContainer.addEventListener('click', () => showBubble('Я всегда рядом! 🦖'));
        }
    };

    // Остановить все анимации, когда уходим из меню
    window.stopMenuMagic = function() {
        if (starAnimationId) {
            cancelAnimationFrame(starAnimationId);
            starAnimationId = null;
        }
        if (particleInterval) {
            clearInterval(particleInterval);
            particleInterval = null;
        }
    };
})();