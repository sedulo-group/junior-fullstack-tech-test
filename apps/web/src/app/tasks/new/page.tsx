"use client";

import { Box, Button, Field, Heading, HStack, Input, Link, Stack, Text, Textarea } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ErrorMessage } from "../../../components/page-feedback";
import { taskApi } from "../../../lib/api";
import { errorMessage } from "../../../lib/tasks";

export default function NewTaskPage() {
  const router = useRouter();
  const titleInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    titleInput.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!title.trim()) {
      setError("Give your task a title.");
      titleInput.current?.focus();
      return;
    }
    setSaving(true);
    setError("");
    try {
      const task = await taskApi.create({ title: title.trim(), description: description.trim() });
      router.push(`/tasks/${task.id}`);
    } catch (error) {
      setError(errorMessage(error));
      setSaving(false);
    }
  }

  return (
    <Stack gap="6" maxW="2xl">
      <Link asChild color="teal.700"><NextLink href="/tasks">← Back to tasks</NextLink></Link>
      <Box><Heading as="h1" size="2xl">Add a task</Heading><Text color="gray.600" mt="2">One clear next step is a good start.</Text></Box>
      <Box asChild bg="white" p={{ base: "5", md: "8" }} borderWidth="1px" rounded="xl">
        <form onSubmit={handleSubmit}>
          <Stack gap="6">
            {error && <ErrorMessage message={error} />}
            <Field.Root required>
              <Field.Label>Title<Field.RequiredIndicator /></Field.Label>
              <Input ref={titleInput} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} disabled={saving} placeholder="What needs doing?" />
              <Field.HelperText>Keep it short and specific. Up to 80 characters.</Field.HelperText>
            </Field.Root>
            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={5} disabled={saving} placeholder="Add a little context (optional)" />
              <Field.HelperText>{description.length}/500 characters</Field.HelperText>
            </Field.Root>
            <HStack gap="3">
              <Button type="submit" colorPalette="teal" loading={saving} loadingText="Creating…">Create task</Button>
              <Button asChild variant="ghost" disabled={saving}><NextLink href="/tasks">Cancel</NextLink></Button>
            </HStack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
