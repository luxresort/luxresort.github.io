(function($) {
	"use strict";

	var fb_comment_lightbox = uxper_template_vars.fb_comment_lightbox,
	    thumbnail_lightbox  = uxper_template_vars.thumbnail_lightbox;

	function nice_select() {
		$( '.uxper-nice-select' ).niceSelect();
	}

	function lightbox_gallery() {
		var gallery_class = 'uxper-gallery';
		if( fb_comment_lightbox == '1' ) {
			gallery_class = 'fb-comments';
		}
		if( $('.uxper-lightbox-on').length > 0 ) {
			$('.room-thumbnails').lightGallery({
				thumbnail: thumbnail_lightbox,
				currentPagerPosition: 'middle',
				addClass: gallery_class,
				selector: '.uxper-lightbox',
			});

			if( fb_comment_lightbox == '1' ) {
				$('.room-thumbnails').on('onAfterAppendSubHtml.lg', function() {
					try {
						FB.XFBML.parse();
					} catch (err) {
						$(window).on('fbAsyncInit', function() {
							FB.XFBML.parse();
						});
					}
				});
			}
		}
	}

	function toggle_content() {
		var h_desc = $('.toggle-content .entry-visibility').height();
		if( h_desc > 130 ) {
			$('.toggle-content').addClass('on');
		}

		$('.show-more').on('click', function(e) {
			e.preventDefault();
			$(this).parents('.toggle-content').addClass('active');
		});

		$('.hide-all').on('click', function(e) {
			e.preventDefault();
			$(this).parents('.toggle-content').removeClass('active');
		});
	}

	function toggle_data() {
		$( '.btn-uxper-toggle' ).on( 'click', function( e ) {
			e.preventDefault();
			var id = $( this ).attr( 'href' );
			$( id ).toggleClass( 'open' );
		} );
	}

	function toggle_booking() {
		$('.open-toggle').on('click', function (e) {
			e.preventDefault();
			var height = $(this).parent().find('.inner-toggle').outerHeight();
			var offset = $(this).closest('.ux-booking-form').offset().top;
			var offset_height = $(this).closest('.ux-booking-form').outerHeight();
			var windowHeight = $(window).height();
			var windowTop = $(window).scrollTop();
			$(this).parent().toggleClass('active');
			if( height > windowHeight + windowTop - offset - offset_height ) {
				$(this).parent().addClass('showup');
			}else{
				$(this).parent().removeClass('showup');
			}
		});

		$(document).on('click', function(event){
			var $this = $('.form-toggle');
			if($this !== event.target && !$this.has(event.target).length){
				$this.removeClass('active');
			}            
		});

		$('.area-booking').on('click','.btn-quantity', function() {
			var val  = $(this).parent().find('input').val();
			var name = $(this).parent().find('input').attr('name');
			if( parseInt(val) > 0 ){
				$(this).parents('.area-booking').find('.open-toggle').addClass('active');
				$(this).parents('.area-booking').find('.' + name + ' span').text(parseInt(val));
			}else{
				$(this).parents('.area-booking').find('.open-toggle').removeClass('active');
			}
		});

		$('body').on('change', '.ux-booking-form .uxper-nice-select', function() {
			var num = parseInt($(this).val());
			$('.area-booking input.qty').each( function() {
				var max   = parseInt($(this).attr('data-default'));
				var reval = max * num;
				$(this).attr('max', parseInt(reval));
			});
			$(this).closest('.ux-booking-form').find('.ux_room_adults span').text(1);
			$(this).closest('.ux-booking-form').find('.ux_room_childrens span').text(0);
			$(this).closest('.ux-booking-form').find('input[name="ux_room_adults"]').attr('value', 1);
			$(this).closest('.ux-booking-form').find('input[name="ux_room_childrens"]').attr('value', 0);
		});

		$('body').on('click', '.area-booking .plus', function(e) {
			var input = $(this).parents('.product-quantity').find('.input-text.qty');
			var name  = $(this).parents('.product-quantity').find('.input-text.qty').attr('name');
			var max   = $(this).parents('.product-quantity').find('.input-text.qty').attr('max');
			if( parseInt(input.val()) < parseInt(max) ) {
				var val = parseInt(input.val()) + 1;
			}else{
				var val = max;
			}
			input.attr('value',val);
			$(this).parents('.area-booking').find('.open-toggle').addClass('active');
			if( val > 0 ){
				$(this).parents('.area-booking').find('.' + name + ' span').text(parseInt(val));
			}else{
				$(this).parents('.area-booking').find('.' + name + ' span').text(0);
			}

			if( $(this).closest('.amount').length > 0 ) {
				var num = parseInt($(this).closest('.product-quantity').find('input').val());
				$('.area-booking input.qty').each( function() {
					var max   = parseInt($(this).attr('data-default'));
					var reval = max * num;
					if( $(this).closest('.amount').length == 0 ) {
						$(this).attr('max', parseInt(reval));
					}
				});

				$(this).closest('.ux-booking-form').find('.ux_room_adults span').text(1);
				$(this).closest('.ux-booking-form').find('.ux_room_childrens span').text(0);
				$(this).closest('.ux-booking-form').find('input[name="ux_room_adults"]').attr('value', 1);
				$(this).closest('.ux-booking-form').find('input[name="ux_room_childrens"]').attr('value', 0);
			}
		});

		$('body').on('click', '.area-booking .minus', function(e) {
			var input = $(this).closest('.product-quantity').find('.input-text.qty');
			var name  = $(this).parents('.product-quantity').find('.input-text.qty').attr('name');
			var min   = $(this).parents('.product-quantity').find('.input-text.qty').attr('min');
			if( parseInt(input.val()) > parseInt(min) ) {
				var val = parseInt(input.val()) - 1;
			}else{
				var val = min;
			}
			input.attr('value', val);
			$(this).parents('.area-booking').find('.open-toggle').addClass('active');
			if( val > 0 ){
				$(this).parents('.area-booking').find('.' + name + ' span').text(parseInt(val));
			}else{
				$(this).parents('.area-booking').find('.' + name + ' span').text(0);
			}

			if( $(this).closest('.amount').length > 0 ) {
				var num = parseInt($(this).closest('.product-quantity').find('input').val());
				$('.area-booking input.qty').each( function() {
					var max   = parseInt($(this).attr('data-default'));
					var reval = max * num;
					if( $(this).closest('.amount').length == 0 ) {
						$(this).attr('max', parseInt(reval));
					}
				});
				$(this).closest('.ux-booking-form').find('.ux_room_adults span').text(1);
				$(this).closest('.ux-booking-form').find('.ux_room_childrens span').text(0);
				$(this).closest('.ux-booking-form').find('input[name="ux_room_adults"]').attr('value', 1);
				$(this).closest('.ux-booking-form').find('input[name="ux_room_childrens"]').attr('value', 0);
			}
		});
	}

	function click_outside_filter(element, child) {
		$(document).on('click', function(event){
			var $this = $(element);
			if($this !== event.target && !$this.has(event.target).length){
				$this.removeClass('active');
				$this.find('.filter-control').slideUp(200);
			}            
		});
	}

	function filter_dropdown() {
		$('body').on('click', '.btn-popup-filter a', function(e) {
			e.preventDefault();
			$('.uxper-popup-filter').toggleClass('active');
		});

		$('body').on('click', '.uxper-popup-filter .btn-close', function(e) {
			e.preventDefault();
			$('.uxper-popup-filter').removeClass('active');
		});

		if( $('.filter-dropdown.action-wrap').length > 0 ) {
			$('body').on('click', '.filter-dropdown.action-wrap .entry-filter .filter-label', function() {
				$(this).parents('.entry-filter').toggleClass('active');
				$(this).parents('.entry-filter').find('.filter-control').slideToggle(200);
			});
	
			click_outside_filter('.filter-dropdown.action-wrap .filter-type .entry-filter');
			click_outside_filter('.filter-dropdown.action-wrap .filter-beds .entry-filter');
			click_outside_filter('.filter-dropdown.action-wrap .filter-amenities .entry-filter');
			click_outside_filter('.filter-dropdown.action-wrap .filter-services .entry-filter');
			click_outside_filter('.filter-dropdown.action-wrap .filter-extra-services .entry-filter');
			click_outside_filter('.filter-dropdown.action-wrap .sort-by .entry-filter');
		}
	}

	function booking_print() {
		$('#uxper-booking-print').on('click', function (e) {
			e.preventDefault();
			var $this = $(this),
				booking_id = $this.data('booking-id'),
				ajax_url = $this.data('ajax-url'),
				booking_print_window = window.open('', 'Booking Print Window', 'scrollbars=0,menubar=0,resizable=1,width=991 ,height=800');
			$.ajax({
				type: 'POST',
				url: ajax_url,
				data: {
					'action': 'uxper_booking_print_ajax',
					'booking_id': booking_id,
					'isRTL': $('body').hasClass('rtl') ? 'true' : 'false'
				},
				success: function (html) {
					booking_print_window.document.write(html);
					booking_print_window.document.close();
					booking_print_window.focus();
				},
				error: function (html) {
					console.log(html);
				}
			});
		});
	}

	function popup_booking() {
		$('body').on('click', '.btn-mobile-booking', function (e) {
			e.preventDefault();
			$(this).toggleClass('active');
			$('.room-booking').toggleClass('active');
			$('.single-room .main-content').toggleClass('active');
			if( $(this).hasClass('active') ) {
				$('body').css('overflow', 'hidden');
			}else{
				$('body').css('overflow', 'auto');
			}
		});

		$('body').on('click', '.room-booking>.bg-overlay,.room-booking .inner-booking>.btn-close', function (e) {
			e.preventDefault();
			$('body').css('overflow', 'auto');
			$('.btn-mobile-booking').removeClass('active');
			$('.room-booking').removeClass('active');
			$('.single-room .main-content').removeClass('active');
		});

		$('body').on('click', '.booking-contact .btn-nuss-popup', function (e) {
			e.preventDefault();
			$('body').css('overflow', 'auto');
			$('.btn-mobile-booking').removeClass('active');
			$('.room-booking').removeClass('active');
		});
	}

	$( document ).on('ready', function(){
		nice_select();
		lightbox_gallery();
		toggle_content();
		toggle_data();
		toggle_booking();
		filter_dropdown();
		popup_booking();
		
		if( $('#uxper-booking-print').length > 0 ) {
			booking_print();
		}
	});
})(jQuery);