import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./index.module.css";
import { Task } from "../types/task";
import TaskRow from "../TaskRow";
import UserForm from "../Form";
import { db } from "../../configs/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import TaskSidebar from "../TaskSideBar/"; // Import the new component

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  expandedTasks: { [taskId: string]: boolean };
  toggleExpand: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  setTasks,
  expandedTasks,
  toggleExpand,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Task | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const initialTasksFromFirestore: Task[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          name: doc.data().name || "",
          startDate: doc.data().startDate?.toDate() || null,
          endDate: doc.data().endDate?.toDate() || null,
          parentId: doc.data().parentId || null,
        })
      );
      setTasks(initialTasksFromFirestore);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTasks]);

  const addTask = async (newTaskData: Omit<Task, "id" | "parentId">) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...newTaskData,
        startDate: newTaskData.startDate
          ? Timestamp.fromDate(newTaskData.startDate)
          : null,
        endDate: newTaskData.endDate
          ? Timestamp.fromDate(newTaskData.endDate)
          : null,
        parentId: null, // トップレベルのタスクのIDはnullにする
      });
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: docRef.id, parentId: null, ...newTaskData } as Task,
      ]);
      setRefreshTasks((prev) => !prev); // Refresh tasks after adding a top-level task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddTaskToParent = useCallback(
    async (newTask: Omit<Task, "id" | "parentId">, parentId: string) => {
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
        setRefreshTasks((prev) => !prev);
      } catch (error) {
        console.error("Error adding child task to Firestore:", error);
      }
    },
    [setTasks]
  );

  const handleSaveNewTask = async (
    newTaskData: Omit<Task, "id" | "parentId">
  ) => {
    setIsAddingTask(false);
    await addTask(newTaskData); // addTask を呼び出す
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

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
      return initialTasks;
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
    return [...initialTasks].sort(compare);
  }, [initialTasks, sortBy, sortOrder]);

  const getChildTasks = useCallback(
    (parentId: string | null, taskList: Task[]): Task[] => {
      return taskList.filter((task) => task.parentId === parentId);
    },
    []
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTask(null);
  };

  const updateTaskInFirestore = async (updatedTask: Task) => {
    if (!updatedTask.id) {
      console.error("Task ID is missing, cannot update.");
      return;
    }
    try {
      const taskDocRef = doc(db, "tasks", updatedTask.id);
      await updateDoc(taskDocRef, {
        name: updatedTask.name,
        startDate: updatedTask.startDate
          ? Timestamp.fromDate(updatedTask.startDate)
          : null,
        endDate: updatedTask.endDate
          ? Timestamp.fromDate(updatedTask.endDate)
          : null,
      });
      // Update the local state to reflect the changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setRefreshTasks((prev) => !prev); // Trigger a refresh to ensure data consistency
      handleCloseSidebar();
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
    }
  };

  const renderTasks = useCallback(
    (parentTaskId: string | null = null, level: number = 0) => {
      const childTasks = getChildTasks(parentTaskId, sortedTasks);
      return childTasks.map((task) => {
        const isExpanded = expandedTasks[task.id];
        const hasChildren = getChildTasks(task.id, sortedTasks).length > 0;

        return (
          <React.Fragment key={task.id}>
            <TaskRow
              task={task}
              level={level}
              onAddTask={handleAddTaskToParent}
              toggleExpand={toggleExpand}
              expandedTasks={expandedTasks}
              onTaskClick={handleTaskClick} // Pass the click handler
            >
              {hasChildren && (
                <span
                  className={styles.expandIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click if any
                    toggleExpand(task.id);
                  }}
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
            </TaskRow>
            {isExpanded && renderTasks(task.id, level + 1)}
          </React.Fragment>
        );
      });
    },
    [
      getChildTasks,
      sortedTasks,
      expandedTasks,
      toggleExpand,
      handleAddTaskToParent,
      handleTaskClick, // Include in dependencies
    ]
  );

  return (
    <div className={styles.taskListContainer}>
      {isAddingTask && (
        <UserForm onSave={handleSaveNewTask} onCancel={handleCancelAddTask} />
      )}
      <div className={styles.headerRow}>
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
        <button
          className={styles.addButton}
          onClick={() => setIsAddingTask(true)}
        >
          +
        </button>
      </div>
      <div className={styles.taskItems}>{renderTasks(null, 0)}</div>
      {isSidebarOpen && selectedTask && (
        <div className={styles.sidebar}>
          <TaskSidebar
            task={selectedTask}
            onClose={handleCloseSidebar}
            onSave={updateTaskInFirestore}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
