import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function RefreshButton({
  onRefresh,
  loading = false,
}: RefreshButtonProps) {
  return (
    <Button
      onClick={onRefresh}
      variant="outline"
      size="sm"
      disabled={loading}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      Refresh Stats
    </Button>
  );
}
