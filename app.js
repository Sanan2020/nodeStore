const express = require('express')
const path = require('path')
const router = require('./routes/myRouter')
const app = express()
const port = process.env.PORT || 4000; //+
const expressSession = require('express-session')  //++
const flash = require('connect-flash') //++

app.use(flash()) //++
// app.use(express.json()) //++
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))

app.listen(port, '0.0.0.0',()=>{ //-+
    console.log(`Server is running on port ${port}`)
})