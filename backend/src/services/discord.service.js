const axios = require('axios');
require('dotenv').config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const sendDiscordNotification = async (message, color = 3447003) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord Webhook URL not configured. Skipping notification.');
    return;
  }

  try {
    const payload = {
      embeds: [
        {
          title: "Club Platform Notification",
          description: message,
          color: color,
          timestamp: new Date().toISOString()
        }
      ]
    };

    await axios.post(DISCORD_WEBHOOK_URL, payload);
  } catch (error) {
    console.error('Failed to send Discord notification:', error.message);
  }
};

module.exports = { sendDiscordNotification };
