(function($) {
	"use strict";

	function radio() {
		$('.payment-method-wrap .radio').on('click', function(e) {
            e.preventDefault();
            $('.payment-method-wrap .radio').removeClass('active');
            $(this).addClass('active');
        });
	}

	$( document ).on('ready', function(){
		radio();
	});
})(jQuery);