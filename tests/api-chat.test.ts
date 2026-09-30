import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST } from "@/CapaDatos/api/chat/route"
import { NextRequest } from "next/server"

describe("API Route /api/chat", () => {
  const envOriginal = { ...process.env }

  beforeEach(() => {
    process.env = { ...envOriginal }
  })

  afterEach(() => {
    process.env = envOriginal
  })

  it("debe retornar error 500 si no hay credenciales configuradas", async () => {
    delete process.env.OPENAI_API_KEY
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
    delete process.env.GOOGLE_API_KEY
    delete process.env.GEMINI_API_KEY
    process.env.AI_PROVIDER = "openai"

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hola" }],
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(500)
    const json = await resp.json()
    expect(json.error).toContain("OPENAI_API_KEY")
  })

  it("debe retornar error 400 si el mensaje de usuario está vacío", async () => {
    process.env.OPENAI_API_KEY = "sk-test"

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "   " }],
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(400)
    const json = await resp.json()
    expect(json.error).toContain("vacío")
  })

  it("debe retornar ReadableStream con cabeceras de texto plano", async () => {
    process.env.OPENAI_API_KEY = "sk-test"

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hola perro" }],
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(200)
    expect(resp.headers.get("content-type")).toContain("text/plain")
    expect(resp.body).toBeDefined()
  })

  it("el stream resultante debe emitir texto explicativo en lugar de cerrarse en blanco si el proveedor falla", async () => {
    process.env.OPENAI_API_KEY = "sk-invalid-key-for-test"
    process.env.AI_PROVIDER = "openai"

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hola perrito" }],
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(200)
    expect(resp.body).toBeDefined()

    const reader = resp.body!.getReader()
    const decoder = new TextDecoder()
    let contenidoAcumulado = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      contenidoAcumulado += decoder.decode(value)
    }

    // Comprobar que NUNCA retorne un cuerpo vacío
    expect(contenidoAcumulado.length).toBeGreaterThan(0)
    expect(contenidoAcumulado).toContain("⚠️")
  })

  it("debe permitir customProvider incluso si no hay credenciales en el servidor", async () => {
    delete process.env.OPENAI_API_KEY
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
    delete process.env.GOOGLE_API_KEY
    delete process.env.GEMINI_API_KEY

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hola perro" }],
        customProvider: {
          name: "Mi Proveedor",
          baseURL: "https://api.openai.com/v1",
          apiKey: "sk-cliente-key",
        },
        model: "gpt-4o-mini",
      }),
    })

    const resp = await POST(req)
    // No debe dar error 500 de credenciales no configuradas
    expect(resp.status).toBe(200)
    expect(resp.body).toBeDefined()
  })
})
