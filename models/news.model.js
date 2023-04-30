const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema ({
    title: String,
    content: String,
  });

const Post = model("Post", postSchema);
module.exports = Post; 