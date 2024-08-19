// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

locations = [    
    {
        keyword: "edge_wood",
        title: "Edge of the Woods",        
        description: "The darkened woods have slowly given way to shrubs and saplings where the forest meets the fields. A well-worn trail leads downhill to the ruins of an ancient city.",
        narration: "beginning",        
        update: "You awaken as if from a stupor. The last weeks blur together in your mind and where they've lead you is not entirely clear.",        
        items: ["green_herb_pickup"],
        monsters: [],
        npcs: ["default_camp"],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 1,
                title: "East to the City Outskirts",
                keyword: "city_outskirts"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },
    {
        keyword: "city_outskirts",
        title: "City Outskirts",
        description: "An old cobbled road leads you in among the ruined settlement. The buildings here are nothing more than cadaverous moss-covered remains.",
        narration: "outskirts",
        update: "",
        items: [],
        monsters: [],
        npcs: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the Edge of the Woods",
                keyword: "edge_wood"
            },
            {
                type: 1,
                title: "East towards the City Crossroads",
                keyword: "crossroads",                
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },        
    {
        keyword: "crossroads",
        title: "The Crossroads",        
        description: "All roads in this great city once came together here. Pathways spread forth from here to all corners of the ruins.",
        narration: "city_enter",
        items: ["green_herb_pickup"],
        monsters: [],
        npcs: [],
        actions: [
            {
                type: 1,
                title: "North to the King's Road",
                keyword: "kings_road"
            },
            {
                type: 1,
                title: "West to the City Outskirts",
                keyword: "city_outskirts"
            },
            {
                type: 1,
                title: "East to the Lake Shore",
                keyword: "lake_shore"
            },
            {
                type: 1,
                title: "South to the Temple Market",
                keyword: "temple_market"
            }
        ]
    },
    {
        keyword: "temple_market",
        title: "The Temple Market",        
        description: "A winding street, that once lead to a place of worship. The stones here are covered in rich green and purple mosses.\n\nPropped up inside a ruined wall is a makeshift tent, providing some respite from the dripping rain. From within, a small campfire is flickering away.",
        narration: "",
        update: "A soft rain sifts through the gray clouds above.",
        items: [],
        monsters: [],
        npcs: ["descendent","messenger"],
        actions: [
            {
                type: 1,
                title: "North to the City Crossroads",
                keyword: "crossroads"
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 1,
                title: "South to the Templefront",
                keyword: "templefront"
            }
        ]
    },    
    {
        keyword: "templefront",
        title: "The Templefront",        
        description: "A great temple stands before, it's walls have stood the test of time much better than most of this place.\n\nIt's made of a white stone that gleams under the moistness in the air.",
        narration: "",
        update: "Standing imposingly to the south is an ancient stone golem. It's head turns to face you.",
        items: ["green_herb_pickup"],
        monsters: ["temple_golem"],
        npcs: [],
        actions: [
            {
                type: 1,
                title: "North to the Temple Market",
                keyword: "temple_market"
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 1,
                title: "South to the Temple Arcades",
                keyword: "temple_arcades",
                blocked: "temple_golem"
            }
        ]
    },
    {
        keyword: "temple_arcades",
        title: "The Temple Arcades",        
        description: "TO DO",
        narration: "",
        items: [],
        monsters: [],
        npcs: [],
        actions: [
            {
                type: 1,
                title: "North to the Templefront",
                keyword: "templefront"
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },
    {
        keyword: "kings_road",
        title: "The King's Road",        
        description: "What was once a wide causeway for traders heading to the Temple Market is now home to the fallen remains of the tall stone buildings that once lined it.",
        narration: "",
        items: [],
        monsters: [],
        npcs: [],
        actions: [
            {
                type: 1,
                title: "North to the King's Gate",
                keyword: "kings_gate"
            },
            {
                type: 1,
                title: "West to a Lamplit Ruin",
                keyword: "lamplit_ruin"
            },
            {
                type: 1,
                title: "East to a Shelterd Nook",
                keyword: "sheltered_nook"
            },
            {
                type: 1,
                title: "South to the City Crossroads",
                keyword: "crossroads"
            }
        ]
    },
    {
        keyword: "lamplit_ruin",
        title: "A Lamplit Ruin",
        description: "A damp, mucky interior lit by the glow of a gently swinging grease lamp.",
        narration: "",
        items: [],
        monsters: [],
        npcs: ["jorrid"],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 1,
                title: "East to the King's Road",
                keyword: "kings_road"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },
    {
        keyword: "kings_gate",
        title: "King's Gate",        
        description: "A crumbling wall still stands holding the arch of the old King's Gate.",
        narration: "",
        items: ["green_herb_pickup"],
        monsters: [],
        npcs: ["thornhood_kijil"],
        actions: [
            {
                type: 1,
                title: "North through a doorway to the Gate Stairwell",
                keyword: "gate_stairwell",
                locked: "key"
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 1,
                title: "South to the King's Road",
                keyword: "kings_road"
            }
        ]
    },
    {
        keyword: "gate_stairwell",
        title: "The Gate Stairwell",        
        description: "The interior of the King's Gate foritifications hold a collapsed stone staircase that once lead up into the battlements.",
        narration: "",
        items: [],
        monsters: [],
        npcs: ["thornhood_soja"],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
            },
            {
                type: 2,
                title: "West",
                keyword: ""
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 1,
                title: "South to the King's Gate",
                keyword: "kings_gate"
            }
        ]
    },
    {
        keyword: "sheltered_nook",
        title: "A Sheltered Nook",        
        description: "You managed to find a cranny amongst the ruins with four walls and some degree of shelter from the rain.",
        narration: "",
        items: ["green_herb_pickup"],
        monsters: ["large_rat"],
        npcs: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the King's Road",
                keyword: "kings_road"
            },
            {
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },
    {
        keyword: "lake_shore",
        title: "Shore of the Black Lake",        
        description: "The city ruins collapse away into the perfectly still waters of the Black Lake.\n\nPainted deep in the water's depths is a vision of the castle. It calls to you.",
        narration: "approach_lake",
        items: [],
        monsters: [],
        npcs: [],
        actions: [
            {
                type: 1,
                title: "West to the City Crossroads",
                keyword: "crossroads"
            },
            {
                type: 1,
                title: "Enter the Lake",
                keyword: "TODO"
            }
        ]
    }

];
