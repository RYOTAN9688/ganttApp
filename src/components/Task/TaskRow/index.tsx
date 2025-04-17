import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../../../types/task";
import { format, differenceInDays } from "date-fns";
import UserForm from "../../Form";

interface TaskRowProps {
  task: Task;
  level: number;
  onAddTask: (newTask: Omit<Task, "id" | "parentId">, parentId: string) => void;
  children?: React.ReactNode;
  toggleExpand: (taskId: string) => void;
  expandedTasks: { [taskId: string]: boolean }; // 追加
  onTaskClick: (task: Task) => void; // New prop to handle task click
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  level,
  onAddTask,
  children,
  toggleExpand,
  expandedTasks,
  onTaskClick,
}) => {
  const [isAddingChild, setIsAddingChild] = useState(false);

  const handleAddChildTask = async (newTask: Omit<Task, "id" | "parentId">) => {
    setIsAddingChild(false);
    await onAddTask(newTask, task.id);
  };

  const handleCancelAddChild = () => {
    setIsAddingChild(false);
  };

  const duration =
    task.startDate && task.endDate
      ? differenceInDays(task.endDate, task.startDate) + 1
      : "";

  const indent = level * 20; // インデントの幅

  const isExpanded = !!expandedTasks[task.id]; // 展開状態を取得

  return (
    <div className={styles.taskItem} onClick={() => onTaskClick(task)}>
      {/* Make the entire row clickable */}
      <div
        className={styles.taskContent}
        style={{ paddingLeft: `${indent + 16}px` }}
      >
        <div className={styles.taskNameCell}>
          {children && (
            <span
              className={styles.expandIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(task.id);
              }}
            >
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
          {task.name}
        </div>
        <div className={styles.taskDate}>
          {task.startDate ? format(task.startDate, "yyyy/MM/dd") : "-"}
        </div>
        <div className={styles.taskEndDate}>
          {task.endDate ? format(task.endDate, "yyyy/MM/dd") : "-"}
        </div>
        <div className={styles.taskDuration}>{duration}</div>
        <div className={styles.taskActions}>
          <button
            className={styles.addChildButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingChild(true);
            }}
          >
            +
          </button>
          {isAddingChild && (
            <UserForm
              onSave={handleAddChildTask}
              onCancel={handleCancelAddChild}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
