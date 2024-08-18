// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

locations = [
    {
        keyword: "narration_01_01",
        title: "",        
        description: "",
        narration: "Far off in the misty lands, lies a fallen city. Drowned in darkness.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_01_02"
            }
        ]
    },
    {
        keyword: "narration_01_02",
        title: "",        
        description: "",
        narration: "This city was once a great capital. Balmora The Gilded City. Crown of the Lowland Provinces",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_01_03"
            }
        ]
    },
    {
        keyword: "narration_01_03",
        title: "",        
        description: "",
        narration: "The heart of this great city was a grand castle to rival the homes of the gods.\n\nBut within it darkness and shadow festered and eventually swallowed the castle whole.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_01_04"
            }
        ]
    },
    {
        keyword: "narration_01_04",
        title: "",        
        description: "",
        narration: "A shadow that spread itself into the earth and made it's way slowly across the mortal realms.\n\nWith it came a curse. A calling curse. To the darkness it calls.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "edge_wood"
            }
        ]
    },
    {
        keyword: "edge_wood",
        title: "Edge of the Woods",        
        description: "The darkened woods have slowly given way to shrubs and saplings where the forest meets the fields. A well-worn trail leads downhill to the ruins of an ancient city.",
        narration: "You awaken as if from a stupor. The last weeks blur together in your mind and where they've lead you is not entirely clear.",        
        items: ["green_herb_pickup"],
        monsters: ["large_rat","goblin_hulk"],
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
                keyword: "narration_03_01"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            },
            {
                type: 5,
                title: "Make Camp",
                keyword: "default_camp"
            }
        ]
    },
    {
        keyword: "narration_03_01",
        title: "",        
        description: "",
        narration: "A hunter's trail meanders it's way from the forest and through low foothills.\n\nBefore long you crest a tall hill and before you in the valley below is a great sprawl of overgrown ruins.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",                
                keyword: "narration_03_02",                                        
                func: ""
            }
        ]
    },
    {
        keyword: "narration_03_02",
        title: "",        
        description: "",
        narration: "Old stone structures, sunken into the soil and grown over with reaching vines and tall grass. All gathered round a great black lake at the center.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",                
                keyword: "city_outskirts",                                        
                func: "replaceAction|edge_wood|1|{\"type\": 1,\"title\": \"East to the City Outskirts\",\"keyword\": \"city_outskirts\"}|2"
            }
        ]
    },
    {
        keyword: "city_outskirts",
        title: "City Outskirts",
        description: "An old cobbled road leads you in among the ruined settlement. The buildings here are nothing more than cadaverous moss-covered remains.",
        narration: "",
        update: "You feel watched.",
        items: [],
        monsters: [],
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
                keyword: "narration_04_01",                
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },    
    {
        keyword: "narration_04_01",
        title: "",        
        description: "",
        narration: "You pass beneath massive arches of what remains of the city's outer-gates and into the Fallen city of Balmora.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",                
                keyword: "crossroads",                                        
                func: "replaceAction|city_outskirts|1|{\"type\": 1,\"title\": \"East towards the City Crossroads\",\"keyword\": \"crossroads\"}|2"
            }
        ]
    },
    {
        keyword: "crossroads",
        title: "The Crossroads",        
        description: "All roads in this great city once came together here. Pathways spread forth from here to all corners of the ruins.",
        narration: "",
        items: ["green_herb_pickup"],
        monsters: [],
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
                keyword: "narration_02_01"
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
        narration: "A soft rain sifts through the gray clouds above.",
        items: [],
        monsters: [],
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
                type: 5,
                title: "East to the Messenger's Tent",
                keyword: "messenger"
            },
            {
                type: 1,
                title: "South to the Templefront",
                keyword: "templefront"
            },
            {
                type: 5,
                title: "Site of an ancient smithy. An old man works away.",
                keyword: "descendent"
            }
        ]
    },    
    {
        keyword: "templefront",
        title: "The Templefront",        
        description: "A great temple stands before, it's walls have stood the test of time much better than most of this place.\n\nIt's made of a white stone that gleams under the moistness in the air.",
        narration: "Standing imposingly to the south is an ancient stone golem. It's head turns to face you.",
        items: ["green_herb_pickup"],
        monsters: [],
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
            },
            {
                type: 3,
                title: "Temple Golem",
                keyword: "temple_golem"
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
        narration: "Your greeted by a thin man, squatting amongst the debris. \"Welcome friend, name's Jorrid.\"",
        items: [],
        monsters: [],
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
            },
            {
                type: 5,
                title: "Jorrid squats here amongst the ruins", 
                keyword: "jorrid"
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
            },            
            {
                type: 5,
                title: "A cloaked man leans casually against a pillar.",
                keyword: "thornhood_kijil"
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
            },
            {
                type: 5,
                title: "Thornhood Soja",
                keyword: "thornhood_soja"
            }
        ]
    },
    {
        keyword: "sheltered_nook",
        title: "A Sheltered Nook",        
        description: "You managed to find a cranny amongst the ruins with four walls and some degree of shelter from the rain.",
        narration: "",
        items: ["green_herb_pickup"],
        monsters: [],
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
            },
            {
                type: 3,
                title: "Large Rat",
                keyword: "large_rat"
            }
        ]
    },
    {
        keyword: "narration_02_01",
        title: "",        
        description: "",
        narration: "You make your way through the overgrown streets and pathways of the fallen city. Eventually arriving at the black-curse lake at it's center.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_02_02"
            }
        ]
    },
    {
        keyword: "narration_02_02",
        title: "",        
        description: "",
        narration: "The retched waters sit like a scar where once Balmora's great castle stood.\n\nThe water is so still you feel as though you could stride into the image within.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "lake_shore",
                func: "replaceAction|crossroads|1|{\"type\": 1,\"title\": \"East to the Lake Shore\",\"keyword\": \"lake_shore\",\"blocked\": \"\"}|2"
            }
        ]
    },
    {
        keyword: "lake_shore",
        title: "Shore of the Black Lake",        
        description: "The city ruins collapse away into the perfectly still waters of the Black Lake.\n\nPainted deep in the water's depths is a vision of the castle. It calls to you.",
        narration: "",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "West to the City Crossroads",
                keyword: "crossroads"
            },
            {
                type: 1,
                title: "Enter the Lake",
                keyword: "narration_05_01"
            }
        ]
    },
    {
        keyword: "narration_05_01",
        title: "",        
        description: "",
        narration: "The retched waters sit like a scar where once Balmora's great castle stood.\n\nThe water is so still you feel as though you could stride into the image within.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "lake_shore",
                func: "replaceAction|crossroads|1|{\"type\": 1,\"title\": \"East to the Lake Shore\",\"keyword\": \"lake_shore\",\"blocked\": \"\"}|2"
            }
        ]
    },
    


            // TOWER - FLOOR 1

    {
        keyword: "f01_01",
        title: "Tangled Entrance",
        description: "Bramble spills over everything. Thick thorny branches seem to grow from the stones themselves. The smell of damp soil and rotting plant matter is overwhelming.",
        narration: "Up a long stone staircase is a towering doorway. The door itself rotted away long ago. The still darkness of the tower's interior beckons you.",
        update: "When you look back, an impenetrable wall of vine and bramble have grown over the doorway.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the Black Leaf Road",
                keyword: "",
                blocked: "blooming_vine_01"
            },
            {
                type: 1,
                title: "East to the Western Hallway",
                keyword: "f01_02"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            },
            {
                type: 3,
                title: "Blooming Vine",
                keyword: "blooming_vine_01"
            }
        ]
    },
    {
        keyword: "f01_02",
        title: "Floor 1 - The Western Hallway",        
        description: "A sickly sweet smell permeates the high-arched hall. The walls are covered in fruiting vines and the floors are covered in rotten fruits.",
        narration: "",
        items: [],
        monsters: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the Tangled Entrance",
                keyword: "f01_01"
            },
            {
                type: 1,
                title: "East to the Central Hall",
                keyword: "f01_03"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            },
            {
                type: 3,
                title: "GoblÌn Darkling",
                keyword: "goblin_01"
            },
            {
                type: 3,
                title: "GoblÌn Darkling",
                keyword: "goblin_02"
            }
        ]
    },
    {
        keyword: "f01_03",
        title: "Floor 1 - Central Hall",        
        description: "With a long crack running down the northern wall, a sharp beam of light cuts through the chamber. A verdant forest of purple and red mosses and leaves cover every surface.",
        narration: "Drifting pollen sifts slowly down inside the light beams.",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "North to the Northern Hall",
                blocked: "blooming_vine_02",
                keyword: "f01_06"
            },
            {
                type: 1,
                title: "West to the Western Hallway",
                keyword: "f01_02"
            },
            {
                type: 1,
                title: "East to the Eastern Hallway",
                keyword: "f01_07"
            },
            {
                type: 1,
                title: "South to the Southern Hallway",
                keyword: "f01_04"
            },
            {
                type: 3,
                title: "Blooming Vine",
                keyword: "blooming_vine_02"
            }
        ]
    },
    {
        keyword: "f01_04",
        title: "Floor 1 - The Southern Hallway ",
        description: "",
        narration: "",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "North to the Central Hall",
                keyword: "f01_03"
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
                title: "South to the Larval Room",
                keyword: "f01_05"
            }
        ]
    },
    {
        keyword: "f01_05",
        title: "Floor 1 - The Larval Room",        
        description: "",
        narration: "",
        items: [],
        monsters: [],
        actions: [
            {
                type: 1,
                title: "North to the Southern Hallway",
                keyword: "f01_04"
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
            },
            {
                type: 2,
                title: "Up to Floor 2",
                keyword: ""
            }
        ]
    },
    {
        keyword: "f01_06",
        title: "Floor 1 - The Northern Hallway",
        description: "The hall leading north ends abruptly where the ceiling above collapsed down onto it.\n\nA tree the size of a house has grown through the wall and up into the tower above you.",
        narration: "",
        items: ["relic"],
        monsters: [],
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
                type: 2,
                title: "East",
                keyword: ""
            },
            {
                type: 1,
                title: "South to the Central Hall",
                keyword: "f01_03"
            },
            {
                type: 3,
                title: "GoblÌn Hulk",
                keyword: "goblin_hulk_01"
            }
        ]
    },
    {
        keyword: "f01_07",
        title: "Floor 1 - The Eastern Hallway",
        description: "",
        narration: "",
        items: [],
        monsters: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the Central Hall",
                keyword: "f01_03"
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
    }

    // TOWER FLOOR 2

];
