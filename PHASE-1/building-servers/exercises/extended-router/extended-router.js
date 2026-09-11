function createRouter() {
  const routes = [];

  // ─── ROUTE MATCHING ──────────────────────────────────────────────────

  function matchRoute(pattern, pathname) {
    // Feature 2: optional trailing slash
    // Strip trailing slash from BOTH pattern and pathname before comparing
    // '/patients/' and '/patients' both become '/patients'
    const cleanPattern =
      pattern.endsWith("/") && pattern !== "/"
        ? pattern.slice(0, -1) // remove last character (the slash)
        : pattern;

    const cleanPathname =
      pathname.endsWith("/") && pathname !== "/"
        ? pathname.slice(0, -1)
        : pathname;

    // Feature 1: wildcard — '*' matches everything
    if (cleanPattern === "*") {
      return {}; // match with no params
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

  // ─── ROUTE REGISTRATION ───────────────────────────────────────────────

  function register(method, pattern, handler) {
    routes.push({
      method: method.toUpperCase(),
      pattern,
      handler,
    });
  }

  // ─── REQUEST HANDLING ─────────────────────────────────────────────────

  function handle(req, res) {
    const baseURL = `http://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const pathname = parsedURL.pathname;
    const method = req.method.toUpperCase();

    req.query = Object.fromEntries(parsedURL.searchParams);

    for (const route of routes) {
      // Feature 3: router.all() — method is 'ALL', matches any HTTP method
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

    // No route matched — should never reach here if wildcard '*' is registered
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }

  // ─── PUBLIC API ───────────────────────────────────────────────────────

  return {
    get: (pattern, handler) => register("GET", pattern, handler),
    post: (pattern, handler) => register("POST", pattern, handler),
    put: (pattern, handler) => register("PUT", pattern, handler),
    patch: (pattern, handler) => register("PATCH", pattern, handler),
    delete: (pattern, handler) => register("DELETE", pattern, handler),

    // Feature 3: .all() matches ANY HTTP method
    all: (pattern, handler) => register("ALL", pattern, handler),

    handle,
  };
}

module.exports = { createRouter };
