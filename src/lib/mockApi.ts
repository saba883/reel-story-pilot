// Frontend-only mock API for demo purposes
// This replaces the need for a backend server during development

interface Reel {
  id: string;
  thumbnail: string;
  caption: string;
  owner: string;
  duration: number;
}

interface Story {
  id: string;
  thumbnail: string;
  caption: string;
  owner: string;
  expires_at: string;
}

interface Automation {
  reels: Record<string, { 
    comment: string; 
    schedule?: string; 
    id?: string; 
    createdAt?: string; 
    updatedAt?: string;
    followBefore?: boolean;
    customButtons?: Array<{text: string, action: string}>;
    customLinks?: Array<{url: string, text: string}>;
    triggerWords?: string[];
    commentReplies?: string[];
    delay?: number;
    conditions?: {
      minFollowers?: number;
      maxFollowers?: number;
      hasBio?: boolean;
      verified?: boolean;
    };
  }>;
  stories: Record<string, { 
    dm: string; 
    schedule?: string; 
    id?: string; 
    createdAt?: string; 
    updatedAt?: string;
    followBefore?: boolean;
    customButtons?: Array<{text: string, action: string}>;
    customLinks?: Array<{url: string, text: string}>;
    triggerWords?: string[];
    commentReplies?: string[];
    delay?: number;
    conditions?: {
      minFollowers?: number;
      maxFollowers?: number;
      hasBio?: boolean;
      verified?: boolean;
    };
  }>;
}

// Mock data
const mockReels: Reel[] = [
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

const mockStories: Story[] = [
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

// Storage helpers
const getAutomations = (): Automation => {
  const stored = localStorage.getItem('instaauto-automations');
  return stored ? JSON.parse(stored) : { reels: {}, stories: {} };
};

const saveAutomations = (automations: Automation) => {
  localStorage.setItem('instaauto-automations', JSON.stringify(automations));
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth
  async mockConnect() {
    await delay(800); // Simulate network delay
    const mockUser = {
      id: 'demo-user-123',
      name: 'Demo User'
    };
    
    const token = 'demo-token-' + Date.now();
    
    return {
      token,
      user: mockUser
    };
  },

  // Content
  async getReels() {
    await delay(500);
    return mockReels;
  },

  async getStories() {
    await delay(500);
    return mockStories;
  },

  // Automations
  async getAutomations() {
    await delay(300);
    return getAutomations();
  },

  async saveReelAutomation(id: string, data: any) {
    await delay(400);
    const automations = getAutomations();
    automations.reels[id] = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveAutomations(automations);
    
    return {
      success: true,
      reelId: id,
      automation: automations.reels[id]
    };
  },

  async saveStoryAutomation(id: string, data: any) {
    await delay(400);
    const automations = getAutomations();
    automations.stories[id] = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveAutomations(automations);
    
    return {
      success: true,
      storyId: id,
      automation: automations.stories[id]
    };
  },

  async deleteReelAutomation(id: string) {
    await delay(300);
    const automations = getAutomations();
    delete automations.reels[id];
    saveAutomations(automations);
    
    return { success: true, message: 'Reel automation deleted' };
  },

  async deleteStoryAutomation(id: string) {
    await delay(300);
    const automations = getAutomations();
    delete automations.stories[id];
    saveAutomations(automations);
    
    return { success: true, message: 'Story automation deleted' };
  }
};