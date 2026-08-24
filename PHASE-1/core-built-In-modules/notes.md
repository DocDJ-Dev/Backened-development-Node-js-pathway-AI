## core built in Modules

-path, fs, os, events, process, crypto, buffer and stream
\*prewritten code that come bundled with Node js itself

## the path module

-Windows use backslashes while Mac/Linux use forward slashes
-windows path style break in the other two.
-path module as collection of functions to make sure path is written based on the underlying OS

1 path.join(...)=> combine multiple pieces path into 1
2 path.resolve(...)=> like join but always returns absolute path
3 path.basename(...)=> extracts just file name from path
4 path.dirname(...)=> extracts just the folder name
5 path.extname(...)=> extracts just the file extension
6 path.parse(...) => returns an object of path components
