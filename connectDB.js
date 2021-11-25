const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB!')
  } catch (error) {
    console.log('Connection Failed !')
  }
}

module.exports = {ConnectDB}
