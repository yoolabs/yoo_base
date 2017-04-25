


/*
	YooTemplate developed by YOOlabs / Jannik Mewes for Unizell
*/

(function($){

	var yooTemplate;
	var ajaxCache = 	{};


	var YooTemplate = YLib.Class.extend({

		includes : [YLib.Mixin.Events],

		initialize : function(config) {

			console.log('YooTemplate -- construct');
			this.config = config;

			if(document.readyState == 'complete') {
				this._initialize();
			} else {
				var self = this;
				$(document).ready(function(){
					self._initialize();
				});
			}

		},

		_initialize : function() {

			// console.log('YooTemplate -- init');
			var self = this;

			self.$body = $('body');
			self.$wrapper = $('.pagewrapper');
			self.$dock = $('#ajaxdock');

			// if(self.mq.matches) {

				// full version @TODO
				if(self.$body.hasClass('detailview')) {
					// grid loaded in detailview mode
					self.isDetailView = true;
					self.activeItem = this._getItemById(self.config.activeId);
					self._animateTransition(offsetX,offsetY,1);
					window.history.pushState({yooTemplate:{itemId:self.activeItem.id}}, self.config.siteName+' - '+self.activeItem.title, self.activeItem.route);
				} else {
					// grid loaded in overview mode
					self.isDetailView = false;
					self.activeItem = false;
					window.history.pushState({yooTemplate:{itemId:false}}, self.config.siteName+' - '+'Home', '/');
				}

				// for(var i=0; i<self.config.items.length; i++) {
				// 	self.config.items[i].$el = self.$items.filter('[data-item-id="'+self.config.items[i].id+'"]');
				// }

				self.setupEvents();

			// } else {
			//
			// 	// mobile version
			// 	// this.$grid.css('transitionDuration',this.config.transitionDuration/1000+'s');
			// 	if(self.$body.hasClass('detailview')) {
			// 		// grid loaded in detailview mode
			// 		self.isDetailView = true;
			// 		self.activeItem = this._getItemById(self.config.activeId);
			// 	} else {
			// 		// grid loaded in overview mode
			// 		self.isDetailView = false;
			// 		self.activeItem = false;
			// 	}
			//
			// }

		},

		// setup DOM element events
		setupEvents : function() {
			var self = this;
			self.$body.on('click','a,[data-yootemplate-link]',function(e) {
				// @TODO
				if($(this).isLocalLink) {
					e.preventDefault();
					var id = $(this).data('item-id') || $(this).data('item-alias');
					if(!id) {
						id = $(this).attr('href');
						if(id.substr(0,1)=='/') id = id.substr(1);
					}
					// console.log(id);
					self.navigateTo(id,true);
				}
			});
			// self.$body.on('keydown',function(e){
			// 	if(self.isDetailView) {
			// 		if([27,37,38,39,40].indexOf(e.which)>-1) {
			// 			e.preventDefault();
			// 			switch(e.which) {
			// 		        case 37: self.navigateDirection('left'); break;
			// 		        case 38: self.navigateDirection('up'); break;
			// 		        case 39: self.navigateDirection('right'); break;
			// 		        case 40: self.navigateDirection('down'); break;
			// 		        case 27: self.navigateTo(false,true); break;
			// 		    }
			// 		}
			// 	}
			// 	if(e.which == 32) {
			// 		// fix firefox scrolldown via space press
			// 		var tag = e.target.tagName.toLowerCase();
			// 		// console.log('space press', e, tag)
			// 		if(tag != 'input' && tag != 'textarea') {
			// 			e.preventDefault();
			// 		}
			// 	}
			// });
			$(window).on('popstate', function(e){
				if(e && e.originalEvent && e.originalEvent.state && e.originalEvent.state.yooTemplate) {
					self.navigateTo(e.originalEvent.state.yooTemplate.itemId,false);
				}
		    });
		},

		// navigate to an item
		navigateTo : function(itemId,pushState) {
			var self = this;
			if(self.activeItem) {
				var $activeItemContent = self.activeItem.$el.find('.panel-ajax-dock');
				$activeItemContent.fadeOut(200,function() {
					$activeItemContent.empty();
				});
			}
			if(typeof itemId == 'undefined' || itemId == false ) {
				// zoom out
				self.fire('beforeTransition', { toDetailView:false, fromDetailView:true });
				self.isDetailView = false;
				if(self.activeItem) self.activeItem.$el.addClass('animateZoomOut animate');
				document.title = self.config.siteName+' - '+'Home';
				self._animateTransition(50,20,.15);
				self.$body.addClass('animateZoomOut');
				self.$body.removeClass('detailview');
				setTimeout(function(){
					document.title = self.config.siteName+' - '+'Home';
					if(pushState) window.history.pushState({yooTemplate:{itemId:false}}, self.config.siteName+' - '+'Home', '/');
				},10);
				setTimeout(function(){
					if(self.activeItem) self.activeItem.$el.removeClass('animateZoomOut animate focused');
					self.activeItem = false;
					self.$body.removeClass('animateZoomOut');
					self.fire('afterTransition', { toDetailView:false, fromDetailView:true });
				},self.config.transitionDuration);
			} else {
				var item = self._getItemById(itemId);
				if(item) {
					var offsetX = item.col * -100;
					var offsetY = item.row * -100;
					self._loadItemContent(item);
					self.$navDock.css('opacity','0');

					if(!self.isDetailView) {
						// zoom in
						self.fire('beforeTransition', { toDetailView:true, fromDetailView:false });
						self.isDetailView = true;
						self._animateTransition(offsetX,offsetY,1);
						self.$body.addClass('animateZoomIn');
					} else {
						self.fire('beforeTransition', { toDetailView:true, fromDetailView:true });
						self._animateTransition(offsetX,offsetY,1);
					}
					item.$el.addClass('animateZoomIn animate focused');
					self.$body.addClass('detailview');
					setTimeout(function(){
						document.title = self.config.siteName+' - '+item.title;
						if(pushState) window.history.pushState({yooTemplate:{itemId:itemId}}, self.config.siteName+' - '+item.title, item.route);
					},10);
					setTimeout(function(){
						self.updateNav(item);
					},self.config.transitionDuration/2);
					setTimeout(function(){
						self.$navDock.css('opacity','1');
						self.$body.removeClass('animateZoomIn');
						if(self.activeItem) self.activeItem.$el.removeClass('focused animate');
						self.activeItem = item;
						self.activeItem.$el.removeClass('animateZoomIn animate');
						self.fire('afterTransition', { toDetailView:true });
						// self.$items.not(self.activeItem.$el).removeClass('animate');
					},self.config.transitionDuration);
				}
			}
		},

		// get item data and element for specified ID
		_animateTransition : function() {
			var self = this;

		},

		// get item data and element for specified ID
		_getItemById : function(itemId, returnIndex) {
			for(var i=0; i<this.config.items.length; i++) {
				if(this.config.items[i].id == itemId) return returnIndex ? i : this.config.items[i];
			}
			for(var i=0; i<this.config.items.length; i++) {
				if(this.config.items[i].alias == itemId) return returnIndex ? i : this.config.items[i];
			}
			return false;
		},

		// get item data and element for specified ID
		_loadItemContent : function(item) {

			var $panelAjaxDock = item.$el.find('.panel-ajax-dock').hide();
			$panelAjaxDock.hide();

			var _showItem = function(data) {
				UIkit.domObserve($panelAjaxDock, function(element) { /* apply on dom change within element */ })
				$panelAjaxDock.html(data);
				$panelAjaxDock.fadeIn(200);
			}

			if(ajaxCache[item.route]) {

				_showItem(ajaxCache[item.route]);

			} else {

				var $itemContent = item.$el.find('.item-content');
				var $preloader = $('<div class="item-content-preloader"><i class="uk-icon-spinner"></i></div>').appendTo($itemContent);
				var config = {
					dataType:'html',
					data:{ async:1 },
					success:function(data,status,xhr){
						// item.$el.data('loadedContent',1);
						$preloader.fadeOut(200);
						ajaxCache[item.route] = data;
						_showItem(data);
					},
					error:function(xhr,status,error){
						console.error(status,error);
					},
				};
				// console.log('start ajax request',item.route,config);
				$.ajax(item.route,config);

			}

		},

	});

	$.yooTemplate = function(config,extend) {
		if(!yooTemplate) {
			if(typeof extend == 'object') {
				var CustomYooTemplate = YooTemplate.extend(extend);
				yooTemplate = new CustomYooTemplate(config);
			} else {
				yooTemplate = new YooTemplate(config);
			}
		};
		return {
			goto : 			function(itemId) { yooTemplate.navigateTo(itemId,true); },
			toOverview : 	function() { yooTemplate.navigateTo(false,true); },
			navigate : 		function(direction) { yooTemplate.navigateDirection(direction); },
			on : 			function(types, fn, context, once) { yooTemplate.on(types, fn, context, once); },
			off : 			function(types, fn, context, once) { yooTemplate.off(types, fn, context); },
		};
	}

}(jQuery));



(function($){
	$(document).ready(function(){

		window.yooDevice = {
			iPad : (navigator.userAgent.match(/iPad/i) != null),
			iPhone : (navigator.userAgent.match(/iPhone/i) != null),
		}
		// console.log(is_iPad,is_iPhone);

		if(window.yooDevice.iPad) $('body').addClass('is-ipad');
		if(window.yooDevice.iPhone) $('body').addClass('is-iphone');

	});
}(jQuery));
