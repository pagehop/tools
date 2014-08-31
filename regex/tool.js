'use strict';

var currentResults = pagehop.getCurrentResults(),
	regexString = pagehop.getArgument();

if ( !regexString || !currentResults.length ) {
	pagehop.finish( currentResults );
}

var getMatchs = function( text, regexString ) {
	var regex = new RegExp( regexString, "gi" ),
		lastPosition = -1,
		match,
		results = [];

	while(match = regex.exec(text)) {
		if(match.index === lastPosition) {
			regex.lastIndex++;
			continue;
		}

		lastPosition = match.index;

		if ( match[0].length ) {
			results.push( {
				index: match.index,
				length: match[0].length
			} );
		}
	}
	return results;
};

var styleText = function( text, ranges, styles ) {
	var parts = [],
		lastIndex = 0;
	for ( var i = 0; i < ranges.length; i++ ) {
		var range = ranges[i],
			start = range.index,
			end = start + range.length - 1;
		parts = parts.concat( [
			text.substring( lastIndex, start ),
			styles.pre,
			text.substring( start, end + 1 ),
			styles.post
		] );
		lastIndex = end + 1;
	}
	parts.push( text.substring( lastIndex ) );
	return parts.join( "" );
};

var results = [];

for ( var i = 0; i < currentResults.length; i++ ) {
	var item = currentResults[i],
		matchs = getMatchs( item.text, regexString );

	if ( matchs.length ) {
		item.displayText = styleText( item.text, matchs, {
			pre: "<b>",
			post: "</b>"
		} );
		results.push( item );
	}
}

pagehop.finish( results );