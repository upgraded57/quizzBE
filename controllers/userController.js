const mongoose = require("mongoose");
const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// cloudinary
const cloudinary = require("cloudinary").v2;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// UPDATE user data
const updateUser = async (req, res) => {
  const { id } = req.params;

  // check if user exists
  try {
    const foundUser = await Users.findById(id);
    if (!foundUser) {
      return res.status(400).json({ error: "No such user found!" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  // verify jwt token id = params id
  try {
    const requestHeaderData = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_TOKEN
    );
    const requesterId = requestHeaderData.id;
    if (requesterId !== id) {
      return res
        .status(401)
        .json({ error: "Cannot update another user's data" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  // define function to handle upload to cloudinary
  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

  // pick update data from request body
  const { full_name, email, high_score, isAdmin, attempts } = req.body;
  const newAvatar = req.file;

  // // send error if no update data is sent with request
  if (
    !full_name &&
    !email &&
    !newAvatar &&
    !high_score &&
    !isAdmin &&
    !attempts
  ) {
    return res.status(400).json({ error: "No update data sent" });
  }

  // update user data in db
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    // upload avatar
    if (newAvatar) {
      try {
        const b64 = Buffer.from(newAvatar.buffer).toString("base64");
        let dataURI = "data:" + newAvatar.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);

        // Update the avatar
        await Users.findByIdAndUpdate({ _id: id }, { avatar: cldRes.url });
      } catch (error) {
        res.status(500).json({ error });
      }
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// DELETE  a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // verify jwt token id = params id
  try {
    const requestHeaderData = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_TOKEN
    );
    const requesterId = requestHeaderData.id;
    if (requesterId !== id) {
      return res
        .status(401)
        .json({ error: "Cannot update another user's data" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  // check if user exists
  try {
    const foundUser = await Users.findById(id);
    if (!foundUser) {
      return res.status(400).json({ error: "No such user found!" });
    }
  } catch (error) {
    res.status(500).json([error]);
  }

  try {
    const deletedUser = await Users.findByIdAndDelete({ _id: id });
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
