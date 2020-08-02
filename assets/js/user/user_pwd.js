$(function(){
    var form = layui.form;

    // 密码校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value){
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value){
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 重置表单,$('...')[0]将jQuery对象转换为原生DOM对象
                $('.layui-form')[0].reset()
            }
        })
    })
})