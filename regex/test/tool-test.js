'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "regex tool",function(){
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
	} );
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
	} );
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
					argument = "[0-9]+",
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
	} );
	it( "shouldn't fall into infinite loop when matching the 'empty string'", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						}
					],
					hops = [],
					argument = "[0-9]*",
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
	} );
	it( "shouldn't cut non matched parts", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "test this"
						}
					],
					hops = [],
					argument = "test",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "test this",
							displayText: "<b>test</b> this"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should be case-insensitive", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "test"
						}
					],
					hops = [],
					argument = "Test",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "test",
							displayText: "<b>test</b>"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should mark matches with <b></b>", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						}
					],
					hops = [],
					argument = "[a-z]*",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "dfg",
							displayText: "<b>dfg</b>"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	after( function(done) {
		test.finalize( done );
	} );
});