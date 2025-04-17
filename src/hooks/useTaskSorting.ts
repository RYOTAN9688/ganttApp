// src/hooks/useTaskSorting.ts
import { useState, useMemo } from "react";
import { Task } from "../types/task";

interface UseTaskSortingProps {
  tasks: Task[];
}

const useTaskSorting = ({ tasks }: UseTaskSortingProps) => {
  const [sortBy, setSortBy] = useState<keyof Task | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
    return [...tasks].sort(compare);
  }, [tasks, sortBy, sortOrder]);

  return {
    sortBy,
    sortOrder,
    handleSort,
    getSortIcon,
    sortedTasks,
  };
};

export default useTaskSorting;
