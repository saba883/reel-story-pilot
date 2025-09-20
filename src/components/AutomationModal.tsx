import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, TestTube, Trash2, Play, Instagram } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AutomationModalProps {
  type: 'reel' | 'story';
  item: any;
  existingAutomation?: { comment?: string; dm?: string; schedule?: string };
  onSave: (data: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const AutomationModal = ({ 
  type, 
  item, 
  existingAutomation, 
  onSave, 
  onDelete, 
  onClose 
}: AutomationModalProps) => {
  const [text, setText] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);

  useEffect(() => {
    if (existingAutomation) {
      setText(existingAutomation.comment || existingAutomation.dm || "");
    }
  }, [existingAutomation]);

  const handleSave = () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        variant: "destructive",
      });
      return;
    }

    const data = type === 'reel' 
      ? { comment: text, schedule: null }
      : { dm: text, schedule: null };
    
    onSave(data);
  };

  const handleTest = () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text to test",
        variant: "destructive",
      });
      return;
    }
    setShowTestModal(true);
  };

  const simulateTest = () => {
    const action = type === 'reel' ? 'comment' : 'DM';
    toast({
      title: "Test simulation complete!",
      description: `Would send ${action}: "${text}" to @${item.owner}`,
    });
    setShowTestModal(false);
  };

  const maxLength = 500;
  const remainingChars = maxLength - text.length;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {type === 'reel' ? <MessageCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              {type === 'reel' ? 'Auto-Comment' : 'Auto-DM'} Setup
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Item Preview */}
            <Card className="border-0 bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-instagram rounded-xl flex items-center justify-center">
                    {type === 'reel' ? (
                      <Play className="w-5 h-5 text-white" />
                    ) : (
                      <Instagram className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.caption}</h4>
                    <p className="text-sm text-muted-foreground">@{item.owner}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="automation-text">
                {type === 'reel' ? 'Comment Text' : 'DM Message'}
              </Label>
              <Textarea
                id="automation-text"
                placeholder={type === 'reel' 
                  ? "Great content! 👏" 
                  : "Thanks for the story! 💯"
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={maxLength}
                className="min-h-20 resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {type === 'reel' ? 'This comment will be posted automatically' : 'This DM will be sent automatically'}
                </p>
                <Badge variant={remainingChars < 50 ? "destructive" : "secondary"}>
                  {remainingChars} chars left
                </Badge>
              </div>
            </div>

            {/* Live Preview */}
            {text && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="border-0 bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-instagram rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">D</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Demo User</p>
                        <p className="text-sm">{text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleTest}
                className="flex-1"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test
              </Button>
              
              {existingAutomation && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-gradient-instagram text-white">
                Save Automation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Modal */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Simulation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="border-0 bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Simulation Log</h4>
                <div className="space-y-2 text-sm font-mono">
                  <p>✓ Target: @{item.owner}</p>
                  <p>✓ {type === 'reel' ? 'Comment' : 'DM'}: "{text}"</p>
                  <p>✓ Action: Would send {type === 'reel' ? 'comment' : 'DM'}</p>
                  <p className="text-muted-foreground">
                    (No real {type === 'reel' ? 'comment' : 'message'} sent - this is a demo)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTestModal(false)} className="flex-1">
                Close
              </Button>
              <Button onClick={simulateTest} className="flex-1">
                Run Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};