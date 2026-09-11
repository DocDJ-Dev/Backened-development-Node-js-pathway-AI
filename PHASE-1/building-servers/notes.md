## BUILDING SERVERS

##Part A
The HTTP Module
-http.createServer()
-server.listen() and the port
-req object as a Readable stream and event Emitter and its properties
-res object as a Writable stream and event emitter
-The process of communiction between server and client
-Node js as highly concurrent but not parallel
-Handling of multiple clients

##Part B
Manual Routing and URL parsing
-URL class
-Routing and the split method

##Content negotiation: process where a client and server agree on what format.
-Handled via the ACCEPT header
For Browsers: Accept: text/html,application/xhtml+xml,application/xml;q=0.9,_/_;q=0.8
For postman, typically: Accept: application/json
#worth respecting in server

##Serving Static Pages
-they just need to be read from the dist and streamed to the client.

Disadvantages of Manual Routing
1 Middleware chains
2 Route grouping
3 Error propagation
4 Body parsing
5 Response helpers
##Express solves all five of these systematically
