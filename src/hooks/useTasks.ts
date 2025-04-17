// src/hooks/useTasks.ts
import { useState, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Task } from "../types/task";
import { db } from "../configs/firebase";

interface UseTasksProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const useTasks = ({ setTasks }: UseTasksProps) => {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const initialTasksFromFirestore: Task[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          name: doc.data().name || "",
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
          parentId: doc.data().parentId || null,
          parentColor: doc.data().parentColor || undefined,
          childColor: doc.data().childColor || undefined,
        })
      );
      setTasks(initialTasksFromFirestore);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [setTasks]);

  const addTask = useCallback(
    async (newTaskData: Omit<Task, "id" | "parentId">) => {
      try {
        const docRef = await addDoc(collection(db, "tasks"), {
          ...newTaskData,
          startDate: newTaskData.startDate
            ? Timestamp.fromDate(newTaskData.startDate)
            : null,
          endDate: newTaskData.endDate
            ? Timestamp.fromDate(newTaskData.endDate)
            : null,
          parentId: null,
        });
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: docRef.id, parentId: null, ...newTaskData } as Task,
        ]);
        setRefreshTasks((prev) => !prev);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [setTasks]
  );

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

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      if (!updatedTask.id) {
        console.error("Task ID is missing, cannot update.");
        return;
      }
      try {
        const taskDocRef = doc(db, "tasks", updatedTask.id);
        const updateData: Partial<Task> = {
          name: updatedTask.name,
          startDate: updatedTask.startDate || null,
          endDate: updatedTask.endDate || null,
        };
        if (updatedTask.parentColor !== undefined) {
          updateData.parentColor = updatedTask.parentColor;
        }
        if (updatedTask.childColor !== undefined) {
          updateData.childColor = updatedTask.childColor;
        }
        await updateDoc(taskDocRef, updateData);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setRefreshTasks((prev) => !prev);
      } catch (error) {
        console.error("Error updating task in Firestore:", error);
      }
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setRefreshTasks((prev) => !prev);
      } catch (error) {
        console.error("Error deleting Task", error);
      }
    },
    [setTasks]
  );

  return {
    tasks: null, // Tasks will be managed by the parent component
    fetchTasks,
    addTask,
    handleAddTaskToParent,
    updateTask,
    deleteTask,
    refreshTasks,
    setRefreshTasks,
  };
};

export default useTasks;
