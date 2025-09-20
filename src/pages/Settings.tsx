import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Shield, Info, Instagram, FileText, BookOpen, User, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/BottomNav";
import { MessageTemplateModal } from "@/components/MessageTemplateModal";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingPricing } from "@/components/BillingPricing";

const Settings = () => {
  const [importing, setImporting] = useState(false);
  const [showCommentTemplates, setShowCommentTemplates] = useState(false);
  const [showDMTemplates, setShowDMTemplates] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showBillingPricing, setShowBillingPricing] = useState(false);

  const handleExport = async () => {
    try {
      const { mockApi } = await import('@/lib/mockApi');
      const data = await mockApi.getAutomations();
      
      const exportData = {
        timestamp: new Date().toISOString(),
        automations: data,
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instaauto-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful!",
        description: "Automations exported to file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.automations) {
        throw new Error('Invalid file format');
      }

      // TODO: Import to backend
      toast({
        title: "Import successful!",
        description: "Automations imported successfully",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid file format",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const user = JSON.parse(localStorage.getItem('insta-auto-user') || '{}');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-instagram rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Settings</span>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Demo Info */}
        <Card className="border-0 shadow-card rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Demo Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connected User</span>
              <Badge variant="secondary">{user.name || 'Demo User'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Type</span>
              <Badge variant="outline">Mock OAuth</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Storage</span>
              <Badge variant="outline">Local Only</Badge>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              This is a privacy-first demo. No real Instagram connection is made, 
              and all data is stored locally in your browser and backend memory.
            </p>
          </CardContent>
        </Card>

        {/* Account Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-card rounded-2xl cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowProfileSettings(true)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Profile Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account information and preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card rounded-2xl cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowBillingPricing(true)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Billing & Pricing</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Templates */}
        <Card className="border-0 shadow-card rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Message Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create and manage reusable message templates for comments and DMs.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCommentTemplates(true)}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Comment Templates
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDMTemplates(true)}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                DM Templates
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Templates help you maintain consistent messaging across all your automations.
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-0 shadow-card rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">Local Storage Only</p>
                  <p className="text-xs text-muted-foreground">
                    All automations stored in browser localStorage and backend memory
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">No Real API Calls</p>
                  <p className="text-xs text-muted-foreground">
                    Demo uses mock data - no Instagram account access
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">Session-Only Data</p>
                  <p className="text-xs text-muted-foreground">
                    Backend data resets when server restarts
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-0 shadow-card rounded-2xl">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="export" className="text-sm font-medium">
                Export Automations
              </Label>
              <Button 
                onClick={handleExport}
                variant="outline" 
                className="w-full mt-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Download all your automations as JSON file
              </p>
            </div>

            <div>
              <Label htmlFor="import" className="text-sm font-medium">
                Import Automations
              </Label>
              <div className="mt-2">
                <Input
                  id="import"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('import')?.click()}
                  disabled={importing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? 'Importing...' : 'Import JSON'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Restore automations from exported file
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-0 shadow-card rounded-2xl">
          <CardHeader>
            <CardTitle>About InstaAuto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Version:</strong> 1.0.0 Demo
              </p>
              <p>
                <strong>Purpose:</strong> Instagram automation prototype
              </p>
              <p>
                <strong>Architecture:</strong> Privacy-first, pluggable design
              </p>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Ready for real Instagram integration with clear placeholder markers. 
                Perfect for product demos and validation.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Template Modals */}
      <MessageTemplateModal
        isOpen={showCommentTemplates}
        onClose={() => setShowCommentTemplates(false)}
        onSelectTemplate={() => {}}
        type="comment"
      />
      
      <MessageTemplateModal
        isOpen={showDMTemplates}
        onClose={() => setShowDMTemplates(false)}
        onSelectTemplate={() => {}}
        type="dm"
      />

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

export default Settings;