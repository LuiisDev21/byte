/**
 * Hook para manejar el desplazamiento automático del chat
 */
"use client"
import { useEffect } from "react"

export function useUsarDesplazamientoAutomatico(
  tieneMensajes: boolean,
  cantidadMensajes: number,
  estaCargando: boolean,
  contenidoUltimoMensaje: string
) {
  useEffect(() => {
    if (tieneMensajes) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [tieneMensajes, cantidadMensajes, estaCargando, contenidoUltimoMensaje])
}
