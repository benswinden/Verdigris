// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

locations = [
    {
        keyword: "narration_01_01",
        title: "",        
        description: "",
        narration: "In the misty lands stands an ancient tower. The space inside that tower is shaped and twisted. The tower's innards have far outgrown it's worldly boundaries.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_01_02",
                blocked: ""
            }
        ]
    },
    {
        keyword: "narration_01_02",
        title: "",        
        description: "",
        narration: "High up in the upper most reaches of the towers many floors lives something very old and dead. A presence so evil that it's influence continues to seep throughout the mortal realms.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_01_03",
                blocked: ""
            }
        ]
    },
    {
        keyword: "narration_01_03",
        title: "",        
        description: "",
        narration: "A curse has spread through the surrounding lands. A calling curse. To the tower it calls.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "edge_wood",
                blocked: ""
            }
        ]
    },
    {
        keyword: "edge_wood",
        title: "Edge of the Woods",        
        description: "The darkened woods have slowly made way to shrubs and saplings where the forest meets the fields. The well-worn trail leads below to the ruins of an old village, and at it's center a black tower reaches up into the mist.",
        narration: "You awaken as if from a stupor. The last weeks and months blur together in your mind and where they've lead you is not entirely clear.",
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "West",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "East to the Ruined Settlement",
                keyword: "village_outskirts",
                blocked: ""
            },
            {
                type: 2,
                title: "South",
                keyword: "",
                blocked: ""
            }
        ]
    },
    {
        keyword: "village_outskirts",
        title: "Village Outskirts",
        description: "An old cobbled road leads you in among the ruined structures. The buildings are skeletal as only the moss-covered stones remain.",
        narration: "A cool mist sifts through the gray clouds above.",
        actions: [
            {
                type: 1,
                title: "North into a ruined structure lit by a dull light",
                keyword: "lamplit_ruin",
                blocked: ""
            },
            {
                type: 2,
                title: "West",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "East towards the Town Square",
                keyword: "town_square",
                blocked: ""
            },
            {
                type: 2,
                title: "South",
                keyword: "",
                blocked: ""
            }
        ]
    },
    {
        keyword: "lamplit_ruin",
        title: "Inside a Firelit Ruin",
        description: "A damp, mucky interior with some broken wood and debris doing a poor job at sheltering it from the elements. A greasy lamp swings gently from a rafter.",
        narration: "Your greeted by a thin man, squatting amongst the debris. \"Welcome friend, name's Jorrid.\"",
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "West",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "East",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "South to the Village Outskirts",
                keyword: "village_outskirts",
                blocked: ""
            },
            {
                type: 5,
                title: "Jorrid squats here amongst the ruins", 
                keyword: "jorrid",
                blocked: ""
            }
        ]
    },
    {
        keyword: "town_square",
        title: "The Town Square",        
        description: "At the center of the ruined village is the square. Standing in the center is a large stone statue. From here pathways spread throughout the settlement.",
        narration: "",
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "West to the Village Outskirts",
                keyword: "village_outskirts",
                blocked: ""
            },
            {
                type: 2,
                title: "East",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "South to the Old Market",
                keyword: "temple_market",
                blocked: ""
            },
            {
                type: 3,
                title: "A Long Dead Knight",
                keyword: "dead_knight",
                blocked: ""
            }
        ]
    },
    {
        keyword: "temple_market",
        title: "The Temple Market",        
        description: "A winding street, that once lead to a place of worship. The stones here are covered in rich green and purple mosses. Propped up inside a ruined wall is a makeshift tent, providing some respite from the dripping rain. From within, a small campfire is flickering away.",
        narration: "",
        actions: [
            {
                type: 1,
                title: "North to the Town Square",
                keyword: "town_square",
                blocked: ""
            },
            {
                type: 2,
                title: "West",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "East",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "South",
                keyword: "",
                blocked: ""
            }
        ]
    }




    ,
    {
        keyword: "temp",
        title: "Template",        
        description: "",
        narration: "",
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "West",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "East",
                keyword: "",
                blocked: ""
            },
            {
                type: 2,
                title: "South",
                keyword: "",
                blocked: ""
            }
        ]
    }
];