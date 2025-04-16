// src/component/GanttChart/index.tsx
import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { Task } from "../types/task";
import styles from "./index.module.css";
import { format, addDays, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";

interface GanttChartProps {
  tasks: Task[];
  expandedTasks: { [taskId: string]: boolean }; // 追加
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, expandedTasks }) => {
  const [minDate, maxDate] = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return [null, null];
    }
    let minTime: number | null = null;
    let maxTime: number | null = null;
    tasks.forEach((task) => {
      if (task.startDate) {
        const startTime = task.startDate.getTime();
        minTime = minTime !== null ? Math.min(minTime, startTime) : startTime;
      }
      if (task.endDate) {
        const endTime = task.endDate.getTime();
        maxTime = maxTime !== null ? Math.max(maxTime, endTime) : endTime;
      }
    });
    return [
      minTime !== null ? new Date(minTime) : null,
      maxTime !== null ? new Date(maxTime) : null,
    ];
  }, [tasks]);

  const chartDays = useMemo(() => {
    return minDate && maxDate ? differenceInDays(maxDate, minDate) : 0;
  }, [minDate, maxDate]);

  const dateScale = useMemo(() => {
    if (!minDate || chartDays < 0) {
      return [];
    }
    const scale = [];
    for (let i = 0; i <= chartDays; i++) {
      scale.push(addDays(minDate, i));
    }
    return scale;
  }, [minDate, chartDays]);

  const getChildTasks = useCallback(
    (parentId: string | null, taskList: Task[]): Task[] => {
      return taskList.filter((task) => task.parentId === parentId);
    },
    []
  );

  const isTaskVisible = useCallback(
    (task: Task): boolean => {
      if (!task.parentId) {
        return true; // トップレベルタスクは常に表示
      }
      return !!expandedTasks[task.parentId]; // 親タスクが展開されていれば表示
    },
    [expandedTasks]
  );

  const rowCounterRef = useRef(0);

  useEffect(() => {
    rowCounterRef.current = 0; // Reset counter on tasks change or expansion
  }, [tasks, expandedTasks]);

  const renderTasksWithNesting = useCallback(
    (parentTaskId: string | null = null, level: number = 0) => {
      const childTasks = getChildTasks(parentTaskId, tasks).filter(
        isTaskVisible
      ); // 可視タスクのみフィルタリング
      return childTasks.map((task) => {
        const parentTask = tasks.find((t) => t.id === parentTaskId);

        if (
          !task.startDate ||
          !task.endDate ||
          !minDate ||
          !maxDate ||
          chartDays <= 0
        ) {
          return null;
        }

        const taskStartDaysFromChartStart = differenceInDays(
          task.startDate,
          minDate
        );
        const taskDurationDays =
          differenceInDays(task.endDate, task.startDate) + 1;

        let taskStartOffsetPercentage: number;
        let taskWidthPercentage: number;

        if (parentTask && parentTask.startDate && parentTask.endDate) {
          const parentStartDaysFromChartStart = differenceInDays(
            parentTask.startDate,
            minDate
          );
          const parentDurationDays =
            differenceInDays(parentTask.endDate, parentTask.startDate) + 1;

          const childStartDaysFromParentStart = differenceInDays(
            task.startDate,
            parentTask.startDate
          );
          const childDurationDays =
            differenceInDays(task.endDate, task.startDate) + 1;

          // 親タスクの期間に対する相対的な開始位置と幅を計算
          const parentTotalChartDays = chartDays + 1;
          const parentStartOffsetInChart =
            (parentStartDaysFromChartStart / parentTotalChartDays) * 100;
          const parentWidthInChart =
            (parentDurationDays / parentTotalChartDays) * 100;

          const childStartOffsetInParent =
            (childStartDaysFromParentStart / parentDurationDays) * 100;
          const childWidthInParent =
            (childDurationDays / parentDurationDays) * 100;

          taskStartOffsetPercentage =
            parentStartOffsetInChart +
            (childStartOffsetInParent / 100) * parentWidthInChart;
          taskWidthPercentage = (childWidthInParent / 100) * parentWidthInChart;

          // 親タスクの範囲を超えないように調整 (念のため)
          if (taskStartOffsetPercentage < parentStartOffsetInChart) {
            taskStartOffsetPercentage = parentStartOffsetInChart;
          }
          if (
            taskStartOffsetPercentage + taskWidthPercentage >
            parentStartOffsetInChart + parentWidthInChart
          ) {
            taskWidthPercentage =
              parentStartOffsetInChart +
              parentWidthInChart -
              taskStartOffsetPercentage;
          }
        } else {
          taskStartOffsetPercentage =
            (taskStartDaysFromChartStart / (chartDays + 1)) * 100;
          taskWidthPercentage = (taskDurationDays / (chartDays + 1)) * 100;
        }

        const indent = level * 20; // インデントの幅
        const rowHeight = 25; // 必要に応じて調整
        const verticalPosition = rowCounterRef.current * rowHeight;
        rowCounterRef.current++;

        // 親タスクと子タスクで異なるスタイルを適用
        const taskBarStyle =
          level === 0 ? styles.parentTaskBar : styles.childTaskBar;

        return (
          <div
            key={task.id}
            className={styles.taskRow}
            style={{ paddingLeft: `${indent}px`, top: `${verticalPosition}px` }}
          >
            <div
              className={`${styles.taskBar} ${taskBarStyle}`}
              style={{
                left: `${taskStartOffsetPercentage}%`,
                width: `${taskWidthPercentage}%`,
              }}
            >
              {task.name}
            </div>
            {expandedTasks[task.id] &&
              renderTasksWithNesting(task.id, level + 1)}
          </div>
        );
      });
    },
    [
      getChildTasks,
      tasks,
      minDate,
      maxDate,
      chartDays,
      expandedTasks,
      isTaskVisible,
    ]
  );

  return (
    <div className={styles.container}>
      <div className={styles.dateScale}>
        {dateScale.map((date) => (
          <div
            key={date.toISOString()}
            className={styles.dateLabel}
            style={{ width: `${chartDays > 0 ? 100 / (chartDays + 1) : 100}%` }}
          >
            {format(date, "M/d", { locale: ja })}
          </div>
        ))}
      </div>
      <div className={styles.chartArea}>{renderTasksWithNesting(null, 0)}</div>
    </div>
  );
};

export default GanttChart;
