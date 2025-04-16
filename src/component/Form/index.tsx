import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";

interface UserFormProps {
  onSave: (newTask: Omit<Task, "id" | "children">) => void;
  onCancel: () => void;
  initialName?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  onSave,
  onCancel,
  initialName = "",
  initialStartDate = new Date().toISOString().slice(0, 10),
  initialEndDate = new Date().toISOString().slice(0, 10),
}) => {
  const [name, setName] = useState(initialName);
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);

  const handleSubmit = (event: React.FormEvent) => {
    console.log("UserForm: handleSubmit 関数が実行されました");
    event.preventDefault();
    console.log("UserForm: handleSubmit が実行されました", {
      name,
      startDate,
      endDate,
    });
    console.log("UserForm: onSave を呼び出す前");
    onSave({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    console.log("UserForm: onSave を呼び出した後");
    setName("");
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>新しいタスクを追加</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">タスク名:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">開始日:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">終了日:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              保存
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
