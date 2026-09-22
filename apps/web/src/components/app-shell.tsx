"use client";

import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/tasks", label: "Tasks" },
  { href: "/tasks/new", label: "Add task" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Box minH="100vh" bg="gray.50" color="gray.900">
      <Box as="header" bg="white" borderBottomWidth="1px" borderColor="gray.200">
        <Container maxW="4xl" py="5">
          <Flex align="center" justify="space-between" gap="4" wrap="wrap">
            <Link asChild fontWeight="bold" fontSize="xl" textDecoration="none">
              <NextLink href="/tasks">Taskroom<Text as="span" color="teal.600">.</Text></NextLink>
            </Link>
            <HStack as="nav" aria-label="Main navigation" gap="2">
              {links.map(({ href, label }) => {
                const active = href === "/tasks" ? pathname !== "/tasks/new" : pathname === href;
                return (
                  <Link key={href} asChild px="4" py="2" rounded="lg"
                    bg={active ? "teal.50" : "transparent"}
                    color={active ? "teal.800" : "gray.600"}
                    fontWeight="medium" _hover={{ bg: "gray.100" }}>
                    <NextLink href={href} aria-current={active ? "page" : undefined}>{label}</NextLink>
                  </Link>
                );
              })}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container as="main" maxW="4xl" py={{ base: "8", md: "12" }}>
        {children}
      </Container>
      <Container as="footer" maxW="4xl" pb="8">
        <Text fontSize="sm" color="gray.500">A little space to keep things moving.</Text>
      </Container>
    </Box>
  );
}
