const mongoose = require("mongoose");
const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [5, "Question must be at least 5 characters"],
    },
    options: [
      {
        text: {
          type: String,
          required: [true, "Option text is required"],
          trim: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Poll", pollSchema);
