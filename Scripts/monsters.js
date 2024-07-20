// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",
        shortTitle: "slime",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        hp: 100,
        attackPower: 5,
        xp: 50,
        gold: 10,
        actions: [
            {
                type: 6,
                title: "Attack with your sword",
                func: "attack"
            },
            {
                type: 6,
                title: "Dodge the incoming attack",
                func: "dodge"
            },
            {
                type: 6,
                title: "Run away",
                func: "returnToPrimaryContext"
            }            
        ]
    },
    {
        keyword: "dead_knight",
        title: "A Long Dead Knight",
        shortTitle: "knight",        
        description: "A battered corpse filling a rusted old suit of armor. You can make out the owl-head crest of the Sehran Royal Guard on it's chest.\n\n The creature ambles forward in laboured movements. It's rusted longsword held low.",
        hpCurrent: 20,
        hpMax: 100,
        attackPower: 5,
        xp: 50,
        gold: 10,
        deathFunc: "",
        actions: [
            {
                type: 6,
                title: "Attack with your sword",
                func: "attack"
            },
            {
                type: 6,
                title: "Run away",
                func: "returnToPrimaryContext"
            }            
        ]
    }
];