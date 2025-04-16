// src/component/TaskList/TaskList.tsx
import React, { useState, useMemo } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import TaskRow from "../TaskRow";
import UserForm from "../Form";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onAddTask: (newTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, setTasks }) => {
  const [sortBy, setSortBy] = useState<keyof Task | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [nextTopLevelId, setNextTopLevelId] = useState<number>(
    tasks.reduce((maxId, task) => Math.max(maxId, parseInt(task.id, 10)), 0) +
      1 || 5
  );

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

  const handleSaveNewTask = (newTaskData: Omit<Task, "id" | "children">) => {
    const newTask: Task = {
      id: nextTopLevelId.toString(),
      ...newTaskData,
      children: [],
    };
    onAddTask(newTask);
    setNextTopLevelId((prevId) => prevId + 1);
    setIsAddingTask(false);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

  const handleAddTaskToParent = (newTask: Task, parentId: string) => {
    const updateTasks = (taskList: Task[]): Task[] => {
      return taskList.map((task) => {
        if (task.id === parentId) {
          const newChildId = generateChildId(task);
          return {
            ...task,
            children: [
              ...(task.children || []),
              { ...newTask, id: newChildId },
            ].map((child) => ({ ...child })),
          };
        } else if (task.children) {
          return { ...task, children: updateTasks(task.children) };
        }
        return { ...task };
      });
    };

    const updatedTaskList = updateTasks([...tasks]);
    setTasks(updatedTaskList);
  };

  const generateChildId = (parentTask: Task): string => {
    const baseId = parentTask.id;
    let nextNumber = 1;

    if (parentTask.children && parentTask.children.length > 0) {
      const childIds = parentTask.children.map((child) => child.id);
      const lastChildId = childIds.reduce((maxId, currentId) => {
        const partsMax = maxId.split(".");
        const partsCurrent = currentId.split(".");
        if (
          partsMax.slice(0, -1).join(".") ===
          partsCurrent.slice(0, -1).join(".")
        ) {
          const numMax = parseInt(partsMax[partsMax.length - 1], 10);
          const numCurrent = parseInt(
            partsCurrent[partsCurrent.length - 1],
            10
          );
          return numCurrent > numMax ? currentId : maxId;
        }
        return maxId;
      }, baseId + ".0");

      const lastChildIdParts = lastChildId.split(".");
      const lastNumber = parseInt(
        lastChildIdParts[lastChildIdParts.length - 1],
        10
      );
      nextNumber = lastNumber + 1;
    }

    return `${baseId}.${nextNumber}`;
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
        <div className={styles.headerItem}>期間</div>
      </div>
      <div className={styles.taskItems}>
        {sortedTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onAddTask={handleAddTaskToParent}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
