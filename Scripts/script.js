let lvl = 0;
let xp = 0;
let hp = 0;
let gold = 0;

let currentLocation = 0;

// Debug
let debugActive = false;

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
//Misc
const debugWindow = document.querySelector('#debug');
const debugButton1 = document.querySelector('#debug-button1');
const debugButton2 = document.querySelector('#debug-button2');
const debugButton3 = document.querySelector('#debug-button3');
const debugButton4 = document.querySelector('#debug-button4');
const debugButton5 = document.querySelector('#debug-button5');

const colorLocation = '#EAEAEA';
const colorEnemy = '#FFAFAF';
const colorObject = '#8ED5EC';

InitializeGame();

document.addEventListener('keydown', function(event) {
    if (event.code == 'Tab') {
        if (!debugActive) {
            debugWindow.style.display = "block";
            debugActive = true;
        }
        else if (debugActive) {
            debugWindow.style.display = "none";
            debugActive = false;
        }
    }
});

function InitializeGame() {

    console.log("InitializeGame - ");
    
    // Check whether there is already a save game
    if (localStorage.getItem('saveExists')) {
        console.log("Save game exists");

        Load();
        UpdateStats();
        UpdateLocation();
    }
    // No save game, so start a new game
    else {
        console.log("Save game doesn't exist");
        lvl = 1;
        xp = 0;
        hp = 100;
        gold = 20;    
        UpdateStats();

        currentLocation = 0;
        Save();
    }

    UpdateLocation();
}

function UpdateStats() {

    lvlText.innerText = lvl;
    xpText.innerText = xp;
    hpText.innerText = hp;
    goldText.innerText = gold;
}

function UpdateLocation() {    
        
    mainText.innerText = locations[currentLocation].description;
    mainTitleText.innerText = locations[currentLocation].title;
    
    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";

    if (locations[currentLocation].contains.length > 0) {        
        locations[currentLocation].contains.forEach((element, index) => {
            
            let button = document.querySelector('#button1');
            switch (index) {
                case 0:
                    button = button1;
                    break;
                case 1:
                    button = button2;
                    break;
                case 2:
                    button = button3;
                    break; 
            }
            
            switch (element.type) {
                case 0:
                    button.style.backgroundColor = colorLocation;
                    button.onclick = function() {ChangeLocation(element.keyword)};
                    break;
                case 1:
                    button.style.backgroundColor = colorEnemy;
                    break;
                case 2:
                    button.style.backgroundColor = colorObject;
                    break;
            }
        
            button.innerText = element.title;
            button.style.display = "block";
        });
    }        
}

function ChangeLocation(keyword) {

    locations.forEach((element, index) => {
        if (element.keyword == keyword) {
            currentLocation = index;
        }
    });

    Save();
    UpdateLocation();
}

function Save() {
    console.log("save");
    localStorage.setItem('saveExists', "!");
    localStorage.setItem('currentLocation', JSON.stringify(currentLocation));
    localStorage.setItem('lvl', JSON.stringify(lvl));
    localStorage.setItem('xp', JSON.stringify(xp));
    localStorage.setItem('hp', JSON.stringify(hp));
    localStorage.setItem('gold', JSON.stringify(gold));
  }
  
  function Load() {

    currentLocation = JSON.parse(localStorage.getItem('currentLocation'));
    lvl = JSON.parse(localStorage.getItem('lvl'));
    xp = JSON.parse(localStorage.getItem('xp'));
    hp = JSON.parse(localStorage.getItem('hp'));
    gold = JSON.parse(localStorage.getItem('gold'));
  }

  function ResetGame() {

    localStorage.clear();
    InitializeGame();
  }

  debugButton1.onclick = function() { ResetGame()};
  debugButton2.onclick = function() { lvl++; Save(); UpdateStats();};  
  debugButton3.onclick = function() { xp++; Save(); UpdateStats();};
  debugButton4.onclick = function() { hp++; Save(); UpdateStats();};
  debugButton5.onclick = function() { gold++; Save(); UpdateStats();};