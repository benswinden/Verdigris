import { npcsRef } from "../Data/npcs.js";
import {    objectType,    
    getIndexFromKeyword,    
    getObjectFromKeyword,
    getLocationFromArea,
    compareArrays,
    compareObjects,
    getLocationInDirection,
    locationsHavePath,
    playClick,


     } from "./Util.js";

const EDITOR = (function() {

    // #region VARIABLES
    let currentRegion = null;
    let currentArea = null;
    let currentLocation = null;
    let currentEntry = null;

    let mapGrid = [];

    let createdButtons = [];

    let showDebugLog = true;

    let regionsData = [];
    let itemsRef = [];
    let monstersRef = [];    

    let isLeftCtrlHeld = false;

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

    const mapGridContainer = document.querySelector("#map-grid-container");
    const buttonsContainer = document.querySelector("#buttons-container");
    const buttonMaster = document.querySelector('#button');
    const newObjectContainer = document.querySelector("#new-object-container");
    const newObjectTypePicker = document.querySelector("#new-object-type-picker");
    const newObjectPicker = document.querySelector("#new-object-picker");
    const createDoorButton = document.querySelector("#door-button");
    const removeDoorButton = document.querySelector("#remove-door-button");
    const doorAttributeContainer = document.querySelector("#door-attribute-container");
    const navArea = document.querySelector(".nav-area");
    const navMap = document.querySelector(".nav-map");
    const areaSection = document.querySelector("#area-section-container");
    const mapSection = document.querySelector("#map-section-container");
    const keywordInput = document.querySelector("#keyword-input");
    const titleInput = document.querySelector("#title-input");
    const descriptionInput = document.querySelector("#description-input");
    const newAreaButton = document.querySelector("#new-area-button");
    const newRegionButton = document.querySelector("#new-region-button");

    var PapaParseConfig = 
    {    
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    }

    //#endregion

    // #region EDITOR CORE
    
    document.addEventListener('DOMContentLoaded', function() {
        
        const promise1 = fetch('Data/items.csv')
        .then((response) => response.text())
        .then((data) => { 
            itemsRef = Papa.parse(data, PapaParseConfig).data;
            // Filter out empty rows
            itemsRef = itemsRef.filter(({ keyword }) => keyword != null);
        });

        const promise2 = fetch('Data/monsters.csv')
        .then((response) => response.text())
        .then((data) => { 
            monstersRef = Papa.parse(data, PapaParseConfig).data;
            // Filter out empty rows
            monstersRef = monstersRef.filter(({ keyword }) => keyword != null);
        });

        addEventListeners();

        // We wait till all async processes have completed before starting the game
        Promise.all([promise1, promise2]).then((values) => {
            
            initialize();        
        });
    });

    async function initialize() {

        await loadData();

        initalizeMap();
        initializeRegionPicker();
    }

    function initalizeMap() {

        if (showDebugLog) console.log("initializeMap() - ");

        mapGrid = [];            // Grid that will hold our node objects
        const secondaryGrid = [];       // Grid to hold the refs to the smaller boxes temporarily

        let rowCount = 0;
        for (let rowIndex = 0; rowIndex < mapGridContainer.children.length; rowIndex++) {
            
            const row = mapGridContainer.children[rowIndex];
            
            // If even, we are on a row of main squares
            if (rowIndex % 2 === 0) {
                
                const mainRowArray = [];
                const secondaryRowArray = [];

                let columnCount = 0;
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

                        const newDiv = document.createElement('div');
                        element.appendChild(newDiv);
                        newDiv.classList = "coordinate";
                        newDiv.textContent = "[" + rowCount + "," + columnCount + "]";
                        columnCount++;

                        mainRowArray.push(nodeObject);                    
                    }
                    // Otherwise we are on a vertical smaller square
                    else {

                        secondaryRowArray.push(element);
                    }
                }

                mapGrid.push(mainRowArray);
                secondaryGrid.push(secondaryRowArray);

                rowCount++;
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
    }

    function initializeRegionPicker() {

        const dropdownContent = document.querySelector('#region-picker-container').querySelector('.dropdown-content');
        const dropbtn = document.querySelector('#region-picker-container').querySelector('.dropbtn');    

        while (dropdownContent.firstChild) {
            dropdownContent.removeChild(dropdownContent.firstChild);
        }

        for (const region of regionsData) {
                    
            let entry = document.createElement('a');
            entry.textContent = region.title;

            // If we already have a set currentRegion when initializing, make sure to store the entry that matches the current selected region
            if (currentRegion != null && region.title === currentRegion.title) 
                currentEntry = entry;

            entry.addEventListener('click', function(event) {
                
                currentEntry = entry;
                currentLocation = null;
                currentArea = null;

                event.preventDefault();
                dropbtn.textContent = region.title;
                currentRegion = regionsData[getIndexFromKeyword(region.keyword, regionsData)];

                removeDoorButton.style.display = "none";
                createDoorButton.style.display = "none";
                doorAttributeContainer.style.display = "none";

                resetMap();
                loadRegion();
                initializeAreaPicker();
            });
            dropdownContent.appendChild(entry);
        }
        
        if (currentRegion != null) {

            dropbtn.textContent = currentRegion.title;
        }
    }

    function initializeAreaPicker() {

        const dropdownContent = document.querySelector('#area-picker-container').querySelector('.dropdown-content');
        const dropbtn = document.querySelector('#area-picker-container').querySelector('.dropbtn');
        
        dropbtn.textContent = "Select";

        while (dropdownContent.firstChild) {
            dropdownContent.removeChild(dropdownContent.firstChild);
        }

        const _areasData = currentRegion.areas;

        for (const area of _areasData) {
                    
            let entry = document.createElement('a');
            entry.textContent = area.title;

            // If we already have a set currentArea when initializing, make sure to store the entry that matches the current selected area
            if (currentArea != null && area.title === currentArea.title) 
                currentEntry = entry;

            entry.addEventListener('click', function(event) {
                
                currentEntry = entry;
                currentLocation = null;

                event.preventDefault();
                dropbtn.textContent = area.title;
                currentArea = area;

                removeDoorButton.style.display = "none";
                createDoorButton.style.display = "none";
                doorAttributeContainer.style.display = "none";

                loadArea();
            });
            dropdownContent.appendChild(entry);
        }
        
        // Allows you to de-select an area
        let entry = document.createElement('a');
        entry.textContent = "Deselect";
        entry.addEventListener('click', function(event) {
            
            const dropdownContent = document.querySelector('#region-picker-container').querySelector('.dropdown-content');

            for (let i = 0; i < dropdownContent.children.length; i++) {
                const child = dropdownContent.children[i];
                
                if (child.textContent === currentRegion.title)
                    currentEntry = child;
            }
            

            loadRegion();
            resetMap();
            currentArea = null;
            dropbtn.textContent = "Select";
        });
        dropdownContent.appendChild(entry);


        if (currentArea != null) {
            
            dropbtn.textContent = currentArea.title;
        }
    }

    function loadRegion() {

        keywordInput.value = currentRegion.keyword;
        titleInput.value = currentRegion.title;
        descriptionInput.value = currentRegion.description;
    }

    function loadArea() {

        keywordInput.value = currentArea.keyword;
        titleInput.value = currentArea.title;
        descriptionInput.value = currentArea.description;

        updateMap();
    }

    function resetArea() {

        keywordInput.value = "";
        titleInput.value = "";
        descriptionInput.value = "";

        resetMap();
    }

    function resetMap() {

        for (let y = 0; y < mapGrid.length; y++) {
            for (let x = 0; x < mapGrid[y].length; x++) {

                const nodeObject = mapGrid[y][x];
                
                nodeObject.element.classList = "main-square can-hover"
                if (nodeObject.north != null) nodeObject.north.classList = "horizontal-square"
                if (nodeObject.west != null) nodeObject.west.classList = "vertical-square"
                if (nodeObject.east != null) nodeObject.east.classList = "vertical-square"
                if (nodeObject.south != null) nodeObject.south.classList = "horizontal-square"                                                          
            }
        }
    }

    function updateMap() {

        if (showDebugLog) console.log("updateMap() - ");

        if (currentArea.locations.length > 0) {

            // Reset state of all squares in the grid
            for (let y = 0; y < mapGrid.length; y++) {
                for (let x = 0; x < mapGrid[y].length; x++) {

                    const nodeObject = mapGrid[y][x];
                    
                    nodeObject.element.classList = "main-square can-hover"
                    if (nodeObject.north != null) nodeObject.north.classList = "horizontal-square"
                    if (nodeObject.west != null) nodeObject.west.classList = "vertical-square"
                    if (nodeObject.east != null) nodeObject.east.classList = "vertical-square"
                    if (nodeObject.south != null) nodeObject.south.classList = "horizontal-square"

                        
                    nodeObject.element.onclick = function() {
                        
                        const newLocation = createLocation([y,x]);
                        playClick();
                        currentLocation = newLocation;
                        
                        createDoorButton.style.display = "block";
                        removeDoorButton.style.display = "none";
                        doorAttributeContainer.style.display = "none";

                        updateMap();
                    }                                
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
                                        
                        // Check whether the square in this direction is the player's current location, in which case store that information
                        if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "north").coordinates, currentLocation.coordinates)) {  // Is the location adjacent to us the player's current location?                                                
                            isAdjacentToCurrent = true;                                
                    }

                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "north"), itemsRef))
                            if (pathIsBlocked(location, getLocationInDirection(location.coordinates, currentArea, "north")))
                                nodeObject.north.classList = "horizontal-square blocked";
                            else
                                nodeObject.north.classList = "horizontal-square inactive";
                    }
                }
                if (nodeObject.west != null) {                          
                    if (getLocationInDirection(location.coordinates, currentArea, "west") != null) {                                    
            
                        if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "west").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;                                                        
                        }
                        
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "west"), itemsRef))
                            if (pathIsBlocked(location, getLocationInDirection(location.coordinates, currentArea, "west")))
                                nodeObject.west.classList = "vertical-square blocked";                   
                            else
                                nodeObject.west.classList = "vertical-square inactive";                   
                    }
                }
                if (nodeObject.east != null) {                          
                    if (getLocationInDirection(location.coordinates, currentArea, "east") != null) {
                    
                        if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "east").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;                                                        
                        }
                        
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "east"), itemsRef))
                            if (pathIsBlocked(location, getLocationInDirection(location.coordinates, currentArea, "east")))
                                nodeObject.east.classList = "vertical-square blocked";               
                            else
                                nodeObject.east.classList = "vertical-square inactive";               
                    }
                }
                if (nodeObject.south != null) {                          
                    if (getLocationInDirection(location.coordinates, currentArea, "south") != null) {
                    
                        if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "south").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                            isAdjacentToCurrent = true;                                                        
                        }
                        
                        if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "south"), itemsRef))
                            if (pathIsBlocked(location, getLocationInDirection(location.coordinates, currentArea, "south")))
                                nodeObject.south.classList = "horizontal-square blocked";
                            else
                                nodeObject.south.classList = "horizontal-square inactive";
                    
                    }
                }            

                // Set this location square to active                        
                nodeObject.element.classList = "main-square active can-hover"


                // Set this node's on click function            
                nodeObject.element.onclick = function() { 

                    playClick();
                    
                    if (!isLeftCtrlHeld || (isLeftCtrlHeld && currentLocation === null)) {
                        toggleNode(location);                
                    }
                    else  {
                        const _currentLocation = currentLocation;   // Store this so we can set the actual value to null but still use the current store location
                        
                        createDoorButton.style.display = "none";
                        removeDoorButton.style.display = "none";                
                        currentLocation = null;

                        // If there is already a path, remove it
                        if (locationsHavePath(_currentLocation, location, itemsRef)) {
                            removePath(_currentLocation, location);
                        }
                        // Otherwise, create a path between these two
                        else {
                            createPath(_currentLocation, location);
                        }

                        updateMap();
                    }                    
                };
                
                if (location.door != null) {
                    nodeObject.element.classList += " door";
                }
            });

            // Current selected node styling
            let currentLocationNode = null;
            if (currentLocation != null) {

                currentLocationNode = mapGrid[currentLocation.coordinates[0]][currentLocation.coordinates[1]];
                currentLocationNode.element.classList = "main-square current can-hover"

                if (currentLocation.door != null) {

                    currentLocationNode.element.classList += " door";                
                
                }  
            }

        }
        else
            console.error("updateMap - Current Area: " + currentArea + " has no locations");

        updateButtons();
    }

    function updateButtons() {
        
        removeCreatedButtons();

        if (currentLocation === null) return;
        
        if (currentLocation.items != null && currentLocation.items != "") {
            
            for (const itemKeyword of currentLocation.items) {

                let item = itemsRef[getIndexFromKeyword(itemKeyword, itemsRef)];
                const newButton = createButton(itemKeyword, objectType.item);
                createdButtons.push(newButton);
                newButton.button.classList = "nav-button item-button can-hover";
                newButton.buttonText.innerText = item.title;
            }
        }
        if (currentLocation.monsters != null && currentLocation.monsters != "") {

            for (const monsterKeyword of currentLocation.monsters) {

                let monster = monstersRef[getIndexFromKeyword(monsterKeyword, monstersRef)];
                const newButton = createButton(monsterKeyword, objectType.monster);
                createdButtons.push(newButton);
                newButton.button.classList = "nav-button monster-button can-hover";
                newButton.buttonText.innerText = monster.title;
            }
        }
        if (currentLocation.npcs != null && currentLocation.npcs != "") {

            for (const npcKeyword of currentLocation.npcs) {

                let npc = npcsRef[getIndexFromKeyword(npcKeyword, npcsRef)];
                const newButton = createButton(npcKeyword, objectType.npc);
                createdButtons.push(newButton);
                newButton.button.classList = "nav-button npc-button can-hover";
                newButton.buttonText.innerText = npc.title;
            }
        }
    }

    function createButton(objectKeyword, objType) {

        const clone = buttonMaster.cloneNode(true);

        let newButton = {
            container: clone,
            button: clone.querySelector('#button-master'),
            keyword: objectKeyword,
            type: objType,        
            buttonText: clone.querySelector('#button-master').querySelector('.button-text'),        
        }

        clone.querySelector('.button-delete').onclick = function() {
            deleteObject(objectKeyword, objType);
        }        

        newButton.container.style.display = "flex";
        newButton.button.classList.remove('active');
        buttonsContainer.insertBefore(newButton.container, buttonMaster);

        return newButton;
    }

    function removeCreatedButtons() {

        createdButtons.forEach((element) => {        
            element.container.remove();
        });
        
        createdButtons = [];
    }

    function toggleNode(location) {

        if (currentLocation != null && compareArrays(location.coordinates, currentLocation.coordinates)) {
            currentLocation = null;
            createDoorButton.style.display = "none";
            removeDoorButton.style.display = "none";
            doorAttributeContainer.style.display = "none";
        }
        else {
            currentLocation = location;
            createDoorButton.style.display = "block";
            removeDoorButton.style.display = "none";
            doorAttributeContainer.style.display = "none";

            // If this location is already a door we want to initialize the proper values into the picker
            if (currentLocation.door != null) {

                createDoorButton.style.display = "none";
                removeDoorButton.style.display = "block";
                doorAttributeContainer.style.display = "flex";
                initializeDoorAttributePicker();
            }
        }

        updateMap();
    }

    function createLocation(coordinates) {
        
        const newLocation = {
            coordinates: coordinates,
            visited: false,
            seen: false,
            items: [],
            monsters: [],
            npcs: [],
            north: null,
            west: null,
            east: null,
            south: null,
            door: null
        }
        
        currentArea.locations.push(newLocation);
        return newLocation;
    }

    function removeLocation(location) {

        if (regionsData === null) return;
        
        if (currentArea.locations.indexOf(location) != -1) {
            currentArea.locations.splice(currentArea.locations.indexOf(location), 1)
            currentLocation = null;        
            updateMap();
        }
        else
            console.error("removeLocation() - failed")
    }

    function checkIsAdjacent(coordinatesA, coordinatesB) {
        
        let isAdjacent = false;

        if (compareArrays([coordinatesA[0]-1,coordinatesA[1]], coordinatesB))
            isAdjacent = true; 
        if (compareArrays([coordinatesA[0],coordinatesA[1]-1], coordinatesB)) 
            isAdjacent = true;
        if (compareArrays([coordinatesA[0],coordinatesA[1]+1], coordinatesB)) 
            isAdjacent = true;
        if (compareArrays([coordinatesA[0]+1,coordinatesA[1]], coordinatesB)) 
            isAdjacent = true;

        return isAdjacent;
    }

    function createNewRegion() {

        const newRegion =
            {
                keyword: "new_region",
                title: "New region title",
                description: "New region description.",
                visited: false,
                areas: [
                    {
                        keyword: "new_area",
                        title: "New area title",
                        description: "New area description.",
                        narration: "",
                        update: "",
                        visited: false,
                        locations: [
                            {
                                coordinates: [0,0],
                                visited: false,
                                seen: false,
                                items: [],
                                monsters: [],
                                npcs: [],
                                north: null,
                                west: null,
                                east: null,
                                south: null,
                                door: null
                            }
                        ]
                    }
                ]
            };
        
        regionsData.push(newRegion);
        currentRegion = newRegion;
        initializeRegionPicker();
        initializeAreaPicker();
        loadRegion();
    }

    function createNewArea() {

        if (currentRegion === null) return;

        const newArea = {
            keyword: "new_area",
            title: "New area title",
            description: "New area description.",
            narration: "",
            update: "",
            visited: false,
            locations: [
                {
                    coordinates: [0,0],
                    visited: false,
                    seen: false,
                    items: [],
                    monsters: [],
                    npcs: [],
                    north: null,
                    west: null,
                    east: null,
                    south: null,
                    door: null
                }
            ]
        };
        
        currentRegion.areas.push(newArea);
        currentArea = newArea;
        initializeAreaPicker();
        loadArea();
    }

    function deleteObject(objectKeyword, objType) {

        if (currentLocation === null) { console.error("deleteObject but currentLocation is null"); return; }

        console.log("deleteObject() - keyword: " + objectKeyword + "  type: " + objType);
        
        let ar = null;

        switch (objType) {        
            case objectType.item:
                ar = currentLocation.items;
                break;
            case objectType.monster:
                ar = currentLocation.monsters;
                break;
            case objectType.npc:
                ar = ar = currentLocation.npcs;
                break;
        }

        ar.splice(ar.indexOf(objectKeyword), 1);
        updateMap();    
    }

    function createNewObject() {

        if (currentLocation === null) { console.error("createObject but currentLocation is null"); return; }
        if (newObjectSelected === null) { console.error("createObject but no selected object "); return; }

        let ar;

        switch (newObjectSelected.type) {        
            case objectType.item:
                ar = currentLocation.items;
                break;
            case objectType.monster:
                ar = currentLocation.monsters;
                break;
            case objectType.npc:
                ar = currentLocation.npcs;
                break;            
        }

        ar.push(newObjectSelected.keyword);
        closeNewObjectPicker();
        updateButtons();
    }

    function createDoor() {

        if (currentLocation === null) { console.error("createDoor but currentLocation is null"); return; }

        createDoorButton.style.display = "none";
        removeDoorButton.style.display = "none";
        doorAttributeContainer.style.display = "flex";
        initializeDoorAttributePicker();
    }

    function removeDoor() {

        if (currentLocation === null) { console.error("removeDoor but currentLocation is null"); return; }
        
        const otherLocation = getLocationFromDoor(currentLocation.door);
        console.log(otherLocation);
        otherLocation.door = null;

        currentLocation.door = null;

        createDoorButton.style.display = "block";
        removeDoorButton.style.display = "none";
        doorAttributeContainer.style.display = "none";

        updateMap();
    }

    let newObjectTypeSelected = null;
    let newObjectSelected = null;

    function initializeNewObjectPicker() {
        
        newObjectTypeSelected = null;
        newObjectSelected = null;

        const typeDropdownContent = newObjectContainer.querySelector('#new-object-type-picker').querySelector('.dropdown-content');
        const typeDropdownButton = newObjectContainer.querySelector('#new-object-type-picker').querySelector('.dropbtn');
        const objectDropdownContent = newObjectContainer.querySelector('#new-object-picker').querySelector('.dropdown-content');
        const objectDropdownButton = newObjectContainer.querySelector('#new-object-picker').querySelector('.dropbtn');

        typeDropdownButton.textContent = "Select";
        objectDropdownButton.textContent = '';

        
        while (typeDropdownContent.firstChild) {
            typeDropdownContent.removeChild(typeDropdownContent.firstChild);
        }
        while (objectDropdownContent.firstChild) {
            objectDropdownContent.removeChild(objectDropdownContent.firstChild);
        }

        let entry = null;
        entry = document.createElement('a');
        entry.textContent = "Item";
        entry.addEventListener('click', function(event) {
            newObjectTypeSelected = objectType.item;
            event.preventDefault();
            typeDropdownButton.textContent = "Item";
            updateNewObjectPicker();
        });
        typeDropdownContent.appendChild(entry);

        entry = document.createElement('a');
        entry.textContent = "Monster";
        entry.addEventListener('click', function(event) {
            newObjectTypeSelected = objectType.monster;
            event.preventDefault();
            typeDropdownButton.textContent = "Monster";
            updateNewObjectPicker();
        });
        typeDropdownContent.appendChild(entry);

        entry = document.createElement('a');
        entry.textContent = "NPC";
        entry.addEventListener('click', function(event) {
            newObjectTypeSelected = objectType.npc;
            event.preventDefault();
            typeDropdownButton.textContent = "NPC";
            updateNewObjectPicker();
        });
        typeDropdownContent.appendChild(entry);


        updateNewObjectPicker();
        newObjectContainer.style.display = "block";
    }

    function updateNewObjectPicker() {

        if (newObjectTypeSelected === null) return;
        
        const objectDropdownContent = newObjectContainer.querySelector('#new-object-picker').querySelector('.dropdown-content');
        const objectDropdownButton = newObjectContainer.querySelector('#new-object-picker').querySelector('.dropbtn');

        newObjectSelected = null;
        objectDropdownButton.textContent = "Select";
        
        while (objectDropdownContent.firstChild) {
            objectDropdownContent.removeChild(objectDropdownContent.firstChild);
        }
        
        
        switch (newObjectTypeSelected) {
            case (objectType.item):
                
                for (const item of itemsRef) {
                    
                    let entry = document.createElement('a');
                    entry.textContent = item.title + " (" + item.keyword + ")";
                    entry.addEventListener('click', function(event) {
                        newObjectTypeSelected = objectType.item;
                        event.preventDefault();
                        objectDropdownButton.textContent = item.title + " (" + item.keyword + ")";
                        newObjectSelected = { keyword: item.keyword, type: objectType.item };
                    });
                    objectDropdownContent.appendChild(entry);
                }
                break;
            case (objectType.monster):

                for (const monster of monstersRef) {
                    
                    let entry = document.createElement('a');
                    entry.textContent = monster.title + " (" + monster.keyword + ")";
                    entry.addEventListener('click', function(event) {
                        newObjectTypeSelected = objectType.monster;
                        event.preventDefault();
                        objectDropdownButton.textContent = monster.title + " (" + monster.keyword + ")";
                        newObjectSelected = { keyword: monster.keyword, type: objectType.monster };
                    });
                    objectDropdownContent.appendChild(entry);
                }
                break;
            case (objectType.npc):

                for (const npc of npcsRef) {
                        
                    let entry = document.createElement('a');
                    entry.textContent = npc.title + " (" + npc.keyword + ")";;
                    entry.addEventListener('click', function(event) {
                        newObjectTypeSelected = objectType.npc;
                        event.preventDefault();
                        objectDropdownButton.textContent = npc.title + " (" + npc.keyword + ")";
                        newObjectSelected = { keyword: npc.keyword, type: objectType.npc };
                    });
                    objectDropdownContent.appendChild(entry);
                }
                break;
        }
    }

    function closeNewObjectPicker() {

        newObjectContainer.style.display = "none";
    }

    // The door creation happens in three phases, first the region picker is initialized, once the user chooses a region, the area picker is initialized, then coordinates once an area is chosen
    // The actual door is created when the user selects a coordinate
    function initializeDoorAttributePicker() {
        
        const regionDropdownContent = doorAttributeContainer.querySelector('#door-region-picker').querySelector('.dropdown-content');
        const regionDropdownButton = doorAttributeContainer.querySelector('#door-region-picker').querySelector('.dropbtn');
        const areaDropdownContent = doorAttributeContainer.querySelector('#door-area-picker').querySelector('.dropdown-content');
        const areaDropdownButton = doorAttributeContainer.querySelector('#door-area-picker').querySelector('.dropbtn');
        const coordinatesDropdownContent = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropdown-content');
        const coordinatesDropdownButton = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropbtn');

        while (regionDropdownContent.firstChild) {
            regionDropdownContent.removeChild(regionDropdownContent.firstChild);
        }
        while (areaDropdownContent.firstChild) {
            areaDropdownContent.removeChild(areaDropdownContent.firstChild);
        }
        while (coordinatesDropdownContent.firstChild) {
            coordinatesDropdownContent.removeChild(coordinatesDropdownContent.firstChild);
        }

        regionDropdownButton.textContent = "Select";
        areaDropdownButton.textContent = "";
        coordinatesDropdownButton.textContent = "";

        for (const region of regionsData) {            

            let entry = document.createElement('a');
            entry.textContent = region.title;

            if (region.keyword === currentRegion.keyword) {
                regionDropdownButton.textContent = region.title;
                initializeDoorAreaPicker(region, true);
            }

            entry.addEventListener('click', function(event) {
                
                event.preventDefault();
                regionDropdownButton.textContent = region.title;
                initializeDoorAreaPicker(region, true);
                
            });
            regionDropdownContent.appendChild(entry);
        }

        if (currentLocation != null && currentLocation.door != null) {
            
            const _region = getObjectFromKeyword(currentLocation.door.regionKeyword, regionsData);
            regionDropdownButton.textContent = _region.title;
            initializeDoorAreaPicker(_region, false);
        }

    }

    function initializeDoorAreaPicker(region, modifyingDoor) {

        const areaDropdownContent = doorAttributeContainer.querySelector('#door-area-picker').querySelector('.dropdown-content');
        const areaDropdownButton = doorAttributeContainer.querySelector('#door-area-picker').querySelector('.dropbtn');
        
        const coordinatesDropdownContent = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropdown-content');
        const coordinatesDropdownButton = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropbtn');

        
        while (areaDropdownContent.firstChild) {
            areaDropdownContent.removeChild(areaDropdownContent.firstChild);
        }
        while (coordinatesDropdownContent.firstChild) {
            coordinatesDropdownContent.removeChild(coordinatesDropdownContent.firstChild);
        }
        
        areaDropdownButton.textContent = "Select";
        coordinatesDropdownButton.textContent = "";

        for (const area of region.areas) {
                    
            let entry = document.createElement('a');
            entry.textContent = area.title;
            entry.addEventListener('click', function(event) {
                
                event.preventDefault();
                areaDropdownButton.textContent = area.title;
                initializeCoordinates(region, area);
                
            });
            areaDropdownContent.appendChild(entry);
        }

        // modifyingDoor means we have changed the reigon dropdown from the initialized value of the current location we have selected
        if (!modifyingDoor && currentLocation != null && currentLocation.door != null) {
            
            const _area = getObjectFromKeyword(currentLocation.door.areaKeyword, region.areas);        
            areaDropdownButton.textContent = _area.title;
            initializeCoordinates(region, _area);
        }

    }

    function initializeCoordinates(region, area) {
        
        const coordinatesDropdownContent = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropdown-content');
        const coordinatesDropdownButton = doorAttributeContainer.querySelector('#door-coordinate-picker').querySelector('.dropbtn');

        while (coordinatesDropdownContent.firstChild) {
            coordinatesDropdownContent.removeChild(coordinatesDropdownContent.firstChild);
        }

        coordinatesDropdownButton.textContent = "";

        for (const location of area.locations) {
            
            // Skip over coordinates that are already doors
            if (location.door === null) {

                let entry = document.createElement('a');
                entry.textContent = location.coordinates;
                entry.addEventListener('click', function(event) {
                    console.log(area);
                    event.preventDefault();
                    coordinatesDropdownButton.textContent = "[ " + location.coordinates[0] + " , " + location.coordinates[1] + " ]";
                    
                    // If we've picked coordinates, we can set the door attribute
                    currentLocation.door = {
                        regionKeyword: region.keyword,
                        areaKeyword: area.keyword,
                        coordinates: location.coordinates
                    }

                    // find door on the other side and add it                
                    const otherLocation = getLocationFromArea(location.coordinates, area);
                    otherLocation.door = {
                        regionKeyword: currentRegion.keyword,
                        areaKeyword: currentArea.keyword,
                        coordinates: currentLocation.coordinates
                    };
                    
                    updateMap();        
                });

                coordinatesDropdownContent.appendChild(entry);
            }    
        }

        if (currentLocation != null && currentLocation.door != null) {

            coordinatesDropdownButton.textContent = "[ " + currentLocation.door.coordinates[0] + " , " + currentLocation.door.coordinates[1] + " ]";        
        }
    }

    //#endregion

  // #region PRIVATE UTILITIES

    // Called by the Load Button event listener
    async function loadData() {

        try {
            const response = await fetch('Data/regions.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contents = await response.text();
            regionsData = JSON.parse(contents);        

            console.log('File has been loaded successfully.');

        } catch (error) {
            console.error('Error loading file:', error);
        }
    }

    function addEventListeners() {

        // LOAD BUTTON
        document.getElementById('load-button').addEventListener('click', async function() {
            
            loadData();
        });

        document.getElementById('save-button').addEventListener('click', async function() {

            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'regions.json',
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            const writableStream = await fileHandle.createWritable();

            try {

                // Convert JSON object to string
                const jsonString = JSON.stringify(regionsData, null, 2);

                // Write the JSON string to the file
                await writableStream.write(jsonString);

                // Close the file and save the changes
                await writableStream.close();

                console.log('File has been updated successfully.');
            } catch (error) {
                console.error('Error writing file:', error);        
            }
        });

        document.getElementById('new-object-button').addEventListener('click', async function() {

            if (currentLocation === null) return;
            initializeNewObjectPicker();
        });

        document.getElementById('cancel-button').addEventListener('click', async function() {

            closeNewObjectPicker();
        });

        document.getElementById('create-object-button').addEventListener('click', async function() {
            
            createNewObject();
        });

        createDoorButton.addEventListener('click', async function() {
            
            createDoor();
        });

        removeDoorButton.addEventListener('click', async function() {
            
            removeDoor();
        });

        navArea.addEventListener('click', async function() {
            
            areaSection.style.display = "block";
            mapSection.style.display = "none";
            navArea.classList.remove("disabled");
            navArea.classList.add("selected");
            navMap.classList.remove("selected");
            navMap.classList.add("disabled");
        });

        navMap.addEventListener('click', async function() {
            
            areaSection.style.display = "none";
            mapSection.style.display = "block";
            navArea.classList.remove("selected");
            navArea.classList.add("disabled");
            navMap.classList.remove("disabled");
            navMap.classList.add("selected");
        });

        newRegionButton.addEventListener('click', async function() {
            
            createNewRegion();
        });

        newAreaButton.addEventListener('click', async function() {
            
            createNewArea();
        });

        document.addEventListener('keydown', function(event) { if (event.key === 'Backspace') { removeLocation(currentLocation); playClick(); } });

        // Add event listeners for keydown and keyup
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Control') {        
                isLeftCtrlHeld = true;
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === 'Control') {        
                isLeftCtrlHeld = false;
            }
        });

        keywordInput.addEventListener('input', function(event) {
            
            if (currentArea === null && currentRegion != null) { 
                currentRegion.keyword = event.target.value;
            }
            else if (currentArea != null) {
                currentArea.keyword = event.target.value;
            }    
        });

        titleInput.addEventListener('input', function(event) {
            
            if (currentArea === null && currentRegion != null) {
                if (currentEntry != null) currentEntry.textContent = event.target.value;
                document.querySelector('#region-picker-container').querySelector('.dropbtn').textContent = event.target.value;
                currentRegion.title = event.target.value;
            }
            else if (currentArea != null) {
                if (currentEntry != null) currentEntry.textContent = event.target.value;
                document.querySelector('#area-picker-container').querySelector('.dropbtn').textContent = event.target.value;
                currentArea.title = event.target.value;            
            }    
        });

        descriptionInput.addEventListener('input', function(event) {
            
            if (currentArea === null && currentRegion != null) { 
                currentRegion.description = event.target.value;
            }
            else if (currentArea != null)
                currentArea.description = event.target.value;
        });

    }

    function getLocationFromDoor(door) {

        const region = getObjectFromKeyword(door.regionKeyword, regionsData);    
        const area = getObjectFromKeyword(door.areaKeyword, region.areas);    
        const location = getLocationFromArea(door.coordinates, area);

        return location;
    }

    function createPath(locationA, locationB) {
    console.log("create");
        // Check there is a location at the coordinate in this direction from our current location
        if (getLocationInDirection(locationA.coordinates, currentArea, "north") != null && compareArrays(getLocationInDirection(locationA.coordinates, currentArea, "north").coordinates, locationB.coordinates)) {
            locationA.north = locationB.coordinates;
            locationB.south = locationA.coordinates;
        }
                
        // Check there is a location at the coordinate in this direction from our current location
        if (getLocationInDirection(locationA.coordinates, currentArea, "west") != null && compareArrays(getLocationInDirection(locationA.coordinates, currentArea, "west").coordinates, locationB.coordinates)) {
            locationA.west = locationB.coordinates;
            locationB.east = locationA.coordinates;
        }


        // Check there is a location at the coordinate in this direction from our current location
        if (getLocationInDirection(locationA.coordinates, currentArea, "east") != null && compareArrays(getLocationInDirection(locationA.coordinates, currentArea, "east").coordinates, locationB.coordinates)) {
            locationA.east = locationB.coordinates;
            locationB.west = locationA.coordinates;
        }
                
        // Check there is a location at the coordinate in this direction from our current location
        if (getLocationInDirection(locationA.coordinates, currentArea, "south") != null && compareArrays(getLocationInDirection(locationA.coordinates, currentArea, "south").coordinates, locationB.coordinates)) {
            locationA.south = locationB.coordinates;
            locationB.north = locationA.coordinates;
        }
        
    }

    function removePath(locationA, locationB) {
        console.log("remove");

        // Check there is a location at the coordinate in this direction from our current location
        if (locationA.north != null &&  compareArrays(locationA.north, locationB.coordinates)) {
            locationA.north = null;
            locationB.south = null;
        }
        if (locationA.west != null && compareArrays(locationA.west, locationB.coordinates)) {
            locationA.west = null;
            locationB.east = null;
        }
        if (locationA.east != null && compareArrays(locationA.east, locationB.coordinates)) {
            locationA.east = null;
            locationB.west = null;
        }
        if (locationA.south != null && compareArrays(locationA.south, locationB.coordinates)) {
            locationA.south = null;
            locationB.north = null;
        }

    }

    function pathIsBlocked(locationA, locationB) {
    
        let locationABlockedDirections = [];
        let locationBBlockedDirections = [];
    
        // Check present items for anything blocking exits    
        let _items = locationA.items;
        
        if (_items != undefined && _items.length > 0 && _items != "") {
        
            _items.forEach((element,index) => {
                
                let item = itemsRef[getIndexFromKeyword(element, itemsRef)];
                
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
                
                let item = itemsRef[getIndexFromKeyword(element, itemsRef)];
                
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
    
        let isBlocked = false;    
    
        // If locationA has a coordinate listed to the north
        if (locationA.north != null) {
            // Check if locationA's north exit coordinates match LocationB's coordinates, and check if LocationB's south coordinates match LocationA's coordinates
            if (compareArrays(locationA.north, locationB.coordinates) && compareArrays(locationB.south, locationA.coordinates))
                // Check if LocationA has a blocked direction to the north, or if locationB has a block to the south
                if (locationABlockedDirections.includes(0) || locationBBlockedDirections.includes(3))
                    isBlocked = true;
        }
        if (locationA.west != null) {
            if (compareArrays(locationA.west, locationB.coordinates) && compareArrays(locationB.east, locationA.coordinates))
                if (locationABlockedDirections.includes(1) || locationBBlockedDirections.includes(2))
                    isBlocked = true;
        }
        if (locationA.east != null) {
            if (compareArrays(locationA.east, locationB.coordinates) && compareArrays(locationB.west, locationA.coordinates))
                if (locationABlockedDirections.includes(2) || locationBBlockedDirections.includes(1))    
                    isBlocked = true;
        }
        if (locationA.south != null) {
            if (compareArrays(locationA.south, locationB.coordinates) && compareArrays(locationB.north, locationA.coordinates))
                if (locationABlockedDirections.includes(3) || locationBBlockedDirections.includes(0))
                    isBlocked = true;
        }
        
        return isBlocked;
    }
    
    //#endregion

})();