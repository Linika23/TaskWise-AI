
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Target, Sparkles, CalendarPlus, ListChecks, HelpCircle, Lock, Lightbulb } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const CATCHY_TAGLINE = "Smarter Planning. Powered by AI.";
const TYPING_SPEED_TAGLINE = 100; // milliseconds per character

const faqItems = [
  {
    id: "faq-1",
    question: "How does TaskWise AI help with planning?",
    answer: "TaskWise AI uses advanced artificial intelligence to break down your large goals into manageable subtasks. Simply input your objective, and our AI will generate a detailed plan with estimated time allocations, helping you stay organized and focused.",
    icon: <Lightbulb className="h-5 w-5 mr-2 text-primary" />
  },
  {
    id: "faq-2",
    question: "Is my data secure with TaskWise AI?",
    answer: "Yes, we prioritize your data security. All your task and goal information is stored locally in your browser. We do not store your personal data on our servers, ensuring your privacy and control over your information.",
    icon: <Lock className="h-5 w-5 mr-2 text-primary" />
  },
  {
    id: "faq-3",
    question: "Can I use TaskWise AI for both personal and professional goals?",
    answer: "Absolutely! TaskWise AI is designed to be versatile. Whether you're planning a complex work project, studying for an exam, or organizing personal errands, our AI can help you structure your efforts and achieve your objectives.",
    icon: <Sparkles className="h-5 w-5 mr-2 text-primary" />
  },
  {
    id: "faq-4",
    question: "How does the AI generate subtasks?",
    answer: "Our AI analyzes your main goal and uses its knowledge base to identify common steps and best practices associated with achieving similar objectives. It then breaks these down into smaller, actionable subtasks tailored to your specific goal.",
    icon: <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
  }
];

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

      {/* Main content area */}
      <main className="flex flex-col flex-grow w-full">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center w-full p-4 md:p-8 text-center bg-primary text-primary-foreground">
          <div className="w-full max-w-2xl py-10 md:py-16">
            <Card className="shadow-xl"> {/* Card will use its own theme background, e.g., bg-card */}
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
        </section>

        {/* How It Works Section */}
        <section className="flex flex-col items-center justify-center w-full p-4 py-12 md:p-8 md:py-20 bg-background text-foreground">
          <div className="w-full max-w-4xl">
            <Card className="shadow-xl animate-fadeIn" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">How TaskWise AI Works</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Achieve your goals in four simple steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div className="flex flex-col items-center p-6 bg-card/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Target className="h-12 w-12 text-primary mb-4" data-ai-hint="target goal" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">1. Define Your Goal</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Clearly state what you want to accomplish.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-card/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Sparkles className="h-12 w-12 text-primary mb-4" data-ai-hint="magic AI" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">2. Get AI Subtasks</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Our AI breaks it down into manageable steps.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-card/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CalendarPlus className="h-12 w-12 text-primary mb-4" data-ai-hint="calendar deadline" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">3. Set Deadlines</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Assign target dates to stay on track effectively.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-card/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <ListChecks className="h-12 w-12 text-primary mb-4" data-ai-hint="checklist progress" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">4. Track & Complete</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Monitor your progress and achieve your goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Screenshots Preview Section */}
        <section className="flex flex-col items-center justify-center w-full p-4 py-12 md:p-8 md:py-20 bg-secondary text-foreground">
          <div className="w-full max-w-4xl">
            <Card className="shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">App Preview</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Get a glimpse of TaskWise AI in action.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <div className="relative aspect-video rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src="https://picsum.photos/seed/taskwise1/600/400"
                    alt="TaskWise AI Goal Input"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="goal input interface"
                  />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Goal & Subtask Planning</p>
                  </div>
                </div>
                <div className="relative aspect-video rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                   <Image
                    src="https://picsum.photos/seed/taskwise2/600/400"
                    alt="TaskWise AI Calendar View"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="calendar schedule view"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Calendar & Deadline Tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="flex flex-col items-center justify-center w-full p-4 py-12 md:p-8 md:py-20 bg-background text-foreground">
          <div className="w-full max-w-3xl">
            <Card className="shadow-xl animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 mr-3" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Find answers to common questions about TaskWise AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="border-b">
                      <AccordionTrigger className="text-left text-lg hover:no-underline">
                        <div className="flex items-center">
                           {item.icon}
                           <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base pt-2 pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>


      </main>

      <footer className="text-center py-8 animate-fadeIn bg-background" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskWise AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

