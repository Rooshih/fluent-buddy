const grammarRules = [
    {
        name: "Third-person S",
        pattern: /\b(he|she|it|my (friend|mother|father|brother|sister))\s+([a-z]+)\b/i,
        check: (match, p1, p2, p3) => {
            const verb = p3.toLowerCase();
            // Simple check: if it doesn't end with 's', and it's not a modal or excluded verb
            const modals = ['can', 'will', 'must', 'should', 'may'];
            if (!modals.includes(verb) && !verb.endsWith('s') && verb.length > 2) {
                return {
                    error: `Oops! When using "${p1}", you should add an '-s' to the verb "${verb}".`,
                    correction: `${p1} ${verb}s`
                };
            }
            return null;
        }
    },
    {
        name: "Past Tense Yesterday",
        pattern: /\byesterday\b.*\b(go|eat|run|buy|see|do|is|am|are)\b/i,
        check: (match, p1) => {
            const irregulars = {
                'go': 'went',
                'eat': 'ate',
                'run': 'ran',
                'buy': 'bought',
                'see': 'saw',
                'do': 'did',
                'is': 'was',
                'am': 'was',
                'are': 'were'
            };
            const verb = p1.toLowerCase();
            if (irregulars[verb]) {
                return {
                    error: `Mama mia! You're talking about yesterday, so use the past tense "${irregulars[verb]}" instead of "${verb}".`,
                    correction: irregulars[verb]
                };
            }
            return null;
        }
    },
    {
        name: "I am go",
        pattern: /\bi\s+am\s+([a-z]+)\b/i,
        check: (match, p1) => {
            const verb = p1.toLowerCase();
            if (!verb.endsWith('ing')) {
                return {
                    error: `Wait! You should say "I am ${verb}ing" or just "I ${verb}". Don't mix "am" with the base verb!`,
                    correction: `I am ${verb}ing`
                };
            }
            return null;
        }
    },
    {
        name: "Did not went",
        pattern: /\bdid\s+not\s+([a-z]+ed|[a-z]+)\b/i,
        check: (match, p1) => {
            const verb = p1.toLowerCase();
            // If it ends with ed or is a known irregular past
            const pasts = ['went', 'ate', 'saw', 'did', 'bought', 'ran', 'was', 'were'];
            if (verb.endsWith('ed') || pasts.includes(verb)) {
                return {
                    error: `Double check! After "did not", we always use the original form of the verb, not the past tense.`,
                    correction: `did not [original verb]`
                };
            }
            return null;
        }
    }
];

function checkGrammar(text) {
    for (const rule of grammarRules) {
        const match = text.match(rule.pattern);
        if (match) {
            const result = rule.check(match, ...match.slice(1));
            if (result) return result;
        }
    }
    return null;
}

window.checkGrammar = checkGrammar;
