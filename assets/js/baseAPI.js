// 设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'

// 1、拦截每一次的ajax请求，配置每次请求需要的API
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;
    // console.log(options);

    // 2、统一为包含/my/的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }  
    }

    // 3、不论成功还是失败，最终都会调用complete回调函数
    options.complete = function (res){
        var data = res.responseJSON;
        console.log(data);
        if (data.status === 1 && data.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
    
})