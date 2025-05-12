
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GoalInputForm from '@/components/GoalInputForm';
import SubtaskList, { type ExtendedSubtask } from '@/components/SubtaskList';
import SavedTasksDisplay from '@/components/SavedTasksDisplay';
import EditSubtaskModal from '@/components/EditSubtaskModal';
import StepsDisplayModal from '@/components/StepsDisplayModal'; 
import DeadlinePickerModal from '@/components/DeadlinePickerModal';
import GoalDisplay from '@/components/GoalDisplay'; // Import GoalDisplay
import { Button } from '@/components/ui/button';
import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { generateStepsForSubtask } from '@/ai/flows/generate-steps-for-subtask'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Loader2, ListChecks, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns'; 

export interface SavedGoal {
  id: string;
  mainGoal: string;
  subtasks: ExtendedSubtask[]; 
  savedAt: string;
}

export default function TaskWisePage() {
  const [currentView, setCurrentView] = useState<'tasks' | 'goals'>('tasks');
  const [currentGoalText, setCurrentGoalText] = useState<string>("");
  const [currentSubtasks, setCurrentSubtasks] = useState<ExtendedSubtask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([]);
  const { toast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState<ExtendedSubtask | null>(null);

  const [isStepsModalOpen, setIsStepsModalOpen] = useState<boolean>(false);
  const [stepsModalContent, setStepsModalContent] = useState<{
    taskTitle: string;
    steps: string[];
    isLoading: boolean;
    error?: string | null;
  } | null>(null);

  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState<boolean>(false);
  const [subtaskForDeadline, setSubtaskForDeadline] = useState<ExtendedSubtask | null>(null);


  useEffect(() => {
    const storedGoals = localStorage.getItem('taskwise_saved_goals');
    if (storedGoals) {
      try {
        setSavedGoals(JSON.parse(storedGoals));
      } catch (e) {
        console.error("Failed to parse saved goals from localStorage", e);
        localStorage.removeItem('taskwise_saved_goals'); 
      }
    }
  }, []);

  useEffect(() => {
    if (savedGoals.length > 0 || localStorage.getItem('taskwise_saved_goals')) {
        localStorage.setItem('taskwise_saved_goals', JSON.stringify(savedGoals));
    }
  }, [savedGoals]);

  const handleSubtasksGenerated = (goalText: string, subtasksFromAI: GenerateSubtasksOutput['subtasks']) => {
    setCurrentGoalText(goalText);
    const extendedSubtasks: ExtendedSubtask[] = subtasksFromAI.map(subtask => ({
      ...subtask,
      id: crypto.randomUUID(),
      done: false,
    }));
    setCurrentSubtasks(extendedSubtasks);
    setError(null); 
    if (extendedSubtasks.length > 0) {
      toast({
        title: "Subtasks Generated!",
        description: `Successfully generated subtasks for "${goalText.substring(0,50)}...".`,
      });
    } else if (!error && !isLoading) { 
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

  const handleToggleSubtaskDone = (taskId: string) => {
    setCurrentSubtasks(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === taskId ? { ...subtask, done: !subtask.done } : subtask
      )
    );
  };

  const handleDeleteSubtask = (taskId: string) => {
    setCurrentSubtasks(prevSubtasks =>
      prevSubtasks.filter(subtask => subtask.id !== taskId)
    );

    setSavedGoals(prevSavedGoals =>
      prevSavedGoals.map(goal => {
        if (goal.subtasks.some(st => st.id === taskId)) {
          return {
            ...goal,
            subtasks: goal.subtasks.filter(st => st.id !== taskId),
          };
        }
        return goal;
      })
    );

    toast({
      title: "Subtask Deleted",
      description: "The subtask has been removed from the current plan and any matching saved plans.",
    });
  };

  const handleEditSubtask = (taskId: string) => {
    const task = currentSubtasks.find(st => st.id === taskId);
    if (task) {
      setSubtaskToEdit(task);
      setIsEditModalOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subtask not found.",
      });
    }
  };

  const handleUpdateSubtask = (updatedTask: ExtendedSubtask) => {
    setCurrentSubtasks(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === updatedTask.id ? updatedTask : subtask
      )
    );
    setIsEditModalOpen(false);
    setSubtaskToEdit(null);
    toast({
      title: "Subtask Updated",
      description: `"${updatedTask.task.substring(0,30)}..." has been updated.`,
    });
  };


  const handleBreakIntoSteps = async (taskId: string) => {
    const subtask = currentSubtasks.find(st => st.id === taskId);
    if (!subtask) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subtask not found.",
      });
      return;
    }

    setStepsModalContent({ taskTitle: subtask.task, steps: [], isLoading: true });
    setIsStepsModalOpen(true);

    try {
      const result = await generateStepsForSubtask({ taskTitle: subtask.task });
      setStepsModalContent({ taskTitle: subtask.task, steps: result.steps, isLoading: false });
      if (result.steps.length > 0) {
        toast({
          title: "Steps Generated!",
          description: `AI has broken down "${subtask.task.substring(0,30)}..." into steps.`,
        });
      } else {
        toast({
          title: "No Steps Generated",
          description: `AI could not break down "${subtask.task.substring(0,30)}..." further.`,
          variant: "default"
        });
      }
    } catch (err) {
      console.error("Error generating steps for subtask:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setStepsModalContent({ 
        taskTitle: subtask.task, 
        steps: [], 
        isLoading: false, 
        error: `Failed to generate steps. ${errorMessage.substring(0,100)}`
      });
      toast({
        variant: "destructive",
        title: "Error Generating Steps",
        description: `Could not generate steps for "${subtask.task.substring(0,30)}...".`,
      });
    }
  };

  const handleOpenDeadlineModal = (taskId: string) => {
    const taskToSetDeadline = currentSubtasks.find(st => st.id === taskId);
    if (taskToSetDeadline) {
      setSubtaskForDeadline(taskToSetDeadline);
      setIsDeadlineModalOpen(true);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Subtask not found." });
    }
  };

  const handleSaveNewDeadline = (taskId: string, newDeadlineDate: Date | undefined) => {
    const deadlineISO = newDeadlineDate ? newDeadlineDate.toISOString() : undefined;
    
    setCurrentSubtasks(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === taskId
          ? { ...subtask, deadline: deadlineISO }
          : subtask
      )
    );

    setSavedGoals(prevSavedGoals => 
      prevSavedGoals.map(goal => {
        const subtaskExistsInGoal = goal.subtasks.some(st => st.id === taskId);
        if (subtaskExistsInGoal) {
          return {
            ...goal,
            subtasks: goal.subtasks.map(st => 
              st.id === taskId 
                ? { ...st, deadline: deadlineISO }
                : st
            )
          };
        }
        return goal;
      })
    );

    toast({
      title: newDeadlineDate ? "Deadline Set!" : "Deadline Cleared!",
      description: `Deadline for subtask has been ${newDeadlineDate ? 'updated' : 'removed'}.`,
    });
    setIsDeadlineModalOpen(false); 
    setSubtaskForDeadline(null); 
  };
  
  const allGoalStrings = Array.from(
    new Set([
      ...(currentGoalText ? [currentGoalText] : []),
      ...savedGoals.map(sg => sg.mainGoal)
    ])
  ).filter(goal => goal.trim() !== '');


  return (
    <div className="flex flex-col min-h-screen bg-secondary font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex flex-col items-center flex-grow p-4 md:p-8">
        <main className="w-full max-w-3xl mt-6 md:mt-8 space-y-8">
          {currentView === 'tasks' && (
            <>
              <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn w-full">
                <Card className="shadow-lg">
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
              </div>

              <div style={{ animationDelay: '0.3s', opacity: 0 }} className="animate-fadeIn w-full">
                <GoalInputForm
                  onSubtasksGenerated={handleSubtasksGenerated}
                  setIsLoading={setIsLoading}
                  setError={setError}
                  isLoadingGlobal={isLoading}
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
                    <SubtaskList
                      subtasks={currentSubtasks}
                      onToggleDone={handleToggleSubtaskDone}
                      onDeleteTask={handleDeleteSubtask}
                      onEditTask={handleEditSubtask}
                      onBreakIntoSteps={handleBreakIntoSteps}
                      onSetDeadline={handleOpenDeadlineModal} 
                    />
                  </CardContent>
                </Card>
              )}
              
              <div style={{ animationDelay: '0.5s', opacity: 0 }} className="animate-fadeIn w-full">
                <SavedTasksDisplay savedGoals={savedGoals} setSavedGoals={setSavedGoals} />
              </div>
            </>
          )}

          {currentView === 'goals' && (
            <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn w-full">
              <GoalDisplay goals={allGoalStrings} />
            </div>
          )}

        </main>
        {subtaskToEdit && (
          <EditSubtaskModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSubtaskToEdit(null);
            }}
            subtask={subtaskToEdit}
            onSave={handleUpdateSubtask}
          />
        )}
        <StepsDisplayModal
          isOpen={isStepsModalOpen}
          onClose={() => {
            setIsStepsModalOpen(false);
            setStepsModalContent(null);
          }}
          content={stepsModalContent}
        />
        <DeadlinePickerModal
          isOpen={isDeadlineModalOpen}
          onClose={() => {
            setIsDeadlineModalOpen(false);
            setSubtaskForDeadline(null);
          }}
          subtask={subtaskForDeadline}
          onSaveDeadline={handleSaveNewDeadline}
        />
        <footer className="text-center py-8 mt-auto animate-fadeIn" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskWise. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
