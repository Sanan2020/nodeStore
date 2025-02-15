const express = require('express')
const Product = require('../models/products')
const Customer = require('../models/customers')
const Order = require('../models/orders')
const router = express.Router()

require('dotenv').config(); //++
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// const endpointSecret = 'whsec_RCewCZqDbDrOHrltCklQ1VdoUOFlq4dX'; 
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

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

//++
const indexController = require('../controllers/indexController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const loginController = require('../controllers/loginController')
const registerController = require('../controllers/registerController')
const forgotController = require('../controllers/forgotController')

//-----------user------------// home = product + cart + checkout + payment
router.get('/',indexController)
router.get('/product/:id', productController)
router.get('/cart', cartController)
router.get('/login', loginController)
router.get('/register', registerController)
router.get('/forgot_password', forgotController)

router.get('/checkout',(req,res)=>{ 
    console.log('Environment',BASE_URL)
    res.render('shop/checkout')
});

router.post('/checkout',express.json(), async (req,res)=>{ 
    const { customer, order } = req.body;
    console.log("✅ ข้อมูลลูกค้า:", customer);
    console.log("✅ รายการสินค้า:", order);
    
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
        // let payment = req.body.promptpay;

        const createOrderId = Date.now();
        //products
        const products = await Promise.all(
            order.map(async ([productId, quantity]) => { // 📌 ดึงค่า productId และ quantity ออกจากอาร์เรย์
                const data = await Product.findById(productId).exec();
                    
                if (!data) {
                    console.warn(`⚠️ ไม่พบสินค้า ID: ${productId}`);
                    return null; // ข้ามสินค้าที่หาไม่เจอ
                }
        
                return {
                    name: data.name,
                    quantity: quantity,
                    price: data.price,
                };
            })
        );
        console.log(`===products===`);
        console.log(products);

    //3.create session
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
        success_url: `${BASE_URL}/success?orderId=${createOrderId}`,
        cancel_url: `${BASE_URL}/cancel`
        // success_url: `https://nodestore-v9a4.onrender.com/success?orderId=${createOrderId}`,
        // cancel_url: `https://nodestore-v9a4.onrender.com/cancel`
    })
    console.log(session);

    //4.create oder
    let dataOrder = new Order({
        orderId: createOrderId,
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

    // dataOrder.total = dataOrder.products.reduce((total, product) => total + product.price * product.quantity, 0);
    // res.redirect(session.url);
    // res.json({ url: session.url });
    res.json({ sessid: session.id });
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

router.get('/success', (req, res)=>{
    const orderId = req.query.orderId;
    console.log(orderId)
    Order.findOne({orderId:orderId}).exec().then(doc => {
        res.render('shop/success',{order:doc})
    }).catch(err => {console.error('Error:', err);});
})

router.get('/cancel', (req, res)=>{
    res.render('shop/cancel')
})

//-----------admin------------// manage = delete + frmedit edit + frminsert insert + oder

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
router.post('/testAPI', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    console.log("u:"+username+" e:"+email+" p:"+password)
    res.send(`User created with username: ${username} and email: ${email} and password: ${password}`);
});

//testForgot
router.post('/testForgot', (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
});

module.exports = router