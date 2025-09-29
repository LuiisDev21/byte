import { PawPrint } from "lucide-react"
import { motion } from "framer-motion"

export function EmptyState() {
  return (
    <motion.section
      aria-labelledby="empty-title"
      className="w-full max-w-2xl mx-auto px-2 pt-20 md:pt-28 lg:pt-32 pb-8"
      initial={false}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="text-center text-muted-foreground">
        {/* Huella grande, sin círculo, con ligera transparencia */}
        <PawPrint aria-hidden className="mx-auto mb-3 size-24 md:size-28 text-foreground/50" />
        <h1 id="empty-title" className="text-2xl md:text-3xl font-semibold text-foreground">
          ¡Bienvenido a Byte Chat!
        </h1>
        <p className="mt-1 text-base md:text-lg text-muted-foreground">Tu asistente AI sobre perros</p>
      </div>
  </motion.section>
  )
}
