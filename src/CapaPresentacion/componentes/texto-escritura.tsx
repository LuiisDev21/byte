/**
 * Componente React para texto con efecto de aparición.
 * - TextoEscritura(): muestra texto con transición de opacidad suave tras delay de 100ms
 *   cuando enabled=true, sino aparece inmediatamente.
 * - MarkdownEscritura(): renderiza markdown con animación fade-in, actualiza key
 *   para forzar re-render cuando cambia el texto.
 */
"use client"
import { useEffect, useState } from "react"
import { Markdown } from "@/CapaPresentacion/componentes/markdown"

type Props = {
  text: string
  enabled?: boolean
  className?: string
}

export function TextoEscritura({ text, enabled = true, className }: Props) {
  const [esVisible, establecerEsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      establecerEsVisible(true)
      return
    }

    establecerEsVisible(false)
    
    const temporizador = setTimeout(() => {
      establecerEsVisible(true)
    }, 100)

    return () => clearTimeout(temporizador)
  }, [text, enabled])

  return (
    <span 
      className={`${className} transition-opacity duration-500 ease-in-out ${
        esVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {text}
    </span>
  )
}

type PropsMD = Omit<Props, "text"> & { text: string }

export function MarkdownEscritura({ text, enabled = true, className }: PropsMD) {
  const [textoMostrado, establecerTextoMostrado] = useState("")
  const [clave, establecerClave] = useState(0)

  useEffect(() => {
    if (!enabled) {
      establecerTextoMostrado(text)
      return
    }

    if (text !== textoMostrado) {
      establecerTextoMostrado(text)
      establecerClave(prev => prev + 1) 
    }
  }, [text, enabled, textoMostrado])

  return (
    <div 
      key={clave}
      className={`${className} animate-in fade-in duration-200 ease-out`}
    >
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
        {textoMostrado}
      </Markdown>
    </div>
  )
}

export { TextoEscritura as TypingText, MarkdownEscritura as TypingMarkdown }
