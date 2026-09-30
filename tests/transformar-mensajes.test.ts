import { describe, it, expect } from "vitest"
import { transformarMensajes } from "@/CapaDatos/api/chat/route"

describe("Transformador de Mensajes Multimodales", () => {
  it("debe transformar mensajes simples de texto de usuario y asistente", () => {
    const mensajes = [
      { role: "user" as const, content: "¿Qué vacunas necesita mi cachorro?" },
      { role: "assistant" as const, content: "Las vacunas principales son parvovirus, moquillo y rabia." }
    ]

    const resultado = transformarMensajes(mensajes)

    expect(resultado).toHaveLength(2)
    expect(resultado[0]).toEqual({
      role: "user",
      content: "¿Qué vacunas necesita mi cachorro?"
    })
    expect(resultado[1]).toEqual({
      role: "assistant",
      content: "Las vacunas principales son parvovirus, moquillo y rabia."
    })
  })

  it("debe transformar mensajes multimodales con texto e imagen para usuario", () => {
    const mensajes = [
      {
        role: "user" as const,
        content: [
          { type: "text" as const, text: "¿De qué raza parece este perrito?" },
          { type: "image" as const, image: "data:image/jpeg;base64,samplebase64string" }
        ]
      }
    ]

    const resultado = transformarMensajes(mensajes)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].role).toBe("user")
    expect(Array.isArray(resultado[0].content)).toBe(true)
    expect(resultado[0].content).toEqual([
      { type: "text", text: "¿De qué raza parece este perrito?" },
      { type: "image", image: "data:image/jpeg;base64,samplebase64string" }
    ])
  })

  it("debe consolidar partes de texto en mensajes de asistente si vienen en array", () => {
    const mensajes = [
      {
        role: "assistant" as const,
        content: [
          { type: "text" as const, text: "Parte 1 de la respuesta." },
          { type: "text" as const, text: "Parte 2 de la respuesta." }
        ]
      }
    ]

    const resultado = transformarMensajes(mensajes)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].role).toBe("assistant")
    expect(resultado[0].content).toBe("Parte 1 de la respuesta.\nParte 2 de la respuesta.")
  })
})
