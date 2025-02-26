const Product = require('../models/products')
const Account = require('../models/accounts')
const Order = require('../models/orders')
const mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// const endpointSecret = 'whsec_db80efa46961b7814cf20581d0a7533afe2b076f8055e1f038aff5d64caf3233';
// const BASE_URL = "http://localhost:4000";
const endpointSecret = 'whsec_RCewCZqDbDrOHrltCklQ1VdoUOFlq4dX'
BASE_URL = 'https://nodestore-v9a4.onrender.com'

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

exports.getCheckout = async (req,res)=>{ 
    try{
        const customer = await Account.findById(loggedIn);
        console.log(customer)
        res.render('shop/checkout', {customer})
    } catch (error) {
        console.error("Error fetching checkout:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการโหลด checkout");
    }
}

exports.postCheckout = async (req,res)=>{ 
    try {
        const { customer, order } = req.body;
        let { firstName, lastName, address, phone } = customer;

        // 1. อัปเดตข้อมูลอื่นๆ โดยไม่แก้ไข email & password
        let updatedCustomer = await Account.findByIdAndUpdate(loggedIn, { firstName, lastName, address, phone },{ new: true } );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "ไม่พบลูกค้า" });
        }
        console.log(updatedCustomer)

        //2.ดึงข้อมูลสินค้า
        // let payment = req.body.promptpay;
        const createOrderId = Date.now();
        const products = await Promise.all(
            order.map(async ([productId, quantity]) => { // ดึงค่า productId และ quantity ออกจากอาร์เรย์
                const data = await Product.findById(productId).exec();       
                if (!data) {
                    console.warn(`ไม่พบสินค้า ID: ${productId}`);
                    return null; // ข้ามสินค้าที่หาไม่เจอ
                }
                return {
                    pid: productId,
                    name: data.name,
                    quantity: quantity,
                    price: data.price,
                };
            })
        );
        console.log('products:', products);

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
        console.log('session:', session);

        //4.create oder
        let dataOrder = new Order({
        orderId: createOrderId,
            sessionId: session.id,
            customer: loggedIn,
            products: products.map(product => ({ 
                pid: product.pid, 
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
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
    }
}

exports.postWebhook = async (request, response) => {
    try{
        // let event = request.body;
        let event;
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
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
    }
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