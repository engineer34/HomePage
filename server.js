const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serves index.html, styles.css, etc.

// Simple in-file "database"
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// API route: receive contact messages
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const messages = readMessages();
  const newMessage = {
    id: messages.length + 1,
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  writeMessages(messages);

  res.status(201).json({ success: true, message: 'Message received!' });
});

// (Optional) route to view messages in JSON
app.get('/api/contact', (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});