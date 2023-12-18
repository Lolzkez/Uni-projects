const studentAnswer= require('../models/student_answer.cjs')
const user = require("../models/users.cjs")

const createAnswer = async (req, res) => {
    try {
        const { testId, studentAnswers, totalCorrect, totalTimeTaken } = req.body;
        const decodedUser = await user.findOne({id: req.decoded.id}).populate('class_no');
        const class_no = decodedUser.class_no;
        const attempt = await studentAnswer.findOne({ testId: testId, userId: decodedUser._id })
        if (attempt) {return res.status(400).json({ message: "Attempt must be unique." })}
        const totalPercentage = totalCorrect/studentAnswers.length * 100

        const newAttempt = new studentAnswer({
            testId: testId,
            userId: decodedUser,
            class_no: class_no,
            answers: studentAnswers,
            totalCorrect: totalCorrect,
            totalTimeTaken: totalTimeTaken,
            totalPercentage: totalPercentage
        })
        await newAttempt.save();
        return newAttempt;
    } catch (err) {
        console.log("Attempt Create Error",err)
        return res.status(500).json({ message: `${err.message}` });
    }
}

const getResult = async (req, res) => {
    try {
        const { testId } = req.params.testId;
        const decodedUser = await user.findOne({id: req.decoded.id}).populate('class_no');
        const result = await studentAnswer.findOne({ testId: testId, userId: decodedUser._id });
        
        return result;
    }
    catch (err) {
        console.log("Test Error",err)
        return res.status(500).json({ message: `${err.message}` });
    }
}

const getAllResults= async(req, res) => {
    try {
        console.log("RESULTS")
        const results = await studentAnswer.find()
            .populate('testId')
            .populate('userId')
            .populate('class_no');
        return res.json(results);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
};

module.exports = { 
    createAnswer,
    getResult,
    getAllResults
}