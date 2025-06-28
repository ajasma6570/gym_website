"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
} from "lucide-react";
import {
  useTaskDetails,
  useTaskToggleComplete,
  useTaskDelete,
} from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import modals
const TaskForm = dynamic(() => import("@/components/admin/Task/TaskForm"));
const TaskDeleteConfirmModal = dynamic(
  () => import("@/components/admin/Task/TaskDeleteConfirmModal")
);

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const { data: task, isLoading, error } = useTaskDetails(taskId);
  const { mutate: toggleComplete } = useTaskToggleComplete();
  const { mutate: deleteTask } = useTaskDelete();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggleComplete = () => {
    if (task) {
      toggleComplete({ taskId: task.id, isComplete: !task.isComplete });
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (task) {
      deleteTask(task.id);
      setIsDeleteModalOpen(false);
      router.push("/admin/tasks");
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading task details...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The task you&#39;re looking for doesn&#39;t exist or has been
            deleted.
          </p>
          <Button onClick={() => router.push("/admin/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">Task Details</h1>
            <p className="text-muted-foreground">
              View and manage task information
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-2 space-x-2">
          <Button
            variant={task.isComplete ? "secondary" : "secondary"}
            onClick={handleToggleComplete}
          >
            {task.isComplete ? (
              <>
                <Circle className="mr-2 h-4 w-4" />
                Mark as Pending
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="default" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <Badge variant={task.isComplete ? "default" : "secondary"}>
                  {task.isComplete ? "Completed" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                {task.description ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Metadata */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(task.createdAt),
                      "MMMM dd, yyyy 'at' HH:mm"
                    )}
                  </p>
                </div>
              </div>

              {task.updatedAt !== task.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(task.updatedAt),
                        "MMMM dd, yyyy 'at' HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  {task.isComplete ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <TaskForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
        />
      )}

      {isDeleteModalOpen && (
        <TaskDeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          taskId={task.id}
        />
      )}
    </div>
  );
}
