const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addComment, getComments } = require('../controllers/commentController');

router.post('/', protect, addComment);
router.get('/post/:postId', getComments);

module.exports = router;
