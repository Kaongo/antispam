import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'data','db.json');
const REPORTS_FILE = path.join(__dirname, 'reports.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to get flagged accounts
app.get('/api/accounts', (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const accounts = JSON.parse(data);
    res.json(accounts);
  } catch (err) {
    console.error('Error reading db.json:', err);
    res.status(500).json({ error: 'Unable to read accounts' });
  }
});

// API endpoint to get reports
app.get('/api/reports', (req, res) => {
  try {
    const data = fs.readFileSync(REPORTS_FILE, 'utf8');
    const reports = JSON.parse(data);
    res.json(reports);
  } catch (err) {
    console.error('Error reading reports.json:', err);
    res.status(500).json({ error: 'Unable to read reports' });
  }
});

// API endpoint to submit a report
app.post('/api/report', (req, res) => {
  const { username, followers, redFlags } = req.body;

  if (!username || !redFlags) {
    return res.status(400).json({ error: 'Username and red flags are required' });
  }

  try {
    const data = fs.readFileSync(REPORTS_FILE, 'utf8');
    const reports = JSON.parse(data);

    const existing = reports.find(r => r.username === username);
    if (existing) {
      return res.status(409).json({ error: 'This user has already been reported.' });
    }

    const newReport = {
      username,
      followers,
      redFlags,
      timestamp: new Date().toISOString()
    };

    reports.push(newReport);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8');

    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (err) {
    console.error('Error handling report:', err);
    res.status(500).json({ error: 'Error processing report' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});