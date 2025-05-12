
"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FloatingChatbotButton() {
  const { toast } = useToast();

  const handleClick = () => {
    // Placeholder for chatbot functionality
    toast({
      title: "Chatbot Activated",
      description: "The chatbot is not yet implemented. Stay tuned!",
    });
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-4 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      aria-label="Open chatbot"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
