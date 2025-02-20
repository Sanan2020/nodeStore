const Product = require('../models/products')
const Order = require('../models/orders')

exports.getDashboard = async (req,res)=>{
    try{
        const products = await Product.find({}).exec();
        res.render('admin/dashboard',{ products })
    }catch (err) {
        console.error('Error:', err);
        res.status(500).send("เกิดข้อผิดพลาดในการเรียกดูสินค้า");
    }
}

exports.getPending = async (req,res)=>{
    // const orders = await Order.find({ status: "Pending" });
    // const orders = await Order.findById('67b60a6d3256e4cdfa1d3d04').populate("customer");
    try{
        const orders = await Order.find().populate("customer"); 
        console.log(orders)
        res.render("admin/pendingOrder", { orders });
    }catch (err) {
        console.error('Error:', err);
        res.status(500).send("เกิดข้อผิดพลาดในการเรียกดูออเดอร์");
    }
}

exports.getOeder = async (req,res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("customer");
        if (!order) {
            return res.status(404).json({ error: "ไม่พบใบสั่งซื้อ" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
}

exports.getInsertProduct = (req,res)=>{
    try {
        res.render('admin/insertProduct');
    } catch (error) {
        console.error("Error rendering insertProduct:", error);
    }
}

exports.postInsertProduct = async (req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).send("กรุณาอัปโหลดรูปภาพ");
        }
        
        let data = new Product({
        name:req.body.name,
        price:req.body.price,
        image:req.file.filename,
        description:req.body.description
        })
        await Product.seveProduct(data)
        req.flash("insert", "เพิ่มสินค้าเรียบร้อยแล้ว!");
        res.redirect('/dashboard')
    }catch(err){
        console.error('Error saving user:', err);
        res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
}

exports.postEditProduct = async (req,res)=>{
    try{
        const edit_id = req.body.edit_id
        const product = await Product.findOne({_id:edit_id}).exec()
        res.render('admin/editProduct',{ product })
    } catch (error) {
        console.error("Error rendering editProduct:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการโหลดหน้า");
    }
}

exports.postUpdateProduct = async (req,res)=>{
    try{
        const update_id = req.body.update_id

        let _image = req.body.old_image
        if (req.file) {
        _image = req.file.filename;
        }
        let data = {
            name:req.body.name,
            price:req.body.price,
            image:_image,
            description:req.body.description
        }
        console.log(data)
        await Product.findByIdAndUpdate(update_id,data,{useeFindAndModify:false}).exec();
        req.flash("edit", "แก้ไขสินค้าเรียบร้อยแล้ว!");
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
    }
}

exports.getDeleteProduct = async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id,{useeFindAndModify:false}).exec();
        res.redirect('/dashboard')
    }catch (err) {
        console.error('Error:', err);
        res.status(500).send("เกิดข้อผิดพลาดในการลบสินค้า");
    }
}