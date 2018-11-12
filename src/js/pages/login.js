$(function () {
  initPage()
  initAction()
  var intervals = null
  function initPage () {

  }

  function initAction () {
    $('#username').on('change', function () {
      var reg = /^1(3|4|5|7|8|9)\d{9}$/
      if (reg.test($.trim($(this).val()))) {
        $('.check-icon').show()
      } else {
        $('.check-icon').hide()
      }
    })

    $('#mobileCode').on('click', function () {
      if(utils.validateInput('username', '手机号不能为空', 11, 0, 0, '手机号码长度不正确', /^1(3|4|5|7|8|9)\d{9}$/, '请输入正确的手机号')) {
        if (intervals) {
          return false
        }
        $('#mobileCode').countDown(60, intervals, function () {
          var params = {
            phone: $('#username').val()
          }
          
          ajaxRequest('/Api/login/getVerificationCode', params, function (data) {
            if (data.code === 200) {
              utils.tips('验证码已发送成功')
            }
          }, false, 'get')
        });
      }
    })

    $('#loginBtn').on('click', function () {
      // 15250997094
      // qwer1234
      if (!verifyForm('login')) {
        return false
      }
      var phone = $('#username').val()
      var params = {
        phone: phone,
        verificationCode: $('#password').val() 
      }
      ajaxRequest('/Api/login/login', params, function (data) {
        if (data.code === 200) {
          localStorage['token'] = data.data
          localStorage['phone'] = phone
          // localStorage['treeId'] = data.data.treeId
          location.href = "./index.html"
        }
      }, false)
      // console.log('校验成功')
      // location.href = "./index.html"
      // var params = {
      //   'phone': $('#username').val(),
      //   'password': Base64.encode($('#pwd').val()),
      //   'signtype': 'B',
      //   'appId': 'e863890c171bcac80cf62691252fd340',
      //   'channel': 'WEB',
      //   'clientId': ''
      // }
      // getData(getLoginUrl('login'), params, function(data){
      //   if(data.code == 0) {
      //     setStorage('userToken', data.content.phone);
      //     setStorage('mmTicket', data.access_token);
      //     window.location.href = href;
      //   }
      // }, '', 'login');
    })
  }

  // 验证各个表单
  function verifyForm () {
    if (utils.validateInput('username', '手机号不能为空', 11, 0, 0, '手机号码长度不正确', /^1(3|4|5|7|8|9)\d{9}$/, '请输入正确的手机号') && utils.validateInput('password', '验证码不能为空')) {
      return true
    } else {
      return false
    }
  }
})
