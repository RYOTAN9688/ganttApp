// src/component/TaskRow/TaskRow.tsx
import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import UserForm from "../Form";

interface TaskRowProps {
  task: Task;
  level?: number; // indentLevel から level に変更 (現在のロジックに合わせる)
  onAddTask?: (
    newTask: Omit<Task, "id" | "parentId">,
    parentId: string
  ) => void; // onAddTask の型を修正
  children?: React.ReactNode; // TaskList から子要素が渡されることを想定
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  level = 0,
  onAddTask,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = !!children; // children prop が存在するかどうかで子を持つか判断
  const indentStyle = { paddingLeft: `${level * 20}px` };
  const [isAddingChild, setIsAddingChild] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddTaskChildClick = () => {
    setIsAddingChild(true);
  };

  const handleSaveChildTask = (newTaskData: Omit<Task, "id" | "parentId">) => {
    // 型を修正
    if (onAddTask) {
      onAddTask(
        {
          id: Date.now().toString(),
          ...newTaskData,
          parentId: task.id,
        } as Task, // parentId を設定
        task.id
      );
      setIsAddingChild(false);
    }
  };

  const handleCancelAddTaskChild = () => {
    setIsAddingChild(false);
  };

  const formatDate = (date: Date | null | undefined): string => {
    // Date 型を修正
    if (!date) {
      return "-";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDuration = (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
  ): number => {
    // Date 型を修正
    if (!startDate || !endDate) {
      return 0;
    }
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
      {isExpanded && children} {/* TaskList から渡された子要素を表示 */}
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
