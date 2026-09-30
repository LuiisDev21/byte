"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUp, MessageSquare, ShieldCheck } from "lucide-react"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"

interface PropsLayoutLegal {
  titulo: string
  subtitulo: string
  ultimaActualizacion: string
  children: React.ReactNode
}

export function LayoutLegal({
  titulo,
  subtitulo,
  ultimaActualizacion,
  children,
}: PropsLayoutLegal) {
  const [mostrarBotonArriba, establecerMostrarBotonArriba] = useState(false)
  const [progresoLectura, establecerProgresoLectura] = useState(0)

  useEffect(() => {
    const manejarScroll = () => {
      const scrollY = window.scrollY
      const alturaVentana = window.innerHeight
      const alturaDocumento = document.documentElement.scrollHeight
      
      establecerMostrarBotonArriba(scrollY > 250)

      if (alturaDocumento > alturaVentana) {
        const progreso = (scrollY / (alturaDocumento - alturaVentana)) * 100
        establecerProgresoLectura(Math.min(100, Math.max(0, progreso)))
      }
    }

    window.addEventListener("scroll", manejarScroll, { passive: true })
    manejarScroll()

    return () => window.removeEventListener("scroll", manejarScroll)
  }, [])

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-y-auto">
      {/* Header superior fijo con barra de progreso */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        {/* Barra delgada de progreso de lectura */}
        <div
          className="h-1 bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progresoLectura}%` }}
          aria-hidden="true"
        />

        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border/60 shadow-xs">
              <Image
                src="/bytti.png"
                alt="Byte Chat Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Byte<span className="text-primary">Chat</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/">
                <ArrowLeft className="mr-1.5 size-4" />
                Inicio
              </Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/chat">
                <MessageSquare className="mr-1.5 size-4" />
                Ir al Chat
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido Principal con scroll libre */}
      <main className="flex-1 w-full py-10 px-4 sm:px-6">
        <article className="mx-auto max-w-4xl">
          {/* Encabezado del documento */}
          <div className="mb-10 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <ShieldCheck className="size-4" />
              <span>Transparencia y Marco Legal</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              {titulo}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
              {subtitulo}
            </p>
            <div className="text-xs text-muted-foreground/80 font-medium">
              Última actualización: {ultimaActualizacion}
            </div>
          </div>

          {/* Cuerpo legal estructurado */}
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>

          {/* Enlaces a otros documentos legales */}
          <div className="mt-14 pt-8 border-t border-border/80">
            <h4 className="font-heading text-base font-semibold mb-4">Documentación legal complementaria:</h4>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="sm">
                <Link href="/privacidad">Política de Privacidad</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/terminos">Términos y Condiciones</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/cookies">Política de Cookies</Link>
              </Button>
            </div>
          </div>
        </article>
      </main>

      {/* Botón flotante para volver arriba */}
      {mostrarBotonArriba && (
        <button
          type="button"
          onClick={volverArriba}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 cursor-pointer animate-in fade-in zoom-in-90"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {/* Footer legal */}
      <footer className="border-t border-border/80 bg-muted/30 py-6 text-center text-xs text-muted-foreground mt-auto">
        <div className="mx-auto max-w-5xl px-4">
          <p>© {new Date().getFullYear()} Byte Chat. Inteligencia Artificial para el Cuidado Canino Integral.</p>
          <p className="mt-1 text-muted-foreground/80">
            Este servicio proporciona orientación informativa y no sustituye la atención médica veterinaria presencial.
          </p>
        </div>
      </footer>
    </div>
  )
}
