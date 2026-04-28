// i18n.js - 轻量级国际化翻译引擎

let currentLang = 'en';
let translations = {};

// 加载语言文件
async function loadLanguage(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        applyTranslations();
        localStorage.setItem('biztrack_lang', lang);
    } catch (error) {
        console.error('加载语言失败:', error);
    }
}

// 获取翻译文本
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

// 应用翻译到页面
function applyTranslations() {
    // 翻译文本内容
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // 翻译 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // 翻译 title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('biztrack_lang') || 'en';
    loadLanguage(savedLang);
});

// 导出函数供外部调用
window.i18n = { loadLanguage, t };
