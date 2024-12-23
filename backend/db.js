const mongoose = require('mongoose')

const dbURI = "mongodb://localhost:27017/task_management"

const connectDB = () => {
   mongoose.connect(dbURI).then(console.log(`Connected to ${dbURI}`));
}

module.exports = connectDB