/* jshint -W099 */

'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "fuzzy tool",function(){
	before( function(done) {
		test.init( done );
	} );
	it( "should set items to empty array if no results", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [],
					hops = [],
					argument = "xyz",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	});
	it( "should set items to original results if argument is null", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						},
						{
							text: "afg"
						},
						{
							text: "abc"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "dfg"
						},
						{
							text: "afg"
						},
						{
							text: "abc"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	});
	it( "should set items to empty array if no matches", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						},
						{
							text: "afg"
						},
						{
							text: "abc"
						}
					],
					hops = [],
					argument = "xyz",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	});
	it( "should return items with formated displayText if matches are found", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						},
						{
							text: "afg"
						},
						{
							text: "abc"
						},
						{
							text: "affbffcff"
						}
					],
					hops = [],
					argument = "abc",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "abc",
							displayText: "<b>a</b><b>b</b><b>c</b>"
						},
						{
							text: "affbffcff",
							displayText: "<b>a</b>ff<b>b</b>ff<b>c</b>ff"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	});
	it( "should not take spaces into consideration", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						},
						{
							text: "afg"
						},
						{
							text: "abc"
						},
						{
							text: "affbffcff"
						}
					],
					hops = [],
					argument = "a   b 	c",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "abc",
							displayText: "<b>a</b><b>b</b><b>c</b>"
						},
						{
							text: "affbffcff",
							displayText: "<b>a</b>ff<b>b</b>ff<b>c</b>ff"
						}
					],
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