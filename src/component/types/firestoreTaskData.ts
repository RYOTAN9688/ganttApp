import { Timestamp } from "@firebase/firestore";
import { Task } from "./task";

export interface FirestoreTaskDataRaw {
  id: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  children: FirestoreTaskDataRaw[];
}

export interface FirestoreTaskData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  children: Task[];
}
