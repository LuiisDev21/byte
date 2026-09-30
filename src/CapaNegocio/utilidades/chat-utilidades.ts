/**
 * Utilidades para el manejo de interacciones del chat:
 * - Extracción y formateo de razonamiento / etiquetas <think>
 * - Detección de atajos de teclado y entrada multilínea (Enter vs Shift+Enter)
 * - Gestión de controladores de aborto para cancelación de streaming
 */

export interface ResultadoRazonamiento {
  razonamiento: string | null
  contenido: string
}

/**
 * Extrae bloques de razonamiento (<think>...</think>) del contenido generado por modelos de IA.
 * Soporta etiquetas completas y etiquetas abiertas en streaming activo.
 */
export function extraerRazonamiento(texto: string): ResultadoRazonamiento {
  if (!texto || typeof texto !== "string") {
    return { razonamiento: null, contenido: "" }
  }

  // Coincidencia con etiqueta cerrada completa: <think>...</think>
  const regexCompleto = /<think>([\s\S]*?)<\/think>/i
  const coincidenciaCompleta = texto.match(regexCompleto)

  if (coincidenciaCompleta) {
    const razonamiento = coincidenciaCompleta[1].trim()
    const contenido = texto.replace(regexCompleto, "").trim()
    return {
      razonamiento: razonamiento.length > 0 ? razonamiento : null,
      contenido,
    }
  }

  // Coincidencia con etiqueta abierta (streaming en progreso): <think>...
  const regexAbierto = /<think>([\s\S]*)$/i
  const coincidenciaAbierta = texto.match(regexAbierto)

  if (coincidenciaAbierta) {
    const razonamiento = coincidenciaAbierta[1].trim()
    const contenido = texto.replace(regexAbierto, "").trim()
    return {
      razonamiento: razonamiento.length > 0 ? razonamiento : null,
      contenido,
    }
  }

  return {
    razonamiento: null,
    contenido: texto,
  }
}

export interface OpcionesEventoTeclado {
  key: string
  shiftKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  isComposing?: boolean
}

export interface ResultadoEvaluacionTeclado {
  debeEnviar: boolean
  debeInsertarSalto: boolean
}

/**
 * Evalúa las teclas presionadas en el compositor de chat para determinar
 * si debe enviar el formulario o permitir un salto de línea multilínea.
 */
export function evaluarAtajoTecladoEntrada(evento: OpcionesEventoTeclado): ResultadoEvaluacionTeclado {
  // Ignorar eventos durante composición IME (acentos, kanji, etc.)
  if (evento.isComposing) {
    return { debeEnviar: false, debeInsertarSalto: false }
  }

  if (evento.key === "Enter") {
    // Shift + Enter: salto de línea sin enviar
    if (evento.shiftKey) {
      return { debeEnviar: false, debeInsertarSalto: true }
    }

    // Enter sin Shift: envío directo
    return { debeEnviar: true, debeInsertarSalto: false }
  }

  return { debeEnviar: false, debeInsertarSalto: false }
}

export function debeEnviarConEnter(evento: OpcionesEventoTeclado): boolean {
  return evaluarAtajoTecladoEntrada(evento).debeEnviar
}

export function debeInsertarSaltoDeLinea(evento: OpcionesEventoTeclado): boolean {
  return evaluarAtajoTecladoEntrada(evento).debeInsertarSalto
}

/**
 * Gestor para controlar el ciclo de vida de un AbortController durante llamadas de streaming.
 */
export class GestorCancelacionChat {
  private controlador: AbortController | null = null

  public iniciar(): AbortController {
    if (this.controlador) {
      this.controlador.abort()
    }
    this.controlador = new AbortController()
    return this.controlador
  }

  public cancelar(): boolean {
    if (this.controlador) {
      this.controlador.abort()
      this.controlador = null
      return true
    }
    return false
  }

  public get estaActivo(): boolean {
    return this.controlador !== null && !this.controlador.signal.aborted
  }

  public get signal(): AbortSignal | undefined {
    return this.controlador?.signal
  }

  public limpiar(): void {
    this.controlador = null
  }
}
