const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({ ...req.body, user: req.user._id });
    res.status(201).json(comment);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username').sort({ createdAt: 1 });
  res.json(comments);
};
