"use client";

import { Box, Button, Field, Heading, HStack, Link, NativeSelect, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorMessage, LoadingMessage } from "../../../components/page-feedback";
import { StatusBadge } from "../../../components/status-badge";
import { taskApi } from "../../../lib/api";
import { errorMessage, statusLabels, type Task, type TaskStatus } from "../../../lib/tasks";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTask() {
      setLoading(true);
      setError("");
      setTask(null);
      setNotice("");
      try {
        const result = await taskApi.get(id, controller.signal);
        if (!controller.signal.aborted) {
          setTask(result);
          setStatus(result.status);
        }
      } catch (error) {
        if (!controller.signal.aborted) setError(errorMessage(error));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadTask();
    return () => controller.abort();
  }, [id, attempt]);

  async function handleSave() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      setTask(await taskApi.updateStatus(id, status));
      setNotice("Status saved.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await taskApi.remove(id);
      router.push("/tasks");
    } catch (error) {
      setError(errorMessage(error));
      setBusy(false);
    }
  }

  return (
    <Stack gap="6" maxW="2xl">
      <Link asChild color="teal.700"><NextLink href="/tasks">← Back to tasks</NextLink></Link>
      {loading ? <LoadingMessage /> : (
        <>
          {error && <ErrorMessage message={error} />}
          {!task ? <Button alignSelf="start" variant="outline" onClick={() => setAttempt((current) => current + 1)}>Try again</Button> : (
            <Box bg="white" p={{ base: "5", md: "8" }} borderWidth="1px" rounded="xl">
              <Stack gap="6">
                <div><StatusBadge status={task.status} /></div>
                <Heading as="h1" size="2xl" overflowWrap="anywhere">{task.title}</Heading>
                <Text color="gray.600" whiteSpace="pre-wrap" overflowWrap="anywhere">{task.description || "No description yet."}</Text>
                <Field.Root>
                  <Field.Label>Status</Field.Label>
                  <NativeSelect.Root disabled={busy} maxW="64">
                    <NativeSelect.Field value={status} onChange={(event) => { setStatus(event.target.value as TaskStatus); setNotice(""); }}>
                      {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                <HStack gap="3" wrap="wrap">
                  <Button colorPalette="teal" onClick={handleSave} disabled={busy || status === task.status}>Save status</Button>
                  <Button colorPalette="red" variant="ghost" onClick={handleDelete} disabled={busy}>Delete task</Button>
                </HStack>
                <Text role="status" color="teal.700" fontSize="sm">{busy ? "Saving changes…" : notice}</Text>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Stack>
  );
}
