const Customer = require('../models/customers')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res) =>{
    res.render('auth/login')
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

    const customer = await Customer.findOne({ email: email})
    console.log(customer)

    if(customer){
        let cmp = await bcrypt.compare(password, customer.password)
        if(cmp){
            req.session.customerId = customer._id
            console.log(req.session.customerId)
            res.redirect('/')
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
}

exports.postSignup = (req, res) => {
    // const email = req.body.email;
    // const password = req.body.password;
    // console.log(" e:"+email+" p:"+password)
    // res.send(`User created with email: ${email} and password: ${password}`);

    Customer.create(req.body).then(() =>{
        console.log('Customer registered successfuly!')
        res.redirect('/')
    }).catch((error) =>{
        console.log(error)
    })
}

exports.postForgot = (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
}