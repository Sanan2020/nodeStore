const Product = require('../models/products')

module.exports = (req, res) =>{
    const selectedOption = req.query.option ?? 'ASC';
    const sortOrder = selectedOption === 'ASC' ? 1 : -1;

    console.log(selectedOption);
    Product.find({}).sort({ price: sortOrder }).exec().then(doc => {
        res.render('shop/index',{products:doc ,selectedOption: selectedOption})
    }).catch(err => {console.error('Error:', err);});
}