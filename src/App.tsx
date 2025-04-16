// App.tsx
import { useState } from "react";
import TaskList from "./component/TaskList/";
import Sidebar from "./component/SideBar/";
import GanttChart from "./component/GanttChart"; // インポート
import { Task } from "./component/types/task";
import styles from "./component/styles/App.module.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const sidebarItems = ["HOME", "管理画面"];
  const [expandedTasks, setExpandedTasks] = useState<{
    [taskId: string]: boolean;
  }>({}); // App で保持

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
          />
        </div>
        <div>
          <GanttChart tasks={tasks} expandedTasks={expandedTasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
