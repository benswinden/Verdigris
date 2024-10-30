import { commands } from "../Redesign_Data/commands.js";
import { enemies } from "../Redesign_Data/enemies.js";
import {
    getObjectFromKeyword,    
    playClick,
    deepCopyWithFunctions,
    log
} from "./Util.js";

const VERDIGRIS = (function() {

    let hpCurrent = 225;
    let hpMax = 226;

    let createdPlayerCommandObjects = [];
    let createdEnemyCommandObjects = [];

    let currentEnemy;

    /*
    *   DOM Elements    
    */
    const enemyCard = document.querySelector('.enemy-card');
    const enemyScriptContainer1 = enemyCard.querySelector('.enemy-script-container-1');
    const enemyScriptContainer2 = enemyCard.querySelector('.enemy-script-container-2');
    const enemyScriptContainer3 = enemyCard.querySelector('.enemy-script-container-3');
    const enemyScriptContainer4 = enemyCard.querySelector('.enemy-script-container-4');
    const enemyLevelText = enemyCard.querySelector('.enemy-level-text');
    const enemyNameText = enemyCard.querySelector('.enemy-card-title-text');
    const enemyTypeText = enemyCard.querySelector('.enemy-card-type-text');
    const enemyModText = enemyCard.querySelector('.enemy-card-mod-text');
    const enemyHPBar = document.querySelector('.enemy-hp-bar-current');
    const enemyHPText = enemyCard.querySelector('.enemy-hp-text');

    const playerCommandContainer = document.querySelector('#player-command-container');
    const commandIndicator = document.querySelector('#player-command-indicator');
    const enemyCommandContainer = document.querySelector('#enemy-command-container');
    const playerHPBar = document.querySelector('#player-hp-bar-current');
    const playerHPText = document.querySelector('#player-hp-text');

    document.addEventListener('DOMContentLoaded', function() {

        document.addEventListener('keydown', function(event) {

            if (event.code == 'Enter') {
                runCycle();
            }
        });

        updateHP();
        displayCommands();
        displayEnemy(enemies[0]);
    });

    function updateHP() {

        playerHPText.innerText = hpCurrent + "/" + hpMax;
        let HPCurrentPercent = hpCurrent / hpMax;        
        playerHPBar.style.width = (HPCurrentPercent * 610 + 2)  + 'px';
    }

    function displayEnemy(enemy) {

        currentEnemy = enemy;

        enemyLevelText.innerText = enemy.level;
        enemyNameText.innerText = enemy.name;
        enemyTypeText.innerText = enemy.type;

        updateEnemy();
    }

    function updateEnemy() {

        enemyHPText.innerText = currentEnemy.hpCurrent + "/" + currentEnemy.hpMax;
        let HPCurrentPercent = currentEnemy.hpCurrent / currentEnemy.hpMax;        
        enemyHPBar.style.width = (HPCurrentPercent * 290 + 2)  + 'px';
    }

    function displayCommands() {
        
        playerCommandContainer.innerHTML = "";
        createdPlayerCommandObjects = [];

        for (let index = 0; index < 1; index++) {

            let commandCopy = deepCopyWithFunctions(getObjectFromKeyword("attack", commands));        

            let newCommandElement = document.createElement('div');
            newCommandElement.className = 'player-command';            
            newCommandElement.innerText = commandCopy.action.actionText();
            playerCommandContainer.appendChild(newCommandElement);

            let newCommandObject = {
                command: commandCopy,
                element: newCommandElement
            }

            createdPlayerCommandObjects.push(newCommandObject);
        }

        enemyCommandContainer.innerHTML = "";
        createdEnemyCommandObjects = [];

        for (let index = 0; index < 1; index++) {

            let commandCopy = deepCopyWithFunctions(getObjectFromKeyword("block", commands));        

            let newCommandElement = document.createElement('div');
            newCommandElement.className = 'enemy-command';
            newCommandElement.innerText = commandCopy.action.actionText();
            enemyCommandContainer.appendChild(newCommandElement);

            let newCommandObject = {
                command: commandCopy,
                element: newCommandElement
            }

            createdEnemyCommandObjects.push(newCommandObject);
        }
    }

    function updateCommandObject(commandObject) {
        
        commandObject.element.innerText = commandObject.command.action.actionText();
    }

    async function runCycle() {
        
        log("runCycle - Begin"); playClick();

        commandIndicator.classList.add("active");

        for (let index = 0; index < createdPlayerCommandObjects.length; index++) {

            let playerCommandObject = createdPlayerCommandObjects[index];
            playerCommandObject.element.classList.add("active");
            log("Running - [" + playerCommandObject.command.action.actionText() + "]"); playClick();

            await waitForButtonPress();

            for (let index = 0; index < createdEnemyCommandObjects.length; index++) {

                const enemyCommandObject = createdEnemyCommandObjects[index];
                
                enemyCommandContainer.insertBefore(commandIndicator, enemyCommandObject.element);
                log("   ["+playerCommandObject.command.action.actionText()+"] Encountered - " + enemyCommandObject.command.action.actionText()); playClick();
                
                let commandOutcome = "   ["+playerCommandObject.command.action.actionText()+"] " + enemyCommandObject.command.func(playerCommandObject);
                log (commandOutcome); playClick();
                updateCommandObject(playerCommandObject);

                await waitForButtonPress();
            }
            
            log("   ["+playerCommandObject.command.action.actionText()+"] - Arrived at "+ currentEnemy.name +" Kernel"); playClick();

            // Player command has reached the enemy kernel
            let commandOutcome = playerCommandObject.command.func(currentEnemy);
            log ("   ["+playerCommandObject.command.action.actionText()+"] " + commandOutcome); playClick();

            log("   ["+playerCommandObject.command.action.actionText()+"] Command Completed."); playClick();
            playerCommandObject.element.classList.remove("active");
        }
        
        log("runCycle - Completed"); playClick();

        commandIndicator.classList.remove("active");
        playerCommandContainer.appendChild(commandIndicator);
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
    
    return {
        updateEnemy
    };

})();

export const { updateEnemy } = VERDIGRIS;