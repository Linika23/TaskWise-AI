
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation'; // Added for client-side navigation
import { BrainCircuit, CalendarDays, Target, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  currentView: 'tasks' | 'goals' | 'calendar';
  setCurrentView: Dispatch<SetStateAction<'tasks' | 'goals' | 'calendar'>>;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const router = useRouter(); // Initialized router

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-md py-4 md:py-6">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Brand name "TaskWise AI" linking to landing page '/' */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')} // Changed to navigate to '/'
          className={cn(
            "flex items-center text-xl md:text-2xl font-bold p-2 h-auto",
            'text-foreground hover:text-primary hover:bg-primary/5'
          )}
          aria-label="TaskWise AI Home"
        >
          <BrainCircuit className="h-7 w-7 md:h-8 md:w-8 mr-2 text-primary" />
          TaskWise AI
        </Button>
        
        {/* Right side: Icon buttons for "Home", "My Goals", "Calendar", and Theme Toggle */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')} // Changed to navigate to '/'
            className={cn(
              "p-2 hover:bg-primary/10", 
              // Active state for Home icon could be based on router.pathname === '/' if needed,
              // but currentView is for dashboard internal state.
              // For simplicity, let's assume 'tasks' view on dashboard is like a "dashboard home".
              // Or, this button now always navigates to the true landing page.
              'text-muted-foreground hover:text-primary' // Default state, active state might need rethinking if this always goes to '/'
            )}
            aria-label="Home Page"
            // aria-pressed might not be accurate if it always navigates to '/'
          >
            <Home className="h-6 w-6" /> 
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('goals')} // Stays as is for dashboard internal navigation
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
            onClick={() => setCurrentView('calendar')} // Stays as is for dashboard internal navigation
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
