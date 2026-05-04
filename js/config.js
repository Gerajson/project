const ASSETS = {
    mascot: 'assets/dino_main12.png',
    mascotSmall: 'assets/mascot_dino_small.jpg',
    iconUpload: 'assets/icon_camera.svg',
    iconStar: 'assets/icon_star.svg',
    placeholderBeast: 'assets/mascot_dino_small.jpg',
    bgParticles: 'assets/bg_particle.svg',
    // Иконки для меню (их тоже сгенерируй по аналогичным промптам)
    iconSchool: 'assets/school.jpg',
    iconWorkshop: 'assets/master.jpg',
    iconCollection: 'assets/collection.jpg'
};

const INTRO_EXAMPLES = [
    { word: 'Cat', transcription: '[kæt]', translation: 'кот', image: 'assets/intro_cat.png', description: 'Представь кота в рыцарских доспехах на заборе. "Кэт" — рыцарь охраняет замок!' },
    { word: 'Dog', transcription: '[dɔɡ]', translation: 'собака', image: 'assets/intro_dog.jpg', description: 'Собака-повар в колпаке готовит суп. "Дог" — повар размешивает суп половником.' },
    { word: 'Sun', transcription: '[sʌn]', translation: 'солнце', image: 'assets/intro_sun.png', description: 'Саня (Sun) забрался на небо и светит всем.' },
    { word: 'Book', transcription: '[bʊk]', translation: 'книга', image: 'assets/intro_book.png', description: 'Книга открылась, и из неё вылетел Бук (Book) — сказочный персонаж.' },
    { word: 'Apple', transcription: '[\'æpəl]', translation: 'яблоко', image: 'assets/intro_apple.png', description: 'Яблоко в аптеке (Apple). "Эпл" — яблоко, которое продают в аптеке.' }
];

const MAX_BEASTS = 6;
const COMPRESSION = { maxWidth: 300, maxHeight: 300, quality: 0.4 };
const PARENT_DEMO_PASSWORD = '1234';

const SELECTORS = {
    screens: {
        menu: 'screen-menu',
        school: 'screen-school',
        workshop: 'screen-workshop',
        collection: 'screen-collection',
        parent: 'screen-parent'
    },
    buttons: {
        goSchool: 'btn-go-school',
        goWorkshop: 'btn-go-workshop',
        goCollection: 'btn-go-collection',
        goParent: 'btn-go-parent',
        upload: 'btn-upload',
        saveBeast: 'btn-save-beast',
        backToMenuFromSchool: 'btn-back-to-menu-from-school',
        backToMenuFromWorkshop: 'btn-back-to-menu-from-workshop',
        backToMenuFromCollection: 'btn-back-to-menu-from-collection',
        backToMenuFromParent: 'btn-back-to-menu-from-parent',
        parentSearch: 'btn-parent-search'
    },
    containers: {
        introCards: 'intro-cards',
        bestiaryGrid: 'bestiary-grid',
        parentGallery: 'parent-gallery'
    },
    modal: {
        overlay: 'modal-overlay',
        image: 'modal-image',
        word: 'modal-word',
        date: 'modal-date',
        close: 'modal-close'
    }
};