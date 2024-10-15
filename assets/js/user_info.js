$(function () {
  // 从 layui 中获取 form 对象
  var form = layui.form
  // 从 layui 中获取 layer 对象 弹出层
  var layer = layui.layer
  // 表单验证
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  // 调用initUserInfo()函数，获取初始化用户的基本信息
  initUserInfo()

  // 封装获取初始化用户的基本信息函数
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        console.log(res)
        
        // 调用 form.val()方法【快速】为【表单赋值】
        form.val('formUserInfo',res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click', function(e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo()
  })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
      // 阻止表单的默认提交行为
      e.preventDefault()
      // 发起 ajax 数据请求
      $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        // 快速获取表单中的数据
        // 获取到的表单数据有id,username,nickname,email，但是接口文档显示只需要id,nickname,email，那么在后台接口会自动处理只获取其中3个吗？？？
        data: $(this).serialize(),
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('更新用户信息失败！')
          }
          layer.msg('更新用户信息成功！')

          // 可以把iframe当作是子页面，外边的是父页面
          // 调用父页面中的方法，重新渲染用户的头像和用户的信息
          window.parent.getUserInfo()
        }
      })
    })
})