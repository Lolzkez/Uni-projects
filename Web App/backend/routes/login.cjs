const express = require('express')
const auth = require('../middleware/auth.cjs')
const userLogin = auth.userLogin
const changePassword = auth.changePassword
const userAuth = auth.userAuth
const jwt = require('jsonwebtoken')

const loginRouter = express()

loginRouter.use(express.json())

loginRouter.post("/", userLogin);

loginRouter.post("/change-password", userAuth, changePassword);

module.exports = loginRouter;