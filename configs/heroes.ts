export function getHeroes(): [string[], Map<string, string[]>] {
    const heroes = [
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

    const heroAttributes = new Map<string, string[]>([
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
    return [heroes, heroAttributes];
}

export function label2name(label: string) {
    if (label === "natures-prophet")
        label = "nature's-prophet"
    let name = label.split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    if (name == "Anti Mage") {
        return "Anti-Mage";
    } else {
        return name;
    }
}

export function getStyles() {
    return [
        "None",
        "Default",
        "Realistic",
        "Statue",
        "Alma Thomas",
        "Alphonse Mucha",
        "Amrita Sher-Gil",
        "Andrew Warhol",
        "Android Jones",
        "Brad Rigney",
        "Jacob Lawrence",
        "John Collier",
        "John Singer Sargent",
        "Kawanabe Kyosai",
        "Margaret Macdonald Mackintosh",
        "Pablo Picasso",
        "Ravi Varma",
        "Salvador Dali",
        "Takashi Murakami",
        "Ukiyo-e",
        "Vincent van Gogh"
    ];
}

export function getStylePrompts() {
    return new Map<string, string>([
        ["None", ""],
        ["Default", "beautiful detailed eyes, cinematic lighting, trending on artstation, award-winning, 8k wallpaper, highres, superb"],
        ["Realistic", "ultra realistic, beautiful detailed eyes, cinematic lighting, 8k wallpaper, highres, superb"],
        ["Statue", "porcelain statue"],
        ["Alma Thomas", "Alma Thomas"],
        ["Alphonse Mucha", "Alphonse Mucha"],
        ["Amrita Sher-Gil", "Amrita Sher-Gil"],
        ["Andrew Warhol", "Andrew Warhol"],
        ["Android Jones", "Android Jones"],
        ["Brad Rigney", "Brad Rigney"],
        ["Jacob Lawrence", "Jacob Lawrence"],
        ["John Collier", "John Collier"],
        ["John Singer Sargent", "John Singer Sargent"],
        ["Kawanabe Kyosai", "Kawanabe Kyosai"],
        ["Margaret Macdonald Mackintosh", "Margaret Macdonald Mackintosh"],
        ["Pablo Picasso", "Pablo Picasso"],
        ["Ravi Varma", "Ravi Varma"],
        ["Salvador Dali", "Salvador Dali"],
        ["Takashi Murakami", "Takashi Murakami"],
        ["Ukiyo-e", "Ukiyo-e"],
        ["Vincent van Gogh", "Vincent van Gogh"]
    ]);
}
