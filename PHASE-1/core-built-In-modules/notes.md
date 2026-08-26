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

## FS module

-for reading and writing files
Uses- reading config files, writing logs, handling file uploads, generating reports, etc
#Sync vs Async version

\*Synchronous- blocking; node js doesnt move to next line of code until file reading or writing has finished e.g fs.readFileSync()
\*Asyncronous- non-blocking; execution continues while fs operation is happening

RULE- always prefer async; Sync is prefered for one-off scripts or startup-time configuration loading; never inside request handling code.

#key functions
1 fs.readFile(path, encoding, callback)- async read
2 fs.readFileSync(path, encoding)- sync read
3 fs.writeFile(path, data, callback)- async write; overwrite everything
4 fs.writeFileSync(path, data)- sync write; overwrite everything
5 fs.appendFile(path, data, callback)- async write, add to the end; Does not overwrite
6 fs.existsSync(path)- sync; check if file exists; commonly used at startup
7 fs.promises- allows these function to return promises. Hence useful with async/await.
