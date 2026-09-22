"use client";

import {
  Box,
  Button,
  Field,
  Heading,
  Link,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ErrorMessage,
  LoadingMessage,
} from "../../../components/page-feedback";
import { StatusBadge } from "../../../components/status-badge";
import { taskApi } from "../../../lib/api";
import {
  errorMessage,
  statusLabels,
  type Task,
  type TaskStatus,
} from "../../../lib/tasks";

type TaskRouteParams = {
  id: string;
};

export default function TaskDetailPage() {
  const { id } = useParams<TaskRouteParams>();
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
    <Stack gap="7">
      <Link asChild color="teal.800" fontSize="sm" alignSelf="start">
        <NextLink href="/tasks">← Back to tasks</NextLink>
      </Link>
      {loading ? (
        <LoadingMessage />
      ) : (
        <>
          {error && <ErrorMessage message={error} />}
          {!task ? (
            <Button
              alignSelf="start"
              variant="outline"
              onClick={() => setAttempt((current) => current + 1)}
            >
              Try again
            </Button>
          ) : (
            <>
              <Box>
                <Text
                  color="teal.700"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="widest"
                  mb="3"
                >
                  YOUR WORKSPACE / TASK DETAILS
                </Text>
                <Heading
                  as="h1"
                  size="3xl"
                  letterSpacing="tight"
                  overflowWrap="anywhere"
                  maxW="3xl"
                >
                  {task.title}
                </Heading>
              </Box>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap="6"
                alignItems="start"
              >
                <Box
                  gridColumn={{ md: "span 2" }}
                  bg="white"
                  p={{ base: "5", md: "8" }}
                  borderWidth="1px"
                  borderColor="gray.200"
                  rounded="2xl"
                  shadow="xs"
                >
                  <Stack gap="6">
                    <div>
                      <StatusBadge status={task.status} />
                    </div>
                    <Box>
                      <Heading as="h2" size="md" mb="3">
                        The details
                      </Heading>
                      <Text
                        color="gray.600"
                        whiteSpace="pre-wrap"
                        overflowWrap="anywhere"
                        lineHeight="tall"
                      >
                        {task.description || "No description yet."}
                      </Text>
                    </Box>
                    <Box borderTopWidth="1px" borderColor="gray.100" pt="5">
                      <Text fontSize="sm" color="gray.600">
                        {task.status === "done"
                          ? "Another small win. Take a moment to enjoy it."
                          : "Progress happens one small step at a time."}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
                <Stack gap="5">
                  <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    rounded="2xl"
                    p="6"
                  >
                    <Stack gap="4">
                      <Heading as="h2" size="md">
                        Keep it moving
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        Update the status as your task moves forward.
                      </Text>
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
                        <NativeSelect.Root
                          disabled={busy}
                          bg="gray.50"
                          rounded="lg"
                        >
                          <NativeSelect.Field
                            value={status}
                            onChange={(event) => {
                              setStatus(event.target.value as TaskStatus);
                              setNotice("");
                            }}
                          >
                            {Object.entries(statusLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                      <Button
                        colorPalette="teal"
                        bg="teal.800"
                        rounded="lg"
                        onClick={handleSave}
                        disabled={busy || status === task.status}
                      >
                        Save status
                      </Button>
                      <Text role="status" color="teal.700" fontSize="sm">
                        {busy ? "Saving changes…" : notice}
                      </Text>
                    </Stack>
                  </Box>
                  <Box px="2">
                    <Text fontSize="sm" color="gray.600" mb="2">
                      No longer needed?
                    </Text>
                    <Button
                      colorPalette="red"
                      variant="outline"
                      size="sm"
                      rounded="lg"
                      onClick={handleDelete}
                      disabled={busy}
                    >
                      Delete task
                    </Button>
                  </Box>
                </Stack>
              </SimpleGrid>
            </>
          )}
        </>
      )}
    </Stack>
  );
}
