"use client";

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import GoalInputForm from '@/components/GoalInputForm';
import SubtaskList from '@/components/SubtaskList';
import SavedTasksDisplay from '@/components/SavedTasksDisplay';
import EditSubtaskModal from '@/components/EditSubtaskModal';
import StepsDisplayModal from '@/components/StepsDisplayModal'; 
import DeadlinePickerModal from '@/components/DeadlinePickerModal';
import GoalDisplay from '@/components/GoalDisplay';
import AddGoalModal, { type AddGoalFormValues } from '@/components/AddGoalModal';
import FullCalendarDisplay from '@/components/FullCalendarDisplay';
import { Button } from '@/components/ui/button';
import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { generateStepsForSubtask } from '@/ai/flows/generate-steps-for-subtask'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Loader2, ListChecks, Save, PlusCircle, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TrackedGoal, SavedGoal, ExtendedSubtask } from '@/types';

// Sample tracked goals for initial display if localStorage is empty
const sampleTrackedGoals: TrackedGoal[] = [
  { id: 'tg1', title: 'Learn Next.js App Router', description: 'Complete a tutorial and build a small app focused on new routing features, ensuring all core concepts are understood.', type: 'short', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
  { id: 'tg2', title: 'Finish Q2 Project Proposal', description: 'Draft the initial proposal, gather feedback from stakeholders, revise, and submit the final version before the Q2 deadline.', type: 'short', targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), completed: true },
  { id: 'tg3', title: 'Run a Half Marathon', description: 'Follow a 12-week training plan consistently, focusing on endurance and pace, to successfully complete a half marathon.', type: 'long', targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
  { id: 'tg4', title: 'Read 12 Books This Year', description: 'Aim to read at least one book per month, covering a diverse range of genres including fiction, non-fiction, and technical books.', type: 'long', targetDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), completed: false },
];


export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'tasks' | 'goals' | 'calendar'>('tasks');
  const [currentGoalText, setCurrentGoalText] = useState<string>("");
  const [currentSubtasks, setCurrentSubtasks] = useState<ExtendedSubtask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([]);
  const [trackedGoals, setTrackedGoals] = useState<TrackedGoal[]>([]);
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

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState<boolean>(false);

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

    const storedTrackedGoals = localStorage.getItem('taskwise_tracked_goals');
    let initialTrackedGoals = sampleTrackedGoals;
    if (storedTrackedGoals) {
      try {
        const parsedTrackedGoals = JSON.parse(storedTrackedGoals);
        // Ensure parsedTrackedGoals is an array and has items, otherwise use sample
        initialTrackedGoals = Array.isArray(parsedTrackedGoals) && parsedTrackedGoals.length > 0 ? parsedTrackedGoals : sampleTrackedGoals;
      } catch (e) {
        console.error("Failed to parse tracked goals from localStorage", e);
        localStorage.removeItem('taskwise_tracked_goals');
      }
    }
    setTrackedGoals(initialTrackedGoals);

    // Daily goal notification
    // Find an incomplete short-term goal or the first goal if none are specific for "today"
    const today = new Date().toISOString().split('T')[0];
    let goalForToday: TrackedGoal | undefined = initialTrackedGoals.find(
      g => !g.completed && g.type === 'short' && new Date(g.targetDate).toISOString().split('T')[0] === today
    );
    if (!goalForToday) {
        goalForToday = initialTrackedGoals.find(g => !g.completed && g.type === 'short');
    }
    if (!goalForToday) {
        goalForToday = initialTrackedGoals.find(g => !g.completed);
    }

    if (goalForToday) {
        toast({
            title: "Today's Focus",
            description: (
                <div className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-primary" />
                    <span>{goalForToday.title.substring(0, 50)}{goalForToday.title.length > 50 ? '...' : ''}</span>
                </div>
            ),
            duration: 5000, // Show for 5 seconds
        });
    } else {
        toast({
            title: "Welcome!",
            description: (
                 <div className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-primary" />
                    <span>Ready to tackle your goals? Add some tasks!</span>
                </div>
            ),
            duration: 5000,
        });
    }
  }, [toast]); // Added toast to dependency array


  useEffect(() => {
    if (savedGoals.length > 0 || localStorage.getItem('taskwise_saved_goals')) {
        localStorage.setItem('taskwise_saved_goals', JSON.stringify(savedGoals));
    }
  }, [savedGoals]);

  useEffect(() => {
    // Check if trackedGoals is not the initial sample to prevent overwriting on first load if empty
    if (trackedGoals !== sampleTrackedGoals || localStorage.getItem('taskwise_tracked_goals')) {
        localStorage.setItem('taskwise_tracked_goals', JSON.stringify(trackedGoals));
    }
  }, [trackedGoals]);

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
  
  const handleToggleTrackedGoalComplete = (goalId: string) => {
    setTrackedGoals(prevTrackedGoals =>
      prevTrackedGoals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleAddNewGoal = (data: AddGoalFormValues) => {
    const newGoal: TrackedGoal = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      type: data.type,
      targetDate: data.targetDate.toISOString(),
      completed: false,
    };
    setTrackedGoals(prev => [newGoal, ...prev].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()));
    setIsAddGoalModalOpen(false);
    toast({ 
      title: "New Goal Added!", 
      description: `"${data.title.substring(0,50)}..." has been added to your goals.`,
      className: "bg-success text-success-foreground"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      {/* Content Wrapper: Removed padding p-4 md:p-8 */}
      <div className="flex flex-col items-center flex-grow">
        {/* Main content area: Added padding p-4 md:p-8 */}
        <main className="w-full max-w-3xl mt-6 md:mt-8 space-y-8 p-4 md:p-8">
          {currentView === 'tasks' && (
            <>
              <Card className="shadow-xl w-full animate-fadeIn" style={{ animationDelay: '0s', opacity: 0 }}>
                <CardHeader className="pb-2">
                   <CardTitle className="text-2xl text-primary">Welcome to TaskWise!</CardTitle>
                   <CardDescription>Your AI-powered daily planner. Turn goals into actionable subtasks with one click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GoalInputForm
                    onSubtasksGenerated={handleSubtasksGenerated}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    isLoadingGlobal={isLoading}
                    />
                </CardContent>
              </Card>
              
              <div style={{ animationDelay: '0.2s', opacity: 0 }} className="animate-fadeIn w-full text-center mt-6">
                <Button
                    onClick={() => setIsAddGoalModalOpen(true)}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add to My Goals
                  </Button>
              </div>

              {error && !isLoading && (
                <Alert variant="destructive" className="animate-fadeIn shadow-md" style={{ animationDelay: '0.3s', opacity: 0 }}>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <Card className="animate-fadeIn shadow-md" style={{ animationDelay: '0.3s', opacity: 0 }}>
                  <CardContent className="p-6 flex flex-col justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-lg text-muted-foreground">Generating subtasks, please wait...</p>
                    <p className="text-sm text-muted-foreground">This might take a moment.</p>
                  </CardContent>
                </Card>
              )}

              {!isLoading && currentSubtasks.length > 0 && (
                <Card className="animate-fadeIn shadow-xl" style={{ animationDelay: '0.3s', opacity: 0 }}>
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
              
              <div style={{ animationDelay: '0.4s', opacity: 0 }} className="animate-fadeIn w-full">
                <SavedTasksDisplay savedGoals={savedGoals} setSavedGoals={setSavedGoals} />
              </div>
            </>
          )}

          {currentView === 'goals' && (
            <>
              <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn w-full mb-6">
                 <Button 
                    onClick={() => setIsAddGoalModalOpen(true)}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add New Goal
                  </Button>
              </div>
              <div style={{ animationDelay: '0.2s', opacity: 0 }} className="animate-fadeIn w-full">
                <GoalDisplay goals={trackedGoals} onToggleComplete={handleToggleTrackedGoalComplete} />
              </div>
            </>
          )}

          {currentView === 'calendar' && (
            <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn w-full">
              <FullCalendarDisplay currentSubtasks={currentSubtasks} savedGoals={savedGoals} />
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
        <AddGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          onAddGoal={handleAddNewGoal}
        />
        <footer className="w-full text-center py-6 mt-auto animate-fadeIn bg-background border-t border-border" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskWise AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
