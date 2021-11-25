const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const helmet = require('helmet')
const morgan = require('morgan')

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

// Connect to MongoDB
const mongoose = require('./connectDB')
mongoose.ConnectDB()

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.get('/', (req, res) => {
  res.send('Welcome to Homepage')
})
app.get('/users', (req, res) => {
  res.send('Welcome to Users Page')
})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})
