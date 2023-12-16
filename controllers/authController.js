const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

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
  res.status(201).json({
    user: {
      full_name: createdUser.full_name,
      email: createdUser.email,
      id: createdUser._id,
    },
  });
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  const access_token = jwt.sign(
    {
      id: user._id,
      type: "access",
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: "10m",
    }
  );

  const refresh_token = jwt.sign(
    {
      id: user._id,
      type: "refresh",
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: "30d",
    }
  );

  res.status(200).json({ user, access_token, refresh_token });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const old_refresh_token = req.body.refresh_token;

  if (!old_refresh_token) {
    return res.status(400).json({ error: "Refresh token not provided" });
  }

  try {
    const { id, type } = jwt.verify(old_refresh_token, process.env.JWT_TOKEN);
    if (type !== "refresh") {
      return res.status(400).json({ error: "Invalid refresh token provided" });
    }
    try {
      const access_token = jwt.sign(
        { id, type: "access" },
        process.env.JWT_TOKEN,
        { expiresIn: "10m" }
      );
      const refresh_token = jwt.sign(
        { id, type: "refresh" },
        process.env.JWT_TOKEN,
        { expiresIn: "30d" }
      );

      res.status(200).json({ access_token, refresh_token });
    } catch (err) {
      res.status(500).json({ error: "Unable to generate refresh token" });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Refresh token is expired" });
    }
    return res.status(500).json({ error: "Unable to verify refresh token" });
  }
};

module.exports = { registerUser, loginUser, refreshToken };
