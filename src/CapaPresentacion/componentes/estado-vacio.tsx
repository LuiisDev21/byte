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
        <ByteIcon ariaHidden className="mx-auto mb-4 size-20 md:size-24 text-foreground/50" />
        <h1 id="empty-title" className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          ¡Bienvenido a Byte Chat!
        </h1>
        <p className="mt-2 text-sm md:text-base lg:text-lg text-muted-foreground">
          Tu asistente AI sobre perros
        </p>
      </div>
      {onPreguntaClick && (
        <PreguntasRapidas onPreguntaClick={onPreguntaClick} />
      )}
    </motion.section>
  )
}

export { EstadoVacio as EmptyState }
