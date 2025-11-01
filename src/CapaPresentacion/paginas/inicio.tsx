"use client"

import { useEffect, useRef, useState, useMemo, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { motion, useInView } from "framer-motion"
import { 
  Camera, 
  Heart, 
  Sparkles, 
  Check, 
  Facebook, 
  Instagram,
  MessageCircle
} from "lucide-react"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"

const caracteristicas = [
  {
    icon: Camera,
    titulo: "Identificador de razas",
    descripcion: "Conoce a fondo la raza de tu perro con solo enviarle una foto a nuestro chatbot.",
    textoPlaceholder: "Foto de cachorro"
  },
  {
    icon: Heart,
    titulo: "Consejos sobre cuidado",
    descripcion: "Obtén información sobre cuidados, entrenamiento, salud y comportamiento canino.",
    textoPlaceholder: "Cuidado canino"
  },
  {
    icon: Sparkles,
    titulo: "Datos Curiosos y Nombres",
    descripcion: "Pídele al chatbot datos divertidos sobre cualquier raza o ideas creativas para nombrar a tu nuevo cachorro.",
    textoPlaceholder: "Datos curiosos"
  }
]

const estadisticas = [
  { valor: "10K+", etiqueta: "Consultas Respondidas" },
  { valor: "200+", etiqueta: "Razas Cubiertas" },
  { valor: "24/7", etiqueta: "Disponibilidad" },
  { valor: "98%", etiqueta: "Satisfacción" }
]

const ContadorAnimado = memo(({ valor, duracion = 2 }: { valor: string; duracion?: number }) => {
  const [contador, establecerContador] = useState(0)
  
  const { esNumeroSimple, numeroObjetivo, esPorcentaje, esK, sufijo } = useMemo(() => {
    const esNumeroSimple = /^\d+[K%]?\+?$/.test(valor)
    const numeroObjetivo = esNumeroSimple ? parseInt(valor.replace(/\D/g, "")) : null
    const esPorcentaje = valor.includes("%")
    const esK = valor.includes("K")
    const sufijo = valor.replace(/[\d.]/g, "")
    return { esNumeroSimple, numeroObjetivo, esPorcentaje, esK, sufijo }
  }, [valor])

  useEffect(() => {
    if (!esNumeroSimple || !numeroObjetivo) return
    
    const inicio = Date.now()
    const intervalo = setInterval(() => {
      const ahora = Date.now()
      const progreso = Math.min((ahora - inicio) / (duracion * 1000), 1)
      const valorActual = Math.floor(progreso * numeroObjetivo)
      establecerContador(valorActual)
      
      if (progreso >= 1) {
        clearInterval(intervalo)
      }
    }, 16)
    
    return () => clearInterval(intervalo)
  }, [numeroObjetivo, duracion, esNumeroSimple])

  const mostrar = useMemo(() => {
    if (!esNumeroSimple) return valor
    
    if (esPorcentaje) {
      return `${contador}%`
    } else if (esK) {
      return `${contador}K${sufijo.replace("K", "")}`
    } else {
      return `${contador.toLocaleString()}${sufijo}`
    }
  }, [contador, esNumeroSimple, esPorcentaje, esK, sufijo, valor])

  if (!esNumeroSimple) {
    return <span>{valor}</span>
  }
  
  return <span>{mostrar}</span>
})

ContadorAnimado.displayName = "ContadorAnimado"

export default function PaginaInicio() {
  const [estaMontado, establecerEstaMontado] = useState(false)
  const refHero = useRef<HTMLElement>(null)
  const refCaracteristicas = useRef<HTMLElement>(null)
  const refCTA = useRef<HTMLElement>(null)
  const refEstadisticas = useRef<HTMLElement>(null)
  const refFooter = useRef<HTMLElement>(null)
  
  useEffect(() => {
    establecerEstaMontado(true)
  }, [])
  
  const opcionesVista = { once: true, amount: 0.3 } as const
  
  const enVistaHero = useInView(refHero, opcionesVista)
  const enVistaCaracteristicas = useInView(refCaracteristicas, opcionesVista)
  const enVistaCTA = useInView(refCTA, opcionesVista)
  const enVistaEstadisticas = useInView(refEstadisticas, opcionesVista)
  const enVistaFooter = useInView(refFooter, opcionesVista)

  const variantesHero = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }), [])

  const beneficios = useMemo(() => ["100% Gratis", "Sin registro", "Respuestas instantáneas"], [])

  return (
    <div className="flex min-h-screen flex-col">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={estaMontado ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
        role="banner"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={estaMontado ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            <ByteIcon className="size-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Byte Chat</span>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={estaMontado ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button asChild size="lg" className="bg-[#7A4F2F] hover:bg-[#7A4F2F]/90 text-white">
              <Link href="/chat">Probar gratis</Link>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <section className="w-full bg-background py-12 md:py-20" ref={refHero} aria-labelledby="hero-heading">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              animate={enVistaHero ? "visible" : "hidden"}
              variants={variantesHero}
              className="space-y-6"
            >
              <motion.h1
                id="hero-heading"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                ByteChat - Tu Experto AI en Perros
              </motion.h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-foreground/90 leading-relaxed"
              >
                Obtén respuestas instantáneas sobre cuidado canino, entrenamiento, salud y razas. 
                Tu asistente personal especializado en perros disponible 24/7.
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-[#7A4F2F] hover:bg-[#7A4F2F]/90 text-white text-lg px-8 py-6 h-auto">
                  <Link href="/chat">Chatea gratis</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: -5 }}
              animate={enVistaHero ? { opacity: 1, x: 0, rotate: 2 } : { opacity: 0, x: 50, rotate: -5 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl rotate-2">
                <motion.div
                  initial={{ scale: 1, opacity: 0 }}
                  animate={enVistaHero ? { 
                    scale: [1, 1.05, 1],
                    opacity: 1
                  } : { scale: 1, opacity: 0 }}
                  transition={{ 
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    opacity: {
                      duration: 0.8,
                      delay: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/hero.webp"
                    alt="ByteChat - Tu Experto AI en Perros"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    quality={90}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-16" ref={refCaracteristicas} aria-labelledby="caracteristicas-heading">
        <div className="container mx-auto px-4">
          <motion.h2
            id="caracteristicas-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={enVistaCaracteristicas ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
          >
            Características
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {caracteristicas.map((caracteristica, indice) => {
              return (
                <motion.div
                  key={indice}
                  initial={{ opacity: 0, y: 50 }}
                  animate={enVistaCaracteristicas ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: indice * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border"
                >
                  <motion.div 
                    className="aspect-[4/3] bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={enVistaCaracteristicas ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7, delay: indice * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={`/card${indice + 1}.webp`}
                        alt={caracteristica.titulo}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={85}
                      />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                    {caracteristica.titulo}
                  </h3>
                  <p className="text-muted-foreground">
                    {caracteristica.descripcion}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#5C5C5C] py-16" ref={refCTA}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={enVistaCTA ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={enVistaCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              ¿Listo para comenzar?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={enVistaCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/90 leading-relaxed"
            >
              Únete a miles de dueños de perros que ya confían en ByteChat para el cuidado de sus mascotas. 
              Es completamente gratis y no requiere registro.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={enVistaCTA ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-[#7A4F2F] hover:bg-[#7A4F2F]/90 text-white text-lg px-8 py-6 h-auto">
                <Link href="/chat">Comenzar Chat Ahora</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={enVistaCTA ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap justify-center gap-6 pt-4"
            >
              {beneficios.map((texto, indice) => (
                <motion.div
                  key={indice}
                  initial={{ opacity: 0, x: -20 }}
                  animate={enVistaCTA ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.6 + indice * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 text-white"
                >
                  <Check className="size-5 text-green-400" />
                  <span>{texto}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="w-full bg-[#4A3220] py-12" ref={refEstadisticas}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {estadisticas.map((estadistica, indice) => (
              <motion.div
                key={indice}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={enVistaEstadisticas ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ 
                  duration: 0.7, 
                  delay: indice * 0.1,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {enVistaEstadisticas ? (
                    <ContadorAnimado valor={estadistica.valor} />
                  ) : (
                    estadistica.valor
                  )}
                </div>
                <div className="text-white/80 text-sm md:text-base">{estadistica.etiqueta}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#4A3220] py-12" ref={refFooter} role="contentinfo">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={enVistaFooter ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ByteIcon className="size-6 text-white" />
                <span className="text-xl font-bold text-white">Byte Chat</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Tu asistente AI especializado en perros. Obtén respuestas expertas sobre cuidado canino, 
                entrenamiento, salud y más.
              </p>
              <p className="text-white/60 text-xs">
                © 2025 Byte Chat. Todos los derechos reservados.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={enVistaFooter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="relative w-full aspect-video max-w-md"
              >
                <Image
                  src="/footerpic.webp"
                  alt="ByteChat - Cuidado canino"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  quality={80}
                />
              </motion.div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Enlaces</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link href="#" className="hover:text-white transition-colors">Quienes somos</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link href="#" className="hover:text-white transition-colors">Política de privacidad</Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link href="#" className="hover:text-white transition-colors">Contáctanos</Link>
                    </motion.div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Redes sociales</h3>
                <div className="flex gap-4">
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <Link href="#" className="text-white/80 hover:text-white transition-colors">
                      <Facebook className="size-5" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <Link href="#" className="text-white/80 hover:text-white transition-colors">
                      <Instagram className="size-5" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <Link href="#" className="text-white/80 hover:text-white transition-colors">
                      <MessageCircle className="size-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}
