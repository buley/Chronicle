/* Chronicle */

/* Text content revision control with a concept of staging changes. */

var Chronicle = ( function() {

	/*         */
	/* Private */
	/*         */

	/* Uses singleton pattern */

	var Private = function() {

	};

	Private.version = 1;

	/* Dependencies */

	InDB = new IDB( { 'database': 'Chronicle_' + Private.version } );

	/* Defaults */

	Private.default = Private.default || {};

	/* Default success callback */
	Private.default.on_success = function() {
		console.log( 'Success', response );
	};

	/* Default error callback */
	Private.default.on_error = function() {
		console.log( 'Error', response );
	};

	/* Database */

	Private.db = {};
	
	Private.database = Private.database || {}:

	Private.install = function( on_success, on_error ) {

		var count = 0;		
		var result = {};

		var own_on_success = function( response, type ) {
			count += 1;
			result[ type ] = response;
			if( 2 === count ) {
				if( 'function' === typeof on_success ) {
					on_success( result );
				}
			}
		};

		var own_on_error = function( response, type ) {
			count += 1;
			result[ type ] = response;
			if( 2 === count ) {
				if( 'function' === typeof on_error ) {
					on_error( result );
				}
			}
		};

		Private.revision.install( own_on_success, own_on_error );
		Private.items.install( own_on_success, own_on_error );

	};

	/* Revisions */

	Private.revision = Private.revision || {};

	Private.revision.install = function( on_success, on_error ) {

		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success();
			}
		};

		var own_on_error = function() {
			if( 'function' === typeof on_success ) {
				on_success();
			}
		};

		var indexes = {
			'primary': {
				'key': 'id'
				, 'incrementing': true
				, 'unique': true
			}
			, 'item_id': false
			, 'previous': false
			, 'next': false
		};

		InDB.install( {
			store: 'revisions'
			, indexes: indexes
			, on_success: on_success
			, on_error: on_error
		} );

	};

	Private.revision.expunge = function() {};

	Private.revision.coverup = function() {};

	Private.revision.purge = function() {};

	Private.revision.get = function() {};

	Private.revision.restore = function() {};

	Private.revision.activate = function() {};

	Private.revision.update = function() {};

	Private.revision.save = function( item_id, data, on_success, on_error ) {

		/* Setup */

		var store = request.store;
		var data = request.data;

		if( 'undefined' === typeof data ) {
			throw new Error( 'App.prototype.add: Data cannot be empty' );
			return;
		}

		if( 'undefined' === typeof store || null === store ) {
			throw new Error( 'App.prototype.add: Store cannot be empty' );
			return null;
		}

		/* Defaults */

		var index = request.index;
		index = ( 'undefined' !== typeof index ) ? index : null;
		var key = request.key;
		key = ( 'undefined' !== typeof key ) ? key : null;

		/* Callbacks */

		var on_success = function( value ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'App.prototype.add success', value );
			}
			/* Callback */
			if( 'function' == typeof request.on_success ) {
				request.on_success( value );
			}
		};

		var on_error = function( context ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'App.prototype.add error', context );
			}
			/* Callback */
			if( 'function' == typeof request.on_error ) {
				request.on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': data
			, 'on_success': on_success
			, 'on_error': on_error
			, 'store': store
		} );

	};


	/* Items */

	Private.item = Private.item || {};

	Private.item.install = function() {

		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success();
			}
		};

		var own_on_error = function() {
			if( 'function' === typeof on_error ) {
				on_error();
			}
		};

		var indexes = {
			'primary': {
				'key': 'id'
				, 'incrementing': true
				, 'unique': true
			}
			, 'item_id': false
			, 'previous': false
			, 'next': false
		};

		InDB.install( {
			store: 'items'
			, indexes: indexes
			, on_success: on_success
			, on_error: on_error
		} );

	};

	Private.item.create = function( data, on_success, on_error ) {	

		/* Setup */

		var store = request.store;
		var data = request.data;

		if( 'undefined' === typeof data ) {
			throw new Error( 'App.prototype.add: Data cannot be empty' );
			return;
		}

		if( 'undefined' === typeof store || null === store ) {
			throw new Error( 'App.prototype.add: Store cannot be empty' );
			return null;
		}

		/* Callbacks */

		var on_success = function( value ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'App.prototype.add success', value );
			}
			/* Callback */
			if( 'function' == typeof request.on_success ) {
				request.on_success( value );
			}
		};

		var on_error = function( context ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'App.prototype.add error', context );
			}
			/* Callback */
			if( 'function' == typeof request.on_error ) {
				request.on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': data
			, 'on_success': on_success
			, 'on_error': on_error
			, 'store': store
		} );



	};

	Private.item.publish = function( item_id, on_success, on_error ) {};

	Private.item.draft = function( item_id, on_success, on_error ) {};

	Private.item.forward = function( item_id, count, on_success, on_error )) {};

	Private.item.rollback = function( item_id, count, on_success, on_error ) {};

	Private.item.clear = function( item_id, on_success, on_error ) {};

	Private.item.chronicle = function( item_id, begin, end, on_success, on_error ) {};

	Private.item.delete = function( item_id, on_success, on_error ) {};




	/* Utils */

	Private.utils = Private.utils || {};

	/* 

	Object comparator	
	
	Example usage:

	var one = {
		'name': 'Taylor'
		, 'hometown': 'New York'
		, 'dob': 'Nov 17'  
		, 'text': [ 'first', [ 'one', 'three', 'two' ], 'second' ]            
	};

	var two = {
		'name': 'Jax'
		, 'hometown': 'New York'
		, 'dob': 'Jan 10'    
		, 'text': [ 'second', [ 'one', 'two', 'three' ], 'first' ]
	};

	console.log( JSON.encode( Private.objectDiff( one, two ) ) );

	> {"name":["Taylor","Jax"],"dob":["Nov 17","Jan 10"],"text":{"0":["first","second"],"1":{"1":["three","two"],"2":["two","three"]},"2":["second","first"]}}

	*/

	Private.utils.diff_obj = function( base_obj, comp_obj ) {
		var result = {}, key;
		for( key in base_obj ) {
			if( true === base_obj.hasOwnProperty( key ) ) {	
				if( comp_obj[ key ] !== base_obj[ key ] ) { 
					result[ key ] = [ base_obj[ key ], comp_obj[ key ] ];
				}
				if( true === Private.utils.isArray( comp_obj[ key ] ) ) {
					if( true === Private.utils.isArray( base_obj[ key ] == 'array' ) ) {
						var x = 0, xlen = comp_obj[ key ].length, xitem;
						for( x = 0; x < xlen; x += 1 ) {
							if( false === Private.utils.isArray( result[ key ] ) )  {
								result[ key ][ x ] = [];
							}
							result[ key ][ x ] = Private.diff_obj( base_obj[ key ], comp_obj[ key ] );
						}

					} else {
						if( 'object' === typeof comp_obj[ key ] && 'object' === typeof base_obj[ key ] ) {
							result[ key ] = [ base_obj[ key ], comp_obj[ key ] ];
						}
					}
				} else {
					if( 'object' === typeof comp_obj[ key ] && 'object' === typeof base_obj[ key ] ) {
						result[ key ] = Private.diff_obj( base_obj[ key ], comp_obj[ key ] );
					}
				}
			} 
		}
		return result;
	};

	Private.utils.isArray = function( obj ) {
		return ( ( 'function' === typeof Array.isArray ) ? Array.isArray( obj ) : ( function() {
			//TODO: Implement fallback
			return true;
		}() ) );
	};


	/*            */
	/* Public API */
	/*            */

	/* Classical prototypical inheritance pattern */

	var Public = function() {
		Private.install();
	};

	/* Install */

	/* create an IndexedDB database and object stores */
	/* returns the request object on success */
	/* returns an error object on error */
	Public.prototype.install = function( request ) {
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( response ) {
			Private.db = response;
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.install( own_on_success, on_error );
	};


	/* Item methods */

	/* create a new item given a data object */
	/* returns the request object and a revision id on success */
	/* returns an error object on error */
	Public.prototype.create = function( request ) {
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision_id ) {
			if( 'function' === typeof on_success ) {
				on_success( request, revision_id );
			}
		};
		Private.item.create( data, own_on_success, on_error );
	};

	/* delete an item given an item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.delete = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.delete( item_id, own_on_success, on_error );
	};

	/* get an item's revisions given an item id */
	/* returns an array of revision objects on success */
	/* returns an error object on error */
	Public.prototype.chronicle = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var begin = ( 'number' === typeof request.begin ) ? request.begin : null );
		var end = ( 'number' === typeof request.end ) ? request.end : null );
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.chronicle( item_id, begin, end, own_on_success, on_error );
	};

	/* delete all revisions for an item given an item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.clear = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.clear( item_id, own_on_success, on_error );
	};

	/* activate the next revision for an item given an item id; active nth next revision for an item given an item id and a count integer */
	/* returns the newly active revision on_success */
	/* returns an error object on error */
	Public.prototype.forward = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var count = ( 'number' === typeof request.count ) ? request.count : null );
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.forward( item_id, count, own_on_success, on_error );
	};

	/* activate the previous revision for an item given an item id; active nth previous revision for an item given an item id and a count integer */
	/* returns the newly active revision on_success */
	/* returns an error object on error */
	Public.prototype.rollback = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var count = ( 'number' === typeof request.count ) ? request.count : null );
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.rollback( item_id, count, own_on_success, on_error );
	};

	/* make the active revision non-public given an item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.draft = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.draft( item_id, own_on_success, on_error );
	};

	/* make the active revision public given an item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.publish = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.item.publish( item_id, own_on_success, on_error );
	};


	/* Revision methods */

	/* store a new revision of a non-published item given an item id and a data object */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.save = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.save( item_id, data, own_on_success, on_error );
	};

	/* store a new revision for an existing published item given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.update = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.update( revision_id, own_on_success, on_error );
	};

	/* make a revision active, given a revision id, for an item with no active revisions */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.activate = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.activate( revision_id, own_on_success, on_error );
	};

	/* make a previous, non-active revision active given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.restore = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.restore( revision_id, own_on_success, on_error );
	};

	/* get a revision given a revision id; get the most recent revision given no revision id  */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.get = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.get( revision_id, own_on_success, on_error );
	};

	/* null out a revision given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.purge = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.purge( revision_id, own_on_success, on_error );
	};

	/* null out all previous revisions given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.coverup = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.coverup( revision_id, own_on_success, on_error );
	};

	/* null out all subsequent revisions given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.expunge = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.expunge( revision_id, own_on_success, on_error );
	};

	/* get the difference between revisions given a base item id and a comparison item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.compare = function( request ) {
		var base_revision_id = ( 'undefined' !== typeof request.base ) ? request.base : null;	
		var comparison_revision_id = ( 'undefined' !== typeof request.comparison ) ? request.comparison : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.utils.diff_obj( revision_id, own_on_success, on_error );
	};

	return new Public();

}() );

