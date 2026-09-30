import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { 
  detectarProveedorIA, 
  validarCredencialesIA, 
  obtenerModeloIA 
} from "@/CapaDatos/configuracion/ia"

describe("Abstracción Multi-Proveedor de IA", () => {
  const envOriginal = { ...process.env }

  beforeEach(() => {
    process.env = { ...envOriginal }
  })

  afterEach(() => {
    process.env = envOriginal
  })

  it("debe detectar OpenAI si AI_PROVIDER=openai", () => {
    process.env.AI_PROVIDER = "openai"
    expect(detectarProveedorIA()).toBe("openai")
  })

  it("debe detectar Google si AI_PROVIDER=google", () => {
    process.env.AI_PROVIDER = "google"
    expect(detectarProveedorIA()).toBe("google")
  })

  it("debe detectar automáticamente OpenAI si existe OPENAI_API_KEY y no hay AI_PROVIDER", () => {
    delete process.env.AI_PROVIDER
    process.env.OPENAI_API_KEY = "sk-test-123"
    expect(detectarProveedorIA()).toBe("openai")
  })

  it("debe validar correctamente la ausencia de clave para OpenAI", () => {
    delete process.env.OPENAI_API_KEY
    const res = validarCredencialesIA("openai")
    expect(res.valida).toBe(false)
    expect(res.mensajeError).toContain("OPENAI_API_KEY")
  })

  it("debe validar correctamente la presencia de clave para OpenAI", () => {
    process.env.OPENAI_API_KEY = "sk-valid-key"
    const res = validarCredencialesIA("openai")
    expect(res.valida).toBe(true)
  })

  it("debe validar correctamente la ausencia de clave para Google", () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const res = validarCredencialesIA("google")
    expect(res.valida).toBe(false)
    expect(res.mensajeError).toContain("GOOGLE_GENERATIVE_AI_API_KEY")
  })

  it("debe validar correctamente la presencia de clave para Google", () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key"
    const res = validarCredencialesIA("google")
    expect(res.valida).toBe(true)
  })

  it("debe instanciar el modelo de OpenAI con modelo personalizado", () => {
    process.env.OPENAI_API_KEY = "sk-test-key"
    const modelo = obtenerModeloIA({ proveedor: "openai", modelo: "gpt-4o" })
    expect(modelo.modelId).toBe("gpt-4o")
    expect(modelo.provider).toContain("openai")
  })

  it("debe instanciar el modelo de Google Gemini con modelo personalizado", () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key"
    const modelo = obtenerModeloIA({ proveedor: "google", modelo: "gemini-2.5-flash" })
    expect(modelo.modelId).toBe("gemini-2.5-flash")
    expect(modelo.provider).toContain("google")
  })

  it("debe soportar modelos compatibles como deepseek-flash con specificationVersion v2", () => {
    process.env.OPENAI_API_KEY = "test-key"
    process.env.OPENAI_BASE_URL = "https://api.deepseek.com/v1"
    const modelo = obtenerModeloIA({ proveedor: "openai", modelo: "deepseek-flash" })
    expect(modelo.modelId).toBe("deepseek-flash")
    expect(modelo.specificationVersion).toBe("v2")
  })
})
