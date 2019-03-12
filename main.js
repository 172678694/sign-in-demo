myButton.addEventListener('click',function(){
    let request = new XMLHttpRequest()
    request.open('GET','/xxx')
    request.send()
    request.onreadystatechange = function(){
        if(request.readyState===4){
            if(request.status >=200 && request.status<300){
                let string = request.responseText
                //把符合JSON语法的字符串转换成JS的值
                let obj=window.JSON.parse(string)
                //JSON.parse是浏览器提供的
                console.log(obj)
            }else if(request.status>=400){
                console.log('请求失败')
            }
        }
    }
})