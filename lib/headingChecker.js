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
  Transform.call( this );
};

HeadingChecker.prototype._transform = function( chunk, encoding, done ) {
  var
  input = chunk.toString(),
  inputPieces = input.split( this.argDelim ),
  file = inputPieces[1],
  filetype = inputPieces[3],
  sport = inputPieces[5],
  line, matches;
  // File is play by play. No need to know the heading
  if ( filetype == "pbp" ) {
    output = [
      "file", file,
      "sport", sport,
      "filetype", filetype
    ];
    this.push( output.join( this.argDelim ) + "\n" );
    done();
  // Unkown type of file. Check the heading.
  } else {
    line = inputPieces[7];
    matches = patt.exec( line );

    // Matched <heading> node
    if ( matches ) {
      var
      output = [
        "file", file,
        "sport", sport,
        "headingNode", matches[0],
        "headingContent", matches[1],
        "secondLetter", matches[2],
        "thirdLetter", matches[3]
      ];
      this.push( output.join( this.argDelim ) + "\n" );
      done();
    // No <heading> node match
    } else {
      output = [
        "file": file
      ];
      this.push( output.join( this.argDelim ) + "\n" );
      done();
    }
  }
};
