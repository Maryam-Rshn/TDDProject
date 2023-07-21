const validateServiceQuestionLayers = function (question_layers: any) {
    let questionLayers = question_layers['question_layers']
    
    if(typeof questionLayers == 'undefined') {
        throw new Error("entity.errors.service.question_layers.invalidFormat");
    }
    
    if(questionLayers.length < 1) {
        throw new Error("entity.errors.service.question_layers.invalidFormat");
    }
    if(questionLayers[0].length > 1) {
        throw new Error("entity.errors.service.question_layers.firstLayer.moreThanOne");  
    }
    if(questionLayers[0][0].hasOwnProperty('ask_based')) {
        throw new Error("entity.errors.service.question_layers.firstLayer.askBasedIsDefined");  
    }
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    for (let i = 0; i < questionLayers.length; i++) {
        for(let j = 0; j < questionLayers[j].length; j++) {

            // if(!regexExp.test(questionLayers[i][j].id)) {
            //     console.log(questionLayers[i][j]);
                
            //     throw new Error("entity.errors.service.question_layers.question.invalidId");
            // }
            if(!(new RegExp(regexExp)).test(questionLayers[i][j].id)) {
                throw new Error("entity.errors.service.question_layers.question.invalidId");
            }
            if(["text-area", "radio", "check-box", "end"].indexOf(questionLayers[i][j].question_type) === -1) {
                throw new Error("entity.errors.service.question_layers.question.invalidQuestionType");
            }
            if(typeof questionLayers[i][j].title !== 'string') {
                throw new Error("entity.errors.service.question_layers.question.invalidTitle");
            }
            if(typeof questionLayers[i][j].placeholder !== 'string') {
                throw new Error("entity.errors.service.question_layers.question.invalidPlaceholder");
            }        
            if(questionLayers[i][j].question_type === "text-area" && questionLayers[i][j].answers !== null) {
                throw new Error("entity.errors.service.question_layers.question.answers.answerSpecifiedForTypeTextArea");
            }
            if(questionLayers[i][j].question_type === "radio" || questionLayers[i][j].question_type === "check-box") {
                if(questionLayers[i][j].answers.length < 2) {
                    throw new Error("entity.errors.service.question_layers.question.answers.invalidFormat");
                }else {
                    function isDUplicate() {
                        for (var k = 0; k < questionLayers[i][j].answers.length; k++) {
                            for (var p = 0; p < questionLayers[i][j].answers.length; p++) {
                                if (k != p) {
                                    if (questionLayers[i][j].answers[k] == questionLayers[i][j].answers[p]) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    }
                    if(isDUplicate()) {
                        throw new Error("entity.errors.service.question_layers.question.answers.duplicateAnswer");
                    }
                }
            }          
            if(questionLayers[i][j].question_type === "end" && questionLayers[i][j].title !== null || questionLayers[i][j].answer !== null || questionLayers[i][j].placeholder !== null) {  
                throw new Error("entity.errors.service.question_layers.question.notNullValuesForTypeEnd");
            }
        }
    }
}
export default validateServiceQuestionLayers;