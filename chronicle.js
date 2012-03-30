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

	/* Default complete callback */
	Private.default.on_complete = function( response ) {
		console.log( 'Complete', response );
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
				key: 'id'
				, 'incrementing': true
				, 'unique': true
			}
			, 'modified': false
			, 'created': false
		};

		InDB.install( {
			database: db_name
			, store: Private.revisions.table_name
			, indexes: indexes
			, on_success: own_on_success
			, on_error: own_on_error
		} );

	};

	Private.revision.delete = function( item_id, revision_id, own_on_success, own_on_error ) {

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

		Private.revision.modify( item_id, revision_id, { data: null }, own_on_success, own_on_error );

	};

	Private.revision.get = function( item_id, revision_id, on_success, on_error ) {

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
			index: index
			, key: key
			, expecting: expecting
			, on_success: own_on_success
			, on_error: own_on_error
			, properties: properties
			, store: store
			, database: db_name
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
			results.push( response );
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );

	};

	Private.revisions.compare = function( base_id, comparison_id, on_success, on_error ) {
		var own_on_success = function( base ) {
			var own_inner_on_success = function( comparison ) {
				if( 'function' === typeof on_success ) {
					on_success( Private.utils.diff_obj( base, comparison ) );
				}
			};
			Private.revision.get( comparison_id, own_inner_on_success, on_error );
		};
		Private.revision.get( base_id, own_on_success, on_error );
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

		Private.revision.modify( item_id, revision_id, { visible: true }, own_on_success, own_on_error );

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

		Private.revision.modify( item_id, revision_id, { visible: false }, own_on_success, own_on_error );

	};

	Private.revision.activate = function( item_id, revision_id, on_success, on_error ) {

		/* Callbacks */
		var own_on_success = function( revision ) {
			var result_on_success = function() {
				if( 'function' === typeof on_success ) {
					on_success( revision );
				}
			};
			if( 'undefined' !== typeof revision && null !== revision ) {
				Private.item.modify( item_id, { revision_id: revision.id, data: revision.data, modified: new Date().getTime() }, result_on_success, own_on_error ); 
			} else {
				own_on_error( revision );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		Private.revision.get( item_id, revision_id, own_on_success, own_on_error ); 

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
			, direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
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
	
		var own_data = {
			data: data
			, modified: new Date().getTime()
			, created: new Date().getTime()
			, item_id: item_id
		};

		var return_data = {
			data: data
			, modified: own_data.modified
			, created: own_data.created
			, item_id: item_id
		};

	
		/* Callbacks */

		var own_on_success = function( value ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'Private.revision.create success', value );
			}
			/* Callback */
			if( 'function' == typeof on_success ) {
				return_data.id = value;
				on_success( return_data );
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
			'data': own_data
			, on_success: own_on_success
			, on_error: own_on_error
			, store: store
			, database: db_name
		} );

	};

	Private.revision.modify = function( item_id, revision_id, data, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		if( 'undefined' === typeof data ) {
			throw new Error( 'Private.revision.modify: Data cannot be empty' );
			return;
		}

		if( 'undefined' === typeof store || null === store ) {
			throw new Error( 'Private.revision.modify: Store cannot be empty' );
			return null;
		}

		/* Defaults */
	
		//

		/* Callbacks */

		var own_on_success = function( value ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'Private.revision.modify success', value );
			}
			/* Callback */
			if( 'function' == typeof on_success ) {
				on_success( value );
			}
		};

		var own_on_error = function( context ) {
			/* Debug */
			if( !!debug ) {
				console.log( 'Private.revision.modify error', context );
			}
			/* Callback */
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': data
			, key: item_id
			, index: null
			, on_success: own_on_success
			, on_error: own_on_error
			, store: store
			, database: db_name
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
				key: 'id'
				, 'incrementing': true
				, 'unique': true
			}
			, 'modified': false
			, 'created': false
		};

		InDB.install( {
			store: Private.items.table_name
			, database: db_name
			, indexes: indexes
			, on_success: own_on_success
			, on_error: own_on_error
		} );

	};

	Private.item.create = function( id, data, on_success, on_error ) {	

		/* Setup */

		var store = Private.items.table_name;

		var own_data = {
			data: data
			, ublished: false
			, visible: false
			, modified: new Date().getTime()
			, created: new Date().getTime()
		};

		if( 'undefined' !== typeof id && null !== id ) {
			own_data.id = id;
		}
		var result = {
			id: 0
			, data: data
			, published: false
			, visible: false
			, modified: own_data.modified
			, created: own_data.created
			, type: 'item'
		};

		/* Callbacks */

		var own_on_success = function( item_id ) {
			result.id = item_id;
			console.log('Private.item.create own_on_success',result);

			var inner_on_success = function( revision ) {
				result.revision_id = revision.id;
				var result_on_success = function() {
					if( 'function' === typeof on_success ) {
						on_success( result );
					}
				};
				console.log('Private.item.create inner_on_success',result.id,revision.id);
				Private.revision.activate( result.id, revision.id, result_on_success, on_error );
			};
			Private.revision.create( result.id, data, inner_on_success, on_error );
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.add( {
			'data': own_data
			, on_success: own_on_success
			, on_error: own_on_error
			, store: store
			, database: db_name
		} );

	};

	Private.item.modify = function( item_id, data, on_success, on_error ) {	

		/* Setup */

		var store = Private.items.table_name;

		/* Callbacks */

		var own_on_success = function( item_id ) {
			console.log('Private.item.modify own_on_success',item_id);
			if( 'function' == typeof on_success ) {
				on_success( item_id );
			}		
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.update( {
			'data': data
			, key: item_id
			, index: null
			, on_success: own_on_success
			, on_error: own_on_error
			, store: store
			, database: db_name
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
			index: index
			, key: key
			, expecting: expecting
			, on_success: own_on_success
			, on_error: own_on_error
			, properties: properties
			, store: store
			, database: db_name
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
			results.push( response );
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );


	};

	Private.item.save = function( item_id, data, on_success, on_error ) {	

		/* Setup */

		var store = Private.items.table_name;
		/* Callbacks */

		var own_on_success = function( revision ) {
			console.log('Private.item.save own_on_success', revision );
			if( 'function' === typeof on_success ) {
				on_success( revision );
			}
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */
		
		Private.revision.create( item_id, data, own_on_success, own_on_error );
		
	};



	Private.item.update = function( item_id, data, on_success, on_error ) {	

		/* Callbacks */

		var own_on_success = function( revision  ) {
			var result_on_success = function() {
				if( 'function' === typeof on_success ) {
					on_success( revision );
				}
			};
			console.log('Private.item.update own_on_success item_id',item_id,'revision',revision );
			Private.revision.activate( item_id, revision.id, result_on_success, on_error );
		};

		var own_on_error = function( context ) {
			if( 'function' == typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */
		
		Private.revision.create( item_id, data, own_on_success, own_on_error );
		
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
		Private.item.modify( item_id, { revision_id: value }, on_success, on_error );
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
		Private.item.modify( item_id, { revision_id: value }, on_success, on_error );
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
			results.push( response );
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );

	};

	Private.items.list = function( passed_index, begin, end, descending, on_success, on_error ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Defaults */

		var index = 'modified';
		if( 'id' === passed_index ) {
			index = 'id';
		} else if( 'modified' === passed_index ) {
			index = 'modified';
		} else if( 'created' === passed_index ) {
			index = 'created';
		}
		var limit = null;
		var direction = ( true === descending ) ? InDB.cursor.direction.previous() : InDB.cursor.direction.next();
		var key = null;
		var left = ( 'undefined' !== typeof begin ) ? begin : null;
		var properties = null;
		var right = ( 'undefined' !== typeof end ) ? end : null;
		var left_inclusive = null;
		var right_inclusive = null;
		var expecting = null;

		/* Callbacks */

		var errors = [];
		var results = [];

		var own_on_success = function( response ) {
			var attrs = 0, attr;
			for( attr in response ) {
				if( response.hasOwnProperty( attr ) ) {
					attrs = 1;
					break;
				}
			}
			if( 'undefined' !== typeof response && null !== response && attrs > 0 ) {
				results.push( response );
			}
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, properties: properties
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );

	};

	Private.revisions.list = function( item_id, passed_index, begin, end, descending, on_success, on_error, on_complete ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index;
		if( 'id' === passed_index ) {
			index = 'id';
		} else if( 'modified' === passed_index ) {
			index = 'modified';
		} else if( 'created' === passed_index ) {
			index = 'created';
		}
		var limit = null;
		var direction = ( true === descending ) ? InDB.cursor.direction.previous() : InDB.cursor.direction.next();
		var key = null;
		var left = begin;
		var properties = null;
		var right = end;
		var left_inclusive = null;
		var right_inclusive = null;
		var expecting = { item_id: item_id };

		/* Callbacks */

		var errors = [];
		var results = [];

		var own_on_success = function( response ) {
			var attrs = 0, attr;
			for( attr in response ) {
				if( response.hasOwnProperty( attr ) ) {
					attrs = 1;
					break;
				}
			}
			if( 'undefined' !== typeof response && null !== response && attrs > 0 ) {
				results.push( response );
			}
			if( 'function' === typeof on_success ) {
				on_success( response );
			}
		};

		var own_on_complete = function() {
			if( errors.length > 0 ) {
				if( 'function' === typeof on_error ) {
					on_error( errors, results );
				}
			} else {
				if( 'function' === typeof on_complete ) {
					on_complete( results );
				}
			}

		};

		var own_on_error = function( error ) {
			errors.push( error );
		};

		/* Request */

		InDB.cursor.get( {
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, properties: properties
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );

	};


	Private.item.delete = function( item_id, on_success, on_error, on_complete ) {

		/* Setup */

		var store = Private.items.table_name;

		/* Callbacks */

		var own_on_success = function( value ) {

			var result_on_success = function() {
				if( 'function' === typeof on_success ) {
					on_success( value );
				}
			};

			var result_on_complete = function( context ) {
				if( 'function' === typeof on_error ) {
					on_error( context );
				}
			};

			/* Request */

			InDB.cursor.delete( {
				direction: InDB.cursor.direction.next()
				, expecting: null
				, key: item_id
				, index: 'item_id'
				, left: 0
				, left_inclusive: true
				, limit: null
				, on_success: result_on_success
				, on_complete: result_on_complete
				, on_error: own_on_error
				, right: null
				, right_inclusive: null
				, store: store
			} );

		};

		var own_on_error = function( context ) {
			if( 'function' === typeof on_error ) {
				on_error( context );
			}
		};

		/* Request */

		InDB.delete( {
			index: null
			, key: item_id
			, on_success: own_on_success
			, on_error: own_on_error
			, store: store
			, database: db_name
		} );

	};

	Private.revisions.expunge = function( revision_id, count, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = ( 'number' === typeof count ) ? count : null;
		var direction = InDB.cursor.direction.next();
		var key = null;
		var left = 0;
		var right = revision_id;
		var left_inclusive = true;
		var right_inclusive = true;

		var results = [];
		var errors = [];
		var expecting = null;

		/* Callbacks */

		var own_on_success = function( response ) {
			results.push( response );
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
		} );

	};

	Private.revisions.coverup = function( revision_id, count, on_success, on_error ) {

		/* Setup */

		var store = Private.revisions.table_name;

		/* Defaults */

		var index = 'item_id';
		var limit = ( 'number' === typeof count ) ? count : null;
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
			results.push( response );
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
			direction: direction
			, expecting: expecting
			, key: key
			, index: index
			, left: left
			, left_inclusive: left_inclusive
			, limit: limit
			, on_success: own_on_success
			, on_complete: own_on_complete
			, on_error: own_on_error
			, right: right
			, right_inclusive: right_inclusive
			, store: store
			, database: db_name
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
		InDB = new IDB( { database: db_name, version: db_ver, on_upgrade_needed: function() {
			Public.prototype.install();
		} } );
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
	/* returns the item object (w/item_id and revision_id attributes) on success */
	/* returns an error object on error */
	Public.prototype.create = function( request ) {
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( item_id, revision_id ) {
			if( 'function' === typeof on_success ) {
				on_success( item_id, revision_id );
			}
		};
		Private.item.create( id, data, own_on_success, on_error );
	};

	/* delete (perminant purge) an item given an item id */
	/* overloaded, delete (purge) a revision given a item_id and revision_id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.delete = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_complete = ( 'function' === typeof request.on_complete ) ? request.on_complete : Private.default.on_complete;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success();
			}
		};
		var own_on_complete = function() {
			if( 'function' === typeof on_complete ) {
				on_complete();
			}
		};
		if( null !== revision_id ) {
			Private.revision.delete( item_id, revision_id, own_on_success, on_error );
		} else {
			Private.item.delete( item_id, own_on_success, on_error, own_on_complete );
		}
	};

	/* get an items
	 * overloaded, get an item's revisions given an item id
	 * requires an index (modified, created, id) 
	 * takes an optional filter function
	 * returns an array of either item or revision objects on complete 
	 * returns each item or revision object on success 
	 * returns an error object on error */
	Public.prototype.list = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_complete = ( 'function' === typeof request.on_complete ) ? request.on_complete : Private.default.on_complete;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var begin = ( 'number' === typeof request.begin ) ? request.begin_id : null;
		var end = ( 'number' === typeof request.end ) ? request.end : null;
		var index = ( 'string' === typeof request.index ) ? request.index : null;
		var descending = ( 'boolean' === typeof request.descending ) ? request.descending : false;
		var own_on_success = function( item ) {
			if( 'function' === typeof on_success ) {
				on_success( item );
			}
		};
		var own_on_complete = function( list ) {
			if( 'function' === typeof on_complete ) {
				on_complete( list );
			}
		};
		if( null === item_id ) {
			Private.items.list( index, begin, end, descending, own_on_success, on_error, own_on_complete );
		} else {
			Private.revisions.list( item_id, index, begin, end, descending, own_on_success, on_error, own_on_complete );
		}
	};

	/* delete all revisions for an item given an item id */
	/* returns nothing on_success */
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

	//TODO: Implementation check was skipped
	/* activate the next revision for an item given an item id; active nth next revision for an item given an item id and a count integer */
	/* returns the newly active revision object on_success */
	/* returns an error object on error */
	Public.prototype.forward = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var count = ( 'number' === typeof request.count ) ? request.count : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision ) {
			if( 'function' === typeof on_success ) {
				on_success( revision );
			}
		};
		Private.item.forward( item_id, count, own_on_success, on_error );
	};

	//TODO: Implementation check was skipped
	/* activate the previous revision for an item given an item id; active nth previous revision for an item given an item id and a count integer */
	/* returns the newly active revision on_success */
	/* returns an error object on error */
	Public.prototype.rollback = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var count = ( 'number' === typeof request.count ) ? request.count : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision ) {
			if( 'function' === typeof on_success ) {
				on_success( revision );
			}
		};
		Private.item.rollback( item_id, count, own_on_success, on_error );
	};

	/* store a new revision for an existing published item given an item id but do not activate it */
	/* returns the revison object on_success */
	/* returns an error object on error */
	Public.prototype.save = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision_id ) {
			if( 'function' === typeof on_success ) {
				on_success( revision_id );
			}
		};
		Private.item.save( item_id, data, own_on_success, on_error );
	};

	/* store a new revision for an existing published item given data and an item id and activate it */
	/* returns the revision object on_success */
	/* returns an error object on error */
	Public.prototype.update = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision_id ) {
			if( 'function' === typeof on_success ) {
				on_success( revision_id );
			}
		};
		Private.item.update( item_id, data, own_on_success, on_error );
	};

	/* make a revision active, given an item id and revision id, for an item with no active revisions */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.activate = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision ) {
			if( 'function' === typeof on_success ) {
				on_success( revision );
			}
		};
		Private.revision.activate( item_id, revision_id, own_on_success, on_error );
	};

	/* make a previous, non-active revision active given an item id and a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.restore = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		Private.revision.restore( item_id, revision_id, own_on_success, on_error );
	};

	//TODO: Implementation check was skipped
	/* get a revision given an item id and a revision id; get the most recent revision given no revision id  */
	/* returns the item or revision object on_success */
	/* returns an error object on error */
	Public.prototype.read = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		if( 'undefined' !== typeof revision_id && null !== revision_id ) {
			Private.revision.get( item_id, revision_id, own_on_success, on_error );
		} else {
			Private.item.get( item_id, own_on_success, on_error );
		}
	};

	/* null out all previous revisions given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.coverup = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var count = ( 'number' === typeof request.count ) ? request.count : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var on_complete = ( 'function' === typeof request.on_complete ) ? request.on_complete : Private.default.on_complete;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		var own_on_complete = function() {
			if( 'function' === typeof on_complete ) {
				on_complete();
			}
		};
		Private.revisions.coverup( revision_id, count, own_on_success, on_error, own_on_complete );
	};

	/* null out all subsequent revisions given a revision id */
	/* returns the request object on_success */
	/* returns an error object on error */
	Public.prototype.expunge = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var count = ( 'number' === typeof request.count ) ? request.count : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var on_complete = ( 'function' === typeof request.on_complete ) ? request.on_complete : Private.default.on_complete;
		var own_on_success = function() {
			if( 'function' === typeof on_success ) {
				on_success( request );
			}
		};
		var own_on_complete = function() {
			if( 'function' === typeof on_complete ) {
				on_complete();
			}
		};
		Private.revisions.expunge( revision_id, count, own_on_success, on_error, own_on_complete );
	};

	/* get the difference between revisions given a base item id and a comparison item id */
	/* returns the object difference on_success */
	/* returns an error object on error */
	Public.prototype.compare = function( request ) {
		var base_revision_id = ( 'undefined' !== typeof request.base ) ? request.base : null;	
		var comparison_revision_id = ( 'undefined' !== typeof request.comparison ) ? request.comparison : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( diff ) {
			if( 'function' === typeof on_success ) {
				on_success( diff  );
			}
		};
		Private.revisions.compare( base_revision_id, comparison_revision_id, own_on_success, on_error );
	};

	return new Public();

}() );

