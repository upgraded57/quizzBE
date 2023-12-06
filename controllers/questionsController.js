// Models
const Questions = require("../models/questionModel");

// GET all questions
const getQuestions = async (req, res) => {
  const questions = await Questions.find().sort({ createdAt: -1 });
  res.json(questions);
};

// CREATE a new questions
const createQuestion = async (req, res) => {
  const { qn, options, ans, tags, difficulty_level } = req.body;

  const question = { qn, options, ans, tags, difficulty_level };

  const newQn = await Questions.create(question);

  res.status(201).json(newQn);
};

// GET questions by difficulty_level
const getQuestionByDifficultyLevel = async (req, res) => {
  const { level } = req.query;

  // checks if a difficulty level is provided
  if (!level) {
    return res.status(400).json({
      error: "No difficulty level provided",
    });
  }

  // checks if right difficulty level is provided
  const acceptedLevels = ["easy", "normal", "hard"];

  if (!acceptedLevels.includes(level)) {
    return res.status(400).json({
      error: "Difficulty level must be either of easy, normal or hard",
    });
  }
  const questions = await Questions.find({ difficulty_level: level }).sort({
    createdAt: -1,
  });

  res.status(200).json(questions);
};

// GET questions by tags
const getQuestionsByTags = async (req, res) => {
  const qnTags = req.query.tags.split(",");

  let questions = [];
  for (let i = 0; i < qnTags.length; i++) {
    const foundQn = await Questions.find({
      tags: qnTags[i].toLowerCase(),
    }).sort({ createdAt: -1 });
    questions.push(foundQn);
  }

  //   const questions = await Questions.find({ tags: "one" });

  res.status(200).json(questions);
};

module.exports = {
  getQuestions,
  createQuestion,
  getQuestionByDifficultyLevel,
  getQuestionsByTags,
};
