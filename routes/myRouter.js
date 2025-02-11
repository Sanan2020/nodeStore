const express = require('express')
const Product = require('../models/products')
const Customer = require('../models/customers')
const Order = require('../models/orders')
const router = express.Router()

let receivedData;
let TestOID;

// const stripe = require('stripe')('sk_test_51QqHUZ4RszKPv2HXkSCAx7j13kzCCsSfAn3aryM8o8EeICH2GI44aVvL8RK0ED6LN1Zu9983T52KKzN2sYjO3uia00OnmwiBIA')
const stripe = require('stripe')('sk_test_51QqHUEGOHvu7H7KGBrMRMUjmqPHstPiurAa5iFU3hoApqZyzx39k2RBXOdOEghyncRFVxwtEQ3YdcfsdFGSz6KyY00Yga54qMd')
// const endpointSecret = 'whsec_...';
const endpointSecret = 'whsec_db80efa46961b7814cf20581d0a7533afe2b076f8055e1f038aff5d64caf3233';
// const endpointSecret = 'whsec_RCewCZqDbDrOHrltCklQ1VdoUOFlq4dX';

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
// router.get('/testAPI', (req, res) => {
//     Product.find({}).exec().then(doc => {
//         res.json(doc); // ส่งข้อมูลในรูปแบบ JSON
//     }).catch(err => {
//         console.error('Error:', err);
//         res.status(500).send('Internal Server Error');
//     });
// });
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
});
router.post('/checkout',express.json(), async (req,res)=>{ 
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
       
        // const {user, product} = req.body;
        const user = {
            "name": "Mike",
            "address": "this"
        }
        const product = [{
            "name": "Test",
            "price": 200,
            "quantity": 1
        }]

        const dt = {
            "name": "Test",
            "price": 200,
            "quantity": 2
        }

        const products = await Promise.all(
            Object.keys(receivedData).map(async (key) => {
                const data = await Product.findById(key).exec();
                    
                if (!data) {
                    console.warn(`⚠️ ไม่พบสินค้า ID: ${key}`);
                    return null;
                }
    
                return {
                    name: data.name,
                    quantity: receivedData[key],
                    price: data.price,
                };
            })
        );
        console.log(products);

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items: products.map(product => ({ 
            price_data:{
                currency: 'thb',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100,
            }, 
            quantity: product.quantity,
        })),
        mode: 'payment',
        success_url: `http://localhost:8080/success.html?id=${456}`,
        cancel_url: `http://localhost:8080/cancel.html`
    })
    console.log(session);

    //3.create oder
    let dataOrder = new Order({
        orderId: Date.now(),
        sessionId: session.id,
        customer: 1010,
        products: products.map(product => ({ 
            // pid: 102, 
            name: product.name, 
            quantity: product.quantity,
            price: product.price,
        })),
        // [{
        //     pid: 102,  // อ้างอิงไปที่ _id ของสินค้าที่เลือก
        //     quantity: 1,
        //     price: 199
        // }],
        payment:{
            // method: session.payment_method_types,
            status: session.status,
        },
        // status:'',
        total: products.reduce((total, product) => total + product.price * product.quantity, 0),
        orderDate:0,
    });
    console.log(dataOrder); 
    Order.seveOrder(dataOrder);

    // for (let key in receivedData) {
    //     if (receivedData.hasOwnProperty(key)) { // ตรวจสอบว่าเป็นคีย์ที่มีอยู่ในอ็อบเจกต์
    //     // console.log(`Key: ${key}, Value: ${receivedData[key]}`);
    //     const data = await Product.findById(key).exec();  // รอผลลัพธ์จากการค้นหา
    //     dataOder.products.push({pid:key,quantity: receivedData[key],price:data.price})
    // }
    // }

    // dataOrder.total = dataOrder.products.reduce((total, product) => total + product.price * product.quantity, 0);
        
    res.redirect(session.url);
    // res.send()
});

//webhook
router.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
    // let event = request.body;
    let event;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
    //   case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;  
        console.log(paymentIntent);

        const sessionId = paymentIntent.id;
        console.log(sessionId);
        const status = paymentIntent.status;
        console.log(status);

       const result = await Order.findOneAndUpdate({sessionId: sessionId}, {"payment.status": status }, { new: true });
        console.log(result);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });    

//success ?
router.get('/order/:id', async (req, res)=>{
    const orderId = req.params.id;
    // const data = await Oder.findById(orderId).exec(); 
    Oder.findOne({orderId:orderId}).exec().then(doc => {
        res.json(doc)
    }).catch(err => {console.error('Error:', err);});

})

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