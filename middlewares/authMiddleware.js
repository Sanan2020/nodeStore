const Account = require('../models/accounts.js')

module.exports = (req, res, next) =>{
    Account.findById(req.session.customerId).then((customer) =>{
        if(!customer){
            return res.redirect('/')
        }
        console.log('Customer logged in successfully')
        next()
    }).catch(error => {
        console.error(error)
    });
}