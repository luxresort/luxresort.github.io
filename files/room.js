(function ($) {
	"use strict";

	var ajax_url  = uxper_room_vars.ajax_url,
		checkout_only = uxper_room_vars.checkout_only,
		sending_email = uxper_room_vars.sending_email;

	$(document).on('ready', function () {
		uxperRoom.init();
	});
	
	var uxperRoom = {
		holder: $('.single-room,.ux-room-calendar'),
		form: $('.ux-booking-form'),
		checkout: $('.checkout-wrap'),
		date: [],
		price: 0,
		init: function () {
			
			if ( this.holder.length ) {
				uxperRoom.toggleCalendar();
				uxperRoom.initCalendar();
				uxperRoom.initFormDatepicker();
				uxperRoom.sendBookingMessage();
			}

			if( $('.single-room').length ) {
				// Prevent scrolling on page load, because of form focus
				window.scrollTo(0, 0);
			}

			if( this.form.length ) {
				uxperRoom.triggerAmountRoom();
				uxperRoom.triggerWooCheckout();
			}

			if ( this.checkout.length ) {
				$('.ux-apply-coupon').on('click', function(e){
					e.preventDefault();
					uxperRoom.triggerTotalPrice();
				});

				uxperRoom.triggerServicePrice();
				uxperRoom.triggerTotalPrice();

				$('body').on('click', '.ux-booking-action .uxper-order', function(e){
					if ( $('#uxper-checkout').valid() ) {
						e.preventDefault();
						uxperRoom.triggerTotalPrice('order');
					}
				});
			}

			var timer;
			$( 'body' ).on( 'click', '.service-booking .product-quantity .plus', function( e ) {
				e.preventDefault();
				var $this = $( this );
				var input = $this.parents( '.product-quantity' ).find( '.input-text.qty' );
				var max = input.attr('max');
				if( parseInt( input.val() ) < parseInt(max) ) {
					var val = parseInt( input.val() ) + 1;
				}
				input.attr( 'value', val );
				if( input.val() ){
					clearInterval(timer);
					timer = setTimeout(function() {
						uxperRoom.triggerServicePrice();
						if ( $('.checkout-wrap').length ) {
							uxperRoom.triggerTotalPrice();
						}
					}, 500);
				}else{
					clearInterval(timer);
				}
			} );
			$( 'body' ).on( 'click', '.service-booking .product-quantity .minus', function( e ) {
				e.preventDefault();
				var $this = $( this );
				var input = $this.parents( '.product-quantity' ).find( '.input-text.qty' );
				var val = parseInt( input.val() ) - 1;
				if ( parseInt( input.val() ) > 0 ) { input.attr( 'value', val ); }
				if( input.val() ){
					clearInterval(timer);
					timer = setTimeout(function() {
						uxperRoom.triggerServicePrice();
						if ( $('.checkout-wrap').length ) {
							uxperRoom.triggerTotalPrice();
						}
					}, 500);
				}else{
					clearInterval(timer);
				}
			} );
			$( 'body' ).on( 'input keyup', '.service-booking .product-quantity .input-text.qty', function( e ) {
				e.preventDefault();
				var $this = $( this );
				var val = parseInt( $this.val() );
				$this.attr( 'value', val );
				if( $this.val() ){
					clearInterval(timer);
					timer = setTimeout(function() {
						uxperRoom.triggerServicePrice();
						if ( $('.checkout-wrap').length ) {
							uxperRoom.triggerTotalPrice();
						}
					}, 500);
				}else{
					clearInterval(timer);
				}
			} );
		},
		triggerCalendar: function( $calendar, isRangeSlider ) {
			$calendar.datepick({
				dateFormat: 'dd M yyyy',
				minDate: new Date(),
				changeMonth: false,
				useMouseWheel: false,
				showAnim: 'fadeIn',
				rangeSelect: isRangeSlider,
				monthsToShow: isRangeSlider && $(window).width() > 767 ? 2 : 1,
				useMouseWheel: ! isRangeSlider,
				showTrigger: '#calImg',
				prevText: '<i class="fal fa-arrow-left"></i>',
				nextText: '<i class="fal fa-arrow-right"></i>',
				monthNames: uxper_room_vars.monthNames,
				monthNamesShort: uxper_room_vars.monthNamesShort,
				dayNames: uxper_room_vars.dayNames,
				dayNamesShort: uxper_room_vars.dayNamesShort,
				dayNamesMin: uxper_room_vars.dayNamesMin,
				renderer: {
					picker: '<div class="datepick">{months}{popup:start}{popup:end}<div class="datepick-clear-fix"></div></div>',
					monthRow: '<div class="datepick-month-row">{link:prev}{months}{link:next}</div>',
				},
				onShow: function ($picker) {
					var reservedDates = $calendar.data('reserved-dates');
					if (typeof reservedDates !== 'undefined') {
						var dates = reservedDates.split('|');
						$.each(dates, function (index, value) {
							var value_date_next = new Date(new Date(value).setDate(new Date(value).getDate() + 1));
							var value_date_prev = new Date(new Date(value).setDate(new Date(value).getDate() - 1));
							var date_next = new Date(value_date_next).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
							var date_prev = new Date(value_date_prev).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
							if( $.inArray(date_next, dates) !== -1 && $.inArray(date_prev, dates) !== -1 ) {
								var value = new Date(value).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
								if( value ) {
									value = value.replace(/\b0+/g, '');
									value = uxperRoom.checkMonth(value);
								}
								var reserved = $picker.find('.datepick-month tr td a[title*="'+value+'"]');
								if ( reserved.length ) {
									reserved.addClass('datepick-disabled');
								}
							}

							if( $.inArray(date_next, dates) !== -1 && $.inArray(date_prev, dates) == -1 ) {
								var value = new Date(value).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
								if( value ) {
									value = value.replace(/\b0+/g, '');
									value = uxperRoom.checkMonth(value);
								}
								var reserved = $picker.find('.datepick-month tr td a[title*="'+value+'"]');
								if ( reserved.length ) {
									reserved.addClass('datepick-only-checkout').append('<span class="tooltip">'+ checkout_only +'</span>');
								}
							}
						});
					}
				},
				onClose: function ($picker) {
					if( new Date($picker[0]).setHours(0, 0, 0, 0) == new Date($picker[1]).setHours(0, 0, 0, 0) ) {
						var first_picker = new Date($picker[0]);
						var check_in = first_picker.setDate(first_picker.getDate());
						var check_out = first_picker.setDate(first_picker.getDate() + 1);
						check_in = new Date(check_in).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
						check_out = new Date(check_out).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
						$('input[name="ux_room_check_in_out"]').val(check_in + ' - ' + check_out);
					}
					uxperRoom.triggerAmountRoom();
				},
				onSelect: function ($picker) {
					if( $('.ux-room-input-popup').length > 0 && $(this).hasClass('ux-room-datepick-popup') ) {
						var first_picker = new Date($picker[0]);
						var last_picker = new Date($picker[1]);
						var check_in = first_picker.setDate(first_picker.getDate());
						var check_out = last_picker.setDate(last_picker.getDate());
						check_in = new Date(check_in).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
						check_out = new Date(check_out).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
						$('.check-availabity-popup input[name="ux_room_check_in_out"]').val(check_in + ' - ' + check_out);
						if( new Date($picker[0]).setHours(0, 0, 0, 0) == new Date($picker[1]).setHours(0, 0, 0, 0) ) {
							var first_picker = new Date($picker[0]);
							var check_in = first_picker.setDate(first_picker.getDate());
							var check_out = first_picker.setDate(first_picker.getDate() + 1);
							check_in = new Date(check_in).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
							check_out = new Date(check_out).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2 $1 $3');
							$('.check-availabity-popup input[name="ux_room_check_in_out"]').val(check_in + ' - ' + check_out);
						}
					}
					setTimeout(function() {
						var check_disabled = false;
						$('body').find('.datepick-popup .datepick td').each(function() {
							var $this = $(this);
							if( $picker[0] ) {
								$this.find('a').removeClass('datepick-only-checkout');
								if( $this.find('a').hasClass('datepick-disabled') ) {
									check_disabled = true;
								}
							}
							if( check_disabled ) {
								$this.find('a').addClass('datepick-nonselect');
							}
						});
					}, 150);
				}
			});
		},
		toggleCalendar: function() {
			$('body').on('click', '.ux-btn-toggle', function (e) {
				e.preventDefault();
				var id = $(this).attr('href');
				$(id).toggleClass('active');
				$(this).closest('.grid-item').toggleClass('toggle-active');
	
				var $calendar = $(this).closest('.grid-item').find('.ux-room-datepick-calendar'),
					isRangeSlider = $calendar.hasClass('calendar--range-on');
				
				uxperRoom.triggerCalendar( $calendar, isRangeSlider );
	
				if( $(this).closest('.nuss-grid').length > 0 ) {
					$(this).closest('.nuss-grid').isotope('layout');
				}
			});
		},
		initCalendar: function () {
			var $calendars = $('.ux-room-datepick-calendar');
			
			if ( $calendars.length ) {
				$calendars.each(function(){
					var $calendar = $(this),
						isRangeSlider = $calendar.hasClass('calendar--range-on');
					
					uxperRoom.triggerCalendar( $calendar, isRangeSlider );
				});
			}
		},
		initFormDatepicker: function () {
			var $checkInOutDate 	 = uxperRoom.form.find('.ux-room-check-in-out'),
			 	$checkInOutDateValue = uxperRoom.form.find('.ux-room-check-in-out').val();

			if ( $checkInOutDate.length ) {
				// Set default date values if dates are not froward through query
				if ( $checkInOutDateValue.length <= 0 ) {
					$checkInOutDate.datepick('option', 'selectDefaultDate', true);
					$checkInOutDate.datepick('option', 'defaultDate', '0');

					var minimum_stay = uxper_room_vars.booking_minimum_stay;
					var reservedDates = $checkInOutDate.data('reserved-dates');

					var check_date = false;
					if( reservedDates ) {
						var dates = reservedDates.split('|');
						dates.sort(function(a,b){
							var da = new Date(a).getTime();
							var db = new Date(b).getTime();
							
							return da < db ? -1 : da > db ? 1 : 0
						});

						var default_date = new Date();

						var check_default = false;
						var default_date_next;
						for( var i = 0; i <= minimum_stay; i++ ){
							if( i == 0 ) {
								var default_date_next = default_date.setDate(default_date.getDate());
							}else{
								var default_date_next = default_date.setDate(default_date.getDate() + 1);
							}
							var default_next = new Date(default_date_next).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
							if( $.inArray(default_next, dates) !== -1 ) {
								check_default = true;
							}
						}

						if( check_default ) {
							var out_dates = [];
							$.each(dates, function (index, value) {
								var last_date_next = new Date(new Date(value).setDate(new Date(value).getDate() + 1));
								var last_date_prev = new Date(new Date(value).setDate(new Date(value).getDate() - 1));
								var last_date_next = new Date(last_date_next).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
								var last_date_prev = new Date(last_date_prev).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
								if( $.inArray(last_date_next, dates) == -1 || $.inArray(last_date_prev, dates) == -1 ) {
									out_dates.push(value);
								}
							});

							$.each(out_dates, function (index, value) {
								dates = $.grep(dates, function(item) {
									return item != value;
								});
							});

							$.each(dates, function (index, value) {
								if( new Date(value).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ) {
									var value_date = new Date(value);
									check_date = true;
									default_date = value;
									for( var i = 0; i <= minimum_stay; i++ ){
										var value_date_next = value_date.setDate(value_date.getDate() + 1);
										var date_next = new Date(value_date_next).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$1 $2, $3');
										if( $.inArray(date_next, dates) !== -1 ) {
											check_date = false;
										}
									}
									if( check_date ){
										return false;
									}
								}
							});
						}
					}
					
					var default_pick = 1;
					if( minimum_stay && $.isNumeric(minimum_stay) ) {
						default_pick = minimum_stay;
					}
					
					$checkInOutDate.datepick('setDate', '0', '+' + default_pick);
					if( check_date ) {
						var date = new Date(default_date);
						var date_in = date.setDate(date.getDate() + 1);
						var date_out = date.setDate(date.getDate() + parseInt(default_pick));
						date_in = new Date(date_in);
						date_out = new Date(date_out);
						$('.room-booking .ux-booking-form .ux-room-check-in-out').datepick('setDate', date_in, date_out);
					}
				}
			}
		},
		convertMonth: function (check_in_out) {
			if( ! check_in_out ) return;

			var month_short_en = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
			var month_short_en = month_short_en.split('|');
			var check_in_out_arr = check_in_out.split('-');
			var check_in = check_in_out_arr[0].trim();
			var check_out = check_in_out_arr[1].trim();
			var checkin_month = check_in.substring(
				check_in.indexOf(' ') + 1, 
				check_in.lastIndexOf(' ')
			);
			var checkout_month = check_out.substring(
				check_out.indexOf(' ') + 1,
				check_out.lastIndexOf(' ')
			);
			var checkin_month_index = $.inArray( checkin_month, uxper_room_vars.monthNamesShort );
			var checkout_month_index = $.inArray( checkout_month, uxper_room_vars.monthNamesShort );
			var checkin_en = month_short_en[checkin_month_index];
			var checkout_en = month_short_en[checkout_month_index];
			var check_in_out = check_in_out.replace(checkin_month, checkin_en);
			var check_in_out = check_in_out.replace(checkout_month, checkout_en);

			return check_in_out;
		},
		convertsingleMonth: function (date) {
			if( ! date || typeof date === 'undefined' ) return;

			var month_short_en = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
			var month_short_en = month_short_en.split('|');
			var date = date.trim();
			var date_month = date.substring(
				date.indexOf(' ') + 1, 
				date.lastIndexOf(' ')
			);
			var date_month_index = $.inArray( date_month, uxper_room_vars.monthNamesShort );
			var month_en = month_short_en[date_month_index];
			var date = date.replace(date_month, month_en);

			return date;
		},
		checkMonth: function (date) {
			if( ! date || typeof date === 'undefined' ) return;

			var month_short_en = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
			var month_short_en = month_short_en.split('|');
			var day = date;
			var result = '';
			$.each(month_short_en, function(index, value) {
				var month_en = uxper_room_vars.monthNamesShort[index];
				if( value && month_en && value != month_en ) {
					if( day.indexOf(value) != -1 ) {
                        result = day.replace(value, month_en);
                    }
				}else{
					result = day;
				}
			});

			return result;
		},
		triggerAmountRoom: function () {
			var room_id      = $('input[name="ux_room_id"]').val();
			var check_in_out = $('input[name="ux_room_check_in_out"]').val();
			check_in_out = uxperRoom.convertMonth(check_in_out);

			$.ajax({
				type: 'post',
				dataType: 'json',
				url: uxper_template_vars.ajax_url,
				data: {
					action: 'uxper_check_amount_room',
					room_id: room_id,
					check_in_out: check_in_out,

				},
				beforeSend: function () {
					$('.room-booking').append(uxper_template_vars.loading);
				},
				success: function (response) {
					if( response.success ) {
						$('.room-booking').removeClass('disabled');
						$('.room-booking .room-amount').show();
						$('.uxper-nice-select option').each( function(){
							if ( $(this).attr('value') > response.amount ) {
								$(this).attr('disabled', true);
							}else{
								$(this).attr('disabled', false);
							}
						});
						$('.uxper-nice-select ul.list li').each( function(){
							if ( $(this).attr('data-value') > response.amount ) {
								$(this).addClass('disabled');
							}else{
								$(this).removeClass('disabled');
							}
						});
						$('.room-booking .alert-message').text('');
					}else{
						$('.room-booking').addClass('disabled');
						$('.room-booking .room-amount').hide();
						$('.room-booking .alert-message').text(response.alert);
					}
					$('.uxper-loading-effect').remove();
				},
				error: function (response) {
					$('.uxper-loading-effect').remove();
					console.log(response);
				},
			});
		},
		triggerServicePrice: function () {
			var $wrap = uxperRoom.checkout;
			var service = '';
			var currency_sign = uxper_template_vars.currency_sign;
			var currency_sign_position = uxper_template_vars.currency_sign_position;
			if( $('.extra-service-detail .service').length > 0 ) {
				$('.extra-service-detail .service').each( function() {
					var service_title = $(this).closest('.service').find('.service-title .entry-title').text();
					var service_price = $(this).find('.product-quantity .service-qty').attr('price');
					var quantity = $(this).find('.product-quantity .service-qty').val();
					service_price = service_price * quantity;
					$(this).find('.input-service-price').val(service_price);
					if( parseFloat(quantity) > 0 ) {
						service += '<div class="column">';
						service += '<div class="name">';
						service += service_title + ' <span class="quantity">x <span>' + quantity + '</span></span></div>';
						service += '</div>';
						service += '<div class="column align-right">';
						if( currency_sign_position == 'before' ) {
							service += '<span class="accent-color price">' + currency_sign + service_price.toFixed(2) + '</span>';
						}
						if( currency_sign_position == 'after' ) {
							service += '<span class="accent-color price">' + service_price.toFixed(2) + currency_sign + '</span>';
						}
						service += '</div>';
						$(this).closest('.checkout-wrap').find('.review-order .service .uxper-grid').html('');
					}
				});
			}
			if( service.length > 0 ) {
				$wrap.find('.review-order .service .uxper-grid').append(service);
				$wrap.find('.review-order .service').removeClass('hide');
			}else{
				$wrap.find('.review-order .service').addClass('hide');
			}
		},
		triggerTotalPrice: function ( event = 'update' ) {
			var $wrap = uxperRoom.checkout;
			var urlParams = new URLSearchParams(window.location.search);
			var service_price = $wrap.find('.extra-service-detail input[name="service_price[]"]').map(function(){return $(this).val();}).get();
			var payment_method = $wrap.find('.radio.active input[name="uxper_payment_method"]').val();

			if(  event == 'order' ) {
				var extra_services = [];
				$wrap.find('.extra-service-detail .service').each( function() {
					var service_title = $(this).closest('.service').find('.service-title .entry-title').text();
					var service_price = $(this).find('.product-quantity .service-qty').attr('price');
					var quantity = $(this).find('.product-quantity .service-qty').val();
					var service_total_price = service_price * quantity;
					var service = [];
					service.push(quantity);
					service.push(service_title);
					service.push(service_total_price.toFixed(2));
					extra_services.push(service);
					$wrap.find('.review-order .service').removeClass('hide');
				});
			}
			var check_in = uxperRoom.convertsingleMonth($wrap.find('input[name="ux_booking_check_in"]').val());
			var check_out = uxperRoom.convertsingleMonth($wrap.find('input[name="ux_booking_check_out"]').val());
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: uxper_template_vars.ajax_url,
				data: {
					action: 'uxper_total_price_room_update',
					event: event,
					item_id: urlParams.get('id'),
					payment_method: payment_method,
					check_in: check_in,
					check_out: check_out,
					room_id: $wrap.find('input[name="room_id"]').val(),
					amount: $wrap.find('input[name="ux_room_amount"]').val(),
					adults: $wrap.find('input[name="ux_room_adults"]').val(),
					childrens: $wrap.find('input[name="ux_room_childrens"]').val(),
					coupon: $wrap.find('input[name="ux_booking_coupon"]').val(),
					first_name: $wrap.find('input[name="ux_booking_first_name"]').val(),
					last_name: $wrap.find('input[name="ux_booking_last_name"]').val(),
					email: $wrap.find('input[name="ux_booking_email"]').val(),
					tel: $wrap.find('input[name="ux_booking_tel"]').val(),
					address: $wrap.find('input[name="ux_booking_address"]').val(),
					city: $wrap.find('input[name="ux_booking_city"]').val(),
					country: $wrap.find('input[name="ux_booking_country"]').val(),
					zip: $wrap.find('input[name="ux_booking_zip"]').val(),
					message: $wrap.find('textarea[name="ux_booking_message"]').val(),
					service_price: service_price,
					extra_services: extra_services,
				},
				beforeSend: function () {
					$('.page-primary').append(uxper_template_vars.loading);
					$('.page-secondary .inner-sidebar .review-order').append(uxper_template_vars.loading);
				},
				success: function (response) {
					if( response.success ) {
						if( typeof response.coupon_percent !== 'undefined' ) {
							$wrap.find('.review-order .discount .name').html('<span>' + response.coupon + ' (' + response.coupon_percent + ')' + '</span>');
							$wrap.find('.review-order .discount .price').html('<span>- ' + response.coupon_price + '</span>');
							$wrap.find('.coupon-detail .error').addClass('hide');
							$wrap.find('.coupon-detail .success').removeClass('hide');
							$wrap.find('.review-order .discount').removeClass('hide');
						}else{
							if( $wrap.find('input[name="ux_booking_coupon"]').val() ) {
								$wrap.find('.review-order .discount').addClass('hide');
								$wrap.find('.coupon-detail .error').removeClass('hide');
								$wrap.find('.coupon-detail .success').addClass('hide');
							}
						}

						if( typeof response.fee_price !== 'undefined' ) {
							$wrap.find('.review-order .fee').removeClass('hide');
							$wrap.find('.review-order .fee .price').text(response.fee_price);
						}

						$wrap.find('.uxper-subtotal-price').text(response.sub_price);
						$wrap.find('.uxper-total-price').text(response.total_price);

						if( response.stripe ) {
							var stripe = Stripe(uxper_template_vars.stripe_publishable_key);
							stripe.redirectToCheckout({ sessionId: response.stripe });
						}

						if( response.paypal ) {
							window.location.href = response.paypal;
						}

						if( response.return ) {
							window.location.href = response.return;
						}
					}else{
						alert(uxper_template_vars.booking_error);
					}
					$('.uxper-loading-effect').remove();
				},
				error: function (response) {
					alert(uxper_template_vars.booking_error);
					console.log(response);
				},
			});
		},
		triggerWooCheckout: function () {
			var $form = $('.room-booking .ux-booking-form');
			if( $form.find('[name="ux_room_amount"]').length ) {
				$form.find('[name="ux_room_amount"]').on('change', function () {
					$form.find('[name="quantity"]').val(parseInt($(this).val()));
				});
			}
			if( $form.find('input[name="add-to-cart"]').val() ) {
				$form.on('click', '.btn-submit', function (e) {
					e.preventDefault();

					var service_price = $form.find('.extra-service-detail input[name="service_price[]"]').map(function(){return $(this).val();}).get();
					var extra_services = [];
					$form.find('.extra-service-detail .service').each( function() {
						var service_title = $(this).closest('.service').find('.service-title .entry-title').text();
						var service_price = $(this).find('.product-quantity .service-qty').attr('price');
						var quantity = $(this).find('.product-quantity .service-qty').val();
						var service_total_price = service_price * quantity;
						var service = [];
						service.push(quantity);
						service.push(service_title);
						service.push(service_total_price.toFixed(2));
						extra_services.push(service);
					});
					var check_in_out = uxperRoom.convertMonth($form.find('input[name="ux_room_check_in_out"]').val());
					$.ajax({
						type: 'post',
						dataType: 'json',
						url: uxper_template_vars.ajax_url,
						data: {
							action: 'uxper_woocommerce_add_to_cart',
							id: $form.find('input[name="add-to-cart"]').val(),
							check_in_out: check_in_out,
							amount: $form.find('input[name="ux_room_amount"]').val(),
							adults: $form.find('input[name="ux_room_adults"]').val(),
							childrens: $form.find('input[name="ux_room_childrens"]').val(),
							service_price: service_price,
							extra_services: extra_services,
						},
						beforeSend: function () {
							$('.room-booking').append(uxper_template_vars.loading);
						},
						success: function (response) {
							$form.trigger('submit');
							$('.uxper-loading-effect').remove();
						},
						error: function (response) {
							$('.uxper-loading-effect').remove();
							console.log(response);
						},
					});
				});
			}
		},
		sendBookingMessage: function () {
			$('body').on('click', '.btn-booking-contact', function (event) {
				event.preventDefault();
				var $this = $(this),
					$form = $(this).parents('form'),
					name = $('[name="sender_name"]', $form).val(),
					phone = $('[name="sender_phone"]', $form).val(),
					sender_email = $('[name="sender_email"]', $form).val(),
					message = $('[name="sender_msg"]', $form).val(),
					error = false;

				$('.form-messages', $form).hide();

				if(name == null || name.length === 0) {
					$('.name-error', $form).removeClass('hidden');
					error = true;
				} else if(!$('.name-error', $form).hasClass('hidden')) {
					$('.name-error', $form).addClass('hidden');
				}
				if(phone == null || phone.length === 0) {
					$('.phone-error', $form).removeClass('hidden');
					error = true;
				} else if(!$('.phone-error', $form).hasClass('hidden')) {
					$('.phone-error', $form).addClass('hidden');
				}

				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if( sender_email == null || sender_email.length === 0 || !re.test(sender_email) ) {
					$('.email-error', $form).removeClass('hidden');
					if(sender_email.trim().length !== 0 && !re.test(sender_email)) {
						$('.email-error', $form).text($('.email-error', $form).data('not-valid'));
					} else {
						$('.email-error', $form).text($('.email-error', $form).data('error'));
					}
					error = true;
				} else if( !$('.email-error', $form).hasClass('hidden') ) {
					$('.email-error', $form).addClass('hidden');
				}
				if( message == null || message.length === 0 ) {
					$('.message-error', $form).removeClass('hidden');
					error = true;
				} else if( !$('.message-error', $form).hasClass('hidden') ) {
					$('.message-error', $form).addClass('hidden');
				}

				if( !error ) {
					$.ajax({
						type: 'post',
						url: ajax_url,
						dataType: 'json',
						data: $form.serialize(),
						beforeSend: function () {
							$('.form-messages', $form).show();
							$('.form-messages', $form).html(sending_email);
						},
						success: function (response) {
							if (response.success) {
								$('.form-messages', $form).html('<div class="uxper-notice notice-success"><div class="icon"><i class="fal fa-check icon-large"></i></div>' + response.message + '</div>');
							} else {
								$('.form-messages', $form).html('<div class="uxper-notice notice-error"><div class="icon"><i class="fal fa-times icon-large"></i></div>' + response.message + '</div>');
							}
						},
						error: function () {
						}
					});
				}
			});
		}
	}
	
})(jQuery);