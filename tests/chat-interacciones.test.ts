import { describe, it, expect } from "vitest"
import {
  extraerRazonamiento,
  evaluarAtajoTecladoEntrada,
  debeEnviarConEnter,
  debeInsertarSaltoDeLinea,
  GestorCancelacionChat,
} from "@/CapaNegocio/utilidades/chat-utilidades"

describe("Interacciones del Chat - Extractor de Razonamiento (<think> tags)", () => {
  it("debe extraer correctamente un bloque de razonamiento completo con etiqueta cerrada", () => {
    const textoEntrada = `<think>
El usuario consulta sobre diarrea en cachorros.
Posibles causas: parásitos, cambio brusco de dieta o parvovirus.
Protocolo: Indicar hidratación y recomendar valoración veterinaria sin prescribir.
</think>
Es fundamental que lleves a tu cachorro a una clínica veterinaria para descartar enfermedades infecciosas.`

    const resultado = extraerRazonamiento(textoEntrada)

    expect(resultado.razonamiento).not.toBeNull()
    expect(resultado.razonamiento).toContain("El usuario consulta sobre diarrea")
    expect(resultado.razonamiento).toContain("Protocolo: Indicar hidratación")
    expect(resultado.contenido).toBe(
      "Es fundamental que lleves a tu cachorro a una clínica veterinaria para descartar enfermedades infecciosas."
    )
  })

  it("debe extraer razonamiento en streaming cuando la etiqueta <think> aún no se ha cerrado", () => {
    const textoStreaming = "<think>Analizando los síntomas de torsión gástrica e hinchazón abdominal..."

    const resultado = extraerRazonamiento(textoStreaming)

    expect(resultado.razonamiento).toBe(
      "Analizando los síntomas de torsión gástrica e hinchazón abdominal..."
    )
    expect(resultado.contenido).toBe("")
  })

  it("debe retornar razonamiento nulo y mantener el texto íntegro si no hay etiquetas <think>", () => {
    const textoSimple = "Los perros adultos necesitan paseos diarios de al menos 30 a 60 minutos."

    const resultado = extraerRazonamiento(textoSimple)

    expect(resultado.razonamiento).toBeNull()
    expect(resultado.contenido).toBe(textoSimple)
  })

  it("debe retornar razonamiento nulo si la etiqueta <think></think> está vacía", () => {
    const textoVacio = "<think>   </think>Consulta directamente con tu veterinario de confianza."

    const resultado = extraerRazonamiento(textoVacio)

    expect(resultado.razonamiento).toBeNull()
    expect(resultado.contenido).toBe(
      "Consulta directamente con tu veterinario de confianza."
    )
  })

  it("debe manejar cadenas vacías o valores nulos sin lanzar excepciones", () => {
    expect(extraerRazonamiento("")).toEqual({ razonamiento: null, contenido: "" })
    expect(extraerRazonamiento(null as unknown as string)).toEqual({ razonamiento: null, contenido: "" })
    expect(extraerRazonamiento(undefined as unknown as string)).toEqual({ razonamiento: null, contenido: "" })
  })
})

describe("Interacciones del Chat - Manejo de entrada multilínea y detección de atajos (Enter vs Shift+Enter)", () => {
  it("debe detectar Enter simple como acción de envío", () => {
    const evento = { key: "Enter", shiftKey: false }
    const evaluacion = evaluarAtajoTecladoEntrada(evento)

    expect(evaluacion.debeEnviar).toBe(true)
    expect(evaluacion.debeInsertarSalto).toBe(false)
    expect(debeEnviarConEnter(evento)).toBe(true)
    expect(debeInsertarSaltoDeLinea(evento)).toBe(false)
  })

  it("debe detectar Shift + Enter como salto de línea para texto multilínea sin enviar", () => {
    const evento = { key: "Enter", shiftKey: true }
    const evaluacion = evaluarAtajoTecladoEntrada(evento)

    expect(evaluacion.debeEnviar).toBe(false)
    expect(evaluacion.debeInsertarSalto).toBe(true)
    expect(debeEnviarConEnter(evento)).toBe(false)
    expect(debeInsertarSaltoDeLinea(evento)).toBe(true)
  })

  it("no debe enviar si la entrada está en modo composición IME (acentos, kanji, etc.)", () => {
    const evento = { key: "Enter", shiftKey: false, isComposing: true }
    const evaluacion = evaluarAtajoTecladoEntrada(evento)

    expect(evaluacion.debeEnviar).toBe(false)
    expect(evaluacion.debeInsertarSalto).toBe(false)
    expect(debeEnviarConEnter(evento)).toBe(false)
  })

  it("no debe enviar ni saltar línea con otras teclas como letras o escape", () => {
    expect(evaluarAtajoTecladoEntrada({ key: "a", shiftKey: false })).toEqual({
      debeEnviar: false,
      debeInsertarSalto: false,
    })
    expect(evaluarAtajoTecladoEntrada({ key: "Escape" })).toEqual({
      debeEnviar: false,
      debeInsertarSalto: false,
    })
    expect(evaluarAtajoTecladoEntrada({ key: "Backspace" })).toEqual({
      debeEnviar: false,
      debeInsertarSalto: false,
    })
  })
})

describe("Interacciones del Chat - Lógica de cancelación con AbortController", () => {
  it("debe crear un nuevo AbortController activo y cancelarlo bajo demanda", () => {
    const gestor = new GestorCancelacionChat()

    expect(gestor.estaActivo).toBe(false)

    const controller = gestor.iniciar()
    expect(gestor.estaActivo).toBe(true)
    expect(controller.signal.aborted).toBe(false)

    const cancelado = gestor.cancelar()
    expect(cancelado).toBe(true)
    expect(controller.signal.aborted).toBe(true)
    expect(gestor.estaActivo).toBe(false)
  })

  it("debe abortar la tarea previa al iniciar una nueva para evitar condiciones de carrera", () => {
    const gestor = new GestorCancelacionChat()

    const primerControlador = gestor.iniciar()
    expect(primerControlador.signal.aborted).toBe(false)

    const segundoControlador = gestor.iniciar()
    expect(primerControlador.signal.aborted).toBe(true)
    expect(segundoControlador.signal.aborted).toBe(false)
  })

  it("debe abortar la lectura de un stream simulado al invocar cancelar", async () => {
    const gestor = new GestorCancelacionChat()
    const controller = gestor.iniciar()

    let chunksProcesados = 0
    let abortado = false

    const simularStreaming = async (signal: AbortSignal) => {
      try {
        for (let i = 0; i < 10; i++) {
          if (signal.aborted) {
            const err = new Error("This operation was aborted")
            err.name = "AbortError"
            throw err
          }

          chunksProcesados++

          if (i === 2) {
            // Cancelar en el tercer chunk
            gestor.cancelar()
          }

          await new Promise((res) => setTimeout(res, 5))
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          abortado = true
        } else {
          throw error
        }
      }
    }

    await simularStreaming(controller.signal)

    expect(abortado).toBe(true)
    expect(chunksProcesados).toBe(3)
    expect(controller.signal.aborted).toBe(true)
  })

  it("debe permitir limpiar la referencia sin generar errores", () => {
    const gestor = new GestorCancelacionChat()
    gestor.iniciar()
    gestor.limpiar()
    expect(gestor.estaActivo).toBe(false)
    expect(gestor.cancelar()).toBe(false)
  })
})
