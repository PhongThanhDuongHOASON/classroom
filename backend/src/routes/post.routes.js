const express = require('express');
const { createPost, getPosts, getPostById, deletePost } = require('../controllers/post.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPostById);
router.post('/', authenticate, upload.array('files', 5), createPost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;