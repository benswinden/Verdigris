// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",
        shortTitle: "slime",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        hp: 100,
        power: 5,
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
        hpCurrent: 30,
        hpMax: 30,
        power: 3,
        insight: 5,
        gold: 1,
        deathFunc: "",
        actions: [
        ]
    },
    {
        keyword: "blooming_vine_01",
        title: "A Blooming Vine",
        shortTitle: "vine",        
        description: "Covered in vibrant orange flowers and sharp thorns, it sways back and forth menacingly.",
        hpCurrent: 10,
        hpMax: 10,
        power: 1,
        insight: 0,
        gold: 3,
        deathFunc: "",
        actions: [
        ]
    }
];