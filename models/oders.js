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
let oderSchema = mongoose.Schema({
    oid:Number,
    pid:String,
    qty:Number,
    cid:Number,
    payment:String,
    total:Number
})
// สร้าง Model
let Oder = mongoose.model("oders",oderSchema)

// ส่งออก Model
module.exports = Oder;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
// module.exports.seveCustomer=function(model,datac){
//   model.save(datac)
// } 