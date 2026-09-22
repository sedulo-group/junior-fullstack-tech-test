import type { NewTask, Task, TaskStatus } from "./tasks";

interface ApiErrorResponse {
  message?: string | string[];
}

// Next.js forwards /api/* to NestJS. The browser only needs one origin.
async function request(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    const body: ApiErrorResponse | null = await response
      .json()
      .catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(". ")
      : body?.message;
    throw new Error(
      message || "Could not reach the task API. Please try again.",
    );
  }

  return response;
}

export const taskApi = {
  async list(signal?: AbortSignal): Promise<Task[]> {
    const response = await request("/task", { signal });
    return response.json();
  },

  async get(id: string, signal?: AbortSignal): Promise<Task> {
    const response = await request(`/tasks/${encodeURIComponent(id)}`, {
      signal,
    });
    return response.json();
  },

  async create(task: NewTask): Promise<Task> {
    const response = await request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    return response.json();
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await request(`/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  async remove(id: string): Promise<void> {
    // DELETE returns no body, so it must not be parsed as JSON.
    await request(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
