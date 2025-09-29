"use client"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarToggle } from "./sidebar-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  <div data-scroll-root className="relative min-h-dvh overflow-y-auto [scrollbar-gutter:stable]" style={rootStyle}>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="desktop-aside"
            initial={false}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="hidden md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex md:w-64 md:flex-col md:border-r md:bg-sidebar"
          >
            <AppSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      <header className="md:hidden fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Button size="icon" variant="ghost" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </header>

      <motion.div
        className="min-h-dvh pt-16 md:pt-0"
        initial={false}
        animate={{ paddingLeft: isDesktop ? (open ? sbWidth : 0) : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <main className="flex w-full flex-col px-4">{children}</main>
      </motion.div>

      <div className="hidden md:block">
        <SidebarToggle open={open} onToggle={() => setOpen((v) => !v)} />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
    </LayoutUIProvider>
  )
}
