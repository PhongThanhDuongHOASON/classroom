const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { sendDiscordNotification } = require('../services/discord.service');
require('dotenv').config();

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role_id: user.role_id, role_name: user.role_name };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    // Get 'Member' role ID
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', ['Member']);
    const memberRoleId = roles[0].id;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = uuidv4();

    // Insert user
    await db.execute(
      'INSERT INTO users (id, role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, memberRoleId, firstName, lastName, email, passwordHash]
    );

    // Trigger Discord Webhook (Green Color)
    await sendDiscordNotification(`New user registered: ${firstName} ${lastName} (${email})`, 3066993);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Fetch user and role
    const [users] = await db.execute(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.email = ?`, 
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token in DB
    await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role_name,
          avatarUrl: user.avatar_url
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
