"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarToggle({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="pointer-events-none fixed top-1/2 z-20 hidden -translate-y-1/2 md:block transition-[left] duration-300 ease-in-out"
      style={{ left: "var(--sb-w)", willChange: "left, transform" }}
    >
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className={
          "pointer-events-auto rounded-full border shadow-sm bg-secondary text-secondary-foreground hover:bg-accent transition-transform duration-300 " +
          (open ? "-translate-x-[55%]" : "translate-x-0")
        }
        aria-label={open ? "Ocultar panel lateral" : "Mostrar panel lateral"}
        aria-expanded={open}
        onClick={onToggle}
      >
        {open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </Button>
    </div>
  )
}
