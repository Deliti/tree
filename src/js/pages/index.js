function Tree (id, blood) {
  this.el = $('#'+id);
  this.blood = blood || 0;
  this.isNight = false
  this.step = [
    {
      className: 'tree-1',
      grassClass: 'day-step-1'
    },{
      className: 'tree-2',
      grassClass: 'day-step-1'
    },{
      className: 'tree-3',
      grassClass: 'day-step-2'
    },{
      className: 'tree-4',
      grassClass: 'day-step-3'
    }
  ]
  // 阶段的代码表示：
  // 1 /0-25
  // 2 /25-50
  // 3 /50-75
  // 4 /75-100
  // 200 / 表示长成，可以种树
  this.init()
}

Tree.prototype = {
  init: function () {
    var nowTime = new Date().getHours()
    this.isNight = nowTime > 17 || nowTime < 7
    if (this.isNight) {
      $('#grassland').removeClass().addClass("grassland night-grass")
      $('.sky-bg').hide()
      $('.night-bg').show()
    }
    this.updateBlood(this.blood)
  },
  // 浇水
  watering: function (blood) {
    utils.showCover()
    this.el.find('.sprinkler-box').fadeIn();
    this.el.find('.sprinkler-box .water').fadeIn();
    this.el.removeClass('mypulse');
    var that = this
    setTimeout(function () {
      $('.sprinkler-box').fadeOut();
      $('.sprinkler-box .water').hide();
      that.el.addClass('mypulse');
      that.updateBlood(blood)
      utils.hideCover()
    }, 4000)
  },
  // 除虫
  scratching: function (blood) {
    utils.showCover()
    this.el.find('.scratching-box').fadeIn();
    this.el.find('.scratching-box .pest').fadeIn();
    this.el.removeClass('mypulse');
    var that = this
    setTimeout(function () {
      $('.scratching-box').fadeOut();
      $('.scratching-box .pest').hide();
      that.el.addClass('mypulse');
      that.updateBlood(blood)
      utils.hideCover()
    }, 2500)
  },
  // 增能量
  updateBlood: function (blood) {
    this.blood = blood
    if (this.blood >= 100) {
      $('.handle-box').hide()
      $('#plantingBtn').show()
      $('.process-in').addClass('light')
    } else {
      $('#plantingBtn').hide()
      $('.process-in').removeClass('light')
    }
    this.bloodAnimate()
  },
  // 种树
  planting: function () {
    if (this.blood < 100) {
      utils.tips('能量还未满哦')
      return false
    }
    this.blood = 0
    $('.plant-wrap').show()
    $('#plantingBtn').hide()
    this.bloodAnimate()
  },
  bloodAnimate: function () {
    var step = this.blood < 25 ? 0 : (this.blood < 50 ? 1 : (this.blood < 75 ? 2 : 3))
    console.log(this.blood+'-sdf=-23-'+step)
    this.el.removeClass().addClass("tree " + this.step[step]['className'])
    $('#grassland').removeClass().addClass("grassland " + this.step[step]['grassClass'])
    !this.isNight ? $('#grassland').removeClass().addClass("grassland " + this.step[step]['grassClass']) : null
    $('.process-score').text(this.blood)
    var aniHeight = this.blood*0.98
    aniHeight = aniHeight > 98 ? 98 : aniHeight
    $('.process-in').css({
      'height': parseInt(aniHeight)+'%'
    })
  }
}

$(function () {
  var treeObj = null
  var treeId = ''
  var phoneNum = localStorage['phone']
  var pageNo = -1
  var pages = 1
  var imgArr = ['bird.png','cert-close.png','cert-item-bg.png','cert-logo.png','cert.png','check.png','close.png','day.png','grassland-day-1.png','grassland-day-2.png','grassland-day-3.png','grassland-night.png','group1.png','group2.png','group3.png','hand.png','loginbg.png','medal1.png','medal2.png','medal3.png','moon.png','night.png','pest-1.png','pest-2.png','rain-1.png','rain-3.png','rank-bg.png','sign.png','sprinkler.png','star1.png','star2.png','sun.png','tree-1.png','tree-2.png','tree-3.png'];
  var picArr = [],
    index = 0;
  for(var i=0;i<imgArr.length;i++){
    picArr[i] = new Image();
    picArr[i].src = 'images/'+imgArr[i];
    picArr[i].onload = function(){
      index++;
      if(index == imgArr.length){
        initPage()
        initAction()
      }
    }
  }
  

  function initPage () {
    getTreeInfo()
    getRankList()
    getCertInfo()
    // var params = {}
    // ajaxRequest('/Api/demo/queryPage', params, function (data) {
    //   if (data.code === 0) {
    //     // $('#mobileCode').countDown(60, intervals);
    //   }
    // }, true, 'get')
  }

  function initAction () {
    $('#wateringBtn').on('click', function () {
      handleChange(1, function (newBlood) {
        resetPage()
        getRankList()
        treeObj.watering(newBlood)
      })
    })
    $('#scratchingBtn').on('click', function () {
      handleChange(2, function (newBlood) {
        resetPage()
        getRankList()
        treeObj.scratching(newBlood)
      })
    })
    $('#plantingBtn').on('click', function () {
      handlePlating(function () {
        treeObj.planting()
        resetPage()
        initPage()
      })
    })
    $('#comfirmBtn').on('click', function () {
      $('.plant-wrap').hide()
      $('.handle-box').hide()
      $('#scratchingBtn').show()
      $('#wateringBtn').show()
      utils.tips('我们重新种一颗小树吧')
    })
    $('.certificate').on('click', function () {
      if ($('.cert-item').length < 1) {
        utils.tips('还未种植小树哦')
        return false
      }
      $('.plant-certs-wrap').show()
      $('body').css("overflow","hidden");
    })
    $('.plant-certs-wrap').on('click', '.close-icon', function () {
      $('.plant-certs-wrap').hide()
      $('body').css("overflow","auto");
    })
    $('.get-more').on('click', '.close-icon', function () {
      getRankList()
    })
  }

  function getTreeInfo () {
    var params = {
      phone: phoneNum
    }
    ajaxRequest('/Api/game/findTree', params, function (data) {
      if (data.code === 200) {
        var content = data.data
        if (content.tree != null) {
          treeObj instanceof Tree ? null : treeObj = new Tree('tree', content.tree.energyValue)
          treeId = content.tree.id
          $('.certificate label').text('证书（'+content.certificateCount+'）')
        }
      }
    }, true, 'get')
  }

  function getCertInfo () {
    var params = {
      phone: phoneNum
    }
    ajaxRequest('/Api/game/queryCertificateList', params, function (data) {
      if (data.code === 200) {
        var content = data.data
        if (content instanceof Array && content.length>0) {
          var html = ''
          $.each(content, function (index, item) {
            html += '<div class="cert-item"><div class="cert-box animated zoomIn"><img src="images/cert-logo.png" alt="" class="cert-icon"><span>植物证书</span></div>'
            html += '<div class="cert-flex-box"><p class="cert-time">- 2018-10-24获得 -</p><p class="cert-detail">您与2018年10月24日捐赠的树木已被湖州电信认养，将种植到余村风景区！</p><div class="cert-no">NO.HA167903600686</div><div class="submit-btn"><label>查看</label></div></div></div>'
          })
          $('#certsBox').html(html)
        }
      }
    }, true, 'get')
  }

  function resetPage () {
    pageNo = -1
    $('.rank-container').html('')
  }

  function getRankList () {
    if (pageNo >= pages-1) {
      return false
    }
    pageNo++
    var params = {
      rows: 10,
      page: pageNo
    }
    ajaxRequest('/Api/game/queryPage', params, function (data) {
      if (data.code === 200) {
        var content = data.data
        pages = content.totalPage
        if (pageNo == 0 && pageNo >= pages-1) {
          if (!content.list || content.list.length == 0) {
            var html = '<div class="no-rank">暂无排行数据</div>'
            $('.rank-container').html(html)
            return false
          } 
        }
        setRankList(content.list)
      }
    }, true, 'get')
  }

  function setRankList (list) {
    var html = ''
    if (list instanceof Array && list.length > 0) {
      $.each(list, function (index, item) {
        var indexIcon = '<i class="normal-medal">' + (10*pageNo+(index+1)) + '</i>'
        if (pageNo === 0 && index<3) {
          indexIcon = '<i class="medal-icon '+ (index==0?'medal1':(index==1?'medal2':'medal3')) +'"></i>'
        }
        html += '<div class="rank-item">'+indexIcon+'<div> <p class="username">'+item.phoneNum+'</p><p class="userdesc">获得了'+parseInt(item.totalEnergyValue/100)+'个证书</p></div><span class="userscore">'+item.totalEnergyValue+'</span></div>'
      })
    }
    $('.rank-container').append(html)
    if (pageNo >= pages-1) {
      $('.get-more').hide()
    } else {
      $('.get-more').show()
    }
  }

  function handleChange (type, cb) {
    var params = {
      treeId: treeId,
      phoneNum: phoneNum,
      operateType: type
    }
    ajaxRequest('/Api/game/operate', params, function (data) {
      if (data.code === 200) {
        var content = data.data
        content.energyValue && cb(content.energyValue)
      }
    }, true)
  }

  function handlePlating (cb) {
    var params = {
      treeId: treeId
    }
    ajaxRequest('/Api/game/seedTree', params, function (data) {
      if (data.code === 200) {
        cb()
      }
    }, true)
  }
})
