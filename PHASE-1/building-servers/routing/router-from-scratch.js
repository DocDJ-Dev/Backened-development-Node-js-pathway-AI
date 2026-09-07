// Stores definitions as a list
// Matching incoming requests against them in order
// extract URL parameters
// call the handler with the request, response and extract params

// Reusable router
function createRouter() {
  // internal list of registered routes
  // Each entry: {method, pattern, handler}
  const routes = [];

  function register(method, pattern, handler) {
    routes.push({ method: method.toUpperCase(), pattern, handler });
  }

  //   Match an incoming request and call the right handler
  function handle(req, res) {
    const baseURL = `http://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const pathname = parsedURL.pathname;
    const method = req.method.toUpperCase();

    // Try each registered route in order
    for (let route of routes) {
      //Method must match
      if (route.method !== method) continue;

      // try match the URL pattern
      const params = matchRoute(route.pattern, pathname);

      if (params !== null) {
        // means match found
        // attaching useful extras to req
        req.params = params; // extracted URL parameters
        req.query = Object.fromEntries(parsedURL.searchParams); // query string as object from Map
        req.pathname = pathname;

        //   Call the right handler
        route.handler(req, res);
        return; // to stop the loop
      }
    }
    // If no route has matched
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not Found" }));
  }
  //Convenience methods for each HTTP method
  return {
    get: (pattern, handler) => register("GET", pattern, handler),
    post: (pattern, handler) => register("POST", pattern, handler),
    put: (pattern, handler) => register("PUT", pattern, handler),
    patch: (pattern, handler) => register("PATCH", pattern, handler),
    delete: (pattern, handler) => register("DELETE", pattern, handler),
    handle,
  };
}

function matchRoute(pattern, pathname) {
  const patternSegments = pattern.split("/");
  const pathSegments = pathname.split("/");

  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(":")) {
      paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }
  return params;
}

module.exports = { createRouter };
