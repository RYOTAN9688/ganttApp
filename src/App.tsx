// src/App.tsx
import React, { useState } from "react";
import Sidebar from "./component/SideBar";
import TaskList from "./component/TaskList";
import styles from "./component/styles/App.module.css";
import { Task } from "./component/types/task";
import { initialTasks as initialTasksData } from "./data/initialTask";
import GanttChart from "./component/GanttChart"; // Import GanttChart

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasksData);

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const menuItems = ["HOME画面", "管理画面"];

  return (
    <div className={styles.appContainer}>
      <Sidebar items={menuItems} />
      <div className={styles.content}>
        <TaskList tasks={tasks} onAddTask={addTask} setTasks={setTasks} />
        <GanttChart tasks={tasks} />
      </div>
    </div>
  );
};

export default App;
