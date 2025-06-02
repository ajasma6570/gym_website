import { TriangleIcon } from "lucide-react";

export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div
      className="flex w-full justify-center items-center  gap-2 text-sm text-red-800 rounded-lg  dark:text-red-600"
      role="alert"
    >
      <TriangleIcon className="h-4 w-4 text-red-500" />
      <span className="sr-only">Error</span>
      <div>{error}</div>
    </div>
  );
}
