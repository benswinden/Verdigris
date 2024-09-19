areas = [    
    {
        keyword: "bramble_path",
        title: "The Bramble Path",
        description: "The ancient pathways were overgrown and hard to discern which way was which.",
        narration: "",
        update: "",
        locations: [
            {
                coordinates: [2,5],
                visited: false,
                seen: false,
                items: ["green_herb_pickup"],
                monsters: [],
                npcs: [],
                north: [1,5],
                west: [2,4],
                east: null,
                south: [3,5],                
            },
            {
                coordinates: [2,4],
                visited: false,
                seen: false,
                items: ["crimson_gate"],
                monsters: [],
                npcs: [],
                north: [1,4],
                west: [2,3],
                east: [2,5],
                south: null,                
            },
            {
                coordinates: [2,3],
                visited: false,
                seen: false,
                items: [],
                monsters: ["goblin_01"],
                npcs: [],
                north: null,
                west: null,
                east: [2,4],
                south: null,                
            },
            {
                coordinates: [1,5],
                visited: false,
                seen: false,
                items: ["ore"],
                monsters: [],
                npcs: ["ryth"],
                north: null,
                west: null,
                east: null,
                south: [2,5],                
            },
            {
                coordinates: [3,5],
                visited: false,
                seen: false,
                items: [],
                monsters: [],
                npcs: [],
                north: [2,5],
                west: null,
                east: [3,6],
                south: null,                
            },
            {
                coordinates: [3,6],
                visited: false,
                seen: false,
                items: ["thorny_bramble"],
                monsters: ["grub_01"],
                npcs: [],
                north: null,
                west: [3,5],
                east: [3,7],
                south: null,                
            },
            {
                coordinates: [3,7],
                visited: false,
                seen: false,
                items: ["crimson_key"],
                monsters: ["grub_02"],
                npcs: [],
                north: null,
                west: [3,6],
                east: null,
                south: null,                
            },
            {
                coordinates: [1,4],
                visited: false,
                seen: false,
                items: ["relic"],
                monsters: ["centipede"],
                npcs: [],
                north: null,
                west: null,
                east: null,
                south: [2,4],                
            }
        ]
    }
]