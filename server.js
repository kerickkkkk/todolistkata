const http = require('http')
const { v4: uuidv4 } = require('uuid');
const { HEADERS } = require('./constance.js')
const { errorHandler } = require('./errorHandler.js')
const todos = []
// 預設用 null + "" 會有問題
let body = ""
const requsetHandler = (req, res) => {

    req.on('data', (chunk) => {
        body +=chunk 
    })

    if( req.url ==='/' && req.method === 'GET'){
        try {
            res.writeHead(200, HEADERS)
            res.write(JSON.stringify({'message': '首頁'}))
            res.end()
        } catch (error) {
            errorHandler(res)
        }
 
    }else if(req.url === '/todos' && req.method === 'GET'){
        try {
            res.writeHead(200, HEADERS)
            res.write(JSON.stringify({'status': 'success', 'data': todos}))
            res.end()
        } catch (error) {
            errorHandler(res)
        }

    }else if(req.url === '/todos' && req.method === 'POST'){
        try {
            req.on('end', () => {
                const {title} = JSON.parse(body)
                // 不清空會出錯
                // {
                //     "title" : "123"    
                // }{
                //     "title" : "123"    
                // }
                body = ""
                const todo = {
                    title,
                    id:uuidv4()
                }
                todos.push(todo)
                res.writeHead(200, HEADERS)
                res.write(JSON.stringify({
                    'status': 'success', 
                    'data': todos
                }))
                res.end()
            })
            

        } catch (error) {
            errorHandler(res)
        }
 

    }else if(req.methos === 'OPTION'){
        try{
            res.writeHead(200, HEADERS)
            res.write(JSON.stringify({'message': 'option'}))
            res.end()
        } catch (error) {
            errorHandler(res)
        }

    }else{
        try{
            res.writeHead(404, HEADERS)
            res.write(JSON.stringify({'message': '沒有此路由'}))
            res.end()
        } catch (error) {
            errorHandler(res)
        }

    }
}

const server = http.createServer(requsetHandler)

server.listen(8080, ()=> {
    console.log('server on 8080')
})
