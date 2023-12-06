const mongoose = require("mongoose");
const Users = require("../models/userModel");

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

// REGISTER a user
const registerUser = async (req, res) => {
  const { full_name, email, avatar } = req.body;

  const newUser = { full_name, email, avatar };

  // check if email already exists
  const userExists = await Users.findOne({ email }, { email });
  if (userExists) {
    return res
      .status(400)
      .json({ error: "User with the provided email already exists" });
  }

  //   create user
  const createdUser = await Users.create(newUser);
  res.status(201).json({ user: createdUser });
};

module.exports = { getUsers, registerUser, getUser };
