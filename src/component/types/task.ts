export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  children?: Task[]; // サブタスクを持つ可能性がある
}
