// src/component/TaskTree/index.tsx
import React, { useCallback } from "react";
import { Task } from "../../../types/task";
import TaskItem from "../TaskItem";

interface TaskTreeProps {
  tasks: Task[];
  expandedTasks: { [taskId: string]: boolean };
  toggleExpand: (taskId: string) => void;
  handleAddTaskToParent: (
    newTask: Omit<Task, "id" | "parentId">,
    parentId: string
  ) => Promise<void>;
  getChildTasks: (parentId: string | null, taskList: Task[]) => Task[];
  sortedTasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskTree: React.FC<TaskTreeProps> = ({
  expandedTasks,
  toggleExpand,
  handleAddTaskToParent,
  getChildTasks,
  sortedTasks,
  onTaskClick,
}) => {
  const renderTasks = useCallback(
    (parentTaskId: string | null = null, level: number = 0) => {
      const childTasks = getChildTasks(parentTaskId, sortedTasks);
      return childTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          level={level}
          onAddTask={handleAddTaskToParent}
          toggleExpand={toggleExpand}
          expandedTasks={expandedTasks}
          getChildTasks={getChildTasks}
          sortedTasks={sortedTasks}
          onTaskClick={onTaskClick}
        />
      ));
    },
    [
      getChildTasks,
      sortedTasks,
      expandedTasks,
      toggleExpand,
      handleAddTaskToParent,
      onTaskClick,
    ]
  );

  return <>{renderTasks(null, 0)}</>;
};

export default TaskTree;
