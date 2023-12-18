const express = require('express')
const question = require('../middleware/question-controller.cjs') 
const auth = require('../middleware/auth.cjs')

const userAuth = auth.userAuth
const checkRole = auth.checkRole

const createQuestion = question.createQuestion

const questionRouter = express.Router();

questionRouter.post("/create", userAuth, checkRole(["superuser"]), createQuestion);

module.exports = questionRouter;