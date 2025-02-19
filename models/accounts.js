const mongoose = require("../config/database");
// const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
// ออกแบบ Schema
// const customerSchema = new Schema({
let accountSchema = mongoose.Schema({
    // cid:Number,
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    address:String,
    phone:Number,
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
})
accountSchema.pre('save', function(next){
  const account = this
  bcrypt.hash(account.password, 10).then(hash =>{
    account.password = hash
    next()
  }).catch(err =>{
    console.log(this.errors)
  })
})

// สร้าง Model
let Account = mongoose.model("accounts",accountSchema)
// ส่งออก Model
module.exports = Account;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
// module.exports.saveCustomer=function(model,data){
//   model.save(data)
// } 