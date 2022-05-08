'use strict';
jQuery( document ).ready( function($) {
	$( '.demo-directional .show-demo' ).on( 'click', function(e) {
		e.preventDefault();
		$( this ).parents( '.demo-directional' ).toggleClass( 'open' );
	});

	$( '.demo-directional .close' ).on( 'click', function(e) {
		e.preventDefault();
		$( this ).parents( '.demo-directional' ).toggleClass( 'open' );
	});

	function goToByScroll(id) {
	    // Remove "link" from the ID
	    id = id.replace("link", "");
	    // Scroll
	    $('html,body').animate({
	        scrollTop: $("#" + id).offset().top
	    }, 'slow');
	}

	$('.demo-directional a.browse-demos').on( 'click', function(e) {
	    // Prevent a page reload when a link is pressed
	    e.preventDefault();
	    // Call the scroll function
	    goToByScroll(this.id);
	});
} );
