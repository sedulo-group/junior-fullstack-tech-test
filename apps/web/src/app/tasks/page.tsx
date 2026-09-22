"use client";

import { Box, Button, Field, Flex, Heading, Input, NativeSelect, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { ErrorMessage, LoadingMessage } from "../../components/page-feedback";
import { TaskCard } from "../../components/task-card";
import { useTasks } from "../../hooks/use-tasks";
import { statusLabels, type TaskStatus } from "../../lib/tasks";

export default function TasksPage() {
  const { tasks, loading, error, retry } = useTasks();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");

  // Derived data can be calculated while rendering; it doesn't need its own state.
  const visibleTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (status === "all" || task.status === status),
  );
  const completedCount = tasks.filter((task) => task.status === "done").length;

  return (
    <Stack gap="7">
      <Flex justify="space-between" align="center" gap="4" wrap="wrap">
        <Box>
          <Text color="teal.700" fontSize="sm" fontWeight="semibold" mb="2">YOUR WORKSPACE</Text>
          <Heading as="h1" size="3xl">Small tasks. Steady progress.</Heading>
          <Text color="gray.600" mt="3">Keep track of what’s next, what’s moving, and what’s done.</Text>
        </Box>
        <Button asChild colorPalette="teal"><NextLink href="/tasks/new">Add task</NextLink></Button>
      </Flex>

      <Flex gap="4" direction={{ base: "column", sm: "row" }}>
        <Field.Root flex="1">
          <Field.Label>Search tasks</Field.Label>
          <Input bg="white" placeholder="Search by title…" value={search} onChange={(event) => setSearch(event.target.value)} />
        </Field.Root>
        <Field.Root width={{ base: "full", sm: "48" }}>
          <Field.Label>Filter by status</Field.Label>
          <NativeSelect.Root bg="white">
            <NativeSelect.Field value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | "all")}>
              <option value="all">All statuses</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
      </Flex>

      {loading ? <LoadingMessage /> : error ? (
        <Stack><ErrorMessage message={error} /><Button alignSelf="start" variant="outline" onClick={retry}>Try again</Button></Stack>
      ) : (
        <>
          <Text color="gray.600" fontSize="sm" aria-live="polite">{visibleTasks.length} tasks shown · {completedCount} of {tasks.length} complete</Text>
          {visibleTasks.length === 0 ? (
            <Box p="10" bg="white" borderWidth="1px" rounded="xl" textAlign="center">
              <Heading as="h2" size="md">{tasks.length === 0 ? "Your first task starts here" : "No matching tasks"}</Heading>
              <Text mt="2" color="gray.600">{tasks.length === 0 ? "Add a task to get started." : "Try another search or status."}</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              {visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)}
            </SimpleGrid>
          )}
        </>
      )}
    </Stack>
  );
}
