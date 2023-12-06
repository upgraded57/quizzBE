const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    high_score: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
    },
    attempts: {
      type: Number,
    },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("Users", userSchema);
