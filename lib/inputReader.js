var
Stream = require("stream"),
Transform = Stream.Transform,
util = require("util"),
path = require("path"),
fs = require("fs");

module.exports = exports = Reader;

util.inherits( Reader, Transform );

function Reader( options ) {
  this.options = options;
  this.inDelim = this.options.in0 ? "\0" : "\n";
  this.outDelim = this.options.out0 ? "\0" : "\n";
  this._buffer = [];
  Transform.call( this );
  this.checkInput();
};

// Figure out if input is coming from stdin or from command line options or both
Reader.prototype.checkInput = function() {
  if ( this.options.file ) {
    var
    pieces = [
      this.options.file,
      this.options.filetype,
      this.options.sport,
      this.options["in0"] || false,
      this.options["out0"] || false
    ],
    stream = new Stream();

    stream.pipe = function( dest ) {
      dest.write( pieces.join("|") + this.inDelim, "utf8" );
      return this;
    }.bind( this );

    stream.pipe( this );
  } else {
    process.stdin.pipe( this );
  }
};

// Use transform to guarantee that what our fileReader sees is a complete line of input.
Reader.prototype._transform = function( chunk, encoding, done ) {

  // Does the chunk contain the delimiter? If so, it's time to output the buffer.
  for ( var i = 0; i < chunk.length; i++ ) {
    if ( chunk[i] == 10 ) {
      var outBuffer = "";
      for( var j = 0; j<this._buffer.length;j++ ) {
        outBuffer += String.fromCharCode( this._buffer[j] );
      }
      this.push( outBuffer + this.outDelim );
      this._buffer = [];
      this.ctr++;
    } else {
      this._buffer.push( chunk[i] );
    }
  }
  done();

};
