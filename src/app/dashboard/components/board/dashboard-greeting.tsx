"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;
const getServerGreeting = () => "Welcome back";

function getLocalGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Welcome back";
}

export default function DashboardGreeting({
  userName,
}: {
  userName: string | null;
}) {
  const greeting = useSyncExternalStore(
    subscribe,
    getLocalGreeting,
    getServerGreeting,
  );

  return userName ? `${greeting}, ${userName}` : greeting;
}
