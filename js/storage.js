const STORAGE_KEYS = {
    currentChildID: 'bestiary_current_child',
    beastiaryPrefix: 'beastiary_',
    childrenList: 'bestiary_children'
};

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            const maxWidth = COMPRESSION.maxWidth;
            const maxHeight = COMPRESSION.maxHeight;
            if (width > height) {
                if (width > maxWidth) { height = height * (maxWidth / width); width = maxWidth; }
            } else {
                if (height > maxHeight) { width = width * (maxHeight / height); height = maxHeight; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', COMPRESSION.quality);
            resolve(base64);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Ошибка загрузки изображения')); };
        img.src = url;
    });
}

function generateChildID() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function getOrCreateChildID() {
    let id = localStorage.getItem(STORAGE_KEYS.currentChildID);
    if (!id) {
        id = generateChildID();
        localStorage.setItem(STORAGE_KEYS.currentChildID, id);
        addChildToList(id);
    }
    return id;
}

function addChildToList(id) {
    let list = getChildrenList();
    if (!list.includes(id)) { list.push(id); localStorage.setItem(STORAGE_KEYS.childrenList, JSON.stringify(list)); }
}

function getChildrenList() {
    const raw = localStorage.getItem(STORAGE_KEYS.childrenList);
    return raw ? JSON.parse(raw) : [];
}

function getBeastiaryKey(childID) {
    return STORAGE_KEYS.beastiaryPrefix + childID;
}

function loadBeasts(childID) {
    const key = getBeastiaryKey(childID);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

function saveBeasts(childID, beasts) {
    if (beasts.length > MAX_BEASTS) beasts = beasts.slice(-MAX_BEASTS);
    localStorage.setItem(getBeastiaryKey(childID), JSON.stringify(beasts));
}

function addBeast(childID, word, translation, description, imageBase64) {
    const beasts = loadBeasts(childID);
    const newBeast = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        word, translation, description, image: imageBase64,
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    beasts.push(newBeast);
    saveBeasts(childID, beasts);
    addChildToList(childID);
    return newBeast;
}

function childExists(id) {
    return localStorage.getItem(getBeastiaryKey(id)) !== null;
}

function resetCurrentChild() {
    localStorage.removeItem(STORAGE_KEYS.currentChildID);
}