const Account = require('../models/accounts.js')

module.exports = async (req, res, next) =>{
    try{
        const admin = await Account.findById(req.session.adminId)
        if(!admin){
            return res.redirect('/')
        }
        console.log('Admin logged in successfully')
        next()
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
    }
}