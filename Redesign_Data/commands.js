import { updateEnemy } from "../Scripts/encounter.js";

export const commands = [
    {
        keyword: "attack",
        type: "attack",        
        action: {
            actionText: function(formatText) {

                let valueString = this.actionValueCurrent;
                if (formatText && this.actionValueCurrent < this.actionValueStart) 
                    valueString = "<span class=\"reduced\">" + valueString + "</span>";
                return "Do " + valueString + " DMG";
            },
            actionValueCurrent: 90,       
            actionValueStart: 90
        },
        func: function(enemy) {

            enemy.hpCurrent -= this.action.actionValueCurrent;
            if (enemy.hpCurrent < 0) enemy.hpCurrent = 0;
            updateEnemy();
            return("Attack - " + enemy.name + " HP reduced to " + enemy.hpCurrent);            
        }
    },
    {
        keyword: "block",
        type: "block",
        action: {
            actionText: function() {
                return "Block " + this.actionValueCurrent + " DMG";
            },
            actionValueCurrent: 15,
            actionValueStart: 15
        },
        func: function(inputCommandObject) {
            
            // If the input command is an attack type, we reduce it's action value by our amount of block
            if (inputCommandObject.command.type === "attack") {
                
                const blockAmount = this.action.actionValueCurrent; // The max amount we are going to block is the action value of the inputted command
                inputCommandObject.command.action.actionValueCurrent -= this.action.actionValueCurrent;     // Reduce the action value of the inputed command by our current block value

                // Reduce our block value                
                this.action.actionValueCurrent -= blockAmount;
                if (inputCommandObject.command.action.actionValueCurrent < 0)
                    inputCommandObject.command.action.actionValueCurrent = 0;                                    

            }            

            return "Block - Input Command ATK reduced to " + inputCommandObject.command.action.actionValueCurrent;
        }
    }
];
