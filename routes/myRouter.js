const express = require('express')
const Product = require('../models/products')
const Customer = require('../models/customers')
const Oder = require('../models/oders')
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

//test API
router.get('/testAPI', (req, res) => {
    Product.find({}).exec().then(doc => {
        res.json(doc); // ส่งข้อมูลในรูปแบบ JSON
    }).catch(err => {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    });
});
//-----------user------------// home = product + cart + checkout + payment
router.get('/',(req,res)=>{
    const selectedOption = req.query.option ?? 'ASC';
    const sortOrder = selectedOption === 'ASC' ? 1 : -1;

    console.log(selectedOption);
    Product.find({}).sort({ price: sortOrder }).exec().then(doc => {
        res.render('shop/index',{products:doc ,selectedOption: selectedOption})
    }).catch(err => {console.error('Error:', err);});
});

router.get('/detail/:id',(req,res)=>{
    const product_id = req.params.id
    Product.findOne({_id:product_id}).exec().then(doc => {
        res.render('shop/product',{product:doc})
    }).catch(err => {console.error('Error:', err);});
    
});

router.get('/cart',(req,res)=>{ 
    res.render('shop/cart')
});

router.get('/checkout',(req,res)=>{ 
    res.render('shop/checkout')
});

router.get('/check',(req,res)=>{ 
//2
    // console.log('Received data:',req.query);
    let receivedData = req.query;

    async function getData() {
        try {
            const data = await Product.find({}).exec();  // รอผลลัพธ์จากการค้นหา
           // console.log(data);  // แสดงข้อมูล

           let data2;
            for (let key in receivedData) {
                if (receivedData.hasOwnProperty(key)) { // ตรวจสอบว่าเป็นคีย์ที่มีอยู่ในอ็อบเจกต์
                // console.log(`Key: ${key}, Value: ${receivedData[key]}`);

                    data2 = data.filter(function(item) {
                        return item._id == key;
                    });
                    console.log(`${data2[0].id} ,${receivedData[key]}`);
                    //console.log(`${data2[0].id} ,${data2[0].price * receivedData[key]}`);

                    //3
                    let dataOder = new Oder({
                        oid:10000,
                        pid:data2[0].id,
                        qty:receivedData[key],
                        cid:123456,
                        payment:"promptpay",
                        total:0
                    })
                    console.log(dataOder);
                }
            }



        } catch (error) {
            console.error(error);  // จัดการข้อผิดพลาด
        }
    }
    getData();
});
router.post('/checkout',(req,res)=>{ 
    //1.save customer
    let datac = new Customer({
        cid:"14236590",
        firstName:req.body.name,
        lastName:req.body.last,
        address:req.body.address,
        email:req.body.email,
        phone:req.body.phone,
    })
    try{
        Customer.seveCustomer(datac)
        res.send(datac);
        console.log(datac);
        // res.redirect('/manage')
    }catch(err){console.error('Error saving user:', err);}

    //2.data for oder
      //ชำระด้วย
      console.log(req.body.promptpay);
      //id ,count
    //   let dt = req.body.dt;
    //   let array = dt.split(",");
    //   console.log(req.query);
    //   console.log(req.body.dt);

      //check id ,count

      //3.oder
        //create oder
        //save oder

    // res.render('shop/payment')
});

router.post('/payment',(req,res)=>{ 
    //1.show detail oder

    //2.show image qr

    //3.status oder
});

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
        res.render('admin/manage',{products:doc})
    }).catch(err => {console.error('Error:', err);});
})

router.get('/frminsert',(req,res)=>{
    res.render('admin/frminsert')
})

router.post('/insert',upload.single("image"),(req,res)=>{
    let data = new Product({
        pid:'1010',
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
        res.render('admin/frmedit',{product:doc})
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
        res.redirect('/manage');
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