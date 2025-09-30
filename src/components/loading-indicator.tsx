/**
 * [LUIS] - 30/09/2025 Componente de indicador de carga para el chat.
 * - Estado: ninguno; componente estático de presentación.
 * - Renderiza avatar del asistente (círculo con pata de perro) + TypingIndicator.
 * - Usado cuando el asistente va a responder pero aún no hay contenido.
 * - Accesibilidad: aria-live="polite" y aria-atomic para screen readers.
 * - API: sin props, componente autocontenido.
 */
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