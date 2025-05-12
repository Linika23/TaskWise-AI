
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { BrainCircuit, CalendarDays, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentView: 'tasks' | 'goals';
  setCurrentView: Dispatch<SetStateAction<'tasks' | 'goals'>>;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-md py-4 md:py-6">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: "My Tasks" button which can also serve as the main navigation for the "tasks" view */}
        <Button
          variant="ghost"
          onClick={() => setCurrentView('tasks')}
          className={cn(
            "flex items-center text-xl md:text-2xl font-bold p-2 h-auto",
            currentView === 'tasks' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          )}
          aria-pressed={currentView === 'tasks'}
        >
          <BrainCircuit className="h-7 w-7 md:h-8 md:w-8 mr-2" />
          My Tasks
        </Button>
        
        {/* Right side: Icon buttons for "My Goals" and "Calendar" */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('goals')}
            className={cn(
              "p-2 hover:bg-primary/10", // Ensure consistent padding for icon buttons
              currentView === 'goals' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
            )}
            aria-label="My Goals"
            aria-pressed={currentView === 'goals'}
          >
            <Target className="h-6 w-6" /> {/* Icon size as requested */}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2" // Ensure consistent padding
            aria-label="Calendar View (Placeholder)"
            // Consider adding onClick for placeholder functionality or disabling if not ready
            // onClick={() => alert("Calendar View Coming Soon!")} 
          >
            <CalendarDays className="h-6 w-6" /> {/* Icon size as requested */}
          </Button>
        </div>
      </div>
    </header>
  );
}

