$(function(){
    var form = layui.form;
    var layer = layui.layer;

    // 定义校验规则
    form.verify({
        nickname:function(value){
            if (value.length > 6) {
                return "昵称应该输入 1~6位之间！"
            }
        }
    })

    // 调用初始化用户信息函数
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        // 发送ajax
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success: function (res) {
                // 获取用户信息校验
                if (res.status !== 0) {
                    return layer.mag(res.message)
                }
                // 展示用户信息  语法：form.val('filter', object);
                // 第二个参数中的键值是表单元素对应的 name 和 value 
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置操作
    $('#btnReset').on('click',function (e){
        // 取消清空表单功能的默认事件
        e.preventDefault()
        // 重新初始化用户信息
        initUserInfo()
    })

    // 监听表单的用户提交事件
    $('.layui-form').on('submit', function (e){
        // 阻止表单的默认提交
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            type:'POST',
            url: '/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 刷新父框架里面的用户信息
                window.parent.getUserInfo()
            }
        })
    })
})