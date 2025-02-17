const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://admin:123456789123@cluster0.wty1w.mongodb.net/productDB')
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.log('Database connection error: ', err);
  });

module.exports = mongoose;