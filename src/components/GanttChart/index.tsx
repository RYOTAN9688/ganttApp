// src/component/GanttChart/index.tsx
import React, { useMemo, useCallback } from "react";
import { Task } from "../../types/task";
import styles from "./index.module.css";
import { format, addDays, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";
import { JSX } from "react/jsx-runtime";

interface GanttChartProps {
  tasks: Task[];
  expandedTasks: { [taskId: string]: boolean };
  parentTaskColor?: string;
  childTaskColor?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  expandedTasks,
  parentTaskColor: defaultParentTaskColor = "#28a745",
  childTaskColor: defaultChildTaskColor = "#007bff",
}) => {
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
        return true;
      }
      return !!expandedTasks[task.parentId];
    },
    [expandedTasks]
  );

  const rowHeight = 45; // タスクバーの高さに合わせる
  const verticalSpacing = 5; // タスク間の垂直方向の間隔

  const renderTasksWithNesting = useCallback(
    (
      parentTaskId: string | null = null,
      level: number = 0,
      rowIndex: number = 0
    ): JSX.Element[] => {
      const childTasks = getChildTasks(parentTaskId, tasks).filter(
        isTaskVisible
      );
      let rendered: JSX.Element[] = [];
      let currentRowIndex = rowIndex;

      childTasks.forEach((task) => {
        const parentTask = tasks.find((t) => t.id === parentTaskId);

        if (
          !task.startDate ||
          !task.endDate ||
          !minDate ||
          !maxDate ||
          chartDays <= 0
        ) {
          return;
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

        const indent = level * 20;
        const verticalPosition =
          currentRowIndex * (rowHeight + verticalSpacing);

        const taskBarStyle =
          level === 0 ? styles.parentTaskBar : styles.childTaskBar;
        const taskColor =
          level === 0
            ? task.parentColor || defaultParentTaskColor
            : task.childColor || defaultChildTaskColor;

        rendered.push(
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
                backgroundColor: taskColor,
                height: `${rowHeight}px`, // 明示的に高さを設定
              }}
            >
              {task.name}
            </div>
          </div>
        );

        currentRowIndex++;

        if (expandedTasks[task.id]) {
          const nestedRendered = renderTasksWithNesting(
            task.id,
            level + 1,
            currentRowIndex
          );
          rendered = rendered.concat(nestedRendered);
          currentRowIndex += getChildTasks(task.id, tasks).filter(
            isTaskVisible
          ).length;
        }
      });
      return rendered;
    },
    [
      getChildTasks,
      tasks,
      minDate,
      maxDate,
      chartDays,
      expandedTasks,
      isTaskVisible,
      defaultParentTaskColor,
      defaultChildTaskColor,
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
      <div className={styles.chartArea}>
        {renderTasksWithNesting(null, 0, 0)}
      </div>
    </div>
  );
};

export default GanttChart;
