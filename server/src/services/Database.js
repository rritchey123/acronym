
const ACRONYMS = [
    'WTF',
    'LOL',
    'ABC',
    'THC',
    'CBD'
]

const PROMPTS = [
    'NAMES FOR A DRUG STORE',
    'CLASSIC SAYING',
    'SLANG'
]

const getRandomAcronym = () => {
    // Find out how to get random index
    return ACRONYMS[2]
}

const getRandomPrompt = () => {
    // Find out how to get random index
    return ACRONYMS[1]
}

module.exports = {
    getRandomAcronym,
    getRandomPrompt
}