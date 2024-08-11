items = [
    {
        keyword: "strange_stone",
        title: "A strangely shaped stone",
        shortTitle: "stone",
        description: "Smooth as an ocean stone but undulating gently as though there's something growing within it.",
        canEquip: false,
        equipped: false,
        power: 0,
        stamina: 0,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context           
        ],
    },
    {
        keyword: "straight_sword",
        title: "An old Rhenish straight sword",
        shortTitle: "sword",
        canEquip: true,
        equipped: true,
        power: 20,
        stamina: 0,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context
            {                
                type: 6,                
                title: "Attack with piercing strike",
                func: "attack|1"
            }            
        ],
    },        
    {
        keyword: "worn_shield",
        title: "A battered wooden shield.",
        shortTitle: "shield",
        canEquip: true,
        equipped: true,
        power: 0,
        stamina: 0,
        defence: 10,        
        actions: [          // Item actions will be added while in a monster sub-context             
        ],
    },
    {
        keyword: "green_cloak",
        title: "Long green cloak of the Woodland Protectors",
        shortTitle: "cloak",
        canEquip: true,
        equipped: true,
        power: 0,
        stamina: 1,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context            
        ],
    },
    {
        keyword: "curse_mark",
        title: "Scarred curse mark",
        shortTitle: "mark",
        canEquip: false,
        equipped: true,
        power: 5,
        stamina: 0,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context            
        ],
    },
    {
        keyword: "silver_locket",
        title: "A simple silver locket",
        shortTitle: "locket",
        canEquip: true,
        equipped: false,
        power: 0,
        stamina: 10,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context            
        ],
    },
    {
        keyword: "key",
        title: "A simple brass key",
        shortTitle: "key",
        canEquip: false,
        equipped: false,
        power: 0,
        stamina: 0,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context            
        ],
    },
    {
        keyword: "ripe_fruit",
        title: "A perfectly ripe piece of fruit",
        shortTitle: "fruit",
        canEquip: false,
        equipped: false,
        power: 0,
        stamina: 0,
        defence: 0,        
        actions: [          // Item actions will be added while in a monster sub-context           
        ],
    },        
    {
        keyword: "iron_longsword",
        title: "Iron Longsword",
        shortTitle: "longsword",
        description: "A relic of the time before the burning war when there was still forests in Rhen that needed protecting. A simple blade made for those who moved silently through the woodlands.",
        canEquip: true,
        equipped: true,
        power: 0,
        stamina: 0,
        defence: 10,
        cost: 1,        
        actions: [          // Item actions will be added while in a monster sub-context             
        ],
    },        
    {
        keyword: "eagle_shield",
        title: "Eagle Shield",
        shortTitle: "shield",
        canEquip: true,
        equipped: true,
        power: 0,
        stamina: 0,
        defence: 10,
        cost: 250,
        actions: [          // Item actions will be added while in a monster sub-context             
        ],
    },        
    {
        keyword: "deepstone_talisman",
        title: "Deepstone Talisman",
        shortTitle: "shield",
        canEquip: true,
        equipped: true,
        power: 0,
        stamina: 5,
        defence: 0,
        cost: 560,        
        actions: [          // Item actions will be added while in a monster sub-context             
        ],
    }

];
