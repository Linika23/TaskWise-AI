
"use client";

import { useState } from 'react'; // Added useState
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
// Removed useToast as it's no longer directly used here
import ChatbotModal from './ChatbotModal'; // Added import

export default function FloatingChatbotButton() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // Added state

  const handleClick = () => {
    setIsChatModalOpen(true); // Open the modal
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-4 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {isChatModalOpen && <ChatbotModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />}
    </>
  );
}

