function createRouter() {
  const routes = [];

  function register(method, pattern, handler) {
    routes.push({ method: method.toUpperCase(), pattern, handler });
  }

  function handle(req, res) {
    const baseURL = `http://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const pathname = parsedURL.pathname;
    const method = req.method.toUpperCase();

    req.query = Object.fromEntries(parsedURL.searchParams);

    for (const route of routes) {
      const methodMatches = route.method === "ALL" || route.method === method;

      if (!methodMatches) continue;

      const params = matchRoute(route.pattern, pathname);

      if (params !== null) {
        req.params = params;
        req.pathname = pathname;
        route.handler(req, res);
        return;
      }
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }

  return {
    get: (pattern, handler) => register("GET", pattern, handler),
    post: (pattern, handler) => register("POST", pattern, handler),
    put: (pattern, handler) => register("PUT", pattern, handler),
    patch: (pattern, handler) => register("PATCH", pattern, handler),
    delete: (pattern, handler) => register("DELETE", pattern, handler),
    all: (pattern, handler) => register("ALL", pattern, handler),
    handle,
  };
}

function matchRoute(pattern, pathname) {
  const cleanPattern =
    pattern.endsWith("/") && pattern !== "/" ? pattern.slice(0, -1) : pattern;

  const cleanPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  if (cleanPattern === "*") {
    return {};
  }

  const patternSegments = cleanPattern.split("/");
  const pathSegments = cleanPathname.split("/");

  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];

    if (patternSeg.startsWith(":")) {
      params[patternSeg.slice(1)] = pathSeg;
    } else if (patternSeg !== pathSeg) {
      return null;
    }
  }

  return params;
}

module.exports = { createRouter };
