// ใช้งาน mongoose
const mongoose = require('mongoose')
// เชื่อมต่อไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/productDB'
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.log('Database connection error: ', err);
  });
// ออกแบบ Schema
let customerSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    address:String,
    email:String,
    phone:Number,
    orderNumber:Number,
})
// สร้าง Model
let Customer = mongoose.model("customers",customerSchema)

// ส่งออก Model
module.exports = Customer;