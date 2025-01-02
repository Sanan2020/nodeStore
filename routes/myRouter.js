const express = require('express')
const Product = require('../models/products')
const router = express.Router()

const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/image')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg")
    }
})
const upload = multer({
    storage:storage
})

router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/insert',upload.single("image"),(req,res)=>{
    let data = new Product({
        name:req.body.name,
        price:req.body.price,
        image:req.file.filename,
        description:req.body.description
    })
   try{
    Product.seveProduct(data)
    console.log(data)
    // res.send('save data success')
    res.redirect('/')
   }catch(err){
    console.error('Error saving user:', err);
   }
})

module.exports = router