monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",
        shortTitle: "slime",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        hp: 100,
        attackPower: 5,
        actions: [
            {
                type: 4,
                title: "Attack with your sword",
                func: "attack"
            },
            {
                type: 4,
                title: "Dodge the incoming attack",
                func: "dodge"
            },
            {
                type: 4,
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
        hpCurrent: 100,
        hpMax: 100,
        attackPower: 5,        
        actions: [
            {
                type: 4,
                title: "Attack with your sword",
                func: "attack"
            },
            {
                type: 4,
                title: "Dodge the incoming attack",
                func: "dodge"
            },
            {
                type: 4,
                title: "Run away",
                func: "returnToPrimaryContext"
            }            
        ]
    }
];