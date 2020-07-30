$(function () {
    // 点击按钮，切换登录和注册部分页面
    $('#link_reg').on('click',function (){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click',function (){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫做pwd校验规则  属性的值可以是数组，也可以是函数
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 确认密码校验规则
        repwd: function (value){
            var pwd = $('#reg-pwd').val();
            if (pwd != value) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 注册功能
    $('#form_reg').on('submit',function (e){
        // 阻止表单默认提交
        e.preventDefault()
        // ajax发送异步提交
        $.ajax({
            type:'post',
            url: '/api/reguser',
            // data: $('#form_reg').serialize(),
            data: {
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val()
            },
            success: function (res) {
                console.log(res);
                // 注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 注册成功，提示
                layer.msg(res.message);
                // 模拟人的点击行为，进入登录页面
                $('#link_login').click()
                // 清空表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 登录功能
    $('#form_login').submit(function (e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url: '/api/login',
            data:$(this).serialize(),
            success:function(res){
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 登录成功提示
                layer.msg(res.message)
                // 保存token
                localStorage.setItem("token", res.token)
                // 页面跳转
                location.href='/index.html'
            }
        })
    })
})