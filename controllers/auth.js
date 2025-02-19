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
        res.redirect('/')
    })
}

exports.getSignup = (req, res) => {
    res.render('auth/signup')
}

exports.getForgot = (req, res) => {
    res.render('auth/forgot')
}

exports.postLogin = async (req,res)=>{
    const { email, password } = req.body;
    const customer = await Account.findOne({ email: email})
    console.log(customer)

    if(customer && customer.role == "customer"){
        let cmp = await bcrypt.compare(password, customer.password)
        if(cmp){
            req.session.customerId = customer._id
            req.session.role = customer.role;
            res.redirect('/')
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
}

exports.postAdminLogin = async (req,res)=>{
    const { email, password } = req.body;
    const admin = await Account.findOne({ email: email})
    console.log(admin)

    if(admin && admin.role == "admin"){
        let cmp = await bcrypt.compare(password, admin.password)
        if(cmp){
            req.session.adminId = admin._id
            req.session.role = admin.role;
            res.redirect('/dashboard')
        }else{
            res.redirect('/adminLogin')
        }
    }else{
        res.redirect('/adminLogin')
    }
}

exports.postSignup = (req, res) => {
    // const email = req.body.email;
    // const password = req.body.password;
    // console.log(" e:"+email+" p:"+password)
    // res.send(`User created with email: ${email} and password: ${password}`);

    Account.create(req.body).then(() =>{
        console.log('Customer registered successfuly!')
        res.redirect('/login')
    }).catch((error) =>{
        console.log(error)
    })
}

exports.postForgot = (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
}