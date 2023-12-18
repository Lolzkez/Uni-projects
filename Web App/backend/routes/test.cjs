const express = require('express')
const auth = require('../middleware/auth.cjs');
const test = require('../middleware/test-controller.cjs');

const userAuth = auth.userAuth
const checkRole = auth.checkRole

const createTest = test.createTest
const deleteTest = test.deleteTest
const addQuestion = test.addQuestion
const removeQuestion = test.removeQuestion
const getAllTests = test.getAllTests
const checkAttempted = test.checkAttempted

const testRouter = express.Router();

testRouter.post("/create", userAuth, checkRole(["superuser"]), createTest)

testRouter.delete("/delete",  userAuth, checkRole(["superuser"]),deleteTest)

testRouter.post("/add-question", userAuth, checkRole(["superuser"]), addQuestion)

testRouter.delete("/remove-question", userAuth, checkRole(["superuser"]), removeQuestion)

testRouter.get("/tests", getAllTests);

module.exports = testRouter;
