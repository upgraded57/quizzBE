const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    qn: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    ans: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
    difficulty_level: {
      type: String,
    },
  },
  { timestamps: true, collection: "questions" }
);

module.exports = mongoose.model("Questions", questionSchema);
