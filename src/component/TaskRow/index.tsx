// src/component/TaskRow/TaskRow.tsx
import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import UserForm from "../Form";

interface TaskRowProps {
  task: Task;
  indentLevel?: number;
  onAddTask?: (newTask: Task, parentId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  indentLevel = 0,
  onAddTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = task.children && task.children.length > 0;
  const indentStyle = { paddingLeft: `${indentLevel * 20}px` };
  const [isAddingChild, setIsAddingChild] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddTaskChildClick = () => {
    setIsAddingChild(true);
  };

  const handleSaveChildTask = (newTaskData: Omit<Task, "id" | "children">) => {
    if (onAddTask) {
      onAddTask(
        { id: Date.now().toString(), ...newTaskData, children: [] },
        task.id
      );
      setIsAddingChild(false);
    }
  };

  const handleCancelAddTaskChild = () => {
    setIsAddingChild(false);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDuration = (startDate: Date, endDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    return (
      Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) +
      1
    );
  };

  return (
    <>
      <div className={styles.taskItem}>
        <div className={styles.taskNameCell} style={indentStyle}>
          {hasChildren && (
            <span className={styles.expandIcon} onClick={toggleExpand}>
              {isExpanded ? "▼" : "▶︎"}
            </span>
          )}
          {task.name}
        </div>
        <div className={styles.taskDate}>{formatDate(task.startDate)}</div>
        <div className={styles.taskEndDate}>
          {task.endDate ? formatDate(task.endDate) : "-"}
        </div>
        <div className={styles.taskDuration}>
          {task.endDate && task.startDate
            ? calculateDuration(task.startDate, task.endDate)
            : "-"}
        </div>
        <div className={styles.taskActions}>
          <button
            className={styles.addChildButton}
            onClick={handleAddTaskChildClick}
          >
            +
          </button>
        </div>
      </div>
      {isExpanded &&
        task.children?.map((childTask) => (
          <TaskRow
            key={childTask.id}
            task={childTask}
            indentLevel={indentLevel + 1}
            onAddTask={onAddTask}
          />
        ))}
      {isAddingChild && (
        <UserForm
          initialName="New Child Task"
          initialStartDate={formatDate(task.startDate)}
          initialEndDate={
            task.endDate ? formatDate(task.endDate) : formatDate(task.startDate)
          }
          onSave={handleSaveChildTask}
          onCancel={handleCancelAddTaskChild}
        />
      )}
    </>
  );
};

export default TaskRow;
