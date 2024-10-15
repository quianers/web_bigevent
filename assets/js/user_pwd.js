$(function () {
    // 从 layui 中获取 form 对象
    var form = layui.form

    // 表单验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单中的数据
            // 获取到的表单数据有oldPwd,newPwd,rePwd但是接口文档显示只需要oldPwd,newPwd,那么在后台接口会自动处理只获取其中2个吗？？？
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                // jquery对象转换为原生DOM对象:$('')[0]或者$('').get(0)
                // .reset()原生DOM的表单重置方法
                $('.layui-form')[0].reset()
            }
        })
    })
})