const TOKENS = {
  "admin-token-123": { role: "admin", name: "Mr James" },
  "doctor-token-456": { role: "doctor", name: "Dr Desire" },
  "nurse-token-789": { role: "nurse", name: "Sister Ndleve" },
};

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    return res.status(401).json({
      message: "Unauthorised: Missing or invalid token format",
    });

  const token = authHeader.split(" ")[1];
  const user = TOKENS[token];

  if (!user)
    return res.status(401).json({ message: "Unauthorized: Invalid Token" });

  req.user = user;
  next();
}

module.exports = auth;
