const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addPost, getPosts, getPost, updatePost, likePost, getTags } = require('../controllers/postController');

router.route('/').get(getPosts).post(protect, addPost);
router.route('/:id').get(getPost).put(protect, updatePost);
router.put('/:id/like', protect, likePost);
router.get('/_tags/all', getTags);

module.exports = router;
