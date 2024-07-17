// This script holds code that runs immediately at runtime


initializeGame();

document.addEventListener('keydown', function(event) {
    if (event.code == 'Tab') {
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