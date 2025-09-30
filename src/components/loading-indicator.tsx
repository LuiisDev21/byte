import { TypingIndicator } from "@/components/typing-indicator";
import { PawPrint } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 justify-start" aria-live="polite" aria-atomic>
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <PawPrint className="size-4" />
      </div>
      <TypingIndicator />
    </div>
  );
}