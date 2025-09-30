"use client"
import { useState, useCallback } from "react"

interface TextContent {
  type: "text"
  text: string
}

interface ImageContent {
  type: "image"
  image: string
}

type MessageContent = string | (TextContent | ImageContent)[]

interface Message {
  id: string
  role: "user" | "assistant"
  content: MessageContent
  timestamp: Date
}

interface UseChatWithImagesReturn {
  messages: Message[]
  input: string
  setInput: (input: string) => void
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
  isLoading: boolean
  send: () => Promise<void>
  stop: () => void
}

export function useChatWithImages(): UseChatWithImagesReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const stop = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsLoading(false)
    }
  }, [abortController])

  const send = useCallback(async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    const controller = new AbortController()
    setAbortController(controller)
    setIsLoading(true)

    // Crear contenido del mensaje
    const messageContent: MessageContent = []
    
    if (input.trim()) {
      messageContent.push({ type: "text", text: input.trim() })
    }
    
    if (selectedImage) {
      messageContent.push({ type: "image", image: selectedImage })
    }

    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.length === 1 && messageContent[0].type === "text" 
        ? messageContent[0].text 
        : messageContent,
      timestamp: new Date()
    }

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage])

    // Limpiar input e imagen
    setInput("")
    setSelectedImage(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Crear mensaje del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Leer stream de respuesta
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedText = ""
        
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk
          
          // Actualizar mensaje del asistente
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: accumulatedText }
              : msg
          ))
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted')
      } else {
        console.error("Error sending message:", error)
        
        // Agregar mensaje de error
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
      setAbortController(null)
    }
  }, [input, selectedImage, messages, isLoading, abortController])

  return {
    messages,
    input,
    setInput,
    selectedImage,
    setSelectedImage,
    isLoading,
    send,
    stop
  }
}