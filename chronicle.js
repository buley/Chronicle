/* Chronicle */

/* Text content revision control with a concept of staging changes. */

var Chronicle = ( function() {

	/*
	 * Private
	 * Uses singleton pattern
	 */

	var Private = function() {

	};


	Private.default = Private.default || {};

	/* Default success callback */
	Private.default.on_success = function() {
		console.log( 'Success', response );
	};

	/* Default error callback */
	Private.default.on_error = function() {
		console.log( 'Error', response );
	};

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

	Private.objectDiff = function( base_obj, comp_obj ) {
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
							result[ key ][ x ] = Private.objectDiff( base_obj[ key ], comp_obj[ key ] );
						}

					} else {
						if( 'object' === typeof comp_obj[ key ] && 'object' === typeof base_obj[ key ] ) {
							result[ key ] = [ base_obj[ key ], comp_obj[ key ] ];
						}
					}
				} else {
					if( 'object' === typeof comp_obj[ key ] && 'object' === typeof base_obj[ key ] ) {
						result[ key ] = Private.objectDiff( base_obj[ key ], comp_obj[ key ] );
					}
				}
			} 
		}
		return result;
	};

	/* Utils */

	Private.utils = Private.utils || {};

	Private.isArray = function( obj ) {
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

	};

	/* Item methods */

	/* create a new item given a data object */
	/* returns a revision id on success */
	/* returns an error object on error */
	Public.prototype.create = function( request ) {
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		var own_on_success = function( revision_id ) {
			if( 'function' === typeof on_success ) {
				on_success( revision_id );
			}
		};

		Private.item.create( data, on_success, on_error );
	};

	/* delete an item given an item id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.delete = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.delete( item_id, on_success, on_error );
	};

	/* get an item's revisions given an item id */
	/* returns an array of revision objects on success */
	/* returns an error object on error */
	Public.prototype.cronicle = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.( item_id, on_success, on_error );
	};

	/* delete all revisions for an item given an item id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.clear = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.( item_id, on_success, on_error );
	};

	/* activate the next revision for an item given an item id; active nth next revision for an item given an item id and a count integer */
	/* returns the newly active revision on_success */
	/* returns an error object on error */
	Public.prototype.forward = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.( item_id, on_success, on_error );
	};

	/* activate the previous revision for an item given an item id; active nth previous revision for an item given an item id and a count integer */
	/* returns the newly active revision on_success */
	/* returns an error object on error */
	Public.prototype.rollback = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.( item_id, on_success, on_error );
	};

	/* make the active revision non-public given an item id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.private = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
		Private.item.( item_id, on_success, on_error );
	};

	/* make the active revision public given an item id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.publish = function( request ) {
		var item_id = ( 'undefined' !== typeof request.item_id ) ? request.item_id : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};


	/* Revision methods */

	/* store and make active a new revision of a non-published item given a revision id and a data object */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.save = function( request ) {
		var data = ( 'undefined' !== typeof request.data ) ? request.data : null;
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* store a new revision for an existing published item given a revision id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.update = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* make a revision active, given a revision id, for an item with no active revisions */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.publish = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* make a previous, non-active revision active given a revision id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.restore = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* get a revision given a revision id; get the most recent revision given no revision id  */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.get = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* null out a revision given a revision id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.purge = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* null out all previous revisions given a revision id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.coverup = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* null out all subsequent revisions given a revision id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.expunge = function( request ) {
		var revision_id = ( 'undefined' !== typeof request.revision_id ) ? request.revision_id : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	/* get the difference between revisions given a base item id and a comparison item id */
	/* returns nothing on_success */
	/* returns an error object on error */
	Public.prototype.compare = function( request ) {
		var base_revision_id = ( 'undefined' !== typeof request.base ) ? request.base : null;	
		var comparison_revision_id = ( 'undefined' !== typeof request.comparison ) ? request.comparison : null;	
		var on_success = ( 'function' === typeof request.on_success ) ? request.on_success : Private.default.on_success;
		var on_error = ( 'function' === typeof request.on_error ) ? request.on_error : Private.default.on_error;
	};

	return new Public();

}() );

