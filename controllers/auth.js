exports.getLogin = (req, res) =>{
    res.render('auth/login')
}

exports.getSignup = (req, res) => {
    res.render('auth/signup')
}

exports.getForgot = (req, res) => {
    res.render('auth/forgot')
}

exports.postLogin = (req,res)=>{
     const email = req.body.email;
     const password = req.body.password;
     const timeExpire = 1000
     console.log(email)
     console.log(password)
     
     if(email === "admin@n" && password === "123"){
         res.redirect('admin/manage')
         console.log('if')
     }else{
         res.redirect('login')
         console.log('else')
     }
}

exports.postSignup = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    console.log("u:"+username+" e:"+email+" p:"+password)
    res.send(`User created with username: ${username} and email: ${email} and password: ${password}`);
}

exports.postForgot = (req, res) => {
    const email = req.body.email;
    console.log("email: "+email)
}