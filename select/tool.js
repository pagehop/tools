'use strict';

var argument = pagehop.getArgument(),
	currentResults = pagehop.getCurrentResults(),
	index = parseInt( argument, 10 );

if ( !isNaN( index ) && index >= 0 && index < currentResults.length ) {
	pagehop.setSelection( index );
}
pagehop.finish( currentResults );