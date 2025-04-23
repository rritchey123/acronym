const tech = [
    'API',
    'CPU',
    'RAM',
    'URL',
    'DNS',
    'GUI',
    'SSD',
    'USB',
    'NFT',
    'VPN',
]
const govAndMilitary = ['FBI', 'CIA', 'NSA', 'IRS', 'DOD', 'UNH', 'NRA', 'ICE']
const busniessAndFinance = ['CEO', 'ROI', 'IPO', 'GDP', 'ATM', 'CRM', 'ERP']
const internetSlangAndPopCulter = [
    'LOL',
    'OMG',
    'WTF',
    'BRB',
    'FYI',
    'TMI',
    'DIY',
    'AKA',
    'ETA',
]
const miscFunny = [
    'AFK',
    'NSF',
    'BFF',
    'ICY',
    'SMH',
    'IDK',
    'IDC',
    'NPC',
    'RIP',
]
const ACRONYMS = [
    ...tech,
    ...govAndMilitary,
    ...busniessAndFinance,
    ...internetSlangAndPopCulter,
    ...miscFunny,
]

const PROMPTS = ['NAMES FOR A DRUG STORE', 'CLASSIC SAYING', 'SLANG']

const getRandomIndex = (array) => {
    return Math.floor(Math.random() * array.length)
}

export const getRandomAcronym = () => {
    return ACRONYMS[getRandomIndex(ACRONYMS)]
}

export const getRandomPrompt = () => {
    return PROMPTS[getRandomIndex(PROMPTS)]
}
