const Account = require('../models/accounts.js')

module.exports = async (req, res, next) =>{
    try{
        const customer = await Account.findById(req.session.customerId)
        if(!customer){
            return res.redirect('/')
        }
        console.log('Customer logged in successfully')
        next()
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
    }
}