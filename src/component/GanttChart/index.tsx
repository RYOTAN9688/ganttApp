import React, { useMemo } from "react";
import { Task } from "../types/task";
import styles from "./index.module.css";

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  // チャートの時間範囲を決定するための最早と最遅の日付を見つける
  const [minDate, maxDate] = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return [new Date(), new Date()];
    }

    let min = tasks[0].startDate ? new Date(tasks[0].startDate) : new Date();
    let max = tasks[0].endDate ? new Date(tasks[0].endDate) : new Date();

    tasks.forEach((task) => {
      if (task.startDate) {
        min = new Date(Math.min(min.getTime(), task.startDate.getTime()));
      }
      if (task.endDate) {
        max = new Date(Math.max(max.getTime(), task.endDate.getTime()));
      }
    });

    return [min, max];
  }, [tasks]);

  // チャートの総期間を日数で計算する
  const totalDurationDays = useMemo(() => {
    if (!minDate || !maxDate) {
      return 1;
    }
    const oneDay = 24 * 60 * 60 * 1000; // 1日のミリ秒数
    return (
      Math.round(Math.abs((maxDate.getTime() - minDate.getTime()) / oneDay)) + 1
    );
  }, [minDate, maxDate]);

  // タスクバーの左端の位置を計算する関数
  const getTaskLeft = (startDate: Date | null | undefined): number => {
    if (
      !minDate ||
      !totalDurationDays ||
      totalDurationDays <= 1 ||
      !startDate
    ) {
      return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const daysFromStart = Math.round(
      Math.abs((startDate.getTime() - minDate.getTime()) / oneDay)
    );
    return (daysFromStart / totalDurationDays) * 100; // 全期間に対する割合（パーセント）
  };

  // タスクバーの幅を計算する関数
  const getTaskWidth = (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
  ): number => {
    if (
      !totalDurationDays ||
      totalDurationDays <= 1 ||
      !startDate ||
      !endDate
    ) {
      return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const durationDays =
      Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) +
      1;
    return (durationDays / totalDurationDays) * 100; // 全期間に対する割合（パーセント）
  };

  const getChildTasks = (parentId: string | null): Task[] => {
    return tasks.filter((task) => task.parentId === parentId);
  };

  const renderTaskBars = (
    parentTaskId: string | null = null,
    level: number = 0
  ) => {
    const childTasks = getChildTasks(parentTaskId);
    return childTasks.map((task) => (
      <div
        key={task.id}
        className={`${styles.task} ${level > 0 ? styles.childTask : ""}`}
        style={{
          left: `${getTaskLeft(task.startDate)}%`,
          width: `${getTaskWidth(task.startDate, task.endDate)}%`,
          paddingLeft: `${level * 20}px`, // Indentation for child tasks
        }}
      >
        {task.name}
        {renderTaskBars(task.id, level + 1)} {/* Recursively render children */}
      </div>
    ));
  };

  return (
    <div className={styles.ganttChart}>
      <div className={styles.timeline}>
        {renderTaskBars(null, 0)}{" "}
        {/* Render top-level tasks and their children */}
      </div>
    </div>
  );
};

export default GanttChart;
