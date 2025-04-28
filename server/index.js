require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')


const PORT = process.env.PORT || 5000
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://electron-shop-sigma.vercel.app");
    //res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`)
    next()
})

app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)
app.use(cookieParser())

app.use(errorHandler)

app.get('/', (req, res) => {
    res.status(200).json('WORKING!!!')
})

const start = async() => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log('Server has been started on port ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()