import { commands } from "../Redesign_Data/commands.js";
import { enemies } from "../Redesign_Data/enemies.js";
import { scripts } from "../Redesign_Data/scripts.js";
import {
    getObjectFromKeyword,    
    playClick,
    deepCopyWithFunctions,
    log
} from "./Util.js";

const VERDIGRIS = (function() {

    let hpCurrent = 225;
    let hpMax = 226;
    let energyCurrent = 2;
    let energyMax = 2;

    let scriptDrawCurrent = 4;

    let createdPlayerCommandObjects = [];
    let createdEnemyCommandObjects = [];

    let currentEnemy;

    let playerInstalledScripts = [];
    let hand = [];
    let deck = [];
    let discard = [];

    let cycleRunning = false;

    /*
    *   DOM Elements    
    */
    const enemyCard = document.querySelector('.enemy-card');
    const enemyScriptContainer1 = enemyCard.querySelector('.enemy-script-container-1');
    const enemyScriptContainer2 = enemyCard.querySelector('.enemy-script-container-2');
    const enemyScriptContainer3 = enemyCard.querySelector('.enemy-script-container-3');
    const enemyScriptContainer4 = enemyCard.querySelector('.enemy-script-container-4');
    const enemyEnergyMarkerContainer = enemyCard.querySelector('#enemy-energy-marker-container');
    const enemyLevelText = enemyCard.querySelector('.enemy-level-text');
    const enemyNameText = enemyCard.querySelector('.enemy-card-title-text');
    const enemyTypeText = enemyCard.querySelector('.enemy-card-type-text');
    const enemyModText = enemyCard.querySelector('.enemy-card-mod-text');
    const enemyHPBar = document.querySelector('.enemy-hp-bar-current');
    const enemyHPText = enemyCard.querySelector('.enemy-hp-text');
    
    const handContainer = document.querySelector('#hand-container');
    const drawNumber = document.querySelector('#draw-indicator');
    const discardNumber = document.querySelector('#discard-indicator');
    const playerScriptContainerMaster = document.querySelector('#player-script-container-master');      // player script containers represent the scripts you have drawn into your hand

    const playerCommandContainer = document.querySelector('#player-command-container');
    const commandIndicator = document.querySelector('#player-command-indicator');
    const enemyCommandContainer = document.querySelector('#enemy-command-container');
    const playerHPBar = document.querySelector('#player-hp-bar-current');
    const playerHPText = document.querySelector('#player-hp-text');

    const playerEnergyContainer = document.querySelector('#energy-marker-container');
    const cycleButton = document.querySelector('#cycle-button');

    document.addEventListener('DOMContentLoaded', function() {

        document.addEventListener('keydown', function(event) {

            if (event.code == 'Enter') {
                runCycle();
            }
        });

        initializeEncounter();
    });
    
    function initializeEncounter() {
        
        for (let index = 0; index < 5; index++) 
            installScript(scripts[0]);
        installScript(scripts[1]);
        for (let index = 0; index < 2; index++) 
            installScript(scripts[2]);
        for (let index = 0; index < 2; index++) 
            installScript(scripts[3]);

        updateHP();        
        displayEnemy(enemies[0]);
        updateEnergy();
        deactivateCycleButton();

        hand = [];
        deck = [];
        discard = [];
        
        for (const obj of playerInstalledScripts) {            
            deck.push(obj);
        }

        shuffleArray(deck);
        drawNumber.innerText = deck.length;
        discardNumber.innerText = "0";
        for (let index = 0; index < scriptDrawCurrent; index++)
            drawScript();
    }

    function startNewTurn() {

        log("Start New Turn -");
        deactivateCycleButton();

        displayEnemy(currentEnemy);

        // Discard hand        
        for (let index = 0; index < hand.length; index++) {
            const script = hand[index];
            discard.push(script);
            discardNumber.innerText = discard.length;            
        }        

        hand = [];        

        createdPlayerCommandObjects = [];
        playerCommandContainer.innerHTML = "";
        energyCurrent = energyMax;
        updateEnergy();
        
        if (hand.length < scriptDrawCurrent) {

            const cardDrawNumber = scriptDrawCurrent - hand.length;
            for (let index = 0; index < cardDrawNumber; index++)
                drawScript();
        }
    }

    function drawScript() {
        
        let script = deck.splice(0,1)[0];        
        hand.push(script);
        updateHand();
    }

    function updateHand() {

        handContainer.innerHTML = "";

        for (const script of hand) {
            
            let newScriptContainer = playerScriptContainerMaster.cloneNode(true);
            handContainer.appendChild(newScriptContainer);
            newScriptContainer.id = "";
            // Input information into the info card
            newScriptContainer.querySelector('.info-card-icon').src = "Redesign_Assets/Scripts/Icon_" + script.icon + ".svg";
            newScriptContainer.querySelector('.info-card-title').innerHTML = script.name.replace(/ /g, '<br>');
            newScriptContainer.querySelector('.info-card-type').innerHTML = script.type;
            const commandContainer = newScriptContainer.querySelector('.info-card-command-container');

            for (const command of script.commands) {

                const commandObject = getObjectFromKeyword(command, commands);
                const newCommandElement = document.createElement('div');
                newCommandElement.classList = "info-card-command";
                commandContainer.appendChild(newCommandElement);                
                newCommandElement.innerHTML = "<span class=\"gray-text\">█</span> " + commandObject.action.actionText(false);
            }

            for (let index = 0; index < script.cost; index++) {
                let newEnergyMarker = document.createElement('div');
                newEnergyMarker.classList.add("info-card-energy-marker");
                newScriptContainer.querySelector('.info-card-energy-container').appendChild(newEnergyMarker);
            }

            newScriptContainer.querySelector('.player-script-icon').src = "Redesign_Assets/Scripts/Icon_" + script.icon + ".svg";

            if (energyCurrent >= script.cost) {
                newScriptContainer.querySelector('.player-script-box').classList.add("can-hover-active");

                newScriptContainer.querySelector('.player-script-box').addEventListener('click', function() {
                    executeScript(script);
                });
            }
            else
                newScriptContainer.querySelector('.player-script-box').classList.add("can-hover-inactive");


            // Set onmouseover event
            newScriptContainer.querySelector('.player-script-box').addEventListener('mouseover', function() {
                newScriptContainer.querySelector('.player-script-info-card').style.display = "flex";
            });
            newScriptContainer.querySelector('.player-script-box').addEventListener('mouseleave', function() {
                newScriptContainer.querySelector('.player-script-info-card').style.display = "none";
            });        
        }
    }

    function updateEnergy() {
        
        playerEnergyContainer.innerHTML = "";    

        for (let index = 0; index < energyCurrent; index++) {
            
            const energyMarker = document.createElement('div');
            energyMarker.classList = "energy-marker full";
            playerEnergyContainer.appendChild(energyMarker);
        }

        if (energyMax != energyCurrent) {
            for (let index = 0; index < energyMax - energyCurrent; index++) {
                const energyMarker = document.createElement('div');
                energyMarker.classList = "energy-marker empty";
                playerEnergyContainer.appendChild(energyMarker);        
            }
        }

    }

    // When a player plays a script during their turn
    function executeScript(script) {
        
        if (energyCurrent >= script.cost) {
            energyCurrent -= script.cost;
            updateEnergy();
        }
        else
            return;

        for (const command of script.commands) {

            let commandCopy = deepCopyWithFunctions(getObjectFromKeyword(command, commands));                    

            let newCommandElement = document.createElement('div');
            newCommandElement.className = 'player-command';            
            newCommandElement.innerHTML = commandCopy.action.actionText();
            playerCommandContainer.appendChild(newCommandElement);

            let newCommandObject = {
                command: commandCopy,
                element: newCommandElement
            }

            createdPlayerCommandObjects.push(newCommandObject);

            discard.push(script);
            discardNumber.innerText = discard.length;
            hand.splice(hand.indexOf(script), 1);
            updateHand();
            activateCycleButton();
        }        
    }

    function updateHP() {

        playerHPText.innerText = hpCurrent + "/" + hpMax;
        let HPCurrentPercent = hpCurrent / hpMax;        
        playerHPBar.style.width = (HPCurrentPercent * 610 + 2)  + 'px';
    }    

    // When a script is added to your deck
    function installScript(script) {        
        const scriptCopy = deepCopyWithFunctions(script);
        playerInstalledScripts.push(scriptCopy);        
    }    

    function displayEnemy(enemy) {

        currentEnemy = enemy;

        enemyLevelText.innerText = enemy.level;
        enemyNameText.innerText = enemy.name;
        enemyTypeText.innerText = enemy.type;

        installEnemyScripts();
        executeEnemyScripts();
        updateEnemy();
    }

    function installEnemyScripts() {

        currentEnemy.installedScripts = [];

        // Reset script containers
        for (let index = 0; index < 4; index++) {
            let container = null;
            switch (index) {
                case 0:
                    container = enemyScriptContainer1;
                    break;
                case 1:
                    container = enemyScriptContainer2;
                    break;
                case 2:
                    container = enemyScriptContainer3;
                    break;
                case 3:
                    container = enemyScriptContainer4;
                    break;
            }
             
            container.querySelector('.enemy-script-number').style.display = "block";
            container.querySelector('.enemy-script-icon').src = "";
            container.querySelector('.enemy-script-box').classList = "enemy-script-box";
        }

        for (let index = 0; index < currentEnemy.scripts.length; index++) {
            
            let container = null;
            let scriptCopy = deepCopyWithFunctions(getObjectFromKeyword(currentEnemy.scripts[index], scripts));
            currentEnemy.installedScripts.push(scriptCopy);
            
            switch (index) {
                case 0:
                    container = enemyScriptContainer1;
                    break;
                case 1:
                    container = enemyScriptContainer2;
                    break;
                case 2:
                    container = enemyScriptContainer3;
                    break;
                case 3:
                    container = enemyScriptContainer4;
                    break;
            }
            
            container.querySelector('.enemy-script-number').style.display = "none";

            // Input information into the info card
            container.querySelector('.info-card-icon').src = "Redesign_Assets/Scripts/Icon_" + scriptCopy.icon + ".svg";
            container.querySelector('.info-card-title').innerHTML = scriptCopy.name.replace(/ /g, '<br>');
            container.querySelector('.info-card-type').innerHTML = scriptCopy.type;
            const commandContainer = container.querySelector('.info-card-command-container');

            for (const command of scriptCopy.commands) {

                const commandObject = getObjectFromKeyword(command, commands);
                const newCommandElement = document.createElement('div');
                newCommandElement.classList = "info-card-command";
                commandContainer.appendChild(newCommandElement);                
                newCommandElement.innerHTML = "<span class=\"gray-text\">█</span> " + commandObject.action.actionText(false);
            }

            for (let index = 0; index < scriptCopy.cost; index++) {
                let newEnergyMarker = document.createElement('div');
                newEnergyMarker.classList.add("info-card-energy-marker");
                container.querySelector('.info-card-energy-container').appendChild(newEnergyMarker);
            }

            container.querySelector('.enemy-script-icon').src = "Redesign_Assets/Scripts/Icon_" + scriptCopy.icon + ".svg";            
            container.querySelector('.enemy-script-box').classList.add("can-hover-active");            

            // Set onmouseover event
            container.querySelector('.enemy-script-box').addEventListener('mouseover', function() {
                container.querySelector('.enemy-script-info-card').style.display = "flex";
            });
            container.querySelector('.enemy-script-box').addEventListener('mouseleave', function() {
                container.querySelector('.enemy-script-info-card').style.display = "none";
            });        
        }
    }

    function executeEnemyScripts() {

        enemyCommandContainer.innerHTML = "";
        createdEnemyCommandObjects = [];

        for (const script of currentEnemy.installedScripts) {
            
            for (const command of script.commands) {

                let commandCopy = deepCopyWithFunctions(getObjectFromKeyword(command, commands));
                log(currentEnemy.name +" executing " + script.name + " - Injecting command: " + commandCopy.action.actionText());

                let newCommandElement = document.createElement('div');
                newCommandElement.className = 'enemy-command';
                newCommandElement.innerHTML = commandCopy.action.actionText();
                enemyCommandContainer.appendChild(newCommandElement);

                let newCommandObject = {
                    command: commandCopy,
                    element: newCommandElement
                }

                createdEnemyCommandObjects.push(newCommandObject);
            }
        }
    }

    function updateEnemy() {

        enemyEnergyMarkerContainer.innerHTML = "";
        for (let index = 0; index < currentEnemy.energyCurrent; index++) {
            
            const energyMarker = document.createElement('div');
            energyMarker.classList = "energy-marker full";
            enemyEnergyMarkerContainer.appendChild(energyMarker);
        }

        if (energyMax != currentEnemy.energyCurrent) {
            for (let index = 0; index < energyMax - currentEnemy.energyCurrent; index++) {
                const energyMarker = document.createElement('div');
                energyMarker.classList = "energy-marker empty";
                enemyEnergyMarkerContainer.appendChild(energyMarker);        
            }
        }
    

        enemyHPText.innerText = currentEnemy.hpCurrent + "/" + currentEnemy.hpMax;
        let HPCurrentPercent = currentEnemy.hpCurrent / currentEnemy.hpMax;        
        enemyHPBar.style.width = (HPCurrentPercent * 290 + 2)  + 'px';
    }

    function activateCycleButton() {

        cycleButton.classList.add("can-hover");
        cycleButton.onclick = function() {
            runCycle();
            deactivateCycleButton();
        }; 
    }

    function deactivateCycleButton() {

        cycleButton.classList.remove("can-hover");
        cycleButton.onclick = "";
    }

    async function runCycle() {
        
        if (cycleRunning) return;

        log("runCycle - Begin"); playClick();

        cycleRunning = true;

        commandIndicator.classList.add("active");       // Visually activate the command indicator, this display where in the command stack we currently are

        // Cycle through all created player command
        for (let index = 0; index < createdPlayerCommandObjects.length; index++) {

            let playerCommandObject = createdPlayerCommandObjects[index];
            playerCommandObject.element.classList.add("active");
            log("Running - [" + playerCommandObject.command.action.actionText(false) + "]"); playClick();        

            // Cycle through all enemy commands, testing the behaviour between each pairing
            for (let index = 0; index < createdEnemyCommandObjects.length; index++) {

                const enemyCommandObject = createdEnemyCommandObjects[index];
                
                enemyCommandContainer.insertBefore(commandIndicator, enemyCommandObject.element);       // Move the visual indicator before the current command being compared            
                log("   ["+playerCommandObject.command.action.actionText(false)+"] Encountered - " + enemyCommandObject.command.action.actionText()); playClick();
                await waitForButtonPress();
                
                let commandOutcome = "   ["+playerCommandObject.command.action.actionText(false)+"] " + enemyCommandObject.command.func(playerCommandObject);            
                playerCommandObject.element.innerHTML = playerCommandObject.command.action.actionText(true);       // Update the element for the player command
                enemyCommandObject.element.innerHTML = enemyCommandObject.command.action.actionText();          // Update the element for the enemy command                
                if (enemyCommandObject.command.action.actionValueCurrent === 0) enemyCommandObject.element.classList.add("inactive");

                log (commandOutcome); playClick();                
            }
            
            enemyCommandContainer.appendChild(commandIndicator);        // Place the command indicator at the end of the list of commands
            log("   ["+playerCommandObject.command.action.actionText(false)+"] - Arrived at "+ currentEnemy.name +" Kernel"); playClick();
            await waitForButtonPress();

            // Player command has reached the enemy kernel
            let commandOutcome = playerCommandObject.command.func(currentEnemy);
            log ("   ["+playerCommandObject.command.action.actionText(false)+"] " + commandOutcome); playClick();

            log("   ["+playerCommandObject.command.action.actionText(false)+"] Command Completed."); playClick();
            playerCommandObject.element.classList.remove("active");
        }
        
        log("runCycle - Completed"); playClick();

        commandIndicator.classList.remove("active");
        playerCommandContainer.appendChild(commandIndicator);

        cycleRunning = false;
        startNewTurn();
    }

    async function waitForButtonPress() {
        return new Promise(resolve => {
            
            function handler(event) {
                if (event.code === 'ArrowRight') {
                    document.removeEventListener('keydown', handler);
                    resolve();
                }
            }
            document.addEventListener('keydown', handler);
        });
    }
    
//#region UTILITIES

function shuffleArray(array) {
    
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }    
}

//#endregion


    return {
        updateEnemy
    };

})();

export const { updateEnemy } = VERDIGRIS;