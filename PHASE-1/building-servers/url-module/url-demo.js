const http = require("http");

const server = http.createServer((req, res) => {
  //The URL class needs a base URL to resolve relative path
  //It is constructed from request headers
  const baseURL = `http://${req.headers.host}`;
  const parsedURL = new URL(req.url, baseURL);

  console.log("full path", parsedURL.href);
  console.log("pathname only", parsedURL.pathname);
  console.log("search string", parsedURL.search);

  // searchParam is like a  Map- use .get() to exctract individual values
  console.log("include param:", parsedURL.searchParams.get("include"));
  console.log("format param:", parsedURL.searchParams.get("format"));

  //   .has() check if the param exist
  console.log('Has "debug" param?:', parsedURL.searchParams.has("debug"));

  //Iterate all params

  for (const [key, value] of parsedURL.searchParams) {
    console.log(`Param: ${key} = ${value}`);
  }

  res.writeHead(200, { "content-type": "application/json" });
  res.end(
    JSON.stringify({
      pathname: parsedURL.pathname,
      params: Object.fromEntries(parsedURL.searchParams),
      //   Object.fromEntries() converts the searchParams Map into plain object
    }),
  );
});

server.listen(3000, () => console.log("listening on port 3000..."));
