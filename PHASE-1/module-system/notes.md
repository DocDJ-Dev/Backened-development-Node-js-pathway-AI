TOPIC 2 - Node.js

## Module System

-module = single js file
-variables in one module are out of scope of the other unless exported and imported

- Common JS=> old system: extension .cjs
- ECMScript Module=> newer version: extension .mjs
  -two cannot be mixed
  -declaring "type":"module" in package.json ensure use of ES module. Otherwise commonjs is the default

# Sequence of events when a module is required(.require)

1 Resolution=> finding the path
2 Cache checking- if module was executed before, cached results are returned || step 3
3 Wrapping=> code is wrap in function before executed
4 Exercution=> whatever attached to module.exports is returned and given to whoever called require()
5 results are added to cache incase the module is required again

- **filename=> absolute path in full
  **dirname=> absolute folder in full

#Absolute vs Relative Path
-Absolute path guarantees the paths are always correct
