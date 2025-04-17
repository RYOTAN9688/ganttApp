// App.tsx
import { useState } from "react";
import TaskList from "./components/Task/TaskList";
import Sidebar from "./components/SideBar";
import GanttChart from "./components/GanttChart"; // インポート
import { Task } from "./types/task";
import styles from "./styles/App.module.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const sidebarItems = ["HOME", "管理画面"];
  const [expandedTasks, setExpandedTasks] = useState<{
    [taskId: string]: boolean;
  }>({}); // App で保持
  const [parentTaskColor, setParentTaskColor] = useState("#28a745");
  const [childTaskColor, setChildTaskColor] = useState("#007bff");

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar items={sidebarItems} />
      <div className={styles.content}>
        <div style={{ flex: 1, overflowX: "auto" }}>
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            expandedTasks={expandedTasks}
            toggleExpand={toggleExpand}
            parentTaskColor={parentTaskColor}
            childTaskColor={childTaskColor}
            onParentTaskColorChange={setParentTaskColor}
            onChildTaskColorChange={setChildTaskColor}
          />
        </div>
        <div>
          <GanttChart
            tasks={tasks}
            expandedTasks={expandedTasks}
            parentTaskColor={parentTaskColor}
            childTaskColor={childTaskColor}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
