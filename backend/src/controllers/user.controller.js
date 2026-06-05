const db = require('../config/db');
const { minioClient, bucketName } = require('../config/minio');

const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid image file.' });
    }

    const fileName = `avatars/${userId}-${Date.now()}-${file.originalname}`;
    
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype
    });

    const fileUrl = `http://${process.env.MINIO_EXTERNAL_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}/${bucketName}/${fileName}`;

    await db.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [fileUrl, userId]);

    res.status(200).json({ success: true, message: 'Avatar updated successfully', data: { avatarUrl: fileUrl } });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAvatar };