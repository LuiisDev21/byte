import { NextRequest, NextResponse } from "next/server"
import { formatearErrorIA } from "@/CapaDatos/configuracion/ia"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface ItemModelo {
  id?: string
  name?: string
}

function extraerNombreModelo(item: unknown): string | null {
  if (typeof item === "string" && item.trim()) return item.trim()
  if (typeof item === "object" && item !== null) {
    const obj = item as ItemModelo
    if (typeof obj.id === "string" && obj.id.trim()) return obj.id.trim()
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name.trim()
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const cuerpo = await req.json().catch(() => ({}))
    const { baseURL, apiKey } = cuerpo

    if (!baseURL || typeof baseURL !== "string" || !baseURL.trim()) {
      return NextResponse.json(
        { ok: false, error: "La URL base (Base URL) es obligatoria." },
        { status: 400 }
      )
    }

    const urlLimpia = baseURL.trim().replace(/\/+$/, "")

    const cabeceras: Record<string, string> = {
      Accept: "application/json",
    }

    if (apiKey && typeof apiKey === "string" && apiKey.trim()) {
      cabeceras.Authorization = `Bearer ${apiKey.trim()}`
    }

    if (urlLimpia.includes("openrouter.ai")) {
      cabeceras["HTTP-Referer"] = "https://www.bytechat.dev"
      cabeceras["X-Title"] = "Byte Chat"
    }

    const endpointModelos = `${urlLimpia}/models`

    const respuesta = await fetch(endpointModelos, {
      method: "GET",
      headers: cabeceras,
      signal: AbortSignal.timeout(15000),
    })

    if (!respuesta.ok) {
      let cuerpoError: unknown = null
      try {
        cuerpoError = await respuesta.json()
      } catch {
        cuerpoError = await respuesta.text()
      }

      const mensajeFormateado = formatearErrorIA({
        statusCode: respuesta.status,
        responseBody: typeof cuerpoError === "string" ? cuerpoError : JSON.stringify(cuerpoError),
        data:
          typeof cuerpoError === "object" && cuerpoError !== null
            ? (cuerpoError as { error?: { message?: string; code?: string | number } })
            : undefined,
      })

      return NextResponse.json(
        { ok: false, error: mensajeFormateado },
        { status: 400 }
      )
    }

    const datos: unknown = await respuesta.json()
    const datosObj = typeof datos === "object" && datos !== null ? (datos as Record<string, unknown>) : null

    let listaModelos: string[] = []

    const esCadena = (id: string | null): id is string => Boolean(id)

    if (Array.isArray(datosObj?.data)) {
      listaModelos = datosObj.data
        .map(extraerNombreModelo)
        .filter(esCadena)
    } else if (Array.isArray(datosObj?.models)) {
      listaModelos = datosObj.models
        .map(extraerNombreModelo)
        .filter(esCadena)
    } else if (Array.isArray(datos)) {
      listaModelos = datos
        .map(extraerNombreModelo)
        .filter(esCadena)
    }

    if (listaModelos.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Conexión exitosa, pero el proveedor no retornó modelos disponibles en el endpoint /models.",
        },
        { status: 400 }
      )
    }

    // Ordenar: primero modelos gratuitos (:free), luego alfabéticamente
    listaModelos.sort((a, b) => {
      const aFree = a.toLowerCase().includes(":free")
      const bFree = b.toLowerCase().includes(":free")
      if (aFree && !bFree) return -1
      if (!aFree && bFree) return 1
      return a.localeCompare(b)
    })

    return NextResponse.json({
      ok: true,
      total: listaModelos.length,
      modelos: listaModelos,
    })
  } catch (error) {
    console.error("Error probando proveedor de IA:", error)
    const mensaje = error instanceof Error ? error.message : "Error desconocido al conectar con el servidor"
    return NextResponse.json(
      {
        ok: false,
        error: `No se pudo conectar con el endpoint especificado: ${mensaje}. Verifica que la URL sea alcanzable y permita solicitudes.`,
      },
      { status: 500 }
    )
  }
}
