import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { 
  detectarProveedorIA, 
  validarCredencialesIA, 
  obtenerModeloIA,
  soportaTemperatura,
  formatearErrorIA
} from "@/CapaDatos/configuracion/ia"
import { MODELOS_PREDETERMINADOS_SERVIDOR } from "@/CapaDatos/tipos/proveedor-personalizado"

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

  it("debe detectar proveedores compatibles como openrouter, deepseek, groq", () => {
    process.env.AI_PROVIDER = "openrouter"
    expect(detectarProveedorIA()).toBe("openai")
    process.env.AI_PROVIDER = "deepseek"
    expect(detectarProveedorIA()).toBe("openai")
    process.env.AI_PROVIDER = "groq"
    expect(detectarProveedorIA()).toBe("openai")
  })

  it("debe validar credenciales de Google con GOOGLE_API_KEY o GEMINI_API_KEY", () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
    process.env.GOOGLE_API_KEY = "alternate-google-key"
    expect(validarCredencialesIA("google").valida).toBe(true)

    delete process.env.GOOGLE_API_KEY
    process.env.GEMINI_API_KEY = "alternate-gemini-key"
    expect(validarCredencialesIA("google").valida).toBe(true)
  })

  it("soportaTemperatura debe rechazar modelos de razonamiento (o1, o3, deepseek-reasoner, nemotron reasoning)", () => {
    expect(soportaTemperatura("o1-mini")).toBe(false)
    expect(soportaTemperatura("o1-preview")).toBe(false)
    expect(soportaTemperatura("o3-mini")).toBe(false)
    expect(soportaTemperatura("deepseek-reasoner")).toBe(false)
    expect(soportaTemperatura("openai/o1")).toBe(false)
    expect(soportaTemperatura("nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free")).toBe(false)
    expect(soportaTemperatura("gpt-4o")).toBe(true)
    expect(soportaTemperatura("gemini-2.5-flash")).toBe(true)
    expect(soportaTemperatura("qwen/qwen3.8-27b:free")).toBe(true)
    expect(soportaTemperatura("google/gemma-4-26b-a4b-it:free")).toBe(true)
  })

  it("formatearErrorIA debe formatear error 402 de créditos insuficientes con sugerencias claras", () => {
    const error402 = {
      statusCode: 402,
      message: "Insufficient credits. This account never purchased credits."
    }
    const resultado = formatearErrorIA(error402)
    expect(resultado).toContain("Créditos insuficientes")
    expect(resultado).toContain(":free")
  })

  it("formatearErrorIA debe formatear error 401 de autenticación", () => {
    const error401 = {
      statusCode: 401,
      message: "Invalid API key"
    }
    const resultado = formatearErrorIA(error401)
    expect(resultado).toContain("Error de autenticación")
    expect(resultado).toContain("OPENAI_API_KEY")
  })

  it("formatearErrorIA debe formatear error 404 de modelo no encontrado", () => {
    const error404 = {
      statusCode: 404,
      message: "Model not found"
    }
    const resultado = formatearErrorIA(error404)
    expect(resultado).toContain("Modelo de IA no disponible")
  })

  it("debe configurar exactamente los 3 modelos gratuitos de servidor solicitados", () => {
    expect(MODELOS_PREDETERMINADOS_SERVIDOR).toEqual([
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      "qwen/qwen3.8-27b:free",
      "google/gemma-4-26b-a4b-it:free",
    ])
  })
})
