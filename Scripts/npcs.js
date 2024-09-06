// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

npcs = [

    //----------------------//
    //-- The Old Monastery 
    //----------------------//
    {
        keyword: "morgan",
        title: "Morgan, the Groundskeeper",
        shortTitle: "Morgan",
        description: "The Monastery's Keeper was tall and slender, standing among the roses and climbing vines of the Western Garden.",
        dialogueAvailable: true,
        currentDialogue: 0,
        items: [],
        actions: [         
        ]
    },    
    {
        keyword: "oryan",
        title: "Oryan, the Swordsmith's Descendant",
        shortTitle: "Oryan",        
        description: "A place where the Swordsmiths to the King's army once worked. Still maintained to exacting standards, but the sword arts have been long lost.",
        dialogueAvailable: true,
        currentDialogue: 0,
        items: ["iron_longsword","eagle_shield","deepstone_talisman"],
        actions: [
            {                
                keyword: "reforge",
                title: "Reforge",
                active: true,
                staminaCost: -1,
                location: "",
                func: "upgrade"
            }         
        ]
    },
    {
        keyword: "ryth",
        title: "Ryth, the Vagrant",
        shortTitle: "ryth",        
        description: "A long jacket, hung to the top of her heavy boots. Thick hair and rough cut bangs framed a face you didn't trust from the very beginning.",
        dialogueAvailable: true,
        currentDialogue: 0,
        items: ["town_map"],
        actions: [            
        ]
    },
    {
        keyword: "shrine",
        title: "Lost Shrine",
        shortTitle: "shrine",
        description: "Simply carved hoarstone worn smooth with the years. A place of offerings to the small gods of this place.",
        dialogueAvailable: null,
        currentDialogue: 0,
        actions: [
            {                
                keyword: "train",
                title: "Seek Guidance",
                active: true,
                staminaCost: -1,
                location: "",
                func: "train"
            },
            {                
                keyword: "rest",
                title: "Rest",
                active: true,
                staminaCost: -1,
                location: "",
                func: "rest"
            }
        ]    
    },





    
    {
        keyword: "jorrid",
        title: "Jorrid the Rat",
        shortTitle: "Jorrid",        
        description: "An oily man wrapped in tattered clothes, has made something of a home for himself in this damp ruin. Strewn about him are various worthless trinkets and knick knacks.",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [         
        ]        
    },
    {
        keyword: "messenger",
        title: "The Messenger",
        shortTitle: "messenger",        
        description: "A well dressed scholar from the easten isles sits crossed legged on a floor of colorful layered rugs.",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [         
        ]
    },
    {
        keyword: "thornhood_kijil",
        title: "Thornhood nightblade",
        shortTitle: "Kijil",        
        description: "A black cloaked man leans casually against a pillar to the side of the road.",    
        dialogueAvailable: false,
        currentDialogue: 0,
        actions: [                     
        ]   
    },
    {
        keyword: "thornhood_soja",
        title: "Thornhood Soja",
        shortTitle: "Soja",        
        description: "Knife-cut Short cropped black hair peeks out from inside a dark green hood. They regard you steadily as you approach.",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [        
        ]        
    }
];
