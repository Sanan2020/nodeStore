const Product = require('../models/products')
const Order = require('../models/orders')

exports.getDashboard = (req,res)=>{
    Product.find({}).exec().then(doc => {
        res.render('admin/dashboard',{products:doc})
    }).catch(err => {console.error('Error:', err);});
}

exports.getPending = async (req,res)=>{
    // Order.find({status:'pending'}).exec().then(doc => {
    //     res.render('admin/pendingOrder',{order:doc})
    // }).catch(err => {console.error('Error:', err);});
    const orders = await Order.find({ status: "Pending" });
    res.render("admin/pendingOrder", { order: orders });
}

exports.getInsertProduct = (req,res)=>{
    res.render('admin/insertProduct')
}

exports.postInsertProduct = async (req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).send("กรุณาอัปโหลดรูปภาพ");
        }
        
        let data = new Product({
        pid:'1010',
        name:req.body.name,
        price:req.body.price,
        image:req.file.filename,
        description:req.body.description
        })
        await Product.seveProduct(data)
        res.redirect('/dashboard')
    }catch(err){console.error('Error saving user:', err);}
}

exports.postEditProduct = (req,res)=>{
    const edit_id = req.body.edit_id
    Product.findOne({_id:edit_id}).exec().then(doc => {
        res.render('admin/editProduct',{product:doc})
    }).catch(err => {console.error('Error:', err);});
}

exports.postUpdateProduct = (req,res)=>{
    const update_id = req.body.update_id
    let data = {
        name:req.body.name,
        price:req.body.price,
        // image:req.file.filename,
        description:req.body.description
    }
    console.log(data)
    Product.findByIdAndUpdate(update_id,data,{useeFindAndModify:false}).exec().then(doc => {
        res.redirect('/dashboard');
    }).catch(err => {console.error('Error:', err);});
}

exports.getDeleteProduct = (req,res)=>{
    Product.findByIdAndDelete(req.params.id,{useeFindAndModify:false}).exec().then(doc => {
        res.redirect('/dashboard')
    }).catch(err => {console.error('Error:', err);});
}