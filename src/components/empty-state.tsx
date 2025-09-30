import { PawPrint } from "lucide-react"
import { motion } from "framer-motion"

export function EmptyState() {
  return (
    <motion.section
      aria-labelledby="empty-title"
      className="flex items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4"
      initial={false}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="text-center text-muted-foreground">
        <PawPrint aria-hidden className="mx-auto mb-4 size-20 md:size-24 text-foreground/50" />
        <h1 id="empty-title" className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          ¡Bienvenido a Byte Chat!
        </h1>
        <p className="mt-2 text-sm md:text-base lg:text-lg text-muted-foreground">
          Tu asistente AI sobre perros
        </p>
      </div>
    </motion.section>
  )
}
