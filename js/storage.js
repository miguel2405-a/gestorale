// storage.js
export const StorageKey = 'gestorJuridicoProData';

export let data = {
    clients: [],
    cases: [],
    documents: [],
    calendar: []
};

export function loadData() {
    const raw = localStorage.getItem(StorageKey);
    if (raw) {
        try {
            const obj = JSON.parse(raw);
            Object.assign(data, obj);
        } catch (e) {}
    }
}

export function saveData() {
    localStorage.setItem(StorageKey, JSON.stringify(data));
}

