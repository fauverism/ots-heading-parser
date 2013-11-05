#!/usr/bin/env node

var
options = require("../lib/cli").options,
InputReader = require("../lib/inputReader"),
FileReader = require("../lib/fileReader"),
HeadingChecker = require("../lib/headingChecker"),
split = require("split"),
inputReader;

inputReader = new InputReader( options )
  .pipe( new FileReader( options ) )
  .pipe( split() )
  .pipe( new HeadingChecker( options ) )
  .pipe( process.stdout );
