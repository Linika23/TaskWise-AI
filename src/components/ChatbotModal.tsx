"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Send, MessageCircle, Loader2, User, Bot } from 'lucide-react';
import { chatWithAssistant, type ChatWithAssistantInput, type GeminiMessage } from '@/ai/flows/chat-flow';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "👋 Hi! I'm TaskWise AI Assistant. I can help you break down goals, remind you of deadlines, or guide you through the app. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added or when loading state changes
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const currentMessagesForHistory = [...messages]; // Capture messages *before* adding the new user one for the AI history
    const newUserMessage: ChatMessage = { role: 'user', text: inputValue };
    
    setMessages(prev => [...prev, newUserMessage]); // Update UI immediately
    setInputValue('');
    setIsLoading(true);

    const historyForAI: GeminiMessage[] = currentMessagesForHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    
    try {
      const aiInput: ChatWithAssistantInput = {
        message: newUserMessage.text, // Current user's input
        history: historyForAI, // History *up to* this point
      };
      const result = await chatWithAssistant(aiInput);
      setMessages(prev => [...prev, { role: 'model', text: result.response }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: `Failed to get response: ${errorMessage.substring(0, 100)}`,
      });
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I couldn't process that. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openStatus) => { if (!openStatus) onClose(); }}>
      <DialogContent className="sm:max-w-lg md:max-w-xl h-[80vh] flex flex-col p-0 shadow-xl rounded-lg">
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b bg-card rounded-t-lg">
          <DialogTitle className="flex items-center text-lg font-semibold text-card-foreground">
            <MessageCircle className="mr-2 h-5 w-5 text-primary" /> TaskWise AI Assistant
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow bg-background">
          <div ref={scrollViewportRef} className="p-4 sm:p-6 space-y-4 h-full overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%]`}>
                  {msg.role === 'model' && <Bot className="h-7 w-7 text-primary flex-shrink-0 mb-1" />}
                  <div className={`rounded-xl px-3.5 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-card text-card-foreground rounded-bl-none border'
                  }`}>
                    {msg.text.split('\\n').map((line, i) => (
                        <span key={i}>{line}{i < msg.text.split('\\n').length - 1 && <br />}</span>
                    ))}
                  </div>
                  {msg.role === 'user' && <User className="h-7 w-7 text-foreground flex-shrink-0 mb-1" />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                 <div className="flex items-end gap-2">
                    <Bot className="h-7 w-7 text-primary flex-shrink-0 mb-1" />
                    <div className="rounded-xl px-3.5 py-2.5 text-sm bg-card text-card-foreground rounded-bl-none border shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-3 sm:p-4 border-t bg-card rounded-b-lg">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && inputValue.trim() && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 h-10 text-sm"
              aria-label="Chat input"
            />
            <Button 
              type="button" 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()} 
              size="icon"
              className="h-10 w-10"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
