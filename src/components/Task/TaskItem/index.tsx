// src/component/TaskList/TaskItem.tsx
import React from "react";
import { Task } from "../../../types/task";
import TaskRow from "../TaskRow";
import styles from "./index.module.css";

interface TaskItemProps {
  task: Task;
  level: number;
  onAddTask: (
    newTask: Omit<Task, "id" | "parentId">,
    parentId: string
  ) => Promise<void>;
  toggleExpand: (taskId: string) => void;
  expandedTasks: { [taskId: string]: boolean };
  getChildTasks: (parentId: string | null, taskList: Task[]) => Task[];
  sortedTasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  level,
  onAddTask,
  toggleExpand,
  expandedTasks,
  getChildTasks,
  sortedTasks,
  onTaskClick,
}) => {
  const isExpanded = expandedTasks[task.id];
  const hasChildren = getChildTasks(task.id, sortedTasks).length > 0;

  return (
    <React.Fragment key={task.id}>
      <TaskRow
        task={task}
        level={level}
        onAddTask={onAddTask}
        toggleExpand={toggleExpand}
        expandedTasks={expandedTasks}
        onTaskClick={onTaskClick}
      >
        {hasChildren && (
          <span
            className={styles.expandIcon}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click if any
              toggleExpand(task.id);
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
      </TaskRow>
      {isExpanded &&
        getChildTasks(task.id, sortedTasks).map((childTask) => (
          <TaskItem
            key={childTask.id}
            task={childTask}
            level={level + 1}
            onAddTask={onAddTask}
            toggleExpand={toggleExpand}
            expandedTasks={expandedTasks}
            getChildTasks={getChildTasks}
            sortedTasks={sortedTasks}
            onTaskClick={onTaskClick}
          />
        ))}
    </React.Fragment>
  );
};

export default TaskItem;
