import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { POST } from "@/app/api/proveedor/test/route"
import { NextRequest } from "next/server"

describe("API Route /api/proveedor/test", () => {
  const globalFetchOriginal = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = globalFetchOriginal
  })

  it("debe retornar error 400 si falta baseURL", async () => {
    const req = new NextRequest("http://localhost:3000/api/proveedor/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(400)
    const json = await resp.json()
    expect(json.ok).toBe(false)
    expect(json.error).toContain("Base URL")
  })

  it("debe retornar modelos ordenados con :free primero si la petición tiene éxito", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { id: "openai/gpt-4o" },
          { id: "meta-llama/llama-3.3-70b:free" },
          { id: "anthropic/claude-3.5-sonnet" },
          { id: "liquid/lfm-2.5-2.6b:free" },
        ],
      }),
    } as unknown as Response)

    const req = new NextRequest("http://localhost:3000/api/proveedor/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baseURL: "https://openrouter.ai/api/v1/",
        apiKey: "sk-test",
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(200)
    const json = await resp.json()
    expect(json.ok).toBe(true)
    expect(json.total).toBe(4)
    // Los modelos gratuitos deben ir primero
    expect(json.modelos[0]).toContain(":free")
    expect(json.modelos[1]).toContain(":free")
  })

  it("debe manejar errores del proveedor formateando el mensaje", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: "Invalid API key provided" },
      }),
    } as unknown as Response)

    const req = new NextRequest("http://localhost:3000/api/proveedor/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baseURL: "https://api.openai.com/v1",
        apiKey: "sk-bad-key",
      }),
    })

    const resp = await POST(req)
    expect(resp.status).toBe(400)
    const json = await resp.json()
    expect(json.ok).toBe(false)
    expect(json.error).toContain("Error de autenticación")
  })
})
