const router = require("express").Router();
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");

// create a user
router.post("/register", registerUser);

// login a user
router.post("/login", loginUser);

// generate new access token
router.post("/token/refresh", refreshToken);

module.exports = router;
