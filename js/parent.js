function initParent() {
    const input = document.getElementById('input-child-id');
    const gallery = document.getElementById(SELECTORS.containers.parentGallery);
    const notFound = document.getElementById('parent-not-found');

    function resetParent() {
        if (input) input.value = '';
        if (gallery) gallery.innerHTML = '';
        if (notFound) notFound.classList.add('hidden');
    }
    resetParent();

    const searchBtn = document.getElementById(SELECTORS.buttons.parentSearch);
    searchBtn.addEventListener('click', () => {
        const id = input.value.trim().toLowerCase();
        if (!id) return;
        if (!childExists(id)) {
            notFound.classList.remove('hidden');
            gallery.innerHTML = '';
            return;
        }
        notFound.classList.add('hidden');
        const beasts = loadBeasts(id);
        gallery.innerHTML = '';
        beasts.forEach(beast => {
            const card = document.createElement('div');
            card.className = 'bestiary-card';
            card.innerHTML = `
                <img class="card-image" src="${beast.image}" alt="${beast.word}">
                <div class="card-info">
                    <div class="card-word">${beast.word} — ${beast.translation}</div>
                    <div class="card-desc">${beast.description}</div>
                    <div class="card-date">${beast.date}</div>
                </div>`;
            card.addEventListener('click', () => showModal(beast.image, `${beast.word} (${beast.translation})`, beast.date));
            gallery.appendChild(card);
        });
    });
    input.addEventListener('keypress', e => { if (e.key === 'Enter') searchBtn.click(); });
}

window.initParent = initParent;