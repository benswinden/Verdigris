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
                text: "Jorrid beckons you closer. \"Come on now, I won't bite. \" he says with a feverish laugh. \"I've been hoping for an honest adventurer to come along and help me with the important work I'm doing here.\"",                
                func: "advanceDialogue|jorrid"
            },
            {                                            
                text: "\"You look like the type who's headed to the tower. You find anything unusual, bring it here and I'll be sure to reward you well.\" He gestures at the random assortment of trash laying about to drive home his point.",                
                func: ""
            }                        
        ],
    },
    {
        keyword: "messenger",
        title: "The Messenger",
        shortTitle: "messenger",        
        description: "A well dressed scholar from the easten isles sits crossed legged on a floor of colorful layered rugs. They nod to you in acknowledgement. ",
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
                text: "\"Come to me if you need something delivered, or if your waiting for something to come your way.\" They say to you in a steady voice.",                
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
