export type TaskStatus = "todo" | "in-progress" | "done";

export const taskStatuses: TaskStatus[] = ["todo", "in-progress", "done"];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}
