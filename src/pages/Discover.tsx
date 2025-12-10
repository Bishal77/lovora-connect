import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { Chip } from "@/components/ui/chip";
import { Search, SlidersHorizontal, MapPin, Briefcase, Heart } from "lucide-react";

// Demo profiles for discover (Serious Mode style)
const discoverProfiles = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 25,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    location: "New York, NY",
    occupation: "UX Designer at Google",
    compatibility: 92,
    verified: true,
  },
  {
    id: "2",
    name: "Emily Chen",
    age: 28,
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    location: "Brooklyn, NY",
    occupation: "Software Engineer at Meta",
    compatibility: 88,
    verified: true,
  },
  {
    id: "3",
    name: "Jessica Williams",
    age: 24,
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    location: "Manhattan, NY",
    occupation: "Marketing Manager",
    compatibility: 85,
  },
  {
    id: "4",
    name: "Amanda Davis",
    age: 27,
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
    location: "Queens, NY",
    occupation: "Product Manager at Amazon",
    compatibility: 79,
    verified: true,
  },
];

const filters = ["All", "Online", "Verified", "Near me", "New"];

const Discover: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState("All");

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <Button variant="ghost" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, location..."
            className="pl-10"
          />
        </div>

        {/* Filters */}
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

        {/* Profile List */}
        <div className="space-y-3">
          {discoverProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-card rounded-2xl p-4 flex items-center gap-4 card-hover cursor-pointer"
            >
              <AvatarProfile
                src={profile.photo}
                size="lg"
                verified={profile.verified}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">
                    {profile.name}, {profile.age}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="truncate">{profile.occupation}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{profile.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-semibold text-primary">
                  {profile.compatibility}%
                </span>
                <Button variant="love" size="icon-sm">
                  <Heart className="h-4 w-4" fill="currentColor" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Discover;
