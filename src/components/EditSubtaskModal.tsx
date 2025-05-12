
"use client";

import type { ExtendedSubtask } from '@/types';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface EditSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtask: ExtendedSubtask;
  onSave: (updatedSubtask: ExtendedSubtask) => void;
}

export default function EditSubtaskModal({ isOpen, onClose, subtask, onSave }: EditSubtaskModalProps) {
  const [editedTaskText, setEditedTaskText] = useState(subtask.task);
  const [editedEstimatedTime, setEditedEstimatedTime] = useState(subtask.estimatedTime);
  const { toast } = useToast();

  useEffect(() => {
    if (subtask) {
      setEditedTaskText(subtask.task);
      setEditedEstimatedTime(subtask.estimatedTime);
    }
  }, [subtask]);

  const handleSaveChanges = () => {
    if (!editedTaskText.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Task title cannot be empty.",
      });
      return;
    }
    if (!editedEstimatedTime.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Estimated time cannot be empty.",
      });
      return;
    }

    onSave({
      ...subtask,
      task: editedTaskText,
      estimatedTime: editedEstimatedTime,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openStatus) => { if (!openStatus) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subtask</DialogTitle>
          <DialogDescription>
            Make changes to your subtask here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-title" className="text-right">
              Title
            </Label>
            <Input
              id="task-title"
              value={editedTaskText}
              onChange={(e) => setEditedTaskText(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimated-time" className="text-right">
              Est. Time
            </Label>
            <Input
              id="estimated-time"
              value={editedEstimatedTime}
              onChange={(e) => setEditedEstimatedTime(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 1 hour, 30 mins"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
