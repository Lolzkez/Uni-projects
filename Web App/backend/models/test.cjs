const { Schema, model } = require('mongoose')

const testSchema = new Schema(
    {
        id: { type: String, unique: true, require: true },
        questions: [{
            type: Schema.Types.ObjectId, 
            ref:"question" 
        }],
        duration: { type: Number },  // seconds
        date: { type: Date }
    }
)

module.exports = model("test", testSchema)