(
	function( $ ) {
		'use strict';
		
		$.fn.NussGridLayout = function() {
			var $el, $grid, resizeTimer;

			/**
			 * Calculate size for grid items
			 */
			function calculateMasonrySize( $isotopeOptions ) {
				var windowWidth = window.innerWidth,
				    $gridWidth  = $grid[ 0 ].getBoundingClientRect().width,
				    $column     = 1,
				    $gutter     = 0,
				    $row_gap    = 0,
				    settings    = $grid.data( 'grid' ),
				    lgGutter    = settings.gutter ? settings.gutter : 30,
				    mdGutter    = settings.gutterTablet ? settings.gutterTablet : lgGutter,
				    smGutter    = settings.gutterMobile ? settings.gutterMobile : mdGutter,
					lgRowGap    = settings.RowGap ? settings.RowGap : 60,
				    mdRowGap    = settings.RowGapTablet ? settings.RowGapTablet : lgRowGap,
				    smRowGap    = settings.RowGapMobile ? settings.RowGapMobile : mdRowGap,
				    lgColumns   = settings.columns ? settings.columns : 1,
				    mdColumns   = settings.columnsTablet ? settings.columnsTablet : lgColumns,
				    smColumns   = settings.columnsMobile ? settings.columnsMobile : mdColumns;

				var tabletBreakPoint = 1200;
				var mobileBreakPoint = 720;

				if ( typeof elementorFrontendConfig !== 'undefined' ) {
					tabletBreakPoint = elementorFrontendConfig.breakpoints.lg;
					mobileBreakPoint = elementorFrontendConfig.breakpoints.md;
				}

				if ( windowWidth >= tabletBreakPoint ) {
					$column  = lgColumns;
					$gutter  = lgGutter;
					$row_gap = lgRowGap;
				} else if ( windowWidth >= mobileBreakPoint ) {
					$column  = mdColumns;
					$gutter  = mdGutter;
					$row_gap = mdRowGap;
				} else {
					$column  = smColumns;
					$gutter  = smGutter;
					$row_gap = smRowGap;
				}

				var totalGutterPerRow = (
					$column - 1
				) * $gutter;

				var columnWidth = (
					$gridWidth - totalGutterPerRow
				) / $column;

				columnWidth = Math.floor( columnWidth );

				var columnWidth2 = columnWidth;
				if ( $column > 1 ) {
					columnWidth2 = columnWidth * 2 + $gutter;
				}

				$grid.children( '.grid-sizer' ).css( {
					'width': columnWidth + 'px'
				} );

				$grid.children( '.grid-item' ).each( function( index ) {
					var gridItem = $( this );

					if ( gridItem.data( 'width' ) === 2 ) {
						gridItem.css( {
							'width': columnWidth2 + 'px'
						} );
					} else {
						gridItem.css( {
							'width': columnWidth + 'px'
						} );
					}

					if ( 'masonry' !== settings.type ) {
						gridItem.css( {
							'marginBottom': $row_gap + 'px'
						} );
					}
				} );

				if ( $isotopeOptions ) {
					$isotopeOptions.packery.gutter = $gutter;
					$isotopeOptions.fitRows.gutter = $gutter;
					$grid.isotope( $isotopeOptions );
				}

				$grid.isotope( 'layout' );
			}

			function handlerEntranceAnimation() {
				// Used find() for flex layout.
				var items = $grid.find( '.grid-item' );

				items.waypoint( function() {
					// Fix for different ver of waypoints plugin.
					var _self = this.element ? this.element : this;
					var $self = $( _self );
					$self.addClass( 'animate' );
				}, {
					offset: '90%',
					triggerOnce: true
				} );
			}

			return this.each( function() {
				$el = $( this );
				$grid = $el.find( '.nuss-grid' );

				var settings = $grid.data( 'grid' );
				var gridData;

				if ( $grid.length > 0 && settings && typeof settings.type !== 'undefined' ) {
					var $isotopeOptions = {
						itemSelector: '.grid-item',
						percentPosition: true,
						transitionDuration: 0,
						packery: {
							columnWidth: '.grid-sizer',
						},
						fitRows: {
							gutter: 30
						}
					};

					if ( 'masonry' === settings.type ) {
						$isotopeOptions.layoutMode = 'packery';
					} else {
						$isotopeOptions.layoutMode = 'fitRows';
					}

					gridData = $grid.imagesLoaded( function() {
						calculateMasonrySize( $isotopeOptions );
						if ( 'grid' === settings.type ) {
							$grid.isotope( 'layout' );
						}
						$grid.addClass( 'loaded' );
					} );

					gridData.one( 'arrangeComplete', function() {
						handlerEntranceAnimation();
					} );

					$( window ).on('resize', function() {
						calculateMasonrySize( $isotopeOptions );

						// Sometimes layout can be overlap. then re-cal layout one time.
						clearTimeout( resizeTimer );
						resizeTimer = setTimeout( function() {
							// Run code here, resizing has "stopped"
							calculateMasonrySize( $isotopeOptions );
						}, 500 ); // DO NOT decrease the time. Sometime, It'll make layout overlay on resize.
					} );
				} else {
					handlerEntranceAnimation();
				}
				
				$el.on( 'NussQueryEnd', function( event, el, $items, $pagination ) {
					el.find( '.grid-item' ).removeClass('nuss-skeleton-loading');
					var $pagination_type = el.data('pagination');
					if( $pagination_type == 'navigation' && el.length > 0 ) {
						var $grid_postision = parseInt(el.offset().top);
						$( 'html, body' ).animate( { scrollTop: $grid_postision - 100 }, 1000 );
					}

					if ( $grid.length > 0 && settings && typeof settings.type !== 'undefined' ) {
						el.find('.nuss-pagination').html($pagination);
						var height = $grid.height();
						$grid.isotope()
							.css('height', height)
						    .append( $items )
						    .isotope( 'reloadItems', $items )
						    .imagesLoaded()
						    .always( function() {
							    $items.addClass( 'animate' );
							    calculateMasonrySize( $isotopeOptions );
							    if ( 'grid' === settings.type ) {
								    $grid.isotope( 'layout' );
							    }
						    } );
					} else {
						$grid.append( $items ).imagesLoaded().always( function() {
							$items.addClass( 'animate' );
						} );
					}
				} );
			} );
		};
	}( jQuery )
);
