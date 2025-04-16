export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  parentId: string | null;
}
