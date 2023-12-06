const router = require("express").Router();
const {
  getUsers,
  registerUser,
  getUser,
} = require("../controllers/userController");

// get all users
router.get("/users", getUsers);

// get single user
router.get("/users/:id", getUser);

// create a user
router.post("/register", registerUser);

module.exports = router;
