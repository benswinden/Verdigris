
// enum
export const objectType = {
    null: 'null',
    region: 'region',
    area: 'area',
    location: 'location',
    action: 'action',    
    monster: 'monster',
    item: 'item',
    npc: 'npc',    
}

// Get an index from an array of the given type.
// i.e. I want to find a location named "keyword"
export function getIndexFromKeyword(keyword, ar) {

    let index = -1;

    ar.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            index = i;            
        }
    });

    if (index === -1) console.error("getIndexFromkeyword() - Failed to find keyword [" + keyword + "] from array [" + ar + "]");
    return index;
    }

export function getElementFromKeyword(keyword, array) {

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

export function getObjectFromKeyword(keyword, array) {

    if (array === undefined || array === null) console.error("getObjectFromKeyword() - keyword [" + keyword + "] No array provided");
    if (array.length === 0) console.warn("getObjectFromKeyword() - keyword [" + keyword + "] - Array length 0");

    let obj = null;
    
    array.forEach((element, i) => {        
        if (element.keyword === keyword) {
            
            obj = element;            
        }
    });
        
    return obj;
}  

export function getLocationFromCurrentArea(coordinates) {

    let loc = null;

    currentArea.locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, coordinates)) {
            
            loc = element;            
        }
    });

    return loc;
}

export function getLocationFromArea(coordinates, area) {        

    let loc = null;

    area.locations.forEach((element, i) => {                

        if (compareArrays(element.coordinates, coordinates)) {
            
            loc = element;            
        }
    });

    //if (loc === null) console.warn("getLocationFromArea - Coordinates: [" + coordinates + "]    Area: [" + area + "] is null");
    return loc;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function playClick() {

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
export function compareArrays(arr1, arr2) {
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
export function compareObjects(obj1, obj2) {
    
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
export function compareAreas(area1, area2) {

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
export function getLocationInDirection(coordinates, area, direction) {
  
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
export function getExitFromLocation(location, area) {
    
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

export function locationsHavePath(locationA, locationB, itemsArray) {
    
    let locationABlockedDirections = [];
    let locationBBlockedDirections = [];

    // Check present items for anything blocking exits    
    let _items = locationA.items;
    
    if (_items != undefined && _items.length > 0 && _items != "") {
    
        _items.forEach((element,index) => {
            
            let item = itemsArray[getIndexFromKeyword(element, itemsArray)];
            
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
            
            let item = itemsArray[getIndexFromKeyword(element, itemsArray)];
            
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

    let hasPath = false;    

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
