const express = require('express');
const { uploadAvatar } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

router.put('/profile/avatar', authenticate, upload.single('avatar'), uploadAvatar);

module.exports = router;