const express = require('express');
const { createComment } = require('../controllers/comment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authenticate, createComment);

module.exports = router;