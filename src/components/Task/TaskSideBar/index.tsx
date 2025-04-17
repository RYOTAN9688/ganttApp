// src/component/TaskSideBar/index.tsx
import React, { useState, useEffect } from "react";
import { Task } from "../../../types/task";
import styles from "./index.module.css";
import { format } from "date-fns";

interface TaskSidebarProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  defaultParentTaskColor: string;
  defaultChildTaskColor: string;
  onParentTaskColorChange: (color: string) => void;
  onChildTaskColorChange: (color: string) => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  task: initialTask,
  onClose,
  onSave,
  onDelete,
  defaultParentTaskColor,
  defaultChildTaskColor,
  onParentTaskColorChange,
  onChildTaskColorChange,
}) => {
  const [name, setName] = useState(initialTask.name);
  const [startDate, setStartDate] = useState<Date | null>(
    initialTask.startDate
  );
  const [endDate, setEndDate] = useState<Date | null>(initialTask.endDate);
  const [parentColor, setParentColor] = useState(
    initialTask.parentColor || defaultParentTaskColor
  );
  const [childColor, setChildColor] = useState(
    initialTask.childColor || defaultChildTaskColor
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for confirmation

  useEffect(() => {
    setName(initialTask.name);
    setStartDate(initialTask.startDate);
    setEndDate(initialTask.endDate);
    setParentColor(initialTask.parentColor || defaultParentTaskColor);
    setChildColor(initialTask.childColor || defaultChildTaskColor);
  }, [initialTask, defaultParentTaskColor, defaultChildTaskColor]);

  const handleParentColorChange = (color: string) => {
    setParentColor(color);
    onParentTaskColorChange(color);
  };

  const handleChildColorChange = (color: string) => {
    setChildColor(color);
    onChildTaskColorChange(color);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value ? new Date(event.target.value) : null);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value ? new Date(event.target.value) : null);
  };

  const handleSave = () => {
    const updatedTask: Task = {
      ...initialTask,
      name,
      startDate,
      endDate,
      parentColor: initialTask.parentId === null ? parentColor : undefined,
      childColor: initialTask.parentId !== null ? childColor : undefined,
    };
    onSave(updatedTask);
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true); // Show confirmation
  };

  const confirmDelete = () => {
    onDelete(initialTask.id);
    setShowDeleteConfirmation(false); // Hide confirmation after deletion
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide confirmation
  };

  return (
    <div className={styles.sidebarContainer}>
      <h3 className={styles.h3}>タスク詳細</h3>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      <div className={styles.detailItem}>
        <label>タスク名:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.detailItem}>
        <label>開始日:</label>
        <input
          type="date"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={handleStartDateChange}
        />
      </div>
      <div className={styles.detailItem}>
        <label>終了日:</label>
        <input
          type="date"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
          onChange={handleEndDateChange}
        />
      </div>
      {initialTask.parentId === null && (
        <div className={styles.detailItem}>
          <label>親タスクの色:</label>
          <input
            type="color"
            value={parentColor}
            onChange={(e) => handleParentColorChange(e.target.value)}
          />
        </div>
      )}
      {initialTask.parentId !== null && (
        <div className={styles.detailItem}>
          <label>子タスクの色:</label>
          <input
            type="color"
            value={childColor}
            onChange={(e) => handleChildColorChange(e.target.value)}
          />
        </div>
      )}

      {showDeleteConfirmation && (
        <div className={styles.deleteConfirmation}>
          <p>このタスクを本当に削除しますか？</p>
          <div className={styles.confirmationButtons}>
            <button
              className={styles.confirmDeleteButton}
              onClick={confirmDelete}
            >
              はい
            </button>
            <button
              className={styles.cancelDeleteButton}
              onClick={cancelDelete}
            >
              いいえ
            </button>
          </div>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} onClick={handleSave}>
          保存
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          削除
        </button>
      </div>
    </div>
  );
};

export default TaskSidebar;
