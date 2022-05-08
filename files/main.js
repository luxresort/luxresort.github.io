/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable camelcase */
var NUSS = NUSS || {};

( function( $ ) {
    'use strict';

    var $body                            = $( 'body' ),
        $window                          = $( window ),
        ajax_url                         = theme_vars.ajax_url,
        header_sticky                    = theme_vars.header_sticky,
        content_protected_enable         = theme_vars.content_protected_enable,
        scroll_top_enable                = theme_vars.scroll_top_enable,
        popup_open_after_loading         = theme_vars.popup_open_after_loading,
        popup_reopen_after_closed        = theme_vars.popup_reopen_after_closed,
        subcription_open_after_loading   = theme_vars.subcription_open_after_loading,
        subcription_reopen_after_closed  = theme_vars.subcription_reopen_after_closed;

    NUSS.element = {
        init: function() {
            NUSS.element.general();
            NUSS.element.cookie_notices();
            NUSS.element.retina_logo();
            NUSS.element.swiper_carousel();
            NUSS.element.scroll_to_top();
            NUSS.element.main_menu();
            NUSS.element.smart_menu();
            NUSS.element.header_sticky();
            NUSS.element.video_popup();
            NUSS.element.toggle_popup();
			NUSS.element.grid_layout();
            NUSS.element.global_popup();
            NUSS.element.global_subcription();

            if( content_protected_enable == 1 ) {
                NUSS.element.content_protected();
            }
    	},

        windowLoad: function() {
            NUSS.element.page_loading_effect();
            NUSS.element.handler_animation();
            NUSS.element.handler_entrance_queue_animation();

            // Smooth scroll to section if url has hash tag when page loaded.
            var hashTag = window.location.hash;
            if ( NUSS.element.is_valid_smoothscroll_target( hashTag ) ) {
                NUSS.element.smooth_scroll( hashTag );
            }
        },

        general: function() {
            $( '.block-search.search-icon' ).on( 'click', function( e ) {
                e.preventDefault();
                $( '.search-form-wrapper.canvas-search' ).addClass( 'on' );
            } );

            $( '.canvas-search' ).on( 'click', '.btn-close,.bg-overlay', function( e ) {
                e.preventDefault();
                $( this ).parents( '.canvas-search' ).removeClass( 'on' );
            } );
        },

        retina_logo: function() {
            if ( window.matchMedia( 'only screen and (min--moz-device-pixel-ratio: 1.5)' ).matches
                || window.matchMedia( 'only screen and (-o-min-device-pixel-ratio: 3/2)' ).matches
                || window.matchMedia( 'only screen and (-webkit-min-device-pixel-ratio: 1.5)' ).matches
                || window.matchMedia( 'only screen and (min-device-pixel-ratio: 1.5)' ).matches ) {
                $( '.site-logo img' ).each( function() {
                    $( this ).addClass( 'logo-retina' );
                    $( this ).attr( 'src', $( this ).data( 'retina' ) );
                });
            }
        },

        cookie_notices: function() {
            if ( theme_vars.notice_cookie_enable == 1 && theme_vars.notice_cookie_confirm != 'yes' && theme_vars.notice_cookie_messages != '' ) {
                $.growl( {
                    location: 'br',
                    fixed: true,
                    duration: 3600000,
                    size: 'large',
                    title: '',
                    message: theme_vars.notice_cookie_messages
                } );
    
                $( '#nuss-button-cookie-notice-ok' ).on( 'click', function() {
                    $( this ).parents( '.growl-message' ).first().siblings( '.growl-close' ).trigger( 'click' );
    
                    var _data = {
                        action: 'notice_cookie_confirm'
                    };
    
                    _data = $.param( _data );
    
                    $.ajax( {
                        url: theme_vars.ajax_url,
                        type: 'POST',
                        data: _data,
                        dataType: 'json',
                        success: function( results ) {
                            
                        },
                        error: function( errorThrown ) {
                            console.log( errorThrown );
                        }
                    } );
                } );
            }
        },

        page_loading_effect: function() {
            setTimeout( function() {
                $body.addClass( 'loaded' );
            }, 200 );
    
            var $loader = $( '#page-preloader' );
    
            setTimeout( function() {
                $loader.remove();
            }, 2000 );
        },

        handler_animation: function() {
            var items = $( '.nuss-grid' ).children( '.grid-item' );

            items.waypoint( function() {
                // Fix for different ver of waypoints plugin.
                // eslint-disable-next-line no-underscore-dangle
                var _self = this.element ? this.element : this;
                var $self = $( _self );
                $self.addClass( 'animate' );
            }, {
                offset: '100%',
                triggerOnce: true
            } );
        },

        handler_entrance_queue_animation: function() {
            var animateQueueDelay  = 200,
                queueResetDelay;
            $( '.nuss-entrance-animation-queue' ).each( function() {
                var itemQueue  = [],
                    queueTimer,
                    queueDelay = $( this ).data( 'animation-delay' ) ? $( this ).data( 'animation-delay' ) : animateQueueDelay;

                $( this ).children( '.item' ).waypoint( function() {
                    // Fix for different ver of waypoints plugin.
                    // eslint-disable-next-line no-underscore-dangle
                    var _self = this.element ? this.element : $( this );

                    // eslint-disable-next-line no-unused-vars
                    queueResetDelay = setTimeout( function() {
                        queueDelay = animateQueueDelay;
                    }, animateQueueDelay );

                    itemQueue.push( _self );
                    NUSS.element.process_item_queue( itemQueue, queueDelay, queueTimer );
                    queueDelay += animateQueueDelay;
                }, {
                    offset: '90%',
                    triggerOnce: true
                } );
            } );
        },

        process_item_queue: function( itemQueue, queueDelay, queueTimer, queueResetDelay ) {
            clearTimeout( queueResetDelay );
            queueTimer = window.setInterval( function() {
                if ( itemQueue !== undefined && itemQueue.length ) {
                    $( itemQueue.shift() ).addClass( 'animate' );
                    NUSS.element.process_item_queue();
                } else {
                    window.clearInterval( queueTimer );
                }
            }, queueDelay );
        },

        swiper_carousel: function() {
            $( '.nuss-swiper-slider' ).each( function() {
                if ( $( this ).hasClass( 'nuss-swiper-linked-yes' ) ) {
                    var mainSlider = $( this ).children( '.nuss-main-swiper' ).NussSwiper();
                    var thumbsSlider = $( this ).children( '.nuss-thumbs-swiper' ).NussSwiper();

                    mainSlider.controller.control = thumbsSlider;
                    thumbsSlider.controller.control = mainSlider;
                } else {
                    $( this ).NussSwiper();
                }
            } );

            // Thumbs Gallery
            var swiper_control = new Swiper('.nuss-swiper-control', {
                loop: true,
                spaceBetween: 8,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                },
              });
            var swiper_thumb = new Swiper('.nuss-swiper-thumb', {
                loop: true,
                spaceBetween: 8,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                thumbs: {
                    swiper: swiper_control,
                },
            });
        },

        scroll_to_top: function() {
            if ( scroll_top_enable != 1 ) {
                return;
            }
            var $scrollUp = $( '#page-scroll-up' );
            var lastScrollTop = 0;
            $window.on('scroll', function() {
                var st = $( this ).scrollTop();
                if ( st > lastScrollTop ) {
                    $scrollUp.removeClass( 'show' );
                } else {
                    if ( $window.scrollTop() > 200 ) {
                        $scrollUp.addClass( 'show' );
                    } else {
                        $scrollUp.removeClass( 'show' );
                    }
                }
                lastScrollTop = st;
            } );
    
            $scrollUp.on( 'click', function( evt ) {
                $( 'html, body' ).animate( { scrollTop: 0 }, 600 );
                evt.preventDefault();
            } );
        },

    	main_menu: function() {
    		$( '.canvas-menu .menu-item-has-children>a,.canvas-menu .page_item_has_children>a' ).on( 'click', function( e ) {
                e.preventDefault();
                e.stopPropagation();
                var parent = $( this ).closest('li');
                if ( parent.hasClass( 'active' ) ) {
                    parent.removeClass( 'active' );
                    parent.find( '>.sub-menu,>.children' ).slideUp( 300 );
                } else {
                    if ( $( this ).parents( '.menu-item-has-children,.page_item_has_children' ).hasClass( 'active' ) == false ) {
                        $( '.canvas-menu li>.sub-menu,.canvas-menu li>.children' ).slideUp( 300 );
                        $( '.canvas-menu li' ).removeClass( 'active' );
                    }
                    parent.find( '>.sub-menu,>.children' ).slideDown( 300 );
                    parent.addClass( 'active' );
                }
            } );

    		// Open Canvas Menu
            $( '.canvas-menu' ).on( 'click', '.icon-menu', function( e ) {
            	e.preventDefault();
                $( this ).parents( '.canvas-menu' ).toggleClass( 'active' );
            } );

            // Close Canvas Menu
            $( '.canvas-menu' ).on( 'click', '.btn-close,.bg-overlay', function( e ) {
            	e.preventDefault();
                $( this ).parents( '.canvas-menu' ).removeClass( 'active' );
            } );

            // Check Sub Menu
            $( '.site-menu .sub-menu' ).each( function() {
                var width  = $( this ).outerWidth();

                if ( width > 0 ) {
                    var offset = $( this ).offset();
                    var w_body = $( 'body' ).outerWidth();
                    var left = offset.left;
                    if ( w_body < left + width ) {
                        $( this ).css( 'left', '-100%' );
                    }
                }
            } );
    	},

        smart_menu: function() {
            $( '.desktop-menu' ).each( function(){
                var $menu = $(this).find( 'ul' ).first();

                if ( ! $menu.hasClass( 'sm' ) ) {
                    return;
                }
        
                $menu.smartmenus( {
                    hideTimeout: 250,
                    subMenusSubOffsetX: 0,
                    subMenusSubOffsetY: -17
                } );
        
                // Add animation for sub menu.
                $menu.on( {
                    'show.smapi': function( e, menu ) {
                        $( menu ).removeClass( 'hide-animation' ).addClass( 'show-animation' );
                    },
                    'hide.smapi': function( e, menu ) {
                        $( menu ).removeClass( 'show-animation' ).addClass( 'hide-animation' );
                    }
                } ).on( 'animationend webkitAnimationEnd oanimationend MSAnimationEnd', 'ul', function( e ) {
                    $( this ).removeClass( 'show-animation hide-animation' );
                    e.stopPropagation();
                } );
            });
        },

        hover_effect: function() {
            $('.nuss-ele-button .button-text').each( function() {
                var text = $(this).text();
                $(this).html('<div><span>' + text.split('').join('</span><span>') + '</span></div>');
            });
        },

        header_sticky: function() {
            if( header_sticky == 'yes' ) {
                return;
            }

            var offset = 0,
                height = 0;

            if ( $( 'header.site-header' ).length > 0 ) {
                offset = $( 'header.site-header' ).offset().top;
                height = $( 'header.site-header' ).outerHeight();
            }
            var has_wpadminbar = $( '#wpadminbar' ).length;
            var wpadminbar = 0;

            var lastScroll = 0;
            if ( has_wpadminbar > 0 ) {
                wpadminbar = $( '#wpadminbar' ).height();
                $( '.header-sticky' ).addClass( 'has-wpadminbar' );
            }
            
            $( window ).on('scroll', function() {
                var currentScroll = $( window ).scrollTop();
                if ( currentScroll > offset + wpadminbar + height + 150 ) {
                    $( '.header-sticky' ).addClass( 'scroll' );
                }else{
                    $( '.header-sticky' ).removeClass( 'scroll' );
                }
                if ( currentScroll > lastScroll ) {
                    $( '.header-sticky' ).removeClass( 'on' );
                } else {
                    if ( currentScroll < offset + wpadminbar + height + 150 ) {
                        $( '.header-sticky' ).removeClass( 'on' );
                    }else{
                        $( '.header-sticky' ).addClass( 'on' );
                    }
                }
                lastScroll = currentScroll;
            });
        },

        video_popup: function() {
            $( '.nuss-popup-video' ).each( function() {
                var options = {
                    selector: 'a',
                    fullScreen: false,
                    zoom: false,
                    getCaptionFromTitleOrAlt: false,
                    counter: false
                };
                $( this ).lightGallery( options );
            } );
        },
    
        toggle_popup: function() {
            $( '.nuss-popup' ).on( 'click', '.bg-overlay, .btn-close', function( e ) {
                e.preventDefault();
                $( this ).closest( '.nuss-popup' ).removeClass( 'open' );
                $( '.single-room .main-content' ).removeClass('active');
            });

            $( '.btn-nuss-popup' ).on( 'click', function( e ) {
                e.preventDefault();
                var id = $( this ).attr( 'href' );
                $( '.nuss-popup' ).removeClass( 'open' );
                $(' .single-room .main-content' ).addClass('active');
                $( id ).addClass( 'open' );
            } );
        },

        content_protected: function() {
            var $contentProtectedAlert = $( '#nuss-content-protected-box' );
            var delayTime = 3000;

            /**
             * Prevent right click.
             */
            $( document ).on( 'contextmenu', function() {
                $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                return false;
            } );

            $( window ).on( 'keydown', function( event ) {
                /**
                 * Prevent open chrome dev tools on Win OS.
                 */
                // Prevent F12.
                if ( event.keyCode == 123 ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                /**
                 * CTRL + SHIFT + I
                 * CTRL + SHIFT + J
                 * CTRL + SHIFT + C
                 */
                if ( event.ctrlKey && event.shiftKey && (
                    event.keyCode == 67 ||
                    event.keyCode == 73 ||
                    event.keyCode == 74
                ) ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                /**
                 * Prevent open chrome dev tools on Mac OS.
                 */

                /**
                 * COMMAND + OPTION + I
                 * COMMAND + OPTION + J
                 * COMMAND + OPTION + C
                 */
                if ( event.metaKey && event.altKey && (
                    event.keyCode == 67 ||
                    event.keyCode == 73 ||
                    event.keyCode == 74
                ) ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                // COMMAND + SHIFT + C
                if ( event.metaKey && event.shiftKey && event.keyCode == 67 ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }
            } );

            $('html').bind('cut copy paste', function (e) {
                e.preventDefault();
           });
        },

        get_smooth_scroll_offset: function() {
            if ( smoothScrollOffset ) {
                return smoothScrollOffset
            }
    
            var windowWidth = window.innerWidth,
                smoothScrollOffset = 0;

    
            // Add offset of admin bar when viewport min-width 600.
            if ( windowWidth > 600 ) {
                var adminBarHeight = $( '#wpadminbar' ).height();
                smoothScrollOffset += adminBarHeight;
            }
    
            if ( smoothScrollOffset > 0 ) {
                smoothScrollOffset = - smoothScrollOffset;
            }
    
            return smoothScrollOffset;
        },

        is_valid_smoothscroll_target: function( selector ) {
            if ( selector.match( /^([.#])(.+)/ ) ) {
                return true;
            }
    
            return false;
        },

        smooth_scroll: function(target) {
            var offset = NUSS.element.get_smooth_scroll_offset();

            $.smoothScroll( {
                offset: 0,
                scrollTarget: $( target ),
                speed: 600,
                easing: 'linear'
            } );
        },

		grid_layout: function() {
            $( '.nuss-grid-wrapper' ).NussGridLayout();
            $( '.nuss-grid-wrapper' ).NussGridQuery();
        },

        global_popup: function() {            

            if (sessionStorage.getItem("nuss-popup-reopen-time") == null ) {
                timeInterval(popup_open_after_loading);
            } else {
                if (new Date() >= new Date(parseInt(sessionStorage.getItem("nuss-popup-reopen-time")))) {                    
                    timeInterval(popup_open_after_loading);
                }
            }
    
            $(".popup-message-close").on("click", function () {                
                closeAndSetReOpen();
            });   
            
            $(".popup-message-blank").on("click", function () {                
                closeAndSetReOpen();
            });

            function closeAndSetReOpen() {
                var today = new Date();
                var popup_reopen = today.setSeconds(today.getSeconds() + parseInt(popup_reopen_after_closed));
                $("#popup-message").removeClass('nuss-d-flex');
                sessionStorage.setItem("nuss-popup-reopen-time", popup_reopen);
            }
    
            function timeInterval(time) {
                setTimeout(() => {
                    $("#popup-message").addClass('nuss-d-flex');
                }, time * 1000);
            };
        },

        global_subcription: function() {

            if (sessionStorage.getItem("nuss-subcribe-reopen-time") == null ) {
                timeInterval(subcription_open_after_loading);
            } else {
                if (new Date() >= new Date(parseInt(sessionStorage.getItem("nuss-subcribe-reopen-time")))) {                    
                    timeInterval(subcription_open_after_loading);
                }
            }
    
            $(".popup-subcription-close").on("click", function () {                
                closeAndReopen();
            });            

            $(".popup-subcription-blank").on("click", function () {                
                closeAndReopen();
            }); 

            function closeAndReopen() {
                var today = new Date();
                var subcribe_reopen = today.setSeconds(today.getSeconds() + parseInt(subcription_reopen_after_closed));
                $("#popup-subcription").removeClass('nuss-d-flex');
                sessionStorage.setItem("nuss-subcribe-reopen-time", subcribe_reopen);
            }
    
            function timeInterval(time) {
                setTimeout(() => {
                    $("#popup-subcription").addClass('nuss-d-flex');
                }, time * 1000);
            };
        }
    }

    NUSS.woocommerce = {
        init: function() {
            NUSS.woocommerce.quantity();
        },

        quantity: function() {
            $( 'body' ).on( 'click', '.entry-quantity .plus', function( e ) {
                var input = $( this ).parents( '.entry-quantity' ).find( '.input-text.qty' );
                // eslint-disable-next-line radix
                var val = parseInt( input.val() ) + 1;
                input.attr( 'value',val );
                $( '.button[name="update_cart"]' ).prop( 'disabled', false );
            } );
            $( 'body' ).on( 'click', '.entry-quantity .minus', function( e ) {
                var input = $( this ).parents( '.entry-quantity' ).find( '.input-text.qty' );
                // eslint-disable-next-line radix
                var val = parseInt( input.val() ) - 1;
                if ( input.val() > 0 ) { input.attr( 'value',val ); }
                $( '.button[name="update_cart"]' ).prop( 'disabled', false );
            } );
        },
    }

    NUSS.onReady = {
        init: function() {
            NUSS.element.init();
            NUSS.woocommerce.init();
        }
    };

    NUSS.onLoad = {
        init: function() {
            NUSS.element.windowLoad();
        }
    };

    NUSS.onScroll = {
        init: function() {
            // Scroll Window
        }
    };

    NUSS.onResize = {
        init: function() {
            // Resize Window
        }
    };

    $( document ).on('ready', NUSS.onReady.init );
    $( window ).on('scroll', NUSS.onScroll.init );
    $( window ).on('resize', NUSS.onResize.init );
    $( window ).on('load', NUSS.onLoad.init );

} )( jQuery );
