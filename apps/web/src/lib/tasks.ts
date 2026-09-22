// Small, explicit API types; keeping them here makes the client/server boundary visible.
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskFilter = TaskStatus | "all";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
export interface NewTask {
  title: string;
  description: string;
}

export const statusLabels = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
