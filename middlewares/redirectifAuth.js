module.exports = (req, res, next) =>{
    if(req.session.customerId){
        return res.redirect('/')
    }
    next()
}