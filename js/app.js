document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        menu: document.getElementById(SELECTORS.screens.menu),
        school: document.getElementById(SELECTORS.screens.school),
        workshop: document.getElementById(SELECTORS.screens.workshop),
        collection: document.getElementById(SELECTORS.screens.collection),
        parent: document.getElementById(SELECTORS.screens.parent)
    };
    const modalOverlay = document.getElementById('modal-overlay');

    function switchScreen(from, to) {
        if (!from || !to || from === to) return;
        from.classList.add('transitioning');
        const handler = () => {
            from.removeEventListener('transitionend', handler);
            from.classList.remove('active', 'transitioning');
            to.classList.add('active');
            from.classList.remove('transitioning');
        };
        from.addEventListener('transitionend', handler);
    }
    window.switchScreen = switchScreen;

    window.showModal = function(imageSrc, word, date) {
        document.getElementById(SELECTORS.modal.image).src = imageSrc;
        document.getElementById(SELECTORS.modal.word).textContent = word;
        document.getElementById(SELECTORS.modal.date).textContent = date;
        modalOverlay.classList.add('visible');
    };
    function closeModal() {
        modalOverlay.classList.remove('visible');
    }

    function loadAssets() {
        document.querySelectorAll('[data-asset]').forEach(el => {
            const key = el.getAttribute('data-asset');
            if (ASSETS[key] && el.tagName === 'IMG') el.src = ASSETS[key];
        });
    }

    function bindNavigation() {
        // Из меню в режимы
        document.getElementById(SELECTORS.buttons.goSchool).addEventListener('click', () => {
            if (typeof stopMenuMagic === 'function') stopMenuMagic();
            switchScreen(screens.menu, screens.school);
            if (typeof initSchool === 'function') initSchool();
        });
        document.getElementById(SELECTORS.buttons.goWorkshop).addEventListener('click', () => {
            if (typeof stopMenuMagic === 'function') stopMenuMagic();
            switchScreen(screens.menu, screens.workshop);
            if (typeof initWorkshop === 'function') initWorkshop();
        });
        document.getElementById(SELECTORS.buttons.goCollection).addEventListener('click', () => {
            if (typeof stopMenuMagic === 'function') stopMenuMagic();
            switchScreen(screens.menu, screens.collection);
            if (typeof showCollection === 'function') showCollection();
        });
        document.getElementById(SELECTORS.buttons.goParent).addEventListener('click', () => {
            if (typeof stopMenuMagic === 'function') stopMenuMagic();
            switchScreen(screens.menu, screens.parent);
            if (typeof initParent === 'function') initParent();
        });

        // Кнопки "Назад в меню"
        document.getElementById(SELECTORS.buttons.backToMenuFromSchool).addEventListener('click', () => {
            switchScreen(screens.school, screens.menu);
            if (typeof initMenuMagic === 'function') initMenuMagic();
        });
        document.getElementById(SELECTORS.buttons.backToMenuFromWorkshop).addEventListener('click', () => {
            switchScreen(screens.workshop, screens.menu);
            if (typeof initMenuMagic === 'function') initMenuMagic();
        });
        document.getElementById(SELECTORS.buttons.backToMenuFromCollection).addEventListener('click', () => {
            switchScreen(screens.collection, screens.menu);
            if (typeof initMenuMagic === 'function') initMenuMagic();
        });
        document.getElementById(SELECTORS.buttons.backToMenuFromParent).addEventListener('click', () => {
            switchScreen(screens.parent, screens.menu);
            if (typeof initMenuMagic === 'function') initMenuMagic();
        });

        // Модальное окно
        document.getElementById(SELECTORS.modal.close).addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    }

    loadAssets();
    screens.menu.classList.add('active');
    if (typeof initMenuMagic === 'function') initMenuMagic();
    bindNavigation();
    console.log('Живой Бестиарий v2 запущен');
});