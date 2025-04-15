import { Task } from "../component/types/task";

export const initialTasks: Task[] = [
  {
    id: "1",
    name: "A設備",
    startDate: new Date("2025-04-09"),
    endDate: new Date("2025-05-25"), // 2025-04-09 + 46 days
    children: [
      {
        id: "1.1",
        name: "Testing prototype",
        startDate: new Date("2025-04-09"),
        endDate: new Date("2025-04-15"), // 2025-04-09 + 6 days
      },
      {
        id: "1.2",
        name: "Testing MVA",
        startDate: new Date("2025-04-30"),
        endDate: new Date("2025-05-15"), // 2025-04-30 + 15 days
      },
      {
        id: "1.3",
        name: "Testing basic f...",
        startDate: new Date("2025-05-15"),
        endDate: new Date("2025-05-30"), // 2025-05-15 + 15 days
      },
      {
        id: "1.4",
        name: "Beta testing",
        startDate: new Date("2025-05-15"),
        endDate: new Date("2025-05-25"), // 2025-05-15 + 10 days
      },
      {
        id: "1.5",
        name: "Release 1.0.0",
        startDate: new Date("2025-05-25"),
        endDate: new Date("2025-05-25"), // 2025-05-25 + 0 days
      },
    ],
  },
  {
    id: "2",
    name: "B設備",
    startDate: new Date("2025-04-02"),
    endDate: new Date("2025-04-17"), // 2025-04-02 + 15 days
    children: [
      {
        id: "2.1",
        name: "Marketing anal...",
        startDate: new Date("2025-04-02"),
        endDate: new Date("2025-04-05"), // 2025-04-02 + 3 days
      },
      {
        id: "2.2",
        name: "Discussions",
        startDate: new Date("2025-04-05"),
        endDate: new Date("2025-04-07"), // 2025-04-05 + 2 days
      },
      {
        id: "2.3",
        name: "Approval of str...",
        startDate: new Date("2025-04-08"),
        endDate: new Date("2025-04-08"), // 2025-04-08 + 0 days
      },
    ],
  },
  {
    id: "3",
    name: "C設備",
    startDate: new Date("2025-04-02"),
    endDate: new Date("2025-04-12"), // 2025-04-02 + 10 days
    children: [
      {
        id: "3.1",
        name: "Team introductl...",
        startDate: new Date("2025-04-08"),
        endDate: new Date("2025-04-10"), // 2025-04-08 + 2 days
      },
      {
        id: "3.2",
        name: "Resource plan...",
        startDate: new Date("2025-04-02"),
        endDate: new Date("2025-04-06"), // 2025-04-02 + 4 days
      },
      {
        id: "3.3",
        name: "Resource man...",
        startDate: new Date("2025-04-10"),
        endDate: new Date("2025-04-12"), // 2025-04-10 + 2 days
      },
      {
        id: "3.4",
        name: "Getting approval",
        startDate: new Date("2025-04-06"),
        endDate: new Date("2025-04-08"), // 2025-04-06 + 2 days
      },
    ],
  },
  {
    id: "4",
    name: "D設備",
    startDate: new Date("2025-04-09"),
    endDate: new Date("2025-05-15"), // 2025-04-09 + 36 days
    children: [
      {
        id: "4.1",
        name: "Prototyping",
        startDate: new Date("2025-04-09"),
        endDate: new Date("2025-04-15"), // 2025-04-09 から endDate が既に設定されているのでそのまま
      },
      {
        id: "4.2",
        name: "Finalizing MVA",
        startDate: new Date("2025-04-30"),
        endDate: new Date("2025-05-15"), // 2025-04-30 + 15 days
      },
      {
        id: "4.3",
        name: "Basic functiona...",
        startDate: new Date("2025-05-15"),
        endDate: new Date("2025-05-30"), // 2025-05-15 + 15 days
      },
    ],
  },
];
