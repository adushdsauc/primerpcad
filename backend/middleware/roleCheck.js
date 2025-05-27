module.exports = function roleCheck(req, res, next) {
    const allowedRoles = process.env.CIVILIAN_CREATE_ROLE_IDS?.split(",");
    const userRoles = req.user?.roles || [];
  
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));
    if (!hasPermission) return res.status(403).json({ message: "Unauthorized" });
  
    next();
  };
  