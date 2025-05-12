
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ListChecks, AlertTriangle } from "lucide-react";

interface StepsDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    taskTitle: string;
    steps: string[];
    isLoading: boolean;
    error?: string | null;
  } | null;
}

export default function StepsDisplayModal({ isOpen, onClose, content }: StepsDisplayModalProps) {
  if (!isOpen || !content) {
    return null;
  }

  const { taskTitle, steps, isLoading, error } = content;

  return (
    <Dialog open={isOpen} onOpenChange={(openStatus) => { if (!openStatus) onClose(); }}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" />
            Steps for: {taskTitle}
          </DialogTitle>
          <DialogDescription>
            Here are the AI-generated steps to help you complete this subtask.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3 h-40">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating steps...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-3 text-destructive h-40 p-4 rounded-md border border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-10 w-10" />
              <p className="font-medium">Error Generating Steps</p>
              <p className="text-sm text-center">{error}</p>
            </div>
          ) : steps.length > 0 ? (
            <ul className="space-y-3 list-decimal list-inside pl-4 text-foreground">
              {steps.map((step, index) => (
                <li key={index} className="leading-relaxed text-sm p-2 bg-card/50 rounded-md">
                  {step}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center h-40 flex items-center justify-center">
              No steps were generated for this task.
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
