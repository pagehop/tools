/* jshint evil: true */
/* jshint -W030 */

'use strict';

var should = require("should"),
	fs = require('fs'),
	pathUtils = require('path');

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "links tool",function() {
	this.timeout( 10000 );
	before( function(done) {
		test.init( done );
	} );
	it( "returns items as an empty array if no initial results", function(done) {
		test.tool(
			pathToTool,
			function() {
				var currentResults = [],
					hops = [],
					argument = null,
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
	it( "returns initial results if selected item has no address", function(done) {
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							address: "http://google.com",
							text: "Google"
						},
						"this is the selected item"
					],
					hops = [],
					argument = null,
					selection = 1,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							address: "http://google.com",
							text: "Google"
						},
						"this is the selected item"
					],
					hops: [],
					selection: 1
				} );
				done();
			}
		);
	} );
	it( "handles error", function(done) {
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							address: "http://google.com",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function() {
								return {
									fail: function(errorCallback) {
										errorCallback( null, null, "someError" );
									}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(error) {
				should.exist( error );
				error.should.equal( "someError" );
				done();
			}
		);
	} );
	it( "successfully scrapes links from the selected page", function(done) {
		var nonProtocolPagePath = pathUtils.resolve( __dirname, "page.html" ),
			page = fs.readFileSync( nonProtocolPagePath, "utf-8" );
		test.tool(
			pathToTool,
			new Function( "(" + function(page) {
				var currentResults = [
						"item1",
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 1,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback(page);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( " + JSON.stringify( page ) + " );" ),
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							address: "http://tsenkov.net/",
							text: "Tsenkov.NET"
						},
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops: [ {
						text: "Google",
						address: "http://google.com/"
					} ],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "successfully scrapes php.net", function(done) {
		var nonProtocolPagePath = pathUtils.resolve( __dirname, "php-net.html" ),
			page = fs.readFileSync( nonProtocolPagePath, "utf-8" );
		test.tool(
			pathToTool,
			new Function( "(" + function(page) {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback(page);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( " + JSON.stringify( page ) + " );" ),
			function(results) {
				should.exist( results );
				results.items.length.should.equal( 137 );
				done();
			}
		);
	} );
	it( "redirects on statuses 301-303, 305, 307", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					redirectAddress = "http://othersite.com",
					finalRedirectAddress = "http://andanothersite.com",
					statuses = [ "300", "301", "302", "303", "305", "307" ],
					xhr = {
						getResponseHeader: function() {
							return statuses.length ? redirectAddress : finalRedirectAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === finalRedirectAddress ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", statuses.shift(), xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to a different domain", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					wikiAddress = "http://en.wikipedia.org/wiki/Kubrat_Pulev",
					xhr = {
						getResponseHeader: function() {
							return wikiAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === wikiAddress ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to the same domain", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/123",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					redirectAddress = "/test",
					xhr = {
						getResponseHeader: function() {
							return redirectAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === "http://google.com/test" ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to the root of domain from root (same page)", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					redirectAddress = "/",
					rootOpenedCount = 0,
					xhr = {
						getResponseHeader: function() {
							return redirectAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === "http://google.com/" && ++rootOpenedCount === 2 ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to the root of domain from inner page", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/test",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					redirectAddress = "/",
					xhr = {
						getResponseHeader: function() {
							return redirectAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === "http://google.com/" ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to same inner (non-root) page when passed relatively", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/test",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					pageOpenedCount = 0,
					redirectAddress = "/test",
					xhr = {
						getResponseHeader: function() {
							return redirectAddress;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === "http://google.com/test" && ++pageOpenedCount === 2 ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "redirects to same inner (non-root) page when passed absolutelly", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var address = "http://google.com/test",
					currentResults = [
						{
							address: address,
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					pageOpenedCount = 0,
					xhr = {
						getResponseHeader: function() {
							return address;
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function(url) {
						if ( url === address && ++pageOpenedCount === 2 ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "can redirect 6 times", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					xhr = {
						getResponseHeader: function() {
							return "/";
						}
					},
					pagesCount = 0;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						if ( ++pagesCount === 7 ) {
							pagehop.finish( true );
						} else {
							return {
								done: function(successCallback) {
									successCallback("", "300", xhr);
									return {
										fail: function() {}
									};
								}
							};
						}
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(result) {
				should.exist( result );
				result.should.be.ok;
				done();
			}
		);
	} );
	it( "finishes with error if too many redirects", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop,
					xhr = {
						getResponseHeader: function() {
							return "/";
						}
					};

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback("", "300", xhr);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( );" ),
			function(error) {
				should.exist( error );
				error.type.should.equal( "LinksToolError" );
				error.message.toLowerCase().indexOf( "too many redirects" ).should.not.equal( -1 );
				done();
			}
		);
	} );
	it( "doesn't return links without text", function(done) {
		var nonProtocolPagePath = pathUtils.resolve( __dirname, "page2.html" ),
			page = fs.readFileSync( nonProtocolPagePath, "utf-8" );
		test.tool(
			pathToTool,
			new Function( "(" + function(page) {
				var currentResults = [
						"item1",
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 1,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback(page);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( " + JSON.stringify( page ) + " );" ),
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops: [ {
						text: "Google",
						address: "http://google.com/"
					} ],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "strips new lines, whitespaces and tabs", function(done) {
		var nonProtocolPagePath = pathUtils.resolve( __dirname, "page3.html" ),
			page = fs.readFileSync( nonProtocolPagePath, "utf-8" );
		test.tool(
			pathToTool,
			new Function( "(" + function(page) {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback(page);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( " + JSON.stringify( page ) + " );" ),
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "Purple Jar. Is the best.",
							address: "http://purplejar.net/"
						}
					],
					hops: [ {
						text: "Google",
						address: "http://google.com/"
					} ],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "doesn't break when no items in the currentResults", function(done) {
		test.tool(
			pathToTool,
			new Function( "(" + function() {
				var currentResults = [],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			} + ")();" ),
			function(results) {
				should.exist( results );
				results.items.length.should.be.exactly( 0 );
				done();
			}
		);
	} );
	it( "doesn't lose hops", function(done) {
		var nonProtocolPagePath = pathUtils.resolve( __dirname, "page4.html" ),
			page = fs.readFileSync( nonProtocolPagePath, "utf-8" );
		test.tool(
			pathToTool,
			new Function( "(" + function(page) {
				var currentResults = [
						{
							address: "http://google.com/",
							text: "Google"
						}
					],
					hops = ["fakeHop"],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				window.$ = function( jQuery ) {
					jQuery.get = function() {
						return {
							done: function(successCallback) {
								successCallback(page);
								return {
									fail: function() {}
								};
							}
						};
					};
					return jQuery;
				};

				pagehop.init( currentResults, hops, argument, selection );
			} + ")( " + JSON.stringify( page ) + " );" ),
			function(results) {
				should.exist( results );
				results.hops.should.eql( [
					"fakeHop",
					{
						address: "http://google.com/",
						text: "Google"
					}
				] );
				done();
			}
		);
	} );
	after( function(done) {
		test.finalize( done );
	} );
} );