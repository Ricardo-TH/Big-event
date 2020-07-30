// 设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'
// 拦截每一次的ajax请求，配置每次请求需要的API
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;
    // console.log(options);
})