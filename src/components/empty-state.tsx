import { PawPrint } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-accent">
          <PawPrint className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">¡Bienvenido a Byte Chat!</h2>
        <p className="text-sm">Tu asistente AI sobre perros</p>
      </div>
    </div>
  )
}
