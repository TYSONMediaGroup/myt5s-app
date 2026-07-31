const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Database
let articles = [
  { id: 1, type: 'TMG', title: 'The Future of Media Distribution', author: 'Editorial Team', status: 'Published', date: '2026-07-28', category: 'Technology', views: 14205 },
  { id: 2, type: 'AVIATION', title: 'Audi RS6: Editorial Deep Dive', author: 'Editorial Team', status: 'Draft', date: '2026-07-29', category: 'Reviews', views: 0 },
  { id: 3, type: 'ATLANTIS', title: 'Midnight Echoes - Full Album', author: 'Atlantis Records', status: 'Scheduled', date: '2026-08-15', category: 'Releases', views: 0 },
  { id: 4, type: 'TMG', title: 'Quarterly Earnings Report', author: 'Finance Team', status: 'Review', date: '2026-07-30', category: 'News', views: 0 }
];

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    let publisherType = 'TMG';
    const lowerUser = username.toLowerCase();
    if (lowerUser.endsWith('@aviation.tysonmediagroup.org')) publisherType = 'AVIATION';
    else if (lowerUser.endsWith('@atlantis.tysonmediagroup.org')) publisherType = 'ATLANTIS';
    
    res.json({ success: true, publisherType, username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Articles Endpoints
app.get('/api/articles', (req, res) => {
  res.json(articles);
});

app.post('/api/articles', (req, res) => {
  const newArticle = { ...req.body, id: Date.now() };
  articles.unshift(newArticle);
  res.json(newArticle);
});

app.put('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex(a => a.id === id);
  if (index !== -1) {
    articles[index] = { ...articles[index], ...req.body };
    res.json(articles[index]);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

app.delete('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  articles = articles.filter(a => a.id !== id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
