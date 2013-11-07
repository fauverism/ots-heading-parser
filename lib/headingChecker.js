var
Stream = require("stream"),
Transform = Stream.Transform,
util = require("util"),
patt = /<heading>((?:(?!<\/heading>).)*A([AB])+([A-Za-z]{1}).*?)<\/heading>/;

module.exports = exports = HeadingChecker;
util.inherits( HeadingChecker, Transform );

function HeadingChecker( options ) {
  this.options = options;
  this.argDelim = this.options.delim || "|||";
  this.outDelim = this.out0 ? "\0" : "\n";
  Transform.call( this );
};

HeadingChecker.prototype._transform = function( chunk, encoding, done ) {
  var
  input = chunk.toString(),
  inputPieces = input.split( this.argDelim ),
  filePos = inputPieces.indexOf("file"),
  skipPos = inputPieces.indexOf("skip"),
  linePos = inputPieces.indexOf("line"),
  line, matches;

  // File is play by play. No need to know the heading
  if ( skipPos >= 0 ) {
    output = [
      "file", inputPieces[filePos+1]
    ];
    this.push( output.join( this.argDelim ) + this.outDelim );
    done();
  // Unkown type of file. Check the heading.
  } else {
    if ( linePos >= 0 ) {
      line = inputPieces[linePos+1];
    }
    matches = patt.exec( line );

    // Matched <heading> node
    if ( matches ) {
      var
      output = [
        "file", inputPieces[filePos+1],
        "headingNode", matches[0],
        "headingContent", matches[1],
        "secondLetter", matches[2],
        "thirdLetter", matches[3]
      ];
      this.push( output.join( this.argDelim ) + this.outDelim );
      done();
    // No <heading> node match. Don't output.
    } else {
      done();
    }
  }
};
