const { URL } = require("url");
// URL is a built-in class — no installation needed
// We destructure it from the 'url' module

function parseURL(rawURL, host) {
  // We need a full URL to use the URL class
  // rawURL might be just '/patients/42?include=vitals'
  // so we construct a full URL using the host
  const fullURL = new URL(rawURL, `http://${host}`);

  // Split pathname into segments and remove empty strings
  // '/patients/42' → ['', 'patients', '42'] → ['patients', '42']
  const segments = fullURL.pathname
    .split("/")
    .filter((segment) => segment !== "");
  // .filter removes empty strings caused by leading/trailing slashes

  // Convert searchParams to a plain object
  // searchParams is a Map-like object — Object.fromEntries converts it
  const query = Object.fromEntries(fullURL.searchParams);

  return {
    pathname: fullURL.pathname,
    segments,
    query,
    hasQuery: fullURL.searchParams.size > 0,
    // .size tells us how many query params exist
    // 0 means no query params → hasQuery = false
  };
}

module.exports = { parseURL };
