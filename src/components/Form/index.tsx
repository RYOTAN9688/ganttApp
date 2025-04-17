// src/component/Form/index.tsx
import React, { useState } from "react";
import { Task } from "../../types/task";
import styles from "./index.module.css";
import { format } from "date-fns";

interface UserFormProps {
  onSave: (taskData: Omit<Task, "id" | "parentId">) => Promise<void>;
  onCancel: () => void;
  initialTask?: Omit<Task, "id" | "parentId">;
}

const UserForm: React.FC<UserFormProps> = ({
  onSave,
  onCancel,
  initialTask,
}) => {
  const [name, setName] = useState(initialTask?.name || "");
  const [startDate, setStartDate] = useState<Date | null>(
    initialTask?.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialTask?.endDate || null
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name) {
      onSave({ name, startDate, endDate });
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{initialTask ? "タスクを編集" : "新しいタスクを追加"}</h2>
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
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                setStartDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">終了日:</label>
            <input
              type="date"
              id="endDate"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                setEndDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              保存
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
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
