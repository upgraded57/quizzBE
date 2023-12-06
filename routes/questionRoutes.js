const router = require("express").Router();
const {
  getQuestions,
  createQuestion,
  getQuestionByDifficultyLevel,
  getQuestionsByTags,
} = require("../controllers/questionsController");

// get all questions
router.get("/", getQuestions);

// get questions by filter parameters
router.get("/qns", (req, res) => {
  const filter = req.query;

  if (Object.keys(filter)[0] === "level") {
    // query by difficulty level
    return getQuestionByDifficultyLevel(req, res);
  } else if (Object.keys(filter)[0] === "tags") {
    // query by tags
    return getQuestionsByTags(req, res);
  } else {
    res.status(400).json({ error: "Cannot determine filter parameter" });
  }
});

// Create a question
router.post("/", createQuestion);

module.exports = router;
