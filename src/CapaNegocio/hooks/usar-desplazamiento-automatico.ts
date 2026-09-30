/**
 * Hook para manejar el desplazamiento automático del chat.
 * Implementa scroll inteligente: si el usuario ha scrolleado hacia arriba a leer
 * (más de 150px del fondo o autoScrollHabilitado es falso), no fuerza el auto-scroll hacia abajo durante el streaming.
 */
"use client"
import { useEffect, RefObject } from "react"

export function useUsarDesplazamientoAutomatico(
  contenedorScrollRef: RefObject<HTMLElement | null>,
  tieneMensajes: boolean,
  cantidadMensajes: number,
  estaCargando: boolean,
  contenidoUltimoMensaje: string,
  autoScrollHabilitado: boolean = true
) {
  useEffect(() => {
    const contenedor = contenedorScrollRef.current
    if (!contenedor || !tieneMensajes || !autoScrollHabilitado) return

    const distanciaDelFondo = contenedor.scrollHeight - contenedor.scrollTop - contenedor.clientHeight

    // Si el usuario está a más de 150px del fondo, respetar su lectura y no forzar scroll
    if (distanciaDelFondo > 150) return

    // Mantener la vista anclada al fondo directamente sin saltos de doble frame
    contenedor.scrollTop = contenedor.scrollHeight
  }, [tieneMensajes, cantidadMensajes, estaCargando, contenidoUltimoMensaje, autoScrollHabilitado, contenedorScrollRef])
}
