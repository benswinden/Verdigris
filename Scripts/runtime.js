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

button1.onmouseover = (event) => { if (button1.classList.contains("can-hover")) playClick(); };
button2.onmouseover = (event) => { if (button2.classList.contains("can-hover")) playClick(); };
button3.onmouseover = (event) => { if (button3.classList.contains("can-hover")) playClick(); };
button4.onmouseover = (event) => { if (button4.classList.contains("can-hover")) playClick(); };
button5.onmouseover = (event) => { if (button5.classList.contains("can-hover")) playClick(); };
button6.onmouseover = (event) => { if (button6.classList.contains("can-hover")) playClick(); };
button7.onmouseover = (event) => { if (button7.classList.contains("can-hover")) playClick(); };
button8.onmouseover = (event) => { if (button8.classList.contains("can-hover")) playClick(); };
inventoryIcon.onmouseover = (event) => { playClick(); };

document.addEventListener('keydown', function(event) { if (event.code == 'KeyW') { go(0); playClick(); } });          // North
document.addEventListener('keydown', function(event) { if (event.code == 'KeyA') { go(1); playClick(); } });        // West
document.addEventListener('keydown', function(event) { if (event.code == 'KeyD') { go(2); playClick(); } });       // East
document.addEventListener('keydown', function(event) { if (event.code == 'KeyS') { go(3); playClick(); } });        // South
document.addEventListener('keydown', function(event) { if (event.code == 'Enter') { go(4); playClick(); } });            // For "Next" buttons

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