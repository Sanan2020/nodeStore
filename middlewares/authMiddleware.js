const Customer = require('../models/customers.js')

module.exports = (req, res, next) =>{
    Customer.findById(req.session.customerId).then((customer) =>{
        if(!customer){
            return res.redirect('/')
        }
        console.log('Customer logged in successfully')
        next()
    }).catch(error => {
        console.error(error)
    });
}