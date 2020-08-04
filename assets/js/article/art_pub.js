$(function () {
    var layer = layui.layer

    // 初始化富文本编辑器
    initEditor()

    initCate()
    // 定义加载文章分类的方法
    var form = layui.form
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染form，数据与页面同步
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请上传图片！')
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域b
    })

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
                // console.log(...fd);
                // ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
                publishArticle(fd)
            })

        function publishArticle(fd) {
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