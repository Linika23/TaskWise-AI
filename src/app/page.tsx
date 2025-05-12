
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GoalInputForm from '@/components/GoalInputForm';
import SubtaskList from '@/components/SubtaskList';
import SavedTasksDisplay from '@/components/SavedTasksDisplay';
import { Button } from '@/components/ui/button';
import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Loader2, ListChecks, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SavedGoal {
  id: string;
  mainGoal: string;
  subtasks: GenerateSubtasksOutput['subtasks'];
  savedAt: string;
}

export default function TaskWisePage() {
  const [currentGoalText, setCurrentGoalText] = useState<string>("");
  const [currentSubtasks, setCurrentSubtasks] = useState<GenerateSubtasksOutput['subtasks']>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedGoals = localStorage.getItem('taskwise_saved_goals');
    if (storedGoals) {
      try {
        setSavedGoals(JSON.parse(storedGoals));
      } catch (e) {
        console.error("Failed to parse saved goals from localStorage", e);
        localStorage.removeItem('taskwise_saved_goals'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (savedGoals.length > 0 || localStorage.getItem('taskwise_saved_goals')) { // only write if there's something to write or clear
        localStorage.setItem('taskwise_saved_goals', JSON.stringify(savedGoals));
    }
  }, [savedGoals]);

  const handleSubtasksGenerated = (goalText: string, subtasks: GenerateSubtasksOutput['subtasks']) => {
    setCurrentGoalText(goalText);
    setCurrentSubtasks(subtasks);
    setError(null); 
    if (subtasks.length > 0) {
      toast({
        title: "Subtasks Generated!",
        description: `Successfully generated subtasks for "${goalText.substring(0,50)}...".`,
      });
    } else if (!error && !isLoading) { // If no subtasks and no error, means AI returned empty
       setError(`No subtasks were generated for "${goalText.substring(0,50)}...". Try rephrasing your goal.`);
    }
  };

  const handleSaveTasks = () => {
    if (!currentGoalText || currentSubtasks.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Save",
        description: "No active goal or subtasks to save.",
      });
      return;
    }

    const newSavedGoal: SavedGoal = {
      id: crypto.randomUUID(), 
      mainGoal: currentGoalText,
      subtasks: currentSubtasks,
      savedAt: new Date().toLocaleString(),
    };

    setSavedGoals(prevSavedGoals => [newSavedGoal, ...prevSavedGoals]);
    toast({
      title: "Tasks Saved!",
      description: `Plan for "${currentGoalText.substring(0,50)}..." has been saved.`,
      className: "bg-success text-success-foreground"
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-secondary p-4 md:p-8 font-sans">
      <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn w-full">
        <Header />
      </div>
      <main className="w-full max-w-3xl mt-6 md:mt-8 space-y-8">
        <Card className="animate-fadeIn shadow-lg" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Welcome to TaskWise – Your AI-powered daily planner.
            </h2>
            <p className="text-muted-foreground">
              Turn goals into actionable subtasks with one click.
            </p>
          </CardContent>
        </Card>

        <div style={{ animationDelay: '0.3s', opacity: 0 }} className="animate-fadeIn w-full">
          <GoalInputForm
            onSubtasksGenerated={handleSubtasksGenerated}
            setIsLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
          />
        </div>

        {error && !isLoading && (
          <Alert variant="destructive" className="animate-fadeIn shadow-md" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Card className="animate-fadeIn shadow-md" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <CardContent className="p-6 flex flex-col justify-center items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Generating subtasks, please wait...</p>
              <p className="text-sm text-muted-foreground">This might take a moment.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && currentSubtasks.length > 0 && (
          <Card className="animate-fadeIn shadow-xl" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <CardTitle className="text-2xl text-primary flex items-center">
                  <ListChecks className="mr-2 h-6 w-6" />
                  Generated Subtasks
                </CardTitle>
                <Button
                  onClick={handleSaveTasks}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
                  variant="default"
                  size="sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save This Plan
                </Button>
              </div>
              {currentGoalText && <CardDescription className="mt-2">For your goal: "{currentGoalText}"</CardDescription>}
            </CardHeader>
            <CardContent>
              <SubtaskList subtasks={currentSubtasks} />
            </CardContent>
          </Card>
        )}
        
        <div style={{ animationDelay: '0.5s', opacity: 0 }} className="animate-fadeIn w-full">
          <SavedTasksDisplay savedGoals={savedGoals} setSavedGoals={setSavedGoals} />
        </div>
      </main>
      <footer className="text-center py-8 mt-auto animate-fadeIn" style={{ animationDelay: '0.6s', opacity: 0 }}>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskWise. All rights reserved.</p>
      </footer>
    </div>
  );
}
