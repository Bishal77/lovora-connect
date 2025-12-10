import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";

const Chat: React.FC = () => {
  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Start swiping to match with people and begin chatting!
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
