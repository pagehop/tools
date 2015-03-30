'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "select tool",function(){
	this.timeout( 10000 );
	before( function(done) {
		test.init( done );
	} );
	it( "doesn't select index if argument is not a number", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "NaN",
					selection = 1,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				// if the initialResults, then setSelection wasn't called
				results.should.eql( {
					items: [ 1, 2 ],
					hops: [],
					selection: 1
				} );
				done();
			}
		);
	});
	it( "doesn't select index if argument is less than 0", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "-1",
					selection = 1,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				// if the initialResults, then setSelection wasn't called
				results.should.eql( {
					items: [ 1, 2 ],
					hops: [],
					selection: 1
				} );
				done();
			}
		);
	});
	it( "doesn't select index if no results yet", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [],
					hops = [],
					argument = "0",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.setSelection = function() {
					pagehop.finish( [ "called" ] );
				};

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				// if the initialResults, then setSelection wasn't called
				results.items.should.not.eql( [ "called" ] );
				done();
			}
		);
	});
	it( "doesn't select index if argument is bigger than the last index", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "2",
					selection = 1,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				// if the initialResults, then setSelection wasn't called
				results.should.eql( {
					items: [ 1, 2 ],
					hops: [],
					selection: 1
				} );
				done();
			}
		);
	});
	it( "selects an index, even if new selection is the same as current", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "1",
					selection = 1,
					pagehop = window.pagehop;

				pagehop.setSelection = function() {
					pagehop.finish( [ "called" ] );
				};

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.items.should.eql( [ "called" ] );
				done();
			}
		);
	});
	it( "selects an index, even if the argument has starting or trailing whitespaces", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "	1 ",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [ 1, 2 ],
					hops: [],
					selection: 1
				} );
				done();
			}
		);
	});
	it( "selects index if existing and !== current", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [ 1, 2 ],
					hops = [],
					argument = "0",
					selection = 1,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [ 1, 2 ],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	});
	after( function(done) {
		test.finalize( done );
	} );
});