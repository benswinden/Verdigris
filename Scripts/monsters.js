// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",
        shortTitle: "slime",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        level: 1,
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
        level: 1,
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
        level: 46,
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
        level: 3,
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
        level: 2,
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
        level: 1,
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
        keyword: "gob_01",
        title: "GoblÌn Darkling",
        shortTitle: "GoblÌn",        
        description: "A vicious goblÌn on all fours, glaring. Come from the darkness, feeding on rot.",
        level: 1,
        hpCurrent: 35,
        hpMax: 35,
        power: 20,
        evasion: 30,
        insight: 0,
        gold: 10,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "gob_02",
        title: "GoblÌn Darkling",
        shortTitle: "goblÌn",        
        description: "A vicious goblÌn on all fours, glaring. Come from the darkness, feeding on rot.",
        level: 1,
        hpCurrent: 35,
        hpMax: 35,
        power: 23,
        evasion: 30,
        insight: 0,
        gold: 10,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "gob_hulk_01",
        title: "GoblÌn Hulk",
        shortTitle: "goblÌn",        
        description: "A massive goblÌn creature with thick forearms planted in front of it. It's mouth hangs open, thick saliva shot through with an oily green color cover it's sharp fangs.",
        level: 3,
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
