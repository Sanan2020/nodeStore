// ใช้งาน mongoose
const mongoose = require('mongoose')
// เชื่อมต่อไปยัง MongoDB
const dbUrl = 'mongodb+srv://admin:123456789123@cluster0.wty1w.mongodb.net/productDB'
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Database connected successfully [products]');
  })
  .catch(err => {
    console.log('Database connection error: ', err);
  });
// ออกแบบ Schema
let productSchema = mongoose.Schema({
    pid:Number,
    name:String,
    price:Number,
    image:String,
    description:String
})
// สร้าง Model
let Product = mongoose.model("products",productSchema)

// ส่งออก Model
module.exports = Product;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveProduct=function(model,data){
    model.save(data)
} 