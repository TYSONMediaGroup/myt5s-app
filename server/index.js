const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Database
let articles = [
  { id: 1, type: 'TMG', title: 'The Future of Media Distribution', author: 'Editorial Team', status: 'Published', date: '2026-07-28', category: 'Technology', views: 14205 },
  { id: 2, type: 'AVIATION', title: 'Audi RS6: Editorial Deep Dive', author: 'Editorial Team', status: 'Draft', date: '2026-07-29', category: 'Reviews', views: 0 },
  { id: 3, type: 'ATLANTIS', title: 'Midnight Echoes - Full Album', author: 'TYSON Atlantis', status: 'Scheduled', date: '2026-08-15', category: 'Releases', views: 0 },
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

// Publish to Tyson Auto (Cloudflare Pages Architecture)
app.post('/api/publish-auto', (req, res) => {
  try {
    const article = req.body;
    
    // Path to tyson-auto mockData.ts
    const tysonAutoPath = path.resolve(__dirname, '../../../tyson-auto');
    const dataFilePath = path.join(tysonAutoPath, 'src/data/mockData.ts');
    
    // Read existing data
    let existingDataStr = fs.readFileSync(dataFilePath, 'utf8');
    
    // Create new post object
    const newPost = {
      id: `post_${Date.now()}`,
      title: article.title,
      slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      author: article.author || 'Editorial Staff',
      published_at: new Date().toISOString(),
      hero_image: article.coverImage || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=80",
      score: 8.5,
      vehicle: {
        make: article.vehicleMake || "Custom",
        model: article.vehicleModel || "Vehicle",
        year: 2026,
        body_style: "Auto",
        price_as_tested: "TBA",
        specs: {
          powertrain: "TBA",
          horsepower: "TBA",
          torque: "TBA",
          towing_capacity: "TBA",
          fuel_economy: "TBA"
        },
        pros: ["Great performance", "Premium feel"],
        cons: ["Pending review"]
      },
      excerpt: article.excerpt || article.content.substring(0, 150) + '...',
      body: article.content
    };

    // Inject into mockData.ts (very naive string replacement for the demo)
    // Find the start of the posts array: `posts: [`
    const insertPoint = existingDataStr.indexOf('posts: [') + 8;
    const injectedStr = existingDataStr.slice(0, insertPoint) + '\n    ' + JSON.stringify(newPost, null, 2).replace(/\n/g, '\n    ') + ',' + existingDataStr.slice(insertPoint);
    
    fs.writeFileSync(dataFilePath, injectedStr);

    // Run Git commit
    exec(`git add src/data/mockData.ts && git commit -m "Auto-publish: ${article.title}"`, { cwd: tysonAutoPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Git error: ${error}`);
        // We'll still return success for the file write
      }
      res.json({ success: true, message: 'Published directly to Tyson Auto repository!' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
