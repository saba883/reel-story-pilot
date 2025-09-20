import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Shield, Zap, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Import mock API dynamically to avoid build issues if backend is preferred
      const { mockApi } = await import('@/lib/mockApi');
      const data = await mockApi.mockConnect();
      
      if (data.token) {
        localStorage.setItem('insta-auto-token', data.token);
        localStorage.setItem('insta-auto-user', JSON.stringify(data.user));
        toast({
          title: "Connected successfully!",
          description: "Welcome to InstaAuto demo",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-instagram rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">InstaAuto</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 pb-20">
        <div className="max-w-md mx-auto text-center pt-12 pb-8">
          <div className="w-20 h-20 bg-gradient-instagram rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Instagram Automation
            <span className="block text-lg font-normal text-muted-foreground mt-2">
              Demo - Privacy First
            </span>
          </h1>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Automate comments on Reels and DMs for Stories. 
            This is a privacy-first demo with no real Instagram connection.
          </p>

          <Button 
            onClick={handleConnect}
            disabled={connecting}
            className="w-full h-touch bg-gradient-instagram hover:opacity-90 text-white font-semibold rounded-xl mb-6"
          >
            {connecting ? "Connecting..." : "Connect Instagram (Demo)"}
          </Button>
        </div>

        {/* Features */}
        <div className="max-w-md mx-auto space-y-4">
          <Card className="border-0 shadow-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    All data stored locally. No cloud storage or real Instagram connection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up auto-comments for Reels and auto-DMs for Stories in seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Test & Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in testing tools and export/import for easy demo sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;