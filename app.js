const express = require('express')
const app = express()
require('./models')

const contactRouter = require('./routers/contactRouter')
//const userRouter = require('./routers/userRouter')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.use(express.urlencoded({ extended: true }))

app.use('/contact', contactRouter)

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`)
})

module.exports = app
