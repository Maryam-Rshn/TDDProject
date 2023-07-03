const validateServiceQuestionLayers = function (question_layers: any) {
    if(question_layers =! []) {
        throw new TypeError("entity.errors.service.question_layers.invalidFormat");
    }
}
export default validateServiceQuestionLayers;