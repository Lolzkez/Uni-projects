const express = require('express')
const auth = require('../middleware/auth.cjs')
const classAuth = require('../middleware/userClassAuth.cjs');

const userAuth = auth.userAuth
const checkRole = auth.checkRole

const createClass = classAuth.createClass
const addTestToClass = classAuth.addTestToClass;
const addUserToClass = classAuth.addUserToClass;
const deleteClass = classAuth.deleteClass;
const getAllClasses = classAuth.getAllClasses;
const getTestByClass = classAuth.getTestByClass;

const classRouter = express.Router();

//Superuser Service
classRouter.get("/view-classes", userAuth, checkRole(["superuser"]), getAllClasses);

classRouter.post("/create-class", userAuth, checkRole(["superuser"]), createClass);

classRouter.post("/add-test", userAuth, checkRole(["superuser"]), addTestToClass);

classRouter.post("/add-user", userAuth, checkRole(["superuser"]), addUserToClass);

classRouter.delete("/delete",userAuth,checkRole(["superuser"]), deleteClass)

//Student Service
classRouter.get("/tests", userAuth, getTestByClass); 

module.exports = classRouter;
