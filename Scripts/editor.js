
let currentArea = 0;
let currentLocation = null;

let mapInitialize = false;
let mapGrid = [];

let showDebugLog = true;

let areasData = [];
let items = [];
let monstersRef = [];

let areasTemp = [];

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
    monstersRef = Papa.parse(data, config).data;
    // Filter out empty rows
    monstersRef = monstersRef.filter(({ keyword }) => keyword != null);
});


// We wait till all async processes have completed before starting the game
Promise.all([promise1, promise2]).then((values) => {
    
    loadData();
    initalizeMap();
    initializeAreaPicker();
    
  });


function loadArea() {

    updateMap();
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

function initializeAreaPicker() {

    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');

    for (let i = 1; i <= 10; i++) {
        const entry = document.createElement('a');
        entry.href = '#';
        entry.textContent = `Entry ${i}`;
        entry.addEventListener('click', function(event) {
            event.preventDefault();
            dropbtn.textContent = `Selected: Entry ${i}`;
        });

        dropdownContent.appendChild(entry);
    }
}

function updateMap() {

    if (showDebugLog) console.log("updateMap() - ");

    if (areasData[currentArea].locations.length > 0) {

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
                                                         
                    if (currentLocation != null && checkIsAdjacent(currentLocation.coordinates, [y,x])) {                        
                        createPath(currentLocation, newLocation);
                        currentLocation = null;
                    }
                    else if (currentLocation === null || (currentLocation != null && !checkIsAdjacent(currentLocation.coordinates, [y,x])))
                        currentLocation = newLocation;

                    updateMap();
                }                                
            }
        }

        // Cycle through all locations in this area
        areasData[currentArea].locations.forEach((location, index) => {

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

                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "north")))
                        nodeObject.north.classList = "horizontal-square inactive";
                }
            }
            if (nodeObject.west != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "west") != null) {                                    
          
                    if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "west").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                        isAdjacentToCurrent = true;                                                        
                    }
                    
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "west")))
                        nodeObject.west.classList = "vertical-square inactive";                   
                }
            }
            if (nodeObject.east != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "east") != null) {
                 
                    if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "east").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                        isAdjacentToCurrent = true;                                                        
                    }
                    
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "east")))
                        nodeObject.east.classList = "vertical-square inactive";               
                }
            }
            if (nodeObject.south != null) {                          
                if (getLocationInDirection(location.coordinates, currentArea, "south") != null) {
                
                    if (currentLocation != null && compareArrays(getLocationInDirection(location.coordinates, currentArea, "south").coordinates, currentLocation.coordinates)) {   // Is the location adjacent to us the player's current location?
                        isAdjacentToCurrent = true;                                                        
                    }
                    
                    if (locationsHavePath(location, getLocationInDirection(location.coordinates, currentArea, "south")))
                        nodeObject.south.classList = "horizontal-square inactive";
                 
                }
            }            

            // Set this location square to active                        
            nodeObject.element.classList = "main-square active can-hover"

            // If this location is adjacent to the player's current location, it is hoverable and clickable to move here
            if (currentLocation != null && isAdjacentToCurrent) {
                
                nodeObject.element.onclick = function() { 
                    playClick();
                    const _currentLocation = currentLocation;   // Store this so we can set the actual value to null but still use the current store location                    
                    currentLocation = null;

                    // If there is already a path, remove it
                    if (locationsHavePath(_currentLocation, location)) {
                        removePath(_currentLocation, location);
                    }
                    // Otherwise, create a path between these two
                    else {
                        createPath(_currentLocation, location);
                    }

                    updateMap();
                };
            }
            else if (currentLocation === null) {
                
                nodeObject.element.onclick = function() { 
                    toggleNode(location);
                    playClick();
                };
            }

            if (location.door != null) {
                nodeObject.element.classList += " door";
            }

        });

        // Insert player symbol in current location        
        let currentLocationNode = null;
        if (currentLocation != null) {

            currentLocationNode = mapGrid[currentLocation.coordinates[0]][currentLocation.coordinates[1]];
            currentLocationNode.element.classList = "main-square current  can-hover"

            currentLocationNode.element.onclick = function() { 
                toggleNode(currentLocation);
                playClick();
            };
        }

    }
    else
        console.error("updateMap - Current Area: " + currentArea + " has no locations");
}

function toggleNode(location) {

    if (currentLocation != null && compareArrays(location.coordinates, currentLocation.coordinates))        
        currentLocation = null;
    else
        currentLocation = location;

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
    
    areasData[currentArea].locations.push(newLocation);
    return newLocation;
}

function removeLocation(location) {

    if (areasData === null) return;
    
    if (areasData[currentArea].locations.indexOf(location) != -1) {
        areasData[currentArea].locations.splice(areasData[currentArea].locations.indexOf(location), 1)
        currentLocation = null;        
        updateMap();
    }
    else
        console.error("removeLocation() - failed")
}

function checkIsAdjacent(coordinatesA, coordinatesB) {

    
    let isAdjacent = false;
    console.log(coordinatesA);
console.log([coordinatesA[0],coordinatesA[1]+1], coordinatesB);
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

/////////
// UTILITIES - Copy Pasted from Functions on Sept. 22
////////


function getLocationFromArea(coordinates, area) {
    
    let _area = null;
    if (Number.isInteger(area))
        _area = area;
    else
        _area = getIndexFromKeyword(area, objectType.area);

    let loc = null;
    
    areasData[_area].locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, coordinates)) {
            
            loc = element;            
        }
    });

    return loc;
  }

  function getIndexFromKeyword(keyword, objType) {
    
    ar = [];    
    switch (objType) {
        case objectType.area://Location        
            ar = areasData;
            break;
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


// LOAD BUTTON
document.getElementById('load-button').addEventListener('click', async function() {
    
    loadData();
});

async function loadData() {

    try {
        const response = await fetch('Data/areas.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contents = await response.text();
        areasData = JSON.parse(contents);
        loadArea();
        console.log('File has been loaded successfully.');

    } catch (error) {
        console.error('Error loading file:', error);
    }
}

// SAVE BUTTON
document.getElementById('save-button').addEventListener('click', async function() {

    const fileHandle = await window.showSaveFilePicker({
        types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
        }]
    });

    const writableStream = await fileHandle.createWritable();

    try {

        // Convert JSON object to string
        const jsonString = JSON.stringify(areasData, null, 2);

        // Write the JSON string to the file
        await writableStream.write(jsonString);

        // Close the file and save the changes
        await writableStream.close();

        console.log('File has been updated successfully.');
    } catch (error) {
        console.error('Error writing file:', error);        
    }
});

document.addEventListener('keydown', function(event) { if (event.key === 'Backspace') { removeLocation(currentLocation); playClick(); } });