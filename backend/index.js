// form-handler-server/index.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST /contact handler
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Form data received:", { name, email, message });


  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("Using SMTP_USER:", process.env.SMTP_USER);


    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error.message);
    res.status(500).json({ success: false, message: 'An error occurred while sending the message.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
