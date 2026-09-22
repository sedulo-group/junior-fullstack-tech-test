"use client";

import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { statusLabels, type Task, type TaskStatus } from "../lib/tasks";

const summaries: { status: TaskStatus; colour: string; hint: string }[] = [
  { status: "todo", colour: "gray.500", hint: "Ready when you are" },
  {
    status: "in-progress",
    colour: "orange.500",
    hint: "A little closer to done",
  },
  { status: "done", colour: "teal.600", hint: "Small wins add up" },
];

export function TaskSummary({ tasks }: { tasks: Task[] }) {
  return (
    <SimpleGrid
      as="section"
      aria-label="Task overview"
      columns={{ base: 1, sm: 3 }}
      gap="4"
    >
      {summaries.map(({ status, colour, hint }) => (
        <Box
          key={status}
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="2xl"
          p="5"
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="2">
              <Box boxSize="2" rounded="full" bg={colour} />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {statusLabels[status]}
              </Text>
            </Flex>
            <Text fontSize="3xl" fontWeight="semibold" lineHeight="1">
              {tasks.filter((task) => task.status === status).length}
            </Text>
          </Flex>
          <Text mt="3" fontSize="xs" color="gray.500">
            {hint}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
