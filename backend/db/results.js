const DB_API = require('../db/db_api.js');

function getResultsByProlificId(prolificId, turnNum) {
    let choices = DB_API.findChoicesByID(prolificId, turnNum);
    for(var i = 0; i < choices.length; i++){
        let count = 0;
        if(choices[i].localeCompare(this.prolificId)){ 
            count += 1;
        }
        let tempPlayer = choices[i];
        let tempChoices = DB_API.findChoicesByID(prolificId, turnNum);
        for(var j = 0; j < tempChoices.length; j++){
            if(tempChoices[j].localeCompare(prolificId)){
                count +=1;
            }
        }
        return count * 20;
    }
}

module.exports = {
    getResultsByProlificId : getResultsByProlificId,
}