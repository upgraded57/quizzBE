const mongoose = require("mongoose");
const Users = require("../models/userModel");
require("dotenv").config();

// GET all users
const getUsers = async (req, res) => {
  const users = await Users.find();
  res.json(users);
};

// GET a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  // checks if id supplied is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id provided" });
  }

  const foundUser = await Users.findById(id);

  if (foundUser) {
    res.status(200).json({ user: foundUser });
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
};

module.exports = { getUsers, getUser };
