// This script holds code that runs immediately at runtime

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
});

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

buttonMaster.onmouseover = (event) => { if (button1.classList.contains("can-hover")) playClick(); };
inventoryIcon.onmouseover = (event) => { playClick(); };

document.addEventListener('keydown', function(event) { if (event.code == 'KeyW') { go(0, true); playClick(); } });            // North
document.addEventListener('keydown', function(event) { if (event.code == 'KeyA') { go(1, true); playClick(); } });            // West
document.addEventListener('keydown', function(event) { if (event.code == 'KeyD') { go(2, true); playClick(); } });            // East
document.addEventListener('keydown', function(event) { if (event.code == 'KeyS') { go(3, true); playClick(); } });            // South
document.addEventListener('keydown', function(event) { if (event.code == 'Enter') { go(4, true); playClick(); } });           // For "Next" buttons

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyQ') {
        console.log("Debug - Q");
    }
});


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


document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener('scroll', function() {
        
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // We wait till all async processes have completed before starting the game
    Promise.all([promise1, promise2, promise3]).then((values) => {
        
        loading();
    });
});

async function loading() {
    
    await loadData();
    
    initializeGame();
}