import { updateEnemy } from "../Scripts/encounter.js";

export const commands = [
    {
        keyword: "attack",
        type: "attack",        
        action: {
            actionText: function() {
                return "Do " + this.actionValue + " DMG";
            },
            actionValue: 30
        },
        func: function(enemy) {

            enemy.hpCurrent -= this.action.actionValue;
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
                return "Block " + this.actionValue + " DMG";
            },
            actionValue: 15
        },
        func: function(inputCommandObject) {
            
            if (inputCommandObject.command.type === "attack") {
                inputCommandObject.command.action.actionValue -= this.action.actionValue;
            }            

            return "Block - Input Command ATK reduced to " + inputCommandObject.command.action.actionValue;
        }
    }
];
