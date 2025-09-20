const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// In-memory store for demo
let store = {
  reels: {},
  stories: {}
};

// Mock data
const mockReels = [
  {
    id: "r1",
    thumbnail: "/img/r1.jpg",
    caption: "3 Halal income tips",
    owner: "mmomin",
    duration: 15
  },
  {
    id: "r2", 
    thumbnail: "/img/r2.jpg",
    caption: "Side hustle case study",
    owner: "agencyX",
    duration: 30
  },
  {
    id: "r3",
    thumbnail: "/img/r3.jpg", 
    caption: "Quick money tips",
    owner: "user123",
    duration: 22
  }
];

const mockStories = [
  {
    id: "s1",
    thumbnail: "/img/s1.jpg",
    caption: "Sale now live", 
    owner: "brandX",
    expires_at: "2025-12-01T00:00:00Z"
  },
  {
    id: "s2",
    thumbnail: "/img/s2.jpg",
    caption: "Launch today",
    owner: "startup",
    expires_at: "2025-09-30T12:00:00Z"
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Auth - Mock Connect
app.post('/api/auth/mock-connect', (req, res) => {
  // TODO: Replace with real Instagram OAuth
  const mockUser = {
    id: 'demo-user-123',
    name: 'Demo User'
  };
  
  const token = 'demo-token-' + Date.now();
  
  res.json({
    token,
    user: mockUser
  });
});

// Get Reels
app.get('/api/reels', (req, res) => {
  // TODO: Replace with real Instagram API call
  res.json(mockReels);
});

// Get Stories  
app.get('/api/stories', (req, res) => {
  // TODO: Replace with real Instagram API call
  res.json(mockStories);
});

// Get all automations
app.get('/api/automation', (req, res) => {
  res.json(store);
});

// Save reel automation
app.post('/api/automation/reel/:id', (req, res) => {
  const { id } = req.params;
  const { comment, schedule } = req.body;
  
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  store.reels[id] = {
    id,
    comment,
    schedule: schedule || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    reelId: id,
    automation: store.reels[id]
  });
});

// Save story automation
app.post('/api/automation/story/:id', (req, res) => {
  const { id } = req.params;
  const { dm, schedule } = req.body;
  
  if (!dm) {
    return res.status(400).json({ error: 'DM message is required' });
  }
  
  store.stories[id] = {
    id,
    dm,
    schedule: schedule || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    storyId: id,
    automation: store.stories[id]
  });
});

// Delete reel automation
app.delete('/api/automation/reel/:id', (req, res) => {
  const { id } = req.params;
  
  if (store.reels[id]) {
    delete store.reels[id];
    res.json({ success: true, message: 'Reel automation deleted' });
  } else {
    res.status(404).json({ error: 'Automation not found' });
  }
});

// Delete story automation
app.delete('/api/automation/story/:id', (req, res) => {
  const { id } = req.params;
  
  if (store.stories[id]) {
    delete store.stories[id];
    res.json({ success: true, message: 'Story automation deleted' });
  } else {
    res.status(404).json({ error: 'Automation not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 InstaAuto Backend running on http://localhost:${PORT}`);
  console.log('📱 Mock Instagram automation API ready');
  console.log('🔒 Privacy-first demo - no real Instagram connection');
});

module.exports = app;