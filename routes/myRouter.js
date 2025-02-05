const express = require('express')
const Product = require('../models/products')
const Customer = require('../models/customers')
const Oder = require('../models/oders')
const router = express.Router()

let receivedData;
let TestOID;

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

router.get('/checkout-data',(req,res)=>{ 
//2 +pid ,count ,cid
     receivedData = req.query;
    // console.log('Received data:',receivedData);

    async function getData() {
      for (let key in receivedData) {
        if (receivedData.hasOwnProperty(key)) { // ตรวจสอบว่าเป็นคีย์ที่มีอยู่ในอ็อบเจกต์
        console.log(`Key: ${key}, Value: ${receivedData[key]}`);

            const data = await Product.findById(key).exec();  // รอผลลัพธ์จากการค้นหา
            // console.log(data.price);
            // listData.push(data.price);

        // Product.findById(key)
        // .then(product => {
        //     console.log(product.price);
        //      listData.push({pid:key,quantity: receivedData[key],price:product.price});
        //      console.log(listData);
        //     // dataOder.products.push({pid:key,quantity: receivedData[key],price:dataOder.products})
        //     // dataOder.products.push({pid:key,quantity: receivedData[key]})
        //     // console.log(dataOder.products);
        // }).catch(error => {
        // console.error('Error finding product:', error);
        // });

         // dataOder.products.push({pid:key})
         //     data2 = data.filter(function(item) {
         //         return item._id == key;
         //     });
         //    console.log(`${data2[0].id} ,${receivedData[key]}`);
         //     console.log(`${data2[0].id} ,${data2[0].price * receivedData[key]}`);
        }
    }
    return listData;
}
// getData(receivedData).then(() => {
//     console.log(listData);  // ผลลัพธ์ทั้งหมดจากการ push
//     // console.log(prod);
// });
    // console.log('da:',da);
});
router.post('/checkout',(req,res)=>{ 
    try{
        //1.save customer หากมีแล้วจะทำการแก้ไขข้อมูลเดิม
        let datac = new Customer({
            cid:"14236590",
            firstName:req.body.name,
            lastName:req.body.last,
            address:req.body.address,
            email:req.body.email,
            phone:req.body.phone,
        });
        // Customer.seveCustomer(datac)
    }catch(err){console.error('Error saving user:', err);}

    //2.data for oder
        //ชำระด้วย
        let payment = req.body.promptpay;
        //check id ,count 
    
        let dateNow = Date.now();
        TestOID = dateNow;
        // console.log(dateNow);
        
    //3.create oder
    let dataOder = new Oder({
        // orderId:1025,
        orderId:dateNow,
        products: [
            {
                // pid: data._id,  // อ้างอิงไปที่ _id ของสินค้าที่เลือก
                pid: 101,  // อ้างอิงไปที่ _id ของสินค้าที่เลือก
                quantity: 0,
                price: 0
            }],
        // qty:receivedData[key],
        // customer:data._id,
        customer: 1010,
        payment:{
            method: payment,
            status:'รอชำระเงิน',
        },
        // status:'',
        total:0,
        orderDate:0,
    });

    async function getData() {
        for (let key in receivedData) {
            if (receivedData.hasOwnProperty(key)) { // ตรวจสอบว่าเป็นคีย์ที่มีอยู่ในอ็อบเจกต์
                // console.log(`Key: ${key}, Value: ${receivedData[key]}`);
                const data = await Product.findById(key).exec();  // รอผลลัพธ์จากการค้นหา
                dataOder.products.push({pid:key,quantity: receivedData[key],price:data.price})
            }
        }
    }
    getData(receivedData).then(() => {
        dataOder.total = dataOder.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
    // console.log(dataOder.total);  // แสดงผลยอดรวม
    Oder.seveOder(dataOder);
    res.redirect('/payment');
    });
});

router.get('/payment',(req,res)=>{ 
    //1.show detail oder +ui order +ref oid test/
    //2.show image qr   
    //3.status oder

    Oder.findOne({orderId:TestOID}).exec().then(doc => {
        // console.log(doc);
        const formattedDate = doc.orderDate.toLocaleDateString('th-TH'); 
        // displayOrder =  doc.orderId , doc.payment.method
        // doc.total , formattedDate;
 
        res.render('shop/payment',{orderId:doc.orderId , payment:doc.payment.method
            ,total:doc.total , orderDate:formattedDate ,status:doc.payment.status});
        console.log(formattedDate);
    }).catch(err => { 
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    });

    //4.user -> page track order
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