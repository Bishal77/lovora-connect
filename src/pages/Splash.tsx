import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-6">
      {/* Logo Animation */}
      <div
        className={`transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <Heart className="h-12 w-12 text-primary-foreground" fill="currentColor" />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 w-24 h-24 rounded-3xl border-2 border-primary/30 animate-ping" />
        </div>
      </div>

      {/* Brand */}
      <div
        className={`text-center mb-12 transition-all duration-700 delay-200 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-5xl font-bold gradient-text mb-3">Lovora</h1>
        <p className="text-muted-foreground text-lg">Find your perfect match</p>
      </div>

      {/* Tagline */}
      <div
        className={`text-center mb-12 max-w-xs transition-all duration-700 delay-300 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-muted-foreground">
          Swipe, connect, and discover meaningful relationships. Your journey to love starts here.
        </p>
      </div>

      {/* Buttons */}
      <div
        className={`w-full max-w-xs space-y-3 transition-all duration-700 delay-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Button
          onClick={() => navigate("/auth?mode=signup")}
          variant="gradient"
          size="xl"
          className="w-full"
        >
          Get Started
        </Button>
        <Button
          onClick={() => navigate("/auth?mode=login")}
          variant="outline"
          size="xl"
          className="w-full"
        >
          I already have an account
        </Button>
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-8 text-center text-xs text-muted-foreground transition-all duration-700 delay-700 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <p>By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
};

export default Splash;
