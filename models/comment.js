const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", // make sure this matches Blog model name
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user", // same here, model name should match
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema); // fixed name & reference
module.exports = Comment;
