// ใช้งาน mongoose
const mongoose = require('mongoose')
//++
// const autoIncrement = require('mongoose-auto-increment');
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
    cid:Number,
    firstName:String,
    lastName:String,
    address:String,
    email:String,
    phone:Number
})
// สร้าง Model
let Customer = mongoose.model("customers",customerSchema)

// ส่งออก Model
module.exports = Customer;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveCustomer=function(model,datac){
  model.save(datac)
} 