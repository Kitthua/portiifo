const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// GET /download/resume — serve the resume PDF for download
app.get('/download/resume', (req, res) => {
  const resumePath = path.join(__dirname, 'CV_2026-02-22-125019.pdf');
  res.download(resumePath, 'Shadrack_Ngunguu_Resume.pdf', (err) => {
    if (err) {
      console.error('Resume download error:', err);
      res.status(404).json({ error: 'Resume file not found.' });
    }
  });
});

// POST /api/contact — receive and forward contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Send email to portfolio owner
    const infoOwner = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <h3>New Message from Your Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    console.log('Email sent to owner:', infoOwner && infoOwner.messageId ? infoOwner.messageId : infoOwner);

    // Optionally send confirmation email to visitor
    const infoVisitor = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Message Received — Shadrack Ngunguu',
      html: `
        <h3>Thank you, ${name}!</h3>
        <p>I received your message and will get back to you within 48 hours.</p>
        <p>Best,<br/>Shadrack Ngunguu</p>
      `
    });
    console.log('Confirmation sent to visitor:', infoVisitor && infoVisitor.messageId ? infoVisitor.messageId : infoVisitor);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email. Try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
