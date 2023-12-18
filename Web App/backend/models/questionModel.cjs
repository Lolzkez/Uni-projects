const { Schema, model, default: mongoose } = require('mongoose')

const questionSchema = new Schema(
    {
        type: { type: String,
                enum: ["Hamster", "Line", "Corsi", "DOT", "Static"] ,
                required: true
            },
        correctAnswer: { type: String },
        editor: { type: Schema.Types.ObjectId, ref:"superuser" },
        difficulty: { type: Number },
        
        // Hamster Maze
        mazeData: { type: Object },

        // Line Judgement
        lineData: { type: Object },

        // DOT
        DOTmatrix: { type: Schema.Types.Mixed },

        //Corsi
        lives: { type: Number },
        corsiData: { type: Object },
        streak: { type: Schema.Types.Decimal128 },
        
        //Static Questions
        images: [{
            data: Buffer,
            contentType: String
        }]
    }
)

module.exports = model("question", questionSchema)