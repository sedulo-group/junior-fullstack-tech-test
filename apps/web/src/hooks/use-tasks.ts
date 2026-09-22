"use client";

import { useEffect, useState } from "react";
import { taskApi } from "../lib/api";
import { errorMessage, type Task } from "../lib/tasks";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string;
  retry: () => void;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setLoading(true);
      setError("");
      try {
        const result = await taskApi.list(controller.signal);
        if (!controller.signal.aborted) setTasks(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("[Taskroom] Failed to load tasks:", error);
          setError(errorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadTasks();
    // Cancel a pending request when the page unmounts or the effect runs again.
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setAttempt((current) => current + 1);
  }

  return { tasks, loading, error, retry };
}
