const express = require('express')
const router = express.Router()
const upload = require("../middlewares/upload");
require('dotenv').config(); //++

const Order = require('../models/orders')
router.get('/pop', async (req, res) => {
    // const order = await Order.findById('67b60a6d3256e4cdfa1d3d04').populate("customer");
    const orders = await Order.find().populate("customer"); // ดึงข้อมูลลูกค้า
    console.log(orders)
    res.render("admin/invoice", { orders });
}); 
router.get("/order/:id", async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("customer");
      if (!order) {
        return res.status(404).json({ error: "ไม่พบใบสั่งซื้อ" });
      }
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
  });

const authController = require('../controllers/auth')
const adminController = require('../controllers/admin')
const shopController = require('../controllers/shop')

const redirectifAuth = require('../middlewares/redirectifAuth')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

router.get('/login', redirectifAuth, authController.getLogin)
router.get('/adminLogin', authController.getAdminLogin)
router.get('/logout', authController.getLogout)
router.get('/signup', redirectifAuth, authController.getSignup)
router.get('/forgot', redirectifAuth, authController.getForgot)
router.post('/login', redirectifAuth, authController.postLogin)
router.post('/adminLogin', authController.postAdminLogin)
router.post('/signup', redirectifAuth, authController.postSignup)
router.post('/forgot', redirectifAuth, authController.postForgot)

router.get('/',shopController.getProducts)
router.get('/product/:id', shopController.getProduct)
router.get('/cart', authMiddleware, shopController.getCart)
router.get('/checkout', authMiddleware, shopController.getCheckout)
router.post('/checkout', authMiddleware, express.json(), shopController.postCheckout);
router.post('/webhook', express.raw({type: 'application/json'}), shopController.postWebhook);
router.get('/success', shopController.getWebhookSuccess)
router.get('/cancel', shopController.getWebhookCancel)   
router.get('/sessionAddtoCart', (req, res) => {
    if (!req.session.customerId) {
        return res.json({ loggedIn: false });
    }
    res.json({ loggedIn: true, customerId: req.session.customerId });
});   

router.get('/dashboard', adminMiddleware, adminController.getDashboard)
router.get('/pending', adminMiddleware, adminController.getPending)
router.get('/insert', adminMiddleware, adminController.getInsertProduct)
router.post('/insert', adminMiddleware, upload.single("image"), adminController.postInsertProduct)
router.post('/edit', adminMiddleware, adminController.postEditProduct)
router.post('/update', adminMiddleware, upload.single("image"), adminController.postUpdateProduct)
router.get('/delete/:id', adminMiddleware, adminController.getDeleteProduct)

module.exports = router