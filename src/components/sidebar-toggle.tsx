"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function SidebarToggle({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  const [sbPx, setSbPx] = useState(256)
  useEffect(() => {
    const compute = () => {
      const fs = parseFloat(getComputedStyle(document.documentElement).fontSize || "16")
      setSbPx(16 * fs)
    }
    compute()
    window.addEventListener("resize", compute)
    return () => window.removeEventListener("resize", compute)
  }, [])
  return (
    <motion.div
      className="pointer-events-none fixed top-1/2 z-20 hidden -translate-y-1/2 md:block left-0"
      style={{ willChange: "transform" }}
      animate={{ x: open ? sbPx : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
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
    </motion.div>
  )
}
