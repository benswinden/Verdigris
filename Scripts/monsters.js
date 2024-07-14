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
    }
];