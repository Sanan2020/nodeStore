const mongoose = require("../config/database");
// const Schema = mongoose.Schema
// const bcrypt = require('bcrypt')
// ออกแบบ Schema
// const customerSchema = new Schema({
let customerSchema = mongoose.Schema({
    cid:Number,
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    address:String,
    phone:Number,
})
// customerSchema.pre('save', function(next){
//   const customer = this
//   bcrypt.hash(customer.password, 10).then(hash =>{
//     customer.password = hash
//     next()
//   }).catch(err =>{
//     console.log(this.errors)
//   })
// })

// สร้าง Model
let Customer = mongoose.model("customers",customerSchema)
// ส่งออก Model
module.exports = Customer;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveCustomer=function(model,datac){
  model.save(datac)
} 