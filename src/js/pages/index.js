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
  },
  // 浇水
  watering: function () {
    utils.showCover()
    this.el.find('.sprinkler-box').fadeIn();
    this.el.find('.sprinkler-box .water').fadeIn();
    this.el.removeClass('mypulse');
    var that = this
    setTimeout(function () {
      $('.sprinkler-box').fadeOut();
      $('.sprinkler-box .water').hide();
      that.el.addClass('mypulse');
      that.addBlood(5)
      utils.hideCover()
    }, 4000)
  },
  // 除虫
  scratching: function () {
    utils.showCover()
    this.el.find('.scratching-box').fadeIn();
    this.el.find('.scratching-box .pest').fadeIn();
    this.el.removeClass('mypulse');
    var that = this
    setTimeout(function () {
      $('.scratching-box').fadeOut();
      $('.scratching-box .pest').hide();
      that.el.addClass('mypulse');
      that.addBlood(10)
      utils.hideCover()
    }, 2500)
  },
  // 增能量
  addBlood: function (blood) {
    if (this.blood + blood >= 100) {
      this.blood = 100
      $('#plantingBtn').show()
      $('.process-in').removeClass('light').addClass('light')
    } else {
      this.blood += blood
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
    var step = this.blood < 25 ? 0 : (this.blood < 60 ? 1 : (this.blood < 100 ? 2 : 3))
    console.log(this.blood+'-sdf=-23-'+step)
    this.el.removeClass().addClass("tree " + this.step[step]['className'])
    !this.isNight ? $('#grassland').removeClass().addClass("grassland " + this.step[step]['grassClass']) : null
    $('.process-score').text(this.blood)
    $('.process-in').css({
      'top': parseInt(100 - this.blood)+'%'
    })
  }
}

$(function () {
  var treeObj = new Tree('tree')
  initPage()
  initAction()

  function initPage () {

  }

  function initAction () {
    $('#wateringBtn').on('click', function () {
      treeObj.watering()
    })
    $('#scratchingBtn').on('click', function () {
      treeObj.scratching()
    })
    $('#plantingBtn').on('click', function () {
      treeObj.planting()
    })
    $('#comfirmBtn').on('click', function () {
      $('.plant-wrap').hide()
      utils.tips('我们重新种一颗小树吧')
    })
  }
})
