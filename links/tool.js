'use strict';

var selection = pagehop.getSelection(),
	currentResults = pagehop.getCurrentResults(),
	selected = currentResults[ selection ],
	URI = require('URIjs'),
	$ = window.$,
	jQuery = require('jquery-browserify'),
	htmlparser = require("htmlparser2"),
	redirectStatuses = [ "300", "301", "302", "303", "305", "307" ],
	maxRedirects = 6,
	tooManyRedirectsError = "Too many redirects! Links doesn't allow more than " + maxRedirects,
	noRedirectUrlError = "Link returns a status for redirect, but no (or bad) redirect url (Location response header)";

// for tests (to be able to mock jQuery)
if ( $ ) {
	$ = $( jQuery );
} else {
	$ = jQuery;
}

var scrapeUrl = function(url, callback) {
	$.get( url )
		.done( function( html, status, jqXHR ) {
			if ( redirectStatuses.indexOf( status ) !== -1 ) {
				var error = { type: "LinksToolError" };
				if ( maxRedirects-- ) {
					var newUrl = jqXHR.getResponseHeader( "Location" );
					if ( newUrl ) {
						newUrl = URI( newUrl ).absoluteTo( url ).toString();
						if ( newUrl ) {
							return scrapeUrl( newUrl, callback );
						}
					}
					error.message = noRedirectUrlError;
					return callback( error );
				} else {
					error.message = tooManyRedirectsError;
					return callback( error );
				}
			}
			var currentLink,
				links = [];

			var parser = new htmlparser.Parser( {
				onopentag: function(name, attribs) {
					if( name === "a" ){
						currentLink = attribs;
						// console.log( "<a " + JSON.stringify( attribs ).replace( /[\{\}\,]/g, " " ).replace( /\:/g, "=" ) + ">" );
					}
				},
				ontext: function(text){
					if ( currentLink ) {
						if ( currentLink.text ) {
							currentLink.text += " " + text;
						} else {
							currentLink.text = text;
						}
						// console.log("	", text);
					}
				},
				onclosetag: function(tagname){
					if(tagname === "a"){
						if ( currentLink && currentLink.text ) {
							links.push( currentLink );
							currentLink = null;
						}
						// console.log("</a>");
					}
				}
			});
			parser.write(html);
			parser.end();

			var results = [],
				count = links.length;

			for (var i = 0; i < count; i++) {
				var link = links[i],
					address;
				try {
					address = URI( link.href ).absoluteTo( url ).toString();
				} catch(exception) {
					continue;
				}

				var text = link.text
					.trim()
					.replace(/(\n)/g," ")
					.replace(/(\t)/g," ")
					.replace(/\s+/g, " ");

				if ( text ) {
					results.push( {
						text: text,
						address: address
					} );
				}
			}
			callback( null, results );
		} )
		.fail( function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
			callback( error );
		} );
};

if ( selected && selected.address ) {
	scrapeUrl( selected.address, function(error, results) {
		pagehop.setSelection( 0 );
		if ( error ) {
			pagehop.finishWithError( error );
		} else {
			pagehop.getHops().push( {
				text: selected.text,
				address: selected.address
			} );
			pagehop.finish( results );
		}
	} );
} else {
	pagehop.finish( currentResults );
}