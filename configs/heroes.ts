
export const heroes = [
    'abaddon', 'alchemist', 'ancient-apparition', 'anti-mage', 'arc-warden', 'axe',
    'bane', 'batrider', 'beastmaster', 'bloodseeker', 'bounty-hunter', 'brewmaster',
    'bristleback', 'broodmother', 'centaur-warrunner', 'chaos-knight', 'chen', 'clinkz',
    'clockwerk', 'crystal-maiden', 'dark-seer', 'dark-willow', 'dawnbreaker', 'dazzle',
    'death-prophet', 'disruptor', 'doom', 'dragon-knight', 'drow-ranger', 'earth-spirit',
    'earthshaker', 'elder-titan', 'ember-spirit', 'enchantress', 'enigma', 'faceless-void',
    'grimstroke', 'gyrocopter', 'hoodwink', 'huskar', 'invoker', 'io', 'jakiro',
    'juggernaut', 'keeper-of-the-light', 'kunkka', 'legion-commander', 'leshrac', 'lich',
    'lifestealer', 'lina', 'lion', 'lone-druid', 'luna', 'lycan', 'magnus', 'marci',
    'mars', 'medusa', 'meepo', 'mirana', 'monkey-king', 'morphling', 'muerta', 'naga-siren',
    'natures-prophet', 'necrophos', 'night-stalker', 'nyx-assassin', 'ogre-magi', 'omniknight',
    'oracle', 'outworld-destroyer', 'pangolier', 'phantom-assassin', 'phantom-lancer',
    'phoenix', 'primal-beast', 'puck', 'pudge', 'pugna', 'queen-of-pain', 'razor', 'riki',
    'rubick', 'sand-king', 'shadow-demon', 'shadow-fiend', 'shadow-shaman', 'silencer',
    'skywrath-mage', 'slardar', 'slark', 'snapfire', 'sniper', 'spectre', 'spirit-breaker',
    'storm-spirit', 'sven', 'techies', 'templar-assassin', 'terrorblade', 'tidehunter',
    'timbersaw', 'tinker', 'tiny', 'treant-protector', 'troll-warlord', 'tusk', 'underlord',
    'undying', 'ursa', 'vengeful-spirit', 'venomancer', 'viper', 'visage', 'void-spirit',
    'warlock', 'weaver', 'windranger', 'winter-wyvern', 'witch-doctor', 'wraith-king', 'zeus'
]

export const heroAttributes = new Map<string, string[]>([
    ["strength", [
        'alchemist', 'axe', 'bristleback', 'centaur-warrunner', 'chaos-knight', 'dawnbreaker',
        'doom', 'dragon-knight', 'earth-spirit', 'earthshaker', 'elder-titan', 'huskar', 'kunkka',
        'legion-commander', 'lifestealer', 'mars', 'night-stalker', 'ogre-magi', 'omniknight',
        'primal-beast', 'pudge', 'slardar', 'spirit-breaker', 'sven', 'tidehunter', 'tiny',
        'treant-protector', 'tusk', 'underlord', 'undying', 'wraith-king'
    ]],
    ["agility", [
        'anti-mage', 'arc-warden', 'bloodseeker', 'bounty-hunter', 'clinkz', 'drow-ranger',
        'ember-spirit', 'faceless-void', 'gyrocopter', 'hoodwink', 'juggernaut', 'luna', 'medusa',
        'meepo', 'monkey-king', 'morphling', 'naga-siren', 'phantom-assassin', 'phantom-lancer',
        'razor', 'riki', 'shadow-fiend', 'slark', 'sniper', 'spectre', 'templar-assassin', 'terrorblade',
        'troll-warlord', 'ursa', 'viper', 'weaver'
    ]],
    ["intelligence", [
        'ancient-apparition', 'crystal-maiden', 'death-prophet', 'disruptor', 'enchantress',
        'grimstroke', 'invoker', 'jakiro', 'keeper-of-the-light', 'leshrac', 'lich', 'lina',
        'lion', 'muerta', "natures-prophet", 'necrophos', 'oracle', 'outworld-destroyer',
        'puck', 'pugna', 'queen-of-pain', 'rubick', 'shadow-demon', 'shadow-shaman', 'silencer',
        'skywrath-mage', 'storm-spirit', 'tinker', 'warlock', 'witch-doctor', 'zeus'
    ]],
    ["universal", [
        'abaddon', 'bane', 'batrider', 'beastmaster', 'brewmaster', 'broodmother', 'chen',
        'clockwerk', 'dark-seer', 'dark-willow', 'dazzle', 'enigma', 'io', 'lone-druid', 'lycan',
        'magnus', 'marci', 'mirana', 'nyx-assassin', 'pangolier', 'phoenix', 'sand-king', 'snapfire',
        'techies', 'timbersaw', 'vengeful-spirit', 'venomancer', 'visage', 'void-spirit', 'windranger',
        'winter-wyvern'
    ]]
])

export function label2name(label: string) {
    return label.split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
