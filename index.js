const http = require('http')

const server = http.createServer(function(req,res){
    res.write('Hello Node.js 4099')
    res.end()
})

server.listen(5000)