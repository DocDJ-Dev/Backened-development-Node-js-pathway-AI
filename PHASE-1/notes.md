TOPIC 1- how the internal actually works.

# the request-response cycle

1. DNS, IP Address
   -DNS process of finding IP: computer cache=> ISP=> Root nameservers

2. TCP- SYN=> SYN-ACK=> ACK
   -data is transfered in form of packets(chunks)

3. HTTP Request
   -language browser and server use for communication
   - components of a request
     a. Method (GET, PUT, PATCH, DELETE, POST)
     b. Path
     c. Headers (Host, User-Agent, Accept, Auth, Content-Type)
     d. Body (for PUT, PATCH, POST)

4. Server Receive The Request
   - server has port(numbered gateway)
     -80(std HTTP)
     -443(std HTTPS)
     -8000/3000(development and testing)
   - server perfoms logic before responding

5. HTTP Response
   -Components
   a. Status Code- 200(OK), 201(Created), 301(Bad request), 401(unauth), 403(forbidden), 422(unprocesseble entry), 404(Not found), 429(too many request), 500(internal server error), 503(server unavailable)
   b. Response Headers(metadata)- Content-Type, Content-Length(in bytes), Set-Cookie, Body

## HTTPS- an HTTP + TLS

## HTTP1- 1 request per connection: slow

## HTTP2- multiplexing: fast

## HTTP3- replaced TCP with QUIC: fast and easy connection
