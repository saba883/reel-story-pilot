import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  TestTube, 
  Trash2, 
  Play, 
  Instagram, 
  UserPlus, 
  Link, 
  Hash,
  Plus,
  X,
  Settings,
  Clock,
  Target,
  Reply,
  Shuffle,
  FileText,
  BookOpen,
  Heart,
  MoreHorizontal,
  Bookmark
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MessageTemplateModal } from "./MessageTemplateModal";

interface AutomationPanelProps {
  type: 'reel' | 'story';
  item: any;
  existingAutomation?: {
    comment?: string;
    dm?: string;
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
  };
  onSave: (data: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const AutomationPanel = ({ 
  type, 
  item, 
  existingAutomation, 
  onSave, 
  onDelete, 
  onClose 
}: AutomationPanelProps) => {
  const [text, setText] = useState("");
  const [followBefore, setFollowBefore] = useState(false);
  const [customButtons, setCustomButtons] = useState<Array<{text: string, action: string}>>([]);
  const [customLinks, setCustomLinks] = useState<Array<{url: string, text: string}>>([]);
  const [triggerWords, setTriggerWords] = useState<string[]>([]);
  const [commentReplies, setCommentReplies] = useState<string[]>([]);
  const [delay, setDelay] = useState(0);
  const [conditions, setConditions] = useState({
    minFollowers: 0,
    maxFollowers: 0,
    hasBio: false,
    verified: false
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);

  useEffect(() => {
    if (existingAutomation) {
      setText(existingAutomation.comment || existingAutomation.dm || "");
      setFollowBefore(existingAutomation.followBefore || false);
      setCustomButtons(existingAutomation.customButtons || []);
      setCustomLinks(existingAutomation.customLinks || []);
      setTriggerWords(existingAutomation.triggerWords || []);
      setCommentReplies(existingAutomation.commentReplies || []);
      setDelay(existingAutomation.delay || 0);
      setConditions(existingAutomation.conditions || {
        minFollowers: 0,
        maxFollowers: 0,
        hasBio: false,
        verified: false
      });
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

    const data = {
      [type === 'reel' ? 'comment' : 'dm']: text,
      schedule: null,
      followBefore,
      customButtons: customButtons.filter(btn => btn.text.trim() && btn.action.trim()),
      customLinks: customLinks.filter(link => link.url.trim() && link.text.trim()),
      triggerWords: triggerWords.filter(word => word.trim()),
      commentReplies: commentReplies.filter(reply => reply.trim()),
      delay,
      conditions
    };
    
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
    
    const action = type === 'reel' ? 'comment' : 'DM';
    const followText = followBefore ? " (after following)" : "";
    const buttonText = customButtons.length > 0 ? ` with ${customButtons.length} custom button(s)` : "";
    const linkText = customLinks.length > 0 ? ` with ${customLinks.length} custom link(s)` : "";
    const triggerText = triggerWords.length > 0 ? ` triggered by: ${triggerWords.join(', ')}` : "";
    const replyText = commentReplies.length > 0 ? ` with ${commentReplies.length} reply option(s)` : "";
    
    // For reels, show which reply would be randomly selected
    const selectedReply = type === 'reel' && commentReplies.length > 0 
      ? commentReplies[Math.floor(Math.random() * commentReplies.length)]
      : text;
    
    toast({
      title: "Test simulation complete!",
      description: `Would send ${action}${followText}${buttonText}${linkText}${triggerText}${replyText}: "${selectedReply}" to @${item.owner}`,
    });
  };

  const addCustomButton = () => {
    setCustomButtons([...customButtons, { text: '', action: '' }]);
  };

  const removeCustomButton = (index: number) => {
    setCustomButtons(customButtons.filter((_, i) => i !== index));
  };

  const updateCustomButton = (index: number, field: 'text' | 'action', value: string) => {
    const updated = [...customButtons];
    updated[index][field] = value;
    setCustomButtons(updated);
  };

  const addCustomLink = () => {
    setCustomLinks([...customLinks, { url: '', text: '' }]);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const updateCustomLink = (index: number, field: 'url' | 'text', value: string) => {
    const updated = [...customLinks];
    updated[index][field] = value;
    setCustomLinks(updated);
  };

  const addTriggerWord = () => {
    setTriggerWords([...triggerWords, '']);
  };

  const removeTriggerWord = (index: number) => {
    setTriggerWords(triggerWords.filter((_, i) => i !== index));
  };

  const updateTriggerWord = (index: number, value: string) => {
    const updated = [...triggerWords];
    updated[index] = value;
    setTriggerWords(updated);
  };

  const addCommentReply = () => {
    setCommentReplies([...commentReplies, '']);
  };

  const removeCommentReply = (index: number) => {
    setCommentReplies(commentReplies.filter((_, i) => i !== index));
  };

  const updateCommentReply = (index: number, value: string) => {
    const updated = [...commentReplies];
    updated[index] = value;
    setCommentReplies(updated);
  };

  const handleSelectTemplate = (template: any) => {
    setText(template.content);
    toast({
      title: "Template applied",
      description: `"${template.name}" template loaded`,
    });
  };

  const maxLength = 500;
  const remainingChars = maxLength - text.length;

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {type === 'reel' ? <MessageCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            {type === 'reel' ? 'Auto-Comment' : 'Auto-DM'} Setup
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
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

          {/* Feature Overview */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">Automation Features Available</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow Before
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Templates
                    </Badge>
                    {type === 'reel' && (
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        <Shuffle className="w-3 h-3 mr-1" />
                        Random Replies
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      <Settings className="w-3 h-3 mr-1" />
                      Custom Buttons
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      <Target className="w-3 h-3 mr-1" />
                      Advanced Rules
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Switch between Basic and Advanced tabs to configure all features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'basic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('basic')}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Basic Options
            </Button>
            <Button
              variant={activeTab === 'advanced' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('advanced')}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Advanced Features
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFollowBefore(!followBefore)}
              className={`flex items-center gap-2 ${followBefore ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
            >
              <UserPlus className="w-4 h-4" />
              {followBefore ? 'Following Enabled' : 'Enable Follow'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Use Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              className="flex items-center gap-2 col-span-2"
            >
              {showDeviceFrame ? 'Hide' : 'Show'} Device Frame
            </Button>
          </div>

          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Follow Before Option */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Follow Before Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Follow before engaging</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically follow the account before sending {type === 'reel' ? 'comment' : 'DM'}
                      </p>
                    </div>
                    <Switch
                      checked={followBefore}
                      onCheckedChange={setFollowBefore}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Text Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="automation-text">
                    {type === 'reel' ? 'Comment Text' : 'DM Message'}
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTemplateModal(true)}
                    className="text-xs"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Templates
                  </Button>
                </div>
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

              {/* Comment Replies - Only for Reels */}
              {type === 'reel' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Reply className="w-4 h-4" />
                        Comment Replies
                        <Badge variant="outline" className="text-xs">
                          <Shuffle className="w-3 h-3 mr-1" />
                          Random
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={addCommentReply}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Add multiple reply options. One will be randomly selected for each comment.
                    </p>
                    {commentReplies.map((reply, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Reply option"
                          value={reply}
                          onChange={(e) => updateCommentReply(index, e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCommentReply(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {commentReplies.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No reply options configured. Add replies for random selection.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Delay Setting */}
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (seconds)</Label>
                <Select value={delay.toString()} onValueChange={(value) => setDelay(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              {/* Custom Buttons */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Custom Buttons
                    </div>
                    <Button size="sm" variant="outline" onClick={addCustomButton}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {customButtons.map((button, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Button text"
                        value={button.text}
                        onChange={(e) => updateCustomButton(index, 'text', e.target.value)}
                      />
                      <Select
                        value={button.action}
                        onValueChange={(value) => updateCustomButton(index, 'action', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="like">Like</SelectItem>
                          <SelectItem value="follow">Follow</SelectItem>
                          <SelectItem value="share">Share</SelectItem>
                          <SelectItem value="save">Save</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCustomButton(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {customButtons.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No custom buttons configured
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Custom Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Custom Links
                    </div>
                    <Button size="sm" variant="outline" onClick={addCustomLink}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {customLinks.map((link, index) => (
                    <div key={index} className="space-y-2">
                      <Input
                        placeholder="Link text"
                        value={link.text}
                        onChange={(e) => updateCustomLink(index, 'text', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={link.url}
                          onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomLink(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customLinks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No custom links configured
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Trigger Words */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Trigger Words
                    </div>
                    <Button size="sm" variant="outline" onClick={addTriggerWord}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {triggerWords.map((word, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Trigger word"
                        value={word}
                        onChange={(e) => updateTriggerWord(index, e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTriggerWord(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {triggerWords.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No trigger words configured
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Conditions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Target Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="min-followers">Min Followers</Label>
                      <Input
                        id="min-followers"
                        type="number"
                        value={conditions.minFollowers}
                        onChange={(e) => setConditions({...conditions, minFollowers: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-followers">Max Followers</Label>
                      <Input
                        id="max-followers"
                        type="number"
                        value={conditions.maxFollowers}
                        onChange={(e) => setConditions({...conditions, maxFollowers: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Has Bio</p>
                        <p className="text-xs text-muted-foreground">Target accounts with bio</p>
                      </div>
                      <Switch
                        checked={conditions.hasBio}
                        onCheckedChange={(checked) => setConditions({...conditions, hasBio: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Verified Only</p>
                        <p className="text-xs text-muted-foreground">Target verified accounts only</p>
                      </div>
                      <Switch
                        checked={conditions.verified}
                        onCheckedChange={(checked) => setConditions({...conditions, verified: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <Card className="border-0 bg-muted/30">
              <CardContent className="p-3">
                {/* Mobile mock: Instagram-like card */}
                <div className={`${showDeviceFrame ? 'mx-auto w-full max-w-[360px] rounded-3xl border shadow-sm' : 'mx-auto w-full max-w-[360px]'} bg-background overflow-hidden`}>
                  {/* Header (story shows bar) */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-instagram rounded-full" />
                      <div>
                        <p className="text-sm font-semibold truncate">@{item.owner}</p>
                        <p className="text-[10px] text-muted-foreground">Now</p>
                      </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {type === 'story' && (
                    <div className="mx-3 mb-2 h-1 rounded-full bg-muted">
                      <div className="h-1 w-1/3 rounded-full bg-white/70" />
                    </div>
                  )}

                  {/* Media */}
                  <div className={`relative ${type === 'story' ? 'bg-black' : 'bg-muted'}`} style={{aspectRatio: '1/1'}}>
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                      {type === 'reel' ? 'Reel preview' : 'Story preview'}
                    </div>
                    {!!item?.thumbnail && (
                      <img src={item.thumbnail} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    )}
                  </div>

                  {/* Actions (hide for story to mimic viewer) */}
                  {type === 'reel' && (
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5" />
                        <MessageCircle className="w-5 h-5" />
                        <Send className="w-5 h-5" />
                      </div>
                      <Bookmark className="w-5 h-5" />
                    </div>
                  )}

                  {/* Caption (reel only) */}
                  {type === 'reel' && (
                    <div className="px-3 pb-2">
                      <p className="text-sm"><span className="font-semibold">@{item.owner}</span> {item.caption}</p>
                    </div>
                  )}

                  {/* Automation message preview */}
                  <div className="px-3 pb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-instagram rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">You</span>
                      </div>
                      <div className="flex-1">
                        <div className={`inline-block rounded-2xl ${type === 'story' ? 'bg-white text-black' : 'bg-muted'} px-3 py-2 text-sm`}>
                          {(type === 'reel' && commentReplies.length > 0)
                            ? commentReplies[Math.floor(Math.random() * commentReplies.length)]
                            : (text.trim() || (type === 'reel' ? 'Your comment will appear here…' : 'Your DM will appear here…'))}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {followBefore && (
                            <Badge variant="outline" className="text-[10px]">
                              <UserPlus className="w-3 h-3 mr-1" /> follow first
                            </Badge>
                          )}
                          {delay > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                              <Clock className="w-3 h-3 mr-1" /> delay {delay}s
                            </Badge>
                          )}
                          {customButtons.length > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                              <Settings className="w-3 h-3 mr-1" /> {customButtons.length} btn
                            </Badge>
                          )}
                          {customLinks.length > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                              <Link className="w-3 h-3 mr-1" /> {customLinks.length} link
                            </Badge>
                          )}
                          {triggerWords.length > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                              <Hash className="w-3 h-3 mr-1" /> {triggerWords.length} trigger
                            </Badge>
                          )}
                        </div>
                        {(conditions.minFollowers || conditions.maxFollowers || conditions.hasBio || conditions.verified) && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {conditions.minFollowers ? (
                              <Badge variant="secondary" className="text-[10px]">min {conditions.minFollowers}</Badge>
                            ) : null}
                            {conditions.maxFollowers ? (
                              <Badge variant="secondary" className="text-[10px]">max {conditions.maxFollowers}</Badge>
                            ) : null}
                            {conditions.hasBio ? (
                              <Badge variant="secondary" className="text-[10px]">has bio</Badge>
                            ) : null}
                            {conditions.verified ? (
                              <Badge variant="secondary" className="text-[10px]">verified</Badge>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleTest}
              className="w-full"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test Simulation
            </Button>
            
            <div className="flex gap-2">
              {existingAutomation && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-gradient-instagram text-white">
                Save Automation
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
      
      {/* Message Template Modal */}
      <MessageTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
        type={type}
      />
    </Sheet>
  );
};
