"use client"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarToggle } from "./sidebar-toggle"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  const sbWidth = open ? "16rem" : "0rem"
  type CSSVars = React.CSSProperties & { [key: string]: string | number | undefined }
  const rootStyle: CSSVars = { ["--sb-w"]: sbWidth }

  return (
  <div data-scroll-root className="relative h-dvh overflow-y-auto [scrollbar-gutter:stable]" style={rootStyle}>
      <div
        className="grid min-h-dvh grid-cols-1 md:grid-cols-[var(--sb-w)_1fr] transition-[grid-template-columns] duration-300 ease-in-out"
        style={{ gridTemplateColumns: undefined }}
      >
        {/* Columna sidebar (sticky para que no se desplace con el scroll global) */}
        <div className="hidden md:block sticky top-0 h-dvh overflow-hidden bg-sidebar">
          <AppSidebar />
        </div>

        {/* Columna contenido */}
        <div className="flex min-h-dvh flex-col overflow-visible">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4" />
          </header>
          <main className="flex w-full flex-col px-4">
            {children}
          </main>
        </div>
      </div>

      {/* Botón flotante a mitad del borde entre sidebar y contenido */}
      <SidebarToggle open={open} onToggle={() => setOpen((v) => !v)} />
    </div>
  )
}
