"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/CapaPresentacion/componentes/ui/insignia"
import { motion } from "framer-motion"


const PREGUNTAS_DISPONIBLES = [
    // --- Comportamiento Básico ---
    "¿Por qué mi perro come pasto?",
    "¿Por qué mi perro escarba en el jardín?",
    "¿Qué significa cuando mi perro mueve la cola?",
    "¿Por qué mi perro persigue su propia cola?",
    "¿Qué significa cuando mi perro inclina la cabeza?",
    "¿Por qué los perros tienen la nariz húmeda?",
    "¿Por qué mi perro aúlla?",
    "¿Qué significa cuando mi perro me lame?",
    "¿Por qué mi perro tiembla?",
    "¿Por qué los perros se huelen la cola?",

    // --- Entrenamiento y Socialización ---
    "¿Cómo entrenar a un cachorro?",
    "¿Cómo enseñar a mi perro a sentarse?",
    "¿Cómo enseñar a mi perro a venir cuando lo llamo?",
    "¿Cómo enseñar a mi perro a dar la pata?",
    "¿Cómo enseñar a mi perro a quedarse quieto?",
    "¿Cómo evitar que mi perro ladre mucho?",
    "¿Cómo evitar que mi perro muerda los muebles?",
    "¿Cómo enseñar a mi perro a caminar con la correa sin jalar?",
    "¿Cómo socializar a mi cachorro?",
    "¿Cómo presentar a mi perro a un nuevo gato?",
    "¿Cómo presentar a mi perro a otro perro?",
    "¿Cómo enseñar a mi perro a ir al baño afuera?",
    "¿Qué es el entrenamiento con clicker?",
    "¿Cómo corregir a mi perro cuando hace algo mal?",
    "¿A qué edad debo empezar a entrenar a mi cachorro?",

    // --- Salud y Prevención ---
    "¿Cómo saber si mi perro está enfermo?",
    "¿Qué vacunas necesita un cachorro?",
    "¿Cada cuánto debo desparasitar a mi perro?",
    "¿Qué hacer si mi perro tiene pulgas?",
    "¿Qué hacer si mi perro tiene garrapatas?",
    "¿Qué es el golpe de calor en perros y cómo prevenirlo?",
    "¿Cómo saber si mi perro tiene fiebre?",
    "¿Cuándo esterilizar a mi perro?",
    "¿Cuándo castrar a mi perro?",
    "¿Cuáles son los síntomas de la rabia en perros?",
    "¿Qué es el parvovirus canino?",
    "¿Mi perro necesita protector solar?",
    "¿Es peligrosa la tos de las perreras?",
    "¿Cómo prevenir la torsión gástrica en perros?",
    "¿Qué hacer en caso de envenenamiento?",

    // --- Nutrición y Alimentación ---
    "¿Cuál es la mejor comida para perros?",
    "¿Qué hacer si mi perro no come?",
    "¿Que puedo y que no puedo darle a mi perro de comer?",
    "¿Los perros pueden comer frutas? ¿Cuáles son seguras?",
    "¿Los perros pueden comer verduras? ¿Cuáles son seguras?",
    "¿El chocolate es realmente malo para los perros?",
    "¿Cuánta agua debe beber mi perro al día?",
    "¿Qué es la dieta BARF para perros?",
    "¿Cómo hacer la transición a una nueva comida para perros?",
    "¿Mi perro puede comer huesos cocidos?",

    // --- Cuidados e Higiene ---
    "¿Cada cuánto debo bañar a mi perro?",
    "¿Cómo cuidar los dientes de mi perro?",
    "¿Cómo cortar las uñas de mi perro?",
    "¿Cómo limpiar las orejas de mi perro?",
    "¿Cómo controlar la caída de pelo de mi perro?",
    "¿Qué tipo de cepillo necesita mi perro?",
    "¿Cómo quitar las legañas de mi perro?",
    "¿Cómo cuidar las almohadillas de mi perro?",
    "¿Mi perro necesita ropa en invierno?",
    "¿Qué hacer si mi perro huele mal?",

    // --- Elección de Raza y Estilo de Vida ---
    "¿Qué raza de perro es mejor para apartamentos?",
    "¿Qué razas son buenas con niños?",
    "¿Cuáles son las razas más inteligentes?",
    "¿Cuáles son las razas de perros hipoalergénicas?",
    "¿Qué razas de perros son las más tranquilas?",
    "¿Qué razas son mejores para dueños primerizos?",
    "¿Qué razas de perros necesitan más ejercicio?",
    "¿Cuáles son las razas de perros más grandes del mundo?",
    "¿Cuáles son las razas de perros más pequeñas?",
    "¿Qué debo considerar antes de adoptar un perro?",

    // --- Problemas de Comportamiento ---
    "¿Qué hacer si mi perro tiene ansiedad por separación?",
    "¿Por qué mi perro es agresivo con otros perros?",
    "¿Cómo manejar a un perro miedoso?",
    "¿Por qué mi perro se come sus propias heces (coprofagia)?",
    "¿Cómo evitar que mi perro salte sobre las visitas?",
    "¿Por qué mi perro monta objetos o personas?",
    "¿Cómo calmar a un perro durante una tormenta o fuegos artificiales?",
    "¿Mi perro está deprimido? ¿Cuáles son las señales?",
    "¿Cómo detener la destructividad en casa?",

    // --- Etapas de la Vida ---
    "¿Qué necesito preparar para la llegada de un nuevo cachorro?",
    "¿Cómo cuidar a un perro anciano (senior)?",
    "¿Cuánto tiempo dura el embarazo de una perra?",
    "¿Cuáles son los cuidados de una perra recién parida?",
    "¿A qué edad se considera anciano a un perro?",
    "¿Cómo ayudar a mi perro con la artritis?",

    // --- Misceláneos y Curiosidades ---
    "¿Cuánto ejercicio necesita un perro al día?",
    "¿Cómo viajar con mi perro en avión?",
    "¿Cómo viajar con mi perro en coche?",
    "¿Cuánto tiempo vive un perro en promedio?",
    "¿Cómo funciona el microchip para perros?",
    "¿Qué hacer si mi perro se pierde?",
    "¿Cuáles son las señales de que mi perro es feliz?",
    "¿Es malo que mi perro duerma en mi cama?",
    "¿Los perros ven en blanco y negro?",
    "¿Los perros sueñan?"
];

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
