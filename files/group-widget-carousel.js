(
	function( $ ) {
		'use strict';

		var SwiperHandler = function( $scope, $ ) {
			var $element = $scope.find( '.nuss-slider-widget' );

			$element.NussSwiper();

			$('.elementor-widget-nuss-modern-carousel-02').each( function(){
				var $slider = $(this).find('.nuss-swiper');
				if ( $slider.hasClass( 'pagination-style-08' ) ) {
					if( $(this).find('.heading-primary-wrap').length > 0 ) {
						var heading = $(this).find('.heading-primary-wrap').first().clone();
						$slider.find('.swiper-pagination-container').prepend(heading);
					}
					if( $(this).find('.button-content-wrapper').length > 0 ) {
						var button = $(this).find('.button-content-wrapper').first().clone();
						$slider.find('.swiper-pagination-container').append(button);
					}
				}
			});

			$('.nuss-modern-carousel .nuss-box').on('mouseover', function(e) {
				if( $(this).find('.elementor-video').length > 0 ) {
					$(this).find('.elementor-video')[0].play();
				}
			}).on('mouseout', function(e) {
				if( $(this).find('.elementor-video').length > 0 ) {
					$(this).find('.elementor-video')[0].pause();
				}
			});
		};

		var SwiperLinkedHandler = function( $scope, $ ) {
			var $element = $scope.find( '.nuss-slider-widget' );

			if ( $scope.hasClass( 'nuss-swiper-linked-yes' ) ) {
				var thumbsSlider = $element.filter( '.nuss-thumbs-swiper' ).NussSwiper();
				var mainSlider = $element.filter( '.nuss-main-swiper' ).NussSwiper( {
					thumbs: {
						swiper: thumbsSlider
					}
				} );
			} else {
				$element.NussSwiper();
			}
		};

		$( window ).on( 'elementor/frontend/init', function() {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-image-carousel.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-modern-carousel.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-modern-carousel-02.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-modern-slider.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-team-member-carousel.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-product-carousel.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-room-carousel.default', SwiperHandler );
			elementorFrontend.hooks.addAction( 'frontend/element_ready/nuss-testimonial.default', SwiperLinkedHandler );
		} );
	}
)( jQuery );
