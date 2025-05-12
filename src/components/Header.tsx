import { BrainCircuit, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-md py-4 md:py-6">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <BrainCircuit className="h-8 w-8 md:h-10 md:w-10 mr-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">My Tasks</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary" aria-label="Calendar View">
          <CalendarDays className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
