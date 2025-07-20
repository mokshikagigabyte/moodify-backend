const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/help-feedback', async (req, res) => {
  const { message, email } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, msg: 'Message is required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: 'New Moodify Help Request',
      text: `User: ${email || 'Anonymous'}\n\nProblem:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, msg: '🎉 Message sent! Thank you for your feedback.' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, msg: '❌ Server error. Please try again.' });
  }
});

module.exports = router;
