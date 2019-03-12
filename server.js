import { resolve } from 'dns';

var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if(path === '/'){
    let string = fs.readFileSync('./index.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === "GET"){
    let string = fs.readFileSync('./sign_up.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === "/sign_up" && method === "POST"){
    //读数据
    readBody(request).then((body)=>{
      let strings = body.split('&') //['email=1','password=2'.'password_confirmation=2'] 
      let hash = {}
      strings.forEach((string) => {
        // string = 'email=1'
        let part = string.split('=') //['email','1']
        let key = part[0]
        let value = part[1]
        hash[key]=decodeURIComponent(value)
      })
      console.log(hash)
      let{email,password,password_confirmation} = hash
      
      if(email.indexOf('@')=== -1){
        response.statusCode = 400
        response.setHeader('Content-Type','application/json;charset=utf-8')
        response.write(`{
          "errors":{"email":"invalid"}
        }`)
      }else if(password !== password_confirmation){
        response.statusCode = 400
        response.setHeader('Content-Type','application/json;charset=utf-8')
        response.write('password not match') //和上一步的error有什么不同
      }else{
        var users = fs.readFileSync('./db/users','utf8') //JSON
        try{
          users = JSON.parse(users) //[]
        }catch(exception){
          users = []
        } //??
  
        let inUse = false
        for (i=0;i<users.length;i++){
          if(users[i].email === email){
            inUse = true
            break;
          }
        }
        if(inUse){
          response.statusCode = 400
          response.write('email in use')
        }else{
          users.push({email:email,password:password})
          console.log({email:email,password:password})
          var usersString = JSON.stringify(users)
          fs.writeFileSync('./db/users',usersString)
          response.statusCode = 200
        }
      }
      response.end()
    })
  }else if(path === 'sign_in' ){
    let {email,password} = hash
    var users = fa.readFileSync('./db/users',utf8)
    try{
      user = JSON.parse(users)
    }catch(exception){
      users = []
    }
    let found
    
  } else if(path === '/main.js'){
    let string = fs.readFileSync('./main.js','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/xxx'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.write(`
    {
        "note":{
            "to":"jack",
            "from":"frank",
            "heading":"打招呼",
            "content":"hi"
        }
    }`)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

function readBody(request){
  return new Promise((resolve,reject)=>{
    let body = []
    request.on('data',(chunk) =>{
      body.push(chunk);
    }).on('end',()=>{
      body = Buffer.concat(body).toString;
      resolve(body)
    })
  })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)