require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

app.use(errorHandler)

app.get('/', (req, res) => {
    res.status(200).json('WORKING!!!')
})
/*app.use('/api', userRouter)
app.use('/api', postRouter)*/

const start = async() => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, '0.0.0.0',() => {
            console.log('Server has been started on port ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()