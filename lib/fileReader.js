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

function FileReader( options ) {
  this.options = options;
  this.argDelim = this.options.delim || "|||";
	Transform.call( this );
};

FileReader.prototype._transform = function( chunk, encoding, done ) {
  var
  input = chunk.toString(),
  ouput;
  if ( input.indexOf( this.argDelim ) >= 0 ) {
    var inputPieces = input.split( this.argDelim );
    this.file     = inputPieces[1];
    this.filetype = inputPieces[3];
    this.sport    = inputPieces[5];
    this.inZero   = inputPieces[7];
    this.outZero  = inputPieces[9];
    this.outDelim = this.outZero ? "\0" : "\n";
    this.cleanFileName();

    if ( this.filetype == "pbp" ) {
      output = [
        "file", this.file,
        "filetype", this.filetype,
        "sport", this.sport
      ];
      // This output goes to the heading parser.
      this.push( output.join( this.argDelim ) );
      done();
    } else {
      // Return a readable stream
      var
      readable = this.readFileIn()
        .pipe( split() )
        .on( "data", function( line ) {
          output = [
            "file", this.file,
            "filetype", this.filetype,
            "sport", this.sport,
            "line", line+""
          ];
          this.push( output.join( this.argDelim ) );
          this.push( line );
        }.bind( this ))
        .on( "error", function( err ) {
          done();
        });
      readable.on( "end", function() {
        done();
      });
    }

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
