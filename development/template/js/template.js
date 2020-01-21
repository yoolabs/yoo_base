


/*
custom code...
*/

(function($){
	$(document).ready(function(){

		// var config = $('html').data('config') || {};
		// var isLargeDevice = window.matchMedia('(min-width:960px)');
		// var $body = $('body');

		/* ----------- SNAP SCROLL ------------------------------ */
		var $onepage = $(".onepage-wrapper");
		if($onepage.length) {
			$onepage.wiSnapScroll({
				sectionContainer: ".onepageblock",
				paginationContainer: "#dotnav-inner",
				direction: "vertical",
			});
		}

	});
}(jQuery));
