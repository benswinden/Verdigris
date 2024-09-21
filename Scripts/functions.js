// #region VARIABLES

let version = 0.046;

let insight = 0;
let hpCurrent = 10;
let hpMax = 10;
let gold = 0;

let ore = 0;
let leather = 0;
let greenHerb = 0;

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

let currentArea = 0;
let currentLocation = [0,0];

let areasVisited = [];      // A list of locations we have already visited

let currentActiveButton;

let currentNarration = "";
let currentNarrationIndex = 0;
let narrationOpen = false;
let titleOpen = false;
let npcActive = false;
let currentNPC = -1;

let activeDirections = [];      // Array that contains which directions (0=north, 1=west, 2=east, 3=south ) have active buttons currently

let inventory = [];             // Inventory contains index numbers for items in the items array
let inventoryOpen = false;
let upgradeMenuOpen = false;
let trainMenuOpen = false;

let mapInitialize = false;
let mapGrid = [];

// Default location for new games is edge_woods
let respawnLocation = {
  area: "",
  location: []
};

let corpseLocation = null;

// Debug
let showDebugLog = true;
let debugStartArea = "bramble_path";
let debugStartLocation = [2,5];
let debugRespawn = {
  area: "bramble_path",
  location: [2,5]
}
let debugWindowActive = false;

// Stats
const insightText = document.querySelector('#insight-text');
const hpText = document.querySelector('#hp-text');
const goldText = document.querySelector('#gold-text');
const inventoryIcon = document.querySelector('#inventory-icon');
// Main Content
const mainTitle =  document.querySelector('#main-title');
const mainTitleText =  document.querySelector('#main-title-text');
const secondaryTitle =  document.querySelector('#secondary-title');
const secondaryTitleText =  document.querySelector('#secondary-title-text');
const secondaryTitleIcon =  document.querySelector('#secondary-title-icon');
const monsterLevelText =  document.querySelector('#monster-level-text');
const mainText =  document.querySelector('#main-text');
const narrationText =  document.querySelector('#narration-text');
const updateText =  document.querySelector('#update-text');
const mapGridContainer = document.querySelector("#map-grid-container");

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

const buttonMaster = document.querySelector('#button-master');

//Misc
const debugWindow = document.querySelector('#debug');
const debugButton1 = document.querySelector('#debug-button1');
const debugButton2 = document.querySelector('#debug-button2');
const debugButton2b = document.querySelector('#debug-button2b');
const debugButton2c = document.querySelector('#debug-button2c');
const debugButton3 = document.querySelector('#debug-button3');
const debugButton4 = document.querySelector('#debug-button4');
const debugButton5 = document.querySelector('#debug-button5');
const debugButton6 = document.querySelector('#debug-button6');
const debugButton7 = document.querySelector('#debug-button7');
const resetLocationsCheckbox = document.querySelector('#resetLocations');
let resetLocations = false;     // We use this for debug, when selected on reload we will always re-write locationsModified from locations so that updates to the games content can be tested immediately without needing to reset the whole game

let createdButtons = [];

// enum
const objectType = {
    null: 'null',
    region: 'region',
    area: 'area',
    location: 'location',
    action: 'action',    
    monster: 'monster',
    item: 'item',
    npc: 'npc',    
}

// #region Containers

// A template for the format of an action object
const protoAction = {
    keyword: "",
    title: "",
    active: true,
    staminaCost: -1,
    location: "",
    func: ""
}

let narrations = [
    {
        keyword: "",
        seen: false,
        text:[]
    }
]

let monsters = [];

let areas = [];

let locations = [    
    {
        keyword: "fl_01",
        area: "foglands",
        title: "fl_01",
        description: "",
        narration: "",        
        update: "",        
        items: [],
        monsters: [],
        npcs: [],
        north: "",
        west: "",
        east: "",
        south: "",
        up: "",
        down: ""         
    }
]

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
                location: "",
                func: ""
            }            
        ]
    }
];
// ITEM TYPES - WEAPON, ARMOR, TALISMAN
let items = [];
let actions = [];

var config = 
{    
	header: true,
	dynamicTyping: true,
	skipEmptyLines: true
}

const promise1 = fetch('Data/items.csv')
  .then((response) => response.text())
  .then((data) => { 
    items = Papa.parse(data, config).data;
    // Filter out empty rows
    items = items.filter(({ keyword }) => keyword != null);
});

const promise2 = fetch('Data/monsters.csv')
  .then((response) => response.text())
  .then((data) => { 
    monsters = Papa.parse(data, config).data;
    // Filter out empty rows
    monsters = monsters.filter(({ keyword }) => keyword != null);
});

const promise3 = fetch('Data/actions.csv')
  .then((response) => response.text())
  .then((data) => { 
    actions = Papa.parse(data, config).data;
    // Filter out empty rows
    actions = actions.filter(({ keyword }) => keyword != null);
});


// Store these containers at runtime because they will be modified as the player plays
let areasModified = [];
let monstersModified = []
let npcsModified = []
let itemsModified = []
let narrationsModified = []


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

        if (currentLocation === -99)
            respawn();
        else
            displayLocation(currentArea, currentLocation);
    }
    // No save game, so start a new game
    else {

        if (showDebugLog) console.log("Save game doesn't exist");        
        
        // Using JSON to create deep newButtons of our starting data arrays
        formatData();

        insight = 0;
        hpCurrent = 140;
        hpMax = 140;
        gold = 2;
        ore = 0;
        leather = 0;
        greenHerb = 0;

        // Base stats are the players raw stats
        basePower = 0;
        baseStamina = 1;        
        baseDefence = 0;
        baseEvasion = 20;
                        
        updateStats();
        
        currentStamina = maxStamina;

        inventory = [];
        inventory.push("straight_sword","green_cloak");
        
        areasVisited = [];        

        titleOpen = false;
        narrationOpen = false;
        npcActive = false;
        currentNPC = -1;
        
        respawnLocation = debugRespawn;
        corpseLocation = null;

        save();
        
        displayLocation(debugStartArea, debugStartLocation);
    }
}

// General purpose function when we want to display a location
// newLocation can be an integer or a keyword value
// Area = keyword title i.e. "bramble_path"
// Location = coordinate pair i.e. [1,5]
function displayLocation(area, location) {    

    // This should only happen once
    if (!mapInitialize)
        initalizeMap();

    if (showDebugLog) console.log("displayLocation -  Area: " + area + "    Location: " + location);

    // Check whether the provided area is a keyword or an index
    if (Number.isInteger(area))
        currentArea = area;
    else
        currentArea = getIndexFromKeyword(area, objectType.area);               
            
    const _locationExists = getLocationFromCurrentArea(location);
    if (_locationExists === -1) { console.error("!!!"); return; }

    currentLocation = location;
    getLocationFromCurrentArea(location).visited = true;
    getLocationFromCurrentArea(location).seen = true;
    
    mapGridContainer.style.display = "flex";
    updateMap();

    save();
    resetUpdateText();
    collapseStats();
    currentActiveButton = null;
    narrationText.style.display = "none";
    updateText.style.display = "none";    
    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
    saleTitle.style.display = "none";
        

    // TODO - Reactivate titles, but for regions
    // Check if we are entering a new area and should show the title card first        
    // if (locationsModified[currentLocation].area != "") {

    //     let areaVisited = areasVisited.indexOf(locationsModified[currentLocation].area) != -1;
    //     if (!areaVisited) {
    //         displayTitle();
    //         return;
    //     }
    // }

    // Check if we've already visited this location
    let areaVisited = areasVisited.indexOf(currentArea) != -1;

    // First time visiting this location, check whether there is a narration to play first
    if (!areaVisited) {
        
        
        // Check whether this location has a narration keyword
        if (areasModified[currentArea].narration != undefined && areasModified[currentArea].narration != "") {
            
            // Check if the matching narration to this keyword has already been seen                
            if (narrationsModified[getElementFromKeyword(areasModified[currentArea].narration, narrations)] != undefined && !narrationsModified[getElementFromKeyword(areasModified[currentArea].narration, narrations)].seen) {

                displayNarration(areasModified[currentArea].narration);
                return;
            }
        }

        areasVisited.push(currentArea);
        save();

        // Check if there is narration text, then show it as this is the first time visiting
        if (areasModified[currentArea].update != undefined && areasModified[currentArea].update != "") {
            narrationText.style.display = "block";
            narrationText.innerText = areasModified[currentArea].update;  // Add the narration text so it appears before the main text for the locat                
        }
    }

    mainTitle.classList = "";        
    mainTitleText.classList = "";
    secondaryTitle.style.display = "none";
    
    mainTitleText.innerText = areasModified[currentArea].title;        
    mainText.innerText = areasModified[currentArea].description;             

    updateButtons(false);
}

function clearCreatedButtons() {

    currentActiveButton = null;

    createdButtons.forEach((element) => {        
        element.button.remove();
    });

    createdButtons = [];
}

function createButton(objectKeyword, objectType) {

    const clone = buttonMaster.cloneNode(true);

    let newButton = {
        button: clone,
        keyword: objectKeyword,
        type: objectType,
        buttonOpened: false,
        buttonText: clone.querySelector('.button-text'),
        staminaCostSection: clone.querySelector('.stamina-cost-section'),
        staminaCost: clone.querySelector('.stamina-cost-text'),
        itemCostSection: clone.querySelector('.item-cost-section'),
        itemCostText: clone.querySelector('.item-cost-text'),
        buttonChevron: clone.querySelector('.button-chevron'),
        descriptionText: clone.querySelector('.description-section'),
        buttonStatSection: clone.querySelector('.button-stat-section'),
        secondaryButton: clone.querySelector('.secondary-action-button'),
        secondaryButtonText: clone.querySelector('.secondary-button-text'),
        upgradeMaterialCost: clone.querySelector('.upgrade-material-cost'),
        powerText: clone.querySelector('.button-power-text'),
        staminaText: clone.querySelector('.button-stamina-text'),
        defenceText: clone.querySelector('.button-defence-text'),
        buttonLevelIcon: clone.querySelector('.button-level-icon'),
        monsterHpSection: clone.querySelector('.monster-hp-section'),
        monsterHpBar: clone.querySelector('.monster-hp-bar-current'),
        monsterHpText: clone.querySelector('.monster-hp-text')
    }

    newButton.button.style.display = "flex";
    newButton.button.classList.remove('active');
    newButton.buttonChevron.style.display = "none";
    newButton.staminaCostSection.style.display = "none";
    newButton.itemCostSection.style.display = "none";
    newButton.descriptionText.style.display = "none";
    newButton.buttonStatSection.style.display = "none";
    newButton.secondaryButton.style.display = "none";            
    newButton.upgradeMaterialCost.style.display = "none";
    newButton.buttonLevelIcon.style.display = "none";
    newButton.monsterHpSection.style.display = "none";

    newButton.button.onmouseover = (event) => { newButton.buttonChevron.querySelector('img').classList.add('hover'); };
    newButton.button.onmouseleave = (event) => { newButton.buttonChevron.querySelector('img').classList.remove('hover'); };

    return newButton;
}

function updateButtons(skipAnimation)  {        
    
    if (showDebugLog) console.log("updateButtons() - ");
    
    // Check if there is a current active button
    // If yes, that means we've just refreshed buttons without changing location and we are checking for unique actions associated with this button
    let activeMonster = null;
    let activeItem = null;
    
    // "active button" is a button we have toggled open
    if (currentActiveButton != null) {

        if (currentActiveButton.type === objectType.monster) {
            activeMonster = currentActiveButton.keyword;
        }
        else if (currentActiveButton.type === objectType.item) {
            activeItem = currentActiveButton.keyword;
        }
    }

    clearCreatedButtons();

    let contextualActions = [];         // Will be dynamically populated with actions depending on the game state
    let items = [];
    let monsters = [];
    let npcs = [];

    let lastButtonConfigured = null;          // We will store each button we configure as this, so that when we reach the right point, we can add special formatting to it
    
    // If we have a savedActiveMonster, that means we have just opened the button for a monster and we want to see the actions specific to that button
    if (activeMonster != null) {
        
        inventory.forEach((element,index) => {
            
            let item = itemsModified[getIndexFromKeyword(element, objectType.item)];
            if (item.canEquip && item.equipped) {
                
                if (item.actions.length > 0) {
                    
                    item.actions.forEach((element, index) => {

                        contextualActions.push(actions[getElementFromKeyword(element, actions)]);
                    });            
                }
            }
        });        
    }
    else if (narrationOpen) {

        contextualActions.push({
            keyword: "next",
            title: "Next",
            active: true,
            staminaCost: -1,
            location: "",
            func: "continueNarration"
        });
    }
    else if (titleOpen) {

        contextualActions.push({
            keyword: "continue",
            title: "Continue",
            active: true,
            staminaCost: -1,            
            location: "",
            func: "closeTitle"
        });
    }
    else if (npcActive) {
       
        contextualActions = JSON.parse(JSON.stringify(npcsModified[currentNPC].actions));

        // Add the default actions for all NPCs
        if (npcsModified[currentNPC].dialogueAvailable != null) {
            contextualActions.push({
                keyword: "talk",
                title: "Talk",
                active: true,
                staminaCost: -1,
                location: "",
                func: "talk"
            });
        }
        contextualActions.push({
            keyword: "leave",
            title: "Leave",
            active: true,
            staminaCost: -1,
            location: "",
            func: "closeNPC"
        });

        items = npcsModified[currentNPC].items;
    }
    
    // If theres nothing special going on, we show the default actions for a location which are the exits
    if (!narrationOpen && !titleOpen && !trainMenuOpen && !npcActive) {
  
        // If activeMonster = true, that means we already know a monster is present because the player toggled the button
        // If thats not true, we need to check the room whether there is on present or not
        if (!activeMonster) {

            // Check if there are monsters present in this location, if so we don't display exits, only the option to run
            if (getLocationFromCurrentArea(currentLocation).monsters != null && getLocationFromCurrentArea(currentLocation).monsters != "" && getLocationFromCurrentArea(currentLocation).monsters.length > 0) {
                
                contextualActions.push({
                    keyword: "run",                                    
                    title: "Run away",                
                    active: true,
                    staminaCost: 1,
                    location: "",
                    func: "runAway",
                });
            }            
        }
        
        items = getLocationFromCurrentArea(currentLocation).items;
        monsters = getLocationFromCurrentArea(currentLocation).monsters;
        npcs = getLocationFromCurrentArea(currentLocation).npcs;                
    }         

    // UPGRADE MENU
    // If we are currently opening the upgrade menu, we need to cycle through everything in our inventory and get only upgradable items
    if (!narrationOpen && !inventoryOpen && !trainMenuOpen && upgradeMenuOpen) {

        contextualActions = [];
        contextualActions.push({            
            keyword: "back",
            title: "Back",
            active: true,
            staminaCost: -1,
            location: "",
            func: "exitUpgrade"
            });

        items = [];
        inventory.forEach((element, index) => {

            if (itemsModified[getIndexFromKeyword(element, objectType.item)].canUpgrade)
                items.push(element);
        });
    }

    // INVENTORY
    // In the inventory - we inject special items that represent our resources, but only if we have any of that resource
    if (inventoryOpen) {
        
        // We make a deep copy of our inventory to inject these resource items into only while we are viewing the inventory
        items = JSON.parse(JSON.stringify(inventory));
        if (ore > 0) { itemsModified[getIndexFromKeyword("ore", objectType.item)].quantity = ore; items.splice(0,0, "ore"); }
        if (leather > 0) { itemsModified[getIndexFromKeyword("leather", objectType.item)].quantity = ore; items.splice(0,0, "leather"); }
        if (greenHerb > 0) { itemsModified[getIndexFromKeyword("green_herb", objectType.item)].quantity = greenHerb; items.splice(0,0, "green_herb"); }            
    }    
    if (items != undefined && items.length > 0 && items != "") {
                
        // Functionality is defined by the context this button is in:
        // 1: Location    2: Inventory Normal     3: Inventory + Monster      4: Vendor Buy        5: Vendor Upgrade
        let buttonContext = 1; // Location        
        
        if (npcActive) {
            buttonContext = 4;
        }        
        if (inventoryOpen) {
            buttonContext = 2;
        }
        // Rethink have monster specific inventory actions, these should be present in the main actions menu somehow
        // if (inventoryOpen) {
        // 
        // }
        if (!inventoryOpen && upgradeMenuOpen)
            buttonContext = 5;

        // Create a button for each item contained in our array
        items.forEach((element,index) => {
            
            let item = itemsModified[getIndexFromKeyword(element, objectType.item)];                        

            let itemCostActive = false;            
            let descriptionTextActive = false;
            let upgradeMaterialCostActive = false

            // Create a new button and return an object with all of it's individual elements parameterized
            const newButton = createButton(item.keyword, objectType.item);            
            createdButtons.push(newButton);
            lastButtonConfigured = newButton.button;                    
            newButton.button.classList = "nav-button item-button can-hover";
            newButton.buttonChevron.style.display = "block";

            // ITEM NAME
            let itemTitle = item.title;
            if (item.level != undefined && item.level > 0) itemTitle += " +" + item.level;
            if (inventoryOpen && item.quantity != undefined && item.quantity > 0) itemTitle += " [ " + item.quantity + " ]";
            newButton.buttonText.innerText = itemTitle;
            
            // ITEM DESCRIPTION
            if (item.description != undefined && item.description != "") {
                newButton.descriptionText.innerText = item.description;            
                descriptionTextActive = true;
            }
            // STAT SECTION
            let statSectionActive = false;
            if (item.power != 0 || item.stamina != 0  || item.defence != 0 ) {
                
                statSectionActive = true;
                newButton.powerText.innerText = item.power;
                newButton.staminaText.innerText = item.stamina;
                newButton.defenceText.innerText = item.defence;
            }
                    

            // Context specific changes - items behave and display differently depending on the context we find them in, below are the contexts that can contain items          
            // 1: Location = Take    2: Inventory = Equip / Unequip     3: Inventory + Monster = Use     4: Vendor Buy = Purchase        5: Vendor Upgrade = Upgrade
            let secondaryButtonDisplayed = false;
            let secondaryButtonActive = true;  
            switch (buttonContext) {

                // 1: Location = Take 
                case 1:                    
                    document.querySelector("nav").insertBefore(newButton.button, buttonMaster);

                    if (item.canTake) {
                        secondaryButtonDisplayed = true;
                        newButton.secondaryButtonText.innerText = "Take";

                        let _currentLocation = currentLocation;       // Storing this value as it changes before we can use it to remove the item

                        // Taking different items can have different outcomes depending on the item type
                        if (item.itemType != undefined && item.itemType === "pickupGold")
                            newButton.secondaryButton.onclick = function() {  addGold(item.quantity, "You pickup the coins."); removeItemFromLocation(item.keyword, _currentLocation); playClick(); };
                        else if (item.itemType != undefined && item.itemType === "pickupInsight")
                            newButton.secondaryButton.onclick = function() {  addInsight(item.quantity, "You pick up the relic and feel it's essence move within you."); removeItemFromLocation(item.keyword, _currentLocation); playClick(); };
                        else if (item.itemType != undefined && item.itemType === "pickupCorpse")
                            // Check if _currentContext === currentContext, otherwise we can be killed in the same turn we pick up the corpse, then this function will be removing the new corpse
                            newButton.secondaryButton.onclick = function() {  getCorpse(item.quantity, "You search the remains of your lifeless body and recover what you can."); playClick(); };
                        else if (item.itemType != undefined && item.itemType === "pickupHeal")
                            newButton.secondaryButton.onclick = function() {  addHealth(item.quantity, "You eat the health item."); removeItemFromLocation(item.keyword, _currentLocation); playClick(); };
                        else if (item.itemType != undefined && item.itemType === "pickupGreenHerb")
                            newButton.secondaryButton.onclick = function() {  addGreenHerb(item.quantity, "You pick the young Green Herbs and put them in your pouch."); removeItemFromLocation(item.keyword, _currentLocation); playClick(); };                
                        else
                            newButton.secondaryButton.onclick = function() {  addToInventory(item.keyword); playClick(); };
                    }
                    else if (item.lock != null && item.lock != "") {

                        secondaryButtonDisplayed = true;
                        newButton.secondaryButtonText.innerText = "Unlock";                    

                        if (inventory.indexOf(item.lock) != -1) {

                            secondaryButtonActive = true;
                            newButton.secondaryButton.onclick = function() {  
                                getLocationFromCurrentArea(currentLocation).items.splice(getLocationFromCurrentArea(currentLocation).items.indexOf(item.keyword), 1);
                                inventory.splice(inventory.indexOf(item.lock), 1);
                                playClick();
                                addUpdateText("You unlock the " + item.shortTitle);
                                updateMap();
                                updateButtons(false);
                            };
                        }
                        else {
                            secondaryButtonActive = false;
                        }
                    }
                    else
                        secondaryButtonDisplayed = false;

                    break;

                    // 2: Inventory = Equip / Unequip
                case 2:

                    // The healing item we can use from our inventory
                    if (item.itemType != undefined && item.itemType === "healGreenHerb") {
                        secondaryButtonDisplayed = true;
                        newButton.secondaryButtonText.innerText = "Eat";
                        newButton.secondaryButton.onclick = function() { addHealth(10, "You feel slightly healthier."); greenHerb--; updateButtons(true); playClick(); };                        
                        inventorySection.appendChild(newButton.button);
                    }
                    else {

                        if (item.equipped)
                            equipmentSection.appendChild(newButton.button);                    
                        else
                            inventorySection.appendChild(newButton.button);

                        if (item.canEquip) {
                            if (item.equipped)
                                newButton.secondaryButtonText.innerText = "Unequip";                        
                            else
                                newButton.secondaryButtonText.innerText = "Equip";
                        
                            secondaryButtonDisplayed = true;                    
                            newButton.secondaryButton.onclick = function() { toggleEquipped(item.keyword); updateButtons(true); playClick(); };
                        }
                    }
                    break;

                    // 3: Inventory + Monster = Use
                case 3:
                    
                    break;

                    // 4: Vendor Buy = Purchase 
                case 4:
                    itemCostActive = true;
                    newButton.itemCostSection.style.display = "flex";
                    newButton.itemCostText.innerText = item.cost;

                    // Check if we can afford this item, style text red if we can't
                    if (item.cost < gold) {
                        newButton.itemCostText.classList = "item-cost-text active";  
                        secondaryButtonActive = true;                      
                    }
                    else {
                        newButton.itemCostText.classList = "item-cost-text inactive";
                        secondaryButtonActive = false;
                    }

                    saleTitle.style.display = "block";
                    saleSection.appendChild(newButton.button);
                    secondaryButtonDisplayed = true;
                    newButton.secondaryButtonText.innerText = "Purchase";
                    newButton.secondaryButton.onclick = function() {  buy(item.keyword, item.cost); playClick(); };
                    break;

                    // 5: Vendor Upgrade = Upgrade
                case 5:
                    
                    let costToUpgrade = item.level * 50 + 100;
                    itemCostActive = true;
                    newButton.itemCostSection.style.display = "flex";
                    newButton.itemCostText.innerText = costToUpgrade;
                    let notEnoughGold = false;

                    // Check if we can afford this item, style text red if we can't
                    if (costToUpgrade < gold) {
                        newButton.itemCostText.classList = "item-cost-text active";  
                        secondaryButtonActive = true;                      
                    }
                    else {
                        newButton.itemCostText.classList = "item-cost-text inactive";
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
                        newButton.upgradeMaterialCost.innerText = upgradeMaterialString;

                        if (!notEnoughGold && ore > oreCost && leather > leatherCost) {
                            newButton.upgradeMaterialCost.classList = "upgrade-material-cost active";                            
                            secondaryButtonActive = true;
                        }
                        else {
                            newButton.upgradeMaterialCost.classList = "upgrade-material-cost inactive";                        
                            secondaryButtonActive = false;
                        }
                    }

                    document.querySelector("nav").insertBefore(newButton.button, buttonMaster);
                    statSectionActive = false;                
                    secondaryButtonDisplayed = true;
                    newButton.secondaryButtonText.innerText = "Upgrade";
                    newButton.secondaryButton.onclick = function() {  upgrade(item.keyword, costToUpgrade, oreCost, leatherCost); playClick(); };
                    break;
            }

            // The function for opening and collapsing the button            
            newButton.button.onclick = function() { newButton.button.dispatchEvent(new Event("toggle")); playClick(); updateButtons(true);};           
            
            // Listen for the event.
            newButton.button.addEventListener(
            "toggle",
            (e) => {
                // CLOSE BUTTON
                if (newButton.buttonOpened) {
                    
                    newButton.buttonOpened = false;
                    currentActiveButton = null;

                    if (itemCostActive) newButton.itemCostSection.style.display = "flex"; else newButton.itemCostSection.style.display = "none";
                    newButton.button.classList.remove('active');
                    newButton.descriptionText.style.display = "none";
                    newButton.buttonStatSection.style.display = "none";
                    newButton.secondaryButton.style.display = "none";
                    newButton.upgradeMaterialCost.style.display = "none";

                    newButton.buttonChevron.querySelector('img').classList.add('chevron-closed');
                    newButton.buttonChevron.querySelector('img').classList.remove('chevron-open');
                }
                // OPEN BUTTON
                else {
                    
                    newButton.buttonOpened = true;
                    closeOtherButtons(newButton);
                    currentActiveButton = newButton;                

                    newButton.button.classList.add('active');
                    if (itemCostActive) newButton.itemCostSection.style.display = "flex"; else newButton.itemCostSection.style.display = "none";
                    if (descriptionTextActive) newButton.descriptionText.style.display = "block";
                    if (statSectionActive) newButton.buttonStatSection.style.display = "block";
                    if (secondaryButtonDisplayed) newButton.secondaryButton.style.display = "block";
                    if (upgradeMaterialCostActive) newButton.upgradeMaterialCost.style.display = "block";
                    if (secondaryButtonActive) { newButton.secondaryButton.classList.add('item-button'); newButton.secondaryButton.classList.remove('locked-item-button'); }
                    else { newButton.secondaryButton.classList.remove('item-button'); newButton.secondaryButton.classList.add('locked-item-button'); }

                    newButton.buttonChevron.querySelector('img').classList.add('chevron-open');
                    newButton.buttonChevron.querySelector('img').classList.remove('chevron-closed');
                }
            },
            false,
            );

            // If there is an activeItem, that means we need to toggle this item as open
            if (activeItem != null && activeItem === newButton.keyword)
                newButton.button.dispatchEvent(new Event("toggle")); 
        });
    }

    // Setup buttons based on actions within the action array
    
    if (!inventoryOpen) {
            
        //  MONSTERS
        // Set up any new buttons, starting where we left off
        let nextButton = 0;

        if (monsters != undefined && monsters.length > 0 && monsters != "") {
            
            monsters.forEach((element, index) => {
                
                const monster = monstersModified[getIndexFromKeyword(element, objectType.monster)];
                let descriptionTextActive = false;

                const newButton = createButton(monster.keyword, objectType.monster);
                createdButtons.push(newButton);
                lastButtonConfigured = newButton.button;
                newButton.button.classList = "nav-button monster-button can-hover";
                newButton.buttonChevron.style.display = "block";

                // ITEM NAME
                newButton.buttonText.innerText = monster.title;
                // ITEM DESCRIPTION
                if (monster.description != undefined && monster.description != "") {
                    newButton.descriptionText.innerText = monster.description;            
                    descriptionTextActive = true;
                }

                document.querySelector("nav").insertBefore(newButton.button, buttonMaster);

                newButton.buttonLevelIcon.style.display = "block";
                newButton.buttonLevelIcon.innerText = monster.level;
                                
                // The function for opening and collapsing the button                
                newButton.button.onclick = function() { newButton.button.dispatchEvent(new Event("toggle")); playClick(); updateButtons(true); };                                                    

                newButton.button.addEventListener(
                    "toggle",
                    (e) => {

                    // CLOSE BUTTON
                    if (newButton.buttonOpened) {
                        
                        currentActiveButton = null;

                        newButton.buttonOpened = false;
                        newButton.descriptionText.style.display = "none";
                        newButton.button.classList.remove('active');

                        newButton.monsterHpSection.style.display = "none";

                        newButton.buttonChevron.querySelector('img').classList.add('chevron-closed');
                        newButton.buttonChevron.querySelector('img').classList.remove('chevron-open');
                    }
                    // OPEN BUTTON
                    else {                                            

                        newButton.buttonOpened = true;
                        newButton.button.classList.add('active');

                        closeOtherButtons(newButton);
                        currentActiveButton = newButton;
                        updateMonsterUI(currentActiveButton);                        

                        if (descriptionTextActive)
                            newButton.descriptionText.style.display = "block";

                        newButton.monsterHpSection.style.display = "block";

                        newButton.buttonChevron.querySelector('img').classList.add('chevron-open');
                        newButton.buttonChevron.querySelector('img').classList.remove('chevron-closed');
                    }
                },
                false,
                );

                // If activeMonster is equal to this keyword, that means we just clicked this button to open it and refreshed buttons to get specific actions for this button and now need to re-toggle this button on                
                if (activeMonster != null && activeMonster === newButton.keyword)
                    newButton.button.dispatchEvent(new Event("toggle"));         
            });
        }

        //  NPCS
        // Set up any new buttons, starting where we left off
        if (npcs != undefined && npcs.length > 0 && npcs != "") {
            
            npcs.forEach((element, index) => {

                const npc = npcsModified[getIndexFromKeyword(element, objectType.npc)];                

                const newButton = createButton(npc.keyword, objectType.npc);
                createdButtons.push(newButton);
                lastButtonConfigured = newButton.button;
                newButton.button.classList = "nav-button npc-button can-hover";                

                // ITEM NAME
                newButton.buttonText.innerText = npc.title;                
                
                document.querySelector("nav").insertBefore(newButton.button, buttonMaster);                                                                
                newButton.button.onclick = function() { displayNPC(getIndexFromKeyword(element, objectType.npc)); playClick(); };                                                                                
            });
        }

        // CONTEXTUAL ACTIONS
        // Add in the rest of context specific actions (i.e. Buttons for leaving the location etc.)
        
        // We will store action buttons as we create them so we can animate them appearing
        let createdActionButtons = [];
        
        if (contextualActions.length > 0) {        

            if (lastButtonConfigured != null)
                lastButtonConfigured.classList += " spacer";         // Before we create the rest of the buttons, we add some spacing in the list to separate the two categories of buttons

            contextualActions.forEach((element, index) => {
                
                let additionalButtonString = "";        // If any additional text needs to be appended to a button                                
                let action = element;

                const newButton = createButton(action.keyword, objectType.action);
                newButton.button.style.display = "none";
                createdButtons.push(newButton);
                createdActionButtons.push(newButton);

                // ITEM NAME                            
                document.querySelector("nav").insertBefore(newButton.button, buttonMaster);                                                                
                
                let buttonActive = true;

                if (action.active) {                

                    // Check for Stamina cost, this could modify the button to not be in an active state
                    if (action.staminaCost > 0) {
                        
                        newButton.button.querySelector('.stamina-cost-section').style.display = "flex";
                        newButton.button.querySelector('.stamina-cost-text').innerText = action.staminaCost;

                        if (action.staminaCost > currentStamina) {                        
                            buttonActive = false;
                            newButton.button.querySelector('.stamina-cost-text').classList = "stamina-cost-text inactive";
                        }
                        else {                        
                            newButton.button.querySelector('.stamina-cost-text').classList = "stamina-cost-text active";
                        }                                                                    
                    }

                    // Check for talk actions as they have a specific parameter that could make it inactive
                    if (action.func === "talk") {

                        if (!npcsModified[currentNPC].dialogueAvailable)
                            buttonActive = false;                        
                    }                    
    
                    if (buttonActive) {
                        
                        newButton.button.classList = "nav-button action-button can-hover";
                        
                        // If this is a loction action
                        if (action.location != null && action.location != "") {

                            newButton.button.onclick = function() { 
                                displayLocation(action.location, objectType.location);                                
                                playClick();
                                recoverStamina() 
                            };
                        }
                        // Otherwise this button is a misc function action
                        else {

                            newButton.button.onclick = function() {doAction(element.func, element.staminaCost, true); playClick();};
                        }
                    }                
                }
                
                if (!action.active || !buttonActive) {

                    newButton.button.classList = "nav-button action-button-inactive";
                }
                
                newButton.buttonText.innerText = action.title + additionalButtonString;
            });
        }

        // Here we will configure our buttons by hand, rather than having previously pushed action objects into contextActions, it's just simpler to be able to define our onclick functions directly and not use the func parameter
        if (trainMenuOpen) {                        

            let newButton;
            let buttonActive = true;

            // INCREASE HP
            let increaseHpCost = 1;
            newButton = createButton("hp", objectType.action);
            newButton.button.style.display = "none";
            createdButtons.push(newButton);
            createdActionButtons.push(newButton);
            document.querySelector("nav").insertBefore(newButton.button, buttonMaster);        
            newButton.buttonText.innerText = "Feed the Body (" + increaseHpCost + " insight)";
            if (insight >= increaseHpCost) {        
                
                newButton.button.classList = "nav-button action-button can-hover";
                newButton.button.onclick = function() {train("hp", increaseHpCost)};
            }
            else {        
                
                newButton.button.classList = "nav-button action-button-inactive";
                newButton.button.onclick = "";        
            }
            // INCREASE STAMINA
            let increaseStaminaCost = 2;
            newButton = createButton("stamina", objectType.action);
            newButton.button.style.display = "none";
            createdButtons.push(newButton);
            createdActionButtons.push(newButton);
            document.querySelector("nav").insertBefore(newButton.button, buttonMaster);        
            newButton.buttonText.innerText = "Feed the Breathe (" + increaseStaminaCost + " insight)";
            if (insight >= increaseStaminaCost) {        
                
                newButton.button.classList = "nav-button action-button can-hover";
                newButton.button.onclick = function() {train("stamina", increaseStaminaCost)};
            }
            else {        
                
                newButton.button.classList = "nav-button action-button-inactive";
                newButton.button.onclick = "";        
            }
            // INCREASE POWER
            let increasePowerCost = 3;
            newButton = createButton("curse", objectType.action);
            newButton.button.style.display = "none";            
            createdButtons.push(newButton);
            createdActionButtons.push(newButton);
            document.querySelector("nav").insertBefore(newButton.button, buttonMaster);        
            newButton.buttonText.innerText = "Feed the Curse Mark (" + increasePowerCost + " insight)";
            if (insight >= increasePowerCost) {        
                
                newButton.button.classList = "nav-button action-button can-hover";
                newButton.button.onclick = function() {train("curse", increasePowerCost)};
            }
            else {        
                
                newButton.button.classList = "nav-button action-button-inactive";
                newButton.button.onclick = "";        
            }
            
            newButton = createButton("misc", objectType.action);     
            newButton.button.style.display = "none";       
            createdButtons.push(newButton);
            createdActionButtons.push(newButton);
            document.querySelector("nav").insertBefore(newButton.button, buttonMaster);        
            newButton.button.classList = "nav-button action-button can-hover";
            newButton.buttonText.innerText = "Exit";
            newButton.button.onclick = function() {trainMenuOpen = false; displayLocation(currentArea, currentLocation);};
        }

        
        // Now we animate in the created action buttons
        createdActionButtons.forEach((element, index) => {                        

            let timeOut = 0;
            if (!skipAnimation) timeOut = 300 + (100 * (index));

            setTimeout(function() {

                element.button.style.display = "flex";
                playClick();
            }, timeOut);
        });
    }    
}

function initalizeMap() {

    if (showDebugLog) console.log("initializeMap() - ");

    mapGrid = [];            // Grid that will hold our node objects
    const secondaryGrid = [];       // Grid to hold the refs to the smaller boxes temporarily

    for (let rowIndex = 0; rowIndex < mapGridContainer.children.length; rowIndex++) {
        
        const row = mapGridContainer.children[rowIndex];
        
        // If even, we are on a row of main squares
        if (rowIndex % 2 === 0) {
            
            const mainRowArray = [];
            const secondaryRowArray = [];

            for (let elementIndex = 0; elementIndex < row.children.length; elementIndex++) {

                const element = row.children[elementIndex];     // This can be either a main square or a secondary one

                // The even elements are going to be our node squares
                if (elementIndex % 2 === 0) {                                                        

                    const nodeObject = {
                        element: element,
                        north: null,
                        west: null,
                        east: null,
                        south: null,
                    }

                    mainRowArray.push(nodeObject);                    
                }
                // Otherwise we are on a vertical smaller square
                else {

                    secondaryRowArray.push(element);
                }
            }

            mapGrid.push(mainRowArray);
            secondaryGrid.push(secondaryRowArray);
        } 
        // Otherwise we're in a row of horizontal connector squares
        else {
            
            const secondaryRowArray = [];

            // Only need to push this to the secondary grid
            for (let elementIndex = 0; elementIndex < row.children.length; elementIndex++) {
                
                const element = row.children[elementIndex];

                secondaryRowArray.push(element);
            }

            secondaryGrid.push(secondaryRowArray);
        }
    }

    for (let y = 0; y < mapGrid.length; y++) {
        for (let x = 0; x < mapGrid[y].length; x++) {
            
            const nodeObj = mapGrid[y][x];
            
            if (y > 0) nodeObj.north = secondaryGrid[2*y - 1][x];
            if (x > 0) nodeObj.west = secondaryGrid[y*2][x-1];            
            if (x < mapGrid[y].length - 1) nodeObj.east = secondaryGrid[y*2][x];            
            if (y < mapGrid.length -1) nodeObj.south = secondaryGrid[2*y + 1][x];
        }
    }

    mapInitialize = true;
}

function updateMap() {

    if (showDebugLog) console.log("updateMap() - ");

    activeDirections = [];    
    const monsterPresent = getLocationFromCurrentArea(currentLocation).monsters.length > 0;

    if (areasModified[currentArea].locations.length > 0) {

        // Reset state of all squares in the grid
        for (let y = 0; y < mapGrid.length; y++) {
            for (let x = 0; x < mapGrid[y].length; x++) {

                const nodeObject = mapGrid[y][x];
                
                nodeObject.element.classList = "main-square"
                if (nodeObject.north != null) nodeObject.north.classList = "horizontal-square"
                if (nodeObject.west != null) nodeObject.west.classList = "vertical-square"
                if (nodeObject.east != null) nodeObject.east.classList = "vertical-square"
                if (nodeObject.south != null) nodeObject.south.classList = "horizontal-square"

                nodeObject.element.onclick = "";
            }
        }

        // Cycle through all locations in this area
        areasModified[currentArea].locations.forEach((location, index) => {

            let isAdjacentToCurrent = false;

            // Get the corresponding nodeObject for the location listed
            const nodeObject = mapGrid[location.coordinates[0]][location.coordinates[1]];

            // Check this node has a line in this direction (If there is no line, it means we are at the edge of the grid)
            if (nodeObject.north != null) {                
                
                // Check there is a location at the coordinate in this direction from our current location
                if (getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "north"), "north") != null) {
                    
                    // Check that there is a path between these two locations
                    if (locationsHavePath(location, getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "north")))) {
                        
                        // Check whether the square in this direction is the player's current location, in which case store that information
                        if (compareArrays(getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "north")).coordinates, getLocationFromCurrentArea(currentLocation).coordinates)) {  // Is the location adjacent to us the player's current location?                                                
                            isAdjacentToCurrent = true;
                            location.seen = true;       // Since this is adjacent to the players current location, we have now seen it

                            activeDirections.push(3);   // That means the players current location is to the north of us, so we add "south" as an active direction
                        }

                        // Check whether the current location and the other square in this direction have been seen, then make sure there is a path between them
                        if (location.seen && getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "north")).seen)                            
                            // If so, show the line between these two
                            nodeObject.north.classList = "horizontal-square inactive";               
                    } 
                }
            }
            if (nodeObject.west != null) {                          
                if (getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "west")) != null) {                
                    
                    if (locationsHavePath(location, getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "west")))) {

                        if (compareArrays(getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "west")).coordinates, getLocationFromCurrentArea(currentLocation).coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(2); // That means the players current location is to the west of us, so we add "east" as an active direction
                        }

                        if (location.seen && getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "west")).seen)
                            nodeObject.west.classList = "vertical-square inactive";
                    }
                }
            }
            if (nodeObject.east != null) {                          
                if (getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "east")) != null) {
                
                    if (locationsHavePath(location, getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "east")))) {

                        if (compareArrays(getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "east")).coordinates, getLocationFromCurrentArea(currentLocation).coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(1); // That means the players current location is to the east of us, so we add "west" as an active direction
                        }

                        if (location.seen && getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "east")).seen)
                            nodeObject.east.classList = "vertical-square inactive";
                    }
                }
            }
            if (nodeObject.south != null) {                          
                if (getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "south")) != null) {
                
                    if (locationsHavePath(location, getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "south")))) {

                        if (compareArrays(getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "south")).coordinates, getLocationFromCurrentArea(currentLocation).coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(0); // That means the players current location is to the south of us, so we add "north" as an active direction
                        }

                        if (location.seen && getLocationFromCurrentArea(getNewCoordinates(location.coordinates, "south")).seen)
                            nodeObject.south.classList = "horizontal-square inactive";
                    }
                }
            }            

            // Set this location square to active            
            if (location.visited === true)
                nodeObject.element.classList = "main-square visited"
            else if (location.seen === true)
                nodeObject.element.classList = "main-square seen"
            else
                nodeObject.element.classList = "main-square"

            // If this location is adjacent to the player's current location, it is hoverable and clickable to move here
            if (!monsterPresent && isAdjacentToCurrent) {

                nodeObject.element.classList += " can-hover";                
                nodeObject.element.onclick = function() { 
                    displayLocation(currentArea, location.coordinates);                                
                    playClick();
                    recoverStamina(); 
                };
            }

        });

        // Insert player symbol in current location        
        const currentLocationNode = mapGrid[currentLocation[0]][currentLocation[1]];        

        // Check if there are monsters present
        if (getLocationFromCurrentArea(currentLocation).monsters.length > 0) {

            currentLocationNode.element.classList = "main-square current-hostile"

            // We hide all lines coming from current square
            if (getLocationFromCurrentArea(currentLocation).north != null)                             
                currentLocationNode.north.classList = "horizontal-square";
            if (getLocationFromCurrentArea(currentLocation).west != null)                                        
                currentLocationNode.west.classList = "vertical-square";
            if (getLocationFromCurrentArea(currentLocation).east != null)                                        
                currentLocationNode.east.classList = "vertical-square";
            if (getLocationFromCurrentArea(currentLocation).south != null)                                        
                currentLocationNode.south.classList = "horizontal-square";
        }
        else {
            currentLocationNode.element.classList = "main-square current"        

            // Highlight all lines leading away from the current node, double check with active directions as this direction might be blocked
            if (getLocationFromCurrentArea(currentLocation).north != null && activeDirections.includes[0])             
                if (getLocationFromCurrentArea(getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "north")) != null)
                currentLocationNode.north.classList = "horizontal-square active";

            if (getLocationFromCurrentArea(currentLocation).west != null && activeDirections.includes[1])
                if (getLocationFromCurrentArea(getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "west")) != null)
                currentLocationNode.west.classList = "vertical-square active";

            if (getLocationFromCurrentArea(currentLocation).east != null && activeDirections.includes[2])                        
                if (getLocationFromCurrentArea(getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "east")) != null)
                currentLocationNode.east.classList = "vertical-square active";

            if (getLocationFromCurrentArea(currentLocation).south != null && activeDirections.includes[3])                        
                if (getLocationFromCurrentArea(getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "south")) != null)
                currentLocationNode.south.classList = "horizontal-square active";
        }

    }
    else
        console.error("updateMap - Current Area: " + currentArea + " has no locations");
}

// When we open a button, we need to close all other buttons
function closeOtherButtons(newButton) {

    if (newButton === null) return;

    createdButtons.forEach((element, index) => {
        
        if (element != newButton && element.buttonOpened) {

            element.button.dispatchEvent(new Event("toggle"));
        }
    });
}

// 0 = North 1 = West 2 = East 3 = South 4 = Next
function go(direction, checkForMonster) {
    
    if (checkForMonster && getLocationFromCurrentArea(currentLocation).monsters.length > 0) {
        console.log("go - Monster is present");
        return;
    }

    let dir = "";

    // This function only works while in a location context
    if (!npcActive || narrationOpen) {
        
        if (direction != 4 && activeDirections.indexOf(direction) === -1) { if (showDebugLog) console.log("go - [" + direction + "] is not an active direction."); return; }
        
        switch (direction) {
            case 0:
                displayLocation(currentArea, getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "north"));                
                break;
            case 1:
                displayLocation(currentArea, getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "west"));
                break;
            case 2:
                displayLocation(currentArea, getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "east"));
                break;
            case 3:                
                displayLocation(currentArea, getNewCoordinates(getLocationFromCurrentArea(currentLocation).coordinates, "south"));
                break;
            case 4:
                createdButtons.forEach((element) => {
                    if (element.button.innerText.includes("Next") || element.button.innerText.includes("Continue")) {
                        if (element.button.style.display === "flex")
                            element.button.onclick();
                    }                                              
                });
            break;
        }

        playClick();
        recoverStamina();
    }
}

function displayNPC(index) {

        npcActive = true;
        currentNPC = index;        

        mainTitleText.innerText = areasModified[currentArea].title;
        mainTitleText.classList = "secondary";        
        secondaryTitle.style.display = "flex";
        
        secondaryTitleIcon.classList = "npc";
        secondaryTitleIcon.innerText = "";
        secondaryTitleText.innerText = npcsModified[index].title;
        mainText.innerText = npcsModified[index].description;

        // Some contexts have update text that should display when the player enters their context
        if (npcsModified[index].update != undefined && npcsModified[index].update != "")
            addUpdateText(npcsModified[index].update);

        mapGridContainer.style.display = "none";

        updateButtons(false);
}

function closeNPC() {

    npcActive = false;
    currentNPC = -1;
    displayLocation(currentArea, currentLocation);
}

function displayNarration(narrationKeyword) {
    
    if (showDebugLog) console.log("displayNarration() - ");
        
    if (narrationKeyword != undefined) {
        currentNarration = narrationKeyword;
        currentNarrationIndex = 0;
    }
    else if (narrationKeyword === undefined && currentNarration === "") {
        console.error("displayNarrative - no narrationKeyword provided, currentNarration is undefined as well");
    }        

    mapGridContainer.style.display = "none";

    narrationOpen = true;
    updateButtons(false);

    saleTitle.style.display = "none";
    narrationText.style.display = "none";        
    mainTitleText.classList = "";;
    mainTitleText.innerText = "";
    secondaryTitle.style.display = "none";
    
    if (narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].text.length > currentNarrationIndex) {    
        mainText.innerText = narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].text[currentNarrationIndex];
    }
    else
        console.error("displayNarrative - Narration index [" + currentNarrationIndex + "] is higher than text length [" + narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].text.length + "]");
}

function continueNarration() {

    if (showDebugLog) console.log("continueNarration() - ");

    currentNarrationIndex++;

    if (narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].text.length > currentNarrationIndex)
        mainText.innerText = narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].text[currentNarrationIndex];
    else {
        narrationsModified[getElementFromKeyword(currentNarration, narrationsModified)].seen = true;
        closeNarration();
    }
}

function closeNarration() {

    narrationOpen = false;
    displayLocation(currentArea, currentLocation);
}

function displayTitle() {
    
    if (showDebugLog) console.log("displayTitle() - ");
    
    mapGridContainer.style.display = "none";

    titleOpen = true;
    updateButtons(false);

    ///////// TODO Change to support regions
    // areasVisited += locationsModified[currentLocation].area;
    // let contextKeyword = locationsModified[currentLocation].area + "_title";        

    // saleTitle.style.display = "none";
    // narrationText.style.display = "none";        
    // mainTitle.classList = "centered";
    // mainTitleText.classList = "";
    // mainTitleText.innerText = locationsModified[getIndexFromKeyword(contextKeyword, objectType.location)].title;
    // secondaryTitle.style.display = "none";        
    // mainText.innerText = locationsModified[getIndexFromKeyword(contextKeyword, objectType.location)].description;
}

function closeTitle() {

    titleOpen = false;
    displayLocation(currentArea, currentLocation);
}

function displayInventory() {
    
    if (showDebugLog) console.log("displayInventory() - ");

    inventoryOpen = true;

    inventoryIcon.classList = "close-inventory";    
    inventoryIcon.onclick = function() { exitInventory(); playClick(); };

    mapGridContainer.style.display = "none";

    expandStats();    
    updateButtons(false);

    narrationText.style.display = "none";        
    mainTitleText.classList = "";
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
    displayLocation(currentArea, currentLocation);
    if (upgradeMenuOpen)
        displayUpgrade();
    if (narrationOpen)
        displayNarration();
}

function clearInventory() {

    inventoryIcon.classList = "open-inventory";
    inventoryIcon.onclick = function() { displayInventory(); playClick(); };        

    expandStats();

    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
}

function displayUpgrade() {

    mapGridContainer.style.display = "none";

    upgradeMenuOpen = true;
    updateButtons(false);
    expandStats();

    narrationText.style.display = "none";        
         
    mainText.innerText = "Not all weapons can become the stuff of legends, but given the right materials any weapon might become functional.";

    saleTitle.style.display = "none";
}

function exitUpgrade() {

    upgradeMenuOpen = false;
    displayLocation(currentArea, currentLocation);
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
    narrationText.style.display = "none";
    updateText.style.display = "none";    
    mainTitleText.classList = "";
    secondaryTitle.style.display = "none";    
    mainTitleText.innerText = "Seek Guidance";
    mainText.innerText = "You close your eyes and kneel. You feel the earth below and breathe deep the air.";
    
    expandStats();

    mapGridContainer.style.display = "none";

    trainMenuOpen = true;
    updateButtons(false);
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

            let curseMarkIndex = getIndexFromKeyword("curse_mark", objectType.item);
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

// Calculates stats that are based on multiple factors
function calculateStats() {

    power = basePower;
    maxStamina = baseStamina;
    defence = baseDefence;
    evasion = baseEvasion;

    inventory.forEach((element) => {
        
        let index = getIndexFromKeyword(element, objectType.item);

        if (itemsModified[index].equipped) {
            power += itemsModified[index].power;
            maxStamina += itemsModified[index].stamina;
            defence += itemsModified[index].defence;
        }
    });
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

function updateMonsterUI(monsterButton) {
    
    let monster = monstersModified[getIndexFromKeyword(monsterButton.keyword, objectType.monster)];

    monsterButton.monsterHpText.innerText = monster.hpCurrent + "/" + monster.hpMax;
    let monsterHpCurrentPercent = monster.hpCurrent / monster.hpMax * 100;
    // The width of our hp bar is the current hp percentage * 2 because the total width of the bar is 200    
    monsterButton.monsterHpBar.style.width = (monsterHpCurrentPercent + 1) + 'px';
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

function removeItemFromLocation(itemKeyword, locationIndex) {    

    console.log("remove item: " + itemKeyword);
    
    getLocationFromCurrentArea(locationIndex).items = getLocationFromCurrentArea(locationIndex).items.filter(item => item !== itemKeyword);    
    
    save();

    if (locationIndex === currentLocation)
        updateButtons(true);
}

// #endregion

// #region ACTIONS

// Translate a string provided in through the context data into an action
async function doAction(actionString, staminaCost, resetText) {    

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
            let result = await attack();            
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
        case "continueNarration":
            continueNarration();
            break;
        case "closeTitle":
            closeTitle();
            break;
        case "closeNPC":
            closeNPC();
            break;
        case "advanceDialogue":
            if (functionArray.length === 2)         // advanceDialogue|npcKeyword
                advanceDialogue(functionArray[1]);
            else
                console.error("doAction - Called advanceDialogue without an additional argument");
            break;
        case "goToNPC":
            if (functionArray.length === 2)     // goToNPC|npcKeyword
                displayNPC(getIndexFromKeyword(functionArray[1], objectType.npc));                
            else
                console.error("doAction - Called goToNPC without an additional argument");
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
    
    if (staminaCost != -1) {
        if (staminaCost > currentStamina)
            console.error("doAction() - staminaCost too high");
        else        
            spendStamina(staminaCost);
    }        
}

function doActionComplete() {

}

function playerActionComplete() {

    if (showDebugLog) console.log("playerActionComplete() - ");
          
    let monsters = getLocationFromCurrentArea(currentLocation).monsters;    

    let playerDead = false;
    if (monsters.length > 0 && monsters != "") {

        monsters.forEach((element, index) => {

            if (currentLocation != -99)      // Check in case a previous monster already killed us
                playerDead = triggerEnemyAttack(element);
        });            
    }    

    if (playerDead) return;

    recoverMax(false);
    updateStats();
    save();        
    updateButtons(true);    
}

function triggerEnemyAttack(monsterKeyword) {

    let monstersActionString = "";  
    let monster = monstersModified[getElementFromKeyword(monsterKeyword, monstersModified)];

    // Evasion chance
    let evasionNumber = Math.floor(Math.random() * 101);                

    if (evasionNumber <= evasion) {

        monstersActionString +=  "You evade the " + monster.shortTitle + "'s attack."                    
    }
    else {      

        let monsterDamage = Math.max(0, monster.power - defence);        
        hpCurrent -= monsterDamage;
        if (monstersActionString != "") monstersActionString += "\n";
        monstersActionString += "The " + monster.shortTitle + " does " + monsterDamage + " damage to you.";
    }

    if (monstersActionString != "") addUpdateText(monstersActionString);

    if (hpCurrent <= 0) {
        playerDeath();
        return true;
    }

    return false;
}

function recoverStamina() {

    let monstersPresent = false;
    let monsters = getLocationFromCurrentArea(currentLocation).monsters;
    
    if (monsters.length > 0 && monsters != "") 
        monstersPresent = true;

    if (!monstersPresent)
        recoverMax(false);
}

function spendStamina(cost) {

    if (currentStamina >= cost)
        currentStamina -= cost;
    else {
        console.error("spendStamina - Cost [" + cost + "] is greater than currentStamina [" + currentStamina + "]");
        return;
    }

    updateStats();
    save();

    if (currentStamina === 0) {

        playerActionComplete(true);
    }    
}

function playerDeath() {

    let updateTextStore = updateText.innerText;
    if (inventoryOpen) {
        clearInventory();
        updateText.innerText = updateTextStore;
    }
    
    // Check if a player corpse exists already, if so destroy it
    if (corpseLocation != null && getLocationFromArea(corpseLocation.location, corpseLocation.area).items != null && getLocationFromArea(corpseLocation.location, corpseLocation.area).items != "" && getLocationFromArea(corpseLocation.location, corpseLocation.area).items.includes("corpse")) {

        removeItemFromLocation("corpse", corpseLocation);
    }
    

    let funcString = "getCorpse|" + gold + "|You recover what gold you can from the corpse"
    // Set the quantity of the corpse item to the amount of gold we are holding
    itemsModified[getIndexFromKeyword("corpse", objectType.item)].quantity = gold;
    // Remove all our gold
    gold = 0;
    updateStats();

    corpseLocation = {
        area: currentArea,
        location: currentLocation
    };
        
    getLocationFromArea(corpseLocation.location, corpseLocation.area).items.push("corpse");

    narrationText.style.display = "none";        
    mainTitleText.classList = "";
    secondaryTitle.style.display = "none";    
    mainTitleText.innerText = "";        
    mainText.innerText = "";
    updateText.innerText += "\n\nLife leaves your body as it's torn apart.";
    
    // We're going to create a special button to respawn
    clearCreatedButtons();  // Remove all buttons
    const newButton = createButton("misc", objectType.action);
    createdButtons.push(newButton);    
    newButton.button.classList = "nav-button action-button can-hover";                
    newButton.buttonText.innerText = "Awaken";                    
    document.querySelector("nav").insertBefore(newButton.button, buttonMaster);                                                                
    newButton.button.onclick = function() { respawn();};        
    currentLocation = -99;   // Save 'dead' state
    save();
}

function respawn() {    

    if (respawnLocation != null) {

        hpCurrent = hpMax;
        currentStamina = maxStamina;

        // Monsters all heal when you rest
        monstersModified.forEach((element) => {
            element.hpCurrent = element.hpMax;
        });

        updateStats();        
        displayLocation(respawnLocation.area, respawnLocation.location); 
        save();        
        
        // TODO Add variants on this text
        addUpdateText("You wake soaked in sweat and trembling. The terrors of the foglands haunting your mind.");
    }
    else
        console.error("respawn() - Trying to respawn with an empty respawnLocation");
}

function attack() {

    return new Promise((resolve, reject) => {

        if (currentLocation === -99) return;

        if (showDebugLog) console.log("attack() - ");         // Unhelpful console log imo
        
        if (currentActiveButton === null) console.error("Attack() - but no active monster");
        
        let monster = monstersModified[getIndexFromKeyword(currentActiveButton.keyword, objectType.monster)];
        
        // Evasion chance
        let evasionNumber = Math.floor(Math.random() * 101);
        if (showDebugLog) console.log("Monster evasion - " + monster.evasion + "  evade number: " + evasionNumber);

        if (evasionNumber <= monster.evasion) {
            
            setTimeout(() => {
                let updateString = "The " + monster.shortTitle + " evades your attack."
                addUpdateText(updateString);

                resolve("Complete");
            }, 500);
        }
        else {            

            // PLAYER ATTACK
            monster.hpCurrent -= power;
            updateMonsterUI(currentActiveButton);
                
            let updateString = "You do " + power + " damage to the " + monster.shortTitle + "."
            addUpdateText(updateString);  

            setTimeout(() => {    

                // CHECK FOR MONSTER DEATH
                if (monster.hpCurrent <= 0) {

                    monsterDeath(currentActiveButton);
                }
                
                resolve("Complete");
            }, 500);
        }    
    });
}

function block(staminaCost) {

    if (showDebugLog) console.log("block() - Defence: " + defence + "   Stamina Cost: " + staminaCost);         // Unhelpful console log imo
                
    let monster = monstersModified[currentLocation];
    
    console.log("BLOCK NOT IMPLEMENTED");
    
    spendStamina(staminaCost);
}

function recover() {

    // let maxRecoverAmount = 3;
    // let recoverAmount = maxRecoverAmount;
    
    // if ((maxStamina - currentStamina) < maxRecoverAmount)
    //     recoverAmount = maxStamina - currentStamina;
    
    // currentStamina += recoverAmount; 
    // if (currentStamina >= maxStamina) currentStamina = maxStamina;
    // playerActionComplete(true);
    // updateStats();
    // save();

    // let updateString = "You recover " + recoverAmount + " stamina."
    // addUpdateText(updateString);
}

function recoverMax(isPlayerAction) {

    if (currentStamina != maxStamina) {
        currentStamina = maxStamina;
        if (isPlayerAction) playerActionComplete(true);
        updateStats();
        save();

        // let updateString = "You recover your stamina."
        // addUpdateText(updateString);
    }
}

function runAway() {
    
    // Wait for a short period here so that any outcome of spending stamina can resolve
    setTimeout(function() {

        if (currentLocation === -99) return; // In case we died while trying to run away

        const direction = activeDirections[Math.floor(Math.random() * activeDirections.length)];        
        
        let location = [];
        let locationString = "";

        switch (direction) {

            // North
            case 0:
                locationString = "north";
                go(0, false);
                break;
            // West
            case 1:
                locationString = "west";
                go(1, false);
                break;
            // East
            case 2:
                locationString = "east";
                go(2, false);
                break;
            // South
            case 3:
                locationString = "south";
                go(3, false);
                break;            
        }

        addUpdateText("You run blindly to the " + locationString);
    }, 750);    
}

function monsterDeath(monsterButton) {
    
    let monster = monstersModified[getIndexFromKeyword(monsterButton.keyword, objectType.monster)];
    
    // Remove this monster from the current location    
    getLocationFromCurrentArea(currentLocation).monsters.splice(getLocationFromCurrentArea(currentLocation).monsters.indexOf(monster.keyword),1);

    let storedMonsterString = "The " + monster.shortTitle + " falls dead at your feet\nYou receive " + monster.insight + " experience and " +  monster.gold + " gold";

    insight += monster.insight;
    gold += monster.gold;
    updateStats();     
    
    // If there are no other monsters here, we should recover our stamina
    recoverStamina();

    save();

    currentActiveButton = null;
    updateMap();
    updateButtons(true);
    addUpdateText(storedMonsterString);
}

function dodge() {
    if (showDebugLog) console.log("didge() - ");    
    spendStamina(1);
}

function talk() {

    if (npcActive) {

        let dialogueString = npcsModified[currentNPC].keyword + "_" + npcsModified[currentNPC].currentDialogue;
        
        displayNarration(dialogueString);
        npcsModified[currentNPC].dialogueAvailable = false;
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
      area: currentArea,
      location: currentLocation
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

    let item = itemsModified[getIndexFromKeyword(keyword, objectType.item)];
    if (item === undefined) {
        console.error("addToInventory() - keyword:" + keyword + " not found in items array");
        return;
    }

    inventory.push(keyword);
    
    let actions = [];
    let items = [];

    // Depending on the contextType, we will splice this item out of a different context
    if (!npcActive) {        
        items = getLocationFromCurrentArea(currentLocation).items;
    }    
    else if (npcActive) {        
        items = npcsModified[currentNPC].items;
    }
    
    // Find and remove the item from the item list that it was contained in
    let itemIndex = -1;
    items.forEach((element, index) => {

        if (element === keyword) {
            itemIndex = index;
        }
    });
    if (itemIndex != -1) items.splice(itemIndex, 1);

    updateButtons(true);

    save();
    addUpdateText("The " + item.shortTitle + " has been added to your inventory.");
    spendStamina(1);
}

function buy(keyword, cost) {

    let item = itemsModified[getIndexFromKeyword(keyword, objectType.item)];
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

    let item = itemsModified[getIndexFromKeyword(keyword, objectType.item)];
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
        if (item.itemType === "shield")
            item.defence += 5;

        updateStats();
        updateButtons(true);
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
    spendStamina(1);
}

function getCorpse(amount, updateString) {
    
    gold += amount;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " gold )");    

    removeItemFromLocation("corpse", currentLocation);
    corpseLocation = null;

    updateStats();
    save();
    spendStamina(1);
}

function addInsight(amount, updateString) {

    insight += amount;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " insight )");    

    updateStats();
    save();
    spendStamina(1);
}

function addHealth(amount, updateString) {

    hpCurrent += amount;
    if (hpCurrent > hpMax)
        hpCurrent = hpMax;
    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " health )");    

    updateStats();
    save();
    spendStamina(1);
}

function addGreenHerb(amount, updateString) {

    greenHerb += amount;

    if (updateString != "") 
        addUpdateText(updateString + " ( " + amount + " Green Herb )");    

    updateStats();
    save();
    spendStamina(1);
}

function toggleEquipped(keyword) {
    
    // Double check to make sure this is in our inventory
    if (inventoryIndexOf(keyword) != -1) {

        let item = itemsModified[getIndexFromKeyword(keyword, objectType.item)];
        
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
        spendStamina(1);
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
    localStorage.setItem('currentLocation', JSON.stringify(currentLocation));
    localStorage.setItem('currentArea', JSON.stringify(currentArea));
    localStorage.setItem('locationsVisited', JSON.stringify(areasVisited));    
    localStorage.setItem('areasVisited', JSON.stringify(areasVisited));    
    localStorage.setItem('insight', JSON.stringify(insight));
    localStorage.setItem('hpCurrent', JSON.stringify(hpCurrent));
    localStorage.setItem('hpMax', JSON.stringify(hpMax));
    localStorage.setItem('maxStamina', JSON.stringify(maxStamina));
    localStorage.setItem('currentStamina', JSON.stringify(currentStamina));
    localStorage.setItem('gold', JSON.stringify(gold));
    localStorage.setItem('ore', JSON.stringify(ore));
    localStorage.setItem('leather', JSON.stringify(leather));
    localStorage.setItem('greenHerb', JSON.stringify(greenHerb));
    localStorage.setItem('basePower', JSON.stringify(basePower));
    localStorage.setItem('baseStamina', JSON.stringify(baseStamina));
    localStorage.setItem('baseDefence', JSON.stringify(baseDefence));    
    localStorage.setItem('baseEvasion', JSON.stringify(baseEvasion));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('respawnLocation', JSON.stringify(respawnLocation));
    localStorage.setItem('corpseLocation', JSON.stringify(corpseLocation));

    localStorage.setItem('areasModified', JSON.stringify(areasModified));    
    localStorage.setItem('monstersModified', JSON.stringify(monstersModified));
    localStorage.setItem('npcsModified', JSON.stringify(npcsModified));
    localStorage.setItem('itemsModified', JSON.stringify(itemsModified));
    localStorage.setItem('narrationsModified', JSON.stringify(narrationsModified));    
  }
  
  function load() {

    if (showDebugLog) console.log("Load");

    currentLocation = JSON.parse(localStorage.getItem('currentLocation'));           
    currentArea = JSON.parse(localStorage.getItem('currentArea'));           
    areasVisited = JSON.parse(localStorage.getItem('locationsVisited')); 
    areasVisited = JSON.parse(localStorage.getItem('areasVisited'));    
    insight = JSON.parse(localStorage.getItem('insight'));
    hpCurrent = JSON.parse(localStorage.getItem('hpCurrent'));
    maxStamina = JSON.parse(localStorage.getItem('maxStamina'));
    currentStamina = JSON.parse(localStorage.getItem('currentStamina'));
    hpMax = JSON.parse(localStorage.getItem('hpMax'));
    gold = JSON.parse(localStorage.getItem('gold'));
    ore = JSON.parse(localStorage.getItem('ore'));
    greenHerb = JSON.parse(localStorage.getItem('greenHerb'));
    leather = JSON.parse(localStorage.getItem('leather'));
    basePower = JSON.parse(localStorage.getItem('basePower'));
    baseStamina = JSON.parse(localStorage.getItem('baseStamina'));
    baseDefence = JSON.parse(localStorage.getItem('baseDefence'));
    inventory = JSON.parse(localStorage.getItem('inventory'));
    respawnLocation = JSON.parse(localStorage.getItem('respawnLocation'))
    corpseLocation = JSON.parse(localStorage.getItem('corpseLocation'))

    if (!resetLocations) { 
        
        areasModified = JSON.parse(localStorage.getItem('areasModified'));                    
        monstersModified = JSON.parse(localStorage.getItem('monstersModified'));
        npcsModified = JSON.parse(localStorage.getItem('npcsModified'));
        itemsModified = JSON.parse(localStorage.getItem('itemsModified'));
        narrationsModified = JSON.parse(localStorage.getItem('narrationsModified'));
    }
    else {
        areasModified = JSON.parse(JSON.stringify(areas));        
        areasVisited = [];
        monstersModified = JSON.parse(JSON.stringify(monsters));                
        npcsModified = JSON.parse(JSON.stringify(npcs));
        itemsModified = JSON.parse(JSON.stringify(items));
        narrationsModified = JSON.parse(JSON.stringify(narrations));
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

  // Get an index from an array of the given type.
  // i.e. I want to find a location named "keyword"
  function getIndexFromKeyword(keyword, objType) {
    
    ar = [];    
    switch (objType) {
        case objectType.area://Location        
            ar = areasModified;
            break;
        case objectType.monster://Monster
            ar = monstersModified;            
            break;
        case objectType.item:
            ar = itemsModified;            
            break;
        case objectType.npc:
            ar = npcsModified;            
            break;
    }
    
    let index = -1;
    
    ar.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            index = i;            
        }
    });
    
    if (index === -1) console.error("getIndexFromkeyword() - Failed to find keyword [" + keyword + "] of object type [" + objType + "]");
    return index;
  }

  function getElementFromKeyword(keyword, array) {
    
    if (array === undefined || array === null) console.error("getElementFromKeyword() - keyword [" + keyword + "] No array provided");

    let index = -1;
    
    array.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            index = i;            
        }
    });
    
    if (index === -1) console.error("getElementFromKeyword() - Failed to find keyword [" + keyword + "] in array: " + array);
    return index;
  }  

  function getLocationFromCurrentArea(location) {
    
    let loc = null;
    
    areasModified[currentArea].locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, location)) {
            
            loc = element;            
        }
    });

    return loc;
  }

  function getLocationFromArea(location, area) {
    
    let _area = null;
    if (Number.isInteger(area))
        _area = area;
    else
        _area = getIndexFromKeyword(area, objectType.area);

    let loc = null;
    
    areasModified[_area].locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, location)) {
            
            loc = element;            
        }
    });

    return loc;
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

  // Function to compare two arrays
  function compareArrays(arr1, arr2) {
      // Check if both arrays are defined
      if (!arr1 || !arr2) {
          return false;
      }

      // Check if both arrays have the same length
      if (arr1.length !== arr2.length) {
          return false;
      }

      // Compare each element
      for (let i = 0; i < arr1.length; i++) {
          const el1 = arr1[i];
          const el2 = arr2[i];

          // If elements are arrays, compare them recursively
          if (Array.isArray(el1) && Array.isArray(el2)) {
              if (!compareArrays(el1, el2)) {
                  return false;
              }
          } 
          // If elements are objects, compare them recursively
          else if (typeof el1 === 'object' && typeof el2 === 'object') {
              if (!compareObjects(el1, el2)) {
                  return false;
              }
          } 
          // Otherwise, compare the elements directly
          else if (el1 !== el2) {
              return false;
          }
      }

      return true;
  }

// Helper function to compare two objects
function compareObjects(obj1, obj2) {
    
    // Check if both objects are defined
    if (!obj1 || !obj2) {
        return false;
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if both objects have the same number of keys
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Compare each key and value
    for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // If values are arrays, compare them recursively
        if (Array.isArray(val1) && Array.isArray(val2)) {
            if (!compareArrays(val1, val2)) {
                return false;
            }
        } 
        // If values are objects, compare them recursively
        else if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!compareObjects(val1, val2)) {
                return false;
            }
        } 
        // Otherwise, compare the values directly
        else if (val1 !== val2) {
            return false;
        }
    }

    return true;
}

  /**
 * Get the coordinates of a new cell in a 2D array given the current coordinates and a direction.
 * @param {number} x - The x-coordinate of the current cell.
 * @param {number} y - The y-coordinate of the current cell.
 * @param {string} direction - The direction to move ('up', 'down', 'left', 'right').
 * @returns {object} The coordinates of the new cell.
 */
function getNewCoordinates(coordinates, direction) {
  
  let newY = coordinates[0];
  let newX = coordinates[1];  

  switch (direction) {
    case 'north':
      newY -= 1;
      break;    
    case 'west':
      newX -= 1;
      break;
    case 'east':
      newX += 1;
      break;
    case 'south':
      newY += 1;
      break;
    default:
        throw new Error('Invalid direction');
  }
  
  return [newY,newX];  
}

function locationsHavePath(locationA, locationB) {
    
    let locationABlockedDirections = [];
    let locationBBlockedDirections = [];

    // Check present items for anything blocking exits    
    let _items = locationA.items;
    
    if (_items != undefined && _items.length > 0 && _items != "") {
    
        _items.forEach((element,index) => {
            
            let item = itemsModified[getIndexFromKeyword(element, objectType.item)];
            
            // Check if this item blocks any directions (locked doors block a direction and need a key to be unlocked)
            if (item.blocking != null && item.blocking != "") {

                switch (item.blocking) {
                    case "north":                        
                        locationABlockedDirections.push(0);
                        break;             
                    case "west":
                        locationABlockedDirections.push(1);
                        break;                        
                    case "east":
                        locationABlockedDirections.push(2);
                        break;                        
                    case "south":
                        locationABlockedDirections.push(3);
                        break;
                }
            }
        });
    }    

    _items = locationB.items;
    if (_items != undefined && _items.length > 0 && _items != "") {
    
        _items.forEach((element,index) => {
            
            let item = itemsModified[getIndexFromKeyword(element, objectType.item)];
            
            // Check if this item blocks any directions (locked doors block a direction and need a key to be unlocked)
            if (item.blocking != null && item.blocking != "") {

                switch (item.blocking) {
                    case "north":                        
                        locationBBlockedDirections.push(0);
                        break;             
                    case "west":
                        locationBBlockedDirections.push(1);
                        break;                        
                    case "east":
                        locationBBlockedDirections.push(2);
                        break;                        
                    case "south":
                        locationBBlockedDirections.push(3);
                        break;
                }
            }
        });
    }

    hasPath = false;    

    // If locationA has a coordinate listed to the north
    if (locationA.north != null) {
        // Check if locationA's north exit coordinates match LocationB's coordinates, and check if LocationB's south coordinates match LocationA's coordinates
        if (compareArrays(locationA.north, locationB.coordinates) && compareArrays(locationB.south, locationA.coordinates))
            // Check if LocationA has a blocked direction to the north, or if locationB has a block to the south
            if (!locationABlockedDirections.includes(0) && !locationBBlockedDirections.includes(3))
                hasPath = true;
    }
    if (locationA.west != null) {
        if (compareArrays(locationA.west, locationB.coordinates) && compareArrays(locationB.east, locationA.coordinates))
            if (!locationABlockedDirections.includes(1) && !locationBBlockedDirections.includes(2))
                hasPath = true;
    }
    if (locationA.east != null) {
        if (compareArrays(locationA.east, locationB.coordinates) && compareArrays(locationB.west, locationA.coordinates))
            if (!locationABlockedDirections.includes(2) && !locationBBlockedDirections.includes(1))    
                hasPath = true;
    }
    if (locationA.south != null) {
        if (compareArrays(locationA.south, locationB.coordinates) && compareArrays(locationB.north, locationA.coordinates))
            if (!locationABlockedDirections.includes(3) && !locationBBlockedDirections.includes(0))
                hasPath = true;
    }
    
    return hasPath;
}

  function formatData() {    
      
      if (showDebugLog) console.log("formatData() - ");

      areasModified = JSON.parse(JSON.stringify(areas));      
      npcsModified = JSON.parse(JSON.stringify(npcs));
      monstersModified = JSON.parse(JSON.stringify(monsters));
      narrationsModified = JSON.parse(JSON.stringify(narrations));

      itemsModified = JSON.parse(JSON.stringify(items));

      itemsModified.forEach((element,index) => {
          
          element.upgradeMaterial != null ? element.upgradeMaterial = element.upgradeMaterial.split(',') : element.upgradeMaterial = [];
          element.actions != null ? element.actions = element.actions.split(',') : element.actions = [];        
      });

      //////////// TODO - Fix this
      // Places monsters in the correct locations
      // monstersModified.forEach((element,index) => {
          
      //     if (element.location != null && element.location != "") {            
      //         locationsModified[getIndexFromKeyword(element.location, objectType.location)].monsters.push(element.keyword);            
      //     }
      // });
  }

  // #endregion