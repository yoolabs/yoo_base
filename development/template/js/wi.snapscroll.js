/* === WI Snapscroll ==============================================
 * Heavily customized build of jquery-onepage-scroll.js (1.3.1)
 * - changed offset system to dynamic system / pixel based instead of assuming a section is always sized 100%...
 * - changed anchor handling from numeric IDs to IDs given by the sections.
 * - implemented truely responsive behaviour, the system will disable an reenable itself entirely based on the responsiveFallback breakpoint.
 * - tracking window size and updating scroll offset and section heights to prevent bugs (specially iOS safari header height bug)
 *
 * Copyright 2018 Jannik Mewes
 *
 * jquery-onepage-scroll.js v1.3.1
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 *
 * License: GPL v3
 *
 * ========================================================== */

! function($) {

	var defaults = {
		sectionContainer: "section",
		paginationContainer: "body",
		easing: "ease",
		animationTime: 750,
		quietPeriod: -500,
		globalScrollOffset: 0,
		pagination: true,
		updateURL: true,
		keyboard: true,
		links: true, // track all anchor links
		beforeMove: null,
		afterMove: null,
		loop: false,
		direction: 'vertical',
		responsiveFallback: 959,

		getSectionAnchor: function($section) {
			return $section.attr('id')
		},
		getSectionByAnchor: function($sections, anchor) {
			var $tmp = $sections.filter('#' + anchor);
			return $tmp;
		},
	};

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
					// event.preventDefault();
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

	$.fn.snapScrollFixedOffset = function() {
		var el = this[0];
		var _x = 0;
		var _y = 0;

		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft;
			_y += el.offsetTop;
			el = el.offsetParent;
		}

		return {
			top: _y,
			left: _x
		};
	}

	$.fn.wiSnapScroll = function(options) {

		var settings = $.extend({}, defaults, options);
		var $main = $(this),
			$sections = $(settings.sectionContainer)
			total = $sections.length,
			status = "off",
			topPos = 0,
			leftPos = 0,
			lastAnimation = 0,
			enabled = true,
			paginationList = "";

		var UIKit = window.UIkit || window.UIkit2 || $.UIkit || false;


		var transformPage = function(settings, pos, index, immediately) {

			if (typeof settings.beforeMove == 'function') settings.beforeMove(index);
			var duration = immediately?0:settings.animationTime;

			// uikit scrollspy support
			if(UIKit) setTimeout(function() {
				var $target = $sections.filter('[data-index="'+index+'"]');
				var $els = $target.find('[data-uk-scrollspy]');
				$els.addClass('uk-scrollspy-init-inview').trigger('inview.uk.scrollspy');
			},duration*0.75);

			// $main.css({
			//   "-webkit-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
			//   "-webkit-transition": "all " + duration + "ms " + settings.easing,
			//   "-moz-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
			//   "-moz-transition": "all " + duration + "ms " + settings.easing,
			//   "-ms-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
			//   "-ms-transition": "all " + duration + "ms " + settings.easing,
			//   "transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "px, 0, 0)" : "translate3d(0, " + pos + "px, 0)",
			//   "transition": "all " + duration + "ms " + settings.easing
			// });
			// setTimeout(function(){
			// 	if (typeof settings.afterMove == 'function') settings.afterMove(index);
			// },duration+20);

			var config = ( settings.direction == 'horizontal' ) ? {scrollLeft: -1 * pos} : {scrollTop: -1 * pos};
			$main.stop().animate(config, duration, function() {
				if (typeof settings.afterMove == 'function') settings.afterMove(index);
			});
		}

		var calcPosition = function($section) {
			return -1 * $section.snapScrollFixedOffset().top + settings.globalScrollOffset;
		};

		var fixPosition = function() {
			if(!enabled) return;
			var current = $sections.filter(".active");
			var pos = calcPosition(current);
			transformPage(settings, pos, current.data("index"), true);
		};

		var updateAnchor = function($section) {
			var anchor = settings.getSectionAnchor($section);
			if (history.replaceState && settings.updateURL == true) {
				var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (anchor);
				history.pushState({}, document.title, href);
			}
		};

		var getSectionByAnchor = function(anchor) {
			return settings.getSectionByAnchor($sections, anchor);
		};



		$.wiSnapScroll = {};

		$.wiSnapScroll.moveDown = function() {
			if(!enabled) return;
			// var el = $(this)
			var index = $sections.filter(".active").data("index");
			var current = $sections.filter("[data-index='" + index + "']");
			var next = $sections.filter("[data-index='" + (index + 1) + "']");
			var pos;
			if (next.length < 1) {
				if (settings.loop == true) {
					pos = 0;
					next = $sections.filter("[data-index='1']");
				} else {
					return
				}
			} else {
				pos = calcPosition(next);
			}
			if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
			current.removeClass("active")
			next.addClass("active");
			if (settings.pagination == true) {
				$(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
				$(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
			}

			$("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
			$("body").addClass("viewing-page-" + next.data("index"))

			updateAnchor(next);
			transformPage(settings, pos, next.data("index"));
		}

		$.wiSnapScroll.moveUp = function() {
			if(!enabled) return;
			// var el = $(this)
			var index = $sections.filter(".active").data("index");
			var current = $sections.filter("[data-index='" + index + "']");
			var next = $sections.filter("[data-index='" + (index - 1) + "']");
			var pos;

			if (next.length < 1) {
				if (settings.loop == true) {
					next = $sections.filter("[data-index='" + total + "']");
					pos = calcPosition(next);
				} else {
					return
				}
			} else {
				pos = calcPosition(next);
			}
			if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
			current.removeClass("active")
			next.addClass("active")
			if (settings.pagination == true) {
				$(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
				$(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
			}
			$("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
			$("body").addClass("viewing-page-" + next.data("index"))

			updateAnchor(next);
			transformPage(settings, pos, next.data("index"));
		}

		$.wiSnapScroll.moveTo = function(page_index) {

			current = $sections.filter(".active")
			next = $sections.filter("[data-index='" + (page_index) + "']");

			if(!enabled) {
				updateAnchor(next);
				if(UIkit) {
					UIkit.Utils.scrollToElement(UIkit.$(next));
				} else {
					next.get(0).scrollIntoView();
				}
			} else {
				if (next.length > 0) {
					if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
					current.removeClass("active")
					next.addClass("active")
					$(".onepage-pagination li a" + ".active").removeClass("active");
					$(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
					$("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
					$("body").addClass("viewing-page-" + next.data("index"))

					pos = calcPosition(next);
					updateAnchor(next);
					transformPage(settings, pos, page_index);
				}
			}
		}


		// Prepare everything before binding wheel scroll

		$main.addClass("wisnapscroll-wrapper").css("position", "relative");

		$.each($sections, function(i) {
			var $sect = $(this);
			$sect.addClass("section").attr("data-index", i + 1);
			var id = $sect.attr('id');
			if(id=='') { id = (i + 1); $sect.attr('id',id); };

			if (settings.pagination == true) {
				var sectionTitle = $sect.attr('data-wisnapscroll-title');
				paginationList += "<li><a data-index='" + (i + 1) + "' href='#" + id + "'><span>" + sectionTitle + "</span></a></li>"
			}
		});

		// Create Pagination and Display Them ------------------------

		if (settings.pagination == true) {
			var $pagination = $("<ul class='onepage-pagination'></ul>");
			$pagination.prependTo(settings.paginationContainer);

			if (settings.direction == 'horizontal') {
				posLeft = ($pagination.width() / 2) * -1;
				$pagination.css("margin-left", posLeft);
			} else {
				posTop = ($pagination.height() / 2) * -1;
				$pagination.css("margin-top", posTop);
			}
			$pagination.html(paginationList);

			$pagination.on('click','a',function(e) {
				e.preventDefault();
				$.wiSnapScroll.moveTo($(this).data("index"));
			});
		}

		// Check URL for hashes and go to section if possible ------------------------

		if (window.location.hash != "") {

			var init_hash = window.location.hash.replace("#", "");
			var next = (init_hash.length > 0) ? getSectionByAnchor(init_hash) : false;

			if (init_hash.length > 0 && next && next.length > 0) {
				var init_index = next.data('index');
				next.addClass("active");
				$("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
				$("body").addClass("viewing-page-" + init_index);
				if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
				pos = calcPosition(next);
				// updateAnchor(next);
				transformPage(settings, pos, init_index);
			} else {
				$sections.filter("[data-index='1']").addClass("active")
				$("body").addClass("viewing-page-1")
				if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
			}
		} else {
			$sections.filter("[data-index='1']").addClass("active")
			$("body").addClass("viewing-page-1")
			if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
		}


		// --- Track Swipe events -----------------------

		var blockTouchEvents = false;
		function _blockTouchEvents() {
			blockTouchEvents = true;
			setTimeout(function(){ blockTouchEvents=false; },500);
		};

		$main.swipeEvents().bind("swipeDown", function(event) {
			if(!enabled) return;
			if(blockTouchEvents) return;
			_blockTouchEvents();
			if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
			$.wiSnapScroll.moveUp();
		}).bind("swipeUp", function(event) {
			if(!enabled) return;
			if(blockTouchEvents) return;
			_blockTouchEvents();
			if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
			$.wiSnapScroll.moveDown();
		});


		// --- Track Scroll events -----------------------

		var blockScrollEvent = false;
		var immediateScrollEventTimeout = false;
		var globalScrollEventTimeout = false;

		function init_scroll(event, delta) {
			deltaOfInterest = delta;
			var timeNow = new Date().getTime();
			// Cancel scroll if currently animating or within quiet period
			if (timeNow - lastAnimation < settings.quietPeriod + settings.animationTime) {
				event.preventDefault();
				return;
			}

			if (deltaOfInterest < 0) {
				$.wiSnapScroll.moveDown()
			} else {
				$.wiSnapScroll.moveUp()
			}
			lastAnimation = timeNow;
		}

		$(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {

			if(!enabled) return;
			if (!$("body").hasClass("disabled-onepage-scroll")) {

				event.preventDefault();
				var delta, dir, e = event.originalEvent;

				if (e.detail) {
					if (e.wheelDelta)
						delta = e.wheelDelta / e.detail / 40 * e.detail > 0 ? 1 : -1;
					else
						delta = -e.detail / 3;
				} else {
					delta = e.wheelDelta / 120;
				}

				function timeoutHandler() {
					blockScrollEvent = false;
					if (immediateScrollEventTimeout) clearTimeout(immediateScrollEventTimeout);
					if (globalScrollEventTimeout) clearTimeout(globalScrollEventTimeout);
				}

				// timeout which waits for Mac smooth scrolling to end
				if (immediateScrollEventTimeout) clearTimeout(immediateScrollEventTimeout);
				immediateScrollEventTimeout = setTimeout(function() {
					timeoutHandler();
				}, 500);

				if (!blockScrollEvent) {
					if (globalScrollEventTimeout) clearTimeout(globalScrollEventTimeout);
					// global timeout which makes sure one can always scroll again after some time
					globalScrollEventTimeout = setTimeout(function() {
						timeoutHandler();
					}, 1200);
					init_scroll(event, delta);
					blockScrollEvent = true;
				}
			}

		});


		// --- Track Link Events -----------------------
		if(settings.links) {
			$('body').on('click','a',function(e){
				var $link = $(e.currentTarget);
				if($link.length==0) return;
				var anchor = $link.attr('href');
				if(typeof anchor == 'undefined') return;

				if(anchor.substr(0,1)=='#' || anchor.substr(0,2)=='/#') {
					if(anchor.substr(0,1)=='/') anchor = anchor.substr(1);
					var $section = $(anchor);
					// console.log(anchor,$section);
					if(!$section.length) return;
					var sectionIndex = $section.data('index');
					if(typeof sectionIndex == 'undefined') return;
					e.preventDefault();
					$.wiSnapScroll.moveTo(sectionIndex);
				}
			});
		}


		(function responsive() {
			// fix wrong heights at mobile browser (due to browser menu bar changing its height)
			// inspired by MickL https://github.com/alvarotrigo/fullPage.js/issues/2414#issuecomment-261716140
			// var spy = $(document.createElement('div')).css({position:'absolute',top:0,left:0,background:'#fff',color:'#000'}).addClass('spy');
			// $(document.createElement('div')).addClass('spy-el').appendTo(spy);
			// $(document.createElement('div')).addClass('spy-window').appendTo(spy);
			// $(document.createElement('div')).addClass('spy-offset').appendTo(spy);
			// $sections.each(function(){
			// 	spy.clone().appendTo($(this));
			// });
			var height = 0;
			var resize = function() {
				if(!enabled) {
					$sections.css('height', 'auto');
				} else {
					// console.log('set section height to '+window.innerHeight);
					$(window).scrollTop(-1);
					height = window.innerHeight;
					$sections.css('height', height + 'px');
					$sections.css('min-height', 'initial');
					$sections.css('max-height', 'initial');
					// $sections.find('.spy-window').html(window.innerHeight + 'px');
					// $sections.each(function(){
					// 	$(this).find('.spy-el').html($(this).height() + 'px / '+this.getBoundingClientRect().height+' px');
					// 	$(this).find('.spy-offset').html($(this).snapScrollFixedOffset().top + 'px / '+
					// 										($(this).snapScrollFixedOffset().top / ($(this).data('index')-1)) );
					// })
					fixPosition();
				}
			};

			var a = setInterval(function() {
				if (window.innerHeight != height) resize();
			}, 500); // Don't lower more than 500ms, otherwise there will be animation-problems with the  Safari toolbar
			$(window).on('resize', resize);
			resize();

			var disableQuery = window.matchMedia('(max-width:'+settings.responsiveFallback+'px)');

			var setState = function(_enabled) {
				enabled = _enabled;
				enabled ? $(settings.paginationContainer).show() : $(settings.paginationContainer).hide();
				enabled ? $('html').addClass('wisnapscroll') : $('html').removeClass('wisnapscroll') ;
				resize();
			}
			disableQuery.addListener(function(){
				setState(disableQuery.matches==false);
			});
			setState(disableQuery.matches==false);

		})();


		if (settings.keyboard == true) {
			$(document).keydown(function(e) {
				if(!enabled) return;
				var tag = e.target.tagName.toLowerCase();

				if (!$("body").hasClass("disabled-onepage-scroll")) {
					switch (e.which) {
						case 38:
							if (tag != 'input' && tag != 'textarea') $.wiSnapScroll.moveUp()
							break;
						case 40:
							if (tag != 'input' && tag != 'textarea') $.wiSnapScroll.moveDown()
							break;
						case 32: //spacebar
							if (tag != 'input' && tag != 'textarea') $.wiSnapScroll.moveDown()
							break;
						case 33: //pageg up
							if (tag != 'input' && tag != 'textarea') $.wiSnapScroll.moveUp()
							break;
						case 34: //page dwn
							if (tag != 'input' && tag != 'textarea') $.wiSnapScroll.moveDown()
							break;
						case 36: //home
							$.wiSnapScroll.moveTo(1);
							break;
						case 35: //end
							$.wiSnapScroll.moveTo(total);
							break;
						default:
							return;
					}
				}

			});
		}

		return false;
	}


}(window.jQuery);
