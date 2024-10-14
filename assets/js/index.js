$(function () {
    // 调用getUserInfo函数 获取用户基本信息
    getUserInfo()

    // 点击退出确定按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // alert('事件绑定成功了吗')
        var layer = layui.layer
        // 提示用户是否确认退出
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            // alert('验证功能是否左侧')
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 封装获取用户基本信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     // 从localStorage中取值用.getItem()
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                // var layer=layui.layer
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // ⭐不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像[隐藏文本头像，给图片头像设置src图片途径值]
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像[隐藏图片头像，把文本第一个字作为头像]
        $('.layui-nav-img').hide()
        // .toUpperCase()用于将小写字母转为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}