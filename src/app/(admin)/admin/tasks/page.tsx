"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, Circle, Edit, Trash2 } from "lucide-react";
import {
  useTaskList,
  useTaskDelete,
  useTaskToggleComplete,
} from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import dynamic from "next/dynamic";

// Define Task interface
interface Task {
  id: number;
  title: string;
  description?: string | null;
  isComplete: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Dynamically import modals to avoid SSR issues
const TaskForm = dynamic(() => import("@/components/admin/Task/TaskForm"));
const TaskDeleteConfirmModal = dynamic(
  () => import("@/components/admin/Task/TaskDeleteConfirmModal")
);

export default function TaskPage() {
  const router = useRouter();
  const { data: tasks = [], isLoading } = useTaskList();
  const { mutate: deleteTask } = useTaskDelete();
  const { mutate: toggleComplete } = useTaskToggleComplete();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const completedTasks = tasks.filter((task) => task.isComplete);
  const pendingTasks = tasks.filter((task) => !task.isComplete);

  const handleToggleComplete = (taskId: number, currentStatus: boolean) => {
    toggleComplete({ taskId, isComplete: !currentStatus });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: number) => {
    setDeletingTaskId(taskId);
  };

  const confirmDelete = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between items-center mb-2 lg:mb-6">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-muted-foreground hidden lg:block">
            Manage your tasks and track progress.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      <p className="text-muted-foreground mb-6 lg:hidden">
        Manage your tasks and track progress.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 py-0">
            <CardTitle className="text-xl ">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-1 pb-0">
            <div className="text-xl font-semibold ">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card className="p-4 gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 py-0">
            <CardTitle className="text-xl ">Pending</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-1 pb-0">
            <div className="text-xl font-semibold text-orange-600">
              {pendingTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 py-0">
            <CardTitle className="text-md ">Completed</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-1 pb-0">
            <div className="text-xl font-semibold text-green-600">
              {completedTasks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-orange-500" />
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {pendingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No pending tasks. Great job
              </p>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 dark:bg-background dark:border-background/50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() =>
                        handleToggleComplete(task.id, task.isComplete)
                      }
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                    <div
                      className="flex-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => router.push(`/admin/tasks/${task.id}`)}
                    >
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {format(new Date(task.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed Tasks ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No completed tasks yet. Get started!
              </p>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 dark:bg-background dark:border-background/50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        handleToggleComplete(task.id, task.isComplete)
                      }
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <div
                      className="flex-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => router.push(`/admin/tasks/${task.id}`)}
                    >
                      <h4 className="font-medium line-through">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Completed:{" "}
                        {format(new Date(task.updatedAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Done</Badge>
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <TaskForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
        />
      )}

      {deletingTaskId && (
        <TaskDeleteConfirmModal
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={confirmDelete}
          taskId={deletingTaskId}
        />
      )}
    </div>
  );
}
