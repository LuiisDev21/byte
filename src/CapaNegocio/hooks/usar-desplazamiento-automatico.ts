/**
 * Hook para manejar el desplazamiento automático del chat
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
    if (tieneMensajes && autoScrollHabilitado && contenedorScrollRef.current) {
      const contenedor = contenedorScrollRef.current
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contenedor.scrollTo({
            top: contenedor.scrollHeight,
            behavior: "auto",
          })
        })
      })
    }
  }, [tieneMensajes, cantidadMensajes, estaCargando, contenidoUltimoMensaje, autoScrollHabilitado, contenedorScrollRef])
  
  useEffect(() => {
    if (estaCargando && autoScrollHabilitado && contenedorScrollRef.current && contenidoUltimoMensaje) {
      const contenedor = contenedorScrollRef.current
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contenedor.scrollTo({
            top: contenedor.scrollHeight,
            behavior: "auto",
          })
        })
      })
    }
  }, [contenidoUltimoMensaje, estaCargando, autoScrollHabilitado, contenedorScrollRef])
}
