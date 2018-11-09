
;(function(window) {
  /* utils */
  window.utils = {
    showCover: function () {
      if ($('.hiding-cover').length > 0) {
        $('.hiding-cover').show()
      } else {
        $('body').append($('<div class="hiding-cover"></div>'))
      }
    },
    hideCover: function () {
      $('.hiding-cover').remove()
    },
    dialog: function (dialogConf) {
      /**
       * @width 数字
       * @title
       * @contentHtml 字符串
       * @comfirm 有无 boolean 绑定 function
       * @cancel
       */
      var $footerHtml = $('<div class="dialog-footer"></div>')
      if (dialogConf.cancel) {
        $footerHtml.append('<div class="dialog-btn comfirm">确定</div><div class="dialog-btn cancel">取消</div>')
      } else {
        $footerHtml.append('<div class="dialog-btn comfirm">确定</div>')
      }
      var $dialogHtml = $('<div class="dialog-wrap" id="dialog-id"><div class="cover"></div><div class="dialog-box"  style="width:'+ dialogConf.width +'px;margin-left:'+ -dialogConf.width/2 +'px" ><i class="close-icon" /><div class="dialog-title">'+ dialogConf.title +'</div><div class="dialog-content">'+ dialogConf.contentHtml +'</div></div></div>')
      $dialogHtml.find('.dialog-content').append($footerHtml)
      $('body').append($dialogHtml)
      $dialogHtml.find('.dialog-box').css('marginTop', -$dialogHtml.find('.dialog-box').height()/2)
      $dialogHtml.find('.close-icon').click(function () {
        $dialogHtml.remove()
      })
      $footerHtml.find('.comfirm').click(function () {
        if (dialogConf.comfirm && dialogConf.comfirm instanceof Function) {
          dialogConf.comfirm(function () {
            $dialogHtml.remove()
          })
        } else {
          $dialogHtml.remove()
        }
      })
      $footerHtml.find('.cancel').click(function () {
        if (dialogConf.cancel && dialogConf.cancel instanceof Function) {
          dialogConf.cancel(function () {
            $dialogHtml.remove()
          })
        } else {
          $dialogHtml.remove()
        }
      })
    },
    tips: function (text, cb) {
      var $tipsHtml = $('<div class="tips-wrap"><div class="cover-wrap"></div><div class="tips-content">'+ text +'</div></div>')
      $('body').append($tipsHtml)
      $tipsHtml.find('.tips-box').css('marginLeft', -$tipsHtml.find('.tips-box').width()/2)
      setTimeout(function () {
        $tipsHtml.remove()
        cb instanceof Function && cb()
      }, 2000)
    },
    validateInput: function(id, emptyTxt, length, minLen, maxLen, lengthTxt, regStr, novalidStr) {
      var value = $.trim($("#" + id).val());
      // 非空校验
      if (!value) {
        utils.tips(emptyTxt);
        return false;
      }

      // 长度校验
      if (length) {
        if (value.length != length) {
          utils.tips(lengthTxt);
          return false;
        }
      }

      if (minLen && maxLen) {
        if (value.length < minLen || value.length > maxLen) {
          utils.tips(lengthTxt);
          return false;
        }
      }
      if (regStr) {
        if (!regStr.test(value)) {
          utils.tips(novalidStr);
          return false;
        }
      }
      return true;
    },
    checkIdNo: function(cid) {
      var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
      var arrValid = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 校验码
      if (/^\d{17}(\d|x|X)$/i.test(cid)) {
        var sum = 0;
        var idx = 0;
        for (var i = 0; i < cid.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        return arrValid[idx] === cid.substr(17, 1).toUpperCase();
      } else if (/^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(cid)) {
        return true;
      } else {
        return false;
      }
    },
    debug: function (data) {
      if (_config.isDebug) {
        _config.consoleDebug ? console.debug(data) : _alert(JSON.stringify(data));
      }
    },
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var search = window.location.search;

      if (!search) {
        var quesMark = +window.location.href.indexOf("?") + 1;
        search = window.location.href.substr(quesMark);
      } else {
        search = search.substr(1);
      }

      var r = search.match(reg);
      if (r !== null) {
        return unescape(r[2]);
      }
      return null;
    },
    changeTitle: function(title) {
      document.title = title || '';
      var $iframe = $('<iframe src="../images/d-green.png"></iframe>');
      $iframe.on('load', function() {
        setTimeout(function() {
          $iframe.off('load').remove();
        }, 0);
      }).appendTo($('body'));
    },
    checkVCode: function(vCode) {
      if (vCode.length === 0) {
        $.tips("请输入验证码");
        return false;
      } else if (/^\d{4,6}$/.test(vCode)) {
        return true;
      } else {
        $.tips("验证码有误，请重新输入");
        return false;
      }
    },
    checkMobile: function(mobile) {
      if (mobile.length === 0) {
        $.tips("请输入手机号");
        return false;
      // } else if (/^(?:13\d|15\d|18\d|147|173|176|177|178)\d{5}(\d{3}|\*{3})$/.test(mobile)) {
      } else if (/^1\d{10}$/.test(mobile)) {
        return true;
      } else {
        $.tips("手机号有误，请重新输入");
        return false;
      }
    },
    parseJSON: function(str) {
      if (typeof str == 'object') {
        return str;
      }
      try {
        return JSON.parse(str);
      } catch (ex) {
        try {
          return $.parseJSON(str);
        } catch (e) {
          return (new Function("", "return " + str))();
        }
      }
    }
  };
})(window);

// 倒计时
;(function($) {

  $.fn.countDown = function(sec, codeTimeout, cb, finish) {
    var $node = $(this);

    if ($node.hasClass("btn-disabled")) {
      return false;
    }

    if (cb instanceof Function) {
      cb();
      $node.addClass("btn-disabled").text(sec + "s后可重发");
      codeTimeout = setInterval(function() {
        $node.text((sec - 1) + "s后可重发");
        if (+sec <= 1) {
          clearInterval(codeTimeout);
          $node.text("重新发送").removeClass("btn-disabled");
          (finish instanceof Function) && finish();
        }
        sec--;
      }, 1000);
    } else {
      clearInterval(codeTimeout);
      $node.text("重新发送").removeClass("btn-disabled");
      (finish instanceof Function) && finish();
    }
  };
})($);
