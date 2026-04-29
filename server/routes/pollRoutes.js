const router = require("express").Router();
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const auth = require("../middleware/authMiddleware");

// CREATE POLL
router.post("/", auth, async (req, res) => {
  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ msg: "Invalid poll data" });
  }

  const poll = await Poll.create({
    question,
    options: options.map((o) => ({
      text: o,
      votes: 0,
    })),
    createdBy: req.user,
  });

  res.json(poll);
});

// GET POLLS (LATEST FIRST)
router.get("/", async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 });
  res.json(polls);
});

// VOTE
router.post("/vote", auth, async (req, res) => {
  const { pollId, optionIndex } = req.body;

  try {
    const already = await Vote.findOne({
      user: req.user,
      poll: pollId,
    });

    if (already) {
      return res.status(400).json({ msg: "Already voted" });
    }

    await Vote.create({
      user: req.user,
      poll: pollId,
      optionIndex,
    });

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ msg: "Poll not found" });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json({ msg: "Vote counted" });
  } catch (err) {
    res.status(500).json({ msg: "Error voting" });
  }
});

module.exports = router;
