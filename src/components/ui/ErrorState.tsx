"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger/10 p-8 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-danger" />
      <h3 className="text-lg font-semibold text-text-primary">Something went wrong</h3>
      <p className="mt-2 max-w-md text-sm text-red-200">{message}</p>
      {onRetry ? <Button className="mt-5" variant="danger" onClick={onRetry}>Retry</Button> : null}
    </div>
  );
}
