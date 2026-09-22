"use client";

import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
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
    if (!window.confirm("Create this task?")) return;
    if (!window.confirm("Are you sure you want to create this task?")) return;
    setSaving(true);
    setError("");
    try {
      const task = await taskApi.create({
        title: title.trim(),
        description: description.trim(),
      });
      router.push(`/tasks/${task.id}`);
    } catch (error) {
      setError(errorMessage(error));
      setSaving(false);
    }
  }

  return (
    <Stack gap="7">
      <Link asChild color="teal.800" fontSize="sm" alignSelf="start">
        <NextLink href="/tasks">← Back to tasks</NextLink>
      </Link>
      <Box>
        <Text
          color="teal.700"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="widest"
          mb="3"
        >
          MAKE A LITTLE PROGRESS
        </Text>
        <Heading as="h1" size="3xl" letterSpacing="tight">
          What’s your next step?
        </Heading>
        <Text color="gray.600" mt="3">
          Make it clear, make it manageable, then make a start.
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" alignItems="start">
        <Box
          asChild
          gridColumn={{ md: "span 2" }}
          bg="white"
          p={{ base: "5", md: "8" }}
          borderWidth="1px"
          borderColor="gray.200"
          rounded="2xl"
          shadow="xs"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="6">
              <Box pb="5" borderBottomWidth="1px" borderColor="gray.100">
                <Heading as="h2" size="lg">
                  Task details
                </Heading>
                <Text fontSize="sm" color="gray.600" mt="1">
                  The essentials, all in one place.
                </Text>
              </Box>
              {error && <ErrorMessage message={error} />}
              <Field.Root required>
                <Field.Label>
                  Title
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  ref={titleInput}
                  bg="gray.50"
                  size="lg"
                  rounded="lg"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={80}
                  disabled={saving}
                  placeholder="What needs doing?"
                />
                <Field.HelperText color="gray.400">
                  Keep it short and specific. Up to 80 characters.
                </Field.HelperText>
              </Field.Root>
              <Field.Root>
                <Field.Label>
                  Description{" "}
                  <Text as="span" fontWeight="normal" color="gray.500">
                    (optional)
                  </Text>
                </Field.Label>
                <Textarea
                  bg="gray.50"
                  rounded="lg"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={500}
                  rows={5}
                  disabled={saving}
                  placeholder="A little context helps you pick this up later…"
                />
                <Field.HelperText>
                  {description.length}/500 characters
                </Field.HelperText>
              </Field.Root>
              <HStack
                gap="3"
                pt="5"
                borderTopWidth="1px"
                borderColor="gray.100"
                wrap="wrap"
              >
                <Button
                  type="submit"
                  colorPalette="teal"
                  bg="teal.800"
                  rounded="lg"
                  loading={saving}
                  loadingText="Creating…"
                >
                  Create task <span aria-hidden="true">→</span>
                </Button>
                <Button asChild variant="ghost" disabled={saving}>
                  <NextLink href="/tasks">Cancel</NextLink>
                </Button>
              </HStack>
            </Stack>
          </form>
        </Box>
        <Box
          as="aside"
          bg="teal.50"
          rounded="2xl"
          p="6"
          borderWidth="1px"
          borderColor="teal.100"
        >
          <Text fontSize="2xl" color="teal.800" mb="4" aria-hidden="true">
            ✦
          </Text>
          <Heading as="h2" size="md" color="teal.900">
            Small is a good place to start.
          </Heading>
          <Text mt="3" color="teal.800" fontSize="sm" lineHeight="tall">
            Give your task a clear action. “Write the welcome message” is easier
            to begin than “Improve the website”.
          </Text>
          <Text
            mt="5"
            pt="4"
            borderTopWidth="1px"
            borderColor="teal.200"
            color="teal.800"
            fontSize="sm"
          >
            New tasks start in <strong>To do</strong>. Move them along when
            you’re ready.
          </Text>
        </Box>
      </SimpleGrid>
    </Stack>
  );
}
