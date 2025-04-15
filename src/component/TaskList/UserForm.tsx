import React, { useState } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";

interface UserFormProps {
  onSave: (newTask: Omit<Task, "id" | "children">) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = () => {
    if (name && startDate && endDate) {
      onSave({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      setName("");
      setStartDate("");
      setEndDate("");
    } else {
      alert("タスク名、開始日、終了日をすべて入力してください。");
    }
  };

  return (
    <div className={styles.userForm}>
      <h3>新しいタスクを追加</h3>
      <div className={styles.formGroup}>
        <label htmlFor="name">タスク名:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="startDate">開始日:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="endDate">終了日:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={styles.formActions}>
        <button onClick={handleSave}>保存</button>
        <button onClick={onCancel}>キャンセル</button>
      </div>
    </div>
  );
};

export default UserForm;
