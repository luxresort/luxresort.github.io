(
	function( $ ) {
		'use strict';

		$.fn.NussGridQuery = function() {
			var $el, $grid;
			var isQuerying = false;
			var $queryInput;
			
			/**
			 * Use small loader under of the grid instead of whole grid for pagination infinite scroll + load more button.
			 */
			var infiniteLoader = false;

			function initFilterCount() {
				if ( $( '.total-result' ).length == 0 ) {
					return;
				}

				var foundPosts = getQuery( 'found_posts' );
				$( '.total-result' ).text(foundPosts);
			}

			function handlerFilter() {
				$el.children( '.nuss-grid-filter' ).on( 'click', '.filter-wrap .btn-filter a', function( e ) {
					e.preventDefault();

					var $self = $( this );
					var $parent = $self.closest('.ux-filter');
					var filterValue = [];

					$el.find( '.grid-item' ).addClass('nuss-skeleton-loading');

					$parent.find('.filter-control').each( function() {
						var filter = $(this).find('a.save').attr( 'data-filter' );
						if( filter ) {
							var arg = [];
							$(this).find('input[name="' + filter + '"]:checked').each( function() {
								arg.push($(this).val());
							});
							var obj = {};
							obj[filter] = arg;
							filterValue.push(obj);
						}else{
							var filter = $(this).find('input.input-control').attr('name');
							var arg = [];
							$(this).find('input:checked').each( function() {
								arg.push($(this).val());
							});
							var obj = {};
							obj[filter] = arg;
							filterValue.push(obj);
						}

						if( $self.hasClass('clear') ) {
							var arg = [];
							obj[filter] = arg;
							$parent.find('input:checkbox').removeAttr('checked');
						}
					});

					if ( '*' === filterValue ) {
						setQueryVars( 'extra_query', '' );
					} else {
						setQueryVars( 'extra_query', filterValue );
					}

					$el.children( '.nuss-grid-filter' ).find('.action-wrap .filter-control').slideUp(200);

					$el.trigger( 'NussBeginQuery' );
				} );
			}

			function handlerSorting() {
				$el.find( '.sort-by a' ).on( 'click', function(e) {
					e.preventDefault();
					var value = $( this ).data('sort');

					$el.find( '.grid-item' ).addClass('nuss-skeleton-loading');

					var text = $(this).text();
					$(this).parents('.sort-by').find('.filter-label').text(text);
					$(this).parents('.sort-by').find('.filter-control').slideUp(200);

					var metaKey = '';
					var orderBy = 'date';
					var order   = 'DESC';

					switch ( value ) {
						case 'newest':
							orderBy = 'date';
							break;
						case 'featured':
							var compare = '';
							var metaValue = '';
							metaKey = 'uxbooking_meta_room_featured';
							orderBy = 'meta_value';
							compare = '=';
							metaValue = '1';
							setQueryVars( 'compare', compare );
							setQueryVars( 'meta_value', metaValue );
							break;
						case 'price':
							metaKey = 'uxbooking_meta_room_price';
							orderBy = 'meta_value';
							order   = 'ASC';
							break;
						case 'price-desc':
							metaKey = 'uxbooking_meta_room_price';
							orderBy = 'meta_value';
							break;
						default:
							break;
					}

					setQueryVars( 'orderby', orderBy );
					setQueryVars( 'order', order );
					setQueryVars( 'meta_key', metaKey );

					$el.trigger( 'NussBeginQuery' );
				} );
			}

			function handlerPagination() {
				// Do nothing if in elementor editor mode.
				if ( $( 'body' ).hasClass( 'elementor-editor-active' ) ) {
					return;
				}

				if ( $el.data( 'pagination' ) === 'loadmore' ) {
					$el.children( '.nuss-pagination' )
					   .find( '.nuss-loadmore-button' )
					   .on( 'click', function( e ) {
						    e.preventDefault();

							var current = $(this).closest('.nuss-grid-wrapper');

						   	if ( ! isQuerying ) {
								$( this ).hide();

								var paged = getQueryVars( 'paged', current );
								paged ++;

								setQueryVars( 'paged', paged, current );
								infiniteLoader = true;
								
								handlerQuery( false, current);
						   	}
					   } );
				} else if ( $el.data( 'pagination' ) === 'infinite' ) {
					// Waiting for header offset top & grid layout rendered.
					var infiniteReady = setInterval( function() {
						if ( $grid.hasClass( 'loaded' ) ) {
							handlerScrollInfinite();
							clearInterval( infiniteReady );
						}
					}, 200 );
				} else if ( $el.data( 'pagination' ) === 'navigation' ) {
					
					$el.on( 'click', '.nuss-pagination a.page-numbers', function( e ) {
						e.preventDefault();

						if ( isQuerying ) {
							return;
						}

						var current = $( this ).closest('.nuss-grid-wrapper');

						current.find( '.grid-item' ).addClass('nuss-skeleton-loading');

						if( $('.uxper-search-form').length > 0 ) {
							$(window).scrollTop($('.uxper-search-form').offset().top - 50);
						}

						current.find('.nuss-pagination .page-numbers').removeClass('current');
						$( this ).addClass( 'current' );

						var paged = getQueryVars( 'paged', current );
						
						if( ! $(this).hasClass('next') && ! $(this).hasClass('prev') ){
							var current_page = $(this).text();
							paged = parseInt(current_page);
						}

						if( $(this).hasClass('next') ){
							paged = parseInt(paged) + 1;
						}

						if( $(this).hasClass('prev') ){
							paged = parseInt(paged) - 1;
						}

						setQueryVars( 'paged', paged, current );

						var current = $(this).closest('.nuss-grid-wrapper');
						handlerQuery( true, current);
					} );
				}
			}

			function handlerScrollInfinite() {

				var windowHeight = $( window ).height();
				// 90% window height.
				var halfWH = 90 / 100 * windowHeight;
				halfWH = parseInt( halfWH );

				var elOffsetTop = $el.offset().top;
				var elHeight    = $el.outerHeight( true );
				var offsetTop   = elOffsetTop + elHeight;
				var finalOffset = offsetTop - halfWH;
				var oldST       = 0;
				
				// On scroll.
				$( window ).on('scroll', function() {
					var st = $( this ).scrollTop();
					// Scroll down & in view.
					if ( st > oldST && st >= finalOffset ) {

						if ( ! isQuerying ) {
							var paged = getQueryVars( 'paged', $el );
							var maxNumberPages = getQuery( 'max_num_pages', $el );
							
							if ( paged < maxNumberPages ) {
								paged ++;

								setQueryVars( 'paged', paged, $el );
								infiniteLoader = true;
								handlerQuery( false, $el );
							}
						}
					}

					oldST = st;
				} );

				$( window ).on( 'resize', function() {
					// Fix layout not really completed.
					setTimeout( function() {
						windowHeight = $( window ).height();
						// 90% window height.
						halfWH = 90 / 100 * windowHeight;
						halfWH = parseInt( halfWH );

						elOffsetTop = $el.offset().top;
						elHeight    = $el.outerHeight( true );
						offsetTop   = elOffsetTop + elHeight;
						finalOffset = offsetTop - halfWH;
					}, 100 );
				} );
			}

			/**
			 * Load post infinity from db.
			 */
			function handlerQuery( reset, current ) {
				isQuerying = true;

				if( current ) {
					$el = current;
				}

				var loader;
				loader = $el.find( '.nuss-loader' );
				if( infiniteLoader ) {
					loader.addClass( 'show' );
				}
				var $queryInput = $el.find( '.nuss-query-input' ).first();

				setTimeout( function() {
					var query = JSON.parse( $queryInput.val() );
					var query_data = $.param( query );

					$.ajax( {
						url: theme_vars.ajax_url,
						type: 'POST',
						data: query_data,
						dataType: 'json',
						success: function( results ) {

							setQuery( 'max_num_pages', results.max_num_pages );
							setQuery( 'found_posts', results.found_posts );
							setQuery( 'count', results.count );
							initFilterCount();

							var html = results.template;
							var $newItems = $( html );
							var $pagination = results.pagination;

							if ( reset === true ) {
								$el.find( '.grid-item' ).remove();
							}

							$el.trigger( 'NussQueryEnd', [ $el, $newItems, $pagination ] );

							setTimeout(function() {
								$('.room-thumbnails .nuss-swiper').each( function() {
									$( this ).NussSwiper();
								} );
							}, 500);

							handlerQueryEnd($el);

							loader.removeClass( 'show' );

							isQuerying = false;
							infiniteLoader = false;
						}
					} );
				}, 500 );
			}

			/**
			 * Remove pagination if has no posts anymore
			 */
			function handlerQueryEnd(current) {
				if ( current ) {
					$el = current;
				}

				// Do not apply for 'navigation' type.
				if ( $el.data( 'pagination' ) === 'navigation' ) {
					return;
				}

				var foundPosts  = getQuery( 'found_posts' );
				var paged       = getQueryVars( 'paged', current );
				var numberPages = getQueryVars( 'posts_per_page', current );
				
				if ( foundPosts <= (
					paged * numberPages
				) ) {
					$el.children( '.nuss-pagination' ).hide();
					$el.children( '.nuss-pagination-messages' ).show( 1 );
				} else {
					$el.children( '.nuss-pagination' ).show();
					$el.children( '.nuss-pagination' ).find( '.nuss-loadmore-button' ).show();
					$el.children( '.nuss-pagination-messages' ).hide( 1 );
				}
			}

			function getQuery( name, current ) {
				if( current ) {
					$el = current;
				}
				var $queryInput = $el.find( '.nuss-query-input' ).first();

				var query = JSON.parse( $queryInput.val() );

				return query[ name ];
			}

			function setQuery( name, newValue ) {
				var query = JSON.parse( $queryInput.val() );

				query[ name ] = newValue;

				$queryInput.val( JSON.stringify( query ) );
			}

			function getQueryVars( name, current ) {
				if( current ) {
					$el = current;
				}

				var $queryInput = $el.find( '.nuss-query-input' ).first();

				var queryVars = JSON.parse( $queryInput.val() );

				return queryVars.query_vars[ name ];
			}

			function setQueryVars( name, newValue, current ) {
				if( current ) {
					$el = current;
				}

				var $queryInput = $el.find( '.nuss-query-input' ).first();

				var queryVars = JSON.parse( $queryInput.val() );

				queryVars.query_vars[ name ] = newValue;

				$queryInput.val( JSON.stringify( queryVars ) );
			}

			return this.each( function() {
				$el = $( this );
				$grid = $el.find( '.nuss-grid' );
				$queryInput = $el.find( '.nuss-query-input' ).first();

				handlerFilter();

				if( ! $queryInput.val() ) return;

				initFilterCount();
				handlerSorting();
				handlerPagination();

				$el.on( 'NussBeginQuery', function() {		
					// Reset to first page.
					setQueryVars( 'paged', 1 );
					handlerQuery( true );
				} );
			} );
		};
	}( jQuery )
);
