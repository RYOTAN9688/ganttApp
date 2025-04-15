import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";

interface TaskRowProps {
  task: Task;
  indentLevel?: number;
  onAddTask?: () => void;
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

  return (
    <>
      <tr className={styles.taskRow}>
        <td
          className={`${styles.taskNameCell} ${
            hasChildren ? styles.parentTask : ""
          }`}
          style={indentStyle}
          onClick={hasChildren ? toggleExpand : undefined} // 子要素がある場合のみクリック可能にする
        >
          {hasChildren && (
            <span className={styles.expandIcon}>{isExpanded ? "▶︎" : "▼"}</span>
          )}
          {task.name}
        </td>
        <td>{task.startDate.toLocaleDateString()}</td>
        <td>{task.endDate.toLocaleDateString()}</td>
        <td>
          {onAddTask && (
            <button className={styles.addButton} onClick={onAddTask}>
              +
            </button>
          )}
        </td>
      </tr>
      {isExpanded &&
        task.children?.map(
          (
            childTask // isExpanded が true の場合のみ子要素をレンダリング
          ) => (
            <TaskRow
              key={childTask.id}
              task={childTask}
              indentLevel={indentLevel + 1}
              onAddTask={onAddTask}
            />
          )
        )}
    </>
  );
};

export default TaskRow;
