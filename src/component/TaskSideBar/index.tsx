import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import { format } from "date-fns";
import { useTheme } from "../../context/ThemeContext"; // Import the useTheme hook

interface TaskSidebarProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ task, onClose, onSave }) => {
  const { theme } = useTheme(); // Get the current theme
  const [name, setName] = useState(task.name);
  const [startDate, setStartDate] = useState<Date>(
    task.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(task.endDate || new Date());

  useEffect(() => {
    setName(task.name);
    if (task.startDate) {
      setStartDate(task.startDate);
    }
    if (task.endDate) {
      setEndDate(task.endDate);
    }
  }, [task]);

  const handleSave = () => {
    onSave({ ...task, name, startDate, endDate });
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${
        theme === "dark" ? styles.darkTheme : ""
      }`}
    >
      <h3>タスク詳細</h3>
      <button className={styles.closeButton} onClick={onClose}>
        X
      </button>
      <div className={styles.detailItem}>
        <label htmlFor="name">タスク名:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={theme === "dark" ? styles.darkInput : ""}
        />
      </div>
      <div className={styles.detailItem}>
        <label htmlFor="startDate">開始日:</label>
        <input
          type="date"
          id="startDate"
          value={format(startDate, "yyyy-MM-dd")}
          onChange={(e) =>
            setStartDate(e.target.value ? new Date(e.target.value) : new Date())
          }
          className={theme === "dark" ? styles.darkInput : ""}
        />
      </div>
      <div className={styles.detailItem}>
        <label htmlFor="endDate">終了日:</label>
        <input
          type="date"
          id="endDate"
          value={format(endDate, "yyyy-MM-dd")}
          onChange={(e) =>
            setEndDate(e.target.value ? new Date(e.target.value) : new Date())
          }
          className={theme === "dark" ? styles.darkInput : ""}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.saveButton} ${
            theme === "dark" ? styles.darkButton : ""
          }`}
          onClick={handleSave}
        >
          保存
        </button>
        <button
          className={`${styles.cancelButton} ${
            theme === "dark" ? styles.darkButton : ""
          }`}
          onClick={onClose}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default TaskSidebar;
