const mongoose = require("../config/database");
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