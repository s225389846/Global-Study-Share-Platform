async function isSuperAdmin(req, res, next) {
  if (!req.user || req.user.role != "super-admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = isSuperAdmin