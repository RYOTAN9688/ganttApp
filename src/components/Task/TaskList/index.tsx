// src/component/TaskList/index.tsx
import React, { useState, useCallback, useEffect } from "react";
import styles from "./index.module.css";
import { Task } from "../../../types/task.ts";
import TaskSidebar from "../TaskSideBar/index.tsx";
import TaskForm from "../TaskForm/index.tsx";
import TaskListHeader from "../TaskListHeader/index.tsx";
import TaskTree from "../TaskTree/index.tsx";
import useTasks from "../../../hooks/useTasks.ts";
import useTaskSorting from "../../../hooks/useTaskSorting.ts";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  expandedTasks: { [taskId: string]: boolean };
  toggleExpand: (taskId: string) => void;
  parentTaskColor: string;
  childTaskColor: string;
  onParentTaskColorChange: (color: string) => void;
  onChildTaskColorChange: (color: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  setTasks,
  expandedTasks,
  toggleExpand,
  parentTaskColor,
  childTaskColor,
  onParentTaskColorChange,
  onChildTaskColorChange,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    fetchTasks,
    addTask: addTaskToFirestore,
    handleAddTaskToParent: handleAddTaskToParentFirestore,
    updateTask: updateTaskInFirestore,
    deleteTask: deleteTaskFromFirestore,
    refreshTasks,
  } = useTasks({ setTasks });

  const { sortBy, sortOrder, handleSort, getSortIcon, sortedTasks } =
    useTaskSorting({ tasks: initialTasks });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTasks]);

  const handleSaveNewTask = async (
    newTaskData: Omit<Task, "id" | "parentId">
  ) => {
    setIsAddingTask(false);
    await addTaskToFirestore(newTaskData);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

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

  const handleDeletetask = async (taskId: string) => {
    await deleteTaskFromFirestore(taskId);
    handleCloseSidebar();
  };

  const handleParentTaskColorChangeInTaskList = (color: string) => {
    onParentTaskColorChange(color);
  };

  const handleChildTaskColorChangeInTaskList = (color: string) => {
    onChildTaskColorChange(color);
  };

  return (
    <div className={styles.taskListContainer}>
      {isAddingTask && (
        <TaskForm onSave={handleSaveNewTask} onCancel={handleCancelAddTask} />
      )}
      <TaskListHeader
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        onAddTaskClick={() => setIsAddingTask(true)}
      />
      <div className={styles.taskItems}>
        <TaskTree
          tasks={initialTasks}
          expandedTasks={expandedTasks}
          toggleExpand={toggleExpand}
          handleAddTaskToParent={handleAddTaskToParentFirestore}
          getChildTasks={getChildTasks}
          sortedTasks={sortedTasks}
          onTaskClick={handleTaskClick}
        />
      </div>
      {isSidebarOpen && selectedTask && (
        <div className={styles.sidebar}>
          <TaskSidebar
            task={selectedTask}
            onClose={handleCloseSidebar}
            onSave={updateTaskInFirestore}
            onDelete={handleDeletetask}
            onParentTaskColorChange={handleParentTaskColorChangeInTaskList}
            onChildTaskColorChange={handleChildTaskColorChangeInTaskList}
            defaultParentTaskColor={parentTaskColor}
            defaultChildTaskColor={childTaskColor}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
