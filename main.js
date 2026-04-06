// State
let coins = 0;
let xp = 0;
let chatHistory = []; // Track full dialogue for notebook

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const buddyAvatar = document.getElementById('buddy-avatar');
const scenariosList = document.getElementById('scenarios-list');
const notebookList = document.getElementById('notebook-list');
const coinsCount = document.getElementById('coins-count');
const xpCount = document.getElementById('xp-count');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackContent = document.getElementById('feedback-content');
const closeFeedback = document.getElementById('close-feedback');
const endPracticeBtn = document.getElementById('end-practice-btn');
const resultsOverlay = document.getElementById('results-overlay');
const resultsSummary = document.getElementById('results-summary');
const closeResults = document.getElementById('close-results');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

// Initialize
function init() {
    // Set avatar
    buddyAvatar.src = window.avatarUrl || 'avatar.png';
    
    // Load daily scenarios
    const dailyScenarios = window.getRandomScenarios(3);
    dailyScenarios.forEach(scenario => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.innerHTML = `
            <h3>${scenario.title}</h3>
            <p>${scenario.description}</p>
            <span class="theme-tag">${scenario.theme}</span>
        `;
        card.onclick = () => startScenario(scenario);
        scenariosList.appendChild(card);
    });

    // Load notebook
    updateNotebookUI();

    // Welcome message
    appendMessage('buddy', "Ciao! It's-a me, Ace! Pick a scenario or just talk to me to start practicing your English. Let's-a go!");
}

function startScenario(scenario) {
    appendMessage('buddy', `[Quest Start!] ${scenario.description}`);
    sidebar.classList.remove('open'); // Auto-close sidebar on mobile
    userInput.focus();
}

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Track history for notebook
    chatHistory.push({ sender, text });

    if (sender === 'buddy') {
        buddyAvatar.parentElement.classList.add('bounce');
        setTimeout(() => buddyAvatar.parentElement.classList.remove('bounce'), 500);
    }
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    
    // Grammar Check
    const grammarResult = window.checkGrammar(text);
    if (grammarResult) {
        showFeedback(grammarResult);
    } else {
        addStats(5, 10);
    }

    // Buddy Response
    setTimeout(() => {
        const response = window.getBuddyResponse(text);
        appendMessage('buddy', response);
    }, 1000);
}

function handleEndPractice() {
    if (chatHistory.length < 3) {
        alert("Practice a bit more before finishing!");
        return;
    }

    const items = window.extractNotebookItems(chatHistory);
    window.saveToNotebook(items);
    showResults(items);
    updateNotebookUI();
    
    // Reset history for next session
    chatHistory = [];
    chatMessages.innerHTML = '';
    appendMessage('buddy', "Ready for another quest? Let's-a go!");
}

function showResults(items) {
    resultsSummary.innerHTML = '';
    
    if (items.patterns.length > 0) {
        resultsSummary.innerHTML += '<h4>Useful Patterns:</h4>';
        items.patterns.forEach(p => {
            resultsSummary.innerHTML += `
                <div class="summary-item">
                    <strong>${p.label}:</strong> ${p.chinese} <br>
                    <em>e.g., "${p.pattern.source.replace('\\\\b', '')}"</em>
                </div>
            `;
        });
    }
    
    if (items.vocabulary.length > 0) {
        resultsSummary.innerHTML += '<h4>Vocabulary Breakdown:</h4>';
        items.vocabulary.forEach(v => {
            resultsSummary.innerHTML += `
                <div class="summary-item">
                    <strong>${v.word}:</strong> ${v.chinese || 'New word!'}
                </div>
            `;
        });
    }

    if (items.patterns.length === 0 && items.vocabulary.length === 0) {
        resultsSummary.innerHTML = '<p>No specific patterns found this time. Keep practicing!</p>';
    }

    resultsOverlay.classList.remove('hidden');
    addStats(50, 100); // Level clear bonus!
}

function updateNotebookUI() {
    const notebook = window.getNotebook();
    if (notebook.length === 0) {
        notebookList.innerHTML = '<p class="empty-note">No notes yet. Clear some Quests!</p>';
        return;
    }

    notebookList.innerHTML = '';
    notebook.slice(0, 5).forEach(session => {
        const entry = document.createElement('div');
        entry.className = 'notebook-entry';
        let content = `<span class="date">${session.date} Session</span>`;
        
        if (session.patterns.length > 0) {
            content += '<strong>Patterns:</strong><ul>';
            session.patterns.forEach(p => content += `<li>${p.label}</li>`);
            content += '</ul>';
        }
        
        if (session.vocabulary.length > 0) {
            content += '<strong>Vocabulary:</strong> ';
            content += session.vocabulary.map(v => v.word).join(', ');
        }
        
        entry.innerHTML = content;
        notebookList.appendChild(entry);
    });
}

function showFeedback(result) {
    feedbackContent.innerHTML = `
        <p>${result.error}</p>
        <span class="correct-phrase">Try: ${result.correction}</span>
    `;
    feedbackPanel.classList.remove('hidden');
    
    // Animate feedback panel
    feedbackPanel.style.animation = 'bounce 0.5s ease-in-out';
}

function addStats(c, x) {
    coins += c;
    xp += x;
    coinsCount.innerText = coins;
    xpCount.innerText = xp;
    
    // Visual feedback
    coinsCount.style.color = '#FBD000';
    setTimeout(() => coinsCount.style.color = '', 300);
}

// Voice Input (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    voiceBtn.onclick = () => {
        recognition.start();
        voiceBtn.style.color = '#E52521';
        voiceBtn.classList.add('active');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceBtn.style.color = '';
        voiceBtn.classList.remove('active');
        handleSend();
    };

    recognition.onerror = () => {
        voiceBtn.style.color = '';
        voiceBtn.classList.remove('active');
    };
} else {
    voiceBtn.title = 'Speech API not supported in this browser';
    voiceBtn.style.opacity = '0.5';
}

// Event Listeners
sendBtn.onclick = handleSend;
userInput.onkeypress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
};

closeFeedback.onclick = () => {
    feedbackPanel.classList.add('hidden');
};

endPracticeBtn.onclick = handleEndPractice;
closeResults.onclick = () => {
    resultsOverlay.classList.add('hidden');
};

menuToggle.onclick = () => {
    sidebar.classList.add('open');
};

sidebarClose.onclick = () => {
    sidebar.classList.remove('open');
};

// Start the app
window.onload = init;
