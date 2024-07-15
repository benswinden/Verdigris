locations = [
    {
        keyword: "grassy_hill",
        title: "A Grassy Hill",        
        description: "The top of a tall hill covered with tall yellow grass and orange clover. From here, you can see down the long slope before you, into the Valley below.",
        narration: "You awaken atop a gentle sloping grass covered hill. Strange.",
        actions: [
            {
                type: 0,
                title: "South towards a gaping crevasse",
                keyword: "canyon_edge"
            }
        ]
    },    
    {
        keyword: "canyon_edge",
        title: "At the Canyon's Edge",
        description: "The rocks and earth have torn themselves apart here, leaving a wide chasm in your path. Reaching out of it’s darkness are masses of twisting grass and vines that had obscured it from your view until you were right up on it.",
        narration: "",
        actions: [
            {
                type: 0,
                title: "East into the tall grass at the canyon's edge",
                keyword: "thicket"
            },
            {
                type: 0,
                title: "North up a grassy hill",
                keyword: "grassy_hill"
            }
        ]
    },
    {
        keyword: "thicket",
        title: "Into the Thicket",        
        description: "Masses of tangled grasses grow right up to the canyon edge but a trickle of water from a wide leaf above you has created a thin passageway. The sweet smell of blossoms over you head filters down into this tangled thicket.",
        narration: "",
        actions: [
            {
                type: 0,
                title: "South down a slippery slope",
                keyword: "slippery_slope"
            },
            {
                type: 0,
                title: "West to the canyon's edge",
                keyword: "canyon_edge"
            }
        ]
    },
    {
        keyword: "slippery_slope",
        title: "A Slippery Slope",        
        description: "Earth and stone angle downwards, gently at first then sharply. The rock has broken apart, forming several natural ledges that lead downwards into the canyon. \n\nTrickling water has made the stone here slick and there’s little to grab on to for balance.",
        narration: "",
        actions: [
            {
                type: 0,
                title: "Climb down the slippery slope",
                keyword: "canyon_bottom"
            },
            {
                type: 0,
                title: "North into the tall grass at the canyon's edge",
                keyword: "thicket"
            }
        ]
    },
    {
        keyword: "canyon_bottom",
        title: "Bottom of the Canyon",        
        description: "Surrounded by earth and rock, the bottom of the cayon is cool and damp.",
        narration: "You move close to the edge of the rock shelf, looking for a way down. The wet stone has become a perfect bed for a thin layer of slime that coats the rock and when your weight falls on a particularly slimy patch, your foot comes out from under you.\n\nYour body hits the rock and you lose control, rolling over the side. Your fingers catch the rock edge for exactly one second of sheer panic before you lose grip and fall. Down, down, down until you stop with a bone shattering impact followed quickly by a surrender to darkness.",
        actions: [
            {
                type: 0,
                title: "Travel eastwards to the canyon's exit",
                keyword: "canyon_gate"
            }
        ]
    },
    {
        keyword: "canyon_gate",
        title: "Ruined Canyon Gate",
        description: "Before you towers the remains of a massive gate that may have once ushered travellers from afar into the Lowland Provinces. Now only the carved stone remains, though much has erroded and fallen away.",
        narration: "The canyon's quiet is broken by the sound of metal on metal as a dark figure slowly raises itself from a shadow in the rock where it had been sitting lifelessly.",
        actions: [
            {
                type: 0,
                title: "Travel west deeper into the canyon",
                keyword: "canyon_bottom"
            },
            {
                type: 1,
                title: "A long dead knight in rusted armor stands in your path",
                keyword: "dead_knight"
            },
            {
                type: 0,
                title: "Travel east through the great canyon gateway",
                keyword: "canyon_bottom"
            },
        ]
    }
];