'use strict';

var currentResults = pagehop.getCurrentResults(),
	results = [];

for ( var i = 0; i < currentResults.length; i++ ) {
	var item = currentResults[i];
	if ( item.address ) {
		item.displayAddress = item.text;
		item.text = item.address;
		delete item.displayText;
		results.push( item );
	}
}

pagehop.finish( results );