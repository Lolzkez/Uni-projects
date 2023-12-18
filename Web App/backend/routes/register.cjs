const express = require('express')
const auth = require('../middleware/auth.cjs')
const userSignup = auth.userSignup
const superuserCount = auth.superuserCount
const createUser = auth.createUser
const jwt = require('jsonwebtoken')

const registerRouter = express()
registerRouter.use(express.json())

registerRouter.post("/student", async (req, res) => {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
  
    const token = authorizationHeader.split(' ')[1]; 
    const decodedToken = jwt.decode(token);
  
    if (!decodedToken || decodedToken.role !== 'superuser') {
      return res.status(403).json({ message: 'Access denied. Superuser privileges required.' });
    }
    await createUser(req.body, "student", res)
})

registerRouter.post('/teacher', async (req, res) => {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
  
    const token = authorizationHeader.split(' ')[1]; 
    const decodedToken = jwt.decode(token);
  
    if (!decodedToken || decodedToken.role !== 'superuser') {
      return res.status(403).json({ message: 'Access denied. Superuser privileges required.' });
    }
    await createUser(req.body, 'teacher', res);
  });

module.exports = registerRouter;