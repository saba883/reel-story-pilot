import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, LogOut, Play, Clock, MessageCircle, Send, UserPlus, Settings, Reply, Shuffle, User, CreditCard, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AutomationPanel } from "@/components/AutomationPanel";
import { BottomNav } from "@/components/BottomNav";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingPricing } from "@/components/BillingPricing";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<Reel[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [automations, setAutomations] = useState<Automation>({ reels: {}, stories: {} });
  const [selectedItem, setSelectedItem] = useState<{type: 'reel' | 'story', item: Reel | Story} | null>(null);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showBillingPricing, setShowBillingPricing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('pro');

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
      const [reelsRes, storiesRes, automationsRes] = await Promise.all([
        fetch('/api/reels'),
        fetch('/api/stories'),
        fetch('/api/automation')
      ]);
      const [reelsData, storiesData, automationData] = await Promise.all([
        reelsRes.json(),
        storiesRes.json(),
        automationsRes.json()
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
      const endpoint = type === 'reel' ? `/api/automation/reel/${id}` : `/api/automation/story/${id}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');

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
      const endpoint = type === 'reel' ? `/api/automation/reel/${id}` : `/api/automation/story/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

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
          <Badge variant="outline" className="ml-2">
            <Crown className="w-3 h-3 mr-1" />
            {currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Business'}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBillingPricing(true)}
            className="hidden sm:flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Billing
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-instagram text-white text-sm">
                    {user?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user?.name || 'Demo User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'demo@example.com'}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowBillingPricing(true)}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing & Pricing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-card rounded-2xl cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowProfileSettings(true)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Profile Settings</h3>
                  <p className="text-xs text-muted-foreground">Manage your account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card rounded-2xl cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowBillingPricing(true)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Billing & Pricing</h3>
                  <p className="text-xs text-muted-foreground">Manage subscription</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card rounded-2xl cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/settings')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">All Settings</h3>
                  <p className="text-xs text-muted-foreground">Complete settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                          <div className="flex gap-1 ml-2">
                            <Badge variant="secondary">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Auto-comment
                            </Badge>
                            {automations.reels[reel.id].followBefore && (
                              <Badge variant="outline" className="text-xs">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Follow
                              </Badge>
                            )}
                            {automations.reels[reel.id].customButtons?.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Settings className="w-3 h-3 mr-1" />
                                {automations.reels[reel.id].customButtons.length} btn
                              </Badge>
                            )}
                            {automations.reels[reel.id].commentReplies?.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Shuffle className="w-3 h-3 mr-1" />
                                {automations.reels[reel.id].commentReplies.length} replies
                              </Badge>
                            )}
                          </div>
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
                          <div className="flex gap-1 ml-2">
                            <Badge variant="secondary">
                              <Send className="w-3 h-3 mr-1" />
                              Auto-DM
                            </Badge>
                            {automations.stories[story.id].followBefore && (
                              <Badge variant="outline" className="text-xs">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Follow
                              </Badge>
                            )}
                            {automations.stories[story.id].customButtons?.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Settings className="w-3 h-3 mr-1" />
                                {automations.stories[story.id].customButtons.length} btn
                              </Badge>
                            )}
                          </div>
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

      {/* Automation Panel */}
      {selectedItem && (
        <AutomationPanel
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

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProfileSettings onClose={() => setShowProfileSettings(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Billing & Pricing Modal */}
      {showBillingPricing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <BillingPricing onClose={() => setShowBillingPricing(false)} />
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;