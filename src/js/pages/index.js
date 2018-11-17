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
    // 增加的字
    // setTimeout(function () {
    //   $('.addscore').removeClass('fadeOutUp').text('+5').fadeIn();
    //   setTimeout(function () {
    //     $('.addscore').addClass('fadeOutUp');
    //   }, 2000)
    // }, 2000)
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
    // 增加的字
    // setTimeout(function () {
    //   $('.addscore').removeClass('fadeOutUp').text('+10').fadeIn();
    //   setTimeout(function () {
    //     $('.addscore').addClass('fadeOutUp');
    //   }, 2000)
    // }, 1000)
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
  var phoneHeight = document.documentElement.clientHeight
  resetSize()
  var treeObj = null
  var treeId = ''
  var phoneNum = localStorage['phone']
  var pageNo = -1
  var pages = 1
  var swiperContainer = $('#certsBox')
  var swiperIndex = 0
  var swiperLen = 0
  var startX = 0,
      endX = 0,
      distanceX = 0;
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
    window.onresize = function () {
      phoneHeight = document.documentElement.clientHeight
      resetSize()
    }
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
      $('.page-wrap').css("overflowY","scroll");
    })    
    $('.certificate').on('click', function () {
      if ($('.cert-item').length < 1) {
        utils.tips('还未种植小树哦')
        return false
      }
      $('.plant-certs-wrap').show()
      $('.page-wrap').css("overflowY","hidden");
    })
    $('.plant-certs-wrap').on('click', '.close-icon', function () {
      $('.plant-certs-wrap').hide()
      $('.page-wrap').css("overflowY","scroll");
    })
    $('.plant-wrap').on('click', '.cover', function () {
      $('.plant-wrap').hide()
      $('.handle-box').hide()
      $('#scratchingBtn').show()
      $('#wateringBtn').show()
      $('.page-wrap').css("overflowY","scroll");
    })
    $('.ques-wrap').on('click', function () {
      $('.desc-wrap').show()
      $('.page-wrap').css("overflowY","hidden");
    })
    $('.desc-wrap').on('click', '.cover', function () {
      $('.desc-wrap').hide()
      $('.page-wrap').css("overflowY","scroll");
    })
    $('.get-more').on('click', '.close-icon', function () {
      getRankList()
    })

    $('.plant-certs-wrap').bind('touchstart',function(e){
      startX = e.originalEvent.changedTouches[0].pageX;
    });

    $(".plant-certs-wrap").bind("touchend",function(e){
      //获取滑动屏幕时的X,Y
      endX = e.originalEvent.changedTouches[0].pageX;
      //获取滑动距离
      distanceX = endX-startX;
      //判断滑动方向
      console.log('滑动 ' + distanceX)
      if(distanceX>50){
        moveAnimate('left')
      }else if(distanceX<-50){
        moveAnimate('right')
      }
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
          swiperLen = content.length
          var heightStyle = phoneHeight >= 672?'457px':'100%'
          $.each(content, function (index, item) {
            var acitveClass = index == 0? 'swiper-item-active' : ''
            html += '<div class="cert-item ' + acitveClass + '" style="width:' + 1/content.length*100 + '%;height:' + heightStyle + '"><div class="cert-item-box"><div class="cert-box animated zoomIn"><img src="images/cert-logo.png" alt="" class="cert-icon"><span></span></div>'
            html += '<p class="cert-time">- ' + item.getDate + '获得 -</p><div class="cert-flex-box"><p class="cert-detail">' + item.certificate + '</p><div class="cert-no">' + item.treeCode + '</div><a href="'+item.skipUrl+'" class="submit-btn"><label>查看</label></a></div></div></div>'
          })
          $('#certsBox').css({
            'width': content.length*100+'%'
          }).html(html)
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
        $('.plant-wrap .cert-time').text('- ' + data.data.certificate.getDate + ' -获得')
        $('.plant-wrap .cert-detail').text(data.data.certificate.certificate)
        $('.plant-wrap .cert-no').text(data.data.certificate.treeCode)
        $('.plant-wrap .submit-btn').attr('href', data.data.certificate.skipUrl)
        cb()
      }
    }, true)
  }

  function moveAnimate (type) {
    if (type == 'left') {
      if (swiperIndex < 1) {
        return false
      }
      swiperIndex --
    } else {
      if (swiperIndex >= swiperLen - 1) {
        return false
      }
      swiperIndex ++
    }
    $('.cert-item').removeClass('swiper-item-active')
    $('.cert-item').eq(swiperIndex).addClass('swiper-item-active')
    var leftW = '-'+swiperIndex*100+'%'
    swiperContainer.animate({left:leftW},400)
  }

  function resetSize () {
    var heightStyle = phoneHeight >= 652?'457px':'100%'
    $('.cert-item').css({
      height: heightStyle
    })
    var heightStyle2 = phoneHeight >= 652?'457px':'60%'
    $('.plant-cert').css('height', heightStyle2)
    if (phoneHeight > 720) {
      $('.cert-window').css({
        padding: '40% 0'
      })
      $('.cert-item-box').css({
        paddingTop: '65%'
      })
      $('.plant-cert').css({
        paddingTop: '65%'
      })
      $('.plant-certs-wrap .close-icon').css({
        bottom: '10%'
      })
    }
  }
})
