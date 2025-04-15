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

    let min = new Date(tasks[0].startDate);
    let max = new Date(tasks[0].endDate);

    const findMinMax = (taskList: Task[]) => {
      taskList.forEach((task) => {
        min = new Date(Math.min(min.getTime(), task.startDate.getTime()));
        max = new Date(Math.max(max.getTime(), task.endDate.getTime()));
        if (task.children) {
          findMinMax(task.children);
        }
      });
    };

    findMinMax(tasks);

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
  const getTaskLeft = (startDate: Date): number => {
    if (!minDate || !totalDurationDays || totalDurationDays <= 1) {
      return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const daysFromStart = Math.round(
      Math.abs((startDate.getTime() - minDate.getTime()) / oneDay)
    );
    return (daysFromStart / totalDurationDays) * 100; // 全期間に対する割合（パーセント）
  };

  // タスクバーの幅を計算する関数
  const getTaskWidth = (startDate: Date, endDate: Date): number => {
    if (!totalDurationDays || totalDurationDays <= 1) {
      return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const durationDays =
      Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) +
      1;
    return (durationDays / totalDurationDays) * 100; // 全期間に対する割合（パーセント）
  };

  return (
    <div className={styles.ganttChart}>
      <div className={styles.timeline}>
        {tasks.map((task) => (
          <React.Fragment key={task.id}>
            <div
              className={styles.task}
              style={{
                left: `${getTaskLeft(task.startDate)}%`,
                width: `${getTaskWidth(task.startDate, task.endDate)}%`,
              }}
            >
              {task.name}
            </div>
            {task.children &&
              task.children.map((childTask) => (
                <div
                  key={childTask.id}
                  className={`${styles.task} ${styles.childTask}`}
                  style={{
                    left: `${getTaskLeft(childTask.startDate)}%`,
                    width: `${getTaskWidth(
                      childTask.startDate,
                      childTask.endDate
                    )}%`,
                  }}
                >
                  {childTask.name}
                </div>
              ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
