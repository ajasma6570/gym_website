"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle, Circle, Edit, Trash2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string | null;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onToggleComplete?: (taskId: number, currentStatus: boolean) => void;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const handleEdit = () => {
    onEdit?.(task);
    onClose();
  };

  const handleDelete = () => {
    onDelete?.(task.id);
    onClose();
  };

  const handleToggleComplete = () => {
    onToggleComplete?.(task.id, task.isComplete);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-orange-500" />
            )}
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <Badge variant={task.isComplete ? "default" : "secondary"}>
              {task.isComplete ? "Completed" : "Pending"}
            </Badge>
          </div>

          {task.description && (
            <div>
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Created</h4>
              <p className="text-muted-foreground">
                {format(new Date(task.createdAt), "PPP 'at' p")}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p className="text-muted-foreground">
                {format(new Date(task.updatedAt), "PPP 'at' p")}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleToggleComplete}
              className="flex items-center gap-2"
            >
              {task.isComplete ? (
                <>
                  <Circle className="h-4 w-4" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Mark as Complete
                </>
              )}
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
