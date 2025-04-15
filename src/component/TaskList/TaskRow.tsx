import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";

interface TaskRowProps {
  task: Task;
  indentLevel?: number;
  onAddTask?: (newTask: Task) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  indentLevel = 0,
  onAddTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // 子タスクの表示状態を管理する state
  const hasChildren = task.children && task.children.length > 0;
  const indentStyle = { paddingLeft: `${indentLevel * 20}px` };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 表示状態を切り替える関数
  };

  const handleAddTaskChild = () => {
    if (onAddTask) {
      const newTask: Omit<Task, "id" | "children"> = {
        name: `Child of ${task.name}`,
        startDate: new Date(),
        endDate: new Date(),
      };
      onAddTask({ id: Date.now().toString(), ...newTask, children: [] }); // 簡単な子タスクの追加
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
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
        <div className={styles.taskEndDate}>{formatDate(task.endDate)}</div>
        <div className={styles.taskActions}>
          <button
            className={styles.addChildButton}
            onClick={handleAddTaskChild}
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
    </>
  );
};

export default TaskRow;
