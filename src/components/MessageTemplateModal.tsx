import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  Send, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  Copy,
  FileText,
  Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'comment' | 'dm';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface MessageTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MessageTemplate) => void;
  type: 'comment' | 'dm';
}

export const MessageTemplateModal = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate, 
  type 
}: MessageTemplateModalProps) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MessageTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  
  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const categories = ['greeting', 'engagement', 'promotion', 'thanks', 'question', 'custom'];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery]);

  const loadTemplates = () => {
    const stored = localStorage.getItem('message-templates');
    if (stored) {
      const parsedTemplates = JSON.parse(stored);
      const typeTemplates = parsedTemplates.filter((t: MessageTemplate) => t.type === type);
      setTemplates(typeTemplates);
    } else {
      // Load default templates
      const defaultTemplates: MessageTemplate[] = [
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
          id: '3',
          name: 'Amazing Tips',
          content: 'Amazing tips! 💯',
          type: 'comment',
          category: 'engagement',
          tags: ['positive', 'tips'],
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
        },
        {
          id: '5',
          name: 'Great Story',
          content: 'Great story! 🔥',
          type: 'dm',
          category: 'engagement',
          tags: ['positive', 'story'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      const typeTemplates = defaultTemplates.filter(t => t.type === type);
      setTemplates(typeTemplates);
      saveTemplates(defaultTemplates);
    }
  };

  const saveTemplates = (templatesToSave: MessageTemplate[]) => {
    localStorage.setItem('message-templates', JSON.stringify(templatesToSave));
  };

  const filterTemplates = () => {
    let filtered = templates;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTemplates(filtered);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: MessageTemplate = {
      id: Date.now().toString(),
      name: templateName,
      content: templateContent,
      type,
      category: templateCategory || 'custom',
      tags: templateTags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allTemplates = JSON.parse(localStorage.getItem('message-templates') || '[]');
    allTemplates.push(newTemplate);
    saveTemplates(allTemplates);
    
    setTemplates(prev => [...prev, newTemplate]);
    resetForm();
    setShowCreateForm(false);
    
    toast({
      title: "Template created successfully!",
      description: `"${templateName}" template saved`,
    });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !templateName.trim() || !templateContent.trim()) {
      return;
    }

    const updatedTemplate: MessageTemplate = {
      ...editingTemplate,
      name: templateName,
      content: templateContent,
      category: templateCategory || 'custom',
      tags: templateTags,
      updatedAt: new Date().toISOString()
    };

    const allTemplates = JSON.parse(localStorage.getItem('message-templates') || '[]');
    const index = allTemplates.findIndex((t: MessageTemplate) => t.id === editingTemplate.id);
    if (index !== -1) {
      allTemplates[index] = updatedTemplate;
      saveTemplates(allTemplates);
    }

    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
    resetForm();
    setEditingTemplate(null);
    
    toast({
      title: "Template updated successfully!",
      description: `"${templateName}" template saved`,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const allTemplates = JSON.parse(localStorage.getItem('message-templates') || '[]');
    const updatedTemplates = allTemplates.filter((t: MessageTemplate) => t.id !== templateId);
    saveTemplates(updatedTemplates);
    
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    
    toast({
      title: "Template deleted",
      description: "Template removed successfully",
    });
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateContent(template.content);
    setTemplateCategory(template.category);
    setTemplateTags(template.tags);
    setShowCreateForm(true);
  };

  const addTag = () => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateContent('');
    setTemplateCategory('');
    setTemplateTags([]);
    setNewTag('');
    setEditingTemplate(null);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Template content copied",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl mx-4 rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {type === 'comment' ? 'Comment' : 'DM'} Templates
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {editingTemplate ? 'Edit Template' : 'Create New Template'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Great Content"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Select value={templateCategory} onValueChange={setTemplateCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="template-content">Template Content</Label>
                  <Textarea
                    id="template-content"
                    placeholder="Enter your message template..."
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {templateTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { resetForm(); setShowCreateForm(false); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                    className="flex-1"
                  >
                    {editingTemplate ? 'Update' : 'Create'} Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(template.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelectTemplate(template);
                          onClose();
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No templates match your search' 
                    : 'No templates found'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
