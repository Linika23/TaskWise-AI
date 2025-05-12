import { BrainCircuit } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full py-4 md:py-6 text-center">
      <div className="flex items-center justify-center">
        <BrainCircuit className="h-10 w-10 md:h-12 md:w-12 mr-3 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">TaskWise</h1>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        Your intelligent assistant for breaking down goals and boosting productivity.
      </p>
    </header>
  );
}
