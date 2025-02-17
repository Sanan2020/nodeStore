const express = require('express')
const router = express.Router()
const upload = require("../middlewares/upload");
require('dotenv').config(); //++

const authController = require('../controllers/auth')
const adminController = require('../controllers/admin')
const shopController = require('../controllers/shop')

const redirectifAuth = require('../middlewares/redirectifAuth')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/login', redirectifAuth, authController.getLogin)
router.get('/logout', authController.getLogout)
router.get('/signup', redirectifAuth, authController.getSignup)
router.get('/forgot', redirectifAuth, authController.getForgot)
router.post('/login', redirectifAuth, authController.postLogin)
router.post('/signup', redirectifAuth, authController.postSignup)
router.post('/forgot', redirectifAuth, authController.postForgot)

router.get('/dashboard', adminController.getDashboard)
router.get('/insert', adminController.getInsertProduct)
router.post('/insert', upload.single("image"), adminController.postInsertProduct)
router.post('/edit', adminController.postEditProduct)
router.post('/update', adminController.postUpdateProduct)
router.get('/delete/:id', adminController.getDeleteProduct)

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

module.exports = router