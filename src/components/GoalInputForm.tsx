
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateSubtasks, type GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalInputFormProps {
  onSubtasksGenerated: (goal: string, subtasks: GenerateSubtasksOutput['subtasks']) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "e.g., Plan a surprise birthday party for Sarah",
  "Write a blog post about AI productivity",
  "Prepare for my Java programming exam",
  "Plan my weekly fitness routine",
  "Learn to bake sourdough bread",
  "Organize my digital files",
];

export default function GoalInputForm({ onSubtasksGenerated, setIsLoading, setError, isLoading }: GoalInputFormProps) {
  const [goalInput, setGoalInput] = useState('');
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(examplePrompts[0]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % examplePrompts.length);
    }, 3000); // Change prompt every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setAnimatedPlaceholder(examplePrompts[currentPromptIndex]);
  }, [currentPromptIndex]);

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
      onSubtasksGenerated(goalInput, []); // Pass goal but empty subtasks on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Enter Your Goal</CardTitle>
        <CardDescription>Describe your main objective, and TaskWise will break it down for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={animatedPlaceholder}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="min-h-[100px] text-base focus:ring-primary transition-all duration-300 ease-in-out"
            aria-label="Main goal input"
          />
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" 
            disabled={isLoading || !goalInput.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Subtasks"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
