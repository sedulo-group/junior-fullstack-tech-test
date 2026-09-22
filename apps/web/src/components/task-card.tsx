"use client";

import { Card, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { Task } from "../lib/tasks";
import { StatusBadge } from "./status-badge";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card.Root bg="white" rounded="xl" borderColor="gray.200">
      <Card.Body gap="3">
        <div><StatusBadge status={task.status} /></div>
        <Heading as="h2" size="md">
          <Link asChild color="gray.900"><NextLink href={`/tasks/${task.id}`}>{task.title}</NextLink></Link>
        </Heading>
        <Text color="gray.600" fontSize="sm" lineClamp="2">{task.description || "No description yet."}</Text>
      </Card.Body>
    </Card.Root>
  );
}
