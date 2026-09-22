// Small, explicit API types; keeping them here makes the client/server boundary visible.
export type TaskStatus = "todo" | "in-progress" | "done";
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
export type NewTask = Pick<Task, "title" | "description">;

export const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
