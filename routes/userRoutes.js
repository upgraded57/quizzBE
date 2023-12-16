const router = require("express").Router();
const { getUsers, getUser } = require("../controllers/userController");

const requireAuth = require("../middlewares/requireAuth");

// use authentication middleware
router.use(requireAuth);

// get all users
router.get("/", getUsers);

// get single user
router.get("/:id", getUser);

module.exports = router;
