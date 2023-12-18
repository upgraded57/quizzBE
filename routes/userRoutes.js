const router = require("express").Router();
const express = require("express");
const multer = require("multer");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const upload = multer({ dest: "./uploads/" });

// require authentication data
const requireAuth = require("../middlewares/requireAuth");

// Allow json parsing
router.use(express.json());

// use authentication middleware
router.use(requireAuth);

// get all users
router.get("/", getUsers);

// get single user
router.get("/:id", getUser);

// get single user
router.put("/:id", upload.single("avatar"), updateUser);

// get single user
router.delete("/:id", deleteUser);

module.exports = router;
