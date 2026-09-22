"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { ErrorMessage, LoadingMessage } from "../../components/page-feedback";
import { TaskCard } from "../../components/task-card";
import { TaskSummary } from "../../components/task-summary";
import { useTasks } from "../../hooks/use-tasks";
import { statusLabels, type TaskStatus } from "../../lib/tasks";

export default function TasksPage() {
  const { tasks, loading, error, retry } = useTasks();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");

  const visibleTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.trim().toLowerCase()) &&
      (status === "all" || task.status === status),
  );
  const completedCount = tasks.filter((task) => task.status === "done").length;

  return (
    <Stack gap="7">
      <Flex justify="space-between" align="center" gap="6" wrap="wrap">
        <Box maxW="2xl">
          <Text
            color="teal.700"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            mb="3"
          >
            YOUR WORKSPACE / OVERVIEW
          </Text>
          <Heading
            as="h1"
            size={{ base: "3xl", md: "4xl" }}
            letterSpacing="tight"
          >
            Small tasks.
            <br />
            Steady progress.
          </Heading>
          <Text color="gray.600" mt="4" maxW="lg" lineHeight="tall">
            A clear view of what’s next, what’s moving, and the little wins
            along the way.
          </Text>
        </Box>
        <Button
          asChild
          colorPalette="teal"
          bg="teal.800"
          size="lg"
          rounded="xl"
          px="6"
          shadow="sm"
        >
          <NextLink href="/tasks/new">
            <span aria-hidden="true">＋</span> Add task
          </NextLink>
        </Button>
      </Flex>

      {!loading && !error && <TaskSummary tasks={tasks} />}

      <Box
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        rounded="2xl"
        p={{ base: "4", md: "5" }}
      >
        <Flex gap="5" direction={{ base: "column", sm: "row" }}>
          <Field.Root flex="1">
            <Field.Label fontSize="sm">Search tasks</Field.Label>
            <Input
              bg="gray.50"
              rounded="lg"
              placeholder="Find something to focus on…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field.Root>
          <Field.Root
            width={{ base: "full", sm: "56" }}
            mt={{ base: "0", sm: "1.5" }}
          >
            <Field.Label fontSize="sm">Filter by status</Field.Label>
            <NativeSelect.Root bg="gray.50" rounded="lg">
              <NativeSelect.Field
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus | "all")
                }
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Flex>
      </Box>

      {loading ? (
        <LoadingMessage />
      ) : error ? (
        <Stack>
          <ErrorMessage message={error} />
          <Button alignSelf="start" variant="outline" onClick={retry}>
            Try again
          </Button>
        </Stack>
      ) : (
        <>
          <Flex justify="space-between" align="baseline" gap="3" wrap="wrap">
            <Text fontWeight="semibold">Your tasks</Text>
            <Text color="gray.600" fontSize="sm" aria-live="polite">
              {visibleTasks.length} tasks shown · {completedCount} of{" "}
              {tasks.length} complete
            </Text>
          </Flex>
          {visibleTasks.length === 0 ? (
            <Box
              p="12"
              bg="white"
              borderWidth="1px"
              rounded="2xl"
              textAlign="center"
            >
              <Text fontSize="3xl" color="teal.700" mb="3" aria-hidden="true">
                ◇
              </Text>
              <Heading as="h2" size="lg">
                {tasks.length === 0
                  ? "Your first task starts here"
                  : "No matching tasks"}
              </Heading>
              <Text mt="2" color="gray.600">
                {tasks.length === 0
                  ? "Add a task to get started."
                  : "Try another search or status."}
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5">
              {visibleTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Stack>
  );
}
