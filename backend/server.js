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

// Message Templates API
app.get('/api/templates/:type', (req, res) => {
  const { type } = req.params;
  // TODO: Replace with database query
  const mockTemplates = [
    {
      id: '1',
      name: 'Great Content',
      content: 'Great content! 👏',
      type: 'comment',
      category: 'engagement',
      tags: ['positive', 'generic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Love This',
      content: 'Love this! 🔥',
      type: 'comment',
      category: 'engagement',
      tags: ['positive', 'short'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Thanks for Story',
      content: 'Thanks for the story! 💯',
      type: 'dm',
      category: 'thanks',
      tags: ['grateful', 'story'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  const filteredTemplates = mockTemplates.filter(t => t.type === type);
  res.json(filteredTemplates);
});

app.post('/api/templates', (req, res) => {
  const { name, content, type, category, tags } = req.body;
  
  if (!name || !content || !type) {
    return res.status(400).json({ error: 'Name, content, and type are required' });
  }
  
  const newTemplate = {
    id: Date.now().toString(),
    name,
    content,
    type,
    category: category || 'custom',
    tags: tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // TODO: Save to database
  res.json({
    success: true,
    template: newTemplate
  });
});

// User Profile API
app.get('/api/user/profile', (req, res) => {
  // TODO: Get from database
  const mockProfile = {
    id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Instagram automation enthusiast and content creator',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    avatar: '',
    timezone: 'America/Los_Angeles',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      automation: true,
      billing: true
    },
    privacy: {
      profileVisible: true,
      dataSharing: false,
      analytics: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json(mockProfile);
});

app.put('/api/user/profile', (req, res) => {
  const profileData = req.body;
  
  // TODO: Update in database
  const updatedProfile = {
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    profile: updatedProfile
  });
});

// Billing API
app.get('/api/billing/subscription', (req, res) => {
  // TODO: Get from database
  const mockSubscription = {
    currentPlan: 'pro',
    nextBilling: '2024-02-15',
    amount: 29.99,
    status: 'active',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa'
    }
  };
  
  res.json(mockSubscription);
});

app.get('/api/billing/invoices', (req, res) => {
  // TODO: Get from database
  const mockInvoices = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: 29.99,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: 29.99,
      status: 'paid',
      downloadUrl: '#'
    }
  ];
  
  res.json(mockInvoices);
});

app.post('/api/billing/subscribe', (req, res) => {
  const { planId, paymentMethod } = req.body;
  
  // TODO: Process payment and create subscription
  const mockSubscription = {
    success: true,
    subscription: {
      id: 'sub_' + Date.now(),
      planId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: planId === 'free' ? 0 : planId === 'pro' ? 29.99 : 99.99
    }
  };
  
  res.json(mockSubscription);
});

app.post('/api/billing/cancel', (req, res) => {
  // TODO: Cancel subscription in database
  res.json({
    success: true,
    message: 'Subscription cancelled successfully'
  });
});

app.get('/api/billing/plans', (req, res) => {
  // TODO: Get from database
  const mockPlans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started with basic automation',
      price: 0,
      interval: 'month',
      features: [
        'Up to 5 automations',
        '1 Instagram account',
        'Basic templates',
        'Community support',
        'Mobile app access'
      ],
      limits: {
        automations: 5,
        accounts: 1,
        templates: 10,
        apiCalls: 1000
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Most popular for content creators and small businesses',
      price: 29.99,
      interval: 'month',
      features: [
        'Unlimited automations',
        'Up to 3 Instagram accounts',
        'Advanced templates & replies',
        'Priority support',
        'Analytics dashboard',
        'Custom triggers',
        'Export/Import data'
      ],
      limits: {
        automations: -1,
        accounts: 3,
        templates: -1,
        apiCalls: 10000
      },
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For agencies and growing businesses',
      price: 99.99,
      interval: 'month',
      features: [
        'Everything in Pro',
        'Up to 10 Instagram accounts',
        'Team collaboration',
        'White-label options',
        'Advanced analytics',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      limits: {
        automations: -1,
        accounts: 10,
        templates: -1,
        apiCalls: 50000
      }
    }
  ];
  
  res.json(mockPlans);
});

// Save reel automation
app.post('/api/automation/reel/:id', (req, res) => {
  const { id } = req.params;
  const { 
    comment, 
    schedule, 
    followBefore,
    customButtons,
    customLinks,
    triggerWords,
    commentReplies,
    delay,
    conditions
  } = req.body;
  
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  store.reels[id] = {
    id,
    comment,
    schedule: schedule || null,
    followBefore: followBefore || false,
    customButtons: customButtons || [],
    customLinks: customLinks || [],
    triggerWords: triggerWords || [],
    commentReplies: commentReplies || [],
    delay: delay || 0,
    conditions: conditions || {
      minFollowers: 0,
      maxFollowers: 0,
      hasBio: false,
      verified: false
    },
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
  const { 
    dm, 
    schedule, 
    followBefore,
    customButtons,
    customLinks,
    triggerWords,
    commentReplies,
    delay,
    conditions
  } = req.body;
  
  if (!dm) {
    return res.status(400).json({ error: 'DM message is required' });
  }
  
  store.stories[id] = {
    id,
    dm,
    schedule: schedule || null,
    followBefore: followBefore || false,
    customButtons: customButtons || [],
    customLinks: customLinks || [],
    triggerWords: triggerWords || [],
    commentReplies: commentReplies || [],
    delay: delay || 0,
    conditions: conditions || {
      minFollowers: 0,
      maxFollowers: 0,
      hasBio: false,
      verified: false
    },
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