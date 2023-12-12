const router = require("express").Router();
const {
  getUsers,
  registerUser,
  getUser,
  loginUser,
} = require("../controllers/userController");

// get all users
router.get("/users", getUsers);

// get single user
router.get("/users/:id", getUser);

// create a user
router.post("/register", registerUser);

// login a user
router.post("/login", loginUser);

module.exports = router;
