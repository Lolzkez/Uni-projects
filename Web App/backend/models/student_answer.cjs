const { Schema, model, default: mongoose } = require('mongoose')

const studentAnswerSchema = new mongoose.Schema({
  testId: { type: Schema.Types.ObjectId, required:true, ref:"test" },
  userId: { type: Schema.Types.ObjectId, required:true, ref:"User" },
  class_no: { type: Schema.Types.ObjectId, required:true, ref:"userClass" },
  answers: [ new mongoose.Schema({
      questionId: { type: Schema.Types.ObjectId, required:true, ref:"question" },
      textAnswer: { type: String, required: false, default: null },
      isCorrect: { type: Boolean, required: false },
    }),
  ],
  totalCorrect: { type: mongoose.Decimal128, required:true },
  totalPercentage: {type: mongoose.Decimal128, required: false, default: null},
  totalTimeTaken: {type: mongoose.Decimal128, required: false, default: null}
});

module.exports = model("studentAnswer", studentAnswerSchema)