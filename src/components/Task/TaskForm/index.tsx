// src/component/TaskList/TaskForm.tsx
import React from "react";
import { Task } from "../../../types/task";
import UserForm from "../../Form";

interface TaskFormProps {
  onSave: (taskData: Omit<Task, "id" | "parentId">) => Promise<void>;
  onCancel: () => void;
  initialTask?: Omit<Task, "id" | "parentId">;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel }) => {
  return <UserForm onSave={onSave} onCancel={onCancel} />;
};

export default TaskForm;
