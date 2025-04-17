export interface Task {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  parentId: string | null;
  parentColor?: string; // Add optional parentColor
  childColor?: string; // Add optional childColor
}
