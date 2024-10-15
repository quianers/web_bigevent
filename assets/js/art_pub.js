$(function () {
    // 从 layui 中获取 layer 对象
    var layer = layui.layer
    // 从 layui 中获取 form 对象
    var form = layui.form

    // 调用函数，初始化文章分类可选项
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 封装初始化文章分类可选项的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用template('模板的id值',需要渲染的数据对象)函数
                var htmlStr = template('tpl-cate', res)
                // 渲染html页面，填充到tbody里
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的UI结构
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

    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟手动点击事件
        // .click()是jquery中的自触发事件，与.triggle('click')功能一样，会触发元素默认行为
        // .triggleHandle('click')不会触发元素的默认行为
        $('#coverFile').click()
    })
    // 监听 文件选择框coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态，文章发布状态有两种(已发布，草稿)
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        // .forEach(function(value数组元素, index数组元素的索引, array当前的数组) {})作用：遍历数组
        fd.forEach(function (v, k) {
            console.log(k, v)
        })

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 封装发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})