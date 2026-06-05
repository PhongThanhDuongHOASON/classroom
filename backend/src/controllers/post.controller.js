const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { minioClient, bucketName } = require('../config/minio');
const { sendDiscordNotification } = require('../services/discord.service');

const createPost = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const postId = uuidv4();

    await connection.execute(
      'INSERT INTO posts (id, user_id, title, content) VALUES (?, ?, ?, ?)',
      [postId, userId, title, content]
    );

    const files = req.files || [];
    const attachments = [];

    for (const file of files) {
      const fileId = uuidv4();
      const fileName = `${postId}-${Date.now()}-${file.originalname}`;
      
      await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype
      });

      const fileUrl = `http://${process.env.MINIO_EXTERNAL_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}/${bucketName}/${fileName}`;

      await connection.execute(
        'INSERT INTO attachments (id, post_id, file_name, file_url, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
        [fileId, postId, file.originalname, fileUrl, file.mimetype, file.size]
      );

      attachments.push({
        id: fileId,
        fileName: file.originalname,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size
      });
    }

    await connection.commit();

    // Send Discord notification (Blue color)
    await sendDiscordNotification(`New Post Created: **${title}**\nBy: ${req.user.email}`, 3447003);

    res.status(201).json({ success: true, message: 'Post created successfully', data: { postId, attachments } });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getPosts = async (req, res, next) => {
  try {
    const [posts] = await db.execute(`
      SELECT p.*, u.first_name, u.last_name, u.avatar_url 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);

    for (let post of posts) {
      const [attachments] = await db.execute('SELECT * FROM attachments WHERE post_id = ?', [post.id]);
      post.attachments = attachments;
      const [comments] = await db.execute(`
        SELECT c.*, u.first_name, u.last_name, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `, [post.id]);
      post.comments = comments;
    }

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const [posts] = await db.execute(`
      SELECT p.*, u.first_name, u.last_name, u.avatar_url 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const post = posts[0];
    const [attachments] = await db.execute('SELECT * FROM attachments WHERE post_id = ?', [postId]);
    post.attachments = attachments;

    const [comments] = await db.execute(`
      SELECT c.*, u.first_name, u.last_name, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);
    post.comments = comments;

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role_name;

    const [posts] = await connection.execute('SELECT * FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (posts[0].user_id !== userId && userRole !== 'Admin' && userRole !== 'Moderator') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
    }

    const [attachments] = await connection.execute('SELECT file_name FROM attachments WHERE post_id = ?', [postId]);
    
    for (let att of attachments) {
      try {
        await minioClient.removeObject(bucketName, att.file_name);
      } catch (err) {
        console.error("Failed to delete MinIO object:", err);
      }
    }

    await connection.execute('DELETE FROM posts WHERE id = ?', [postId]);
    await connection.commit();
    
    await sendDiscordNotification(`Post Deleted: **${posts[0].title}**\nDeleted by: ${req.user.email}`, 15158332);

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = { createPost, getPosts, getPostById, deletePost };