import express from 'express';
import cors from 'cors';
import fakeAccounts from './data.js';

const app = express();
const PORT = 3003;

app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// API endpoint to get flagged accounts
app.get('/api/accounts', (req, res) => {
  res.json(fakeAccounts);
});

// Optional: Root route (if you want to respond with text for API users)
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' }); // Serve index.html properly
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


