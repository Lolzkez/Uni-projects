const { Schema, model } = require('mongoose')

const classSchema = new Schema(
    {
        class_no: { type: String, unique: true },
        teacher: { type: Schema.Types.ObjectId, ref:"User" },
        students: [{
            type: Schema.Types.ObjectId, 
            ref:"User" 
        }],
        tests: [{
            type: Schema.Types.ObjectId, ref:"test"
        }]
    }
)

module.exports = model("userClass", classSchema)