import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "../components/app-shell";
import { Provider } from "../components/provider";

export const metadata: Metadata = {
  title: "Taskroom | Junior full-stack exercise",
  description: "A small Next.js, NestJS and Chakra UI task tracker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><Provider><AppShell>{children}</AppShell></Provider></body></html>;
}
