$(function () {
  $('#wateringBtn').on('click', function () {
    $('.sprinkler-box').fadeIn();
    $('.sprinkler-box .water').fadeIn();
    setTimeout(function () {
      $('.sprinkler-box').fadeOut();
      $('.sprinkler-box .water').hide();
    }, 4000);
  })
})
