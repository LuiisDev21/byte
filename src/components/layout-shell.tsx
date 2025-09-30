/**
 * [LUIS] - 30/09/2025 Shell principal del layout con sidebar colapsible responsivo.
 * - Estado: open, mobileOpen, isDesktop; controla visibilidad y colapso de sidebars.
 * - Sidebar desktop: animado con Framer Motion, ancho variable (4rem collapsed, 16rem expanded).
 * - Header móvil: botón hamburguesa fijo en top con backdrop blur.
 * - Layout responsivo: margin-left dinámico en desktop según estado sidebar.
 * - LayoutUIProvider: context para compartir estado UI entre componentes.
 * - API: { children: ReactNode }.
 */
"use client"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import { motion } from "framer-motion"
import { LayoutUIProvider } from "@/components/layout-ui-context"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const sbWidth = open ? "16rem" : "4rem"
  type CSSVars = React.CSSProperties & { [key: string]: string | number | undefined }
  const rootStyle: CSSVars = { ["--sb-w"]: sbWidth }

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <LayoutUIProvider value={{ isDesktop, sidebarOpen: open }}>
      <div data-scroll-root className="relative h-dvh overflow-hidden" style={rootStyle}>
        {isDesktop && (
          <motion.aside
            key="desktop-aside"
            initial={false}
            animate={{ width: open ? "16rem" : "4rem" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar overflow-hidden"
          >
            <AppSidebar 
              isCollapsed={!open} 
              onToggle={() => setOpen(true)}
              onCollapse={() => setOpen(false)}
            />
          </motion.aside>
        )}

        <header className="md:hidden fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4">
            <Button size="icon" variant="ghost" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
              <PanelLeft className="size-5" />
            </Button>
          </div>
        </header>

        <div className="h-dvh pt-14 md:pt-0 flex flex-col">
          <motion.main
            className="flex-1 flex flex-col overflow-hidden"
            initial={false}
            animate={{
              marginLeft: isDesktop ? (open ? "16rem" : "4rem") : 0
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {children}
          </motion.main>
        </div>

        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </LayoutUIProvider>
  )
}
