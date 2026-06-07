"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function AppError({ reset }: { reset: () => void }) {
  return <ErrorState message="The app could not load this page." onRetry={reset} />;
}
