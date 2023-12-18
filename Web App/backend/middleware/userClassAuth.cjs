const userClass = require('../models/userClass.cjs')
const jwt = require('jsonwebtoken')
const User = require('../models/users.cjs')
const Test = require('../models/test.cjs');

require('dotenv').config()

const createClass = async (req, res) => {
  try {
    const validateClass = async (class_no) => {
      const classroom = await userClass.findOne({ class_no })
      return classroom ? false : true
    }
    const classNOTaken = await validateClass(req.body.class_no)
    if (!classNOTaken) { return res.status(400).json({ message: "Class number already taken." })}
    const newClass = new userClass({ class_no: req.body.class_no, teacher: null })
    await newClass. save()
    return res.status(201).json({ message:`Class is registered.` })
  }
  catch (err) {
    return res.status(500).json({ message:`${err.message}`})
  }
}

const addUserToClass = async (req, res) => {
  try {
    const { userId, class_no } = req.body;
    console.log(`${userId} to class ${class_no}`)
    const user = await User.findOne({ id: userId });
    const userclass = await userClass.findOne({ class_no: class_no });

    if (!user) return res.status(404).json({ message: "User does not exist." });
    if (!userclass) return res.status(404).json({ message: "Class does not exist." });

    if (user.role === "teacher") {
      if (userclass.teacher) return res.status(409).json({ message: "This class already has a teacher." });
      userclass.teacher = user;
    } else if (userclass.students.includes(user._id)) {
      return res.status(409).json({ message: "Student is already in this class." });
    } else {
      userclass.students.push(user);
    }

    user.class_no = userclass;
    await user.save();
    await userclass.save();

    return res.status(201).json({ message: `${user.role} added to Class ${class_no}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addTestToClass = async (req, res) => {
  try {
      const { testId, class_no } = req.body;
      const test = await Test.findOne({ id: testId });
      const userclass = await userClass.findOne({ class_no: class_no });

      if (!test) return res.status(404).json({ message: "Test does not exist." });
      if (!userclass) return res.status(404).json({ message: "Class does not exist." });

      if (userclass.tests.includes(test._id)) {
          return res.status(409).json({ message: `Test with Id: ${testId} already exists in the class with Id: ${class_no}` });
      }

      userclass.tests.push(test);
      await userclass.save();
      return res.status(200).json({ message: `Test with Id: ${testId} added to the class with Id: ${class_no}` });
  } catch (err) {
      return res.status(500).json({ message: `${err.message}` });
  }
};

const getAllClasses = async(req,res) => {
  try {
    const classes = await userClass.find({})
      .populate('tests')
      .populate('students')
      .populate('teacher')
    return res.status(200).json({ classes: classes });
    } catch (err) {
      res.status(500).send('Internal Server Error');
  } finally {
      return;
  }
}

const getTestByClass = async(req,res) => {
  const class_no = req.decoded.class_no;
  console.log(class_no)
  try {
    const classes = await userClass.findOne({ _id: class_no })
      .populate({
        path: 'tests',
        populate: {
          path: 'questions'
        }
      });
    return res.status(200).json({ tests: classes.tests });
  } catch (err) {
    return res.status(500).send('Internal Server Error');
  }
}

const deleteClass = async (req, res) => {
  const { class_no } = req.body;
  try {
    const existingClass = await userClass.findOneAndDelete({ class_no });
    if (!existingClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
  

module.exports = { createClass, addUserToClass,addTestToClass, getAllClasses, getTestByClass, deleteClass }