/**
 * Shell principal del layout con sidebar colapsible responsivo.
 * - Estado: abierto, movil Abierto, esEscritorio; controla visibilidad y colapso de sidebars.
 * - Sidebar desktop: animado con Framer Motion, ancho variable (4rem collapsed, 16rem expanded).
 * - Header móvil: botón hamburguesa fijo en top con backdrop blur.
 * - Layout responsivo: margin-left dinámico en desktop según estado sidebar.
 * - ProveedorLayoutUI: context para compartir estado UI entre componentes.
 */
"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarApp } from "@/CapaPresentacion/componentes/sidebar-app"
import { SidebarMovil } from "@/CapaPresentacion/componentes/sidebar-movil"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { PanelLeft } from "lucide-react"
import { motion } from "framer-motion"
import { LayoutUIProvider as ProveedorLayoutUI } from "@/CapaPresentacion/componentes/contexto-ui-layout"

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [abierto, establecerAbierto] = useState(false)
  const [movilAbierto, establecerMovilAbierto] = useState(false)
  const [esEscritorio, establecerEsEscritorio] = useState(false)

  // Rutas donde no se muestra el sidebar
  const rutasSinSidebar = ["/", "/login"]
  const mostrarSidebar = !rutasSinSidebar.includes(pathname)

  const anchoSb = abierto ? "16rem" : "4rem"
  type VarsCSS = React.CSSProperties & { [key: string]: string | number | undefined }
  const estiloRaiz: VarsCSS = { ["--sb-w"]: anchoSb }

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const alCambiar = () => establecerEsEscritorio(mq.matches)
    alCambiar()
    mq.addEventListener("change", alCambiar)
    return () => mq.removeEventListener("change", alCambiar)
  }, [])

  return (
    <ProveedorLayoutUI value={{ esEscritorio, sidebarAbierto: abierto }}>
      <div data-scroll-root className="relative h-dvh overflow-hidden" style={estiloRaiz}>
        {mostrarSidebar && esEscritorio && (
          <motion.aside
            key="desktop-aside"
            initial={false}
            animate={{ width: abierto ? "16rem" : "4rem" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar overflow-hidden"
          >
            <SidebarApp 
              isCollapsed={!abierto} 
              onToggle={() => establecerAbierto(true)}
              onCollapse={() => establecerAbierto(false)}
            />
          </motion.aside>
        )}

        {mostrarSidebar && (
          <header className="md:hidden fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4">
              <Button size="icon" variant="ghost" aria-label="Abrir menú" onClick={() => establecerMovilAbierto(true)}>
                <PanelLeft className="size-5" />
              </Button>
            </div>
          </header>
        )}

        <div className={`h-dvh ${mostrarSidebar ? "pt-14 md:pt-0" : ""} flex flex-col`}>
          <motion.main
            className="flex-1 flex flex-col overflow-hidden"
            initial={false}
            animate={{
              marginLeft: mostrarSidebar && esEscritorio ? (abierto ? "16rem" : "4rem") : 0
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {children}
          </motion.main>
        </div>

        {mostrarSidebar && <SidebarMovil open={movilAbierto} onClose={() => establecerMovilAbierto(false)} />}
      </div>
    </ProveedorLayoutUI>
  )
}

export { ShellLayout as LayoutShell }
