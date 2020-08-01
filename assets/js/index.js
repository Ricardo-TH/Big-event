$(function(){
    // 1、调用获取用户信息函数
    getUserInfo()

    // 退出登录
    // 引入layer
    var layer = layui.layer;
    $('#btnLogout').on('click',function (){
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            // 关闭提示窗
            layer.close(index);
            // 删除本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
        }); 
    })
})

// 获取用户基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url: '/my/userinfo',
        // jQuery中的ajax专门用来设置请求头的属性
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success:function(res){
            // token可能24h失效，重新登录就好了
            console.log(res);
            if (res.status != 0) {    
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user){
    // 获取用户的名称
    var uname = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html("欢迎&nbsp;&nbsp;" + uname)
    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(uname[0].toUpperCase());
    }
}