import { useState, useEffect, useCallback } from "react";
import TaskList from "./component/TaskList/";
import Sidebar from "./component/SideBar/"; // Sidebar コンポーネントのインポート
import { Task } from "./component/types/task";
import { db } from "./configs/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import styles from "./component/styles/App.module.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const sidebarItems = ["HOME", "管理画面"]; // Sidebar に渡すメニュー項目
  const [refreshTasks, setRefreshTasks] = useState(false);

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
  }, []);

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
      setTasks([
        ...tasks,
        { id: docRef.id, parentId: null, ...newTaskData } as Task,
      ]);
      setRefreshTasks((prev) => !prev); // Refresh tasks after adding a top-level task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskAdded = useCallback(() => {
    setRefreshTasks((prev) => !prev); // Trigger a re-fetch
  }, []);

  return (
    <div className={styles.appContainer}>
      <Sidebar items={sidebarItems} />
      <div className={styles.mainContent}>
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          onAddTask={addTask}
          onTaskAdded={handleTaskAdded}
        />
      </div>
    </div>
  );
}

export default App;
