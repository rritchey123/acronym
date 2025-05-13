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

const PROMPTS = [
    'Weird name for a company',
    'Funny nickname for someone in the group',
    'Famous last words',
    'Full name of your fictional child',
    'Inappropriate movie title',
    'Funny company slogan',
    'Funny medical conditions',
    'Funny name for the next big seltzer drink',
    'Weird name for an emo punk rock band',
    'Funny bumper sticker',
    'Funny slogan on a shirt',
    'Funny name for this group of people',
    'Sex position*',
    'Name for a country you founded',
    'A name that comes up in a sporting event and you have no idea where they are from',
    'Unknown text message from your best friend ',
    'Gen z slang',
    'Worst thing to blurt out at church',
    'New C-suite title',
    'Random charge on your significant others credit card statement',
    'Borderline NOT racist comment*',
    'Name for an airline you would not want to fly on',
    'First words in a state of the union address (“my fellow Americans…”)',
    'A name for a piece of art that just makes no sense',
    'Name for a boat',
]

const getRandomIndex = (array) => {
    return Math.floor(Math.random() * array.length)
}

export const getRandomAcronym = () => {
    return ACRONYMS[getRandomIndex(ACRONYMS)]
}

export const getRandomPrompt = () => {
    return PROMPTS[getRandomIndex(PROMPTS)]
}
