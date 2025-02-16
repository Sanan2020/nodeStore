const Product = require('../models/products')
const Customer = require('../models/customers')
const Order = require('../models/orders')
const mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = 'whsec_db80efa46961b7814cf20581d0a7533afe2b076f8055e1f038aff5d64caf3233';
const BASE_URL = "http://localhost:4000";

exports.getProducts = async (req, res) =>{
    try {
        const selectedOption = req.query.option ?? 'ASC';
        const sortOrder = selectedOption === 'ASC' ? 1 : -1;
        console.log(selectedOption);

        const products = await Product.find({}).sort({ price: sortOrder })
        res.render('shop/index', {products, selectedOption})
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการโหลดสินค้า");
    }
}

exports.getProduct = async (req,res)=>{
    try {
        const product_id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(product_id)) {
            return res.status(400).send("รหัสสินค้าไม่ถูกต้อง");
        }
        const product = await Product.findById(product_id);
        res.render('shop/product', { product })
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการโหลดสินค้า");
    }
}

exports.getCart = (req,res)=>{ 
    res.render('shop/cart')
}

exports.getCheckout = (req,res)=>{ 
    res.render('shop/checkout')
}

exports.postCheckout = async (req,res)=>{ 
    const { customer, order } = req.body;
    console.log("ข้อมูลลูกค้า:", customer);
    console.log("รายการสินค้า:", order);
    try{
        //1.save customer หากมีแล้วจะทำการแก้ไขข้อมูลเดิม
        let data = new Customer({
            cid:"14236590",
            firstName:req.body.name,
            lastName:req.body.last,
            address:req.body.address,
            email:req.body.email,
            phone:req.body.phone,
        });
        //await Customer.saveCustomer(data)
    }catch(err){console.error('Error saving user:', err);}
        //2.data for oder
        // let payment = req.body.promptpay;
        const createOrderId = Date.now();
        //products
        const products = await Promise.all(
            order.map(async ([productId, quantity]) => { // ดึงค่า productId และ quantity ออกจากอาร์เรย์
                const data = await Product.findById(productId).exec();
                    
                if (!data) {
                    console.warn(`ไม่พบสินค้า ID: ${productId}`);
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
        payment:{
            method: session.payment_method_types ? session.payment_method_types[0] : "unknown",
            status: session.status,
        },
        // status:'',
        total: products.reduce((total, product) => total + product.price * product.quantity, 0),
    });
    console.log(dataOrder); 
    Order.seveOrder(dataOrder);
    res.json({ sessid: session.id });
}

exports.postWebhook = async (request, response) => {
    // let event = request.body;
    let event;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    // Handle the event
    //case 'payment_intent.succeeded':
    switch (event.type) {
        case 'checkout.session.completed':  
            const paymentIntent = event.data.object;  
            console.log(paymentIntent);
            const sessionId = paymentIntent.id;
            const status = paymentIntent.status;
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
  }

exports.getWebhookSuccess = async (req, res)=>{
    try {
        const orderId = req.query.orderId;
        if (!orderId) {
            return res.status(400).send("Order ID ไม่ถูกต้อง");
        }
        console.log(orderId)
        const order = await Order.findOne({ orderId })
        res.render('shop/success',{ order })
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการโหลดคำสั่งซื้อ");
    }
}

exports.getWebhookCancel = (req, res)=>{
    res.render('shop/cancel')
}