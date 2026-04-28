let currentLang = 'en';
let translations = {};

async function loadLanguage(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        applyTranslations();
        localStorage.setItem('biztrack_lang', lang);
    } catch (error) {
        console.error('i18n error:', error);
    }
}

function t(key) {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            return key;
        }
    }
    return result || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    if (typeof updateDashboardCards === 'function') {
        updateDashboardCards();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('biztrack_lang') || 'en';
    loadLanguage(savedLang);
});

window.i18n = { loadLanguage, t };
