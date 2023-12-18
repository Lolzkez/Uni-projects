const Test = require('../models/test.cjs');
const Question = require('../models/questionModel.cjs');
const userClass = require('../models/userClass.cjs');
const studentAnswer = require('../models/student_answer.cjs')
const user = require('../models/users.cjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const createTest = async (req, res) => {
    try {
        const { testId, date, duration } = req.body;
        console.log("New Test Id:",testId,"Date:",date,"Duration:",duration)
        const newTest = new Test({
            id: testId,
            date: date,
            duration: duration
        });
        await newTest.save();
        console.log('Test saved successfully:', newTest);
        return res.status(201).json({
            message: `New Test Created with Id: ${newTest._id}`,
            test: newTest, 
        });
    } catch (err) {
        console.log("Test Create Error",err)
        return res.status(500).json({ message: `${err.message}` });
    }
}

const deleteTest = async (req, res) => {
    try {
        const { testId } = req.body;
        console.log(testId)
        const existingTest = await Test.findOne({ id: testId });
        if (!existingTest) {
            return res.status(404).json({ message: 'Test not found' });
        }
        await Test.findOneAndDelete({ id: testId });
        return res.status(200).json({ message: 'Test deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: `${err.message}` });
    }
};

const addQuestion = async (req, res) => {
    try {
        const { testId, questionId } = req.body;
        const question = await Question.findOne({ _id: questionId });
        const test = await Test.findOne({ id: testId });

        if (!question) {
            return res.status(404).json({ message: `Question with Id: ${questionId} not found` });
        }
        if (!test) {
            return res.status(404).json({ message: `Test with Id: ${testId} not found` });
        }
        const questionExistsInTest = test.questions.some(q => q.equals(question._id));

        if (questionExistsInTest) {
            return res.status(400).json({ message: `Question with Id: ${questionId} already exists in the test with Id: ${testId}` });
        }

        test.questions.push(question);
        await test.save();
        return res.status(200).json({ message: `Question with Id: ${questionId} added to the test with Id: ${testId}` });
    } catch (err) {
        return res.status(500).json({ message: `${err.message}` });
    }
};

const removeQuestion = async (req, res) => {
    try {
        const { testId, questionId } = req.body;
        const testObj = await Test.findOne({id: testId });
        
        if (!testObj) {
            return res.status(404).json("Test not found");
        }
        await Test.updateOne(
            { id: testId }, 
            { $pull: { questions: questionId } }
        );
        await Question.findOne({_id: questionId });
        return res.json("Deleted")
        }
        catch (error) {
            console.log(error);
            return res.status(500).json("Internal Server Error");
        }
};

const checkAttempted = async (req, res, next) => {
    const testId = req.params.id;
    const userId = req.decoded.id;

    const testObj = await Test.findOne({ id: testId });
    if (!testObj) {
        console.log(`Test with Id:${testId} not found`)
        return res.status(404).json({ message: `Test with Id:${testId} not found` });
    }
    const userObj = await user.findOne({id: userId });
    if (!userObj){
        console.log(`User with userId: ${userId} not found`)
        return res.status(404).json({ message: `User with Id:${userId} not found` });
    }

    const checkAttempt = await studentAnswer.findOne({ testID: testId, studentID: userId })
    if (checkAttempt) {
        console.log(`Test ${testId} has already been attempted by user ${userId}.`)
        return res.status(502).json({ message: `Test ${testId} has already been attempted by user ${userId}.` });
    }
    else{
    next()
    }
}

const getAllTests = async (req, res) => {
    try {
        const allTests = await Test.find({}).populate('questions'); 
        return res.status(200).json({ tests: allTests });
    } catch (err) {
        return res.status(500).json({ message: `${err.message}` });
    }
};

module.exports = { createTest, deleteTest, addQuestion, removeQuestion, getAllTests, checkAttempted };