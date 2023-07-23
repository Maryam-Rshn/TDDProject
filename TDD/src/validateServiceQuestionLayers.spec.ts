import validateServiceQuestionLayers from "./validateServiceQuestionLayers";
import generateId from "./frameworks/generateId/index";

describe('validate question layers entity', () => {

    it("won't work if question layers are not arrays", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: undefined,
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.invalidFormat")
        }
    });

    it("won't work if items in question layers are not arrays and their length is less than one", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.invalidFormat");
        }
    });

    // // //* question validation

    it("won't work if a question has invalid id field", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: 'invalid id !',
                            question_type: "blah blah blah",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.invalidId");
        }
    });

    it("won't work if a question has invalid question_type field", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "blah blah blah",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.invalidQuestionType");
        }
    });

    it("won't work if a question has invalid title field", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "radio",
                            title: 1234,
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.invalidTitle");
        }
    });

    it("won't work if a question has invalid placeholder field", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: 22134,
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.invalidPlaceholder");
        }
    });

    it("won't work if a question with question_type text-area and has answers field that is not null", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "text-area",
                            title: "which phrase is test ?",
                            placeholder: 'alskdfhjsdkf',
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ],

                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.answers.answerSpecifiedForTypeTextArea");
        }
    });

    it("won't work if a question with question_type radio & check-box has answers field that its not an array with at least two items in it", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: 'alskdfhjsdkf',
                            answers: [
                                "bals",
                            ],

                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.answers.invalidFormat");
        }
    });

    it("won't work if a question with question_type radio & check-box has duplicate answers in their answers array", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: 'alskdfhjsdkf',
                            answers: [
                                "bals",
                                "bals"
                            ],

                       }
                    ]
                ], 
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.answers.duplicateAnswer");
        }
    });

    it("won't work if a question with question_type end doesn't have only question_type and ask_based fields", async() => {
        try {
            const id = await generateId()
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                        {   
                            id,
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                        }
                     ],
                    [   
                        {   
                            ask_based:[
                                {
                                    previous_question_id: id,
                                    answer_given_to_previous_question: [
                                        'bals',
                                        "blaaa",
                                        "test"
                                    ]
                                },
                            ],
                            id: await generateId(),
                            question_type: "end",
                            placeholder: 'something',
                            title: null,
                            answers: null

                       },
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.question.notNullValuesForTypeEnd");
        }
    });

    // //* layer 1 logic

    it("wont work if question layer 1 has more than one question", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                        {   
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                        },
                        {   
                            id:await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                        }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.firstLayer.moreThanOne");
        }
    });

    it("wont work if question layer 1 has ask_based field ", async() => {
        try {
            const id = await generateId();
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            ask_based:[
                                {
                                    previous_question_id: id,
                                    answer_given_to_previous_question: null
                                }
                            ],
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.firstLayer.askBasedIsDefined");
        }
    });

    // //* other layer logic

    it("won't work if questions in question layers above 1 don't have ask_based filed ", async() => {
        try {
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ],
                    [
                        {
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("question layers above 1 must include ask_based field and it must be an array");
        }
    });

    // //* asked based logic

    it("won't work if questions ask_based field doesn't include a valid id field", async() => {
        try {
            const id = await generateId()
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id,
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ],
                    [
                        {   
                            ask_based:[
                                {
                                    previous_question_id: "yoyoy",
                                    answer_given_to_previous_question: null
                                }
                            ],
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.invalidPreviousQuestionId");
        }
    });

    it("won't work if questions ask_based field previous_question_id doesn't exist on the previous layer", async() => {
        try {
            const id = await generateId()
            const result = await validateServiceQuestionLayers({
                question_layers: [
                    [
                       {
                            id,
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ],
                    [
                        {   
                            ask_based:[
                                {
                                    previous_question_id: await generateId(),
                                    answer_given_to_previous_question: ['bals']
                                }
                            ],
                            id: await generateId(),
                            question_type: "radio",
                            title: "which phrase is test ?",
                            placeholder: "just pick test",
                            answers: [
                                "bals",
                                "blaaa",
                                "test"
                            ]
                       }
                    ]
                ],
            })
            expect(result).toBeFalsy();
        } catch (error:any) {
            expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.invalidPreviousQuestionId");
        }
    })
    
    // it("won't work if questions ask_based references a radio type question and answer_given_to_previous_question field is not an array that includes correct items ", async() => {
    //     try {
    //         const id = await generateId()
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'bals',
    //                                     'WRONG !'
    //                                 ]
    //                             }
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ]
    //             ],
    //         })
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.invalidAnswerGivenToPreviousQuestionWhenRefrencingRadioQuestion");
    //     }
    // });

    // it("won't work if questions ask_based references a none radio type question and answer_given_to_previous_question field is not null ", async() => {
    //     try {
    //         const id = await generateId()
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "check-box",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'bals',
    //                                     "blaaa",
    //                                     "test"
    //                                 ]
    //                             }
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ]
    //             ],
    //         })
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.answerGivenToPreviousQuestionNotNullWhenRefrencingNoneRadioQuestion");
    //     }
    // });

    // //* scenarios logic

    // it("won't work if a question layer didn't handle all scenarios  ", async() => {
    //     try {
    //         const id = await generateId()
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'bals',
    //                                     "blaaa",
    //                                 ]
    //                             }
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ]
    //             ],
    //         })
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.unHandledScenario");
    //     }
    // });
    
    // it("won't work if a question layer has duplicate solutions for scenarios  ", async() => {
    //     try {
    //         const id = await generateId()
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'bals',
    //                                     "blaaa",
    //                                     "test"
    //                                 ]
    //                             },
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    },
    //                    {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'test',
    //                                 ]
    //                             },
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                     }
    //                 ]
    //             ],
    //         }) 
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.duplicateScenarios");
    //     }
    // });

    // it("won't work if a question layer has duplicate solutions for scenarios  ", async() => {
    //     try {
    //         const id = await generateId();
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "check-box",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: null
    //                             },
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    },
    //                    {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: null
    //                             },
    //                         ],
    //                         id: await generateId(),
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                     }
    //                 ]
    //             ],
    //         })
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.duplicateScenarios")
    //     }
    // });

    // it("won't work if a question layer has duplicate ids",async() => {
    //     try {
    //         const id = await generateId();
    //         const id2 = await generateId();
    //         const result = await validateServiceQuestionLayers({
    //             question_layers: [
    //                 [
    //                    {
    //                         id,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    }
    //                 ],
    //                 [
    //                     {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'bals',
    //                                     "blaaa",
    //                                 ]
    //                             },
    //                         ],
    //                         id: id2,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                    },
    //                    {   
    //                         ask_based:[
    //                             {
    //                                 previous_question_id: id,
    //                                 answer_given_to_previous_question: [
    //                                     'test',
    //                                 ]
    //                             },
    //                         ],
    //                         id: id2,
    //                         question_type: "radio",
    //                         title: "which phrase is test ?",
    //                         placeholder: "just pick test",
    //                         answers: [
    //                             "bals",
    //                             "blaaa",
    //                             "test"
    //                         ]
    //                     }
    //                 ]
    //             ],
    //         })
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.duplicateId")
    //     }
    // });

    // it("won't work with referencing a answer that does not exist on the previous layer", async () => {
    //     try {
    //         const id = await generateId();
    //         const id21 = await generateId();
    //         const id22 = await generateId();
    //         const id23 = await generateId();
    //         const id24 = await generateId();
    //         const id3 = await generateId();
    //         const questionLayers = [
    //             [
    //                 {
    //                     id,
    //                     question_type: "radio",
    //                     title: "which question would you like to answer to ?",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "radio",
    //                         "check-box",
    //                         "end",
    //                         "none of the above"
    //                     ]
    //                 }
    //             ],
    //             [
    //                 {
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'radio',
    //                             ]
    //                         },
    //                     ],
    //                     id: id21,
    //                     question_type: "radio",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "yes",
    //                         "no"
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'check-box',
    //                             ]
    //                         },
    //                     ],
    //                     id: id22,
    //                     question_type: "check-box",
    //                     title: "select something !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "a",
    //                         "b",
    //                         "c",
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'text-area',
    //                             ]
    //                         },
    //                     ],
    //                     id: id23,
    //                     question_type: "text-area",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'none of the above',
    //                             ]
    //                         },
    //                     ],
    //                     id: id24,
    //                     question_type: "end",
    //                     title: null,
    //                     placeholder: null,
    //                     answers: null
    //                 },
    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id21,
    //                             answer_given_to_previous_question: [
    //                                 "yes",
    //                                 "no"
    //                             ]
    //                         },
    //                         {
    //                             previous_question_id: id22,
    //                             answer_given_to_previous_question: null
    //                         },
    //                         {
    //                             previous_question_id: id23,
    //                             answer_given_to_previous_question: null
    //                         },
    //                         {
    //                             previous_question_id: id24,
    //                             answer_given_to_previous_question: null
    //                         }
    //                     ],
    //                     id: id3,
    //                     question_type: "text-area",
    //                     title: "whats uppp ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
                    

    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id3,
    //                             answer_given_to_previous_question: null
    //                         },
    //                     ],
    //                     id: await generateId(),
    //                     question_type: "text-area",
    //                     title: "any other thoughts ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 }
    //             ]
    //         ]

    //         const result = await validateServiceQuestionLayers({question_layers:questionLayers});            
    //         expect(result).toBeFalsy();
    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.invalidAnswerGivenToPreviousQuestionWhenRefrencingRadioQuestion");
    //     }
    // });

    // it("won't work with referencing an end question type", async () => {
    //     try {
    //         const id = await generateId();
    //         const id21 = await generateId();
    //         const id22 = await generateId();
    //         const id23 = await generateId();
    //         const id24 = await generateId();
    //         const id3 = await generateId();
    //         const questionLayers = [
    //             [
    //                 {
    //                     id,
    //                     question_type: "radio",
    //                     title: "which question would you like to answer to ?",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "radio",
    //                         "check-box",
    //                         "text-area",
    //                         "none of the above"
    //                     ]
    //                 }
    //             ],
    //             [
    //                 {
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'radio',
    //                             ]
    //                         },
    //                     ],
    //                     id: id21,
    //                     question_type: "radio",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "yes",
    //                         "no"
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'check-box',
    //                             ]
    //                         },
    //                     ],
    //                     id: id22,
    //                     question_type: "check-box",
    //                     title: "select something !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "a",
    //                         "b",
    //                         "c",
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'text-area',
    //                             ]
    //                         },
    //                     ],
    //                     id: id23,
    //                     question_type: "text-area",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'none of the above',
    //                             ]
    //                         },
    //                     ],
    //                     id: id24,
    //                     question_type: "end",
    //                     title: null,
    //                     placeholder: null,
    //                     answers: null
    //                 },
    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id21,
    //                             answer_given_to_previous_question: [
    //                                 "yes",
    //                                 "no"
    //                             ]
    //                         },
    //                         {
    //                             previous_question_id: id22,
    //                             answer_given_to_previous_question: null
    //                         },
    //                         {
    //                             previous_question_id: id23,
    //                             answer_given_to_previous_question: null
    //                         },
    //                         {
    //                             previous_question_id: id24,
    //                             answer_given_to_previous_question: null
    //                         }
    //                     ],
    //                     id: id3,
    //                     question_type: "text-area",
    //                     title: "whats uppp ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
                    

    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id3,
    //                             answer_given_to_previous_question: null
    //                         },
    //                     ],
    //                     id: await generateId(),
    //                     question_type: "text-area",
    //                     title: "any other thoughts ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 }
    //             ]
    //         ]

    //         const result = await validateServiceQuestionLayers({question_layers:questionLayers});            
    //         expect(result).toBeFalsy();

    //     } catch (error:any) {
    //         expect(error.message).toBe("entity.errors.service.question_layers.nextLayers.askBased.invalidPreviousQuestionId");
    //     }
    // });

    // it("works", async () => {
    //     try {
    //         const id = await generateId();
    //         const id21 = await generateId();
    //         const id22 = await generateId();
    //         const id23 = await generateId();
    //         const id24 = await generateId();
    //         const id3 = await generateId();
    //         const questionLayers = [
    //             [
    //                 {
    //                     id,
    //                     question_type: "radio",
    //                     title: "which question would you like to answer to ?",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "radio",
    //                         "check-box",
    //                         "text-area",
    //                         "none of the above"
    //                     ]
    //                 }
    //             ],
    //             [
    //                 {
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'radio',
    //                             ]
    //                         },
    //                     ],
    //                     id: id21,
    //                     question_type: "radio",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "yes",
    //                         "no"
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'check-box',
    //                             ]
    //                         },
    //                     ],
    //                     id: id22,
    //                     question_type: "check-box",
    //                     title: "select something !",
    //                     placeholder: "yo !",
    //                     answers: [
    //                         "a",
    //                         "b",
    //                         "c",
    //                     ]
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'text-area',
    //                             ]
    //                         },
    //                     ],
    //                     id: id23,
    //                     question_type: "text-area",
    //                     title: "did you like it !",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
    //                 {   
    //                     ask_based:[
    //                         {
    //                             previous_question_id: id,
    //                             answer_given_to_previous_question: [
    //                                 'none of the above',
    //                             ]
    //                         },
    //                     ],
    //                     id: id24,
    //                     question_type: "end",
    //                     title: null,
    //                     placeholder: null,
    //                     answers: null
    //                 },
    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id21,
    //                             answer_given_to_previous_question: [
    //                                 "yes",
    //                                 "no"
    //                             ]
    //                         },
    //                         {
    //                             previous_question_id: id22,
    //                             answer_given_to_previous_question: null
    //                         },
    //                         {
    //                             previous_question_id: id23,
    //                             answer_given_to_previous_question: null
    //                         },
    //                     ],
    //                     id: id3,
    //                     question_type: "text-area",
    //                     title: "whats uppp ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 },
                    

    //             ],
    //             [
    //                 {
    //                     ask_based: [
    //                         {
    //                             previous_question_id: id3,
    //                             answer_given_to_previous_question: null
    //                         },
    //                     ],
    //                     id: await generateId(),
    //                     question_type: "text-area",
    //                     title: "any other thoughts ?",
    //                     placeholder: "yo !",
    //                     answers: null
    //                 }
    //             ]
    //         ]

    //         const {question_layers} = await validateServiceQuestionLayers({question_layers:questionLayers});            
    //         expect(JSON.stringify(questionLayers)).toBe(JSON.stringify(question_layers));

    //     } catch (error:any) {
    //         expect(error).toBeFalsy();
    //     }
    // })

    
})