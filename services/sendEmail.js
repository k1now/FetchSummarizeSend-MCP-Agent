const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

// Email sending logic (inlined here)
async function sendEmailFunction({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Flash Briefing" <${process.env.EMAIL_USER}>`,
    to: to.join(', '),
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

// Tool endpoint
router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;
  console.log('sendEmail is given the following to send the news digest to', req.body)

  try {
    const result = await sendEmailFunction({ to, subject, text });
    console.log(`📧 Email sent: ${result.response}`);
    res.json({ result: `Email sent to ${to.join(', ')}` });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
