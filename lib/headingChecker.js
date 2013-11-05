var
Stream = require("stream"),
Transform = Stream.Transform,
util = require("util"),
patt = /<heading>((?:(?!<\/url>).)*A([AB])+([A-Za-z]{1}).*?)<\/heading>/;

module.exports = exports = HeadingChecker;
util.inherits( HeadingChecker, Transform );

function HeadingChecker( options ) {
  this.options = options;
  this.argDelim = this.options.delim || "|||";
  Transform.call( this );
};

HeadingChecker.prototype._transform = function( chunk, encoding, done ) {
  var
  line = chunk.toString(),
  matches = patt.exec( line );

  if ( matches ) {
    var
    output = [
      "headingNode", matches[0],
      "headingContent", matches[1],
      "secondLetter", matches[2],
      "thirdLetter", matches[3]
    ]
    this.push( output.join( this.argDelim ) + "\n" );
    done();
  } else {
    done();
  }
};
