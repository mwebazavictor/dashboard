// components/ClientErrorWrapper.tsx
"use client";

import React from "react";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";

export default function ClientErrorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize your centralized error handler
  const handleApiError = useApiErrorHandler();

  // Optionally, you can provide this function via context or props
  // if your children need to access it directly

  return <>{children}</>;
}
