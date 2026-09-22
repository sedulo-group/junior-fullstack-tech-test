"use client";

import { Badge } from "@chakra-ui/react";
import { statusLabels, type TaskStatus } from "../lib/tasks";

const palettes: Record<TaskStatus, string> = { todo: "gray", "in-progress": "orange", done: "teal" };

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge colorPalette={palettes[status]} rounded="full" px="3" py="1">{statusLabels[status]}</Badge>;
}
