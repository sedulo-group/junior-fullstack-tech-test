import type { NewTask, Task, TaskStatus } from "./tasks";

// Next.js forwards /api/* to NestJS. The browser only needs one origin.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(". ")
      : body?.message;
    throw new Error(
      message || "Could not reach the task API. Please try again.",
    );
  }

  // DELETE returns no body, so it must not be parsed as JSON.
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const taskApi = {
  list: (signal?: AbortSignal) => request<Task[]>("/task", { signal }),
  get: (id: string, signal?: AbortSignal) =>
    request<Task>(`/tasks/${encodeURIComponent(id)}`, { signal }),
  create: (task: NewTask) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(task) }),
  updateStatus: (id: string, status: TaskStatus) =>
    request<Task>(`/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id: string) =>
    request<void>(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
