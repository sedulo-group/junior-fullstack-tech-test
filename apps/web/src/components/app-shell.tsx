"use client";

import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/tasks", label: "Tasks" },
  { href: "/tasks/new", label: "Add task" },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <Box minH="100vh" bg="gray.50" color="gray.900">
      <Box
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Container maxW="6xl" py="4">
          <Flex align="center" justify="space-between" gap="4" wrap="wrap">
            <Link
              asChild
              fontWeight="bold"
              fontSize="xl"
              letterSpacing="tight"
              textDecoration="none"
            >
              <NextLink href="/tasks">
                <Box
                  as="span"
                  display="inline-grid"
                  placeItems="center"
                  bg="teal.800"
                  color="white"
                  boxSize="9"
                  rounded="xl"
                  mr="2"
                  aria-hidden="true"
                >
                  ✓
                </Box>
                Taskroom
                <Text as="span" color="teal.600">
                  .
                </Text>
              </NextLink>
            </Link>
            <HStack
              as="nav"
              aria-label="Main navigation"
              gap="1"
              bg="gray.50"
              p="1"
              rounded="xl"
              borderWidth="1px"
              borderColor="gray.100"
            >
              {links.map(({ href, label }) => {
                const active =
                  href === "/tasks"
                    ? pathname !== "/tasks/new"
                    : pathname === href;
                return (
                  <Link
                    key={href}
                    asChild
                    px="4"
                    py="2"
                    rounded="lg"
                    bg={active ? "white" : "transparent"}
                    shadow={active ? "xs" : "none"}
                    color={active ? "teal.800" : "gray.600"}
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "teal.50" }}
                  >
                    <NextLink
                      href={href}
                      aria-current={active ? "page" : undefined}
                    >
                      {label}
                    </NextLink>
                  </Link>
                );
              })}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container as="main" maxW="6xl" py={{ base: "8", md: "12" }}>
        {children}
      </Container>
      <Container as="footer" maxW="6xl" pb="8">
        <Flex
          borderTopWidth="1px"
          borderColor="gray.200"
          pt="5"
          justify="space-between"
          gap="3"
          wrap="wrap"
        >
          <Text fontSize="sm" color="gray.600">
            A little space to keep things moving.
          </Text>
          <Text fontSize="xs" color="teal.800" fontWeight="medium">
            One task at a time.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
