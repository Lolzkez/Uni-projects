const express = require('express')

const User = require('./models/users.cjs')
const dashboardRouter = require('./routes/dashboards.cjs')
const loginRouter = require('./routes/login.cjs')
const registerRouter = require('./routes/register.cjs')
const questionRouter = require('./routes/question.cjs')
const testRouter = require('./routes/test.cjs')
const studentAnswerRouter = require('./routes/studentAnswerRouter.cjs')
const classRouter = require('./routes/userClass.cjs')

const cors = require('cors')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin:"http://localhost:3000"
  
}))

const port = 5000
require('./database/db.cjs')

app.use("/register", registerRouter)

app.use("/login", loginRouter)

app.use("/dashboard", dashboardRouter)

app.use("/question", questionRouter)

app.use("/test", testRouter)

app.use("/result", studentAnswerRouter)

app.use("/class", classRouter)

app.post("/logout", (req, res) => {
    const { token } = req.body;
    if (token) {
      userLogout(token);
      return res.status(200).json({ message: "Logged Out" });
    } else {
      return res.status(400).json({ message: "Token not provided" });
    }
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})