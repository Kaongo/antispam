import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fakeAccounts from './data.js';

const app = express();
const PORT = 3003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_FILE = path.join(__dirname, 'reports.json');

app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.static('public')); // Serve static files from 'public'

// API endpoint to get flagged accounts
app.get('/api/accounts', (req, res) => {
  res.json(fakeAccounts);
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


// app.post('/api/report', (req, res) => {
//   const { username, botScore, redFlags } = req.body;

//   if (!username || !reason) {
//     return res.status(400).json({ error: 'Username and botScore are required' });
//   }

//   try {
//     const data = fs.readFileSync(REPORTS_FILE, 'utf8');
//     const reports = JSON.parse(data);

//     const existing = reports.find(r => r.username === username);
//     if (existing) {
//       return res.status(409).json({ error: 'This user has already been reported.' });
//     }

//     const newReport = { username, reason, timestamp: new Date().toISOString() };
//     reports.push(newReport);
//     fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8');

//     res.status(201).json({ message: 'Report submitted successfully.' });
//   } catch (err) {
//     console.error('Error handling report:', err);
//     res.status(500).json({ error: 'Error processing report' });
//   }
// });

app.post('/api/report', (req, res) => {
  const { username, botScore, redFlags } = req.body;

  if (!username || !redFlags) { // botScore can be optional (?)
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
      botScore,
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



// Optional: Root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
