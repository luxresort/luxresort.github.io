(function($) {
    "use strict";

    function backgroundImage() {
        var databackground = $('[data-background]');
        databackground.each(function() {
            if ($(this).attr('data-background')) {
                var image_path = $(this).attr('data-background');
                $(this).css({
                    'background': 'url(' + image_path + ')'
                });
            }
        });
    }

    function siteToggleAction() {
        var siteOverlay = $('.ps-site-overlay');
        $('.menu-toggle-open').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('active')
            siteOverlay.toggleClass('active');
        });

        $('.ps-toggle--sidebar').on('click', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $(this).toggleClass('active');
            $(this).siblings('a').removeClass('active');
            $(url).toggleClass('active');
            $(url).siblings('.ps-panel--sidebar').removeClass('active');
            siteOverlay.toggleClass('active');
        });

        $('.ps-panel--sidebar .ps-panel__close').on('click', function(e) {
            e.preventDefault();
            $(this).closest('.ps-panel--sidebar').removeClass('active');
            siteOverlay.removeClass('active');
        });

        $('body').on("click", function(e) {
            if ($(e.target).siblings(".ps-panel--sidebar").hasClass('active')) {
                $('.ps-panel--sidebar').removeClass('active');
                siteOverlay.removeClass('active');
            }
        });
    }

    function subMenuToggle() {
        $('.menu--mobile .menu-item-has-children > .sub-toggle').on('click', function(e) {
            e.preventDefault();
            var current = $(this).parent('.menu-item-has-children')
            $(this).toggleClass('active');
            current.siblings().find('.sub-toggle').removeClass('active');
            current.children('.sub-menu').slideToggle(350);
            current.siblings().find('.sub-menu').slideUp(350);
            if (current.hasClass('has-mega-menu')) {
                current.children('.mega-menu').slideToggle(350);
                current.siblings('.has-mega-menu').find('.mega-menu').slideUp(350);
            }
        });

        $('.menu--mobile .has-mega-menu .mega-menu__column .sub-toggle').on('click', function(e) {
            e.preventDefault();
            var current = $(this).closest('.mega-menu__column');
            $(this).toggleClass('active');
            current.siblings().find('.sub-toggle').removeClass('active');
            current.children('.mega-menu__list').slideToggle();
            current.siblings().find('.mega-menu__list').slideUp();
        });
    }

    function stickyHeader() {
        var header = $('.header'),
            checkpoint = 50;
        if (header.data('sticky') === true) {
            $(window).scroll(function() {
                var currentPosition = $(this).scrollTop();
                if (currentPosition > checkpoint) {
                    header.addClass('header--sticky');
                } else {
                    header.removeClass('header--sticky');
                }
            });
        } else {
            return false;
        }
    }

    function setAnimation(_elem, _InOut) {
        var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        _elem.each(function() {
            var $elem = $(this);
            var $animationType = 'animated ' + $elem.data('animation-' + _InOut);

            $elem.addClass($animationType).one(animationEndEvent, function() {
                $elem.removeClass($animationType);
            });
        });
    }

    function owlCarouselConfig() {
        var target = $('.owl-slider');

        const rtl = $('html').attr('dir') === 'rtl' ? true : false;
        if (target.length > 0) {
            target.each(function() {
                var el = $(this),
                    dataAuto = el.data('owl-auto'),
                    dataLoop = el.data('owl-loop'),
                    dataSpeed = el.data('owl-speed'),
                    dataGap = el.data('owl-gap'),
                    dataNav = el.data('owl-nav'),
                    dataDots = el.data('owl-dots'),
                    dataAnimateIn = el.data('owl-animate-in')
                        ? el.data('owl-animate-in')
                        : '',
                    dataAnimateOut = el.data('owl-animate-out')
                        ? el.data('owl-animate-out')
                        : '',
                    dataDefaultItem = el.data('owl-item'),
                    dataItemXS = el.data('owl-item-xs'),
                    dataItemSM = el.data('owl-item-sm'),
                    dataItemMD = el.data('owl-item-md'),
                    dataItemLG = el.data('owl-item-lg'),
                    dataItemXL = el.data('owl-item-xl'),
                    dataNavLeft = el.data('owl-nav-left')
                        ? el.data('owl-nav-left')
                        : "<i class='icon-chevron-left'></i>",
                    dataNavRight = el.data('owl-nav-right')
                        ? el.data('owl-nav-right')
                        : "<i class='icon-chevron-right'></i>",
                    duration = el.data('owl-duration'),
                    datamouseDrag =
                        el.data('owl-mousedrag') == 'on' ? true : false;
                if (
                    target.children('div, span, a, img, h1, h2, h3, h4, h5, h5')
                        .length >= 2
                ) {
                    el.addClass('owl-carousel').owlCarousel({
                        animateIn: dataAnimateIn,
                        animateOut: dataAnimateOut,
                        margin: dataGap,
                        autoplay: dataAuto,
                        autoplayTimeout: dataSpeed,
                        autoplayHoverPause: true,
                        loop: dataLoop,
                        nav: dataNav,
                        mouseDrag: datamouseDrag,
                        touchDrag: true,
                        autoplaySpeed: duration,
                        navSpeed: duration,
                        dotsSpeed: duration,
                        dragEndSpeed: duration,
                        navText: [dataNavLeft, dataNavRight],
                        dots: dataDots,
                        items: dataDefaultItem,
                        rtl: rtl,
                        responsive: {
                            0: {
                                items: dataItemXS,
                            },
                            480: {
                                items: dataItemSM,
                            },
                            768: {
                                items: dataItemMD,
                            },
                            992: {
                                items: dataItemLG,
                            },
                            1200: {
                                items: dataItemLG,
                                margin: 16,
                            },
                            1440: {
                                items: dataItemLG,
                                margin: 16,
                            },
                            1600: {
                                items: dataItemXL,
                            },
                        },
                    });
                }
            });
        }
    }

    function tabs() {
        $('.ps-tab-list  li > a ').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('li').siblings('li').removeClass('active');
            $(this).closest('li').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });

        $('.ps-tab-list.owl-slider .owl-item a').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('.owl-item').siblings('.owl-item').removeClass('active');
            $(this).closest('.owl-item').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });
    }

    function carouselNavigation() {
        var prevBtn = $('.ps-btn--carouse-arrow.prev'),
            nextBtn = $('.ps-btn--carouse-arrow.next');
        prevBtn.on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            console.log(target);
            $(target).trigger('prev.owl.carousel', [1000]);
        });
        nextBtn.on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(target).trigger('next.owl.carousel', [1000]);
        });
    }

    function accordion() {
        var accordion = $('.ps-accordion');
        accordion.find('.ps-accordion__content').hide();
        $('.ps-accordion.active')
            .find('.ps-accordion__content')
            .show();
        accordion.find('.ps-accordion__header').on('click', function(e) {
            e.preventDefault();
            if (
                $(this)
                    .closest('.ps-accordion')
                    .hasClass('active')
            ) {
                $(this)
                    .closest('.ps-accordion')
                    .removeClass('active');
                $(this)
                    .closest('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideUp(250);
            } else {
                $(this)
                    .closest('.ps-accordion')
                    .addClass('active');
                $(this)
                    .closest('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideDown(250);
                $(this)
                    .closest('.ps-accordion')
                    .siblings('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideUp();
            }
            $(this)
                .closest('.ps-accordion')
                .siblings('.ps-accordion')
                .removeClass('active');
            $(this)
                .closest('.ps-accordion')
                .siblings('.ps-accordion')
                .find('.ps-accordion__content')
                .slideUp();
        });
    }

    function createNoUiSlider(selectorID) {
        var selector = document.getElementById(selectorID);
        if (selector) {
            const selectorDOM = $('#' + selectorID);
            noUiSlider.create(selector, {
                connect: true,
                behaviour: 'tap',
                start: [0, 1000],
                range: {
                    min: 0,
                    '10%': 100,
                    '20%': 200,
                    '30%': 300,
                    '40%': 400,
                    '50%': 500,
                    '60%': 600,
                    '70%': 700,
                    '80%': 800,
                    '90%': 900,
                    max: 1000,
                },
            });

            const minLabel = selectorDOM.closest('.ps-form--slider').find('.ps-form__min > .value')
            const maxLabel = selectorDOM.closest('.ps-form--slider').find('.ps-form__max > .value')
            selector.noUiSlider.on('update', function(values) {
                minLabel.html(Math.round(values[0]))
                maxLabel.html(Math.round(values[1]))
            });
        }
    }

    function initNoUiSlider() {
        const selectors = [
            'price_range',
            'land_area_range',
            'dialog_price_range',
            'dialog_land_area_range',
        ]
        selectors.forEach(function(item) {
            createNoUiSlider(item);
        })
    }

    function handleToggleSearchType() {
        const selector = $('.ps-form--projects-search');
        selector.find('.ps-form__toggle-btn').on('click', function(e) {
            e.preventDefault();
            if (selector.hasClass('active')) {
                selector.find('.ps-form__bottom').slideUp(250);
                selector.removeClass('active');
            } else {
                selector.find('.ps-form__bottom').slideDown(250);
                selector.addClass('active');
            }
        })
    }

    function handleSelectPropertyType() {
        const selector = $('.ps-form__type-toggle');
        selector.on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).siblings('.ps-btn').addClass('active');
                $(this).removeClass('active')
            } else {
                $(this).addClass('active')
                $(this).siblings('.ps-btn').removeClass('active');
            }
        })
    }

    function handleToggleSearchExtra() {
        $('.ps-search-open').on('click', function(e) {
            e.preventDefault();
            $('body').find('#search-extra-dialog').addClass('active');
        })
        $('#close-search-extra').on('click', function(e) {
            e.preventDefault();
            $('body').find('#search-extra-dialog').removeClass('active');
        })
    }

    function handleBackToTop() {
        var scrollPos = 0, element = $('#back2top');
        $(window).scroll(function() {
            var scrollCur = $(window).scrollTop();
            if (scrollCur > scrollPos) {
                // scroll down
                if (scrollCur > 500) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            } else {
                // scroll up
                element.removeClass('active');
            }

            scrollPos = scrollCur;
        });

        element.on('click', function() {
            $('html, body').animate(
                {
                    scrollTop: '0px',
                },
                800
            );
        });
    }

    function handleToggleDrawer() {
        var siteOverlay = $('.ps-site-overlay');
        $('.ps-toggle-drawer').on('click', function(e) {
            e.preventDefault();
            const target = $(this).data('target');
            $("#" + target).addClass('active');
            siteOverlay.addClass('active');

        });

        $('.ps-drawer__close').on('click', function(e) {
            console.log(e);
            e.preventDefault();

            $(this).closest('.ps-drawer').removeClass('active');
            siteOverlay.removeClass('active');
        })

        $('body').on("click", function(e) {
            if ($(e.target).siblings(".ps-drawer").hasClass('active')) {
                $('.ps-drawer').removeClass('active');
                siteOverlay.removeClass('active');
            }
        });
    }

    $(function() {
        backgroundImage();
        owlCarouselConfig();
        siteToggleAction();
        subMenuToggle();
        tabs();
        stickyHeader();
        carouselNavigation();
        accordion();
        initNoUiSlider();
        handleToggleSearchType();
        handleSelectPropertyType();
        handleToggleSearchExtra();
        handleBackToTop();
        handleToggleDrawer();

    });

    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

})(jQuery);

$.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
}

Dropzone.options.myGreatDropzone = { // camelized version of the `id`
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 2, // MB
    accept: function(file, done) {
        if (file.name == "justinbieber.jpg") {
            done("Naha, you don't.");
        } else {
            done();
        }
    }
};
