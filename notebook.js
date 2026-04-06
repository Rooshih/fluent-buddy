const geptUsefulPatterns = [
    { pattern: /\b(would you like|do you want)\b/i, label: "Offering Something", chinese: "你想要...嗎？" },
    { pattern: /\b(how much is|how much does)\b/i, label: "Asking for Price", chinese: "多少錢？" },
    { pattern: /\b(could you help|can you help)\b/i, label: "Requesting Help", chinese: "你能幫忙嗎？" },
    { pattern: /\b(i am looking for)\b/i, label: "Searching", chinese: "我在找..." },
    { pattern: /\b(if i were you)\b/i, label: "Giving Advice", chinese: "如果我是你..." },
    { pattern: /\b(what should i do)\b/i, label: "Asking for Advice", chinese: "我該怎麼辦？" },
    { pattern: /\b(nice to meet you)\b/i, label: "Greeting", chinese: "很高興見到你" },
    { pattern: /\b(sorry to hear that)\b/i, label: "Showing Sympathy", chinese: "聽到這件事我很遺憾" }
];

const vocabularyDb = {
    "restaurant": "餐廳",
    "forget": "忘記",
    "loudly": "大聲地",
    "comfort": "慰藉/安撫",
    "friendship": "友誼",
    "etiquette": "禮儀",
    "situation": "情況",
    "important": "重要的",
    "practice": "練習",
    "grammar": "文法"
};

function extractNotebookItems(chatMessages) {
    const patterns = [];
    const vocabulary = new Set();
    
    chatMessages.forEach(msg => {
        const text = msg.text.toLowerCase();
        
        // Find patterns
        geptUsefulPatterns.forEach(p => {
            if (p.pattern.test(text) && !patterns.some(item => item.label === p.label)) {
                patterns.push(p);
            }
        });
        
        // Find complex vocabulary (>6 chars)
        const words = text.match(/\b\w{7,}\b/g) || [];
        words.forEach(word => {
            if (!['everything', 'something', 'anything'].includes(word)) {
                vocabulary.add(word);
            }
        });
    });

    return {
        patterns,
        vocabulary: Array.from(vocabulary).map(word => ({
            word,
            chinese: vocabularyDb[word] || ""
        }))
    };
}

function saveToNotebook(items) {
    const currentNotebook = JSON.parse(localStorage.getItem('fluentBuddyNotebook') || '[]');
    const newSession = {
        date: new Date().toLocaleDateString(),
        ...items
    };
    currentNotebook.unshift(newSession);
    localStorage.setItem('fluentBuddyNotebook', JSON.stringify(currentNotebook));
}

function getNotebook() {
    return JSON.parse(localStorage.getItem('fluentBuddyNotebook') || '[]');
}

window.extractNotebookItems = extractNotebookItems;
window.saveToNotebook = saveToNotebook;
window.getNotebook = getNotebook;
