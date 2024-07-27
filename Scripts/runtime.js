// This script holds code that runs immediately at runtime

inventoryIcon.onclick = displayInventory;

document.addEventListener('keydown', function(event) {
    if (event.code == 'Escape') {
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

document.addEventListener('keydown', function(event) { if (event.code == 'KeyW') go(0); });          // North
document.addEventListener('keydown', function(event) { if (event.code == 'KeyA') go(1); });        // West
document.addEventListener('keydown', function(event) { if (event.code == 'KeyD') go(2); });       // East
document.addEventListener('keydown', function(event) { if (event.code == 'KeyS') go(3); });        // South
document.addEventListener('keydown', function(event) { if (event.code == 'Enter') go(4); });            // For "Next" buttons

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyQ') {
        console.log("Debug - Q");
    }
});


// DEBUG
debugButton1.onclick = function() { console.log("Debug: Reset Game"); resetGame()};
debugButton2.onclick = function() { console.log("Debug: Reset & Resume " + storedLocation); let x = currentContext; let y = currentContextType; let z = storedLocation; resetGame();storedLocation = z;  changeContextDirect(x,y);};  
debugButton2b.onclick = function() { console.log("Debug: Kill Monster"); if (currentContextType == 3) monsterDeath();}
debugButton3.onclick = function() { xp++; save(); updateStats();};
debugButton4.onclick = function() { hp++; save(); updateStats();};
debugButton5.onclick = function() { gold++; save(); updateStats();};

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



initializeGame();