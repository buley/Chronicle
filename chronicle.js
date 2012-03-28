/* Chronicle */

/* Object revision control backed by IndexedDB */

var Chronicle = ( function() {

	/*         */
	/* Private */
	/*         */

	/* Uses singleton pattern */

	/* Dependencies */
	

	var version = 1;
	var InDB;
	var debug = true;
	var db_name = 'Chronicle';
	var db_ver = 1;
	var Private = function() {};

	/* Defaults */

	Private.default = Private.default || {};

	/* Default success callback */
	Private.default.on_success = function( response ) {
		console.log( 'Success', response );
	};

	/* Default error callback */
	Private.default.on_error = function( response ) {
		console.log( 'Error', response );
	};

	/* Database */

	Private.db = {};
	
	Private.database = Private.database || {};

	Private.install = function( on_success, on_error ) {

		var count = 0;		
		var results = [];
		var errors = [];

		var own_on_success = function( response ) {
			count += 1;
			results.push( response );
			if( 2 === count ) {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}
		};

		var own_on_error = function( error ) {
			count += 1;
			errors.push( error );
			if( 2 === count ) {
				if( 'function' === typeof on_error ) {
					on_error( errors, results );
				}
			}
		};

		var step_one = function() {
			Private.revisions.install( own_on_success, own_on_error );	
		};
		
		Private.items.install( step_one, own_on_error );


	};

	/* Revisions */

	Private.revision = Private.revision || {};
	Private.revisions = Private.revisions || {};
	Private.revisions.table_name = 'revisions';

	Private.revisions.install = function( on_success, on_error ) {

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
			, 'previous': false
			, 'next': false
			, 'modified': false
		};

		InDB.install( {
			database: 'Chronicle'
			, store: Private.revisions.table_name
			, indexes: indexes
			, on_success: own_on_success
			, on_error: own_on_error
		} );

	};

	Private.revision.purge = function() {

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		Private.revision.update( revision_id, { data: null }, own_on_success, own_on_error );

	};

	Private.revision.get = function( revision_id, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = null;
		var key = revision_id;
		var properties = null;
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.get( {
			'index': index
			, 'key': key
			, 'expecting': expecting
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'properties': properties
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.revisions.get = function( item_id, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = item_id;
		var left = null;
		var right = null;
		var left_inclusive = null;
		var right_inclusive = null;

		var results = [];
		var errors = [];
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( error, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */
	
		InDB.cursor.get( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.revision.trash = function( item_id, revision_id, on_success, on_error ) {

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		Private.revision.update( item_id, revision_id, { trashed: true }, own_on_success, own_on_error );

	};

	Private.revision.restore = function( item_id, revision_id, on_success, on_error ) {

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		Private.revision.update( item_id, revision_id, { trashed: false }, own_on_success, own_on_error );

	};

	Private.revision.activate = function( revision_id, on_success, on_error ) {

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		Private.revision.get( revision_id, function( get_result ) {
				var item_id = get_result.id;
				Private.item.update( item_id, { revision_id: revision_id, modified: new Date().getTime() }, own_on_success, own_on_error ); 
		}, function( get_error ) {
				if( 'function' === typeof own_on_error ) {
					own_on_error( get_error );
				}
		} );

	};

	Private.revisions.update = function( item_id, revision_id, data, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = item_id;
		var left = null;
		var right = null;
		var left_inclusive = null;
		var right_inclusive = null;

		var expecting = function( old ) {
			return ( 'undefined' === old.id || null === old.id || revision_id !== old.id ) ? false : old;
		};

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */
	
		InDB.cursor.update( {
			'data': data
			, 'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	//TODO: should return a revision id
	Private.revision.update = function( item_id, data, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var key = item_id;

		//filters out any matching revisions that aren't the one we're looking for
		var expecting = function( old ) {
			return ( 'undefined' === old.id || null === old.id || item_id !== old.id ) ? false : old;
		};

		/* Callbacks */

		var own_on_success = function( value ) {
			/* Callback */
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			/* Callback */
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.update( {
			'data': data
			, 'index': index
			, 'key': key
			, 'expecting': expecting
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'store': store
			, database: 'Chronicle'
		} );

	};




	Private.revision.create = function( item_id, data, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		if( 'undefined' === typeof data ) {
			throw new Error( 'Private.revision.create: Data cannot be empty' );
			return;
		}

		if( 'undefined' === typeof store || null === store ) {
			throw new Error( 'Private.revision.create: Store cannot be empty' );
			return null;
		}

		/* Defaults */
	
		//

		/* Callbacks */

		var own_on_success = function( value ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'Private.revision.create success', value );
			}
			/* Callback */
			if( 'function' == typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'Private.revision.create error', context );
			}
			/* Callback */
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': data
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'store': store
			, database: 'Chronicle'
		} );

	};


	/* Items */

	Private.item = Private.item || {};
	Private.items = Private.items || {};
	Private.items.table_name = 'items';

	Private.items.install = function( on_success, on_error ) {

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
			, 'modified': false
		};

		InDB.install( {
			store: Private.items.table_name
			, database: db_name
			, indexes: indexes
			, on_success: own_on_success
			, on_error: own_on_error
		} );

	};

	Private.item.create = function( data, on_success, on_error ) {	

		/* Setup */

		var store = Private.items.table_name;

		var own_data = {
			revision_id: 0
			, visible: false
			, trashed: false
			, modified: new Date().getTime()
		};

		/* Callbacks */

		var own_on_success = function( item_id ) {
			console.log('Private.item.create own_on_success',item_id);
			var inner_on_success = function( revision_id ) {
				console.log('Private.item.create inner_on_success',revision_id);
				Private.revision.activate( revision_id, on_success, on_error );
			};
			Private.revision.create( item_id, data, inner_on_success, on_error );
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': own_data
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.item.get = function( item_id, on_success, on_error ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Defaults */

		var index = null;
		var key = item_id;
		var properties = null;

		var expecting = null;

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.get( {
			'index': index
			, 'key': key
			, 'expecting': expecting
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'properties': properties
			, 'store': store
			, database: 'Chronicle'
		} );


	};

	Private.items.get = function( on_success, on_error ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Defaults */

		var index = null;
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = null;
		var left = null;
		var right = null;
		var left_inclusive = null;
		var right_inclusive = null;

		var results = [];
		var errors = [];
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( error, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}
		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */
	
		InDB.cursor.get( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );


	};


	Private.item.update = function( item_id, data, on_success, on_error ) {	

		/* Setup */

		var store = Private.items.table_name;
		/* Callbacks */

		var own_on_success = function( revision_id ) {
			console.log('Private.item.create own_on_success',item_id);
			Private.revision.activate( revision_id, on_success, on_error );
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */
		
		Private.revision.create( item_id, data, own_on_success, own_on_error );
		
	};

	Private.item.publish = function( item_id, on_success, on_error ) {
		Private.item.update( item_id, { visible: true }, on_success, on_error );
	};

	Private.item.draft = function( item_id, on_success, on_error ) {
		Private.item.update( item_id, { visible: false }, on_success, on_error );
	};

	Private.item.forward = function( item_id, count, on_success, on_error ) {
		if( isNaN( count ) ) {
			count = 1;
		}
		var value = function( old ) {
			var type = typeof old;
			if( 'number' === type ) {
				return old + count;
			}
			if( 'string' === type ) {
				var parsed = parseInt( old, 10 );
				if( false === isNaN( parsed ) ) {
					return parsed + count;
				}
			}
			return 1;
		};
		Private.item.update( item_id, value, on_success, on_error );
	};

	Private.item.rollback = function( item_id, count, on_success, on_error ) {
		if( isNaN( count ) ) {
			count = 1;
		}
		var value = function( old ) {
			var type = typeof old;
			if( 'number' === type ) {
				return old - count;
			}
			if( 'string' === type ) {
				var parsed = parseInt( old, 10 );
				if( false === isNaN( parsed ) ) {
					return parsed - count;
				}
			}
			return 1;
		};
		Private.item.update( item_id, value, on_success, on_error );
	};

	Private.item.clear = function( item_id, expecting, on_success, on_error ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = item_id;
		var left = null;
		var right = null;
		var left_inclusive = null;
		var right_inclusive = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( error, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */

		InDB.cursor.delete( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.item.chronicle = function( item_id, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = item_id;
		var left = null;
		var properties = null;
		var right = null;
		var left_inclusive = null;
		var right_inclusive = null;
		var expecting = null;

		/* Callbacks */

		var errors = [];
		var results = [];

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( errors, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */

		InDB.cursor.get( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'properties': properties
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.item.delete = function( item_id, on_success, on_error ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Defaults */

		var index = null;
		var key = item_id;

		/* Callbacks */

		var own_on_success = function( value ) {
			if( 'function' === typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.delete( {
			'index': index
			, 'key': key
			, 'on_success': own_on_success
			, 'on_error': own_on_error
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.item.expunge = function( revision_id, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = null;
		var left = 0;
		var right = revision_id;
		var left_inclusive = true;
		var right_inclusive = false;

		var results = [];
		var errors = [];
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( error, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */
	
		InDB.cursor.delete( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};

	Private.item.coverup = function( revision_id, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = null;
		var direction = InDB.cursor.direction.next();
		var key = null;
		var left = revision_id;
		var right = null;
		var left_inclusive = true;
		var right_inclusive = null;

		var results = [];
		var errors = [];
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( reponse );
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( error, results );
				}
			} else {
				if( 'function' === typeof on_success ) {
					on_success( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */
	
		InDB.cursor.delete( {
			'direction': direction
			, 'expecting': expecting
			, 'key': key
			, 'index': index
			, 'left': left
			, 'left_inclusive': left_inclusive
			, 'limit': limit
			, 'on_success': own_on_success
			, 'on_complete': own_on_complete
			, 'on_error': own_on_error
			, 'right': right
			, 'right_inclusive': right_inclusive
			, 'store': store
			, database: 'Chronicle'
		} );

	};



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
		InDB = new IDB( { database: 'Chronicle', version: db_ver } );
	};

	/* Install */

	/* create an IndexedDB database and object stores */
	/* returns the request object on success */
	/* returns an error object on error */
	Public.prototype.install = function( request ) {
		var on_success = ( 'undefined' !== typeof request && 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'undefined' !== typeof request && 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success();
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
		var begin = ( 'number' === typeof request.begin ) ? request.begin : null;
		var end = ( 'number' === typeof request.end ) ? request.end : null;
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
		var count = ( 'number' === typeof request.count ) ? request.count : null;
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
		var count = ( 'number' === typeof request.count ) ? request.count : null;
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

	/* store a new revision for an existing published item given an item id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.update = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.update( item_id, own_on_success, on_error );
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

