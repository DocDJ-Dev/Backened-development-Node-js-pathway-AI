function matchRoute(pattern, pathName) {
  //1. split the two into segments
  // pieces seperated by '/'
  const patternSegments = pattern.split("/");
  const pathNameSegments = pathName.split("/");

  //   Do they match. Number of segments
  if (patternSegments.length !== pathNameSegments.length) {
    return null;
  }

  const params = {}; // to hold extracted parameter values

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathNameSegments[i];

    if (patternSegment.startsWith(":")) {
      //Extract the parameter name and remove ":"
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      // this segment is a literal and must match
      return null;
    }
  }
  return params;
}

console.log(matchRoute("/x/y/:k/t/h/:m/r", "/x/y/3/h/h/7/r"));
