"use client"

import Link from "next/link"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { PawPrint, MessageSquare, Shield, Zap } from "lucide-react"

export default function PaginaInicio() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <div className="flex justify-center mb-8">
          <PawPrint className="size-20 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Byte Chat
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Tu asistente AI inteligente. Chatea, aprende y explora con la ayuda de inteligencia artificial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="text-lg">
            <Link href="/chat">
              <MessageSquare className="size-5 mr-2" />
              Comenzar a chatear
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link href="/login">
              Iniciar sesión
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-6 rounded-lg border bg-card">
            <MessageSquare className="size-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Chat Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Conversaciones naturales con IA avanzada que entiende contexto e imágenes.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card">
            <Shield className="size-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Privado y Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Tus conversaciones están protegidas. Usa sin cuenta o guarda tu historial.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card">
            <Zap className="size-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Rápido y Gratuito</h3>
            <p className="text-sm text-muted-foreground">
              Respuestas instantáneas sin costo. Comienza a usar ahora mismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
