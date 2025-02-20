const Account = require('../models/accounts')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res) =>{
    res.render('auth/login')
}

exports.getAdminLogin = (req, res) =>{
    res.render('auth/adminLogin')
}

exports.getLogout = (req, res) =>{
    req.session.destroy(() =>{
        res.redirect("/?logout=success");
    })
}

exports.getSignup = (req, res) => {
    res.render('auth/signup')
}

exports.getForgot = (req, res) => {
    res.render('auth/forgot')
}

exports.postLogin = async (req,res)=>{
    try{
        const { email, password } = req.body;
        const customer = await Account.findOne({ email: email})
        console.log(customer)

        if(customer && customer.role == "customer"){
            let cmp = await bcrypt.compare(password, customer.password)
            if(cmp){
                req.session.customerId = customer._id
                req.session.role = customer.role;
                req.flash("success", "ลูกค้าล็อกอินสำเร็จ!");
                res.redirect('/')
            }else{
                req.flash("error", "อีเมลหรือรหัสผ่านลูกค้าไม่ถูกต้อง!");
                res.redirect('/login')
            }
        }else{
            req.flash("error", "อีเมลหรือรหัสผ่านลูกค้าไม่ถูกต้อง!");
            res.redirect('/login')
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

exports.postAdminLogin = async (req,res)=>{
    try{
        const { email, password } = req.body;
        const admin = await Account.findOne({ email: email})
        console.log(admin)

        if(admin && admin.role == "admin"){
            let cmp = await bcrypt.compare(password, admin.password)
            if(cmp){
                req.session.adminId = admin._id
                req.session.role = admin.role;
                req.flash("success", "admin ล็อกอินสำเร็จ!");
                res.redirect('/dashboard')
            }else{
                req.flash("error", "อีเมลหรือรหัสผ่าน admin ไม่ถูกต้อง!");
                res.redirect('/adminLogin')
            }
        }else{
            req.flash("error", "อีเมลหรือรหัสผ่าน admin ไม่ถูกต้อง!");
            res.redirect('/adminLogin')
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

exports.postSignup = async (req, res) => {
    try {
        const signup = req.body;
        const account = await Account.findOne({ email: signup.email})
        if(!account){
            await Account.create(signup);
            req.flash("success", "สมัครสมาชิกสำเร็จ!");
            res.redirect('/login');
        }else{
            req.flash("error", "ไม่สามารถใช้บัญชีนี้ได้!");
            res.redirect('/signup');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสมัครสมาชิก:', error);
    }
}

exports.postForgot = (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
}