const mongoose = require("../config/database");
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