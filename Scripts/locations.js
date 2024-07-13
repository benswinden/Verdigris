const locations = [
    {
        keyword: "mossy",
        title: "Among the Mossy Ruins",        
        description: "Light filters through the gray clouds overhead, shimmering in the droplets of rain gathered on thick leaves and vine that threaten to cover the ruins entirely.\n\nThe stonework of this ancient settlement is unlike anything you've ever seen. Even these crumbled, vine choked ruins show signs of exquisite workmanship.",
        contains: [
            {
                type: 0,
                title: "Head West towards the Crossroads",
                keyword: "crossroads"
            },
            {
                type: 1,
                title: "A slime monster",
                keyword: "slime"
            }
        ]
    },
    {
        keyword: "crossroads",
        title: "Crossroads Leaving Town",
        description: "A dirt road meanders it’s way from the Town on the Borderlands. The road splits into three and to the side a sign post has been erected with directions for adventurers.",
        contains: [
            {
                type: 0,
                title: "Go East towards the Mossy Ruins",
                keyword: "mossy"
            }
        ]
    }
];





const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        hp: 15
    },
    {
        name: "Fanged Beast",
        level: 8,
        hp: 60
    },
    {
        name: "Dragon",
        level: 20,
        hp: 300
    }
];