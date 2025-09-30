"use client"
import { useEffect, useRef } from "react"
import { X, PawPrint } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const root = document.querySelector<HTMLElement>('[data-scroll-root]') || document.documentElement
    const prev = root.style.overflow
    root.style.overflow = "hidden"
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      root.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-sidebar"
      aria-hidden={!open}
      className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú lateral"
        ref={panelRef}
        tabIndex={-1}
        className={`absolute left-0 top-0 h-full w-[80vw] max-w-72 bg-sidebar border-r outline-none transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <PawPrint className="size-4 text-primary" />
            <span className="text-sm font-medium">Byte Chat</span>
          </div>
          <Button size="icon" variant="ghost" aria-label="Cerrar menú" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <div className="h-[calc(100%-3rem)]">
          <AppSidebar isMobile={true} />
        </div>
      </div>
    </div>
  )
}
