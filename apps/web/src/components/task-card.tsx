"use client";

import { Box, Card, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { Task } from "../lib/tasks";
import { StatusBadge } from "./status-badge";

const accentColours = {
  todo: "gray.300",
  "in-progress": "orange.400",
  done: "teal.500",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card.Root
      as="article"
      bg="white"
      rounded="2xl"
      borderColor="gray.200"
      overflow="hidden"
      shadow="xs"
      _hover={{ shadow: "md", borderColor: "teal.300" }}
    >
      <Box h="1" bg={accentColours[task.status]} />
      <Card.Body p="6" gap="4">
        <div>
          <StatusBadge status={task.status} />
        </div>
        <Heading as="h2" size="md" lineHeight="tall" overflowWrap="anywhere">
          <Link asChild color="gray.900" _hover={{ color: "teal.700" }}>
            <NextLink href={`/tasks/${task.id}`}>{task.title}</NextLink>
          </Link>
        </Heading>
        <Text color="gray.400" fontSize="sm" lineClamp="3" lineHeight="tall">
          {task.description || "No description yet."}
        </Text>
      </Card.Body>
      <Card.Footer px="6" pb="5">
        <Flex
          width="full"
          justify="space-between"
          align="center"
          borderTopWidth="1px"
          borderColor="gray.100"
          pt="4"
        >
          <Text fontSize="xs" color="gray.600">
            {task.status === "done" ? "Nicely done" : "Keep things moving"}
          </Text>
          <Link asChild color="teal.800" fontSize="sm" fontWeight="semibold">
            <NextLink
              href={`/tasks/${task.id}`}
              aria-label={`Open task: ${task.title}`}
            >
              View task <span aria-hidden="true">↗</span>
            </NextLink>
          </Link>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
