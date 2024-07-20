// This script holds code that runs immediately at runtime

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


// DEBUG
debugButton1.onclick = function() { resetGame()};
debugButton2.onclick = function() { let x = currentContext; let y = currentContextType; let z = storedLocation; resetGame(); changeContextDirect(x,y); storedLocation = z; };  
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