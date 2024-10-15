$(function () {
    // 从 layui 中获取 layer 对象
    var layer = layui.layer
    // 从 layui 中获取 form对象
    var form = layui.form

    // 调用函数，获取文章分类列表
    initArtCateList()

    // 封装获取文章分类列表的函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)   // 输出：{status:0,message:"获取文章分类列表成功",data:Array(xx)}
                // 调用template('模板的id值',需要渲染的数据对象)函数
                var htmlStr = template('tpl-table', res)
                // 渲染html结构，填充到tbody里
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 渲染弹出层里的表单
            content: $('#dialog-add').html()
        })
    })

    // form-add 不是一打开页面就有的，不能直接对它进行绑定
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 组织默认行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 新增了数据，所以重新调用函数，获取全部文章类别列表
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    // btn-edit 不是一打开页面就有的，不能直接对它进行绑定
    // 通过代理的形式，为 btn-edit 表单绑定 submit 事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 获取当前 编辑 按钮对应的id
        var id = $(this).attr('data-id')
        // console.log(id)
        // 发起请求 获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                // 快速为表单赋值 form.val()
                form.val('form-edit', res.data)
            }
        })
    })

    // form-edit 不是一打开页面就有的，不能直接对它进行绑定
    // 通过代理的形式，为 form-edit 表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 发起请求 
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
                // 改变了文章类别列表，要重新渲染页面
                initArtCateList()
            }
        })
    })

    // btn-delete 不是一打开页面就有的，不能直接对它进行绑定
    // 通过代理的形式，为 btn-delete 表单绑定 submit 事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前 删除 按钮对应的id
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    // 关闭 confirm 询问框
                    layer.close(index)
                    // 删除了文章类别列表，要重新渲染页面
                    initArtCateList()
                }
            })
        })
    })
})