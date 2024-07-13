let lvl = 1;
let xp = 0;
let hp = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const lvlText = document.querySelector('#lvl-text');
const xpText = document.querySelector('#xp-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
const monsterSection = document.querySelector('#monster-section');
const monsterNameText = document.querySelector('#monster-name');
const monsterHpText = document.querySelector('#monster-hp');
const mainText =  document.querySelector('#main-text');

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        hp: 15
    },
    {
        name: "Fanged Beast",
        level: 8,
        hp: 60
    },
    {
        name: "Dragon",
        level: 20,
        hp: 300
    }
]

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\""
    },
    {
        name: "Store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "Cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter a cave. You see some monsters."
    },
    {
        name: "Fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "Kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, goTown],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "Lose",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You die."
    },
    {
        name: "win",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! You win the game!."
    }
];

// Initialize Buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

UpdateStats();

function update(location) {

    monsterSection.style.display = "none";

    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    mainText.innerText = location.text;

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
}

function UpdateStats() {

    lvlText.innerText = lvl;
    xpText.innerText = xp;
    hpText.innerText = hp;
    goldText.innerText = gold;
}

function goTown() {

    update(locations[0]);
}

function goStore() {

    update(locations[1]);
}

function buyHealth() {
    
    if (gold >= 10) {

        gold -= 10;
        hp += 10;        
        UpdateStats();
    }
    else {
        mainText.innerText = "You don't have enough gold";
    }
}

function buyWeapon() {
    
    if (currentWeapon < weapons.length - 1) {

        if (gold >= 30) {

            gold -= 30;
            currentWeapon++;
            UpdateStats();
            let newWeapon = weapons[currentWeapon].name;
            mainText.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            mainText.innerText += "\nIn you inventory you have: " + inventory;
        }
        else {
            mainText.innerText = "You don't have enough gold";
        }
    }
    else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {

    if (inventory.length > 1) {
        gold += 15;
        UpdateStats();
        let currentWeapon = inventory.shift()
        mainText.innerText = "You sold a " + currentWeapon + ".";
        mainText.innerText += "\nIn you inventory you have: " + inventory;
    }
}

function goCave() {
    
    update(locations[2]);
}

function fightSlime() {
    
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {

    update(locations[3]);
    monsterHealth = monsters[fighting].hp;
    monsterSection.style.display = "flex";
    monsterHpText.innerText = monsterHealth;
    monsterNameText.innerText = monsters[fighting].name;
}

function attack() {

    let damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    monsterHealth -= damage;
    hp -= monsters[fighting].level;

    mainText.innerText = "The " + monsters[fighting].name + " attacks. [" + monsters[fighting].level + " damage]";
    mainText.innerText += "\nYou attack it with your " + weapons[currentWeapon].name + "  [" + damage + " damage]";
    
    monsterHpText.innerText = monsterHealth;
    UpdateStats();

    if (hp <= 0)
        lose();
    else if (monsterHealth <= 0)

        fighting === 2 ? winGame() : defeatMonster();
}

function dodge() {

    mainText.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {

    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    UpdateStats();
    update(locations[4]);
}

function lose() {

    update(locations[5]);
}

function restart() {

    lvl = 1;
    xp = 0;
    hp = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    UpdateStats();
    goTown();
}

function winGame() {

    update(locations[6]);
}