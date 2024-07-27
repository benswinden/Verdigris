// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

locations = [
    {
        keyword: "narration_01_01",
        title: "",        
        description: "",
        narration: "Far off in the misty lands, lies an ancient tower.",
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
        narration: "High up in the upper most reaches of the tower's many floors lives something old and long dead.\n\nA presence so evil that it's influence seeps into the soil and spreads through the earth. Across the mortal realms.",
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
        narration: "With it came a curse. A calling curse. To the tower it calls.",
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
        description: "The darkened woods have slowly given way to shrubs and saplings where the forest meets the fields. A well-worn trail leads downhill to the ruins of an old village.",
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
                title: "East to the Village Outskirts",
                keyword: "narration_03_01",
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
        keyword: "narration_03_01",
        title: "",        
        description: "",
        narration: "Following the meandering forest trail, you're unable to ignore a looming shadow to the east. A black tower, reaching high into the surrounding mist.",
        actions: [
            {
                type: 1,
                title: "Next",                
                keyword: "village_outskirts",
                blocked: ""
            }
        ]
    },
    {
        keyword: "village_outskirts",
        title: "Village Outskirts",
        description: "An old cobbled road leads you in among the ruined settlement. The buildings here are nothing more than cadaverous moss-covered remains.",
        narration: "You feel watched.",
        actions: [
            {
                type: 1,
                title: "North into a Lamplit Ruin",
                keyword: "lamplit_ruin",
                blocked: ""
            },
            {
                type: 1,
                title: "West to the Edge of the Woods",
                keyword: "edge_wood",
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
            },            
            {
                type: 5,
                title: "A cloaked man leans casually against a pillar.",
                keyword: "thornhood_kijil"
            }
        ]
    },
    {
        keyword: "lamplit_ruin",
        title: "A Lamplit Ruin",
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
        description: "Standing in the town square is a lonely stone statue. A woman in a long robe, head held high defiantly. From here pathways spread throughout the settlement.\n\nTo the east is dark sillouette of the Tower.",
        narration: "",
        actions: [
            {
                type: 1,
                title: "North to the King's Road",
                keyword: "kings_road",
                blocked: ""
            },
            {
                type: 1,
                title: "West to the Village Outskirts",
                keyword: "village_outskirts",
                blocked: ""
            },
            {
                type: 1,
                title: "East to the Blackened Road",
                keyword: "narration_02_01",
                blocked: ""
            },
            {
                type: 1,
                title: "South to the Temple Market",
                keyword: "temple_market",
                blocked: ""
            },
            {
                type: 5,
                title: "Make Camp",
                keyword: "default_camp"
            },
            {
                type: 5,
                title: "Thornhood Soja, the merchant",
                keyword: "thornhood_soja"
            }
        ]
    },
    {
        keyword: "temple_market",
        title: "The Temple Market",        
        description: "A winding street, that once lead to a place of worship. The stones here are covered in rich green and purple mosses.\n\nPropped up inside a ruined wall is a makeshift tent, providing some respite from the dripping rain. From within, a small campfire is flickering away.",
        narration: "A soft rain sifts through the gray clouds above.",
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
                type: 5,
                title: "East to the Messenger's Tent",
                keyword: "messenger",
                blocked: ""
            },
            {
                type: 1,
                title: "South to the Templefront",
                keyword: "templefront",
                blocked: ""
            }
        ]
    },    
    {
        keyword: "templefront",
        title: "The Templefront",        
        description: "A great temple stands before, it's walls have stood the test of time much better than most of this place.\n\nIt's made of a white stone that gleams under the moistness in the air.",
        narration: "Standing imposingly to the south is an ancient stone golem. It's head turns to face you.",
        actions: [
            {
                type: 1,
                title: "North to the Temple Market",
                keyword: "temple_market",
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
                title: "South to the Temple Arcades",
                keyword: "temple_arcades",
                blocked: "temple_golem"
            },
            {
                type: 3,
                title: "A Temple Golem is standing here",
                keyword: "temple_golem",
                blocked: ""
            }
        ]
    },
    {
        keyword: "temple_arcades",
        title: "The Temple Arcades",        
        description: "TO DO",
        narration: "",
        actions: [
            {
                type: 1,
                title: "North to the Templefront",
                keyword: "templefront",
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
    },
    {
        keyword: "kings_road",
        title: "The King's Road",        
        description: "Once a wide causeway for traders heading to the Temple Market has become home to the fallen remains the tall stone buildings that once lined it.",
        narration: "",
        actions: [
            {
                type: 1,
                title: "North to the King's Gate",
                keyword: "kings_gate",
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
                title: "East to a Shelterd Nook",
                keyword: "sheltered_nook",
                blocked: ""
            },
            {
                type: 1,
                title: "South to the Town Square",
                keyword: "town_square",
                blocked: ""
            },
            {
                type: 4,
                title: "locket",
                keyword: "silver_locket",
                blocked: ""
            }
        ]
    },
    {
        keyword: "kings_gate",
        title: "King's Gate",        
        description: "The memory of a beautifully arching gate can be felt in the stone remains here. A tall spire still stands, one half of what once was.",
        narration: "",
        actions: [
            {
                type: 2,
                title: "North through a doorway to the Bottom Stairway (Locked)",
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
                title: "South to the King's Road",
                keyword: "kings_road",
                blocked: ""
            }
        ]
    },
    {
        keyword: "sheltered_nook",
        title: "A Sheltered Nook",        
        description: "You managed to find a cranny amongst the ruins with four walls and some degree of shelter from the rain.",
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
                title: "West to the King's Road",
                keyword: "kings_road",
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
            },
            {
                type: 3,
                title: "A hungry rat is here gnashing on a bone",
                keyword: "large_rat",
                blocked: ""
            },
            {
                type: 4,
                title: "A small handful of gold pieces",
                keyword: "destroy",
                blocked: "",
                func: "addGold|10|You pick up the handful of coins"
            }            
        ]
    },
    {
        keyword: "narration_02_01",
        title: "",        
        description: "",
        narration: "You make your way through the winding streets of the ruined settlement.\n\nMarking a serpentine path eastwards.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_02_02",
                blocked: ""
            }
        ]
    },
    {
        keyword: "narration_02_02",
        title: "",        
        description: "",
        narration: "As you crest a final hill, you see before you the eastern half of the village has been overtaken entirely in ink black overgrowth.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "narration_02_03",
                blocked: ""
            }
        ]
    },
    {
        keyword: "narration_02_03",
        title: "",        
        description: "",
        narration: "An undulating sea of leaves and thorn bramble as dark as night reaching forth and at the center of it all, the obelisk.\n\nThe great Black Tower.",
        actions: [
            {
                type: 1,
                title: "Next",
                keyword: "black_road",
                blocked: "",
                func: "replaceAction|town_square|1|{\"type\": 1,\"title\": \"East to the Blackened Road\",\"keyword\": \"black_road\",\"blocked\": \"\"}|2"
            }
        ]
    },
    {
        keyword: "black_road",
        title: "The Black Leaf Road",        
        description: "A narrow road leads east, down a long hill. Thorny vines from reaching plants search for a sleeve to catch themselves on.\n\nThe path is oddly well worn.",
        narration: "You hear the sound of a creature calling out. A mix of crow call and hyena laugh.",
        actions: [
            {
                type: 2,
                title: "North",
                keyword: "",
                blocked: ""
            },
            {
                type: 1,
                title: "West to the Town Square",
                keyword: "town_square",
                blocked: ""
            },
            {
                type: 2,
                title: "East to the Tower (COMING SOON)",
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