import React, { useState, useMemo } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import TaskRow from "./TaskRow";
import UserForm from "./UserForm";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (newTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask }) => {
  const [sortBy, setSortBy] = useState<keyof Task | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const Tasks = useMemo(() => {
    if (!sortBy) {
      return tasks;
    }

    const compare = (a: Task, b: Task) => {
      if (sortBy && a.hasOwnProperty(sortBy) && b.hasOwnProperty(sortBy)) {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (
          sortBy === "name" &&
          typeof valueA === "string" &&
          typeof valueB === "string"
        ) {
          if (valueA < valueB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        } else if (
          (sortBy === "startDate" || sortBy === "endDate") &&
          valueA instanceof Date &&
          valueB instanceof Date
        ) {
          if (valueA.getTime() < valueB.getTime()) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (valueA.getTime() > valueB.getTime()) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        }
      }
      return 0; // 比較できない場合は順序を維持
    };

    const sortWithChildren = (taskList: Task[]): Task[] => {
      const sorted = [...taskList].sort(compare);
      return sorted.map((task) => ({
        ...task,
        children: task.children ? sortWithChildren(task.children) : undefined,
      }));
    };

    return sortWithChildren(tasks);
  }, [tasks, sortBy, sortOrder]);

  const handleSort = (column: keyof Task) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: keyof Task) => {
    if (column === sortBy) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↓↑";
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const handleSaveNewTask = (newTaskData: Omit<Task, "id" | "children">) => {
    const newTask: Task = { id: Date.now().toString(), ...newTaskData };
    onAddTask(newTask);
    setIsAddingTask(false);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

  return (
    <div className={styles.taskList}>
      {isAddingTask && (
        <div
          className={styles.modalOverlay}
          onClick={handleCancelAddTask}
        ></div>
      )}
      {isAddingTask && (
        <UserForm onSave={handleSaveNewTask} onCancel={handleCancelAddTask} />
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              工程{" "}
              <span className={styles.sortIcon}>{getSortIcon("name")}</span>
            </th>
            <th onClick={() => handleSort("startDate")}>
              開始日{" "}
              <span className={styles.sortIcon}>
                {getSortIcon("startDate")}
              </span>
            </th>
            <th onClick={() => handleSort("endDate")}>
              終了日{" "}
              <span className={styles.sortIcon}>{getSortIcon("endDate")}</span>
            </th>
            <th>
              <button className={styles.addButton} onClick={handleAddTaskClick}>
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {Tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
