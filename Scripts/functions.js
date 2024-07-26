// #region VARIABLES

let version = 0.013;

let xp = 0;
let hpCurrent = 0;
let hpMax = 0;
let gold = 0;

// Base stats are the players raw stats
let basePower = 0;
let baseStamina = 0;
let baseEvasion = 0;
// These are the calculated stats based on other factors like equipped items
let power = 0;
let stamina = 0;
let evasion = 0;

let currentContext = 0;         // Index of the current displayed context. Index related to a certain array, currentContextType indicates what type of context and therefore which array to sear
let currentContextType = 0;     // 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action
let storedLocation = 0;         // Anytime we change to a secondary context, store the primary context location
let locationsVisited = [];      // A list of locations we have already visited

let activeDirections = [];      // Array that contains which directions (0=north, 1=west, 2=east, 3=south ) have active buttons currently

let inventory = [];             // Inventory contains index numbers for items in the items array

let respawnLocation = {
    context: 0,
    contextType: 0,
    storedLocation: 0
}

// Debug
let debugStartContext = 0;
let debugStartType = 1;
let debugActive = false;

// Stats
const xpText = document.querySelector('#xp-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
const inventoryIcon = document.querySelector('#inventory-icon');
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

const powerText = document.querySelector('#power-text');
const staminaText = document.querySelector('#stamina-text');
const evasionText = document.querySelector('#evasion-text');
const inventoryStatsSection =  document.querySelector('#inventory-stats');
// Buttons
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const button5 = document.querySelector('#button5');
const button6 = document.querySelector('#button6');
const button7 = document.querySelector('#button7');
const button8 = document.querySelector('#button8');
//Misc
const debugWindow = document.querySelector('#debug');
const debugButton1 = document.querySelector('#debug-button1');
const debugButton2 = document.querySelector('#debug-button2');
const debugButton2b = document.querySelector('#debug-button2b');
const debugButton3 = document.querySelector('#debug-button3');
const debugButton4 = document.querySelector('#debug-button4');
const debugButton5 = document.querySelector('#debug-button5');
const resetLocationsCheckbox = document.querySelector('#resetLocations');
let resetLocations = false;     // We use this for debug, when selected on reload we will always re-write locationsModified from locations so that updates to the games content can be tested immediately without needing to reset the whole game

let createdInventoryButtons = [];

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

// #region Containers
let locations = [{
    keyword: "",
    title: "",        
    description: "",
    narration: "",
    actions: [
        {
            type: 0,        // Determines what the button looks like, and what it does // 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action
            title: "",      // String used in the button
            keyword: "",    // key used to search for the associated action
            blocked: "",    // If this monster is present, this location is blocked
            func: "",       // When this is a misc action button
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
        power: 0,
        xp: 0,
        gold: 0,
        deathFunc: "",      // Called on monster death
        actions: [
            {
                type: 0,
                title: "",
                func: ""
            }            
        ]
    }
];

let npcs = [
    {
        keyword: "",
        title: "",
        shortTitle: "",
        description: "",
        dialogueAvailable: true,
        currentDialogue: 0,
        actions: [
            {
                type: 0,
                title: "",
                func: ""
            }            
        ],
        dialogue: [
            {                                            
                text: "",                
                func: ""
            }
        ]
    }
];

let items = [
    {
        keyword: "",
        title: "",
        canEquip: false,
        equipped: false,
        power: 0,
        stamina: 0,
        evasion: 0,
        actions: [          // Item actions will be added while in a monster sub-context
            {                
                type: 0,
                title: "",
                func: ""
            }            
        ],
    }
];

// Store these containers at runtime because they will be modified as the player plays
let locationsModified = [];
let monstersModified = []
let npcsModified = []
let itemsModified = []


// #endregion

//#endregion

// #region GAME CORE

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
            return;
        }
                
        updateStats();
        save();
        changeContextDirect(currentContext, currentContextType);
    }
    // No save game, so start a new game
    else {

        console.log("Save game doesn't exist");
        
        xp = 0;
        hpCurrent = 30;
        hpMax = 30;
        gold = 20;

        basePower = 10;
        baseStamina = 5;
        baseEvasion = 0;

        inventory = [];
        inventory.push(0,1,3);        

        storedLocation = -1;
        locationsVisited = [];

        respawnLocation = {
            context: 0,
            contextType: 1,
            storedLocation: -1
        }

        // Using JSON to create deep clones of our starting data arrays
        locationsModified = JSON.parse(JSON.stringify(locations));
        monstersModified = JSON.parse(JSON.stringify(monsters));
        npcsModified = JSON.parse(JSON.stringify(npcs));
        itemsModified = JSON.parse(JSON.stringify(items));    
        
        updateStats();
        save();
        changeContextDirect(debugStartContext, debugStartType);
    }
}

// Change our current context - 
// Finds the index of the context we want to go to using the keyword and context type pair as different context types will pull data from different arrays
// We use a keyword instead of relying only on index for human readibility
function changeContext(keyword, contextType) {

    console.log("changeContext - keyword:" + keyword + "   contextType:" + contextType + "   storedLocation:" + storedLocation);

    let entryFound = false;
    // If it's not a secondary context, we look for the new location within locations
    if (contextType === 1) {

        locationsModified.forEach((element, index) => {
            if (element.keyword == keyword) {
                currentContext = index;
                currentContextType = 1;
                storedLocation = -1;
                entryFound = true;
            }
        });    
    }
    else if (contextType > 1) {        
                
        // Search for the context we linked within the monsters group        
        monstersModified.forEach((element, index) => {
            if (element.keyword == keyword) {
                
                if (storedLocation === -1) storedLocation = currentContext;     // Check for null storedLocation, if there is already a value then we are loading directly into this location. The better solution this this issue would be storing the parent context within the child
                currentContext = index;
                currentContextType = 3;
                entryFound = true;
            }
        });

        // If we didn't find the entry as a monster we search for it in items
        if (!entryFound) {

            itemsModified.forEach((element, index) => {
                if (element.keyword == keyword) {
                 
                    if (storedLocation === -1) storedLocation = currentContext;     // Check for null storedLocation, if there is already a value then we are loading directly into this location. The better solution this this issue would be storing the parent context within the child
                    currentContext = index;
                    currentContextType = 4;
                    entryFound = true;
                }
            });
        }

        // If we didn't find the entry as a monster we search for it in npcs
        if (!entryFound) {
            
            npcs.forEach((element, index) => {

                if (element.keyword == keyword) {
                    
                    if (storedLocation === -1) storedLocation = currentContext;     // Check for null storedLocation, if there is already a value then we are loading directly into this location. The better solution this this issue would be storing the parent context within the child
                    currentContext = index;
                    currentContextType = 5;
                    entryFound = true;
                }
            });
        }
    }

    if (entryFound) {

        save();
        updateContext();
    }
    else if (!entryFound) {
        console.error("ChangeContext() - Couldn't find the keyword [" + keyword + "] as contextType: " + contextType);
    }
}

// Used to go directly to a known context
function changeContextDirect(contextIndex, contextType) {
    
    let keyword = "";
    switch (contextType) {
        case 1://Location
            keyword = locationsModified[contextIndex].keyword;
            break;
        case 3://Monster
            keyword = monstersModified[contextIndex].keyword;
            break;
        case 4://Item
            //Items aren't contexts
            break;
        case 5://NPC
            keyword = npcsModified[contextIndex].keyword;
            break;                
    }

    changeContext(keyword, contextType);
}

// Update the UI to reflect a change in context, or other significant changes in the gameplay state
function updateContext() {    
    
    console.log("updateContext - currentContext: " + currentContext + "       currentContextType: " + currentContextType + "    storedLocation: " + storedLocation);

    narrationText.style.display = "none";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";

    inventoryStatsSection.style.display = "none";
    document.querySelector("#inventory-title").style.display = "none";

    // By default, we'll be getting our action buttons from a location
    let actions = [];

    // If we are updating to a location type - 
    if (currentContextType === 1) {    

        // Check if we've already visited this location
        let locationVisited = false;
        locationsVisited.forEach((element, index) => {

            if (currentContext == element)
                locationVisited = true;
        });

        // First time visiting this location, check whether there is a narration to play first
        if (!locationVisited) {
            
            // If the description for this context is empty, that means it's only narration and we shouldn't add it to visited. If we did, players could get linked back to it and it would be empty as narration doesn't appear the second time visiting
            if (locationsModified[currentContext].description != "") {
                locationsVisited.push(currentContext);
                save();
            }
            
            // Check if there is narration text, then show it as this is the first time visiting
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
    // If currentLocationType != 1 - We are currently in a secondary context
    else if (currentContextType != 1) {
        
        mainTitleText.innerText = locationsModified[storedLocation].title;
        mainTitleText.style.color = secondaryTitleActive;
        secondaryTitle.style.display = "flex";
        
        // Change the array of actions we are looking at depending on the context type
        switch (currentContextType) {
            // 3 = Monster
            case 3:
                secondaryTitleText.innerText = monstersModified[currentContext].title;
                mainText.innerText = monstersModified[currentContext].description;

                monsterHpSection.style.display = "block";
                updateMonsterUI();
                
                actions = generateItemActions(monstersModified[currentContext].actions);
                console.log(actions);
                break;
            // 4 = Item
            case 4:
                break;
            // 4 = NPC
            case 5:
                secondaryTitleText.innerText = npcsModified[currentContext].title;
                mainText.innerText = npcsModified[currentContext].description;                

                actions = npcsModified[currentContext].actions;
                break;
        }
    }

    updateButtons(actions);
}

function hideAllButtons() {

    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
    button4.style.display = "none";
    button5.style.display = "none";
    button6.style.display = "none";
    button7.style.display = "none";
    button8.style.display = "none";    
}

function updateButtons(actions)  {        
        
    hideAllButtons();
    activeDirections = [];

    button1.onclick = '';
    button2.onclick = '';
    button3.onclick = '';
    button4.onclick = '';
    button5.onclick = '';
    button6.onclick = '';
    button7.onclick = '';
    button8.onclick = '';

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
                case 6:
                    button = button7;
                    break;
                case 7:
                    button = button8;
                    break; 
            }
            
            switch (element.type) {
                
                // There is no type 0
                case 0:
                    console.error("updateLocation() - Error " + element.title + " action[ "+ index + "] has type 0");
                    break;
                // Location
                case 1:
                                        
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
                        
                        activeDirections.push(index);
                        button.style.backgroundColor = buttonBackColorLocation;
                        button.style.color = buttonTextColorDefault;
                        button.classList.add("can-hover");

                        button.onclick = function() { changeContext(element.keyword, 1); if (element.func != undefined) doAction(element.func);};
                    }

                    break;
                // Locked Action
                case 2:                    
                    button.style.backgroundColor = buttonBackcolorLocked;
                    button.style.color = buttonTextColorLocked;
                    button.classList.remove("can-hover");
                    break;
                // Monster
                case 3:
                    button.style.backgroundColor = buttonBackcolorEnemy;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {changeContext(element.keyword, 3)};
                    break;
                // ITEM
                case 4:
                    button.style.backgroundColor = buttonBackcolorItem;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {addToInventory(element.keyword)};
                    break;
                // NPC
                case 5:
                    button.style.backgroundColor = buttonBackcolorNPC;
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {changeContext(element.keyword, 5)};
                    break;
                // Misc Action
                case 6:
                    button.style.backgroundColor = buttonBackColorLocation;                    
                    button.style.color = buttonTextColorDefault;
                    button.classList.add("can-hover");

                    button.onclick = function() {doAction(element.func)};

                    // Let's check for an edge cases where this is a talk button, because talk buttons should actually be locked, if there isn't a dialogue available
                    if (element.func === "talk") {
                        
                        if (!npcsModified[currentContext].dialogueAvailable) {
                            button.style.backgroundColor = buttonBackcolorLocked;
                            button.style.color = buttonTextColorLocked;
                            button.classList.remove("can-hover");
                        }
                    }
                    break;                
            }        

            button.querySelector('.button-text').innerText = element.title + additionalButtonString;
            button.style.display = "flex";
        });
    }        
}

function go(direction) {

    // This function only works while in a location context
    if (currentContextType === 1) {

        // Check for 'next' button
        if (direction === 4) {
            if (locationsModified[currentContext].actions.length > 0 && locationsModified[currentContext].actions[0].title === "Next") {                
                changeContextDirect(getContextIndexFromKeyword(locationsModified[currentContext].actions[0].keyword, 1), locationsModified[currentContext].actions[0].type);
                return;
            }
        }

        if (activeDirections.indexOf(direction) === -1) { console.log("go - [" + direction + "] is not an active direction."); return; }
                
        changeContextDirect(getContextIndexFromKeyword(locationsModified[currentContext].actions[direction].keyword, 1), locationsModified[currentContext].actions[direction].type);
    }
}

// Add an action to a specified context at the index, index -1 = append to the end of the list
function addActionToContext(context, contextType, action, index) {
    
    // First check whether context is an int or a string, if it's a string then we've been given a keyword and must first find the proper index
    let contextInt = 0;
    if (!Number.isInteger(parseInt(context))) {

        contextInt = getContextIndexFromKeyword(context, contextType);
        if (contextInt === -1) {
            console.error("addActionToContext() - Tried to add an action using a keyword [" + context + "] but couldn't find that context in the given contextType [" + contextType +"].");
            return;
        }
    }
    else
        contextInt = parseInt(context);

    let actions = [];
    switch (contextType) {
        case 1://Location
            if (index == -1)
                locationsModified[contextInt].actions.push(action);
            else
                locationsModified[contextInt].actions.splice(index, 0, action);

            actions = locationsModified[currentContext].actions;            // Store this in case this is our current context
            break;
        case 3://Monster
            if (index == -1)
                monstersModified[contextInt].actions.push(action);
            else
                monstersModified[contextInt].actions.splice(index, 0, action);

            actions = generateItemActions(monstersModified[currentContext].actions);            // Store this in case this is our current context
            break;
        case 4://Item
            if (index == -1)
                itemsModified[contextInt].actions.push(action);
            else
                itemsModified[contextInt].actions.splice(index, 0, action);            // Store this in case this is our current context
            break;
        case 5://NPC
            if (index == -1)
                npcsModified[contextInt].actions.push(action);
            else
                npcsModified[contextInt].actions.splice(index, 0, action);            // Store this in case this is our current context

                actions = npcsModified[currentContext].actions;
            break; 
        }
        
        save();
        // If this is our current context, we need to update the buttons immediately. Will never be an item
        if (context == currentContext && contextType == currentContextType)
            updateButtons(actions);
}

// Remove an action in a given context at the specified index
function removeActionFromContext(context, contextType, index) {

    // First check whether context is an int or a string, if it's a string then we've been given a keyword and must first find the proper index
    let contextInt = 0;
    if (!Number.isInteger(parseInt(context))) {

        contextInt = getContextIndexFromKeyword(context, contextType);
        if (contextInt === -1) {
            console.error("addActionToContext() - Tried to add an action using a keyword [" + context + "] but couldn't find that context in the given contextType [" + contextType +"].");
            return;
        }
    }
    else
        contextInt = parseInt(context);

    let actions = [];
    switch (contextType) {
        case 1://Location            

            locationsModified[contextInt].actions.splice(index, 1);
            actions = locationsModified[currentContext].actions;
            break;
        case 3://Monster            

            monstersModified[contextInt].actions.splice(index, 1);
            actions = generateItemActions(monstersModified[currentContext].actions);
            break;
        case 4://Item            

            itemsModified[contextInt].actions.splice(index, 1);
            break;
        case 5://NPC            

            npcsModified[contextInt].actions.splice(index, 1);
            actions = npcsModified[currentContext].actions;
            break;
        }
        
        save();
        // If this is our current context, we need to update the buttons immediately. Will never be an item
        if (contextInt == currentContext && contextType == currentContextType)
            updateButtons(actions);
}

// Remove action at index, add new one in it's place
function replaceAction(context, contextType, action, index) {

    removeActionFromContext(context, contextType, index);
    addActionToContext(context, contextType, action, index);
}

function displayInventory() {
    
    console.log("displayInventory() - ");

    inventoryIcon.src = "Assets/ExitIcon.svg";
    inventoryIcon.onclick = exitInventory;

    inventoryStatsSection.style.display = "block";

    hideAllButtons();

    narrationText.style.display = "none";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";

    mainTitleText.innerText = "Traveler";        
    mainText.innerText = "A worn traveler come from a foreign land. Stricken by a mysterious curse. Unable to resist the call.";

    document.querySelector("#inventory-title").style.display = "block";

    const itemButton = document.querySelector("#equip-button");    
    inventory.forEach((element,index) => {
                
        const clone = itemButton.cloneNode(true);        
        clone.querySelector('.button-text').innerText = itemsModified[element].title;
        clone.style.display = "flex";    
        //clone.onclick = function() {doAction(itemsModified[element].func)};       // This is what we will do when create actions in a combat context
        clone.onclick =  function(){ toggleEquipped(element, clone); };
        document.querySelector("nav").appendChild(clone);
        createdInventoryButtons.push(clone);

        if ((itemsModified[element].canEquip)) {
            clone.querySelector('.button-text').innerText += " [ P:" + itemsModified[element].power + " S:" + itemsModified[element].stamina + " E:" + itemsModified[element].evasion + " ]";
            clone.querySelector(".button-equip-icon").style.display = "block";
            clone.classList.add("can-hover");
            if (itemsModified[element].equipped) clone.querySelector(".button-equip-icon").src = "Assets/ItemEquipped.svg";
        }
        else
            clone.classList.remove("can-hover");

        clone.style.backgroundColor = buttonBackcolorItem;
        clone.style.color = buttonTextColorDefault;        
    });
}

function exitInventory() {

    console.log("exitInventory() - ");

    clearInventory();    
    changeContextDirect(currentContext, currentContextType);
}

function clearInventory() {

    inventoryIcon.src = "Assets/InventoryIcon.svg";
    inventoryIcon.onclick = displayInventory;

    inventoryStatsSection.style.display = "none";
    document.querySelector("#inventory-title").style.display = "none";

    createdInventoryButtons.forEach((element) => {        
        element.remove();
    });
    createdInventoryButtons = [];
}

function displayTrain() {

    console.log("dispdisplayTrainlayInventory() - ");    
    button6.style.display = "none";
    narrationText.style.display = "none";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";
    inventoryStatsSection.style.display = "block";
    mainTitleText.innerText = "Training";        
    mainText.innerText = "Put your hard won experience towards bettering yourself.";


    button1.querySelector('.button-text').innerText = "Train your HP (10 xp)";
    button1.style.display = "block";
    if (xp >= 10) {        
        button1.style.backgroundColor = buttonBackColorLocation;
        button1.style.color = buttonTextColorDefault;
        button1.classList.add("can-hover");
        button1.onclick = function() {train(1)};
    }
    else {        
        button1.style.backgroundColor = buttonBackcolorLocked;
        button1.style.color = buttonTextColorLocked;
        button1.classList.remove("can-hover");
        button1.onclick = "";        
    }
    
    button2.querySelector('.button-text').innerText = "Train your Power (20 xp)";
    button2.style.display = "block";
    if (xp >= 20) {        
        button2.style.backgroundColor = buttonBackColorLocation;
        button2.style.color = buttonTextColorDefault;
        button2.classList.add("can-hover");
        button2.onclick = function() {train(2)};
    }
    else {        
        button2.style.backgroundColor = buttonBackcolorLocked;
        button2.style.color = buttonTextColorLocked;
        button2.classList.remove("can-hover");
        button2.onclick = "";        
    }

    button3.querySelector('.button-text').innerText = "Train your Stamina (20 xp)";
    button3.style.display = "block";
    if (xp >= 20) {        
        button3.style.backgroundColor = buttonBackColorLocation;
        button3.style.color = buttonTextColorDefault;
        button3.classList.add("can-hover");
        button3.onclick = function() {train(3)};
    }
    else {        
        button3.style.backgroundColor = buttonBackcolorLocked;
        button3.style.color = buttonTextColorLocked;
        button3.classList.remove("can-hover");
        button3.onclick = "";        
    }

    button4.querySelector('.button-text').innerText = "Train your Evasion (30 xp)";
    button4.style.display = "block";
    if (xp >= 30) {        
        button4.style.backgroundColor = buttonBackColorLocation;
        button4.style.color = buttonTextColorDefault;
        button4.classList.add("can-hover");
        button4.onclick = function() {train(4)};
    }
    else {        
        button4.style.backgroundColor = buttonBackcolorLocked;
        button4.style.color = buttonTextColorLocked;
        button4.classList.remove("can-hover");
        button4.onclick = "";        
    }

    button5.querySelector('.button-text').innerText = "Exit";
    button5.style.display = "block";
    button5.style.backgroundColor = buttonBackColorLocation;
    button5.style.color = buttonTextColorDefault;
    button5.classList.add("can-hover");
    button5.onclick = function() { changeContextDirect(currentContext, currentContextType); };    
}

function train(trainType) {

    switch (trainType) {
        //HP
        case 1:
            xp -= 10;
            hpMax += 5;
            break;
        //POWER
        case 2:
            xp -= 20;
            basePower += 1;        
            break;
        //STAMINA
        case 3:
            xp -= 20;
            baseStamina += 1;
            break;
        //EVASION
        case 4:
            xp -= 30;
            baseEvasion  += 1;
            break;
    }

    save();
    updateStats();
    displayTrain();
}

// Update the header with current stat values
function updateStats() {
    
    calculateStats();

    xpText.innerText = xp;
    hpText.innerText = hpCurrent + " / " + hpMax;
    goldText.innerText = gold;

    powerText.innerText = "POWER: " + power;
    staminaText.innerText = "STAMINA: " + stamina;
    evasionText.innerText = "EVASION: " + evasion;
}

// Calculates stats that are based on multiple factors
function calculateStats() {

    power = basePower;
    stamina = baseStamina;
    evasion = baseEvasion;

    inventory.forEach((element) => {
        
        if (itemsModified[element].equipped) {
            power += itemsModified[element].power;
            stamina += itemsModified[element].stamina;
            evasion += itemsModified[element].evasion;
        }
    });
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

// #endregion

// #region ACTIONS

// Translate a string provided in through the context data into an action
function doAction(actionString) {
    
    if (actionString === undefined) {
        console.error("doAction() - actionString is undefined");
        return;
    }

    let functionString = actionString;
    let functionArray = [];

    if (actionString.indexOf('|') > -1) {

        // Action string can contain the function name, followed by arguments    
        functionArray = actionString.split("|");
        functionString = functionArray[0];
    }

    console.log(functionString);

    switch (functionString) {
        case "attack":
            attack();
            break;
        case "dodge":
            dodge();
            break;
        case "returnToPrimaryContext":
            returnToPrimaryContext();
            break;
        case "talk":
            talk();
            break;
        case "train":
            displayTrain();
            break;
        case "rest":
            rest();
            break;
        case "advanceDialogue":
            if (functionArray.length > 1)
                advanceDialogue(functionArray[1]);
            else
                console.error("doAction - Called advanceDialogue without an additional argument");
            break;
        case "goToNPC":
            if (functionArray.length > 1)
                changeContext(functionArray[1], 5);                
            else
                console.error("doAction - Called goToNPC without an additional argument");
            break;
        case "addAction":   // addAction() context (keyword or index), contextType, action, index
            if (functionArray.length > 4) {
                
                addActionToContext(functionArray[1],parseInt(functionArray[2]),JSON.parse(functionArray[3]),parseInt(functionArray[4]));
            }
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "removeAction":  // removeAction() context(keyword or index), contextType, index        
            if (functionArray.length > 3)

                removeActionFromContext(functionArray[1],parseInt(functionArray[2]),parseInt(functionArray[3]));
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "replaceAction":   // replaceAction() context(keyword or index), contextType, action, index
            if (functionArray.length > 4)

                replaceAction(functionArray[1],parseInt(functionArray[2]),JSON.parse(functionArray[3]),parseInt(functionArray[4]));
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "consoleLog":  // For debug
            console.log("!!!");
            break;
    }
}

function playerDeath() {
    
    hideAllButtons();

    narrationText.style.display = "block";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";    
    mainTitleText.innerText = "";        
    mainText.innerText = "";
    narrationText.innerText = "Life leaves your body as it's torn apart.";

    button1.querySelector('.button-text').innerText = "Awaken";
    button1.style.display = "block";
    button1.style.backgroundColor = buttonBackColorLocation;
    button1.style.color = buttonTextColorDefault;
    button1.classList.add("can-hover");
    button1.onclick = function() {respawn();};    
}

function respawn() {    

    if (respawnLocation != {}) {

        hpCurrent = hpMax;    

        // Monsters all heal when you rest
        monstersModified.forEach((element) => {
            element.hpCurrent = element.hpMax;
        });

        updateStats();
        storedLocation = respawnLocation.storedLocation;
        changeContextDirect(respawnLocation.context, respawnLocation.contextType); 
        save();

        if (!(respawnLocation.context === 0 && respawnLocation.contextType === 1))
            addUpdateText("You wake soaked in sweat and trembling. The terrors of the foglands haunting your mind.");
    }
    else
        console.error("respawn() - Trying to respawn with an empty respawnLocation");
}

function attack() {

    console.log("attack() - Attack Power: " + power);         // Unhelpful console log imo
    
    // PLAYER ATTACK
    monstersModified[currentContext].hpCurrent -= power;
    updateMonsterUI();
    
    // CHECK FOR MONSTER DEATH
    if (monstersModified[currentContext].hpCurrent <= 0) {

        monsterDeath();
    }   
    // Monster is still alive 
    else {
        
        hpCurrent -= monstersModified[currentContext].power;
        updateStats();

        // Check for Player Deaath
        if (hpCurrent <= 0) {
            playerDeath();
        }
        else {
            
            // Add update text that provides info about attack damages    

            let updateString = "You do " + power + " damage to the " + monstersModified[currentContext].shortTitle + ".\nThe " + monstersModified[currentContext].shortTitle + " does " + monstersModified[currentContext].power + " damage to you."    
            addUpdateText(updateString);  
        }    
    }
    
    save();
}

function monsterDeath() {
    
    let monsterIndex = getActionIndexFromKeyword(monstersModified[currentContext].keyword, storedLocation, 1); // We're looking for the index of the monster, it will always be in the storedLocation which will always be type 1, storedLocation is the primary context, and the monster we are fighting is the secondary context

    locationsModified[storedLocation].actions.splice(monsterIndex, 1);   // Remove the monster from the location array that it was contained in
    let storedMonsterString = "The " + monstersModified[currentContext].shortTitle + " falls dead at your feet\nYou receive " + monstersModified[currentContext].xp + " experience and " +  monstersModified[currentContext].gold + " gold";

    xp += monstersModified[currentContext].xp;
    gold += monstersModified[currentContext].gold;
    updateStats();
    
    if (monstersModified[currentContext].deathFunc != "") {
        doAction(monstersModified[currentContext].deathFunc);
    }
    
    save();

    returnToPrimaryContext();
    addUpdateText(storedMonsterString);
}

function dodge() {
    console.log("didge() - ");
}

function returnToPrimaryContext() {

    console.log("returnToPrimaryContext() - ");
    currentContext = storedLocation;
    storedLocation = -1;
    currentContextType = 1;

    save();
    updateContext();
}

function talk() {
    
    if (currentContextType == 5) {

        // Check to make sure there is a dialogue to play
        if (npcsModified[currentContext].dialogue.length > npcsModified[currentContext].currentDialogue) {
            
            addUpdateText(npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].text);
            npcsModified[currentContext].dialogueAvailable = false;
            
            // Check if there is a function call attached to this dialogue
            if (npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].func != "") {
                doAction(npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].func);
            }

            save();
            updateButtons(npcsModified[currentContext].actions);
        }
    }
    else
        console.error("talk - Somehow this was called but the current context is not an NPC")
}

function rest() {
    console.log("rest() - ");

    hpCurrent = hpMax;
    addUpdateText("You kneel for a moment and say a prayer to the Quiet. You feel your soul anchored to this place.\n\nYou lay down on your bedroll and before you know it sleep takes you.");

    // Monsters all heal when you rest
    monstersModified.forEach((element) => {
        element.hpCurrent = element.hpMax;
    });

    respawnLocation = {
        context: currentContext,
        contextType: currentContextType,
        storedLocation: storedLocation
    }

    save();
    updateStats();
}

function advanceDialogue(npcName) {
    
    npcsModified.forEach((element, index) => {

        if (element.keyword == npcName) {
            element.currentDialogue++;

            if (element.dialogue.length > element.currentDialogue) {
                element.dialogueAvailable = true;
            }
        }
    });
}

function addToInventory(keyword) {
    
    let itemFound = false;
    itemsModified.forEach((element,index) => {
        
        if (element.keyword == keyword) {

            itemFound = true;
            inventory.push(index);
            
            // Remove item from current location - will need to be modified if we receive items in other ways            
            let itemIndex = getActionIndexFromKeyword(keyword, currentContext, currentContextType);
            locationsModified[currentContext].actions.splice(itemIndex, 1);   // Remove the monster from the location array that it was contained in
        }    
    });

    if (itemFound) {
        updateButtons(locationsModified[currentContext].actions);
        save();
    }
    else
        console.error("addToInventory() - keyword:" + keyword + " not found in items array");
}

function toggleEquipped(index, button) {

    if (index < itemsModified.length) {

        if (itemsModified[index].equipped) {
            itemsModified[index].equipped = false;
            button.querySelector(".button-equip-icon").src = "Assets/ItemUnequipped.svg";
        }
        else {
            itemsModified[index].equipped = true;
            button.querySelector(".button-equip-icon").src = "Assets/ItemEquipped.svg";
        }
    
        updateStats();
    }
    else
        console.error("toggleEquipped() - Trying to toggle but the index of this element is outside the bounds of the items array");    
}

// #endregion

// #region UTILITIES

function save() {

    console.log("save");
    localStorage.setItem('saveExists', "!");        // Used to test whether there is a save
    localStorage.setItem('version', JSON.stringify(version));
    localStorage.setItem('currentLocation', JSON.stringify(currentContext));
    localStorage.setItem('storedLocation', JSON.stringify(storedLocation));
    localStorage.setItem('currentLocationType', JSON.stringify(currentContextType));
    localStorage.setItem('locationsVisited', JSON.stringify(locationsVisited));    
    localStorage.setItem('xp', JSON.stringify(xp));
    localStorage.setItem('hpCurrent', JSON.stringify(hpCurrent));
    localStorage.setItem('hpMax', JSON.stringify(hpMax));
    localStorage.setItem('gold', JSON.stringify(gold));
    localStorage.setItem('basePower', JSON.stringify(basePower));
    localStorage.setItem('baseStamina', JSON.stringify(baseStamina));
    localStorage.setItem('baseEvasion', JSON.stringify(baseEvasion));    
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('respawnLocation', JSON.stringify(respawnLocation));

    localStorage.setItem('locationsModified', JSON.stringify(locationsModified));
    localStorage.setItem('monstersModified', JSON.stringify(monstersModified));
    localStorage.setItem('npcsModified', JSON.stringify(npcsModified));
    localStorage.setItem('itemsModified', JSON.stringify(itemsModified));
  }
  
  function load() {

    console.log("Load");

    currentContext = JSON.parse(localStorage.getItem('currentLocation'));
    storedLocation = JSON.parse(localStorage.getItem('storedLocation'));       
    currentContextType = JSON.parse(localStorage.getItem('currentLocationType'));
    locationsVisited = JSON.parse(localStorage.getItem('locationsVisited'));    
    xp = JSON.parse(localStorage.getItem('xp'));
    hpCurrent = JSON.parse(localStorage.getItem('hpCurrent'));
    hpMax = JSON.parse(localStorage.getItem('hpMax'));
    gold = JSON.parse(localStorage.getItem('gold'));
    basePower = JSON.parse(localStorage.getItem('basePower'));
    baseStamina = JSON.parse(localStorage.getItem('baseStamina'));
    baseEvasion = JSON.parse(localStorage.getItem('baseEvasion'));
    inventory = JSON.parse(localStorage.getItem('inventory'));
    respawnLocation = JSON.parse(localStorage.getItem('respawnLocation'));

    if (!resetLocations) { 
        
        locationsModified = JSON.parse(localStorage.getItem('locationsModified'));       
        if (localStorage.getItem('monstersModified')) monstersModified = JSON.parse(localStorage.getItem('monstersModified')); else console.error("load - monstersModified entry doesn't exist");
        if (localStorage.getItem('npcsModified')) npcsModified = JSON.parse(localStorage.getItem('npcsModified')); else console.error("load - npcsModified entry doesn't exist");
        if (localStorage.getItem('itemsModified')) itemsModified = JSON.parse(localStorage.getItem('itemsModified')); else console.error("load - itemsModified entry doesn't exist");
    }
    else {
        locationsModified = locations;
        locationsVisited = [];
        monstersModified = monsters;
        npcsModified = npcs;
        itemsModified = items;
    }
  }

  function versionCheck() {
    
    let saveVersion = JSON.parse(localStorage.getItem('version'));
    console.log("Current version: " + version + "    Save Version: " + saveVersion);
    return version === saveVersion;
  }

  function resetGame() {

    localStorage.clear();
    clearInventory();
    initializeGame();
  }

  // Get a specific action within a given context
  // i.e. I want to find the "Leave" action within "dark_grotto"
  function getActionIndexFromKeyword(keyword, context, contextType) {
    
    ar = [];
    switch (contextType) {
        case 1://Location
            ar = locationsModified[context].actions;
            break;
        case 3://Monster
        ar = monstersModified[context].actions;
            break;
        case 4://Item
        ar = itemsModified[context].actions;
            break;
        case 5://NPC
        ar = npcsModified[context].actions;
            break;
    }

    let index = -1;
    ar.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            index = i;            
        }
    });

    if (index === -1) console.error("getActionIndexFromKeyword() - Failed to find keyword [" + keyword + "] in context [" + context + "] of context type [" + contextType + "]");
    return index;
  }

  // Get a specific context of the given type.
  // i.e. I want to find a location named "keyword"
  function getContextIndexFromKeyword(keyword, contextType) {
    
    ar = [];
    switch (contextType) {
        case 1://Location
        
            ar = locationsModified;
            break;
        case 3://Monster
            ar = monstersModified;
            break;
        case 4://Item
            ar = itemsModified;
            break;
        case 5://NPC
            ar = npcsModified;
            break;
    }

    let index = -1;
    
    ar.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            index = i;            
        }
    });
    
    if (index === -1) console.error("getContextIndexFromkeyword() - Failed to find keyword [" + keyword + "] of context type [" + contextType + "]");
    return index;
  }

  // Create an array of actions based on the currently equipped items in the player's inventory
  function generateItemActions(monsterActions) {

    let array = [];    

    inventory.forEach((element,index) => {
                        
        if (itemsModified[element].canEquip && itemsModified[element].equipped)
            
            itemsModified[element].actions.forEach((element, index) => {                
                array.push(element);
            });            
    });

    // Add monster specific actions
    monsterActions.forEach((element,index) => {        
        array.push(element);
    });
    
    array.push({type: 6, title: "Run away", func: "returnToPrimaryContext"});

    return array;
  }

  // #endregion