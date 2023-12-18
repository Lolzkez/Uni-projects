const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { json } = require('body-parser')

const User = require('../models/users.cjs')
const userClass = require('../models/userClass.cjs')
const classWare = require('../middleware/userClassAuth.cjs')

require('dotenv').config()
let activeTokens = new Set();

const userLogin = async (req, res) => {
    const { id, password } = req.body;
    console.log("login:",id,"pw:",password);
    let isMatch;
    const user  = await User.findOne({ id: id });
    if (!user) {
        return res.status(404).json({
            message: "User not found. Invalid login credentials.",
            success: false,
        })
    }
    if (user.firstLogin) {
        isMatch = true;
      } else {
        isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(403).json({
            message: "Incorrect password."
          });
        }
    }
    if (isMatch) {
        let token = jwt.sign(
            {
                role: user.role,
                id: user.id,
                class_no: user.class_no
            },
            process.env.APP_SECRET,
            { expiresIn: "3 days" }
        )
        activeTokens.add(token);
        let result = {
            id: user.id,
            role: user.role,
            class_no: user.class_no,
            firstLogin: user.firstLogin,
            token: `Bearer ${token}`,
            expiresIn: 168
        }
        return res.status(200).json({
            ...result,
            message: "Logged In",
        })
    } else {
        return res.status(403).json({
            message: "Incorrect password. "
        })
    }
}

const userLogout = (token) => {
    activeTokens.delete(token);
}

const userAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("AUTH")
    if(!authHeader) {
        return res.status(403).send('Authorization header missing');
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token verification failed');
        }
        req.decoded = decoded;
        next();
    });
}

const checkRole = (roles) => async (req, res, next) => {
    try {
        const id = req.decoded.id;
        const user = await User.findOne({id:id}); 
        if (!user || !roles.includes(user.role)) {
            return res.status(401).json("Sorry you do not have access to this route"); 
        } 
        next();
    }
    catch (err) {
        return res.status(500).send('Internal Server Error');
    }
}

const createUser = async(req, res) => {
    try {
        const {newId, role} = req.body;
        const idTaken = await User.findOne({id:newId});
        if(idTaken) {
            console.log("ADD USER FAIL");
            return res.status(400).json({message: `ID is already taken`});
        }
        const newUser = new User({
            id: newId,
            role: role,
            firstLogin: true,
        });
        await newUser.save(); 
        return res.status(201).json({message:"The user is now registered."});
    }
    catch(err) {
        return res.status(500).json({message:`${err.message}`});
    }
}

const getAllUsers = async(req, res) => {
    try {
      const users = await User.find().populate('class_no');
      return res.json(users);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const existingUser = await User.findOneAndDelete({ id: userId });
        
        if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
        }
        console.log(existingUser.class_no)
        await userClass.updateOne(
        { _id: existingUser.class_no }, 
        { $pull: { students: existingUser._id } }
        );
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const changePassword = async (req, res) => {
    const { id, newPassword } = req.body
    console.log("PWCHANGE",id,newPassword)
    const user  = await User.findOne({ id: id });
    if (!user) {
        return res.status(404).json({
            message: "User not found. Invalid login credentials.",
            success: false,
        })
    }
    
    if (user.firstLogin === true){
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        user.firstLogin = false;
        await user.save();
        return res.status(200).json({
        message: "Password changed successfully",
        success: true,
    })} 
    else {
        return res.status(403).json({
            message: "Not first time Login.",
            success: false,
        })
    }
} 


module.exports = {
    userLogin,
    userAuth,
    checkRole,
    deleteUser,
    createUser,
    userLogout,
    getAllUsers,
    changePassword
}