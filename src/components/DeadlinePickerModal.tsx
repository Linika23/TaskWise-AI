
"use client";

import { useState, useEffect } from 'react';
import type { ExtendedSubtask } from '@/types';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from 'lucide-react'; // Changed from XIcon to X as per lucide-react standard
import { format, parseISO } from 'date-fns';

interface DeadlinePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtask: ExtendedSubtask | null;
  onSaveDeadline: (taskId: string, deadline: Date | undefined) => void;
}

export default function DeadlinePickerModal({
  isOpen,
  onClose,
  subtask,
  onSaveDeadline,
}: DeadlinePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (isOpen && subtask?.deadline) {
      try {
        // Ensure deadline is a string before parsing
        if (typeof subtask.deadline === 'string') {
          setSelectedDate(parseISO(subtask.deadline));
        } else {
          setSelectedDate(undefined); // Or handle if it might be a Date object already
        }
      } catch (e) {
        console.warn("Could not parse existing deadline string:", subtask.deadline, e);
        setSelectedDate(undefined);
      }
    } else if (isOpen && !subtask?.deadline) {
      setSelectedDate(undefined);
    }
  }, [isOpen, subtask]);

  if (!isOpen || !subtask) {
    return null;
  }

  const handleSave = () => {
    onSaveDeadline(subtask.id, selectedDate);
    // onClose will be called by onSaveDeadline in parent or here if preferred
  };

  const handleClearDeadline = () => {
    setSelectedDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openStatus) => { if (!openStatus) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Deadline for "{subtask.task.substring(0,30)}{subtask.task.length > 30 ? '...' : ''}"</DialogTitle>
          <DialogDescription>
            Pick a date to set a deadline for this subtask. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow-sm"
            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates, time part reset
          />
          {selectedDate && (
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                    Selected: {format(selectedDate, "PPP")}
                </p>
                <Button variant="ghost" size="sm" onClick={handleClearDeadline} className="h-7 px-2">
                    <X className="h-4 w-4 mr-1" /> Clear
                </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Deadline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
