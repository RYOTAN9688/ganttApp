import React, { useState, useMemo } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import TaskRow from "./TaskRow";
import UserForm from "./UserForm";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (newTask: Task) => void; // 親コンポーネントからタスク追加関数を受け取る
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask }) => {
  const [sortBy, setSortBy] = useState<keyof Task | null>("name"); // 初期ソート対象をnameとする
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddingTask, setIsAddingTask] = useState(false);

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
        // 他の型に対する比較ロジックが必要な場合はここに追加
      }
      return 0; // 比較できない場合は順序を維持
    };

    // childrenがある場合は、親要素を先にソートし、子要素はそのままの順序とする（簡易的な実装）
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
    <div className={styles.taskListContainer}>
      {isAddingTask && (
        <UserForm onSave={handleSaveNewTask} onCancel={handleCancelAddTask} />
      )}
      <div className={styles.header}>
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
        <div
          className={styles.headerItem}
          onClick={() => handleSort("endDate")}
        >
          終了日
          <span className={styles.sortIcon}>{getSortIcon("endDate")}</span>
        </div>
        <div className={styles.headerItem}>
          <button className={styles.addButton} onClick={handleAddTaskClick}>
            +
          </button>
        </div>
      </div>
      <div className={styles.taskItems}>
        {sortedTasks.map((task) => (
          <TaskRow key={task.id} task={task} onAddTask={onAddTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
