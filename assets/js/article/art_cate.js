$(function () {
    // 调用文章列表渲染函数
    initArtCateList()

    // 获取文章分类渲染的列表
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tql-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 文章分类添加
    $('body').on('submit', '#boxAddCate', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章列表失败！')
                }
                initArtCateList()
                layui.layer.msg('新增文章列表成功！')
                // 关闭添加区域
                layui.layer.close(indexAdd)
            }
        })
    })

    // 通过代理的模式，为btn-edit编辑按钮绑定点击事件
    var indexEdit = null
    $('body').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var Id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                layui.form.val('dialog-edit', res.data)
            }
        })
    })

    // 通过代理的模式，为修改分类的表单绑定submit事件
    $('body').on('submit','#form-edit',function (e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url: '/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的模式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function (){
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？',{icon: 3, title: '提示'},function (index){
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })

    })
})