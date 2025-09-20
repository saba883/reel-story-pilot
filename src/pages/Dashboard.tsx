import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, LogOut, Play, Clock, MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AutomationModal } from "@/components/AutomationModal";
import { BottomNav } from "@/components/BottomNav";

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
  reels: Record<string, { comment: string; schedule?: string }>;
  stories: Record<string, { dm: string; schedule?: string }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<Reel[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [automations, setAutomations] = useState<Automation>({ reels: {}, stories: {} });
  const [selectedItem, setSelectedItem] = useState<{type: 'reel' | 'story', item: Reel | Story} | null>(null);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('insta-auto-token');
    const userData = localStorage.getItem('insta-auto-user');
    
    if (!token) {
      navigate('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Use mock API for frontend-only demo
      const { mockApi } = await import('@/lib/mockApi');
      const [reelsData, storiesData, automationData] = await Promise.all([
        mockApi.getReels(),
        mockApi.getStories(),
        mockApi.getAutomations()
      ]);

      setReels(reelsData);
      setStories(storiesData);
      setAutomations(automationData);
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('insta-auto-token');
    localStorage.removeItem('insta-auto-user');
    navigate('/');
  };

  const handleSaveAutomation = async (type: 'reel' | 'story', id: string, data: any) => {
    try {
      const { mockApi } = await import('@/lib/mockApi');
      
      if (type === 'reel') {
        await mockApi.saveReelAutomation(id, data);
      } else {
        await mockApi.saveStoryAutomation(id, data);
      }

      // Optimistic update
      setAutomations(prev => ({
        ...prev,
        [type === 'reel' ? 'reels' : 'stories']: {
          ...prev[type === 'reel' ? 'reels' : 'stories'],
          [id]: data
        }
      }));
      
      toast({
        title: `Auto-${type === 'reel' ? 'comment' : 'DM'} saved!`,
        description: "Automation is now active",
      });
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAutomation = async (type: 'reel' | 'story', id: string) => {
    try {
      const { mockApi } = await import('@/lib/mockApi');
      
      if (type === 'reel') {
        await mockApi.deleteReelAutomation(id);
      } else {
        await mockApi.deleteStoryAutomation(id);
      }

      setAutomations(prev => {
        const newAutomations = { ...prev };
        const key = type === 'reel' ? 'reels' : 'stories';
        delete newAutomations[key][id];
        return newAutomations;
      });
      
      toast({
        title: "Automation removed",
        description: `Auto-${type === 'reel' ? 'comment' : 'DM'} deleted`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-instagram rounded-xl flex items-center justify-center mx-auto mb-4">
            <Instagram className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-instagram rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">InstaAuto</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-instagram text-white text-sm">
              {user?.name?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Tabs defaultValue="reels" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reels">Reels</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reels" className="space-y-4 mt-4">
            {reels.map((reel) => (
              <Card 
                key={reel.id} 
                className="border-0 shadow-card rounded-2xl cursor-pointer active:scale-95 transition-transform"
                onClick={() => setSelectedItem({ type: 'reel', item: reel })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gradient-instagram rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{reel.caption}</h3>
                        {automations.reels[reel.id] && (
                          <Badge variant="secondary" className="ml-2">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Auto-comment
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{reel.owner}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{reel.duration}s</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="stories" className="space-y-4 mt-4">
            {stories.map((story) => (
              <Card 
                key={story.id} 
                className="border-0 shadow-card rounded-2xl cursor-pointer active:scale-95 transition-transform"
                onClick={() => setSelectedItem({ type: 'story', item: story })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gradient-instagram rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{story.caption}</h3>
                        {automations.stories[story.id] && (
                          <Badge variant="secondary" className="ml-2">
                            <Send className="w-3 h-3 mr-1" />
                            Auto-DM
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{story.owner}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(story.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal */}
      {selectedItem && (
        <AutomationModal
          type={selectedItem.type}
          item={selectedItem.item}
          existingAutomation={
            selectedItem.type === 'reel' 
              ? automations.reels[selectedItem.item.id]
              : automations.stories[selectedItem.item.id]
          }
          onSave={(data) => handleSaveAutomation(selectedItem.type, selectedItem.item.id, data)}
          onDelete={() => handleDeleteAutomation(selectedItem.type, selectedItem.item.id)}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;