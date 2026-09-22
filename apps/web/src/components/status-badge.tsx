"use client";

import { Badge } from "@chakra-ui/react";
import { statusLabels, type TaskStatus } from "../lib/tasks";

const palettes = { todo: "gray", "in-progress": "orange", done: "teal" };

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge colorPalette={palettes[status]} rounded="full" px="3" py="1">
      {statusLabels[status]}
    </Badge>
  );
}
