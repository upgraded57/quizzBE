const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: "Authorization credentials not provided" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token provided" });
  }

  try {
    const { id, type } = jwt.verify(token, process.env.JWT_TOKEN);
    if (type !== "access") {
      return res.status(401).json({ error: "Invalid access token provided" });
    }
    req.user = id;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token is expired" });
    }
    return res
      .status(401)
      .json({ error: "Invalid authorization token supplied" });
  }

  next();
};

module.exports = requireAuth;
