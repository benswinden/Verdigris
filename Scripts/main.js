
import { npcsRef } from "../Data/npcs.js";
import { narrationsRef } from "../Data/narrations.js";
import {    objectType,
            getIndexFromKeyword,            
            getObjectFromKeyword,
            getLocationFromCurrentArea,
            getLocationFromArea,
            getRandomInt,
            playClick,            
            compareArrays,
            compareObjects,
            compareAreas,
            getLocationInDirection,
            getExitFromLocation,
            locationsHavePath,
            deepCopyWithFunctions            
         } from "./Util.js";

const VERDIGRIS = (function() {

    // #region VARIABLES

    let version = 0.062;

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

    let currentActiveButton;

    let currentNarration = "";
    let currentNarrationIndex = 0;
    let narrationOpen = false;
    let titleOpen = false;
    let npcActive = false;
    let currentNPC = -1;

    let combatActive = false;

        // Character Creation
    let currentDisplayedHistoryIndex = 0;
    let characterCreationCarouselDots = [];
    let selectedHistory;

    let activeDirections = [];      // Array that contains which directions (0=north, 1=west, 2=east, 3=south ) have active buttons currently

    let inventory = [];             // Inventory contains index numbers for items in the items array
    let inventoryOpen = false;
    let upgradeMenuOpen = false;
    let trainMenuOpen = false;

    let abilityButtons = null;
    let assignedAbilityKeywords = null;     // Here we save the abilities we've assigned to buttons in an array of strings that can be saved and reloaded
    let currentActiveAbilityObject = null;        // When the player toggles an ability button and is waiting to target something with that ability
    
    let initializedMonsterCards = null;

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

    let startRegionKeyword = "blightfold_maze";
    let startAreaKeyword = "bramble_path";
    let startCoordinates = [3,8];
    let debugWindowActive = false;

    const screenBlocker = document.querySelector('#fullscreen-blocker');

    // Title Screen
    const titleContent = document.querySelector('#title-content');
    const titleScreenContainer = document.querySelector('#title-screen-container');
    const newGameButton = document.querySelector('#new-game-text');
    const continueButton = document.querySelector('#continue-text');
    // Character Creation
    const characterCreationContainer = document.querySelector('#character-creation-container');
    const characterCreationTitle = document.querySelector('#history-title-text');
    const characterCreationDescription = document.querySelector('#history-description-text');
    const characterCreationSelectButton = document.querySelector('#history-select-button');
    const characterCreationCarousel = document.querySelector('#history-select-carousel-container');


    // Main Content
    const gameContent = document.querySelector('#game-content');

    // Header
    const header = document.querySelector('header');
    const abilityButtonContainer = document.querySelector('#ability-button-container');
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
    const mainTextSection =  document.querySelector('#main-text-section');
    const mainText =  document.querySelector('#main-text');
    const narrationText =  document.querySelector('#narration-text');
    const updateText =  document.querySelector('#update-text');
    const mapGridContainer = document.querySelector("#map-grid-container");

    const combatContainer = document.querySelector("#combat-container");
    const monsterCardContainer = document.querySelector("#monster-section-container");

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

    // These are our data arrays that contain the data for the game
    let regionsRef = [];
    let monstersRef = [];       // Reference for unique monsters, these will be duplicated for each location at runtime. References to the actual monster data will be within each location
    let itemsRef = [];    

    // These are containers, mostly copies of our reference data which will be modified at runtime
    let regions = [];
    let npcs = [];
    let items = [];
    let narrations = [];
    let actions = [];

    var PapaParseconfig = 
    {    
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    }


    let histories = [
        {
            title: "Traveler",
            description: "A worn ranger come from a foreign land where the forests enveloped the earth and sky.\n\nAdept with quick blade and bow. Move silently among the brush and speak the language of beasts.",
            color: "gold",
            image: "Traveler"
        },
        {
            title: "Moon Witch",
            description: "Magicker come down from the Steppes. Carrying with them forgotten tales and chants of the sky's misfortunes and follies.\n\nGrant us great strength, grant us requiem from the peering eyes that burn.",
            color: "red",
            image: "MoonWitch"
        },        
        {
            title: "Knight Archivist",
            description: "Child of the Last Library and ardent defender of the gathered knowledge of Kings.\n\nZealously seek that which has long been hidden, though some secrets are best left buried.",
            color: "gray",
            image: "KnightArchivist"
        },
        {
            title: "Geomancer",
            description: "Only in true Quiet can one hear the rumbling murmurs of the deepest darkest depths.\n\nFeel the earth that binds, speak the language of the earthen silence and harness the power of the Unknowable Colossus.",
            color: "green",
            image: "Geomancer"
        },
        {
            title: "Heir Apparent",
            description: "Born to lead the Last Kingdom of men, but given no Prophecy, nor Crown, nor Shroud.\n\nOnly once its is written in the bones of the earth will Divine Right be given.",
            color: "purple",
            image: "HeirApparent"
        }
    ]




    //#endregion

    // #region GAME CORE

    // Once the window is loaded, we add listeners and check for data load before initializing the game
    document.addEventListener('DOMContentLoaded', function() {

            // Title Screen
        titleContent.style.display = "flex";
        gameContent.style.display = "none";

        newGameButton.onclick = newGame;
        continueButton.onclick = continueGame;


            // Main Game Content

        // Begin loading data that is contained in csv files
        const promise1 = fetch('Data/items.csv')
        .then((response) => response.text())
        .then((data) => { 
        itemsRef = Papa.parse(data, PapaParseconfig).data;
        // Filter out empty rows
        itemsRef = itemsRef.filter(({ keyword }) => keyword != null);
        });

        const promise2 = fetch('Data/monsters.csv')
        .then((response) => response.text())
        .then((data) => { 
        monstersRef = Papa.parse(data, PapaParseconfig).data;
        // Filter out empty rows
        monstersRef = monstersRef.filter(({ keyword }) => keyword != null);
        });

        inventoryIcon.onclick = displayInventory;

        document.addEventListener('keydown', function(event) {

            if (event.code == 'Escape') {
                toggleDebugWindow();
            }

            if (event.code == 'KeyI') {
                if (!inventoryOpen) {
                    displayInventory();
                }
                else if (inventoryOpen) {
                    exitInventory();
                }
            }

            if (event.code == 'KeyQ') {
                console.log("Debug - Q");
            }
            if (event.code == 'KeyW') { go(0, true); playClick(); }
            if (event.code == 'KeyA') { go(1, true); playClick(); }
            if (event.code == 'KeyD') { go(2, true); playClick(); }
            if (event.code == 'KeyS') { go(3, true); playClick(); }
            if (event.code == 'Enter') { go(4, true); playClick(); }
            if (event.code == 'Digit1') { activateAbility(0); }
            if (event.code == 'Digit2') { activateAbility(1); }
            if (event.code == 'Digit3') { activateAbility(2); }
            if (event.code == 'Digit4') { activateAbility(3); }
            if (event.code == 'Digit5') { activateAbility(4); }
            if (event.code == 'Digit6') { activateAbility(5); }
        });

        inventoryIcon.onmouseover = (event) => { playClick(); };


        // DEBUG
        debugButton1.onclick = function() { console.log("Debug: Reset Game"); resetGame(); toggleDebugWindow(); };
        debugButton2.onclick = function() { console.log("Debug: Reset & Resume " + storedLocation); let x = currentContext; let y = currentContextType; let z = storedLocation; resetGame(); storedLocation = z;  changeContext(x,y); toggleDebugWindow();};  
        debugButton2b.onclick = function() { console.log("Debug: Kill Monster"); if (currentContextType == 3) monsterDeath();  toggleDebugWindow();}
        debugButton2c.onclick = function() { console.log("Debug: Die"); playerDeath(); }
        debugButton3.onclick = function() { insight++; save(); updateStats();};
        debugButton4.onclick = function() { hp++; save(); updateStats();};
        debugButton5.onclick = function() { gold++; save(); updateStats();};
        debugButton6.onclick = function() { currentStamina++; save(); updateStats();};
        debugButton7.onclick = function() { currentStamina--; save(); updateStats();};

        if (localStorage.getItem('resetLocations')) {
            resetLocations = JSON.parse(localStorage.getItem('resetLocations'));
        }

        if (resetLocations)
            resetLocationsCheckbox.checked = true;
        else
            resetLocationsCheckbox.checked = false;


        resetLocationsCheckbox.onclick = function() {

            if (resetLocationsCheckbox.checked == true){
                resetLocations = true;
            }
            else {
                resetLocations = false;
            }
            
            localStorage.setItem('resetLocations', JSON.stringify(resetLocations));
        };

        // We check that the window has scrolled to add a background to the header that is stuck to the top of the window
        window.addEventListener('scroll', function() {
            
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // We wait till all async processes have completed before starting the game
        Promise.all([promise1, promise2]).then((values) => {
            
            loading();
        });
    });

    async function loading() {
        
        await loadData();

        screenBlocker.classList = "inactive";

        continueButton.style.display = "none";
        
        // Check whether there is already a save game
        if (localStorage.getItem('saveExists')) {            

            let validVersion = versionCheck();

            if (validVersion) {
                if (showDebugLog) console.log("Save game exists & version is valid - enabling continue");
                continueButton.style.display = "block";            
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

        } 
        catch (error) {
            console.error('Error loading file:', error);
        }
    }

    function newGame() {

        if (showDebugLog) console.log("Starting new game...");

        // Formatting and making copies of data to be edited at runtime
        formatData();

        displayCharacterCreation();
    }

    // After the player has chosen their history
    function continueNewGame() {
        
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
        baseStamina = 2;        
        baseDefence = 0;
        baseEvasion = 20;
        
        assignedAbilityKeywords = new Array(6).fill(null);     // Here we save the abilities we've assigned to buttons in an array of strings that can be saved and reloaded
        assignedAbilityKeywords[4] = "run_away";
        assignedAbilityKeywords[5] = "flask";
        assignedAbilityKeywords[0] = "straight_sword_strike";

        inventory = [];
        inventory.push("straight_sword","green_cloak");

        calculateStats();
        currentStamina = maxStamina;
        updateStats();            
        
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
        respawnLocation = { regionKeyword: startRegionKeyword, areaKeyword: startAreaKeyword, locationCoordinates: _startLocation.coordinates };
        save();
    
        titleContent.style.display = "none";
        gameContent.style.display = "block";

        initializeAbilityButtons();
        displayLocation(_startRegion, _startArea, _startLocation);
    }

    function displayCharacterCreation() {
        
        titleScreenContainer.style.display = "none";
        characterCreationContainer.style.display = "block";

        const leftArrow = characterCreationContainer.querySelector('.arrow-left');
        const rightArrow = characterCreationContainer.querySelector('.arrow-right');    

        leftArrow.onclick = function() {
            currentDisplayedHistoryIndex -= 1;
            if (currentDisplayedHistoryIndex < 0) currentDisplayedHistoryIndex = histories.length - 1;
            changeDisplayedHistory();
        }
        rightArrow.onclick = function() {
            currentDisplayedHistoryIndex += 1;
            if (currentDisplayedHistoryIndex > histories.length - 1) currentDisplayedHistoryIndex = 0;
            changeDisplayedHistory();
        }
        

        characterCreationCarouselDots = characterCreationCarousel.querySelector('#carousel-dot-container').children;

        // Set onclick for the carousel dots
        for (let index = 0; index < characterCreationCarouselDots.length; index++) {
            
            const dot = characterCreationCarouselDots[index];
            dot.onclick = function() {
                currentDisplayedHistoryIndex = index;
                changeDisplayedHistory();
            };
        }

        changeDisplayedHistory();
    }

    function changeDisplayedHistory() {
        
        const historyIndex = currentDisplayedHistoryIndex;

        if (historyIndex > histories.length - 1) return;

        characterCreationTitle.innerHTML = histories[historyIndex].title;
        characterCreationDescription.innerHTML = histories[historyIndex].description.replace(/\n/g, '<br>');
        
        characterCreationContainer.querySelector('#character-glyph').src = "Assets/Character/Char_Glyph_" + histories[historyIndex].image + ".svg";
        characterCreationContainer.querySelector('#history-image-box').style.backgroundImage = "url(Assets/Character/" + histories[historyIndex].image + ".png)";
    
        // Construct the color value to be used in css based on the chose history
        const colorVariable = "--" + histories[historyIndex].color + "--primary--100";
        const colorValue = getComputedStyle(document.documentElement).getPropertyValue(colorVariable).trim();
        characterCreationContainer.querySelector('#history-image-box').style.border = "3px solid " + colorValue;        
        characterCreationContainer.querySelector('.history-select-line1').style.backgroundColor = colorValue;
        characterCreationContainer.querySelector('.history-select-line2').style.backgroundColor = colorValue;

        // Set the visual state of the carousel dots
        for (let index = 0; index < characterCreationCarouselDots.length; index++) {

            const dot = characterCreationCarouselDots[index];
            if (index === historyIndex)
                dot.classList = "carousel-dot active";
            else
                dot.classList = "carousel-dot";
        }

        if (historyIndex === 0) {
            characterCreationSelectButton.classList = "can-hover";
            characterCreationSelectButton.textContent = "Select";
            characterCreationSelectButton.onclick = function() {
                selectedHistory = histories[currentDisplayedHistoryIndex];
                continueNewGame();
            }
        }
        else {
            characterCreationSelectButton.classList = "inactive";
            characterCreationSelectButton.textContent = "Locked";
        }

    }

    function continueGame() {
        
        if (showDebugLog) console.log("Continuing saved game ...");

        load();
                    
        updateStats();
        save();

        titleContent.style.display = "none";
        gameContent.style.display = "block";

        initializeAbilityButtons();
        if (currentLocation === null)
            respawn();
        else
            displayLocation(currentRegion, currentArea, currentLocation);
    }

    // Should only happen on a new game. Takes reference data files and creates new ones to be saved and modified during the game
    function formatData() {    
        
        if (showDebugLog) console.log("formatData() - ");

        regions = JSON.parse(JSON.stringify(regionsRef));    
        npcs = JSON.parse(JSON.stringify(npcsRef));      
        narrations = JSON.parse(JSON.stringify(narrationsRef));
        actions = actionsRef.map(action => deepCopyWithFunctions(action));        
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
                            let newMonster = JSON.parse(JSON.stringify( monstersRef[getIndexFromKeyword(monster, monstersRef)]))
                            newMonsterArray.push(newMonster);
                        }
                    }

                    location.monsters = newMonsterArray;            
                }
            }
        }
    }

    function displayLocation(region, area, location) {    
        
        // This should only happen once
        if (!mapInitialize)
            initalizeMap();

        // In case this was deactivated for some prior reason
        header.style.display = "block";

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

        closeCombat();
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

        // Check if we are initiating combat
        if (currentLocation.monsters.length > 0) {
            displayCombat();
            return;
        }

        // First time visiting this location, check whether there is a narration to play first
        if (!_areaVisited) {
                    
            // Check whether this location has a narration keyword
            if (currentArea.narration != undefined && currentArea.narration != "") {
                
                // Check if the matching narration to this keyword has already been seen                
                if (narrations[getIndexFromKeyword(currentArea.narration, narrationsRef)] != undefined && !narrations[getIndexFromKeyword(currentArea.narration, narrationsRef)].seen) {

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
        
        newButton.button.onmouseover = (event) => { newButton.buttonChevron.querySelector('img').classList.add('hover'); if (newButton.button.classList.contains("can-hover")) playClick(); };
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
                
                let item = items[getIndexFromKeyword(element, items)];
                if (item.canEquip && item.equipped) {
                    
                    if (item.actions.length > 0) {
                        
                        item.actions.forEach((element, index) => {

                            _contextualActions.push(actions[getIndexFromKeyword(element, actions)]);
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

                if (items[getIndexFromKeyword(element, items)].canUpgrade)
                    _items.push(element);
            });
        }

        // INVENTORY
        // In the inventory - we inject special items that represent our resources, but only if we have any of that resource
        if (inventoryOpen) {
            
            // We make a deep copy of our inventory to inject these resource items into only while we are viewing the inventory
            _items = JSON.parse(JSON.stringify(inventory));
            if (ore > 0) { items[getIndexFromKeyword("ore", items)].quantity = ore; _items.splice(0,0, "ore"); }
            if (leather > 0) { items[getIndexFromKeyword("leather", items)].quantity = ore; _items.splice(0,0, "leather"); }
            if (greenHerb > 0) { items[getIndexFromKeyword("green_herb", items)].quantity = greenHerb; _items.splice(0,0, "green_herb"); }            
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
                
                let item = items[getIndexFromKeyword(element, items)];                        

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

                    const npc = npcs[getIndexFromKeyword(element, npcs)];                

                    const newButton = createButton(npc.keyword, objectType.npc);
                    createdButtons.push(newButton);
                    lastButtonConfigured = newButton.button;
                    newButton.button.classList = "nav-button npc-button can-hover";                

                    // ITEM NAME
                    newButton.buttonText.innerText = npc.title;                
                    
                    document.querySelector("#main-button-container").insertBefore(newButton.button, buttonMaster);                                                                
                    newButton.button.onclick = function() { displayNPC(getIndexFromKeyword(element, npcs)); playClick(); };                                                                                
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

                                newButton.button.onclick = function() { doAction(action.func, action.staminaCost, null, true); playClick();};
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

    // Set up ability buttons based on assigned abilities
    function initializeAbilityButtons() {

        abilityButtons = [];

        // Fill our container of the actual button objects
        const buttons = abilityButtonContainer.children;

        // Create objects to hold button and ability information
        for (let i = 0; i < buttons.length; i++) {
            
            const button = buttons[i];
            const ability = getObjectFromKeyword(assignedAbilityKeywords[i], actions);            

            const abilityButtonObject = {
                button: button,
                ability: ability,
                active: false
            }

            if (abilityButtonObject.ability != null) {
                
                button.classList = "ability-button can-hover";

                // Reset stamina icons
                button.querySelector('.stamina-container').innerHTML = '';

                // If this ability has a stamina cost, create small stamina icons at the bottom of the button to indicate the cost
                if (ability.staminaCost > 0) {
                    
                    for (let i = 0; i < ability.staminaCost; i++) {
                        const img = document.createElement('img');
                        img.src = 'Assets/StaminaIcon_NoPad.svg';
                        button.querySelector('.stamina-container').appendChild(img);
                    }
                }                

                if (ability.icon != null) {
                    button.querySelector('.ability-button-icon').setAttribute('src', 'Assets/Ability_Icons/' + ability.icon + '.svg');
                }
                else
                    button.querySelector('.ability-button-icon').setAttribute('src', '');
                
                button.onclick = function() { 
                    
                    activateAbility(i);                    
                };
            }
            else
                button.classList = "ability-button";

            abilityButtons.push(abilityButtonObject);
        }        
    }

    function activateAbility(abilityNumber) {

        if (!combatActive) return;

        let abilityButtonObject = null;

        switch (abilityNumber) {
            case 0:                
                abilityButtonObject = abilityButtons[0];
                break;
            case 1:
                abilityButtonObject = abilityButtons[1];
                break;
            case 2:
                abilityButtonObject = abilityButtons[2];
                break;
            case 3:
                abilityButtonObject = abilityButtons[3];
                break;
            case 4:
                abilityButtonObject = abilityButtons[4];
                break;
            case 5:
                abilityButtonObject = abilityButtons[5];
                break;
        }

        if (abilityButtonObject === null || abilityButtonObject.ability === null) return;

        if (abilityButtonObject.ability.target) {

            if (!abilityButtonObject.active) {
                
                abilityButtonObject.button.classList = "ability-button can-hover active";
                abilityButtonObject.active = true;
                currentActiveAbilityObject = abilityButtonObject;                            
                targetMonsterCards();                            
            }
            else {
                
                abilityButtonObject.button.classList = "ability-button can-hover";
                abilityButtonObject.active = false;
                currentActiveAbilityObject = null;
                detargetMonsterCards();
            }                        
        }
        else {
            
            useAbility(abilityButtonObject.ability, null);                    
            playClick();
        }
    }

    async function displayCombat() {

        combatActive = true;
        clearCreatedButtons();

        combatContainer.style.display = "block";    
        mapGridContainer.style.display = "none";
        mainTextSection.style.display = "none";

        saleTitle.style.display = "none";
        narrationText.style.display = "none";        
        mainTitle.classList = "combat";
        mainTitleText.classList = "";
        mainTitleText.innerText = currentRegion.title;
        secondaryTitle.style.display = "none";
        mainText.innerText = currentRegion.description;
    
        await initializeMonsterCards();

        setTimeout(function() {
            abilityButtonContainer.style.display = "flex";
            playClick();
        }, 500);    
    }

    function closeCombat() {

        combatActive = false;
        currentActiveAbilityObject = null;
        combatContainer.style.display = "none";
        abilityButtonContainer.style.display = "none";
        mainTextSection.style.display = "block";
    }

    // Set up monster cards in the default state
    async function initializeMonsterCards() {
        return new Promise((resolve) => {

            initializedMonsterCards = [];
            const monsterCards = monsterCardContainer.children;
            
            for (const card of monsterCards) {
                card.classList = "monster-card inactive";
                card.onclick = "";
                card.querySelector('.monster-level-icon').style.display = "none";
                card.querySelector('.monster-hp-section').style.display = "none";                
                card.querySelector('.monster-card-title-text').innerHTML = "";
                card.querySelector('.monster-card-type-text').innerHTML = "";
            }

            for (let i = 0; i < 3; i++) {
                
                const card = monsterCards[i];

                if (i < currentLocation.monsters.length) {
                    
                    const monster = currentLocation.monsters[i];
                    
                    const monsterCardObject = {
                        card: card,
                        monster: monster
                    }
                    initializedMonsterCards.push(monsterCardObject);
                    
                    setTimeout(function() {
                        
                        card.classList = "monster-card asd active";
                        card.onclick = "";

                        card.querySelector('.monster-level-icon').style.display = "block";
                        card.querySelector('.monster-level-icon').innerHTML = monster.level;
                        card.querySelector('.monster-card-title-text').innerHTML = monster.title;
                        card.querySelector('.monster-card-type-text').innerHTML = monster.type;
                        
                        card.querySelector('.monster-hp-section').style.display = "block";
                        card.querySelector('.monster-hp-text').innerHTML = monster.hpCurrent + "/" + monster.hpMax;
                        
                        let monsterHpCurrentPercent = monster.hpCurrent / monster.hpMax * 100;
                        // The width of our hp bar is the current hp percentage * 2 because the total width of the bar is 200    
                        card.querySelector('.monster-hp-bar-current').style.width = (monsterHpCurrentPercent + 1 ) + 'px';

                        playClick();
                        if (i === currentLocation.monsters.length - 1) resolve();
                    }, 300 + (300 * i));
                }
            }
        });
    }

    // When the player toggles active an ability button with a targeted ability, we show which monster cards can be targeted and make them clickable
    function targetMonsterCards() {
        
        // TODO Targetting for abilities, certain abilities can only target monsters in certain positions
                
        for (const cardObject of initializedMonsterCards) {
            console.log(cardObject);
            cardObject.card.classList = "monster-card active can-hover";
            cardObject.card.onclick = function() {
                
                useAbility(currentActiveAbilityObject.ability, cardObject.monster);            
                playClick();
            }
        }
    }

    // When a player ability gets untoggled
    function detargetMonsterCards() {
        
        for (const cardObject of initializedMonsterCards) {

            cardObject.card.classList = "monster-card active";
            cardObject.card.onclick = "";
        }
    }

    // When the player does damage to a monster
    function updateMonsterCardHealth() {

        for (const cardObject of initializedMonsterCards) {

            const card = cardObject.card;
            const monster = cardObject.monster;

            card.querySelector('.monster-hp-text').innerHTML = monster.hpCurrent + "/" + monster.hpMax;
                
            let monsterHpCurrentPercent = monster.hpCurrent / monster.hpMax * 100;
            // The width of our hp bar is the current hp percentage * 2 because the total width of the bar is 200    
            card.querySelector('.monster-hp-bar-current').style.width = (monsterHpCurrentPercent + 1 ) + 'px';
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
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "north"), items)) {
                            
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
                        
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "west"), items)) {

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
                    
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "east"), items)) {

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
                    
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "south"), items)) {

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

                    nodeObject.element.onmouseover = (event) => { playClick(); };
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
        mainTitleText.classList = "";
        mainTitleText.innerText = "";
        secondaryTitle.style.display = "none";
        
        if (narrations[getIndexFromKeyword(currentNarration, narrations)].text.length > currentNarrationIndex) {    
            mainText.innerText = narrations[getIndexFromKeyword(currentNarration, narrations)].text[currentNarrationIndex];
        }
        else
            console.error("displayNarrative - Narration index [" + currentNarrationIndex + "] is higher than text length [" + narrations[getIndexFromKeyword(currentNarration, narrations)].text.length + "]");
    }

    function continueNarration() {

        if (showDebugLog) console.log("continueNarration() - ");

        currentNarrationIndex++;

        if (narrations[getIndexFromKeyword(currentNarration, narrations)].text.length > currentNarrationIndex)
            mainText.innerText = narrations[getIndexFromKeyword(currentNarration, narrations)].text[currentNarrationIndex];
        else {
            narrations[getIndexFromKeyword(currentNarration, narrations)].seen = true;
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

                let curseMarkIndex = getIndexFromKeyword("curse_mark", items);
                items[curseMarkIndex].power += 5;
                break;        
        }

        updateStats();
        save();
        displayTrain();
    }

    // Update the header with current stat values
    function updateStats() {
        
        if (showDebugLog) console.log ("updateStats() - ");

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
            
            let index = getIndexFromKeyword(element, items);

            if (items[index].equipped) {
                power += items[index].power;
                maxStamina += items[index].stamina;
                defence += items[index].defence;
            }
        });
    }

    function updateMonsterUI(monsterButton) {
        
        let monster = currentLocation.monsters[getIndexFromKeyword(monsterButton.keyword, currentLocation.monsters)];

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

    // #region COMBAT & ABILITIES
    // Abilities are actions taken in combat using the ability bar

    // This is the reference data, which will be duplicated and stored at runtime so that it can be modified while maintaining this reference copy
    const actionsRef = [
        {
            keyword: "straight_sword_strike",
            title: "Sword Strike",
            target: true,
            active: true,
            staminaCost: 1,
            location: null,
            effect: async function(target) {
                
                await playerAttack(target);
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
            effect: async function() {
                
                await runAway();
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

    async function useAbility(ability, target) {
        
        if (target != null)
            await ability.effect(target);
        else
            await ability.effect();

        // Spend stamina if this ability had a cost
        if (ability.staminaCost > 0 ) {
            if (ability.staminaCost > currentStamina)
                console.error("useAbility() - staminaCost too high");
            else        
                spendStamina(ability.staminaCost);
        } 

        if (currentStamina === 0) {

            await playerTurnComplete(true);
        }    

        console.log("Done");
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
    }

    async function playerTurnComplete() {

        if (showDebugLog) console.log("playerActionComplete() - ");
            
        let monsters = currentLocation.monsters;    
        
        if (monsters.length > 0 && monsters != "") {

            for (const monster of monsters) {

                await monsterAttack(monster);
    
                if (hpCurrent <= 0) {
                    playerDeath();
                    return;
                }
            }            
        }    

        recoverMax(false);
        updateStats();
        save();
    }

    function playerAttack(target) {

        return new Promise((resolve, reject) => {

            if (currentLocation === null) return;

            if (showDebugLog) console.log("attack() - ");         // Unhelpful console log imo                        
            
            let monster = target;
            
            // Evasion chance
            let evasionNumber = Math.floor(Math.random() * 101);
            if (showDebugLog) console.log("Monster evasion - " + monster.evasion + "  evade number: " + evasionNumber);

            if (evasionNumber <= monster.evasion) {
                
                setTimeout(() => {
                    let updateString = "The " + monster.shortTitle + " evades your attack."
                    addUpdateText(updateString);

                    resolve("Complete");
                }, 300);
            }
            else {            
 
                setTimeout(() => {    

                    // PLAYER ATTACK
                    monster.hpCurrent = Math.max(monster.hpCurrent - power, 0);

                    updateMonsterCardHealth();
                        
                    let updateString = "You do " + power + " damage to the " + monster.shortTitle + "."
                    addUpdateText(updateString);  

                    // CHECK FOR MONSTER DEATH
                    if (monster.hpCurrent <= 0) {

                        monsterDeath(monster);
                    }
                    
                    resolve("Complete");
                }, 300);
            }    
        });
    }
    
    function monsterAttack(monster) {
        
        return new Promise((resolve, reject) => {

            let monstersActionString = "";      

            // Evasion chance
            let evasionNumber = Math.floor(Math.random() * 101);                

            if (evasionNumber <= evasion) {

                monstersActionString +=  "You evade the " + monster.shortTitle + "'s attack."
                addUpdateText(monstersActionString);
            }
            else {                  

                setTimeout(() => {    

                    // MONSTER ATTACK
                    let monsterDamage = Math.max(0, monster.power - defence);        
                    hpCurrent -= monsterDamage;
                    if (monstersActionString != "") monstersActionString += "\n";
                    monstersActionString += "The " + monster.shortTitle + " does " + monsterDamage + " damage to you.";
                    addUpdateText(monstersActionString);
                    
                    resolve("Complete");
                }, 300);
            }

            

        });
    }

    async function monsterDeath(monster) {
                        
        // Remove this monster from the current location
        let monsterIndex = -1;
        // Find the correct monster in the location list
        for (let i = 0; i < currentLocation.monsters.length; i++) {
            const _monster = currentLocation.monsters[i];
            if (_monster.keyword === monster.keyword && _monster.hpCurrent === monster.hpCurrent)
                monsterIndex = i;
        }        
        currentLocation.monsters.splice(monsterIndex,1);

        const monsterExperience = getRandomInt(monster.experienceMin, monster.experienceMax);

        let storedMonsterString = "The " + monster.shortTitle + " falls dead at your feet\nYou receive " + monsterExperience + " experience and " +  monster.gold + " gold";
        addUpdateText(storedMonsterString);

        experience += monsterExperience;
        insight += monster.insight;
        gold += monster.gold;
        updateStats();             
        save();
    
        if (currentLocation.monsters.length === 0) {
            displayLocation(currentRegion, currentArea, currentLocation);            
        }
        else {
            await initializeMonsterCards();
            
            // Once we've re-inialized new positions, check if we should re-target because an ability is active
            if (currentActiveAbilityObject != null) {                
                targetMonsterCards();            
            }
        }
    
    }

    
    function runAway() {
        
        // Wait for a short period here so that any outcome of spending stamina can resolve
        setTimeout(function() {

            if (currentLocation === null) return; // In case we died while trying to run away

            const direction = activeDirections[Math.floor(Math.random() * activeDirections.length)];        

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

    // #region ACTIONS
    // Actions involve other actions players can do outside of combat

    // Translate a string provided in through the context data into an action
    async function doAction(actionString, staminaCost, target, resetText) {    

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
                let result = await playerAttack(target);            
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
                    displayNPC(getIndexFromKeyword(functionArray[1], npcs));                
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
    }

    function doActionComplete() {

    }

    function recoverStamina() {

        let monstersPresent = false;
        let monsters = currentLocation.monsters;
        
        if (monsters.length > 0 && monsters != "") 
            monstersPresent = true;

        if (!monstersPresent)
            recoverMax(false);
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
        
        combatContainer.style.display = "none";
        abilityButtonContainer.style.display = "none";
        header.style.display = "none";

        let funcString = "getCorpse|" + gold + "|You recover what gold you can from the corpse"
        // Set the quantity of the corpse item to the amount of gold we are holding
        items[getIndexFromKeyword("corpse", items)].quantity = gold;
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
        currentLocation = null;   // Save 'dead' state
        save();
    }

    function respawn() {    

        if (respawnLocation != null) {

            hpCurrent = hpMax;
            currentStamina = maxStamina;

            // Monsters all heal when you rest
            healAllMonsters();

            updateStats();

            const _respawnRegion = getObjectFromKeyword(respawnLocation.regionKeyword, regions);            
            const _respawnArea = getObjectFromKeyword(respawnLocation.areaKeyword, _respawnRegion.areas);            
            const _respawnLocation = getLocationFromArea(respawnLocation.locationCoordinates, _respawnArea);

            displayLocation(_respawnRegion, _respawnArea, _respawnLocation); 
            save();        
            
            // TODO Add variants on this text
            addUpdateText("You wake soaked in sweat and trembling. The terrors of the foglands haunting your mind.");
        }
        else
            console.error("respawn() - Trying to respawn with an empty respawnLocation");
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
            
            updateStats();
            save();

            // let updateString = "You recover your stamina."
            // addUpdateText(updateString);
        }
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

            let item = items[getIndexFromKeyword(keyword, items)];
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

        let item = items[getIndexFromKeyword(keyword, items)];
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

        let item = items[getIndexFromKeyword(keyword, items)];
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

            let item = items[getIndexFromKeyword(keyword, items)];
            
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

    // #region PRIVATE UTILITIES

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

        localStorage.setItem('assignedAbilityKeywords', JSON.stringify(assignedAbilityKeywords));
    
        localStorage.setItem('regions', JSON.stringify(regions));    
        localStorage.setItem('npcs', JSON.stringify(npcs));
        localStorage.setItem('items', JSON.stringify(items));
        localStorage.setItem('narrations', JSON.stringify(narrations));

        // Actions contains functions within it, so needs to be treated specially
        saveArrayToLocalStorage('actions', actions);        
    
        // Saving variables that are object references
        localStorage.setItem('currentRegionKeyword', JSON.stringify(currentRegion.keyword));
        localStorage.setItem('currentAreaKeyword', JSON.stringify(currentArea.keyword));
        if (currentLocation === null)
            localStorage.setItem('currentLocationCoordinates', JSON.stringify(null));   // The players current location is set to null when they are dead and haven't yet respawned
        else
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

        assignedAbilityKeywords = JSON.parse(localStorage.getItem('assignedAbilityKeywords'))
    
        if (!resetLocations) { 
            
            regions = JSON.parse(localStorage.getItem('regions'));        
            npcs = JSON.parse(localStorage.getItem('npcs'));
            items = JSON.parse(localStorage.getItem('items'));
            narrations = JSON.parse(localStorage.getItem('narrations'));

            // Retrieve and re-connect serialized functions
            actions = retrieveArrayFromLocalStorage('actions');
        }
        else {
            
            regions = JSON.parse(JSON.stringify(regionsRef));                   
            npcs = JSON.parse(JSON.stringify(npcsRef));
            items = JSON.parse(JSON.stringify(itemsRef));
            narrations = JSON.parse(JSON.stringify(narrationsRef));
            actions = actionsRef.map(action => deepCopyWithFunctions(action));
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
        newGame();
    }
        
    function toggleDebugWindow() {
        
        if (!debugWindowActive) {
            debugWindow.style.display = "block";
            debugWindowActive = true;
        }
        else if (debugWindowActive) {
            debugWindow.style.display = "none";
            debugWindowActive = false;
        }
    }

    function saveArrayToLocalStorage(key, array) {

        const serializedArray = array.map(obj => {
            const serializedObj = JSON.stringify(obj, (key, value) => {
                return typeof value === 'function' ? value.toString() : value;
            });
            return serializedObj;
        });
    
        localStorage.setItem(key, JSON.stringify(serializedArray));
    }
    
    function retrieveArrayFromLocalStorage(key) {
        const serializedArray = JSON.parse(localStorage.getItem(key));
    
        if (!serializedArray) return null;
    
        const array = serializedArray.map(serializedObj => {
            const obj = JSON.parse(serializedObj);
    
            for (const key in obj) {            
                if (typeof obj[key] === 'string' && (obj[key].startsWith('function') || obj[key].startsWith('async'))) {                
                    obj[key] = eval('(' + obj[key] + ')');
                }
            }
    
            return obj;
        });
    
        return array;
    }

    //#endregion
    
})();