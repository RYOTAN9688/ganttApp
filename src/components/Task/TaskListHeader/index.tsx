// src/component/TaskList/TaskListHeader.tsx
import React from "react";
import { Task } from "../../../types/task";
import styles from "./index.module.css";

interface TaskListHeaderProps {
  sortBy: keyof Task | null;
  sortOrder: "asc" | "desc";
  handleSort: (key: keyof Task) => void;
  getSortIcon: (key: keyof Task) => string;
  onAddTaskClick: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  handleSort,
  getSortIcon,
  onAddTaskClick,
}) => {
  return (
    <div className={styles.headerRow}>
      <div className={styles.headerItem} onClick={() => handleSort("name")}>
        タスク名
        <span className={styles.sortIcon}>{getSortIcon("name")}</span>
      </div>
      <div
        className={styles.headerItem}
        onClick={() => handleSort("startDate")}
      >
        開始日
        <span className={styles.sortIcon}>{getSortIcon("startDate")}</span>
      </div>
      <div className={styles.headerItem} onClick={() => handleSort("endDate")}>
        終了日
        <span className={styles.sortIcon}>{getSortIcon("endDate")}</span>
      </div>
      <div className={styles.headerItem}>期間</div>
      <button className={styles.addButton} onClick={onAddTaskClick}>
        +
      </button>
    </div>
  );
};

export default TaskListHeader;
