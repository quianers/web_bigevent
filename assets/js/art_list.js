$(function () {
    // 从 layui 中获取 layer 对象
    var layer = layui.layer
    // 从 layui 中获取 form 对象
    var form = layui.form
    // 从 layui 中获取 laypage对象
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 调用函数，获取文章列表数据
    initTable()
    // 调用函数，初始化文章分类可选项
    initCate()

    // 封装获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res)  // 输出：{status:0,message:"获取文章分类列表成功",data:Array(xx),total}
                // 调用template('模板的id值',需要渲染的数据对象)函数
                var htmlStr = template('tpl-table', res)
                // 渲染html页面，填充到tbody里
                $('tbody').html(htmlStr)
            }
        })

        // 当拿到文章列表数据后，渲染分页
        renderPage(res.total)
    }

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

    // 监听表单的提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // console.log(state)
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 【根据最新的查询参数q】筛选条件，重新渲染表格的数据
        initTable()
    })

    // 封装渲染分页的函数
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 【根据最新的查询参数q】获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // btn-delete 不是一打开页面就有的，不能直接对它进行绑定
    // 通过代理的形式，为 btn-delete 表单绑定 submit 事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到当前 删除按钮 对应的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 删除了文章，【根据查询参数q】重新渲染页面
                    initTable()
                }
            })
            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})