const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
const dbUrl = 'mongodb+srv://admin:123456789123@cluster0.wty1w.mongodb.net/productDB'
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.log('Database connection error: ', err);
  });

module.exports = mongoose;