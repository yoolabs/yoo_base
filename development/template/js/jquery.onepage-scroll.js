/* ===========================================================
 * jquery-onepage-scroll.js v1.3.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 *
 * License: GPL v3
 *
 * Customized by Jannik Mewes (jm@jannikmewes.de)
 * - changed offset system to dynamic system / pixel based instead of assuming a section is always sized 100%...
 *
 * ========================================================== */

!function($){

  var defaults = {
    sectionContainer: "section",
    paginationContainer: "body",
    easing: "ease",
    animationTime: 600,
    globalScrollOffset: 0,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: true,
    quietPeriod: 200,
    responsiveFallback: false,
    direction : 'vertical',
    getSectionAnchor: function($section){
      return $section.data("index");
    },
    getSectionByAnchor: function($sections,anchor){
      console.log($sections,"[data-index='" + anchor + "']");
      return $sections.filter("[data-index='" + anchor + "']");
    },
	};

	/*------------------------------------------------*/
	/*  Credit: Eike Send for the awesome swipe event */
	/*------------------------------------------------*/

	$.fn.swipeEvents = function() {
      return this.each(function() {

        var startX,
            startY,
            $this = $(this);

        $this.bind('touchstart', touchstart);

        function touchstart(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            startX = touches[0].pageX;
            startY = touches[0].pageY;
            $this.bind('touchmove', touchmove);
          }
        }

        function touchmove(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;

            if (deltaX >= 50) {
              $this.trigger("swipeLeft");
            }
            if (deltaX <= -50) {
              $this.trigger("swipeRight");
            }
            if (deltaY >= 50) {
              $this.trigger("swipeUp");
            }
            if (deltaY <= -50) {
              $this.trigger("swipeDown");
            }
            if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
              $this.unbind('touchmove', touchmove);
            }
          }
        }

      });
    };


  $.fn.onepage_scroll = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        leftPos = 0,
        lastAnimation = 0,
        paginationList = "";

    transformPage = function(settings, pos, index) {
      if (typeof settings.beforeMove == 'function') settings.beforeMove(index);

  	  // $(this).css({
  	  //   "-webkit-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
     //   "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
     //   "-moz-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
     //   "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
     //   "-ms-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
     //   "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
     //   "transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
     //   "transition": "all " + settings.animationTime + "ms " + settings.easing
  	  // });
      // console.log(el,pos,el.prop('scrollTop'));
      el.stop().animate({scrollTop: -1*pos}, settings.animationTime, function(){
        if (typeof settings.afterMove == 'function') settings.afterMove(index);
      });
    }

    $.fn.snapScrollFixedOffset = function() {
      var el = this[0];
      var _x = 0; var _y = 0;

      while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft; _y += el.offsetTop; el = el.offsetParent;
      }

      return { top: _y, left: _x };
    }

    $.moveDown = function() {
      // var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
      if(next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return
        }
      }else {
        pos = calcPosition(next);
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove( next.data("index"));
      current.removeClass("active")
      next.addClass("active");
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }

      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      updateAnchor(next);
      transformPage(settings, pos, next.data("index"));
    }

    $.moveUp = function() {
      // var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

      if(next.length < 1) {
        if (settings.loop == true) {
          next = $(settings.sectionContainer + "[data-index='"+total+"']");
          pos = calcPosition(next);
        }
        else {
          return
        }
      }else {
        pos = calcPosition(next);
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
      current.removeClass("active")
      next.addClass("active")
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      updateAnchor(next);
      transformPage(settings, pos, next.data("index"));
    }

    $.moveTo = function(page_index) {
      current = $(settings.sectionContainer + ".active")
      next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
      if(next.length > 0) {
        if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
        current.removeClass("active")
        next.addClass("active")
        $(".onepage-pagination li a" + ".active").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))

        pos = calcPosition(next);
        updateAnchor(next);
        transformPage(settings, pos, page_index);
      }
    }

    function responsive() {
      //start modification
      var valForTest = false;
      var typeOfRF = typeof settings.responsiveFallback

      if(typeOfRF == "number"){
      	valForTest = $(window).width() < settings.responsiveFallback;
      }
      if(typeOfRF == "boolean"){
      	valForTest = settings.responsiveFallback;
      }
      if(typeOfRF == "function"){
      	valFunction = settings.responsiveFallback();
      	valForTest = valFunction;
      	typeOFv = typeof valForTest;
      	if(typeOFv == "number"){
      		valForTest = $(window).width() < valFunction;
      	}
      }

      //end modification
      if (valForTest) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }


        el.swipeEvents().bind("swipeDown",  function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          $.moveUp();
        }).bind("swipeUp", function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          $.moveDown();
        });

        $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
          event.preventDefault();

          var delta,dir;
          var w=event.wheelDelta, d=event.detail;

          if (event.detail){
            if (event.wheelDelta)
              delta = event.wheelDelta/event.detail/40*event.detail>0?1:-1;
            else
              delta = -event.detail/3;
          } else {
            delta = event.wheelDelta/120;
          }

          init_scroll(event, delta);
        });
      }
    }

    // var lastOffset = $( mySelector ).scrollTop();
    // var lastDate = new Date().getTime();

    function init_scroll(event, delta) {
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < settings.quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          $.moveDown()
        } else {
          $.moveUp()
        }
        lastAnimation = timeNow;
    }

    function calcPosition($section) {
      return -1 * $section.snapScrollFixedOffset().top + settings.globalScrollOffset;
    }

    function updateAnchor($section) {
      var anchor = settings.getSectionAnchor($section);
      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (anchor);
        history.pushState( {}, document.title, href );
      }
    }

    function getSectionByAnchor(anchor) {
      return settings.getSectionByAnchor(sections,anchor);
    }

    // Prepare everything before binding wheel scroll

    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).addClass("section").attr("data-index", i+1);

      if(settings.pagination == true) {
        var sectionTitle = $(this).attr('data-screen-title');
        paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'>"+sectionTitle+"</a></li>"
      }
    });

    el.swipeEvents().bind("swipeDown",  function(event){
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      $.moveUp();
    }).bind("swipeUp", function(event){
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      $.moveDown();
    });

    // Create Pagination and Display Them
    if (settings.pagination == true) {
      if ($('ul.onepage-pagination').length < 1) $("<ul class='onepage-pagination'></ul>").prependTo(settings.paginationContainer);

      if( settings.direction == 'horizontal' ) {
        posLeft = (el.find(".onepage-pagination").width() / 2) * -1;
        el.find(".onepage-pagination").css("margin-left", posLeft);
      } else {
        posTop = (el.find(".onepage-pagination").height() / 2) * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }
      $('ul.onepage-pagination').html(paginationList);
    }

    if(window.location.hash != "" && window.location.hash != "#1") {
      init_hash =  window.location.hash.replace("#", "");

      if (init_hash.length>0) {
        // next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
        next = getSectionByAnchor(init_hash);
      }

      console.log(init_hash,typeof init_hash,next);

      if(init_hash.length>0 && next && next.length>0) {
        init_index =  next.data('index');
        next.addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+ init_index);
        if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        pos = calcPosition(next);
        // updateAnchor(next);
        transformPage(settings, pos, init_index);
      } else {
        $(settings.sectionContainer + "[data-index='1']").addClass("active")
        $("body").addClass("viewing-page-1")
        if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
      }
    }else{
      $(settings.sectionContainer + "[data-index='1']").addClass("active")
      $("body").addClass("viewing-page-1")
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }

    if(settings.pagination == true)  {
      $(".onepage-pagination li a").click(function (e){
        e.preventDefault();
        var page_index = $(this).data("index");
        $.moveTo(page_index);
      });
    }


    var blockScrollEvent = false;
    var immediateScrollEventTimeout = false;
    var globalScrollEventTimeout = false;
    $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {

		if(!$("body").hasClass("disabled-onepage-scroll")) {

			event.preventDefault();
			var delta,dir,e=event.originalEvent;
			// if(Math.abs(e.wheelDelta)<9) return; // ignore minimal delta events

			if (e.detail){
				if (e.wheelDelta)
				delta = e.wheelDelta/e.detail/40*e.detail>0?1:-1;
				else
				delta = -e.detail/3;
			} else {
				delta = e.wheelDelta/120;
			}

			// dir = (event.detail<0) ? 1 : (event.wheelDelta>0) ? 1 : -1;
			console.log(e.detail,e.wheelDelta,delta);


			function timeoutHandler() {
				blockScrollEvent = false;
				if(immediateScrollEventTimeout) clearTimeout(immediateScrollEventTimeout);
				if(globalScrollEventTimeout) clearTimeout(globalScrollEventTimeout);
			}

			// timeout which waits for Mac smooth scrolling to end
			if(immediateScrollEventTimeout) clearTimeout(immediateScrollEventTimeout);
			immediateScrollEventTimeout = setTimeout(function(){console.log('immediateScrollEventTimeout'); timeoutHandler();},500);

			if(!blockScrollEvent) {
				if(globalScrollEventTimeout) clearTimeout(globalScrollEventTimeout);
				// global timeout which makes sure one can always scroll again after some time
				globalScrollEventTimeout = setTimeout(function(){console.log('globalScrollEventTimeout'); timeoutHandler();},1200);
				// if(Math.abs(e.wheelDelta) > 15)
				init_scroll(event, delta);
				blockScrollEvent = true;
			}
	    }

    });


    if(settings.responsiveFallback != false) {
      $(window).resize(function() {
        responsive();
      });

      responsive();
    }

    if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();

        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') $.moveUp()
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') $.moveDown()
            break;
            case 32: //spacebar
              if (tag != 'input' && tag != 'textarea') $.moveDown()
            break;
            case 33: //pageg up
              if (tag != 'input' && tag != 'textarea') $.moveUp()
            break;
            case 34: //page dwn
              if (tag != 'input' && tag != 'textarea') $.moveDown()
            break;
            case 36: //home
              $.moveTo(1);
            break;
            case 35: //end
              $.moveTo(total);
            break;
            default: return;
          }
        }

      });
    }
    return false;
  }


}(window.jQuery);