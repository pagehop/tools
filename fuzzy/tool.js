'use strict';

var fuzzy = require("fuzzy");

var currentResults = pagehop.getCurrentResults(),
	searchStr = pagehop.getArgument();

if ( !searchStr ) {
	pagehop.finish( currentResults );
} else {
	searchStr = searchStr.replace( /(\s)|(\t)/g, "" );

	var options = {
		pre: '<b>',
		post: '</b>',

		extract: function(item) {
			return item.text;
		}
	};

	var filtered = fuzzy.filter( searchStr, currentResults, options );

	// Map the results to the html we want generated
	var results = filtered.map(function(entry){
		var originalItem = entry.original;
		originalItem.displayText = entry.string;
		return originalItem;
	} );

	pagehop.finish( results );
}