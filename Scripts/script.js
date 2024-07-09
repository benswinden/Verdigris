let lvl = 0;
let xp = 0;
let hp = 0;
let gold = 0;

let currentLocation = 0;

let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Stats
const lvlText = document.querySelector('#lvl-text');
const xpText = document.querySelector('#xp-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
// Main Content
const mainTitleText =  document.querySelector('#main-title-text');
const mainText =  document.querySelector('#main-text');
// Buttons
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');



InitializeGame();

function InitializeGame() {

    let lvl = 999;
    let xp = 999;
    let hp = 999;
    let gold = 999;
    updateStats();

    currentLocation = 0;
    UpdateLocation();

    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
}

function updateStats() {

    lvlText.innerText = lvl;
    xpText.innerText = xp;
    hpText.innerText = hp;
    goldText.innerText = gold;
}

function UpdateLocation() {    
        
    mainText.innerText = locations[currentLocation].description;
    mainTitleText.innerText = locations[currentLocation].name;

    if (locations[currentLocation].contains.length > 0) {        
        locations[currentLocation].contains.forEach((element, index) => {
            
            console.log(element + " : " + index);
        });
    }        
}