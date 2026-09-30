/**
 * Componente de estado vacío mostrado cuando no hay mensajes en el chat.
 * - Muestra mensaje de bienvenida con logo Byte y descripción.
 * - Opcionalmente renderiza PreguntasRapidas si se proporciona onPreguntaClick.
 * - Animaciones con framer-motion para entrada suave.
 * - Accesibilidad: aria-labelledby para título semántico.
 */
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"
import { PreguntasRapidas } from "@/CapaPresentacion/componentes/preguntas-rapidas"
import { motion } from "framer-motion"

type Props = {
  onPreguntaClick?: (pregunta: string) => void
}

export function EstadoVacio({ onPreguntaClick }: Props) {
  return (
    <motion.section
      aria-labelledby="empty-title"
      className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4"
      initial={false}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="text-center text-muted-foreground">
        <div className="mx-auto mb-4 flex size-20 md:size-24 items-center justify-center rounded-3xl bg-secondary/60 p-4 border border-border shadow-xs">
          <ByteIcon ariaHidden className="size-full text-primary" />
        </div>
        <h1 id="empty-title" className="font-heading text-2xl md:text-3xl lg:text-4xl font-normal text-foreground leading-tight">
          ¡Bienvenido a Byte Chat!
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Tu asistente AI especializado en perros
        </p>
      </div>
      {onPreguntaClick && (
        <PreguntasRapidas onPreguntaClick={onPreguntaClick} />
      )}
    </motion.section>
  )
}

export { EstadoVacio as EmptyState }
