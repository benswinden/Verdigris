let version = 0.009;

let lvl = 0;
let xp = 0;
let hp = 0;
let gold = 0;

let attackPower = 0;

let currentContext = 0;         // Index of the current displayed context. Index related to a certain array, currentContextType indicates what type of context and therefore which array to sear
let currentContextType = 0;     // 0 = Location, 1 = Monster, 2 = Item, 3 = NPC
let storedLocation = 0;         // Anytime we change to a secondary context, store the primary context location
let locationsVisited = [];      // A list of locations we have already visited

let updateTextString = "";

// Debug
let debugActive = false;

// Stats
const lvlText = document.querySelector('#lvl-text');
const xpText = document.querySelector('#xp-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
// Main Content
const mainTitleText =  document.querySelector('#main-title-text');
const secondaryTitle =  document.querySelector('#secondary-title');
const secondaryTitleText =  document.querySelector('#secondary-title-text');
const mainText =  document.querySelector('#main-text');
const narrationText =  document.querySelector('#narration-text');
const updateText =  document.querySelector('#update-text');
const monsterHpSection =  document.querySelector('#monster-hp-section');
const monsterHpBar =  document.querySelector('#monster-hp-bar-current');
const monsterHpText =  document.querySelector('#monster-hp-text');
// Buttons
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const button5 = document.querySelector('#button5');
const button6 = document.querySelector('#button6');
//Misc
const debugWindow = document.querySelector('#debug');
const debugButton1 = document.querySelector('#debug-button1');
const debugButton2 = document.querySelector('#debug-button2');
const debugButton3 = document.querySelector('#debug-button3');
const debugButton4 = document.querySelector('#debug-button4');
const debugButton5 = document.querySelector('#debug-button5');
//Colors
const buttonBackColorLocation = '#EAEAEA';
const buttonBackcolorEnemy = '#FFAFAF';
const buttonBackcolorItem = '#8ED5EC';
const buttonBackcolorNPC = '#81DC9B';
const buttonBackcolorLocked = '#F6F6F6';
const buttonTextColorDefault = '#000';
const buttonTextColorLocked = '#989898';

const mainTitleActive = '#101010';
const secondaryTitleActive = '#757575';

// Containers
let locations = [{
    keyword: "",
    title: "",        
    description: "",
    narration: "",
    actions: [
        {
            type: 0,        // Determines what the button looks like, and what it does 0 = Location, 1 = Monster, 2 = Item, 3 = NPC, 4 = Misc Action, 5 = Locked
            title: "",      // String used in the button
            keyword: "",    // key used to search for the associated action
            blocked: "",    // If this monster is present, this location is blocked
        }        
    ]
}];
let monsters = [
    {
        keyword: "",
        title: "",
        shortTitle: "",
        description: "",
        hp: 0,
        attackPower: 0,
        xp: 0,
        gold: 0,
        actions: [
            {
                type: 0,
                title: "",
                func: ""
            }            
        ]
    }
];
// Store these containers at runtime because they will be modified as the player plays
let monstersModified = [];
let locationsModified = [];

let items = [];



function initializeGame() {

    console.log("InitializeGame - ");
    
    // Check whether there is already a save game
    if (localStorage.getItem('saveExists')) {
        console.log("Save game exists");

        let validVersion = versionCheck();

        if (validVersion)
            load();
        else {
            console.log("Invalid save found - resetting game");
            resetGame();
        }
    }
    // No save game, so start a new game
    else {

        console.log("Save game doesn't exist");
        lvl = 1;
        xp = 0;
        hp = 100;
        gold = 20;    

        attackPower = 10;

        currentContext = 0;
        storedLocation = -1;
        currentContextType = 0;
        locationsVisited = [];

        monstersModified = monsters;
        locationsModified = locations;

        save();
    }

    updateStats();
    updateLocation();
}

function updateStats() {

    lvlText.innerText = lvl;
    xpText.innerText = xp;
    hpText.innerText = hp;
    goldText.innerText = gold;
}

function updateLocation() {    
    
    console.log("updateLocation - currentLocation: " + currentContext + "   currentLocationType: " + currentContextType + "    storedLocation: " + storedLocation);
    
    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
    button4.style.display = "none";
    button5.style.display = "none";
    button6.style.display = "none";
    button1.onclick = '';
    button2.onclick = '';
    button3.onclick = '';
    button4.onclick = '';
    button5.onclick = '';
    button6.onclick = '';

    narrationText.style.display = "none";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";

    // By default, we'll be getting our action buttons from a location
    let actions = [];    

    // If we are updating to a location type - 
    if (currentContextType === 0) {    

        // Check if we've already visited this location
        let locationVisited = false;
        locationsVisited.forEach((element, index) => {

            if (currentContext == element)
                locationVisited = true;
        });

        // First time visiting this location, check whether there is a narration to play first
        if (!locationVisited) {
            
            locationsVisited.push(currentContext);
            save();
            
            if (locationsModified[currentContext].narration != "") {
                narrationText.style.display = "block";
                narrationText.innerText = locationsModified[currentContext].narration;  // Add the narration text so it appears before the main text for the locat                
            }
        }

        actions = locationsModified[currentContext].actions;

        mainTitleText.style.color = mainTitleActive;
        secondaryTitle.style.display = "none";
        
        mainTitleText.innerText = locationsModified[currentContext].title;                
        mainText.innerText = locationsModified[currentContext].description;    
    }
    // If currentLocationType != 0 - We are currently in a secondary context
    else if (currentContextType != 0) {
        
        mainTitleText.innerText = locationsModified[storedLocation].title;
        mainTitleText.style.color = secondaryTitleActive;
        secondaryTitle.style.display = "flex";
        
        // Change the array of actions we are looking at depending on the context type
        switch (currentContextType) {
            case 1:
                secondaryTitleText.innerText = monstersModified[currentContext].title;
                mainText.innerText = monstersModified[currentContext].description;

                monsterHpSection.style.display = "block";
                updateMonsterUI();

                actions = monstersModified[currentContext].actions;
                break;
            case 2:                
                break;
        }
    }

    if (actions.length > 0) {    

        actions.forEach((element, index) => {
            
            let additionalButtonString = "";        // If any additional text needs to be appended to a button
            let button = button1;
            
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
                case 3:
                    button = button4;
                    break;
                case 4:
                    button = button5;
                    break;
                case 5:
                    button = button6;
                    break; 
            }
            
            switch (element.type) {
                
                // Location
                case 0:
                                        
                    // Check whether this is a location that may be blocked by a monster
                    let monsterFound = false;
                    if (element.blocked != "") {
                        
                        // Loop through all actions to see if there is a monster with a matching keyword
                        actions.forEach((actionElement, index) => {                            
                            if (element.blocked == actionElement.keyword) {
                                
                                monsterFound = true;
                                button.style.backgroundColor = buttonBackcolorLocked;
                                button.style.color = buttonTextColorLocked;
                                button.classList.remove("can-hover");
                                additionalButtonString += " [Blocked]";
                            }
                        });
                    }
                    
                    // If there is no value for blocked, or else we didn't find a monster at this location with the matching keyword
                    if (element.blocked === "" || !monsterFound) {
                
                        button.style.backgroundColor = buttonBackColorLocation;
                        button.style.color = buttonTextColorDefault;
                        button.classList.add("can-hover");

                        button.onclick = function() {changeContext(element.keyword, 0)};
                    }

                    break;
                // Monster
                case 1:
                    button.style.backgroundColor = buttonBackcolorEnemy;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {changeContext(element.keyword, 1)};
                    break;
                // ITEM
                case 2:
                    button.style.backgroundColor = buttonBackcolorItem;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");
                    break;
                // NPC
                case 3:
                    button.style.backgroundColor = buttonBackcolorNPC;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");
                    break;
                // Misc Action
                case 4:
                    button.style.backgroundColor = buttonBackColorLocation;                    
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {doAction(element.func)};                    
                    break;
                // Locked Action
                case 5:
                    
                    button.style.backgroundColor = buttonBackcolorLocked;
                    button.style.color = buttonTextColorLocked;
                    button.classList.remove("can-hover");
                    break;
            }        

            button.innerText = element.title + additionalButtonString;            
            button.style.display = "block";
        });
    }        
}

// Finds the index of the context we want to go to using the keyword
// We use a keyword instead of relying only on index for human readibility
function changeContext(keyword, contextType) {

    console.log("changeLocation - keyword:" + keyword + "   contextType:" + contextType);

    let entryFound = false;
    // If it's not a secondary context, we look for the new location within locations
    if (contextType === 0) {

        locationsModified.forEach((element, index) => {
            if (element.keyword == keyword) {
                currentContext = index;
                currentContextType = 0;
                storedLocation = -1;
                entryFound = true;
            }
        });    
    }
    else if (contextType > 0) {        

        // Search for the context we linked within the monsters group
        monstersModified.forEach((element, index) => {
            if (element.keyword == keyword) {
                storedLocation = currentContext;
                currentContext = index;            
                currentContextType = 1;
                entryFound = true;
            }
        });

        // If we didn't find the entry as a monster we search for it in items
        if (!entryFound) {

            items.forEach((element, index) => {
                if (element.keyword == keyword) {
                    storedLocation = currentContext
                    currentContext = index;                    
                    currentContextType = 2;
                    entryFound = true;
                }
            });
        }
    }

    if (entryFound) {
        save();
        updateLocation();
    }
    else if (!entryFound) {
        console.error("ChangeContext() - Couldn't find the keyword [" + keyword + "] as contextType: " + contextType);
    }
}

function updateMonsterUI() {

    monsterHpText.innerText = monstersModified[currentContext].hpCurrent + "/" + monstersModified[currentContext].hpMax;
    let monsterHpCurrentPercent = monstersModified[currentContext].hpCurrent / monstersModified[currentContext].hpMax * 100;
    // The width of our hp bar is the current hp percentage * 2 because the total width of the bar is 200    
    monsterHpBar.style.width = monsterHpCurrentPercent * 2 + 'px';
}

function addUpdateText(text) {

    updateText.style.display = "block";
    updateText.innerText = text;
}



// ACTIONS

// Translate a string provided in through the context data into an action
function doAction(actionString) {
    
    switch (actionString) {
        case "attack":
            attack();
            break;
        case "dodge":
            dodge();
            break;
        case "returnToPrimaryContext":
            returnToPrimaryContext();
            break;
    }
}

function attack() {

    console.log("attack() - Attack Power: " + attackPower);
    monstersModified[currentContext].hpCurrent -= attackPower;
    updateMonsterUI();
    hp -= monstersModified[currentContext].attackPower;
    updateStats();
    save();

    if (hp <= 0) {
        console.log("PLAYER DEAD");
    }
    // Check if the monster is dead
    else if (monstersModified[currentContext].hpCurrent <= 0) {

        let monsterIndex = returnMonsterIndex(locationsModified[storedLocation].actions, monstersModified[currentContext].keyword);        
        locationsModified[storedLocation].actions.splice(monsterIndex, 1);   // Remove the monster from the array                
        let storedMonsterString = "The " + monstersModified[currentContext].shortTitle + " falls dead at your feet\nYou receive " + monstersModified[currentContext].xp + " experience and " +  monstersModified[currentContext].gold + " gold";

        xp += monstersModified[currentContext].xp;

        returnToPrimaryContext();
        addUpdateText(storedMonsterString);
    }    
    // Add update text that provides info about attack damages
    else {

    let updateString = "You do " + attackPower + " damage to the " + monstersModified[currentContext].shortTitle + ".\nThe " + monstersModified[currentContext].shortTitle + " does " + monstersModified[currentContext].attackPower + " damage to you."    
    addUpdateText(updateString);
    }
}

function dodge() {
    console.log("didge() - ");
}

function returnToPrimaryContext() {

    currentContext = storedLocation;
    storedLocation = -1;
    currentContextType = 0;

    save();
    updateLocation();
}





// UTILITIES

function save() {

    console.log("save");
    localStorage.setItem('saveExists', "!");        // Used to test whether there is a save
    localStorage.setItem('version', JSON.stringify(version));
    localStorage.setItem('currentLocation', JSON.stringify(currentContext));
    localStorage.setItem('storedLocation', JSON.stringify(storedLocation));
    localStorage.setItem('currentLocationType', JSON.stringify(currentContextType));
    localStorage.setItem('locationsVisited', JSON.stringify(locationsVisited));
    localStorage.setItem('lvl', JSON.stringify(lvl));
    localStorage.setItem('xp', JSON.stringify(xp));
    localStorage.setItem('hp', JSON.stringify(hp));
    localStorage.setItem('gold', JSON.stringify(gold));
    localStorage.setItem('attackPower', JSON.stringify(attackPower));

    localStorage.setItem('locationsModified', JSON.stringify(locationsModified));
    localStorage.setItem('monstersModified', JSON.stringify(monstersModified));
  }
  
  function load() {

    console.log("Load");

    currentContext = JSON.parse(localStorage.getItem('currentLocation'));
    storedLocation = JSON.parse(localStorage.getItem('storedLocation'));    
    currentContextType = JSON.parse(localStorage.getItem('currentLocationType'));
    locationsVisited = JSON.parse(localStorage.getItem('locationsVisited'));
    lvl = JSON.parse(localStorage.getItem('lvl'));
    xp = JSON.parse(localStorage.getItem('xp'));
    hp = JSON.parse(localStorage.getItem('hp'));
    gold = JSON.parse(localStorage.getItem('gold'));
    attackPower = JSON.parse(localStorage.getItem('attackPower'));

    locationsModified = JSON.parse(localStorage.getItem('locationsModified'));
    monstersModified = JSON.parse(localStorage.getItem('monstersUpdated'));
  }

  function versionCheck() {
    
    let saveVersion = JSON.parse(localStorage.getItem('version'));
    console.log("Current version: " + version + "    Save Version: " + saveVersion);
    return version === saveVersion;
  }

  function resetGame() {

    localStorage.clear();
    initializeGame();
  }

  // Within a locations actions array, search for a given monster and return it's index within that array
  function returnMonsterIndex(ar, key) {
    
    let monsterIndex = -1;
    ar.forEach((element, i) => {        
        if (element.keyword === key) {
            
            monsterIndex = i;            
        }
    });

    return monsterIndex;
  }

  // DEBUG

  debugButton1.onclick = function() { resetGame()};
  debugButton2.onclick = function() { lvl++; save(); updateStats();};  
  debugButton3.onclick = function() { xp++; save(); updateStats();};
  debugButton4.onclick = function() { hp++; save(); updateStats();};
  debugButton5.onclick = function() { gold++; save(); updateStats();};