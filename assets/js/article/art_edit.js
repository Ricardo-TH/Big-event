$(function () {
    // 插件对应的js代码
    // 3. 把插件对应的js代码，添加进去
    initEditor()
    // 3. 把插件对应的js代码，添加进去
    var $image = $('#image')
    // 3. 把插件对应的js代码，添加进去
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 把插件对应的js代码，添加进去
    $image.cropper(options)

    // 4.根据id，获取文章信息
    var Id = location.search.split("=")[1]
    $.ajax({
        url: '/my/article/' + Id,
        success: function (res) {
            console.log(res);

            // 5.5 Id
            $('[name=Id]').val(res.data.Id)
            // 5.1 文章标题
            $('[name=title]').val(res.data.title)
            // 5.4 文章封面
            //   前后端分离开发，所以图片的路径要添加上基础路径
            $('#image').attr('src', baseURL + res.data.cover_img)
            // 5.3 文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content)
            },1000)
            // 5.2 文章分类
            initCate(res.data.cate_id)
        }
    })

    // 渲染文章分类封装
    var form = layui.form
    function initCate(cate_id) {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败！')
                }
                // 模板引擎，传递对象，使用的是属性
                res.cate_id = cate_id;
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染form，数据与页面同步
                form.render()
            }
        })
    }

    // 确认发布状态
    var state = '已发布';
    $('#btnSave2').click(function () {
        state = '草稿'
    })
    // 添加文章
    $('#form-add').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this);
        fd.append("state", state);

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd);
                // ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
                editArticle(fd)
            })

        function editArticle(fd) {
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果发布的是FormData类型时，必须加以下两行代码
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败了！')
                    }
                    layer.msg('发布文章成功了！')
                    // 发布草成功后，跳转到文章列表页面
                    // location.href = '/article/art_list.html'
                    window.parent.document.getElementById('a2').click()
                }
            })
        }
    })
})