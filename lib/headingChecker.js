var
Stream = require("stream"),
Transform = Stream.Transform,
util = require("util"),
patt = /<heading>((?:(?!<\/url>).)*A([AB])+([A-Za-z]{1}).*?)<\/heading>/;

module.exports = exports = HeadingChecker;
util.inherits( HeadingChecker, Transform );

function HeadingChecker( options ) {
  this.options = options;
  Transform.call( this );
};

HeadingChecker.prototype._transform = function( chunk, encoding, done ) {
  var
  line = chunk.toString(),
  matches = patt.exec( line );

  if ( matches ) {
    this.push( matches.join("|||") + "\n" );
    done();
  } else {
    done();
  }
};
