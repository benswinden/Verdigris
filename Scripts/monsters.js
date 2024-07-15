monsters = [
    {
        keyword: "slime",
        title: "A Slime Monster",        
        description: "An amorphous form of strange goo oozes it’s way slowly towards you with malicious intent in it’s eyes.",
        hp: 100,
        damage: 5,
        actions: [
            {
                type: 4,
                title: "Attack with your sword",
                function: attack
            },
            {
                type: 4,
                title: "Dodge the incoming attack",
                function: dodge
            },
            {
                type: 4,
                title: "Run away",
                function: returnToPrimaryContext
            }            
        ]
    },
    {
        keyword: "dead_knight",
        title: "A Long Dead Knight",        
        description: "A battered corpse filling a rusted old suit of armor. You can make out the owl-head crest of the Sehran Royal Guard on it's chest.\n\n The creature ambles forward in laboured movements. It's rusted longsword held low.",
        hp: 100,
        damage: 5,
        actions: [
            {
                type: 4,
                title: "Attack with your sword",
                function: attack
            },
            {
                type: 4,
                title: "Dodge the incoming attack",
                function: dodge
            },
            {
                type: 4,
                title: "Run away",
                function: returnToPrimaryContext
            }            
        ]
    }
];