const express = require('express')
const path = require('path')
const router = require('./routes/Router')
const app = express()
const port = process.env.PORT || 4000;
const session = require('express-session')
const flash = require("connect-flash");
global.loggedIn = null

// ตั้งค่า session middleware
app.use(session({
    secret: "mysecretkey",  // 🔑 ใช้สำหรับเข้ารหัส session
    resave: false,          // 🔄 ไม่บันทึก session ถ้าไม่มีการเปลี่ยนแปลง
    saveUninitialized: true, // 🚀 ไม่สร้าง session ถ้ายังไม่มีข้อมูล
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 🍪 อายุ session = 1 ชม.
}));
app.use('*', (req, res, next) =>{
    loggedIn = req.session.customerId
    next()
})
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // กำหนด messages ให้ใช้งานใน EJS
    next();
  })
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))

app.listen(port, '0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`)
})
// test test