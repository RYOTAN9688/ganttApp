// src/hooks/useTaskSidebar.ts
import { useState, useCallback } from "react";
import { Task } from "../types/task";

const useTaskSidebar = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setSelectedTask(null);
  }, []);

  return {
    selectedTask,
    isSidebarOpen,
    handleTaskClick,
    handleCloseSidebar,
  };
};

export default useTaskSidebar;
