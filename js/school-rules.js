/**
 * Модуль "Школа" – 6 интерактивных правил мнемотехники
 * После прохождения всех правил автоматически запускается карусель примеров
 */
const SchoolRules = (() => {
    // DOM-элементы будут получены при init
    let rulesContainer, examplesContainer;
    let ruleTitleEl, ruleDescEl, interactiveScene, understandBtn, quizContainer, scrollCard;
    let fireworksCanvas, mascotBubble;

    // Данные всех шести правил (используем ту же структуру, что и в исходных файлах)
    const rules = [
        {
            title: 'Правило 1: Преувеличение',
            desc: 'Сделай образ огромным или очень смешным — так мозгу будет легче его запомнить!',
            sceneType: 'exaggeration',
            questions: [
                { text: "Какой образ подходит под правило преувеличения?", options: [
                    { emoji: "🐭🧀", text: "Мышка с обычным сыром", correct: false },
                    { emoji: "🐭🏔️🧀", text: "Мышка с сыром размером с гору", correct: true }
                ]},
                { text: "Что лучше запомнит мозг?", options: [
                    { emoji: "📏", text: "Обычный размер", correct: false },
                    { emoji: "🎈", text: "Огромный, надутый предмет", correct: true }
                ]},
                { text: "Как сделать образ ярким?", options: [
                    { emoji: "🌈✨", text: "Добавить преувеличение и эмоции", correct: true },
                    { emoji: "📄", text: "Оставить всё как есть", correct: false }
                ]}
            ]
        },
        {
            title: 'Правило 2: Движение',
            desc: 'Представь, что объекты оживают: они двигаются, издают звуки. Нажми на каждый, чтобы увидеть!',
            sceneType: 'movement',
            questions: [
                { text: "Что помогает лучше запомнить слово?", options: [
                    { emoji: "🛑", text: "Оставить объект неподвижным", correct: false },
                    { emoji: "🏃", text: "Представить, как объект движется и звучит", correct: true }
                ]},
                { text: "Как мозг реагирует на движущиеся образы?", options: [
                    { emoji: "📉", text: "Запоминает хуже", correct: false },
                    { emoji: "🧠✨", text: "Легче связывает с эмоциями и действиями", correct: true }
                ]},
                { text: "Что такое «звуковая ассоциация»?", options: [
                    { emoji: "🔇", text: "Когда объект молчит", correct: false },
                    { emoji: "🔊", text: "Характерный звук, который сопровождает образ", correct: true }
                ]}
            ]
        },
        {
            title: 'Правило 3: Эмоции',
            desc: 'Добавь образу эмоцию: удивление, страх или радость! Нажми на смайлики, чтобы увидеть настроение.',
            sceneType: 'emotions',
            questions: [
                { text: "Какая эмоция помогает запомнить смешной образ?", options: [
                    { emoji: "😴", text: "Скука", correct: false },
                    { emoji: "😄", text: "Радость или удивление", correct: true }
                ]},
                { text: "Как лучше запоминаются эмоциональные образы?", options: [
                    { emoji: "🤔", text: "Хуже, потому что отвлекают", correct: false },
                    { emoji: "💖", text: "Ярче и надёжнее, потому что вызывают чувства", correct: true }
                ]},
                { text: "Что делать, чтобы слово вызывало эмоцию?", options: [
                    { emoji: "🎭", text: "Представить смешную или неожиданную ситуацию", correct: true },
                    { emoji: "📄", text: "Ничего не добавлять", correct: false }
                ]}
            ]
        },
        {
            title: 'Правило 4: Замена',
            desc: 'Представь, что один предмет превратился в другой или играет его роль. Нажми на машинку, чтобы ворона стала водителем!',
            sceneType: 'replacement',
            questions: [
                { text: "Что такое замена в воображении?", options: [
                    { emoji: "🚗", text: "Машина просто едет", correct: false },
                    { emoji: "🦅🚘", text: "Ворона становится водителем машины", correct: true }
                ]},
                { text: "Почему замена помогает запоминать?", options: [
                    { emoji: "📄", text: "Потому что всё остаётся обычным", correct: false },
                    { emoji: "✨", text: "Мозг удивляется и запоминает нелепицу", correct: true }
                ]},
                { text: "Выбери лучший пример замены:", options: [
                    { emoji: "📏", text: "Линейка лежит на столе", correct: false },
                    { emoji: "🍌🎸", text: "Банан превратился в гитару", correct: true }
                ]}
            ]
        },
        {
            title: 'Правило 5: Соединение несоединимого',
            desc: 'Объедини две несовместимые вещи, чтобы получился фантастический образ! Нажми на рыбу и на вентилятор.',
            sceneType: 'combination',
            questions: [
                { text: "Что значит соединить несоединимое?", options: [
                    { emoji: "📏+📏", text: "Сложить две одинаковые вещи", correct: false },
                    { emoji: "🐟✈️", text: "Создать летающую рыбу", correct: true }
                ]},
                { text: "Какой пример лучше всего иллюстрирует правило?", options: [
                    { emoji: "🪑", text: "Обычный стул", correct: false },
                    { emoji: "🎤🪑", text: "Поющий стул", correct: true }
                ]},
                { text: "Зачем нужно соединять необычное?", options: [
                    { emoji: "📉", text: "Это скучно и не запоминается", correct: false },
                    { emoji: "🧠💥", text: "Яркий контраст сильно врезается в память", correct: true }
                ]}
            ]
        },
        {
            title: 'Правило 6: Цепочка действий',
            desc: 'Придумай короткую историю из двух-трёх шагов! Нажми на картинки по порядку, чтобы оживить сюжет.',
            sceneType: 'chain',
            questions: [
                { text: "Что такое цепочка действий для запоминания?", options: [
                    { emoji: "🔢", text: "Просто список слов", correct: false },
                    { emoji: "📖➡️😄", text: "Короткая история с событиями", correct: true }
                ]},
                { text: "Сколько шагов лучше всего использовать?", options: [
                    { emoji: "1️⃣", text: "Только один шаг", correct: false },
                    { emoji: "2️⃣-3️⃣", text: "Два или три шага, чтобы было интересно", correct: true }
                ]},
                { text: "Как мозг реагирует на истории?", options: [
                    { emoji: "🤷", text: "Запоминает только первое и последнее", correct: false },
                    { emoji: "🎬", text: "Связывает события в единую картину и запоминает надёжнее", correct: true }
                ]}
            ]
        }
    ];

    let currentRule = 0;
    let sceneClicks = 0;
    let requiredClicks = 3;
    let correctInQuiz = 0;
    let currentQuestion = 0;
    let totalQuestions = 3;

    // Печатание текста (уже знакомый typewriter)
    function typeWriter(element, text, speed = 60) {
        element.textContent = '';
        element.style.borderRight = '3px solid var(--primary)';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.style.borderRight = 'none';
            }
        }, speed);
    }

    // Звук (без изменений, но добавим проверку на существование AudioContext)
    function playTone(freq, duration) {
        try {
            const a = new (window.AudioContext || window.webkitAudioContext)();
            const o = a.createOscillator();
            const g = a.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.value = 0.08;
            o.connect(g); g.connect(a.destination);
            o.start();
            setTimeout(() => { o.stop(); a.close(); }, duration);
        } catch(e) {}
    }

    // Фейерверк (адаптирован под наш контейнер)
    let fireworksActive = false;
    let fireworksParticles = [];
    let ctx;

    function resizeFireworksCanvas() {
        if (fireworksCanvas) {
            fireworksCanvas.width = rulesContainer.clientWidth || window.innerWidth;
            fireworksCanvas.height = rulesContainer.clientHeight || window.innerHeight;
        }
    }

    class FireworkParticle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 6 + 2;
            this.radius = Math.random() * 4 + 2;
            this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= this.decay;
            this.speed *= 0.98;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function startFireworks() {
        if (!fireworksCanvas) return;
        fireworksCanvas.style.display = 'block';
        resizeFireworksCanvas();
        fireworksActive = true;
        fireworksParticles = [];
        const cx = fireworksCanvas.width / 2;
        const cy = fireworksCanvas.height / 2;
        for (let i = 0; i < 80; i++) {
            fireworksParticles.push(new FireworkParticle(cx, cy));
        }
        if (!ctx) ctx = fireworksCanvas.getContext('2d');
        requestAnimationFrame(animateFireworks);
    }

    function animateFireworks() {
        if (!fireworksActive || !ctx) return;
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        fireworksParticles = fireworksParticles.filter(p => p.alpha > 0);
        fireworksParticles.forEach(p => { p.update(); p.draw(ctx); });
        if (fireworksParticles.length > 0) {
            requestAnimationFrame(animateFireworks);
        } else {
            fireworksCanvas.style.display = 'none';
            fireworksActive = false;
        }
    }

    function stopFireworks() {
        fireworksActive = false;
        fireworksParticles = [];
        if (ctx) ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        if (fireworksCanvas) fireworksCanvas.style.display = 'none';
    }

    // Основная функция инициализации одного правила
    function initRule(ruleIndex) {
        const rule = rules[ruleIndex];
        currentRule = ruleIndex;
        totalQuestions = rule.questions.length;

        // Заголовок и описание
        typeWriter(ruleTitleEl, rule.title);
        ruleDescEl.textContent = rule.desc;

        // Сброс сцены
        interactiveScene.innerHTML = '';
        sceneClicks = 0;
        requiredClicks = 3; // для большинства правил, для replacement переопределим

        interactiveScene.classList.remove('complete');
        understandBtn.classList.remove('active');
        understandBtn.disabled = true;
        quizContainer.style.display = 'none';
        quizContainer.innerHTML = '';
        correctInQuiz = 0;
        currentQuestion = 0;
        stopFireworks();
        if (fireworksCanvas) fireworksCanvas.style.display = 'none';

        // Подсказка
        const oldHint = interactiveScene.querySelector('.scene-hint');
        if (oldHint) oldHint.remove();
        const hint = document.createElement('div');
        hint.className = 'scene-hint';
        interactiveScene.appendChild(hint);

        // Наполняем сцену в зависимости от типа
        if (rule.sceneType === 'exaggeration') {
            hint.textContent = '👆 Нажми на яблоко, чтобы увеличить!';
            const apple = createSceneObject('🍎', 'ex1');
            apple.addEventListener('click', () => {
                if (understandBtn.disabled === false) return;
                apple.classList.add('enlarged');
                playTone(600, 100);
                if (!apple.dataset.clicked) {
                    apple.dataset.clicked = 'true';
                    sceneClicks++;
                    checkCompletion();
                }
            });
            createSceneObject('🐭', 'ex2').addEventListener('click', () => playTone(500, 80));
            createSceneObject('🧀', 'ex3').addEventListener('click', () => playTone(700, 80));
        }
        else if (rule.sceneType === 'movement') {
            hint.textContent = '👆 Нажимай на объекты, чтобы они ожили!';
            const mov = ['🚗', '⚽', '🐦'];
            const pitches = [200, 500, 800];
            mov.forEach((emoji, idx) => {
                const obj = createSceneObject(emoji, `mov${idx}`);
                obj.addEventListener('click', () => {
                    if (understandBtn.disabled === false) return;
                    obj.classList.add('move-anim');
                    playTone(pitches[idx], 150);
                    setTimeout(() => obj.classList.remove('move-anim'), 600);
                    if (!obj.dataset.clicked) {
                        obj.dataset.clicked = 'true';
                        sceneClicks++;
                        checkCompletion();
                    }
                });
            });
        }
        else if (rule.sceneType === 'emotions') {
            hint.textContent = '👆 Нажми на всех смайликов, чтобы увидеть эмоции!';
            const emotions = ['😲', '😨', '😄'];
            emotions.forEach((emoji, idx) => {
                const obj = createSceneObject('😐', `emoji${idx}`);
                obj.addEventListener('click', () => {
                    if (understandBtn.disabled === false) return;
                    if (!obj.dataset.clicked) {
                        obj.textContent = emoji;
                        obj.dataset.clicked = 'true';
                        sceneClicks++;
                        playTone(600 + idx * 100, 100);
                        checkCompletion();
                    }
                });
            });
        }
        else if (rule.sceneType === 'replacement') {
            hint.textContent = '👆 Нажми на машинку, чтобы ворона стала водителем!';
            requiredClicks = 1;
            const car = createSceneObject('🚗', 'rep1');
            car.addEventListener('click', () => {
                if (understandBtn.disabled === false) return;
                if (!car.dataset.clicked) {
                    car.dataset.clicked = 'true';
                    car.textContent = '🦅🚘';
                    car.classList.add('replaced');
                    playTone(300, 100);
                    setTimeout(() => car.classList.remove('replaced'), 500);
                    sceneClicks = requiredClicks;
                    checkCompletion();
                    hint.textContent = '✅ Ворона-водитель! Нажимай "Понятно!"';
                }
            });
            createSceneObject('🐦', 'rep2').addEventListener('click', () => playTone(500, 80));
            createSceneObject('🧢', 'rep3').addEventListener('click', () => playTone(700, 80));
        }
        else if (rule.sceneType === 'combination') {
            hint.textContent = '👆 Нажми на рыбу и вентилятор, чтобы они объединились!';
            let fishClicked = false, fanClicked = false;
            const fish = createSceneObject('🐟', 'comb1');
            const fan = createSceneObject('🌀', 'comb2');
            fish.addEventListener('click', () => {
                if (understandBtn.disabled === false || fishClicked) return;
                fishClicked = true;
                fish.style.borderColor = 'var(--primary)';
                playTone(400, 100);
                if (fishClicked && fanClicked) completeCombination();
            });
            fan.addEventListener('click', () => {
                if (understandBtn.disabled === false || fanClicked) return;
                fanClicked = true;
                fan.style.borderColor = 'var(--primary)';
                playTone(600, 100);
                if (fishClicked && fanClicked) completeCombination();
            });
            function completeCombination() {
                fish.textContent = '🐟✈️';
                fan.textContent = '💨';
                hint.textContent = '✅ Летающая рыба! Нажимай "Понятно!"';
                sceneClicks = requiredClicks;
                checkCompletion();
            }
            createSceneObject('🎵', 'comb3').addEventListener('click', () => playTone(900, 80));
        }
        else if (rule.sceneType === 'chain') {
            hint.textContent = '👆 Нажимай по порядку: яблоко → голова → смех!';
            const steps = ['🍎', '🙂', '😄'];
            let stepIndex = 0;
            steps.forEach((emoji, idx) => {
                const obj = createSceneObject(emoji, `chain${idx}`);
                obj.addEventListener('click', () => {
                    if (understandBtn.disabled === false) return;
                    if (idx === stepIndex) {
                        obj.style.borderColor = 'var(--primary)';
                        stepIndex++;
                        sceneClicks++;
                        playTone(500 + idx * 200, 80);
                        if (stepIndex === steps.length) {
                            hint.textContent = '✅ История ожила! Нажимай "Понятно!"';
                            checkCompletion();
                        } else {
                            hint.textContent = `Теперь нажми на ${steps[stepIndex]}`;
                        }
                    } else {
                        playTone(200, 100);
                    }
                });
            });
        }

        function createSceneObject(emoji, id) {
            const div = document.createElement('div');
            div.className = 'scene-object';
            div.textContent = emoji;
            div.id = id;
            interactiveScene.appendChild(div);
            return div;
        }

        function checkCompletion() {
            if (sceneClicks >= requiredClicks) {
                interactiveScene.classList.add('complete');
                understandBtn.classList.add('active');
                understandBtn.disabled = false;
                if (mascotBubble) {
                    mascotBubble.textContent = 'Супер! Теперь тест!';
                    setTimeout(() => { mascotBubble.textContent = 'Жми на предметы!'; }, 2000);
                }
            }
        }
    }

    // Тесты
    function showQuiz() {
        scrollCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            scrollCard.style.transform = 'scale(1)';
            quizContainer.style.display = 'flex';
            quizContainer.innerHTML = '';
            currentQuestion = 0;
            totalQuestions = rules[currentRule].questions.length;
            renderQuestion();
        }, 150);
    }

    function renderQuestion() {
        if (currentQuestion >= totalQuestions) {
            finishQuiz();
            return;
        }
        const q = rules[currentRule].questions[currentQuestion];
        let html = `<div class="quiz-question">${q.text}</div><div class="options">`;
        q.options.forEach((opt, idx) => {
            html += `
                <div class="option-card" data-index="${idx}" data-correct="${opt.correct}">
                    <span class="option-emoji">${opt.emoji}</span>
                    <span>${opt.text}</span>
                </div>
            `;
        });
        html += `</div><div class="quiz-progress">`;
        for (let i = 0; i < totalQuestions; i++) {
            html += `<div class="dot ${i < currentQuestion ? 'filled' : ''}"></div>`;
        }
        html += `</div>`;
        quizContainer.innerHTML = html;
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function() {
                const isCorrect = this.dataset.correct === 'true';
                handleAnswer(this, isCorrect);
            });
        });
    }

    function handleAnswer(card, isCorrect) {
        if (isCorrect) {
            card.classList.add('correct');
            playTone(800, 150);
            setTimeout(() => playTone(1000, 200), 200);
            correctInQuiz++;
        } else {
            card.classList.add('wrong');
            playTone(300, 300);
            setTimeout(() => {
                const correctCard = document.querySelector('.option-card[data-correct="true"]');
                if (correctCard) correctCard.classList.add('correct');
            }, 600);
        }
        document.querySelectorAll('.option-card').forEach(c => c.style.pointerEvents = 'none');
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < totalQuestions) {
                renderQuestion();
            } else {
                finishQuiz();
            }
        }, 1500);
    }

    function finishQuiz() {
        quizContainer.innerHTML = `
            <div style="font-size:24px; color:var(--black100); font-weight:800; text-align:center;">
                🎉 Ты ответил на ${correctInQuiz} из ${totalQuestions}!
            </div>
            <button class="btn-understand active" id="continueBtn">Продолжить</button>
        `;
        startFireworks();
        document.getElementById('continueBtn').addEventListener('click', () => {
            stopFireworks();
            if (currentRule < rules.length - 1) {
                initRule(currentRule + 1);
            } else {
                // Все правила пройдены — переключаемся на примеры
                finishAllRules();
            }
        });
    }

    function finishAllRules() {
        // Скрываем контейнер правил, показываем примеры
        rulesContainer.style.display = 'none';
        examplesContainer.style.display = 'flex';
        // Запускаем карусель примеров (функция initExamples определена в child.js)
        if (typeof window.initExamples === 'function') {
            window.initExamples();
        }
    }

    // Инициализация модуля
    function init(container1, container2) {
        rulesContainer = container1;
        examplesContainer = container2;

        // Создаём внутреннюю структуру правил (как в исходных файлах)
        rulesContainer.innerHTML = `
            <div class="bg-decor">
                <div class="bg-blob blob1"></div>
                <div class="bg-blob blob2"></div>
                <div class="bg-blob blob3"></div>
            </div>
            <div class="particles-layer" id="particlesLayer"></div>
            <div class="scroll-card" id="ruleCard">
                <div class="rule-title" id="ruleTitle"></div>
                <div class="rule-desc" id="ruleDesc"></div>
                <div class="interactive-scene" id="interactiveScene"></div>
                <button class="btn-understand" id="understandBtn" disabled>
                    <span>🦖</span> Понятно!
                </button>
                <div class="quiz-container" id="quizContainer" style="display: none;"></div>
            </div>
            <div class="mascot" id="mascot">
                <div class="mascot-bubble" id="mascotBubble">Жми на предметы!</div>
                <svg viewBox="0 0 100 100" width="90" height="90">
                    <ellipse cx="50" cy="85" rx="30" ry="10" fill="rgba(0,0,0,0.12)"/>
                    <path d="M18,58 Q8,45 16,34 Q24,40 26,50" fill="#87D34C" stroke="#2F2F45" stroke-width="3"/>
                    <ellipse cx="50" cy="55" rx="26" ry="24" fill="#87D34C" stroke="#2F2F45" stroke-width="3"/>
                    <ellipse cx="50" cy="62" rx="16" ry="14" fill="#FFFFFF" stroke="#2F2F45" stroke-width="3"/>
                    <circle cx="38" cy="49" r="4" fill="#EAE6FF" stroke="#2F2F45" stroke-width="2"/>
                    <circle cx="58" cy="46" r="3" fill="#EAE6FF" stroke="#2F2F45" stroke-width="2"/>
                    <rect x="34" y="75" width="9" height="13" rx="5" fill="#87D34C" stroke="#2F2F45" stroke-width="3"/>
                    <rect x="53" y="75" width="9" height="13" rx="5" fill="#87D34C" stroke="#2F2F45" stroke-width="3"/>
                    <circle cx="72" cy="40" r="14" fill="#87D34C" stroke="#2F2F45" stroke-width="3"/>
                    <circle cx="76" cy="36" r="5" fill="white" stroke="#2F2F45" stroke-width="2"/>
                    <circle cx="78" cy="35" r="2.5" fill="#2F2F45"/>
                    <path d="M70,44 Q74,48 79,44" fill="none" stroke="#2F2F45" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="69" cy="42" r="3" fill="#FF6170" opacity="0.8"/>
                </svg>
            </div>
            <canvas class="fireworks-canvas" id="fireworksCanvas" style="display: none;"></canvas>
        `;

        // Получаем ссылки на новые элементы
        ruleTitleEl = document.getElementById('ruleTitle');
        ruleDescEl = document.getElementById('ruleDesc');
        interactiveScene = document.getElementById('interactiveScene');
        understandBtn = document.getElementById('understandBtn');
        quizContainer = document.getElementById('quizContainer');
        scrollCard = document.getElementById('ruleCard');
        fireworksCanvas = document.getElementById('fireworksCanvas');
        mascotBubble = document.getElementById('mascotBubble');

        // Кнопка "Понятно"
        understandBtn.addEventListener('click', () => {
            if (understandBtn.disabled) return;
            showQuiz();
        });

        // Фоновые частицы
        const particlesLayer = document.getElementById('particlesLayer');
        function createParticle() {
            const el = document.createElement('div');
            el.className = 'particle';
            const icons = ['🌸','✨','✏️','📖','💫','🔮','A','B','C'];
            el.textContent = icons[Math.floor(Math.random()*icons.length)];
            el.style.left = Math.random()*100 + '%';
            el.style.animationDuration = (Math.random()*8 + 6) + 's';
            el.style.fontSize = (Math.random()*20 + 14) + 'px';
            particlesLayer.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
        setInterval(createParticle, 900);
        for (let i=0; i<10; i++) setTimeout(createParticle, i*150);

        // Стартуем с первого правила
        initRule(0);
    }

    // Запуск примеров (карусели) будет вызываться из child.js
    window.initExamples = null; // будет переопределено в child.js

    return { init, finishAllRules };
})();