// ใช้งาน mongoose
const mongoose = require('mongoose')
const Product = require('../models/products')
const Customer = require('../models/customers')
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
    // oid:Number,
    // pid:String,
    // qty:Number,
    // cid:Number,
    // payment:String,
    // total:Number

    orderId: {
      type: Number,
      required: true,
      unique: true
  },
  customer: { 
      // type: mongoose.Schema.Types.ObjectId, 
      // ref: 'Customer',  // อ้างอิงไปที่ Model 'Customer'
      // required: true 
  },
  products: [{
      // pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // อ้างอิงไปที่ Model 'Product'
      // quantity: { type: Number, required: true }, 
      // price: { type: Number, required: true }
  }],
  payment: {
      method: { type: String, required: true },
      status: { type: String, required: true },
      // transactionId: { type: String }
  },
  // status: { type: String, default: 'Pending', enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'] },
  total: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  // shippingAddress: { type: String, required: true },
  // notes: { type: String }
})
// สร้าง Model
let Oder = mongoose.model("oders",oderSchema)

// ส่งออก Model
module.exports = Oder;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveOder=function(model,data){
  model.save(data)
} 