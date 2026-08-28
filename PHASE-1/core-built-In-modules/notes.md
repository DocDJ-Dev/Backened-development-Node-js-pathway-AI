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

## os module

-Information about computer itself (physical/virtual)
-Useful in scaling and clustering
#keyfunctions
os.platform()- return OS name(win32/darwin/linux)
os.cpus()-return array, each entry per CPU core, with details
os.totalmem()-total system memory in bytes
os.freemem()-currently available memory in bytes
os.homedir()-current user home folder path
os.uptime()-how long the entire computer has been running, not just the Node js
process.uptime()-how long the program has been running

## Events module

-Event Driven Programming
-Core Concepts=>
event emitter class
.emit() method
listening methods
-steps to create events
-direct use vs inheritance
-removing event listeners

## process module

-tell about and let control of currently running program
#keyfunctions
process.argv- array of infor about commandline passed when starting the current program
process.env- object of environmental variables. Values not supposed to be in code
process.exit()- to stop the program
process.uptime()
process.on('exit', callback)- event listener: clean code before exit
process.cwd()- currently working directory but dirname is prefered

## The buffer module

-handling binary data
-bytes as basic unit of digital storage
-buffer as fixed size chunk of of raw memory(RAM) that hold binary data, without overhead of normal javascript string handling
-application in file uploads, database drivers, http request headers, encryption
#key Operations
Buffer.from()
buf.toString('utf-8')
buf.toString('hex'): base 16 encoding
buf.toString('base64'): base 64 encoding

Buffer and Process modules pending deep dive
