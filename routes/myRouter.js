const express = require('express')
const router = express.Router()
const upload = require("../middlewares/upload");
require('dotenv').config(); //++

const authController = require('../controllers/auth')
const adminController = require('../controllers/admin')
const shopController = require('../controllers/shop')

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.get('/forgot', authController.getForgot)
router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)
router.post('/forgot', authController.postForgot)

router.get('/dashboard', adminController.getDashboard)
router.get('/insert', adminController.getInsertProduct)
router.post('/insert', upload.single("image"), adminController.postInsertProduct)
router.post('/edit', adminController.postEditProduct)
router.post('/update', adminController.postUpdateProduct)
router.get('/delete/:id', adminController.getDeleteProduct)

router.get('/',shopController.getProducts)
router.get('/product/:id', shopController.getProduct)
router.get('/cart', shopController.getCart)
router.get('/checkout', shopController.getCheckout)
router.post('/checkout',express.json(), shopController.postCheckout);
router.post('/webhook', express.raw({type: 'application/json'}), shopController.postWebhook);
router.get('/success', shopController.getWebhookSuccess)
router.get('/cancel', shopController.getWebhookCancel)   

module.exports = router