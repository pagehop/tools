'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "addresses tool",function(){
	this.timeout( 10000 );
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
	it( "should change text and displayAddress props", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "afg",
							displayAddress: "The greatest afg ever.",
							address: "http://somewhere.on.the.web.com"
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
							text: "http://somewhere.on.the.web.com",
							displayAddress: "afg",
							address: "http://somewhere.on.the.web.com"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should delete displayText if present", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "afg",
							displayText: "<b>afg</b>",
							displayAddress: "The greatest afg ever.",
							address: "http://somewhere.on.the.web.com"
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
							text: "http://somewhere.on.the.web.com",
							displayAddress: "afg",
							address: "http://somewhere.on.the.web.com"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should skip items without an address", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "dfg"
						},
						{
							text: "afg",
							address: "http://somewhere.on.the.web.com"
						},
						{
							text: "abc",
							displayText: "<b>abc</b>",
							displayAddress: "The worst abc ever.",
							address: "http://somewhere.else.on.the.web.com"
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
							text: "http://somewhere.on.the.web.com",
							displayAddress: "afg",
							address: "http://somewhere.on.the.web.com"
						},
						{
							text: "http://somewhere.else.on.the.web.com",
							displayAddress: "abc",
							address: "http://somewhere.else.on.the.web.com"
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