const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
        id: { type: String, unique: true},
        password: { type: String },
        role: { type: String, enum: ["student", "teacher", "superuser"] },
        class_no: { type: Schema.Types.ObjectId, 
                    ref: 'userClass'},
        firstLogin: { type: Boolean, required: true }
    }
)

module.exports = model("User", userSchema)