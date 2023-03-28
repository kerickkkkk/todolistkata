const { HEADERS } = require('./constance.js')

const errorHandler = (res, error)=>{
    res.writeHead(400, HEADERS, error)
    res.write(JSON.stringify({
        'status': 'fasle', 
        'message' : error
    }))
    res.end()
}

module.exports = {
    errorHandler
}