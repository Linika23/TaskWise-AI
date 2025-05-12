
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';

const CATCHY_TAGLINE = "Smarter Planning. Powered by AI.";
const TYPING_SPEED_TAGLINE = 100; // milliseconds per character

export default function LandingPage() {
  const router = useRouter();
  const [animatedTagline, setAnimatedTagline] = useState('');
  const [taglineCharIndex, setTaglineCharIndex] = useState(0);

  useEffect(() => {
    if (taglineCharIndex < CATCHY_TAGLINE.length) {
      const typingInterval = setTimeout(() => {
        setAnimatedTagline((prev) => prev + CATCHY_TAGLINE[taglineCharIndex]);
        setTaglineCharIndex((prev) => prev + 1);
      }, TYPING_SPEED_TAGLINE);
      return () => clearTimeout(typingInterval);
    }
  }, [taglineCharIndex]);

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-secondary font-sans">
      <header className="sticky top-0 z-50 w-full bg-background shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center text-xl md:text-2xl font-bold text-foreground">
            <BrainCircuit className="h-7 w-7 md:h-8 md:w-8 mr-2 text-primary" />
            TaskWise AI
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow w-full p-4 md:p-8 text-center">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="pb-4 pt-8">
              <div style={{ animationDelay: '0.1s', opacity: 0 }} className="animate-fadeIn flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
                <BrainCircuit data-ai-hint="artificial intelligence brain" className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                <h1 className="text-4xl sm:text-5xl font-bold ml-2 sm:ml-4 text-foreground mt-2 sm:mt-0">TaskWise AI</h1>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6 px-4 pb-8">
              <p  className="text-2xl sm:text-3xl text-foreground font-semibold min-h-[2.25em] sm:min-h-[2.5em]">
                {animatedTagline}
                <span className="animate-ping">|</span>
              </p>
              <p style={{ animationDelay: '0.3s', opacity: 0 }} className="animate-fadeIn text-md sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Turn your ambitious goals into actionable subtasks with a single click. Let our AI streamline your workflow, organize your thoughts, and boost your productivity effortlessly.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg sm:text-xl py-3 px-8 sm:px-10 mt-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
                onClick={handleGetStarted}
                style={{ animationDelay: '0.4s', opacity: 0 }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center py-8 animate-fadeIn" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskWise AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
