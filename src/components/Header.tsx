
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { BrainCircuit, CalendarDays, Target, Home } from 'lucide-react'; // Added Home icon
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  currentView: 'tasks' | 'goals' | 'calendar';
  setCurrentView: Dispatch<SetStateAction<'tasks' | 'goals' | 'calendar'>>;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-md py-4 md:py-6">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Brand name "TaskWise AI" linking to 'tasks' view */}
        <Button
          variant="ghost"
          onClick={() => setCurrentView('tasks')}
          className={cn(
            "flex items-center text-xl md:text-2xl font-bold p-2 h-auto",
            // Removed active state based on currentView === 'tasks' as the new Home icon will handle this
            'text-foreground hover:text-primary hover:bg-primary/5'
          )}
          aria-label="TaskWise AI Home"
        >
          <BrainCircuit className="h-7 w-7 md:h-8 md:w-8 mr-2 text-primary" /> {/* Icon always primary color */}
          TaskWise AI
        </Button>
        
        {/* Right side: Icon buttons for "Home", "My Goals", "Calendar", and Theme Toggle */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('tasks')}
            className={cn(
              "p-2 hover:bg-primary/10", 
              currentView === 'tasks' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
            )}
            aria-label="Home"
            aria-pressed={currentView === 'tasks'}
          >
            <Home className="h-6 w-6" /> 
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('goals')}
            className={cn(
              "p-2 hover:bg-primary/10", 
              currentView === 'goals' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
            )}
            aria-label="My Goals"
            aria-pressed={currentView === 'goals'}
          >
            <Target className="h-6 w-6" /> 
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('calendar')}
            className={cn(
              "p-2 hover:bg-primary/10",
              currentView === 'calendar' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
            )}
            aria-label="Calendar View"
            aria-pressed={currentView === 'calendar'}
          >
            <CalendarDays className="h-6 w-6" /> 
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

