const Post = require('../models/Post');

exports.addPost = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getPosts = async (req, res) => {
  const { keyword, tag } = req.query;
  const query = {};
  if (keyword) {
    const regex = { $regex: keyword, $options: 'i' };
    query.$or = [{ title: regex }, { content: regex }];
  }
  if (tag) {
    query.tags = { $regex: tag, $options: 'i' };
  }
  const posts = await Post.find(query)
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if(!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Only allow author to edit
    if(String(post.author) !== String(req.user._id)) 
        return res.status(403).json({ error: 'Not authorized' });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const userId = String(req.user._id);
  const alreadyLiked = post.likedBy.some(u => String(u) === userId);
  if (alreadyLiked) {
    post.likedBy = post.likedBy.filter(u => String(u) !== userId);
  } else {
    post.likedBy.push(req.user._id);
  }
  post.likes = post.likedBy.length;
  await post.save();
  res.json({ likes: post.likes, liked: !alreadyLiked });
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Post.distinct('tags');
    res.json(tags.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
