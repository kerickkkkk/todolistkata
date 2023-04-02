const { HEADERS } = require('./constance.js')

const errorHandler = (res, error)=>{
    res.writeHead(400, HEADERS, error)
    res.write(JSON.stringify({
        'status': 'fasle', 
        'message' : '欄位 或者 ＩＤ缺少',
        'error' : error
    }))
    res.end()
}

module.exports = {
    errorHandler
}