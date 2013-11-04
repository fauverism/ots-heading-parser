# Heading Parser for Sports Network Data Files

Looks at a file and spits back what's in the heading element. It's meant to tell you which parser to the parser-proxy needs to spawn in order to store the data.

## Options

* `--file`: the relative or absolute path to the file of interest
* `--filetype`: `pbp|other` pbp can let us know that we don't need to read the file in and examine the `<heading>` element because it's a known play by play file.
* `sport`: `nfl|mlb` if the sport type is already known, specify it here.
* `--in0`: present or not. If this argument is present, it lets us know that the `stdin` input is delimited by `\0` nulls instead of `\n` newlines.
* `--out0`: present of not. If present, delimit the output with `\0` nulls instead of `\n` newlines.

## Input

Can come from either `stdin` if we're piping a large list of files to the parser or just standard command line options specified above.
