"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/CapaPresentacion/componentes/ui/insignia"
import { motion } from "framer-motion"

const PREGUNTAS_DISPONIBLES = [
    "¿Qué raza de perro es mejor para apartamentos?",
    "¿Cómo entrenar a un cachorro?",
    "¿Cuál es la mejor comida para perros?",
    "¿Cómo saber si mi perro está enfermo?",
    "¿Cada cuánto debo bañar a mi perro?",
    "¿Qué vacunas necesita un cachorro?",
    "¿Cómo evitar que mi perro ladre mucho?",
    "¿Cuánto ejercicio necesita un perro al día?",
    "¿Qué hacer si mi perro no come?",
    "¿Cómo socializar a mi cachorro?",
    "¿Cuáles son las razas más inteligentes?",
    "¿Cómo cuidar los dientes de mi perro?",
    "¿Qué significa cuando mi perro mueve la cola?",
    "¿Cómo cortar las uñas de mi perro?",
    "¿Qué razas son buenas con niños?",
    "¿Cómo enseñar a mi perro a sentarse?",
    "¿Por qué mi perro come pasto?",
    "¿Cuándo esterilizar a mi perro?",
    "¿Qué hacer si mi perro tiene pulgas?",
    "¿Cómo viajar con mi perro en avión?",
    "¿Que puedo y que no puedo darle a mi perro de comer?"
]

type Props = {
    onPreguntaClick: (pregunta: string) => void
}

export function PreguntasRapidas({ onPreguntaClick }: Props) {
    const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<string[]>([])

    useEffect(() => {
        const mezcladas = [...PREGUNTAS_DISPONIBLES].sort(() => Math.random() - 0.5)
        setPreguntasSeleccionadas(mezcladas.slice(0, 6))
    }, [])

    if (preguntasSeleccionadas.length === 0) {
        return null
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 mt-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                    Preguntas rápidas
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                    {preguntasSeleccionadas.map((pregunta, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors px-3 py-2 text-xs"
                                onClick={() => onPreguntaClick(pregunta)}
                            >
                                {pregunta}
                            </Badge>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
