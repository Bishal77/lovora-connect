import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, SkipForward, X, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarProfile } from '@/components/ui/avatar-profile';
import { ProfileWithDetails } from '@/hooks/useMatching';
import { LiveMessage } from '@/hooks/useLiveMode';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface Props {
  partner: ProfileWithDetails;
  messages: LiveMessage[];
  onSendMessage: (content: string) => void;
  onSkip: () => void;
  onEnd: () => void;
}

export function LiveTextChat({ partner, messages, onSendMessage, onSkip, onEnd }: Props) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const partnerPhoto = partner.photos[0]?.photo_url;
  const age = partner.date_of_birth 
    ? new Date().getFullYear() - new Date(partner.date_of_birth).getFullYear()
    : null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <AvatarProfile
            src={partnerPhoto}
            alt={partner.full_name}
            size="md"
          />
          <div>
            <h3 className="font-semibold">
              {partner.display_name || partner.full_name.split(' ')[0]}
              {age && <span className="text-muted-foreground ml-1">{age}</span>}
            </h3>
            <p className="text-xs text-green-500">Connected</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onSkip}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={onEnd}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Connection notice */}
      <div className="p-3 bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          You're now connected! Say hi 👋
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", isOwn ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2 rounded-2xl",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Flag className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
