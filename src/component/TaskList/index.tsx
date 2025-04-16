import React, { useState, useMemo, useCallback } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task"; // パスを修正
import TaskRow from "../TaskRow";
import UserForm from "../Form";
import { db } from "../../configs/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onAddTask: (newTaskData: Omit<Task, "id" | "parentId">) => void;
  onTaskAdded: () => void; // New prop to trigger data refresh in App.tsx
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  setTasks,
  onTaskAdded,
}) => {
  const [sortBy, setSortBy] = useState<keyof Task | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleSaveNewTask = async (
    newTaskData: Omit<Task, "id" | "parentId">
  ) => {
    setIsAddingTask(false);
    onAddTask(newTaskData);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

  const handleAddTaskToParent = useCallback(
    async (newTask: Omit<Task, "id" | "parentId">, parentId: string) => {
      console.log("handleAddTaskToParent called with parentId:", parentId);

      try {
        const docRef = await addDoc(collection(db, "tasks"), {
          ...newTask,
          startDate: newTask.startDate
            ? Timestamp.fromDate(newTask.startDate)
            : null,
          endDate: newTask.endDate ? Timestamp.fromDate(newTask.endDate) : null,
          parentId: parentId,
        });
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: docRef.id, parentId: parentId, ...newTask } as Task,
        ]);
        onTaskAdded(); // Trigger data refresh after adding a task
      } catch (error) {
        console.error("Error adding child task to Firestore:", error);
      }
    },
    [setTasks, onTaskAdded]
  );

  const handleSort = (key: keyof Task) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (key: keyof Task) => {
    if (sortBy === key) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const sortedTasks = useMemo(() => {
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
      return 0;
    };
    return [...tasks].sort(compare);
  }, [tasks, sortBy, sortOrder]);

  const getChildTasks = useCallback(
    (parentId: string | null, taskList: Task[]): Task[] => {
      return taskList.filter((task) => task.parentId === parentId);
    },
    []
  );

  const renderTasks = useCallback(
    (parentTaskId: string | null = null, level: number = 0) => {
      const childTasks = getChildTasks(parentTaskId, sortedTasks);
      return childTasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          level={level}
          onAddTask={handleAddTaskToParent}
        >
          {renderTasks(task.id, level + 1)}
        </TaskRow>
      ));
    },
    [getChildTasks, handleAddTaskToParent, sortedTasks]
  );

  return (
    <div>
      {isAddingTask && (
        <UserForm onSave={handleSaveNewTask} onCancel={handleCancelAddTask} />
      )}
      <div className={styles.header}>
        <div className={styles.headerItem} onClick={() => handleSort("name")}>
          タスク名 {getSortIcon("name")}
        </div>
        <div
          className={styles.headerItem}
          onClick={() => handleSort("startDate")}
        >
          開始日 {getSortIcon("startDate")}
        </div>
        <div
          className={styles.headerItem}
          onClick={() => handleSort("endDate")}
        >
          終了日 {getSortIcon("endDate")}
        </div>
        <div className={styles.headerItem}>期間</div>
        <button
          className={styles.addButton}
          onClick={() => setIsAddingTask(true)}
        >
          +
        </button>
      </div>
      <div className={styles.taskItems}>{renderTasks(null, 0)}</div>
    </div>
  );
};

export default TaskList;
