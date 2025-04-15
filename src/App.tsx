import React, { useState } from "react";
import Sidebar from "./component/SideBar";
import TaskList from "./component/TaskList/TaskList";
import styles from "./component/styles/App.module.css";
import { Task } from "./component/types/task";
import { initialTasks as initialTasksData } from "./data/initialTask"; // インポート

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasksData); // インポートしたデータを使用

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const menuItems = ["HOME画面", "管理画面"];

  return (
    <div className={styles.appContainer}>
      <Sidebar items={menuItems} />
      <div className={styles.content}>
        <h2>タスク一覧</h2>
        <TaskList tasks={tasks} onAddTask={addTask} />
      </div>
    </div>
  );
};

export default App;
