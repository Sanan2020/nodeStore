const Account = require('../models/accounts.js')

module.exports = (req, res, next) =>{
    Account.findById(req.session.adminId).then((admin) =>{
        if(!admin){
            return res.redirect('/')
        }
        console.log('Admin logged in successfully')
        next()
    }).catch(error => {
        console.error(error)
    });
}