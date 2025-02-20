const mongoose = require("../config/database");
// ออกแบบ Schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

let Product = mongoose.model("products",productSchema)
module.exports = Product;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveProduct=function(model,data){
    model.save(data)
} 