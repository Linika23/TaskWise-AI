
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
        <div className="flex items-center space-x-4">
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
          <Button
            variant="ghost"
            onClick={() => setCurrentView('goals')}
            className={cn(
              "flex items-center text-xl md:text-2xl font-bold p-2 h-auto",
              currentView === 'goals' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            )}
            aria-pressed={currentView === 'goals'}
          >
            <Target className="h-7 w-7 md:h-8 md:w-8 mr-2" />
            My Goals
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary" aria-label="Calendar View">
          <CalendarDays className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
