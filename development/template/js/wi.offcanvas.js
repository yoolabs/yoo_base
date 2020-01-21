/*! UIkit 2.25.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = UI.$win,
        $doc      = UI.$doc,
        $html     = UI.$html,
		$toggles  = UI.$(),
        WiOffcanvas = {

        show: function(element) {

            element = UI.$(element);

            if (!element.length) return;

            var $body     = UI.$('body'),
                bar       = element.find(".uk-offcanvas-bar:first"),
                rtl       = (UI.langdirection == "right"),
                flip      = bar.hasClass("uk-offcanvas-bar-flip") ? -1:1,
                dir       = flip * (rtl ? -1 : 1),

                scrollbarwidth =  window.innerWidth - $body.width();

            scrollpos = {x: window.pageXOffset, y: window.pageYOffset};

            element.addClass("uk-active");
			$toggles.addClass('uk-active');

            $body.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("uk-offcanvas-page");
            // $body.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("uk-offcanvas-bar-show");

            this._initElement(element);

            bar.trigger('show.uk.wioffcanvas', [element, bar]);


            // Update ARIA
            element.attr('aria-hidden', 'false');
        },

        hide: function(force) {

            var $body = UI.$('body'),
                panel = UI.$(".uk-offcanvas.uk-active"),
                rtl   = (UI.langdirection == "right"),
                bar   = panel.find(".uk-offcanvas-bar:first"),
                finalize = function() {
                    $body.removeClass("uk-offcanvas-page").css({"width": "", "height": "", "margin-left": "", "margin-right": ""});
                    panel.removeClass("uk-active");
					$toggles.removeClass('uk-active');

                    bar.removeClass("uk-offcanvas-bar-show");
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                    bar.trigger('hide.uk.wioffcanvas', [panel, bar]);

                    // Update ARIA
                    panel.attr('aria-hidden', 'true');
                };

            if (!panel.length) return;

            if (!force) {

				bar.removeClass("uk-offcanvas-bar-show");
                setTimeout(function(){
                    finalize();
                }, 500);

            } else {
                finalize();
            }
        },

        _initElement: function(element) {

            if (element.data("WiOffcanvasInit")) return;

            element.on("click.uk.wioffcanvas swipeRight.uk.wioffcanvas swipeLeft.uk.wioffcanvas", function(e) {

                var target = UI.$(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("uk-offcanvas-close")) {
                        if (target.hasClass("uk-offcanvas-bar")) return;
                        if (target.parents(".uk-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                WiOffcanvas.hide();
            });

            element.on("click", "a[href*='#']", function(e){

                var link = UI.$(this),
                    href = link.attr("href");

                if (href == "#") {
                    return;
                }

                UI.$doc.one('hide.uk.wioffcanvas', function() {

                    var target;

                    try {
                        target = UI.$(link[0].hash);
                    } catch (e){
                        target = '';
                    }

                    if (!target.length) {
                        target = UI.$('[name="'+link[0].hash.replace('#','')+'"]');
                    }

                    if (target.length && UI.Utils.scrollToElement) {
                        UI.Utils.scrollToElement(target, UI.Utils.options(link.attr('data-uk-smooth-scroll') || '{}'));
                    } else {
                        window.location.href = href;
                    }
                });

                WiOffcanvas.hide();
            });

            element.data("WiOffcanvasInit", true);
        }
    };

    UI.component('wioffcanvasTrigger', {

        boot: function() {

            // init code
            $html.on("click.wioffcanvas.uikit", "[data-uk-wioffcanvas]", function(e) {

                e.preventDefault();

                var ele = UI.$(this);

                if (!ele.data("wioffcanvasTrigger")) {
                    var obj = UI.wioffcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-wioffcanvas")));
                    ele.trigger("click");
                }
            });

            $html.on('keydown.uk.wioffcanvas', function(e) {

                if (e.keyCode === 27) { // ESC
                    WiOffcanvas.hide();
                }
            });
        },

        init: function() {

            var $this = this;


            this.options = UI.$.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

			$toggles = $toggles.add($this.element);

			// console.log(this, $this);
            this.on("click", function(e) {
                e.preventDefault();
				var $offcanvas = UI.$($this.options.target);
				// console.log('click',$offcanvas,$offcanvas.hasClass('uk-active'));
				if($offcanvas.hasClass('uk-active')) {
	                WiOffcanvas.hide();
				} else {
	                WiOffcanvas.show($this.options.target);
				}
            });
        }
    });

    UI.wioffcanvas = WiOffcanvas;

})(jQuery.UIkit);
