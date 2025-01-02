const express = require('express')
const Product = require('../models/products')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/insert',(req,res)=>{
    let data = new Product({
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        description:req.body.description
    })
   console.log(data)
   try{
    Product.seveProduct(data)
    res.send('save data success')
   }catch(err){
    console.error('Error saving user:', err);
   }
})

module.exports = router