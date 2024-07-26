// 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action

npcs = [
    {
        keyword: "jorrid",
        title: "Jorrid the Rat",
        shortTitle: "Jorrid",        
        description: "An oily man wrapped in tattered clothes, has made something of a home for himself in this damp ruin. Strewn about him are various worthless trinkets and knick knacks.",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [
            {
                type: 6,
                title: "Talk",
                func: "talk"
            },
            {
                type: 6,
                title: "Leave",
                func: "returnToPrimaryContext"
            }          
        ],
        dialogue: [
            {                                            
                text: "Jorrid beckons you closer. \"Come on now, I won't bite. \" he says with a feverish laugh. \"I've got something going here with the adventuresome folk round here. You look like you could play the part.\"",                
                func: "advanceDialogue|jorrid"
            },
            {                                            
                text: "\"No doubt you'll end up at the Tower sooner or later. You find anything interesting, bring it here and I'll be sure to reward you well.\" He gestures at the random assortment of things laying about to drive home his point.",                
                func: ""
            }                        
        ],
    },
    {
        keyword: "messenger",
        title: "The Messenger",
        shortTitle: "messenger",        
        description: "A well dressed scholar from the easten isles sits crossed legged on a floor of colorful layered rugs.",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [
            {
                type: 6,
                title: "Talk",
                func: "talk"
            },
            {
                type: 6,
                title: "Leave",
                func: "returnToPrimaryContext"
            }          
        ],
        dialogue: [
            {                                            
                text: "\"I came here with a very important message for my lord, but I have reason to believe he's gone into the Tower to the east.\"",
                func: "advanceDialogue|messenger"
            },
            {                                            
                text: "\"If it wouldn't be too much trouble, could you keep your eyes out for him?\"",
                func: ""
            }
        ],
    },
    {
        keyword: "default_camp",
        title: "Camp",
        shortTitle: "camp",
        description: "You take out your bedroll and make a small cookfire. This is as good a place as any to take stock of your situation, and prepare for the journey ahead.",
        dialogueAvailable: null,
        currentDialogue: 0,
        actions: [
            {
                type: 6,
                title: "Train",
                func: "train"
            },
            {
                type: 6,
                title: "Rest",
                func: "rest"
            },
            {
                type: 6,
                title: "Leave",
                func: "returnToPrimaryContext"
            }            
        ],
        dialogue: [
        ]
    }
];
