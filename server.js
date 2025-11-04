// --- 1. Imports ---
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// --- 2. Middleware ---
app.use(express.json());
// Serve static files (your index.html + CSS + JS client)
app.use(express.static(path.join(__dirname, '/views')));

// --- 3. In-memory “Database” ---
let contacts = [
  { id: 1, full: 'John Doe', email: 'john@example.com' },
  { id: 2, full: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, full: 'Alice Johnson', email: 'alice@example.com' }
];

// Simple ID generator
const nextId = () => (contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1);

// --- 4. API Routes (Contract for client) ---

// GET /api/contacts
// → Client calls this to load all contacts
app.get('/api/contacts', (req, res) => {
  console.log('GET: /api/contacts');
  res.json(contacts);
});

// POST /api/contacts
// → Client calls this when registering a new contact
app.post('/api/contacts', (req, res) => {
  const { full, email } = req.body;
  if (!full || !email) {
    return res.status(400).json({ error: 'Full name and email are required.' });
  }

  const newContact = {
    id: nextId(),
    full: String(full),
    email: String(email)
  };

  contacts.push(newContact);
  console.log('POST: /api/contacts - Added:', newContact);
  res.status(201).json(newContact);
});

// PUT /api/contacts/:id
// → Client calls this to update contact info
app.put('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const { full, email } = req.body;
  const i = contacts.findIndex(c => c.id === id);

  if (i === -1) return res.status(404).json({ error: 'Contact not found.' });
  if (!full || !email) return res.status(400).json({ error: 'Missing data.' });

  contacts[i] = { ...contacts[i], full, email };
  console.log(`PUT: /api/contacts/${id} - Updated:`, contacts[i]);
  res.json(contacts[i]);
});

// DELETE /api/contacts/:id
// → Client calls this to delete a contact
app.delete('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = contacts.some(c => c.id === id);
  if (!exists) return res.status(404).json({ error: 'Contact not found.' });

  contacts = contacts.filter(c => c.id !== id);
  console.log(`DELETE: /api/contacts/${id}`);
  res.status(204).send();
});

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
