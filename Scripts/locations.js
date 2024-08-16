// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

locations = [
    {
        keyword: "narration_01_01",
        title: "",        
        description: "",
        narration: "Far off in the misty lands, lies an ancient tower.",
        items: [],
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
        narration: "High up in the upper most reaches of the tower's many floors lives something very old.\n\nA seeping presence that spread itself into the earth slowly made it's way across the mortal realms.",
        items: [],
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
        narration: "With it came a curse. A calling curse. To the tower it calls.",
        items: [],
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
        items: [],
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
        narration: "Following the meandering forest trail, you're unable to ignore a looming shadow to the east. A black tower, reaching high into the surrounding mist.",
        items: [],
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
            },            
            {
                type: 5,
                title: "A cloaked man leans casually against a pillar.",
                keyword: "thornhood_kijil"
            }
        ]
    },
    {
        keyword: "crossroads",
        title: "The Crossroads",        
        description: "All roads in this great city once came together here. Pathways spread forth from here to all corners of the ruins.",
        narration: "",
        items: [],
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
                title: "East to the Old Road",
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
        items: [],
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
                title: "A Temple Golem is standing here",
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
        items: [],
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
        items: [],
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
                title: "A hungry rat is here gnashing on a bone",
                keyword: "large_rat"
            }
        ]
    },
    {
        keyword: "narration_02_01",
        title: "",        
        description: "",
        narration: "You make your way through the winding streets of the ruined settlement.\n\nMarking a serpentine path eastwards.",
        items: [],
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
        narration: "As you crest a final hill, you see before you the eastern half of the city has been overtaken entirely in ink black overgrowth.",
        items: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_02_03"
            }
        ]
    },
    {
        keyword: "narration_02_03",
        title: "",        
        description: "",
        narration: "An undulating sea of leaves and thorn bramble as dark as night reaching forth and at the center of it all, the obelisk.\n\nThe great Black Tower.",
        items: [],
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "old_road",
                func: "replaceAction|crossroads|1|{\"type\": 1,\"title\": \"East to Old Road\",\"keyword\": \"old_road\",\"blocked\": \"\"}|2"
            }
        ]
    },
    {
        keyword: "old_road",
        title: "The Old Road",        
        description: "A narrow road leads east, down a long hill. Thorny vines from reaching plants search for a sleeve to catch themselves on.\n\nThe path is oddly well worn.",
        narration: "You hear the sound of a unsettling bird call ripple through the wet air.",
        items: [],
        actions: [
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the City Crossroads",
                keyword: "crossroads"
            },
            {
                type: 1,
                title: "East to the Tower",
                keyword: "tower_front"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
            }
        ]
    },
    {
        keyword: "tower_front",
        title: "Before the great Black Tower",        
        description: "The immense monolith reaches far above you into the gray mist. Bursting with overgrowth as black as night. Brimming with power and malice.",
        narration: "",
        items: [],
        actions: [            
            {
                type: 2,
                title: "North",
                keyword: ""
            },
            {
                type: 1,
                title: "West to the Old Road",
                keyword: "old_road"
            },
            {
                type: 1,
                title: "Enter the Tower",
                keyword: "f01_01"
            },
            {
                type: 2,
                title: "South",
                keyword: ""
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
                title: "A thick wall of blooming black vines blocks the tower's exit",
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
                title: "A mishapen creature, scavenging through the rot",
                keyword: "scav_01"
            },
            {
                type: 3,
                title: "A mishapen creature, growling a low guttural noise",
                keyword: "scav_02"
            }
        ]
    },
    {
        keyword: "f01_03",
        title: "Floor 1 - Central Hall",        
        description: "With a long crack running down the northern wall, a sharp beam of light cuts through the chamber. A verdant forest of purple and red mosses and leaves cover every surface.",
        narration: "Drifting pollen sifts slowly down inside the light beams.",
        items: [],
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
                title: "A long black vine covered in orange blooms",
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
        items: [],
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
                title: "A hulking beast pacing back and forth",
                keyword: "hulk_scav_01"
            }
        ]
    },
    {
        keyword: "f01_07",
        title: "Floor 1 - The Eastern Hallway",
        description: "",
        narration: "",
        items: [],
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
