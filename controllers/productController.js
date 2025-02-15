const Product = require('../models/products')

module.exports = (req,res)=>{
    const product_id = req.params.id
    Product.findOne({_id:product_id}).exec().then(doc => {
        res.render('shop/product',{product:doc})
    }).catch(err => {console.error('Error:', err);});
}