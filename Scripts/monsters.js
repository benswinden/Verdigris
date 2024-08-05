// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",
        shortTitle: "slime",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        hp: 100,
        power: 5,
        evasion: 1,
        insight: 50,
        gold: 10,
        actions: [
        ]
    },
    {
        keyword: "dead_knight",
        title: "A Long Dead Knight",
        shortTitle: "knight",        
        description: "A battered corpse filling a rusted old suit of armor. You can make out the owl-head crest of the Sehran Royal Guard on it's chest.\n\n The creature ambles forward in laboured movements. It's rusted longsword held low.",
        hpCurrent: 100,
        hpMax: 100,
        power: 5,
        evasion: 1,
        insight: 50,
        gold: 10,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "temple_golem",
        title: "A Temple Golem",
        shortTitle: "golem",        
        description: "Built of stone, woven with threads of magical filament. It's movements are unexpectedly fluid as it holds a carved sword in salute.",
        hpCurrent: 500,
        hpMax: 500,
        power: 100,
        evasion: 1,
        insight: 200,
        gold: 0,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "large_rat",
        title: "A Large Rat",
        shortTitle: "rat",        
        description: "Bigger than most dogs you've seen, this creature looks at you without a trace of fear.",
        hpCurrent: 85,
        hpMax: 85,
        power: 20,
        evasion: 20,
        insight: 1,
        gold: 0,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "blooming_vine_01",
        title: "A Blooming Vine Blockage",
        shortTitle: "vine",        
        description: "Covered in vibrant orange flowers and sharp thorns, the vines have woven blockade.",
        hpCurrent: 120,
        hpMax: 120,
        power: 26,
        evasion: 1,
        insight: 1,
        gold: 25,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "blooming_vine_02",
        title: "A Blooming Vine",
        shortTitle: "vine",        
        description: "Covered in vibrant orange flowers and sharp thorns, it sways back and forth menacingly.",
        hpCurrent: 30,
        hpMax: 30,
        power: 15,
        evasion: 10,
        insight: 0,
        gold: 3,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "scav_01",
        title: "Scavenger",
        shortTitle: "scavenger",        
        description: "A vicious goblin on all fours, glaring. Come from the darkness, feeding on rot.",
        hpCurrent: 25,
        hpMax: 25,
        power: 20,
        evasion: 30,
        insight: 0,
        gold: 10,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "scav_02",
        title: "Scavenger",
        shortTitle: "scavenger",        
        description: "A vicious goblin on all fours, glaring. Come from the darkness, feeding on rot.",
        hpCurrent: 25,
        hpMax: 25,
        power: 23,
        evasion: 30,
        insight: 0,
        gold: 10,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "hulk_scav_01",
        title: "Hulking Scavenger",
        shortTitle: "hulk",        
        description: "A massive goblin creature with thick forearms planted in front of it. Scarred tusks point upwards out of it's heavy jaw.",
        hpCurrent: 85,
        hpMax: 85,
        power: 35,
        evasion: 20,
        insight: 1,
        gold: 30,
        deathFunc: "",
        actions: [
        ]
    }
];
