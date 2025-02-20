const mongoose = require("../config/database");
// const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
// ออกแบบ Schema
// const customerSchema = new Schema({
let accountSchema = mongoose.Schema({
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    address:String,
    phone: {type: String},
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

const Account = mongoose.model("accounts",accountSchema)
module.exports = Account;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
// module.exports.saveCustomer=function(model,data){
//   model.save(data)
// } 