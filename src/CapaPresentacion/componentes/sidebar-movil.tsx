"use client"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"
import { SidebarApp } from "@/CapaPresentacion/componentes/sidebar-app"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"

type Props = {
  open: boolean
  onClose: () => void
}

export function SidebarMovil({ open, onClose }: Props) {
  const refPanel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const alPresionarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", alPresionarTecla)
    const raiz = document.querySelector<HTMLElement>('[data-scroll-root]') || document.documentElement
    const previo = raiz.style.overflow
    raiz.style.overflow = "hidden"
    refPanel.current?.focus()
    return () => {
      document.removeEventListener("keydown", alPresionarTecla)
      raiz.style.overflow = previo
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
        ref={refPanel}
        tabIndex={-1}
        className={`absolute left-0 top-0 h-full w-[80vw] max-w-72 bg-sidebar border-r outline-none transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <ByteIcon className="size-4 text-primary" />
            <span className="text-sm font-medium">Byte Chat</span>
          </div>
          <Button size="icon" variant="ghost" aria-label="Cerrar menú" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <div className="h-[calc(100%-3rem)]">
          <SidebarApp isMobile={true} />
        </div>
      </div>
    </div>
  )
}

export { SidebarMovil as MobileSidebar }
