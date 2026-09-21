function authorize(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user || !requiredRoles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    next();
  };
}

module.exports = authorize;
