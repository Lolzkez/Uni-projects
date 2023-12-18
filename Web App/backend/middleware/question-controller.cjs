const questionModel = require("../models/questionModel.cjs");
var { HamsterMazeQuestionLogic} = require('../question_generation/hamsterMaze.cjs')
var { CorsiBlockTappingQuestionLogic } = require('../question_generation/corsiBlockTapping.cjs')
var { LineJudgementOrientationQuestionLogic } = require("../question_generation/lineJudgmentOrientation.cjs");
var { DesignOrganisationTestQuestionLogic } = require("../question_generation/designOrganisationTest.cjs")

const createQuestion = async (req, res) => {
    const { difficulty, qType } = req.body
    const diff = difficulty
    console.log(`difficulty: ${difficulty}, qType: ${qType}`);
    let question;

    switch(qType) {
        case "Hamster":
            const mazelogic = new HamsterMazeQuestionLogic(difficulty)
            const mazeQData = mazelogic.generateQuestionData()
            question = new questionModel({
                type: "Hamster",
                difficulty: diff,
                correctAnswer: mazeQData.correctLetter,
                mazeData: mazeQData
            })
            break;
        case "Line":
            const lineLogic = new LineJudgementOrientationQuestionLogic(difficulty)
            const lineQData = lineLogic.generateQuestionData()
            question = new questionModel({
                type: "Line",
                difficulty: diff,
                correctAnswer: lineQData.line,
                mazeData: lineQData
            })
            break;
        case "Corsi":
            const corsi = new CorsiBlockTappingQuestionLogic()
            question = new questionModel({
                type: "Corsi",
                difficulty: diff,
                corsiData: corsi.getQuestionData()
            })
            break;
        case "DOT":
            const DOT = new DesignOrganisationTestQuestionLogic(difficulty)
            const DOTQData = DOT.generateQuestionData()
            question = new questionModel({
                type: "DOT",
                difficulty: diff,
                correctAnswer: JSON.stringify(DOTQData)
            })
            break;
        case "Static":
            break;
    }
    await question.save()
    console.log("Saved Question")
    res.json(question);
}

module.exports = {createQuestion}