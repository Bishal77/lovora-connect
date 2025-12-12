import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LiveModeSelector } from '@/components/live/LiveModeSelector';
import { LiveSearching } from '@/components/live/LiveSearching';
import { LiveTextChat } from '@/components/live/LiveTextChat';
import { useLiveMode, SessionType } from '@/hooks/useLiveMode';

const Live: React.FC = () => {
  const [selectedType, setSelectedType] = useState<SessionType | null>(null);
  const {
    inQueue,
    currentSession,
    partner,
    messages,
    searching,
    joinQueue,
    leaveQueue,
    endSession,
    skipToNext,
    sendLiveMessage
  } = useLiveMode();

  const handleSelectMode = (type: SessionType) => {
    setSelectedType(type);
    joinQueue(type);
  };

  const handleCancel = () => {
    leaveQueue();
    setSelectedType(null);
  };

  const handleEnd = () => {
    endSession();
    setSelectedType(null);
  };

  const handleSkip = () => {
    if (selectedType) {
      skipToNext(selectedType);
    }
  };

  // Show the active session
  if (currentSession && partner) {
    if (currentSession.session_type === 'text') {
      return (
        <LiveTextChat
          partner={partner}
          messages={messages}
          onSendMessage={sendLiveMessage}
          onEnd={handleEnd}
          onSkip={handleSkip}
        />
      );
    }
    // TODO: Add video/audio chat components
  }

  // Show searching screen
  if (inQueue || searching) {
    return (
      <AppLayout>
        <LiveSearching
          type={selectedType || 'text'}
          onCancel={handleCancel}
        />
      </AppLayout>
    );
  }

  // Show mode selector
  return (
    <AppLayout>
      <LiveModeSelector 
        onSelect={handleSelectMode} 
        searching={searching}
      />
    </AppLayout>
  );
};

export default Live;