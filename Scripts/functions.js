// #region VARIABLES

let version = 0.052;

let insight = 0;
let hpCurrent = 10;
let hpMax = 10;
let gold = 0;

let experience = 0;

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

let currentRegion = null;
let currentArea = null;
let currentLocation = null;

let regionsVisited = [];      // A list of locations we have already visited

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
    regionKeyword: null,    
    areaKeyword: null,
    locationCoordinates: null
};

let corpseLocation = null;

// Debug
let showDebugLog = true;

let startRegionKeyword = "gossamer_gardens";
let startAreaKeyword = "bramble_path";
let startCoordinates = [2,5];
let debugWindowActive = false;

// Header
const header = document.querySelector('header');
const playerXPBar = document.querySelector('#player-xp-bar-current');
const inventoryIcon = document.querySelector('#inventory-icon');
const playerHPBar = document.querySelector('#player-hp-bar-current');
const playerHPText = document.querySelector('#player-hp-text');
const staminaSection = document.querySelector('#player-stamina-section');
const staminaIconMaster = document.querySelector('.player-stamina-icon');         // Duplicated to make stamina icon ui

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

let createdButtons = []
let createdStaminaIcons = []

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

// These are our data arrays that contain the data for the game
let regionsRef = [];
let narrationsRef = [];
let monstersRef = [];       // Reference for unique monsters, these will be duplicated for each location at runtime. References to the actual monster data will be within each location
let npcsRef = [];
let itemsRef = [];
let actionsRef = [];

// These are containers, mostly copies of our reference data which will be modified at runtime
let regions = [];
let monsters = [];          // These are duplicates of the monsters defined in data
let npcs = [];
let items = [];
let narrations = [];


var config = 
{    
	header: true,
	dynamicTyping: true,
	skipEmptyLines: true
}

const promise1 = fetch('Data/items.csv')
  .then((response) => response.text())
  .then((data) => { 
    itemsRef = Papa.parse(data, config).data;
    // Filter out empty rows
    itemsRef = itemsRef.filter(({ keyword }) => keyword != null);
});

const promise2 = fetch('Data/monsters.csv')
  .then((response) => response.text())
  .then((data) => { 
    monstersRef = Papa.parse(data, config).data;
    // Filter out empty rows
    monstersRef = monstersRef.filter(({ keyword }) => keyword != null);
});

const promise3 = fetch('Data/actions.csv')
  .then((response) => response.text())
  .then((data) => { 
    actionsRef = Papa.parse(data, config).data;
    // Filter out empty rows
    actionsRef = actionsRef.filter(({ keyword }) => keyword != null);
});

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
            displayLocation(currentRegion, currentArea, currentLocation);
    }
    // No save game, so start a new game
    else {

        if (showDebugLog) console.log("Save game doesn't exist");        
        
        // Using JSON to create deep newButtons of our starting data arrays
        formatData();

        experience = 0;
        insight = 0;
        hpCurrent = 140;
        hpMax = 140;
        gold = 2;
        ore = 0;
        leather = 0;
        greenHerb = 0;

        // Base stats are the players raw stats
        basePower = 0;
        baseStamina = 3;        
        baseDefence = 0;
        baseEvasion = 20;
                      
        currentStamina = maxStamina;

        updateStats();            

        inventory = [];
        inventory.push("straight_sword","green_cloak","worn_shield");
        
        currentRegion = regions[0];    

        titleOpen = false;
        narrationOpen = false;
        npcActive = false;
        currentNPC = -1;
            
        corpseLocation = null;

        
        const _startRegion = getObjectFromKeyword(startRegionKeyword, regions);
        const _startArea = getObjectFromKeyword(startAreaKeyword, _startRegion.areas);
        const _startLocation = getLocationFromArea(startCoordinates, _startArea);
        
        currentRegion = _startRegion;
        currentArea = _startArea;
        currentLocation = _startLocation;
        respawnLocation = { regionKeyword: startRegionKeyword, areaKeyword: startAreaKeyword, locationCoordinates: _startLocation };
        save();
    
        displayLocation(_startRegion, _startArea, _startLocation);
    }
}

// General purpose function when we want to display a location
// newLocation can be an integer or a keyword value
// Area = keyword title i.e. "bramble_path"
// Location = coordinate pair i.e. [1,5]
function displayLocation(region, area, location) {    
    
    // This should only happen once
    if (!mapInitialize)
        initalizeMap();

    if (showDebugLog) console.log("displayLocation -  Area: " + area + "    Location: " + JSON.stringify(location));

    // Check whether we are entering into a door location
    if (compareAreas(area, currentArea) && location.door != null) {

        const _otherDoorRegion = getObjectFromKeyword(location.door.regionKeyword, regions);
        const _otherDoorArea = getObjectFromKeyword(location.door.areaKeyword, _otherDoorRegion.areas);
        const _otherDoorLocation = getLocationFromArea(location.door.coordinates, _otherDoorArea);
        // Players don't arrive in the door location, they are automatically pushed into an adjacent location
        const _otherDoorExit = getExitFromLocation(_otherDoorLocation, _otherDoorArea)
        console.log("door exit:");
        console.log(_otherDoorExit);
        displayLocation(_otherDoorRegion, _otherDoorArea, _otherDoorExit);
        return;
    }

    currentRegion = region;
    const _regionVisited = region.visited;              // Store whether this is the first time visiting this region
    currentRegion.visited = true;

    currentArea = area;
    const _areaVisited = currentArea.visited;           // Store whether this is the first time visiting this area
    if (_regionVisited) currentArea.visited = true;     // We only set this to true if we've already displayed this region before, if it's the first time displaying the region, we'll do the title sequence and then loop back here at which point we'll displaying anything specific to the area we arrive in
            
    currentLocation = location;
    currentLocation.visited = true;
    currentLocation.seen = true;
    
    mapGridContainer.style.display = "flex";
    updateMap();

    save();
    resetUpdateText();    
    currentActiveButton = null;
    narrationText.style.display = "none";
    updateText.style.display = "none";    
    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
    saleTitle.style.display = "none";
        

    // Check if we are entering a region we've never visited before
    if (!_regionVisited) {
        displayTitle();
        return;
    }

    // First time visiting this location, check whether there is a narration to play first
    if (!_areaVisited) {
                
        // Check whether this location has a narration keyword
        if (currentArea.narration != undefined && currentArea.narration != "") {
            
            // Check if the matching narration to this keyword has already been seen                
            if (narrations[getElementFromKeyword(currentArea.narration, narrationsRef)] != undefined && !narrations[getElementFromKeyword(currentArea.narration, narrationsRef)].seen) {

                displayNarration(currentArea.narration);
                return;
            }
        }

        // Check if there is narration text, then show it as this is the first time visiting
        if (currentArea.update != undefined && currentArea.update != "") {
            narrationText.style.display = "block";
            narrationText.innerText = currentArea.update;  // Add the narration text so it appears before the main text for the locat                
        }
    }

    mainTitle.classList = "";        
    mainTitleText.classList = "";
    secondaryTitle.style.display = "none";
    
    mainTitleText.innerText = currentArea.title;        
    mainText.innerText = currentArea.description;             

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

    let _contextualActions = [];         // Will be dynamically populated with actions depending on the game state
    let _items = [];
    let _monsters = [];
    let _npcs = [];

    let lastButtonConfigured = null;          // We will store each button we configure as this, so that when we reach the right point, we can add special formatting to it
    
    // If we have a savedActiveMonster, that means we have just opened the button for a monster and we want to see the actions specific to that button
    if (activeMonster != null) {
        
        inventory.forEach((element,index) => {
            
            let item = items[getIndexFromKeyword(element, objectType.item)];
            if (item.canEquip && item.equipped) {
                
                if (item.actions.length > 0) {
                    
                    item.actions.forEach((element, index) => {

                        _contextualActions.push(actionsRef[getElementFromKeyword(element, actionsRef)]);
                    });            
                }
            }
        });        
    }
    else if (narrationOpen) {

        _contextualActions.push({
            keyword: "next",
            title: "Next",
            active: true,
            staminaCost: -1,
            location: "",
            func: "continueNarration"
        });
    }
    else if (titleOpen) {

        _contextualActions.push({
            keyword: "continue",
            title: "Continue",
            active: true,
            staminaCost: -1,            
            location: "",
            func: "closeTitle"
        });
    }
    else if (npcActive) {
       
        _contextualActions = JSON.parse(JSON.stringify(npcs[currentNPC].actions));

        // Add the default actions for all NPCs
        if (npcs[currentNPC].dialogueAvailable != null) {
            _contextualActions.push({
                keyword: "talk",
                title: "Talk",
                active: true,
                staminaCost: -1,
                location: "",
                func: "talk"
            });
        }
        _contextualActions.push({
            keyword: "leave",
            title: "Leave",
            active: true,
            staminaCost: -1,
            location: "",
            func: "closeNPC"
        });

        _items = npcs[currentNPC].items;
    }
    
    // If theres nothing special going on, we show the default actions for a location which are the exits
    if (!narrationOpen && !titleOpen && !trainMenuOpen && !npcActive) {
  
        // If activeMonster = true, that means we already know a monster is present because the player toggled the button
        // If thats not true, we need to check the room whether there is on present or not
        if (!activeMonster) {

            // Check if there are monsters present in this location, if so we don't display exits, only the option to run
            if (currentLocation.monsters != null && currentLocation.monsters != "" && currentLocation.monsters.length > 0) {
                
                _contextualActions.push({
                    keyword: "run",                                    
                    title: "Run away",                
                    active: true,
                    staminaCost: 1,
                    location: "",
                    func: "runAway",
                });
            }            
        }
        
        _items = currentLocation.items;
        _monsters = currentLocation.monsters;
        _npcs = currentLocation.npcs;                
    }         

    // UPGRADE MENU
    // If we are currently opening the upgrade menu, we need to cycle through everything in our inventory and get only upgradable items
    if (!narrationOpen && !inventoryOpen && !trainMenuOpen && upgradeMenuOpen) {

        _contextualActions = [];
        _contextualActions.push({            
            keyword: "back",
            title: "Back",
            active: true,
            staminaCost: -1,
            location: "",
            func: "exitUpgrade"
            });

        _items = [];
        inventory.forEach((element, index) => {

            if (items[getIndexFromKeyword(element, objectType.item)].canUpgrade)
                _items.push(element);
        });
    }

    // INVENTORY
    // In the inventory - we inject special items that represent our resources, but only if we have any of that resource
    if (inventoryOpen) {
        
        // We make a deep copy of our inventory to inject these resource items into only while we are viewing the inventory
        _items = JSON.parse(JSON.stringify(inventory));
        if (ore > 0) { items[getIndexFromKeyword("ore", objectType.item)].quantity = ore; _items.splice(0,0, "ore"); }
        if (leather > 0) { items[getIndexFromKeyword("leather", objectType.item)].quantity = ore; _items.splice(0,0, "leather"); }
        if (greenHerb > 0) { items[getIndexFromKeyword("green_herb", objectType.item)].quantity = greenHerb; _items.splice(0,0, "green_herb"); }            
    }    
    if (_items != undefined && _items.length > 0 && _items != "") {
                
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
        _items.forEach((element,index) => {
            
            let item = items[getIndexFromKeyword(element, objectType.item)];                        

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
                    document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);

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
                        // else if (item.itemType != undefined && item.itemType === "pickupHeal")
                        //     newButton.secondaryButton.onclick = function() {  addHealth(item.quantity, "You eat the health item."); removeItemFromLocation(item.keyword, _currentLocation); playClick(); };
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
                                currentLocation.items.splice(currentLocation.items.indexOf(item.keyword), 1);
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

                    document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);
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

        if (_monsters != undefined && _monsters.length > 0 && _monsters != "") {
            
            _monsters.forEach((monster, index) => {
                
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

                document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);

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
        if (_npcs != undefined && _npcs.length > 0 && _npcs != "") {
            
            _npcs.forEach((element, index) => {

                const npc = npcs[getIndexFromKeyword(element, objectType.npc)];                

                const newButton = createButton(npc.keyword, objectType.npc);
                createdButtons.push(newButton);
                lastButtonConfigured = newButton.button;
                newButton.button.classList = "nav-button npc-button can-hover";                

                // ITEM NAME
                newButton.buttonText.innerText = npc.title;                
                
                document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);                                                                
                newButton.button.onclick = function() { displayNPC(getIndexFromKeyword(element, objectType.npc)); playClick(); };                                                                                
            });
        }

        // CONTEXTUAL ACTIONS
        // Add in the rest of context specific actions (i.e. Buttons for leaving the location etc.)
        
        // We will store action buttons as we create them so we can animate them appearing
        let createdActionButtons = [];
        
        if (_contextualActions.length > 0) {        

            if (lastButtonConfigured != null)
                lastButtonConfigured.classList += " spacer";         // Before we create the rest of the buttons, we add some spacing in the list to separate the two categories of buttons

            _contextualActions.forEach((element, index) => {
                
                let additionalButtonString = "";        // If any additional text needs to be appended to a button                                
                let action = element;

                const newButton = createButton(action.keyword, objectType.action);
                newButton.button.style.display = "none";
                createdButtons.push(newButton);
                createdActionButtons.push(newButton);

                // ITEM NAME                            
                document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);                                                                
                
                let buttonActive = true;

                if (action.active) {                

                    // Check for Stamina cost, this could modify the button to not be in an active state
                    if (action.staminaCost > 0) {
                        
                        newButton.button.querySelector('.stamina-cost-section').style.display = "flex";                        
                        //newButton.button.querySelector('.stamina-cost-icon').classList = 

                        let classString = "";

                        // Here we determine a string based on the stamina cost and the players current stamina. The icon is set in css based on this string
                        switch (action.staminaCost) {
                            case 0:
                                classString = "";
                                break;
                            case 1:
                                if (currentStamina === 0)
                                    classString = "one-zero";
                                else if (currentStamina >= 1)
                                    classString = "one-one";                                
                                break;
                            case 2:
                                if (currentStamina === 0)
                                    classString = "two-zero";
                                else if (currentStamina === 1)
                                    classString = "two-one";
                                else if (currentStamina >= 2)
                                    classString = "two-two";
                                break;
                            case 3:
                                if (currentStamina === 0)
                                    classString = "three-zero";
                                else if (currentStamina === 1)
                                    classString = "three-one";
                                else if (currentStamina === 2)
                                    classString = "three-two";
                                else if (currentStamina >= 3)
                                    classString = "three-three";
                                break;
                        }

                        newButton.button.querySelector('.stamina-cost-icon').classList = "stamina-cost-icon " + classString;

                        if (action.staminaCost > currentStamina) {                        
                            buttonActive = false;                            
                        }                        
                    }

                    // Check for talk actions as they have a specific parameter that could make it inactive
                    if (action.func === "talk") {

                        if (!npcs[currentNPC].dialogueAvailable)
                            buttonActive = false;                        
                    }                    
    
                    if (buttonActive) {
                        
                        newButton.button.classList = "nav-button action-button can-hover";
                        
                        // If this is a loction action
                        if (action.location != null && action.location != "") {

                            newButton.button.onclick = function() { 
                                //displayLocation(action.location, objectType.location);                                
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
            document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);        
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
            document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);        
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
            document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);        
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
            document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);        
            newButton.button.classList = "nav-button action-button can-hover";
            newButton.buttonText.innerText = "Exit";
            newButton.button.onclick = function() {trainMenuOpen = false; displayLocation(currentRegion, currentArea, currentLocation);};
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
    let monsterPresent = false;
    if (currentLocation.monsters != undefined) monsterPresent = currentLocation.monsters.length > 0;
    
    if (currentArea.locations.length > 0) {

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
        currentArea.locations.forEach((location, index) => {

            let isAdjacentToCurrent = false;

            // Get the corresponding nodeObject for the location listed
            const nodeObject = mapGrid[location.coordinates[0]][location.coordinates[1]];

            // Check this node has a line in this direction (If there is no line, it means we are at the edge of the grid)
            if (nodeObject.north != null) {                
                
                // Check there is a location at the coordinate in this direction from our current location
                if (getLocationInDirection(location.coordinates, currentArea, "north") != null) {
                    
                    // Check that there is a path between these two locations
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "north"))) {
                        
                        // Check whether the square in this direction is the player's current location, in which case store that information
                        if (compareArrays(getLocationInDirection(location.coordinates, currentArea, "north").coordinates, currentLocation.coordinates)) {  // Is the location adjacent to us the player's current location?                                                
                            isAdjacentToCurrent = true;
                            location.seen = true;       // Since this is adjacent to the players current location, we have now seen it

                            activeDirections.push(3);   // That means the players current location is to the north of us, so we add "south" as an active direction
                        }

                        // Check whether the current location and the other square in this direction have been seen, then make sure there is a path between them
                        if (location.seen && getLocationInDirection(location.coordinates, currentArea, "north").seen)                            
                            // If so, show the line between these two
                            nodeObject.north.classList = "horizontal-square inactive";               
                    } 
                }
            }
            if (nodeObject.west != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "west") != null) {                
                    
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "west"))) {

                        if (compareArrays(getLocationInDirection(location.coordinates, currentArea, "west").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(2); // That means the players current location is to the west of us, so we add "east" as an active direction
                        }

                        if (location.seen && getLocationInDirection(location.coordinates, currentArea, "west").seen)
                            nodeObject.west.classList = "vertical-square inactive";
                    }
                }
            }
            if (nodeObject.east != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "east") != null) {
                
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "east"))) {

                        if (compareArrays(getLocationInDirection(location.coordinates, currentArea, "east").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(1); // That means the players current location is to the east of us, so we add "west" as an active direction
                        }

                        if (location.seen && getLocationInDirection(location.coordinates, currentArea, "east").seen)
                            nodeObject.east.classList = "vertical-square inactive";
                    }
                }
            }
            if (nodeObject.south != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "south") != null) {
                
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "south"))) {

                        if (compareArrays(getLocationInDirection(location.coordinates, currentArea, "south").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;
                            location.seen = true;

                            activeDirections.push(0); // That means the players current location is to the south of us, so we add "north" as an active direction
                        }

                        if (location.seen && getLocationInDirection(location.coordinates, currentArea, "south").seen)
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
                    displayLocation(currentRegion, currentArea, location);                                
                    playClick();
                    recoverStamina(); 
                };
            }

            if (location.door != null) {
                nodeObject.element.classList += " door";
            }

        });

        // Insert player symbol in current location        
        const currentLocationNode = mapGrid[currentLocation.coordinates[0]][currentLocation.coordinates[1]];

        // Check if there are monsters present
        if (monsterPresent) {

            currentLocationNode.element.classList = "main-square current-hostile"

            // We hide all lines coming from current square
            if (currentLocation.north != null)                             
                currentLocationNode.north.classList = "horizontal-square";
            if (currentLocation.west != null)                                        
                currentLocationNode.west.classList = "vertical-square";
            if (currentLocation.east != null)                                        
                currentLocationNode.east.classList = "vertical-square";
            if (currentLocation.south != null)                                        
                currentLocationNode.south.classList = "horizontal-square";
        }
        else {
            currentLocationNode.element.classList = "main-square current"        

            // Highlight all lines leading away from the current node, double check with active directions as this direction might be blocked            
            if (currentLocation.north != null && activeDirections.includes(0))
                if (getLocationInDirection(currentLocation.coordinates, currentArea, "north") != null)
                    currentLocationNode.north.classList = "horizontal-square active";

            if (currentLocation.west != null && activeDirections.includes(1))
                if (getLocationInDirection(currentLocation.coordinates, currentArea, "west") != null)
                    currentLocationNode.west.classList = "vertical-square active";

            if (currentLocation.east != null && activeDirections.includes(2))                        
                if (getLocationInDirection(currentLocation.coordinates, currentArea, "east") != null)
                    currentLocationNode.east.classList = "vertical-square active";

            if (currentLocation.south != null && activeDirections.includes(3))                        
                if (getLocationInDirection(currentLocation.coordinates, currentArea, "south") != null)
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
    
    if (checkForMonster && currentLocation.monsters.length > 0) {
        console.log("go - Monster is present");
        return;
    }

    let dir = "";

    // This function only works while in a location context
    if (!npcActive || narrationOpen) {
        
        if (direction != 4 && activeDirections.indexOf(direction) === -1) { if (showDebugLog) console.log("go - [" + direction + "] is not an active direction."); return; }
        
        switch (direction) {
            case 0:
                displayLocation(currentRegion, currentArea, getLocationInDirection(currentLocation.coordinates, currentArea, "north"));                
                break;
            case 1:
                displayLocation(currentRegion, currentArea, getLocationInDirection(currentLocation.coordinates, currentArea, "west"));
                break;
            case 2:
                displayLocation(currentRegion, currentArea, getLocationInDirection(currentLocation.coordinates, currentArea, "east"));
                break;
            case 3:                
                displayLocation(currentRegion, currentArea, getLocationInDirection(currentLocation.coordinates, currentArea, "south"));
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

        mainTitleText.innerText = currentArea.title;
        mainTitleText.classList = "secondary";        
        secondaryTitle.style.display = "flex";
        
        secondaryTitleIcon.classList = "npc";
        secondaryTitleIcon.innerText = "";
        secondaryTitleText.innerText = npcs[index].title;
        mainText.innerText = npcs[index].description;

        // Some contexts have update text that should display when the player enters their context
        if (npcs[index].update != undefined && npcs[index].update != "")
            addUpdateText(npcs[index].update);

        mapGridContainer.style.display = "none";

        updateButtons(false);
}

function closeNPC() {

    npcActive = false;
    currentNPC = -1;
    displayLocation(currentRegion, currentArea, currentLocation);
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
    
    if (narrations[getElementFromKeyword(currentNarration, narrations)].text.length > currentNarrationIndex) {    
        mainText.innerText = narrations[getElementFromKeyword(currentNarration, narrations)].text[currentNarrationIndex];
    }
    else
        console.error("displayNarrative - Narration index [" + currentNarrationIndex + "] is higher than text length [" + narrations[getElementFromKeyword(currentNarration, narrations)].text.length + "]");
}

function continueNarration() {

    if (showDebugLog) console.log("continueNarration() - ");

    currentNarrationIndex++;

    if (narrations[getElementFromKeyword(currentNarration, narrations)].text.length > currentNarrationIndex)
        mainText.innerText = narrations[getElementFromKeyword(currentNarration, narrations)].text[currentNarrationIndex];
    else {
        narrations[getElementFromKeyword(currentNarration, narrations)].seen = true;
        closeNarration();
    }
}

function closeNarration() {

    narrationOpen = false;
    displayLocation(currentRegion, currentArea, currentLocation);
}

function displayTitle() {
    
    if (showDebugLog) console.log("displayTitle() - ");
    
    mapGridContainer.style.display = "none";

    titleOpen = true;
    updateButtons(false);
    
    saleTitle.style.display = "none";
    narrationText.style.display = "none";        
    mainTitle.classList = "centered";
    mainTitleText.classList = "";
    mainTitleText.innerText = currentRegion.title;
    secondaryTitle.style.display = "none";
    mainText.innerText = currentRegion.description;
}

function closeTitle() {

    titleOpen = false;
    displayLocation(currentRegion, currentArea, currentLocation);
}

function displayInventory() {
    
    if (showDebugLog) console.log("displayInventory() - ");

    inventoryOpen = true;

    inventoryIcon.classList = "close-inventory";    
    inventoryIcon.onclick = function() { exitInventory(); playClick(); };

    mapGridContainer.style.display = "none";

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
    displayLocation(currentRegion, currentArea, currentLocation);
    if (upgradeMenuOpen)
        displayUpgrade();
    if (narrationOpen)
        displayNarration();
}

function clearInventory() {

    inventoryIcon.classList = "open-inventory";
    inventoryIcon.onclick = function() { displayInventory(); playClick(); };        

    inventoryTitle.style.display = "none";
    equipmentTitle.style.display = "none";
}

function displayUpgrade() {

    mapGridContainer.style.display = "none";

    upgradeMenuOpen = true;
    updateButtons(false);    

    narrationText.style.display = "none";        
         
    mainText.innerText = "Not all weapons can become the stuff of legends, but given the right materials any weapon might become functional.";

    saleTitle.style.display = "none";
}

function exitUpgrade() {

    upgradeMenuOpen = false;
    displayLocation(currentRegion, currentArea, currentLocation);
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
            items[curseMarkIndex].power += 5;
            break;        
    }

    updateStats();
    save();
    displayTrain();
}

// Update the header with current stat values
function updateStats() {
    
    calculateStats();
    
    let XPCurrentPercent = experience / 1000;        
    playerXPBar.style.width = (XPCurrentPercent * 625 + 2)  + 'px';

    playerHPText.innerText = hpCurrent + "/" + hpMax;
    let HPCurrentPercent = hpCurrent / hpMax;        
    playerHPBar.style.width = (HPCurrentPercent * 250 + 2)  + 'px';

    createdStaminaIcons.forEach((element) => {        
        element.remove();
    });
    createdStaminaIcons = [];

    for (let index = 0; index < maxStamina; index++) {
        
        const clone = staminaIconMaster.cloneNode(true);
        staminaSection.appendChild(clone);
        createdStaminaIcons.push(clone);

        if (index < currentStamina)
            clone.classList = "player-stamina-icon fill"
        else
            clone.classList = "player-stamina-icon empty"
    }
}

// Calculates stats that are based on multiple factors
function calculateStats() {

    power = basePower;
    maxStamina = baseStamina;
    defence = baseDefence;
    evasion = baseEvasion;

    inventory.forEach((element) => {
        
        let index = getIndexFromKeyword(element, objectType.item);

        if (items[index].equipped) {
            power += items[index].power;
            maxStamina += items[index].stamina;
            defence += items[index].defence;
        }
    });
}

function updateMonsterUI(monsterButton) {
    
    let monster = currentLocation.monsters[getElementFromKeyword(monsterButton.keyword, currentLocation.monsters)];

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

function removeItemFromLocation(itemKeyword, location) {    

    console.log("remove item: " + itemKeyword);
    
    location.items = location.items.filter(item => item !== itemKeyword);    
    
    save();

    if (location === currentLocation)
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
          
    let monsters = currentLocation.monsters;    

    let playerDead = false;
    if (monsters.length > 0 && monsters != "") {

        monsters.forEach((monster, index) => {

            if (currentLocation != -99)      // Check in case a previous monster already killed us
                playerDead = triggerEnemyAttack(monster);
        });            
    }    

    if (playerDead) return;

    recoverMax(false);
    updateStats();
    save();        
    updateButtons(true);    
}

function triggerEnemyAttack(monster) {

    let monstersActionString = "";      

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
    let monsters = currentLocation.monsters;
    
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
    updateButtons(true);

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
    if (corpseLocation != null && corpseLocation.items != null && corpseLocation.items != "" && corpseLocation.items.includes("corpse")) {

        removeItemFromLocation("corpse", corpseLocation);
    }
    

    let funcString = "getCorpse|" + gold + "|You recover what gold you can from the corpse"
    // Set the quantity of the corpse item to the amount of gold we are holding
    items[getIndexFromKeyword("corpse", objectType.item)].quantity = gold;
    // Remove all our gold
    gold = 0;
    updateStats();

    corpseLocation = currentLocation;    
        
    corpseLocation.items.push("corpse");

    mapGridContainer.style.display = "none";
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
    document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);                                                                
    newButton.button.onclick = function() { respawn();};        
    currentLocation = -99;   // Save 'dead' state
    save();
}

function respawn() {    

    if (respawnLocation != null) {

        hpCurrent = hpMax;
        currentStamina = maxStamina;

        // Monsters all heal when you rest
        healAllMonsters();

        updateStats();

        _respawnRegion = getObjectFromKeyword(respawnLocation.areaKeyword);
        _respawnArea = getObjectFromKeyword(respawnLocation.areaKeyword, _respawnRegion);
        _respawnLocation = getLocationFromArea(respawnLocation.locationCoordinates, _respawnArea);

        displayLocation(_respawnRegion, _respawnArea, _respawnLocation); 
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
        
        let monster = currentLocation.monsters[getElementFromKeyword(currentActiveButton.keyword, currentLocation.monsters)];
        
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
    
    let monster = currentLocation.monsters[getElementFromKeyword(currentActiveButton.keyword, currentLocation.monsters)];
    
    // Remove this monster from the current location    
    currentLocation.monsters.splice(currentLocation.monsters.indexOf(monster.keyword),1);

    const monsterExperience = getRandomInt(monster.experienceMin, monster.experienceMax);

    let storedMonsterString = "The " + monster.shortTitle + " falls dead at your feet\nYou receive " + monsterExperience + " experience and " +  monster.gold + " gold";

    experience += monsterExperience;
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

        let dialogueString = npcs[currentNPC].keyword + "_" + npcs[currentNPC].currentDialogue;
        
        displayNarration(dialogueString);
        npcs[currentNPC].dialogueAvailable = false;
    }
    else
        console.error("talk - Somehow this was called but the current context is not an NPC")
}

function rest() {

    if (showDebugLog) console.log("rest() - ");

    hpCurrent = hpMax;
    addUpdateText("You kneel for a moment and say a prayer to the Quiet. You feel your soul anchored to this place.\n\nYou lay down on your bedroll and before you know it sleep takes you.");

    // Monsters all heal when you rest
    healAllMonsters();

    respawnLocation = {
        regionKeyword: currentRegion.keyword,
        areaKeyword: currentArea.keyword,
        locationCoordinates: currentLocation.coordinates
    }

    save();
    updateStats();
}

function advanceDialogue(npcName) {
    
    npcs.forEach((element, index) => {

        if (element.keyword == npcName) {
            element.currentDialogue++;

            if (element.dialogue.length > element.currentDialogue) {
                element.dialogueAvailable = true;
            }
        }
    });
}

function addToInventory(keyword) {
    
    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {

        if (keyword === "") {

            if (showDebugLog) console.log("addToInventory() - keyword is empty");
            return;
        }

        let item = items[getIndexFromKeyword(keyword, objectType.item)];
        if (item === undefined) {
            console.error("addToInventory() - keyword:" + keyword + " not found in items array");
            return;
        }

        inventory.push(keyword);
                
        let _items = [];

        // Depending on the contextType, we will splice this item out of a different context
        if (!npcActive) {        
            _items = currentLocation.items;
        }    
        else if (npcActive) {        
            _items = npcs[currentNPC].items;
        }
        
        // Find and remove the item from the item list that it was contained in
        let itemIndex = -1;
        _items.forEach((element, index) => {

            if (element === keyword) {
                itemIndex = index;
            }
        });
        if (itemIndex != -1) _items.splice(itemIndex, 1);

        updateButtons(true);

        save();
        addUpdateText("The " + item.shortTitle + " has been added to your inventory.");
        spendStamina(1);
    }, 1);
}

function buy(keyword, cost) {

    let item = items[getIndexFromKeyword(keyword, objectType.item)];
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

    let item = items[getIndexFromKeyword(keyword, objectType.item)];
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

    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {

        gold += amount;
        if (updateString != "") 
            addUpdateText(updateString + " ( " + amount + " gold )");    

        updateStats();
        save();
        spendStamina(1);
    }, 1);
}

function getCorpse(amount, updateString) {
    
    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {

        gold += amount;
        if (updateString != "") 
            addUpdateText(updateString + " ( " + amount + " gold )");    

        removeItemFromLocation("corpse", currentLocation);
        corpseLocation = null;

        updateStats();
        save();
        spendStamina(1);
    }, 1);
}

function addInsight(amount, updateString) {

    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {

        insight += amount;
        if (updateString != "") 
            addUpdateText(updateString + " ( " + amount + " insight )");    

        updateStats();
        save();
        spendStamina(1);
    }, 1);
}

function addHealth(amount, updateString) {

    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {
            
        hpCurrent += amount;
        if (hpCurrent > hpMax)
            hpCurrent = hpMax;
        if (updateString != "") 
            addUpdateText(updateString + " ( " + amount + " health )");    

        updateStats();
        save();
        spendStamina(1);
    }, 1);
}

function addGreenHerb(amount, updateString) {

    // Set a very small timeout in order to make sure this function waits until whatever was happening when it was called happens first
    setTimeout(function() {
            
        greenHerb += amount;

        if (updateString != "") 
            addUpdateText(updateString + " ( " + amount + " Green Herb )");    

        updateStats();
        save();
        spendStamina(1);
    }, 1);
}

function toggleEquipped(keyword) {
    
    // Double check to make sure this is in our inventory
    if (inventoryIndexOf(keyword) != -1) {

        let item = items[getIndexFromKeyword(keyword, objectType.item)];
        
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

function healAllMonsters() {

    for (const region of regions) {
        for (const area of region.areas) {
            for (const location of area.locations) {            
                // Check this location has monsters listed
                if (location.monsters != null) {
                    for (const monster of location.monsters) {            
                        monster.hpCurrent = monster.hpMax;
                    }                
                }
            }
        }
    }
}

// #endregion

// #region UTILITIES

function save() {

    if (showDebugLog) console.log("save");
    localStorage.setItem('saveExists', "!");        // Used to test whether there is a save
    localStorage.setItem('version', JSON.stringify(version));

    localStorage.setItem('experience', JSON.stringify(experience));
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

    localStorage.setItem('regions', JSON.stringify(regions));    
    localStorage.setItem('npcs', JSON.stringify(npcs));
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('narrations', JSON.stringify(narrations));

    // Saving variables that are object references
    localStorage.setItem('currentRegionKeyword', JSON.stringify(currentRegion.keyword));
    localStorage.setItem('currentAreaKeyword', JSON.stringify(currentArea.keyword));
    localStorage.setItem('currentLocationCoordinates', JSON.stringify(currentLocation.coordinates));
  }
  
function load() {

    if (showDebugLog) console.log("Load");

    currentLocation = JSON.parse(localStorage.getItem('currentLocation'));            
    experience = JSON.parse(localStorage.getItem('experience'));
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
        
        regions = JSON.parse(localStorage.getItem('regions'));        
        npcs = JSON.parse(localStorage.getItem('npcs'));
        items = JSON.parse(localStorage.getItem('items'));
        narrations = JSON.parse(localStorage.getItem('narrations'));
    }
    else {
        
        regions = JSON.parse(JSON.stringify(regionsRef));                   
        npcs = JSON.parse(JSON.stringify(npcsRef));
        items = JSON.parse(JSON.stringify(itemsRef));
        narrations = JSON.parse(JSON.stringify(narrationsRef));
    }

    // Loading variables that are just references for objects
    // We save the keywords instead, then get the object once all the data is loaded
    const currentRegionKeyword = JSON.parse(localStorage.getItem('currentRegionKeyword'));
    currentRegion = getObjectFromKeyword(currentRegionKeyword, regions);

    const currentAreaKeyword = JSON.parse(localStorage.getItem('currentAreaKeyword'));
    currentArea = getObjectFromKeyword(currentAreaKeyword, currentRegion.areas);

    const currentLocationCoordinates = JSON.parse(localStorage.getItem('currentLocationCoordinates'));
    currentLocation = getLocationFromArea(currentLocationCoordinates, currentArea);
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
        
        case objectType.item:
            ar = items;            
            break;
        case objectType.npc:
            ar = npcs;            
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

function getObjectFromKeyword(keyword, array) {

    if (array === undefined || array === null) console.error("getObjectFromKeyword() - keyword [" + keyword + "] No array provided");
    
    let obj = null;
    
    array.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            obj = element;            
        }
    });
        
    return obj;
}  

function getLocationFromCurrentArea(coordinates) {

    let loc = null;

    currentArea.locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, coordinates)) {
            
            loc = element;            
        }
    });

    return loc;
}

function getLocationFromArea(coordinates, area) {        

    let loc = null;

    area.locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, coordinates)) {
            
            loc = element;            
        }
    });

    return loc;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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
* @returns {boolean} True if areas are the same
*/
function compareAreas(area1, area2) {

    if (area1.keyword != area2.keyword)
        return false;
    if (area1.title != area2.title)
        return false;
    if (area1.description != area2.description)
        return false;

    return true;
}

  /**
 * Get the coordinates of a new cell in a 2D array given the current coordinates and a direction.
 * @param {number} x - The x-coordinate of the current cell.
 * @param {number} y - The y-coordinate of the current cell.
 * @param {string} direction - The direction to move ('up', 'down', 'left', 'right').
 * @returns {object} The coordinates of the new cell.
 */
function getLocationInDirection(coordinates, area, direction) {
  
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
  
  const newLocation = getLocationFromArea([newY,newX], area);  
  return newLocation;
}

/**
 * Return a location that this location exits to, should not have multiple exits
 * @param {object} location - Location object we want to find an exit from 
 * @returns {object} location object that can be moved to from the provided location
 */
function getExitFromLocation(location, area) {
    
    if (location.north != null)
        return getLocationInDirection(location.coordinates, area, "north");
    else if (location.west != null)
        return getLocationInDirection(location.coordinates, area, "west");
    else if (location.east != null)
        return getLocationInDirection(location.coordinates, area, "east");
    else if (location.south != null)
        return getLocationInDirection(location.coordinates, area, "south");

    console.error("getExitFromLocation() - Couldn't find exit");
    return null;
}

function locationsHavePath(locationA, locationB) {
    
    let locationABlockedDirections = [];
    let locationBBlockedDirections = [];

    // Check present items for anything blocking exits    
    let _items = locationA.items;
    
    if (_items != undefined && _items.length > 0 && _items != "") {
    
        _items.forEach((element,index) => {
            
            let item = items[getIndexFromKeyword(element, objectType.item)];
            
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
            
            let item = items[getIndexFromKeyword(element, objectType.item)];
            
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

    regions = JSON.parse(JSON.stringify(regionsRef));    
    npcs = JSON.parse(JSON.stringify(npcsRef));      
    narrations = JSON.parse(JSON.stringify(narrationsRef));

    items = JSON.parse(JSON.stringify(itemsRef));

    items.forEach((element,index) => {
        
        element.upgradeMaterial != null ? element.upgradeMaterial = element.upgradeMaterial.split(',') : element.upgradeMaterial = [];
        element.actions != null ? element.actions = element.actions.split(',') : element.actions = [];        
    });
    
    // Take the references in each locations monster array, and spawn unique versions of those from MonsterRef            
    for (const region of regions) {
        for (const area of region.areas) {
            for (const location of area.locations) {

                const newMonsterArray = [];     // We will store references to all newly created monsters and overwrite the key word array that is created before runtime
                // Check this location has monsters listed
                if (location.monsters != null) {
                    for (const monster of location.monsters) {

                        // Create a duplicated of the original referenced monster in our monsters array which will serve as our runtime data for this monster
                        let newMonster = JSON.parse(JSON.stringify( monstersRef[getElementFromKeyword(monster, monstersRef)]))
                        newMonsterArray.push(newMonster);
                    }
                }

                location.monsters = newMonsterArray;            
            }
        }
    }
}

  async function loadData() {

    try {

        const response = await fetch('Data/regions.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contents = await response.text();
        regionsRef = JSON.parse(contents);
        
        console.log('File has been loaded successfully.');

    } catch (error) {
        console.error('Error loading file:', error);
    }
}

  // #endregion