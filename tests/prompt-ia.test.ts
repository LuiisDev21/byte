import { describe, it, expect } from "vitest"
import { PROMPT_SISTEMA } from "@/CapaDatos/configuracion/ia"

describe("System Prompt Universal de Cuidado Canino", () => {
  it("debe existir y tener contenido sustancial", () => {
    expect(PROMPT_SISTEMA).toBeDefined()
    expect(PROMPT_SISTEMA.length).toBeGreaterThan(500)
  })

  it("debe estar enfocado en cuidado canino universal sin exclusividad regional", () => {
    expect(PROMPT_SISTEMA).toContain("especializado de manera exclusiva en perros")
    expect(PROMPT_SISTEMA).not.toContain("SOLO PERROS, NICARAGUA")
    expect(PROMPT_SISTEMA).not.toContain("estrictamente un proyecto universitario local")
  })

  it("debe incluir límites críticos y protocolos de seguridad médica", () => {
    expect(PROMPT_SISTEMA).toContain("NO DIAGNOSTICAS NI PRESCRIBES")
    expect(PROMPT_SISTEMA).toContain("refuerzo positivo")
    expect(PROMPT_SISTEMA).toContain("Banderas rojas de emergencia inmediata")
    expect(PROMPT_SISTEMA).toContain("clínica veterinaria de urgencias")
  })

  it("debe contemplar análisis multimodal de imágenes", () => {
    expect(PROMPT_SISTEMA).toContain("Análisis multimodal de imágenes de perros")
    expect(PROMPT_SISTEMA).toContain("Identificación visual de razas")
  })
})
