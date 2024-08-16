// #region VARIABLES

let version = 0.018;

let insight = 0;
let hpCurrent = 10;
let hpMax = 10;
let gold = 0;

let ore = 0;
let leather = 0;

// Base stats are the players raw stats
let basePower = 0;
let baseStamina = 3;
let baseDefence = 0;
let baseEvasion = 0;
// These are the calculated stats based on other factors like equipped items
let power = 0;
let maxStamina = 0;
let currentStamina = 0;
let defence = 0;
let evasion = 0;

let currentContext = 0;         // Index of the current displayed context. Index related to a certain array, currentContextType indicates what type of context and therefore which array to sear
let currentContextType = 0;     // 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action
let storedLocation = 0;         // Anytime we change to a secondary context, store the primary context location
let locationsVisited = [];      // A list of locations we have already visited

let activeDirections = [];      // Array that contains which directions (0=north, 1=west, 2=east, 3=south ) have active buttons currently

let inventory = [];             // Inventory contains index numbers for items in the items array
let inventoryOpen = false;
let upgardeMenuOpen = false;

// Default location for new games is edge_woods
let respawnLocation = {
    context: 0,
    contextType: 0,
    storedLocation: 0
}

let corpseLocation = -1;

// Debug
let showDebugLog = true;
let debugStartContext = 0;
let debugStartType = 1;
let debugWindowActive = false;

// Stats
const insightText = document.querySelector('#insight-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
const inventoryIcon = document.querySelector('#inventory-icon');
// Main Content
const mainTitleText =  document.querySelector('#main-title-text');
const secondaryTitle =  document.querySelector('#secondary-title');
const secondaryTitleText =  document.querySelector('#secondary-title-text');
const secondaryTitleIcon =  document.querySelector('#secondary-title-icon');
const mainText =  document.querySelector('#main-text');
const narrationText =  document.querySelector('#narration-text');
const updateText =  document.querySelector('#update-text');
const monsterHpSection =  document.querySelector('#monster-hp-section');
const monsterHpBar =  document.querySelector('#monster-hp-bar-current');
const monsterHpText =  document.querySelector('#monster-hp-text');
const equipmentTitle =  document.querySelector('#equipment-title');
const equipmentSection =  document.querySelector('#equipment-section');
const inventoryTitle =  document.querySelector('#inventory-title');
const inventorySection =  document.querySelector('#inventory-section');
const saleTitle =  document.querySelector('#sale-title');
const saleSection =  document.querySelector('#sale-section');

const hpStat = document.querySelector('#hp-stat');            // Text and icon combined
const insightStat = document.querySelector('#insight-stat');        // Text and icon combined
const goldStat = document.querySelector('#gold-stat');        // Text and icon combined
const powerStat = document.querySelector('#power-stat');            // Text and icon combined
const staminaStat = document.querySelector('#stamina-stat');        // Text and icon combined
const defenceStat = document.querySelector('#defence-stat');        // Text and icon combined
const powerText = document.querySelector('#power-text');
const staminaText = document.querySelector('#stamina-text');
const defenceText = document.querySelector('#defence-text');

// Buttons
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const button5 = document.querySelector('#button5');
const button6 = document.querySelector('#button6');
const button7 = document.querySelector('#button7');
const button8 = document.querySelector('#button8');
const itemButtonMaster = document.querySelector('#item-button');
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

let createdItemButtons = [];

//Colors
const mainTitleActive = '#8F871E';
const secondaryTitleActive = '#363718';

// #region Containers
let locations = [{
    keyword: "",
    title: "",        
    description: "",
    narration: "",
    update: "",
    items: [],
    actions: [
        {
            type: 0,        // Determines what the button looks like, and what it does // 1 = Location, 2 = Locked, 3 = Monster, 4 = Item, 5 = NPC, 6 = Misc Action
            title: "",      // String used in the button
            keyword: "",    // key used to search for the associated action
            blocked: "",    // If this monster is present, this location is blocked
            locked: "",
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
        update: "",
        hp: 0,
        power: 0,
        evasion: 0,         // Score out of 100, percentage chance to evade
        insight: 0,
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
        update: "",
        dialogueAvailable: true,
        currentDialogue: 0,
        items: [],
        actions: [
            {
                type: 0,
                title: "",
                keyword: "",
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
// ITEM TYPES - WEAPON, ARMOR, TALISMAN
let items = [
    {
        keyword: "",
        title: "",
        shortTitle: "",
        description: "",
        itemType: "",
        canEquip: false,        
        equipped: false,
        canUpgrade: false,
        level: 0,
        power: 0,
        stamina: 0,
        defence: 0,
        cost: 0,
        quantity: 0,
        upgradeMaterial: [],
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

    if (showDebugLog) console.log("InitializeGame - ");
    
    // Check whether there is already a save game
    if (localStorage.getItem('saveExists')) {
        if (showDebugLog) console.log("Save game exists");

        let validVersion = versionCheck();

        if (validVersion)
            load();
        else {
            if (showDebugLog) console.log("Invalid save found - resetting game");
            resetGame();
            return;
        }
                
        updateStats();
        save();

        if (currentContext === -99)
            respawn();
        else
            changeContextDirect(currentContext, currentContextType);
    }
    // No save game, so start a new game
    else {

        if (showDebugLog) console.log("Save game doesn't exist");        

        insight = 0;
        hpCurrent = 40;
        hpMax = 40;
        gold = 1000;
        ore = 0;
        leather = 0;

        // Base stats are the players raw stats
        basePower = 0;
        baseStamina = 3;
        baseDefence = 0;
        baseEvasion = 20;
                        
        updateStats();

        currentStamina = maxStamina;        

        inventory = [];
        inventory.push("straight_sword","worn_shield","green_cloak","curse_mark", "silver_locket","strange_stone");

        storedLocation = -1;
        locationsVisited = [];

        respawnLocation = {
            context: 3,
            contextType: 1,
            storedLocation: -1
        }
        corpseLocation = -1;

        // Using JSON to create deep clones of our starting data arrays
        locationsModified = JSON.parse(JSON.stringify(locations));
        monstersModified = JSON.parse(JSON.stringify(monsters));
        npcsModified = JSON.parse(JSON.stringify(npcs));
        itemsModified = JSON.parse(JSON.stringify(items));    

        save();
        changeContextDirect(debugStartContext, debugStartType);
    }
}

// Change our current context - 
// Finds the index of the context we want to go to using the keyword and context type pair as different context types will pull data from different arrays
// We use a keyword instead of relying only on index for human readibility
function changeContext(keyword, contextType) {

    if (showDebugLog) console.log("changeContext - keyword:" + keyword + "   contextType:" + contextType + "   storedLocation:" + storedLocation);

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
    
    if (showDebugLog) console.log("updateContext - currentContext: " + currentContext + "       currentContextType: " + currentContextType + "    storedLocation: " + storedLocation);

    narrationText.style.display = "none";
    resetUpdateText();
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";

    collapseStats();

    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
    saleTitle.style.display = "none";

    // By default, we'll be getting our action buttons from a location
    let actions = [];
    let items = [];

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
        items = locationsModified[currentContext].items;

        mainTitleText.style.color = mainTitleActive;
        secondaryTitle.style.display = "none";
        
        mainTitleText.innerText = locationsModified[currentContext].title;        
        mainText.innerText = locationsModified[currentContext].description; 

        // Some contexts have update text that should display when the player enters their context
        if (locationsModified[currentContext].update != undefined && locationsModified[currentContext].update != "")
            addUpdateText(locationsModified[currentContext].update);  
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
                secondaryTitleIcon.classList = "secondary-icon-monster";
                secondaryTitleText.innerText = monstersModified[currentContext].title;
                mainText.innerText = monstersModified[currentContext].description;

                expandStats();

                monsterHpSection.style.display = "block";
                updateMonsterUI();
                
                actions = generateItemActions(monstersModified[currentContext].actions);                
                
                // Some contexts have update text that should display when the player enters their context
                if (monstersModified[currentContext].update != undefined && monstersModified[currentContext].update != "")
                    addUpdateText(monstersModified[currentContext].update);                

                break;
            // 4 = Item
            case 4:
                break;
            // 4 = NPC
            case 5:
                secondaryTitleIcon.classList = "secondary-icon-npc";
                secondaryTitleText.innerText = npcsModified[currentContext].title;
                mainText.innerText = npcsModified[currentContext].description;                

                actions = npcsModified[currentContext].actions;
                items = npcsModified[currentContext].items;

                // Some contexts have update text that should display when the player enters their context
                if (npcsModified[currentContext].update != undefined && npcsModified[currentContext].update != "")
                    addUpdateText(npcsModified[currentContext].update);  

                break;
        }
    }

    updateButtons(actions, items);
}

function hideAllButtons() {

    clearCreatedButtons();

    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
    button4.style.display = "none";
    button5.style.display = "none";
    button6.style.display = "none";
    button7.style.display = "none";
    button8.style.display = "none";    
}

function clearCreatedButtons() {

    createdItemButtons.forEach((element) => {        
        element.remove();
    });
    createdItemButtons = [];
}

function updateButtons(actions, items)  {        
    
    // If we call this function without supplying actions and items lists, we should find the correct list ourself
    if (actions === undefined && items === undefined) {
        
        actions = [];
        items = [];
        
        switch (currentContextType) {
            case 1://Location            
                actions = locationsModified[currentContext].actions;
                items = locationsModified[currentContext].items;
                break;
            case 3://Monster            

                actions = generateItemActions(monstersModified[currentContext].actions);
                break;
            case 4://Item            
                break;
            case 5://NPC            
                actions = npcsModified[currentContext].actions;
                items = npcsModified[currentContext].items;
                break;
        }
        console.log(actions);
    }


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

    // If we are currently opening the upgrade menu, we need to cycle through everything in our inventory and get only upgradable items
    if (upgardeMenuOpen) {

        actions = [];
        actions.push({
            type: 6,
            title: "Back",
            func: "exitUpgrade"
            });

        items = [];
        inventory.forEach((element, index) => {

            if (itemsModified[getContextIndexFromKeyword(element, 4)].canUpgrade)
                items.push(element);
        });
    }    

    if (!inventoryOpen && actions.length > 0) {

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
                    let exitBlocked = false;
                    if (element.blocked != undefined && element.blocked != "") {
                        
                        // Loop through all actions to see if there is a monster with a matching keyword
                        actions.forEach((actionElement, index) => {                            
                            if (element.blocked == actionElement.keyword) {
                                
                                exitBlocked = true;                            
                                additionalButtonString += " [Blocked]";
                            }
                        });
                    }
                    
                    // Locked locations, need to check the player's inventory for the key
                    let doorLocked = false;
                    if (element.locked != undefined && element.locked != "") {
                                            
                        if (inventoryIndexOf(element.locked) != -1) {
                            doorLocked = false;
                            additionalButtonString += " [Unlocked]";
                        }
                        else {                            
                            doorLocked = true;
                            additionalButtonString += " [Locked]";
                        }
                    }
                    
                    // Active location action button
                    if (!doorLocked && !exitBlocked) {
                        
                        activeDirections.push(index);
                        button.classList = "nav-button can-hover location-button";

                        button.onclick = function() { changeContext(element.keyword, 1); if (element.func != undefined && element.func != "") doAction(element.func, true); playClick(); playerActionComplete(false); };
                    }
                    // If door is locked, or blocked by a monster then disable it
                    else if (doorLocked || exitBlocked) {
                        
                        button.classList = "nav-button locked-button";
                    }

                    break;
                // Locked Action
                case 2:                                        
                    button.classList = "nav-button locked-button";
                    break;
                // Monster
                case 3:                    
                    button.classList = "nav-button can-hover monster-button";

                    button.onclick = function() {changeContext(element.keyword, 3); playClick();};
                    break;
                // ITEM
                case 4:                    
                    // Where item context actions used to be before refactoring into their own process
                    break;
                // NPC
                case 5:                    
                    button.classList = "nav-button can-hover npc-button";
                    button.onclick = function() {changeContext(element.keyword, 5); playClick();};
                    break;
                // Misc Action - Styled the same as a location, but will call a custom function instead of moving to another context
                case 6:                    
                    button.classList = "nav-button can-hover location-button";
                    button.onclick = function() {doAction(element.func); playClick();};

                    // Let's check for an edge cases where this is a talk button, because talk buttons should actually be locked, if there isn't a dialogue available
                    if (element.func === "talk") {
                        
                        if (!npcsModified[currentContext].dialogueAvailable) {                            
                            button.classList = "nav-button locked-button";
                        }
                    }
                    break;                
            }        

            button.querySelector('.button-text').innerText = element.title + additionalButtonString;
            button.style.display = "flex";
        });
    }

    if (inventoryOpen) {
        
        items = JSON.parse(JSON.stringify(inventory));
        if (ore > 0) { itemsModified[getContextIndexFromKeyword("ore", 4)].quantity = ore; items.splice(0,0, "ore"); }
        if (leather > 0) { itemsModified[getContextIndexFromKeyword("leather", 4)].quantity = ore; items.splice(0,0, "leather"); }            
    }

    // Create buttons for items contained here    
    if (items != undefined && items.length > 0) {
                
        // Functionality is defined by the context this button is in:
        // 1: Location    2: Inventory Normal     3: Inventory + Monster      4: Vendor Buy        5: Vendor Upgrade
        let buttonContext = -1;
        // Location
        if (currentContextType === 1) {
            buttonContext = 1;
        }    
        if (currentContextType === 5) {
            buttonContext = 4;
        }
        if (currentContextType != 3 && inventoryOpen) {
            buttonContext = 2;
        }
        if (currentContextType === 3 && inventoryOpen) {
            buttonContext = 3;
        }
        if (upgardeMenuOpen)
            buttonContext = 5;

        // Create a button for each item contained in our array
        items.forEach((element,index) => {
            
            let item = itemsModified[getContextIndexFromKeyword(element, 4)];
            
            let itemCostActive = false;            
            let descriptionTextActive = false;
            let upgradeMaterialCostActive = false

            // Get all the elements for this specific button, deactivate things as though it was toggled off
            const clone = itemButtonMaster.cloneNode(true);

            const itemCostSection = clone.querySelector('.item-cost-section');        
            const itemCostText = clone.querySelector('.item-cost-text');
            const buttonChevron = clone.querySelector('.button-chevron');
            const descriptionText = clone.querySelector('.description-section');            
            const buttonStatSection = clone.querySelector('.button-stat-section');
            const secondaryButton = clone.querySelector('.secondary-action-button');
            const secondaryButtonText = clone.querySelector('.secondary-button-text');
            const upgradeMaterialCost = clone.querySelector('.upgrade-material-cost');
            clone.classList.remove('active');
            itemCostSection.style.display = "none";
            descriptionText.style.display = "none";
            buttonStatSection.style.display = "none";
            secondaryButton.style.display = "none";            
            upgradeMaterialCost.style.display = "none";

            // ITEM NAME
            let itemTitle = item.title;
            if (item.level != undefined && item.level > 0) itemTitle += " +" + item.level;
            if (item.quantity != undefined && item.quantity > 0) itemTitle += " [ " + item.quantity + " ]";
            clone.querySelector('.button-text').innerText = itemTitle;
            
            // ITEM DESCRIPTION
            if (item.description != undefined && item.description != "") {
                descriptionText.innerText = item.description;            
                descriptionTextActive = true;
            }
            clone.style.display = "flex";
            clone.onmouseover = (event) => { buttonChevron.querySelector('img').classList.add('hover'); };
            clone.onmouseleave = (event) => { buttonChevron.querySelector('img').classList.remove('hover'); };        
            createdItemButtons.push(clone);

            clone.classList = "nav-button item-button can-hover";

            let statSectionActive = false;
            if (item.power != 0 || item.stamina != 0  || item.defence != 0 ) {
                
                statSectionActive = true;
                clone.querySelector('.button-power-text').innerText = item.power;
                clone.querySelector('.button-stamina-text').innerText = item.stamina;
                clone.querySelector('.button-defence-text').innerText = item.defence;
            }
                    

            // Context specific changes - items behave and display differently depending on the context we find them in, below are the contexts that can contain items          
            // 1: Location = Take    2: Inventory = Equip / Unequip     3: Inventory + Monster = Use     4: Vendor Buy = Purchase        5: Vendor Upgrade = Upgrade
            let secondaryButtonDisplayed = false;
            let secondaryButtonActive = true;  
            switch (buttonContext) {
                // 1: Location = Take 
                case 1:
                    document.querySelector("nav").appendChild(clone);
                    secondaryButtonDisplayed = true;
                    secondaryButtonText.innerText = "Take";

                    if (item.itemType != undefined && item.itemType === "pickupGold")
                        secondaryButton.onclick = function() {  addGold(item.quantity, "You pickup the coins."); removeItemFromContext(item.keyword, currentContext); playClick(); };
                    else
                        secondaryButton.onclick = function() {  addToInventory(item.keyword); playClick(); };    

                    break;
                    // 2: Inventory = Equip / Unequip
                case 2:

                    if (item.equipped)
                        equipmentSection.appendChild(clone);                    
                    else
                        inventorySection.appendChild(clone);

                    if (item.canEquip) {
                        if (item.equipped)
                            secondaryButtonText.innerText = "Unequip";                        
                        else
                            secondaryButtonText.innerText = "Equip";
                    
                        secondaryButtonDisplayed = true;                    
                        secondaryButton.onclick = function() { toggleEquipped(item.keyword); updateButtons(); playClick(); };
                    }
                    break;
                case 3:
                    // 3: Inventory + Monster = Use
                    break;
                    // 4: Vendor Buy = Purchase 
                case 4:
                    itemCostActive = true;
                    itemCostSection.style.display = "flex";
                    itemCostText.innerText = item.cost;

                    // Check if we can afford this item, style text red if we can't
                    if (item.cost < gold) {
                        itemCostText.classList = "item-cost-text active";  
                        secondaryButtonActive = true;                      
                    }
                    else {
                        itemCostText.classList = "item-cost-text inactive";
                        secondaryButtonActive = false;
                    }

                    saleTitle.style.display = "block";
                    saleSection.appendChild(clone);
                    secondaryButtonDisplayed = true;
                    secondaryButtonText.innerText = "Purchase";
                    secondaryButton.onclick = function() {  buy(item.keyword, item.cost); playClick(); };
                    break;                    
                case 5:
                    // 5: Vendor Upgrade = Upgrade
                    let costToUpgrade = item.level * 50 + 100;
                    itemCostActive = true;
                    itemCostSection.style.display = "flex";
                    itemCostText.innerText = costToUpgrade;
                    let notEnoughGold = false;

                    // Check if we can afford this item, style text red if we can't
                    if (costToUpgrade < gold) {
                        itemCostText.classList = "item-cost-text active";  
                        secondaryButtonActive = true;                      
                    }
                    else {
                        itemCostText.classList = "item-cost-text inactive";
                        notEnoughGold = true;
                        secondaryButtonActive = false;
                    }

                    // Check if we have the necessary materials for this item
                    let oreCost = 0; let leatherCost = 0;
                    if (item.upgradeMaterial != undefined && item.upgradeMaterial.includes("ore"))
                        oreCost = item.level * 3 + 1;
                    if (item.upgradeMaterial != undefined && item.upgradeMaterial.includes("leather"))
                        leatherCost = item.level * 5 + 3;

                    if (oreCost === 0 && leatherCost === 0) {

                        upgradeMaterialCostActive = false;
                    }
                    else {

                        upgradeMaterialCostActive = true;
                        let upgradeMaterialString = "";
                        if (oreCost > 0) upgradeMaterialString += oreCost + " Refined Ore";
                        if (leatherCost > 0) upgradeMaterialString += leatherCost + " Hardened Leather";
                        upgradeMaterialCost.innerText = upgradeMaterialString;

                        if (!notEnoughGold && ore > oreCost && leather > leatherCost) {
                            upgradeMaterialCost.classList = "upgrade-material-cost active";                            
                            secondaryButtonActive = true;
                        }
                        else {
                            upgradeMaterialCost.classList = "upgrade-material-cost inactive";                        
                            secondaryButtonActive = false;
                        }
                    }

                    document.querySelector("nav").appendChild(clone);                    
                    statSectionActive = false;                
                    secondaryButtonDisplayed = true;
                    secondaryButtonText.innerText = "Upgrade";
                    secondaryButton.onclick = function() {  upgrade(item.keyword, costToUpgrade, oreCost, leatherCost); playClick(); };
                    break;
            }

            // The function for opening and collapsing the button
            let buttonOpened = false;
            clone.onclick = function() { toggleButton(); playClick(); };           

            function toggleButton() {

                if (buttonOpened) {
                    
                    buttonOpened = false;
                    if (itemCostActive) itemCostSection.style.display = "flex"; else itemCostSection.style.display = "none";
                    clone.classList.remove('active');
                    descriptionText.style.display = "none";
                    buttonStatSection.style.display = "none";
                    secondaryButton.style.display = "none";
                    upgradeMaterialCost.style.display = "none";

                    buttonChevron.querySelector('img').classList.add('chevron-closed');
                    buttonChevron.querySelector('img').classList.remove('chevron-open');
                }
                else {
                                        
                    buttonOpened = true;
                    clone.classList.add('active');
                    if (itemCostActive) itemCostSection.style.display = "flex"; else itemCostSection.style.display = "none";
                    if (descriptionTextActive) descriptionText.style.display = "block";
                    if (statSectionActive) buttonStatSection.style.display = "block";
                    if (secondaryButtonDisplayed) secondaryButton.style.display = "block";
                    if (upgradeMaterialCostActive) upgradeMaterialCost.style.display = "block";
                    if (secondaryButtonActive) { secondaryButton.classList.add('item-button'); secondaryButton.classList.remove('locked-item-button'); }
                    else { secondaryButton.classList.remove('item-button'); secondaryButton.classList.add('locked-item-button'); }

                    buttonChevron.querySelector('img').classList.add('chevron-open');
                    buttonChevron.querySelector('img').classList.remove('chevron-closed');
                }
            }

            if (!descriptionTextActive && !statSectionActive && !secondaryButtonDisplayed) {
                buttonChevron.style.display = "none";
                clone.classList = "nav-button locked-item-button";
            }
        });
    }
}

// 0 = North 1 = West 2 = East 3 = South 4 = Next
function go(direction) {

    // This function only works while in a location context
    if (currentContextType === 1) {

        if (direction != 4 && activeDirections.indexOf(direction) === -1) { if (showDebugLog) console.log("go - [" + direction + "] is not an active direction."); return; }
                
        switch (direction) {
            case 0:
                button1.onclick();
                break;
            case 1:
                button2.onclick();
                break;
            case 2:
                button3.onclick();
                break;
            case 3:
                button4.onclick();
                break;
            case 4:
                if (locationsModified[currentContext].actions.length > 0 && locationsModified[currentContext].actions[0].title === "Next")
                    button1.onclick();
                break;        
        }
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
    let items = [];
    switch (contextType) {
        case 1://Location
            if (index == -1)
                locationsModified[contextInt].actions.push(action);
            else
                locationsModified[contextInt].actions.splice(index, 0, action);

            actions = locationsModified[currentContext].actions;            // Store this in case this is our current context
            items = locationsModified[currentContext].items;
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
                items = npcsModified[currentContext].items;
            break; 
        }
        
        save();
        // If this is our current context, we need to update the buttons immediately. Will never be an item
        if (context == currentContext && contextType == currentContextType)
            updateButtons(actions, items);
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

    switch (contextType) {
        case 1://Location            

            locationsModified[contextInt].actions.splice(index, 1);

            break;
        case 3://Monster            

            monstersModified[contextInt].actions.splice(index, 1);
            break;
        case 4://Item            

            itemsModified[contextInt].actions.splice(index, 1);
            break;
        case 5://NPC            

            npcsModified[contextInt].actions.splice(index, 1);
            break;
        }
        
        save();
        // If this is our current context, we need to update the buttons immediately. Will never be an item
        if (contextInt == currentContext && contextType == currentContextType)
            updateButtons();
}

// Remove action at index, add new one in it's place
function replaceAction(context, contextType, action, index) {

    removeActionFromContext(context, contextType, index);
    addActionToContext(context, contextType, action, index);
}

function displayInventory() {
    
    if (showDebugLog) console.log("displayInventory() - ");

    inventoryOpen = true;

    inventoryIcon.classList = "close-inventory";    
    inventoryIcon.onclick = function() { exitInventory(); playClick(); };

    expandStats();    

    //resetUpdateText();
    updateButtons();

    narrationText.style.display = "none";    
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";

    mainTitleText.innerText = "Traveler";        
    mainText.innerText = "A worn traveler come from a foreign land. Stricken by a mysterious curse. Unable to resist the call.";

    inventoryTitle.style.display = "block";
    equipmentTitle.style.display = "block";
    saleTitle.style.display = "none";
}

function exitInventory() {

    if (showDebugLog) console.log("exitInventory() - ");

    inventoryOpen = false;

    clearInventory();    
    changeContextDirect(currentContext, currentContextType);
}

function clearInventory() {

    inventoryIcon.classList = "open-inventory";
    inventoryIcon.onclick = function() { displayInventory(); playClick(); };        

    expandStats();

    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
}

function displayUpgrade() {

    upgardeMenuOpen = true;
    updateButtons();
    expandStats();

    narrationText.style.display = "none";    
    monsterHpSection.style.display = "none";        
         
    mainText.innerText = "Not all weapons can become the stuff of legends, but given the right materials any weapon might become functional.";

    saleTitle.style.display = "none";
}

function exitUpgrade() {

    upgardeMenuOpen = false;
    changeContextDirect(currentContext, currentContextType);
}

function inventoryIndexOf(keyword) {

    let i = -1;
    inventory.forEach((element,index) => {
        
        if (element === keyword) {            
            i = index;
        }
    });

    return i;
}

function displayTrain() {

    if (showDebugLog) console.log("displayTrain() - ");    
    button6.style.display = "none";
    narrationText.style.display = "none";
    updateText.style.display = "none";
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";    
    mainTitleText.innerText = "Seek Guidance";
    mainText.innerText = "You close your eyes and kneel. You feel the earth below and breathe deep the air.";
    
    expandStats();


    let hpCost = 1;
    button1.querySelector('.button-text').innerText = "Feed the Body (" + hpCost + " insight)";
    button1.style.display = "block";
    if (insight >= hpCost) {        
        
        button1.classList = "nav-button can-hover location-button";
        button1.onclick = function() {train("hp", hpCost)};
    }
    else {        
        
        button1.classList = "nav-button locked-button";
        button1.onclick = "";        
    }
    
    let staminaCost = 2;
    button2.querySelector('.button-text').innerText = "Feed the Breathe (" + staminaCost + " insight)";
    button2.style.display = "block";    
    if (insight >= staminaCost) {        

        button2.classList = "nav-button can-hover location-button";
        button2.onclick = function() {train("stamina", staminaCost)};
    }
    else {        

        button2.classList = "nav-button locked-button";
        button2.onclick = "";        
    }

    let curseCost = 3;
    button3.querySelector('.button-text').innerText = "Feed the Curse Mark (" + curseCost + " insight)";
    button3.style.display = "block";
    if (insight >= curseCost) {        
        
        button3.classList = "nav-button can-hover location-button";
        button3.onclick = function() {train("curse", curseCost)};
    }
    else {        

        button3.classList = "nav-button locked-button";
        button3.onclick = "";        
    }

    button4.querySelector('.button-text').innerText = "Exit";
    button4.style.display = "block";
    button4.classList = "nav-button can-hover location-button";
    button4.onclick = function() { changeContextDirect(currentContext, currentContextType);};    
}

function train(trainType, cost) {

    switch (trainType) {        
        case "hp":
            insight -= cost;
            hpMax += 5;
            hpCurrent += 5;
            break;        
        case "stamina":
            insight -= cost;
            baseStamina += 1;
            break;        
        case "curse":
            insight -= cost;

            let curseMarkIndex = getContextIndexFromKeyword("curse_mark", 4);
            itemsModified[curseMarkIndex].power += 5;
            break;        
    }

    updateStats();
    save();
    displayTrain();
}

// Update the header with current stat values
function updateStats() {
    
    calculateStats();

    insightText.innerText = insight;
    hpText.innerText = hpCurrent + " / " + hpMax;
    goldText.innerText = gold;

    powerText.innerText = power;
    staminaText.innerText = currentStamina + " / " + maxStamina;
    defenceText.innerText = defence;
}

function expandStats() {

    powerStat.style.display = "flex";
    goldStat.style.display = "flex";
    defenceStat.style.display = "flex";
}

function collapseStats() {

    powerStat.style.display = "none";
    goldStat.style.display = "none";
    defenceStat.style.display = "none";
}

// Calculates stats that are based on multiple factors
function calculateStats() {

    power = basePower;
    maxStamina = baseStamina;
    defence = baseDefence;
    evasion = baseEvasion;

    inventory.forEach((element) => {
        
        let index = getContextIndexFromKeyword(element, 4);

        if (itemsModified[index].equipped) {
            power += itemsModified[index].power;
            maxStamina += itemsModified[index].stamina;
            defence += itemsModified[index].defence;
        }
    });
}

function updateMonsterUI() {

    monsterHpText.innerText = monstersModified[currentContext].hpCurrent + "/" + monstersModified[currentContext].hpMax;
    let monsterHpCurrentPercent = monstersModified[currentContext].hpCurrent / monstersModified[currentContext].hpMax * 100;
    // The width of our hp bar is the current hp percentage * 2 because the total width of the bar is 200    
    monsterHpBar.style.width = (monsterHpCurrentPercent * 2 + 1) + 'px';
}

function resetUpdateText() {

    updateText.innerText = "";
    updateText.style.display = "none";
}

function addUpdateText(text) {

    if (updateText.innerText.split(/\r\n|\r|\n/).length > 5) resetUpdateText(); 

    updateText.style.display = "block";
    if (updateText.innerText != "") updateText.innerText += "\n";
    updateText.innerText += text;
}

function removeItemFromContext(keyword, context) {
    
    locationsModified[context].items = locationsModified[context].items.filter(item => item !== keyword);    
    
    save();
    updateButtons();
}

// #endregion

// #region ACTIONS

// Translate a string provided in through the context data into an action
function doAction(actionString, resetText) {
    
    if (resetText)
        resetUpdateText();

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

    if (showDebugLog) console.log("doAction() - functionString: " + functionString);

    switch (functionString) {
        case "attack":
            if (functionArray.length === 2)     // attack|staminaCost
                attack(parseInt(functionArray[1]));
            else
                console.error("doAction - Called attack without an additional argument");        
            break;
        case "upgrade":
            displayUpgrade();
            break;
        case "exitUpgrade":
            exitUpgrade();
            break;
        case "recover":
            recover();
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
        case "runAway":
                runAway();
                break;
        case "advanceDialogue":
            if (functionArray.length === 2)         // advanceDialogue|npcKeyword
                advanceDialogue(functionArray[1]);
            else
                console.error("doAction - Called advanceDialogue without an additional argument");
            break;
        case "goToNPC":
            if (functionArray.length === 2)     // goToNPC|npcKeyword
                changeContext(functionArray[1], 5);                
            else
                console.error("doAction - Called goToNPC without an additional argument");
            break;
        case "addAction":   // addAction() context (keyword or index), contextType, action, index
            if (functionArray.length === 5) {
                
                addActionToContext(functionArray[1],parseInt(functionArray[2]),JSON.parse(functionArray[3]),parseInt(functionArray[4]));
            }
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "removeAction":  // removeAction() context(keyword or index), contextType, index        
            if (functionArray.length === 4)

                removeActionFromContext(functionArray[1],parseInt(functionArray[2]),parseInt(functionArray[3]));
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "replaceAction":   // replaceAction() context(keyword or index), contextType, action, index
            if (functionArray.length === 5)

                replaceAction(functionArray[1],parseInt(functionArray[2]),JSON.parse(functionArray[3]),parseInt(functionArray[4]));
            else
                console.error("doAction - Called addAction without the correct number of arguments");
            break;
        case "addGold":  
            if (functionArray.length === 3) // addGold|amount|updateString
                
                addGold(parseInt(functionArray[1]),functionArray[2]);                            
            else
                console.error("doAction - Called addGold without the correct number of arguments");
            break;
        case "getCorpse":  
            if (functionArray.length === 3) // addGold|amount|updateString
                
                getCorpse(parseInt(functionArray[1]),functionArray[2]);                            
            else
                console.error("doAction - Called addGold without the correct number of arguments");
            break;
        case "addInsight":  
            if (functionArray.length === 3) // addInsight|amount|updateString
                
                addInsight(parseInt(functionArray[1]),functionArray[2]);                            
            else
                console.error("doAction - Called addGold without the correct number of arguments");
            break;
        case "buy":  
            if (functionArray.length === 3) // buy|item keyword
                                
                buy(functionArray[1],parseInt(functionArray[2]));            
            else
                console.error("doAction - Called buy without the correct number of arguments");
            break;
        case "consoleLog":  // For debug
            console.log("!!!");
            break;
    }
}

function playerActionComplete(monsterCanAttack) {

    if (showDebugLog) console.log("playerActionComplete() - monsterCanAttack " + monsterCanAttack);

    let monstersPresent = false;
    let monstersActionString = "";
    let actions = [];

    if (monsterCanAttack) {

        // If current context is a location, search it's actions for monsters and tell them to attack
        if (currentContextType === 1)
            actions = locationsModified[currentContext].actions;        
        // If we're already fighting a monster, use the stored location to search for monsters
        else if (currentContextType === 3)
            actions = locationsModified[storedLocation].actions;

        actions.forEach((element, index) => {
            
            if (element.type === 3) {
                
                monstersPresent = true;
                
                let index = getContextIndexFromKeyword(element.keyword, 3);

                // Evasion chance
                let evasionNumber = Math.floor(Math.random() * 101);                

                if (evasionNumber <= evasion) {

                    monstersActionString +=  "You evade the " + monstersModified[index].shortTitle + "'s attack."                    
                }
                else {      

                    let monsterDamage = Math.max(0, monstersModified[index].power - defence);        
                    hpCurrent -= monsterDamage;
                    if (monstersActionString != "") monstersActionString += "\n";
                    monstersActionString += "The " + monstersModified[index].shortTitle + " does " + monsterDamage + " damage to you.";
                }
            }
        });    
    }

    if (!monstersPresent)
        recoverMax(false);

    updateStats();
    save();    
     if (monstersActionString != "") addUpdateText(monstersActionString);

    // Check for Player Death
    if (hpCurrent <= 0)
        playerDeath();        
}

function playerDeath() {

    let updateTextStore = updateText.innerText;
    if (inventoryOpen) {
        clearInventory();
        updateText.innerText = updateTextStore;
    }

    // Check if a player corpse exists already, if so destroy it
    if (corpseLocation != -1 && locationsModified[corpseLocation].items.includes("corpse")) {

        removeItemFromContext("corpse", corpseLocation);
    }

    // We are going to create a corpse in the primary location where we are currently
    // Check if we're fighting a monster, in which case we use the stored location instead of current context
    let actualContext = currentContext;
    if (currentContextType === 3)
        actualContext = storedLocation;

    let funcString = "getCorpse|" + gold + "|You recover what gold you can from the corpse"
    // Set the quantity of the corpse item to the amount of gold we are holding
    itemsModified[getContextIndexFromKeyword("corpse", 4)].quantity = gold;
    // Remove all our gold
    gold = 0;
    updateStats();

    corpseLocation = actualContext;    
    locationsModified[corpseLocation].items.push("corpse");

    hideAllButtons();

    narrationText.style.display = "none";    
    monsterHpSection.style.display = "none";
    mainTitleText.style.color = mainTitleActive;
    secondaryTitle.style.display = "none";    
    mainTitleText.innerText = "";        
    mainText.innerText = "";
    updateText.innerText += "\n\nLife leaves your body as it's torn apart.";

    button1.querySelector('.button-text').innerText = "Awaken";
    button1.style.display = "block";
    button1.classList = "nav-button can-hover location-button";
    button1.onclick = function() { respawn();};
    currentContext = -99;   // Save 'dead' state
    save();
}

function respawn() {    

    if (respawnLocation != {}) {

        hpCurrent = hpMax;
        currentStamina = maxStamina;

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

function attack(staminaCost) {

    if (showDebugLog) console.log("attack() - Attack Power: " + power + "   Stamina Cost: " + staminaCost);         // Unhelpful console log imo

    if (currentStamina < staminaCost) {
        
        addUpdateText("You try to attack, but your completely out of breath.");
    }
    else {
        
        currentStamina -= staminaCost;
        updateStats();
        let monster = monstersModified[currentContext];
        
        // Evasion chance
        let evasionNumber = Math.floor(Math.random() * 101);
        if (showDebugLog) console.log("Monster evasion - " + monster.evasion + "  evade number: " + evasionNumber);

        if (evasionNumber <= monster.evasion) {

            let updateString = "The " + monster.shortTitle + " evades your attack."
            addUpdateText(updateString); 
        }
        else {            

            // PLAYER ATTACK
            monster.hpCurrent -= power;
            updateMonsterUI();
                
            let updateString = "You do " + power + " damage to the " + monster.shortTitle + "."
            addUpdateText(updateString);  

            // CHECK FOR MONSTER DEATH
            if (monster.hpCurrent <= 0) {

                monsterDeath();
            }
        }
    }

    save();
    playerActionComplete(true);
}

function recover() {

    let maxRecoverAmount = 3;
    let recoverAmount = maxRecoverAmount;
    
    if ((maxStamina - currentStamina) < maxRecoverAmount)
        recoverAmount = maxStamina - currentStamina;
    
    currentStamina += recoverAmount; 
    if (currentStamina >= maxStamina) currentStamina = maxStamina;
    playerActionComplete(true);
    updateStats();
    save();

    let updateString = "You recover " + recoverAmount + " stamina."
    addUpdateText(updateString);
}

function recoverMax(isPlayerAction) {

    if (currentStamina != maxStamina) {
        currentStamina = maxStamina;
        if (isPlayerAction) playerActionComplete(true);
        updateStats();
        save();

        let updateString = "You recover your stamina."
        addUpdateText(updateString);
    }
}

function runAway() {
    
    returnToPrimaryContext();
    playerActionComplete(true);
}

function monsterDeath() {
    
    let monsterIndex = getActionIndexFromKeyword(monstersModified[currentContext].keyword, storedLocation, 1); // We're looking for the index of the monster, it will always be in the storedLocation which will always be type 1, storedLocation is the primary context, and the monster we are fighting is the secondary context

    locationsModified[storedLocation].actions.splice(monsterIndex, 1);   // Remove the monster from the location array that it was contained in
    let storedMonsterString = "The " + monstersModified[currentContext].shortTitle + " falls dead at your feet\nYou receive " + monstersModified[currentContext].insight + " insight and " +  monstersModified[currentContext].gold + " gold";

    insight += monstersModified[currentContext].insight;
    gold += monstersModified[currentContext].gold;
    updateStats();
    
    if (monstersModified[currentContext].deathFunc != "") {
        doAction(monstersModified[currentContext].deathFunc, true);
    }
    
    save();

    returnToPrimaryContext();
    addUpdateText(storedMonsterString);
}

function dodge() {
    if (showDebugLog) console.log("didge() - ");
    playerActionComplete(true);
}

// This is used specifically to return to the context, but isn't counted as a player action itself, so if a function call this that is a player action, it should call playerActionCompleted itself, like runAway
function returnToPrimaryContext() {

    if (showDebugLog) console.log("returnToPrimaryContext() - ");
    currentContext = storedLocation;
    storedLocation = -1;
    currentContextType = 1;

    save();
    updateContext();    
}

function talk() {
    resetUpdateText();

    if (currentContextType == 5) {

        // Check to make sure there is a dialogue to play
        if (npcsModified[currentContext].dialogue.length > npcsModified[currentContext].currentDialogue) {
            
            addUpdateText(npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].text);
            npcsModified[currentContext].dialogueAvailable = false;
            
            // Check if there is a function call attached to this dialogue
            if (npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].func != "") {
                doAction(npcsModified[currentContext].dialogue[npcsModified[currentContext].currentDialogue].func, false);
            }

            save();
            updateButtons(npcsModified[currentContext].actions,npcsModified[currentContext].items);
        }

        playerActionComplete(true);
    }
    else
        console.error("talk - Somehow this was called but the current context is not an NPC")
}

function rest() {
    if (showDebugLog) console.log("rest() - ");

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
    
    if (keyword === "") {

        if (showDebugLog) console.log("addToInventory() - keyword is empty");
        return;
    }

    let item = itemsModified[getContextIndexFromKeyword(keyword, 4)];
    if (item === undefined) {
        console.error("addToInventory() - keyword:" + keyword + " not found in items array");
        return;
    }

    inventory.push(keyword);
    
    let actions = [];
    let items = [];

    // Depending on the contextType, we will splice this item out of a different context
    if (currentContextType === 1) {
        actions = locationsModified[currentContext].actions;
        items = locationsModified[currentContext].items;
    }
    else if (currentContextType === 3)
        actions = monstersModified[currentContext].actions; // This will never happen, you cant add an item to your inventory while fighting a monster
    else if (currentContextType === 5) {
        actions = npcsModified[currentContext].actions;
        items = npcsModified[currentContext].items;
    }
    
    // Find and remove the item from the item list that it was contained in
    let itemIndex = -1;
    items.forEach((element, index) => {

        if (element === keyword) {
            itemIndex = index;
        }
    });
    if (itemIndex != -1) items.splice(itemIndex, 1);

    updateButtons(actions, items);

    save();
    addUpdateText("The " + item.shortTitle + " has been added to your inventory.");
    playerActionComplete(true);
}

function buy(keyword, cost) {

    let item = itemsModified[getContextIndexFromKeyword(keyword, 4)];
    if (item === undefined) {
        console.error("buy() - keyword:" + keyword + " not found in items array");
        return;
    }

    if (gold >= cost) {

        gold -= cost;
        addUpdateText("You purchased the " + item.shortTitle + ".");
        addToInventory(keyword);
        updateStats();        
    }
    else
        console.error("buy() - cost greater than gold");
}

function upgrade(keyword, cost, oreCost, leatherCost) {

    let item = itemsModified[getContextIndexFromKeyword(keyword, 4)];
    if (item === undefined) {
        console.error("upgrade() - keyword:" + keyword + " not found in items array");
        return;
    }

    if (gold >= cost && ore > oreCost && leather > leatherCost) {

        gold -= cost;
        ore -= oreCost;
        leather -= leatherCost;
        addUpdateText("You upgrade the " + item.shortTitle + ".");
        item.level += 1;

        if (item.itemType === "weapon")
            item.power += 5;
        if (item.itemType === "armor")
            item.defence += 10;

        updateStats();
        updateButtons();
    }
    else
        console.error("upgrade() - cost greater than gold");
}

function addGold(amount, updateString) {
    
    gold += amount;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " gold )");    

    updateStats();
    save();
    playerActionComplete(true);
}

function getCorpse(amount, updateString) {
    
    gold += amount;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " gold )");    

    corpseLocation = -1;

    updateStats();
    save();
    playerActionComplete(true);
}

function addInsight(amount, updateString) {

    insight += amount;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " insight )");    

    updateStats();
    save();
    playerActionComplete(true);
}

function toggleEquipped(keyword) {
    
    // Double check to make sure this is in our inventory
    if (inventoryIndexOf(keyword) != -1) {

        let item = itemsModified[getContextIndexFromKeyword(keyword,4)];
        
        if (item.equipped) {

            item.equipped = false;
            addUpdateText("You put away the " + item.shortTitle);            
        }
        else {
            item.equipped = true;
            addUpdateText("You equip the " + item.shortTitle);            
        }
        
        updateStats();
        save();
        playerActionComplete(true);        
    }
    else
        console.error("toggleEquipped() - Inventory doesn't contain [" + keyword + "]");
}

// #endregion

// #region UTILITIES

function save() {

    if (showDebugLog) console.log("save");
    localStorage.setItem('saveExists', "!");        // Used to test whether there is a save
    localStorage.setItem('version', JSON.stringify(version));
    localStorage.setItem('currentLocation', JSON.stringify(currentContext));
    localStorage.setItem('storedLocation', JSON.stringify(storedLocation));
    localStorage.setItem('currentLocationType', JSON.stringify(currentContextType));
    localStorage.setItem('locationsVisited', JSON.stringify(locationsVisited));    
    localStorage.setItem('insight', JSON.stringify(insight));
    localStorage.setItem('hpCurrent', JSON.stringify(hpCurrent));
    localStorage.setItem('hpMax', JSON.stringify(hpMax));
    localStorage.setItem('maxStamina', JSON.stringify(maxStamina));
    localStorage.setItem('currentStamina', JSON.stringify(currentStamina));
    localStorage.setItem('gold', JSON.stringify(gold));
    localStorage.setItem('ore', JSON.stringify(ore));
    localStorage.setItem('leather', JSON.stringify(leather));
    localStorage.setItem('basePower', JSON.stringify(basePower));
    localStorage.setItem('baseStamina', JSON.stringify(baseStamina));
    localStorage.setItem('baseDefence', JSON.stringify(baseDefence));    
    localStorage.setItem('baseEvasion', JSON.stringify(baseEvasion));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('respawnLocation', JSON.stringify(respawnLocation));
    localStorage.setItem('corpseLocation', JSON.stringify(corpseLocation));

    localStorage.setItem('locationsModified', JSON.stringify(locationsModified));
    localStorage.setItem('monstersModified', JSON.stringify(monstersModified));
    localStorage.setItem('npcsModified', JSON.stringify(npcsModified));
    localStorage.setItem('itemsModified', JSON.stringify(itemsModified));
  }
  
  function load() {

    if (showDebugLog) console.log("Load");

    currentContext = JSON.parse(localStorage.getItem('currentLocation'));
    storedLocation = JSON.parse(localStorage.getItem('storedLocation'));       
    currentContextType = JSON.parse(localStorage.getItem('currentLocationType'));
    locationsVisited = JSON.parse(localStorage.getItem('locationsVisited'));    
    insight = JSON.parse(localStorage.getItem('insight'));
    hpCurrent = JSON.parse(localStorage.getItem('hpCurrent'));
    maxStamina = JSON.parse(localStorage.getItem('maxStamina'));
    currentStamina = JSON.parse(localStorage.getItem('currentStamina'));
    hpMax = JSON.parse(localStorage.getItem('hpMax'));
    gold = JSON.parse(localStorage.getItem('gold'));
    ore = JSON.parse(localStorage.getItem('ore'));
    leather = JSON.parse(localStorage.getItem('leather'));
    basePower = JSON.parse(localStorage.getItem('basePower'));
    baseStamina = JSON.parse(localStorage.getItem('baseStamina'));
    baseDefence = JSON.parse(localStorage.getItem('baseDefence'));
    inventory = JSON.parse(localStorage.getItem('inventory'));
    respawnLocation = JSON.parse(localStorage.getItem('respawnLocation'))
    corpseLocation = JSON.parse(localStorage.getItem('corpseLocation'))

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
    if (showDebugLog) console.log("Current version: " + version + "    Save Version: " + saveVersion);
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
        
        let item = itemsModified[getContextIndexFromKeyword(element,4)];
        if (item.canEquip && item.equipped)
            
            item.actions.forEach((element, index) => {                
                array.push(element);
            });            
    });

    // Add monster specific actions
    monsterActions.forEach((element,index) => {        
        array.push(element);
    });
    
    array.push({type: 6, title: "Recover", func: "recover"});

    array.push({type: 6, title: "Run away", func: "runAway"});

    return array;
  }

  function playClick() {
    
    let audioClipIndex = Math.floor(Math.random() * 5);
    let audioClip = '';
    switch (audioClipIndex) {
        case 0:
            audioClip = 'Audio/clicks/Click_1.wav';
            break;
        case 1:
            audioClip = 'Audio/clicks/Click_2.wav';
            break;
        case 2:
            audioClip = 'Audio/clicks/Click_3.wav';
            break;
        case 3:
            audioClip = 'Audio/clicks/Click_4.wav';
            break;
        case 4:
            audioClip = 'Audio/clicks/Click_5.wav';
            break;
    }

    var audio = new Audio(audioClip);
    audio.play();      
  }

  // #endregion