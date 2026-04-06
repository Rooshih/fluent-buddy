const avatarUrl = 'avatar.png';

const catchphrases = [
    "Mama mia!",
    "It's-a me, Ace!",
    "Wahoo!",
    "Super!",
    "Let's-a go!",
    "Okey-dokey!"
];

const responses = {
    "hello": "Hello! It's-a me, Ace! Ready to practice some English today?",
    "hi": "Hi there! Looking for a power-up in your English skills?",
    "how are you": "I'm feeling super! How about you?",
    "who are you": "I'm Ace, your English practice buddy. I'm-a like a plumber, but for your grammar!",
    "help": "Sure! You can pick a Daily Quest on the left or just start-a talking to me!",
    "thanks": "You're welcome! Keep it up!",
    "thank you": "No problem! You're doing great!",
    "bye": "See you later! Don't-a forget your daily practice!",
    "goodbye": "Goodbye! Come back for more coins next time!"
};

function getBuddyResponse(userInput) {
    const input = userInput.toLowerCase();
    const catchphrase = catchphrases[Math.floor(Math.random() * catchphrases.length)];
    
    // Check for predefined responses
    for (const key in responses) {
        if (input.includes(key)) {
            return `${catchphrase} ${responses[key]}`;
        }
    }
    
    // Default response if no match
    return `${catchphrase} That's-a interesting! Can you tell me more about that?`;
}

window.getBuddyResponse = getBuddyResponse;
window.avatarUrl = avatarUrl;
