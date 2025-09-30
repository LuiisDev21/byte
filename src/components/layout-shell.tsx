"use client"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarToggle } from "./sidebar-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { LayoutUIProvider } from "@/components/layout-ui-context"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const sbWidth = open ? "16rem" : "0rem"
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
            initial={{ x: "-100%" }}
            animate={{ x: open ? 0 : "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-sidebar"
          >
            <AppSidebar />
          </motion.aside>
        )}

        <header className="md:hidden fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
            <Button size="icon" variant="ghost" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" />
            </Button>
          </div>
        </header>

        <div className="h-dvh pt-14 md:pt-0 flex flex-col">
          <motion.main
            className="flex-1 flex flex-col overflow-hidden"
            initial={false}
            animate={{
              marginLeft: isDesktop ? (open ? "16rem" : 0) : 0
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {children}
          </motion.main>
        </div>

        <div className="hidden md:block">
          <SidebarToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </div>

        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </LayoutUIProvider>
  )
}
