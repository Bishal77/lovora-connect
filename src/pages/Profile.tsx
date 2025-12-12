import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  Settings,
  Edit,
  Camera,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, photos } = useProfile();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const completionPercentage = () => {
    if (!profile) return 0;
    let completed = 0;
    const fields = ['full_name', 'bio', 'city', 'occupation', 'date_of_birth'];
    fields.forEach(field => {
      if (profile[field as keyof typeof profile]) completed++;
    });
    if (photos.length > 0) completed++;
    return Math.round((completed / (fields.length + 1)) * 100);
  };

  const menuItems = [
    {
      icon: Edit,
      label: "Edit Profile",
      description: "Update your photos and bio",
      onClick: () => navigate("/onboarding"),
    },
    {
      icon: Crown,
      label: "Upgrade to Premium",
      description: "Unlock all features",
      onClick: () => toast.info("Coming soon!"),
      highlight: true,
    },
    {
      icon: Shield,
      label: "Privacy & Safety",
      description: "Manage your privacy settings",
      onClick: () => toast.info("Coming soon!"),
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configure push notifications",
      onClick: () => toast.info("Coming soon!"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help or report issues",
      onClick: () => toast.info("Coming soon!"),
    },
  ];

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <AvatarProfile
                size="xl"
                src={photos[0]?.photo_url}
                verified={profile?.verification_status === 'verified'}
              />
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {profile?.full_name || user?.email?.split("@")[0] || "New User"}
              </h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {completionPercentage()}% Complete
                </span>
              </div>
            </div>
          </div>

          {!profile?.onboarding_completed && (
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/onboarding")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Complete Your Profile
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  item.highlight
                    ? "bg-primary/10 hover:bg-primary/20"
                    : "bg-card hover:bg-accent"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    item.highlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${item.highlight ? "text-primary" : ""}`}>
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
};

export default Profile;