const express = require('express')
const auth = require('../middleware/auth.cjs')
const bcrypt = require('bcrypt');
const User = require('../models/users.cjs')
const userAuth = auth.userAuth
const checkRole = auth.checkRole
const getAllUsers = auth.getAllUsers;
const createUser = auth.createUser;
const deleteUser = auth.deleteUser;

const dashboardRouter = express.Router();

dashboardRouter.post("/superuser", userAuth, checkRole(["superuser"]), (req, res) => {
  res.status(201).send("OK");
});

dashboardRouter.post("/teacher", userAuth, checkRole(["teacher"]), (req, res) => {
  res.status(201).send("OK");
});

dashboardRouter.get("/view-users", userAuth, checkRole(["superuser"]), getAllUsers);

dashboardRouter.post("/create-user", userAuth, checkRole(["superuser"]), createUser);

dashboardRouter.delete("/user/delete", userAuth, checkRole(["superuser"]), deleteUser);

if (process.env.ENABLE_SETUP_ROUTE === 'true') {
  dashboardRouter.post('/setup', async (req, res) => {
    try {
      const id = req.body.id
      const password  = req.body.password
      const hashedPassword = await bcrypt.hash(password, 10); 
      const superuser = new User({
        id: id,
        password: hashedPassword,
        role:"superuser", 
        firstLogin: false
      });

      await superuser.save();
      process.env.ENABLE_SETUP_ROUTE = 'false'
      res.status(201).json({ message: 'Superuser created successfully.' });
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
} else {console.log("Cannot access")}

module.exports = dashboardRouter;
