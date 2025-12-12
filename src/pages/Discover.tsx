import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { DiscoverCard } from "@/components/discover/DiscoverCard";
import { useMatching } from "@/hooks/useMatching";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import { toast } from "sonner";

const filters = ["All", "Online", "Verified", "Near me", "New"];

const Discover: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const { profiles, loading, swipe } = useMatching();

  const filteredProfiles = React.useMemo(() => {
    if (activeFilter === "All") return profiles;
    if (activeFilter === "Verified") return profiles.filter(p => p.verification_status === 'verified');
    if (activeFilter === "Online") return profiles.filter(p => p.is_online);
    return profiles;
  }, [profiles, activeFilter]);

  const handleExpressInterest = async (profileId: string) => {
    const { error } = await swipe(profileId, 'like');
    if (error) {
      toast.error("Failed to express interest");
    } else {
      toast.success("Interest expressed!");
    }
  };

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <Button variant="ghost" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by name, location..." className="pl-10" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {filters.map((filter) => (
            <Chip
              key={filter}
              variant="outline"
              selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Chip>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading profiles...</div>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <DiscoverCard
                key={profile.id}
                profile={profile}
                onViewProfile={() => toast.info("Profile view coming soon!")}
                onExpressInterest={() => handleExpressInterest(profile.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No profiles found</h2>
            <p className="text-muted-foreground">Check back later for new people to discover!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Discover;