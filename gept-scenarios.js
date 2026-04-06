const geptScenarios = [
    {
        id: 1,
        title: "The Missing Key",
        description: "You just came home but found that you forgot your key. No one is at home. What do you do?",
        theme: "Daily Life"
    },
    {
        id: 2,
        title: "Restaurant Surprise",
        description: "You are eating at a restaurant and find a fly in your soup. What do you say to the waiter?",
        theme: "Dining Out"
    },
    {
        id: 3,
        title: "The Loud Neighbor",
        description: "You are in the library. Someone is talking very loudly on the phone. What do you do?",
        theme: "Public Manners"
    },
    {
        id: 4,
        title: "Lost in the City",
        description: "You are in a new city and your phone is out of battery. You need to find the train station. Who do you ask and what do you say?",
        theme: "Travel"
    },
    {
        id: 5,
        title: "Failed Exam",
        description: "Your best friend is very sad because they failed an important English test. How do you comfort them?",
        theme: "Friendship"
    },
    {
        id: 6,
        title: "Gift Giving",
        description: "It's your teacher's birthday. You bought a small gift. What do you say when you give it to them?",
        theme: "Social Etiquette"
    }
];

function getRandomScenarios(count = 3) {
    const shuffled = [...geptScenarios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Make it available globally
window.geptScenarios = geptScenarios;
window.getRandomScenarios = getRandomScenarios;
