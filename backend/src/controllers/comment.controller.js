const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    if (!postId || !content) {
      return res.status(400).json({ success: false, message: 'Post ID and content are required' });
    }

    const commentId = uuidv4();

    await db.execute(
      'INSERT INTO comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)',
      [commentId, postId, userId, content]
    );

    const [comments] = await db.execute(`
      SELECT c.*, u.first_name, u.last_name, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);

    res.status(201).json({ success: true, data: { comment: comments[0] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment };