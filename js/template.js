// meta tags
var twitterStatus = '';
var hashtags = '';

$(document).ready(function(){
  // calc breakpoint
  function calcBreak(x){
    x < 480 ? y = 'sm' : y = 'md';
    return y;
  }
  var breakpoint = calcBreak($(window).width());
  $(window).resize(function(){
    breakpoint = calcBreak($(window).width());
  });

  // mobile logo
  function mobileLogo(x) {
    if (x == "sm") {
      $('.navbar-brand img').attr('src', 'img/mobile-logo.png');
    } else {
      $('.navbar-brand img').attr('src', 'img/logo.png');
    }
  }

  // set related image heights
  function relHeights(x) {

    if (x == "md"){
      var toHeight = ($('.related-story').width())*.67;
      $('.related-story img').height(toHeight);
    } else {
      $('.related-story img').css({'width':'100%','height':'auto'});
    }
  }

  // call functions
  mobileLogo(breakpoint);
  relHeights(breakpoint);
  $(window).resize(function() {
    mobileLogo(breakpoint);
    relHeights(breakpoint);
  });


  // sharing
  var url = window.location.href;
  //share hrefs
  var twitterShare = 'http://twitter.com/share?text=' + twitterStatus + '&url=' + url + '&hashtags=' + hashtags;
  $('.twitter-share').attr('href', twitterShare);
  var facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  $('.facebook-share').attr('href', facebookShare);

});
