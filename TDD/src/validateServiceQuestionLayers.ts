const validateServiceQuestionLayers = function (question_layers: any) {
    let questionLayers = question_layers['question_layers']
    
    if(typeof questionLayers == 'undefined') {
        throw new Error("entity.errors.service.question_layers.invalidFormat");
    }
    
    if(questionLayers.length < 1) {
        throw new Error("entity.errors.service.question_layers.invalidFormat");
    }
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    for (let i = 0; i < questionLayers.length; i++) {
        for(let j = 0; j < questionLayers[j].length; j++) {
            if(!regexExp.test(questionLayers[i][j].id)) {
                throw new Error("entity.errors.service.question_layers.question.invalidId");
            }
            if(["text-area", "radio", "check-box"].indexOf(questionLayers[i][j].question_type) === -1) {
                throw new Error("entity.errors.service.question_layers.question.invalidQuestionType");
            }
            // if(typeof question_layers[i][j].title !== 'string') {
            //     throw new Error("entity.errors.service.question_layers.question.invalidTitle");
            // }
            // if(typeof question_layers[i][j].placeholder !== 'string') {
            //     throw new Error("entity.errors.service.question_layers.question.invalidPlaceholder");
            // }
            // if(question_layers[i][j].question_type === "text-area" && question_layers[i][j].answers !== null) {
            //     throw new Error("entity.errors.service.question_layers.question.answers.answerSpecifiedForTypeTextArea");
            // }
            // if(question_layers[i][j].question_type === "radio" || question_layers[i][j].question_type === "check-box" && question_layers[i][j].answers.length < 2) {
            //     throw new Error("entity.errors.service.question_layers.question.answers.invalidFormat");
            // }
            // if(question_layers[i][j].question_type === "radio" || question_layers[i][j].question_type === "check-box" && question_layers[i][j].answers.length < 2) {
            //     throw new Error("entity.errors.service.question_layers.question.answers.invalidFormat");
            // }
        }
    }
}
export default validateServiceQuestionLayers;