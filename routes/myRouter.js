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

//-----------user------------// home = product + cart + checkout + payment

router.get('/',(req,res)=>{
    // res.render('navbar')
    Product.find({}).exec().then(doc => {
        res.render('index',{products:doc})
    }).catch(err => {console.error('Error:', err);});
})

router.get('/detail/:id',(req,res)=>{
    const product_id = req.params.id
    Product.findOne({_id:product_id}).exec().then(doc => {
        res.render('product',{product:doc})
    }).catch(err => {console.error('Error:', err);});
    
})

//-----------admin------------// manage = delete + frmedit edit + frminsert insert + oder
router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const timeExpire = 1000
    console.log(email)
    console.log(password)
    
    if(email === "admin@n" && password === "123"){
        res.redirect('/manage')
        console.log('if')
    }else{
        res.redirect('login')
        console.log('else')
    }
})

router.get('/manage',(req,res)=>{
    Product.find({}).exec().then(doc => {
        res.render('manage',{products:doc})
    }).catch(err => {console.error('Error:', err);});
})

router.get('/frminsert',(req,res)=>{
    res.render('frminsert')
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
        res.redirect('/manage')
    }catch(err){console.error('Error saving user:', err);}
})

router.post('/frmedit',(req,res)=>{
    const edit_id = req.body.edit_id
    Product.findOne({_id:edit_id}).exec().then(doc => {
        res.render('frmedit',{product:doc})
    }).catch(err => {console.error('Error:', err);});
})

router.post('/update',(req,res)=>{
    const update_id = req.body.update_id
    let data = {
        name:req.body.name,
        price:req.body.price,
        // image:req.file.filename,
        description:req.body.description
    }
    console.log(data)
    Product.findByIdAndUpdate(update_id,data,{useeFindAndModify:false}).exec().then(doc => {
        res.redirect('/manage')
    }).catch(err => {console.error('Error:', err);});
})

router.get('/delete/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id,{useeFindAndModify:false}).exec().then(doc => {
        res.redirect('/manage')
    }).catch(err => {console.error('Error:', err);});
})


//--------------TEST-API-----------------//
// testSignup
router.get('/signup', (req, res) => {
    res.render('signup')
});

router.post('/testAPI', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    console.log("u:"+username+" e:"+email+" p:"+password)
    res.send(`User created with username: ${username} and email: ${email} and password: ${password}`);
});

//testForgot
router.get('/forgot', (req, res) => {
   res.render('forgot')
});


router.post('/testForgot', (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
});

module.exports = router