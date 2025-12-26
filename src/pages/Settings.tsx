import { User, Bell, Shield, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Settings - StudyAI</title>
      </Helmet>
      <DashboardHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6 max-w-3xl">
        {/* Profile Section */}
        <section className="p-6 rounded-xl glass-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@university.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" defaultValue="Stanford University" />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="p-6 rounded-xl glass-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive deadline reminders via email</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Study Reminders</div>
                <div className="text-sm text-muted-foreground">Get reminded to follow your study plan</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Weekly Progress Report</div>
                <div className="text-sm text-muted-foreground">Receive a weekly summary of your progress</div>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="p-6 rounded-xl glass-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} variant="hero">
            Save Changes
          </Button>
          <Button onClick={handleLogout} variant="outline" className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
};

export default Settings;
