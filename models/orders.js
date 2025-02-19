const mongoose = require("../config/database");
// ออกแบบ Schema
let orderSchema = mongoose.Schema({
  orderId: {
      type: Number,
      required: true,
      unique: true
  },
  sessionId: {
    type: String,
    required: true,
    // unique: true
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
  status: { type: String, default: 'Pending', enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'] },
  total: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  // shippingAddress: { type: String, required: true },
  // notes: { type: String }
})
// สร้าง Model
let Order = mongoose.model("orders",orderSchema)

// ส่งออก Model
module.exports = Order;

//ออกแบบฟังก์ชันบันทึกข้อมมูล
module.exports.seveOrder=function(model,data){
  model.save(data)
} 