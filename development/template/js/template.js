


/*
	custom code...
*/

(function($){
	$(document).ready(function(){

		var config = $('html').data('config') || {};
		var isMediumDevice = window.matchMedia('(min-width:768px)').matches;
		var isLargeDevice = window.matchMedia('(min-width:960px)').matches;


		/* ----------- SNAP SCROLL ------------------------------ */

		if(isLargeDevice) {

			$('html').addClass('snapscroll');
			var $page = $(".page-layout");
			var $onepage = $(".onepage-wrapper");
			// var frameWidth = parseInt($page.css('top'));

			$onepage.onepage_scroll({
				sectionContainer: ".onepageblock",
				paginationContainer: "#dotnav-inner",
				// globalScrollOffset: frameWidth,
				// responsiveFallback: 768, // does not work.
				direction: "vertical",
				beforeMove: function(index) {
					setTimeout(function() {
						var $target = $onepage.children('.onepageblock[data-index="'+index+'"]');
						var $els = $target.find('[data-uk-scrollspy]');
						console.log($target,$els);
						$els.addClass('uk-scrollspy-init-inview').trigger('inview.uk.scrollspy');
					},500);
				},
				afterMove: function(index) {

				},
			});
		}

	});
}(jQuery));
