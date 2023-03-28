const http = require('http')
const { v4: uuidv4 } = require('uuid');
const { HEADERS } = require('./constance.js')
const { errorHandler } = require('./errorHandler.js')
let todos = []
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
            errorHandler(error, res)
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
 
    }else if(req.url === '/todos' && req.method === 'DELETE'){
        try {
            todos = []
            res.writeHead(200, HEADERS)
            res.write(JSON.stringify({'message': '已刪除全部'}))
            res.end()
        } catch (error) {
            errorHandler(res, error)
        }
    }else if(req.url.startsWith('/todo/') && req.method === 'DELETE'){
        
        try {
            const id = req.url.split('todo/').pop()
            const index = todos.findIndex( item => item.id === id)
            if(index > -1){
                todos.splice(index,1)
                res.writeHead(200, HEADERS)
                res.write(JSON.stringify({'message': `已刪除 - ${id}`}))
                res.end()
            }else{
                res.writeHead(404, HEADERS)
                res.write(JSON.stringify({'message': `${id} 不存在`}))
                res.end()
            }
        } catch (error) {
            errorHandler(res, error)
        }
    }else if(req.url.startsWith('/todo/') && req.method === 'PATCH'){
        try {
            const id = req.url.split('todo/').pop()
            const index = todos.findIndex( item => item.id === id)
            if(index > -1){
                req.on('end', () => {
                    const {title} = JSON.parse(body)
                    todos[index] = {...todos[index], title}
                    body = ""
                    res.writeHead(200, HEADERS)
                    res.write(JSON.stringify({
                        'status': 'success', 
                        'data': todos
                    }))
                    res.end()
                })
            }else{
                res.writeHead(404, HEADERS)
                res.write(JSON.stringify({'message': `${id} 不存在`}))
                res.end()
            }
        } catch (error) {
            errorHandler(res, error)
        }
    }else if(req.methos === 'OPTIONS'){
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
