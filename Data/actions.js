export const actionsRef = [
    {
        keyword: "straight_sword_strike",
        title: "Sword Strike",
        target: true,
        active: true,
        staminaCost: 1,
        location: null,
        effect: function(target) {
            console.log(this.title);
            attack(target);
        },
        icon: "sword"        
    },
    {
        keyword: "run_away",
        title: "Run Away",
        target: false,
        active: true,
        staminaCost: 0,
        location: null,        
        effect: function() {
            console.log(this.title);
        },
        icon: "run"
    },
    {
        keyword: "flask",
        title: "Flask of Ether",
        target: false,
        active: true,
        staminaCost: 1,
        location: null,
        effect: function() {
            console.log(this.title);
        },
        icon: "flask"
    }
]