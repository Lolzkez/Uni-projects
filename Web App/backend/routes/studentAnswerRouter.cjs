const express = require('express')
const studentAnswer = require('../middleware/studentAnswer.cjs') 
const auth = require('../middleware/auth.cjs')

const userAuth = auth.userAuth;
const checkRole = auth.checkRole;

const createAnswer = studentAnswer.createAnswer
const getResult = studentAnswer.getResult;
const getAllResults = studentAnswer.getAllResults;

const studentAnswerRouter = express.Router();

studentAnswerRouter.post("/answer",userAuth, createAnswer)

studentAnswerRouter.get("/test/:testId",userAuth, getResult)

studentAnswerRouter.get("/all", userAuth, checkRole(["superuser"]), getAllResults)

module.exports = studentAnswerRouter;