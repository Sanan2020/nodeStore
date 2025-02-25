const mongoose = require("../config/database");

let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

let Product = mongoose.model("products",productSchema)
module.exports = Product;

module.exports.seveProduct=function(model,data){
    model.save(data)
} 