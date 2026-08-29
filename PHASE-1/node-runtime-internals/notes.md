## Node JS runtime internals

Components
-V8(c++),
-library ultraviolet(c)
-Bindings
The Event Loop and six phases
-Timers => Pending => idle => Poll => Check => Close Phase
The Microtask Queue (btwn phases)
-process.nextTick()
-Promises

Process.nextTick() vs setIntemediate() vs setTimeout()
Introduction to Workers Threads and application
Memory Management and Gabage collection
