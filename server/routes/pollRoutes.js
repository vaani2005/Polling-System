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

const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    const authHeader = req.headers.authorization;

    // polls only
    if (!authHeader) {
      return res.json(polls);
    }

    const token = authHeader.split(" ")[1];

    let userId = null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.json(polls);
    }

    // fetch user votes
    const votes = await Vote.find({ user: userId });

    const voteMap = {};
    votes.forEach((v) => {
      voteMap[v.poll.toString()] = v.optionIndex;
    });

    const result = polls.map((p) => ({
      ...p.toObject(),
      userVote: voteMap[p._id] ?? null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching polls" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching poll" });
  }
});
// VOTE
router.post("/vote", auth, async (req, res) => {
  const { pollId, optionIndex } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ msg: "Poll not found" });

    const existingVote = await Vote.findOne({
      user: req.user,
      poll: pollId,
    });

    if (existingVote) {
      const prevIndex = existingVote.optionIndex;

      poll.options[prevIndex].votes -= 1;

      poll.options[optionIndex].votes += 1;

      existingVote.optionIndex = optionIndex;
      await existingVote.save();
    } else {
      await Vote.create({
        user: req.user,
        poll: pollId,
        optionIndex,
      });

      poll.options[optionIndex].votes += 1;
    }

    await poll.save();

    res.json({ msg: "Vote updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error voting" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { question, options } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ msg: "Poll not found" });
    }

    if (poll.createdBy.toString() !== req.user) {
      return res.status(403).json({ msg: "Not authorized to edit this poll" });
    }

    if (question) poll.question = question;
    if (options && options.length >= 2) {
      poll.options = options.map((o) => ({
        text: o,
        votes: 0,
      }));

      await Vote.deleteMany({ poll: req.params.id });
    }

    await poll.save();

    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: "Error updating poll" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ msg: "Poll not found" });
    }

    if (poll.createdBy.toString() !== req.user) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this poll" });
    }

    await poll.deleteOne();

    await Vote.deleteMany({ poll: req.params.id });

    res.json({ msg: "Poll deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting poll" });
  }
});

module.exports = router;
