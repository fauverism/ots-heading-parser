var
Stream = require("stream"),
Transform = Stream.Transform,
Duplex = Stream.Duplex,
util = require("util"),
path = require("path"),
fs = require("fs"),
split = require("split"),
HeadingChecker = require("./headingChecker");

module.exports = exports = FileReader;
util.inherits( FileReader, Transform );

function FileReader() {
	Transform.call( this );
};

FileReader.prototype._transform = function( chunk, encoding, done ) {
  var
  input = chunk.toString();

  if ( input.indexOf("|") >= 0 ) {
    var inputPieces = input.split("|");
    this.file     = inputPieces[0];
    this.filetype = inputPieces[1];
    this.sport    = inputPieces[2];
    this.inZero   = inputPieces[3];
    this.outZero  = inputPieces[4];
    this.outDelim = this.outZero ? "\0" : "\n";
    this.cleanFileName();

    // Return a readable stream
    var readable = this.readFileIn();
    readable.on( "data", function( fileChunk ) {
      this.push( fileChunk + this.outDelim );
    }.bind( this ) );
    readable.on( "end", function() {
      done();
    });
  } else {
    process.exit();
  }

};

// Set up a resolved path to the file in case arguments came in from options.
// The ots-sn-filename-reader already does this, but input might not come from here.
FileReader.prototype.cleanFileName = function() {
  this.normalized   = path.normalize( this.file );
  this.resolvedPath = path.resolve( process.cwd(), this.normalized );
  this.basename     = path.basename( this.resolvedPath );
};

// Return a readable stream of file contents
FileReader.prototype.readFileIn = function() {
  if ( fs.existsSync( this.resolvedPath ) ) {
    return fs.createReadStream( this.resolvedPath );
  } else {
    process.exit();
  }
};
