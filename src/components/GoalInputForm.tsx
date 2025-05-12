
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateSubtasks, type GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { suggestGoals, type SuggestGoalsOutput } from '@/ai/flows/suggest-goals-flow';
import { Loader2, Sparkles, Plus, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface GoalInputFormProps {
  onSubtasksGenerated: (goal: string, subtasks: GenerateSubtasksOutput['subtasks']) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoadingGlobal: boolean; // Renamed from isLoading to isLoadingGlobal
}

const examplePrompts = [
  "e.g., Plan a surprise birthday party for Sarah",
  "Write a blog post about AI productivity",
  "Prepare for my Java programming exam",
  "Plan my weekly fitness routine",
  "Learn to bake sourdough bread",
  "Organize my digital files",
];

const TYPING_SPEED = 100; // milliseconds per character
const PROMPT_CHANGE_DELAY = 3000; // milliseconds

export default function GoalInputForm({ onSubtasksGenerated, setIsLoading, setError, isLoadingGlobal }: GoalInputFormProps) {
  const [goalInput, setGoalInput] = useState('');
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const { toast } = useToast();

  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [goalSuggestions, setGoalSuggestions] = useState<string[]>([]);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);

  useEffect(() => {
    const promptChangeInterval = setInterval(() => {
      setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % examplePrompts.length);
      setCurrentCharIndex(0);
      setAnimatedPlaceholder('');
      setIsTyping(true);
    }, PROMPT_CHANGE_DELAY + examplePrompts[currentPromptIndex].length * TYPING_SPEED + 500); 

    return () => clearInterval(promptChangeInterval);
  }, [currentPromptIndex]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentCharIndex < examplePrompts[currentPromptIndex].length) {
      const typingInterval = setTimeout(() => {
        setAnimatedPlaceholder((prev) => prev + examplePrompts[currentPromptIndex][currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(typingInterval);
    } else {
      setIsTyping(false); 
    }
  }, [currentPromptIndex, currentCharIndex, isTyping]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) {
      setError("Please enter a goal.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateSubtasks({ goal: goalInput });
      onSubtasksGenerated(goalInput, result.subtasks);
    } catch (err) {
      console.error("Error generating subtasks:", err);
      setError("Failed to generate subtasks. Please check your connection or try a different goal.");
      onSubtasksGenerated(goalInput, []); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiAssistClick = async () => {
    setIsSuggestionsLoading(true);
    setSuggestionsError(null);
    setGoalSuggestions([]);
    setIsSuggestionsDialogOpen(true); 

    try {
      const result = await suggestGoals();
      setGoalSuggestions(result.suggestions);
    } catch (err) {
      console.error("Error suggesting goals:", err);
      const errorMessage = "Failed to get suggestions. Please try again.";
      setSuggestionsError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Enter Your Goal</CardTitle>
          <CardDescription>Describe your main objective, and TaskWise will break it down for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={animatedPlaceholder + (isTyping ? '|' : '')} 
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="min-h-[100px] text-base focus:ring-primary transition-all duration-300 ease-in-out"
              aria-label="Main goal input"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAiAssistClick}
                className="text-muted-foreground hover:text-primary"
                disabled={isSuggestionsLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Need help?
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" 
              disabled={isLoadingGlobal || !goalInput.trim()}
            >
              {isLoadingGlobal ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Add Task <Plus className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isSuggestionsDialogOpen} onOpenChange={setIsSuggestionsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />
              AI Goal Suggestions
            </DialogTitle>
            <DialogDescription>
              Here are some ideas to get you started. You can copy one or use them as inspiration!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {isSuggestionsLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3 h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Fetching suggestions...</p>
              </div>
            ) : suggestionsError ? (
              <p className="text-destructive text-center">{suggestionsError}</p>
            ) : goalSuggestions.length > 0 ? (
              <ul className="space-y-3 list-disc list-inside pl-4 text-foreground">
                {goalSuggestions.map((suggestion, index) => (
                  <li key={index} className="leading-relaxed text-sm">
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center h-40 flex items-center justify-center">No suggestions available at the moment.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
