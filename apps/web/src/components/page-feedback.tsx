"use client";

import { Alert, HStack, Spinner, Text } from "@chakra-ui/react";

export function LoadingMessage() {
  return (
    <HStack role="status" py="8" gap="3">
      <Spinner size="sm" />
      <Text>Loading tasks…</Text>
    </HStack>
  );
}

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert.Root role="alert" status="error" rounded="lg">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{message}</Alert.Title>
      </Alert.Content>
    </Alert.Root>
  );
}
