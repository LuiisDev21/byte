/**
 * Contexto React para compartir estado del layout UI entre componentes.
 * - Proporciona información sobre estado del sidebar (abierto/cerrado) y tipo de dispositivo (escritorio/móvil).
 * - ProveedorLayoutUI: wrapper para inyectar valores del contexto.
 * - useUsarLayoutUI: hook para consumir el contexto en componentes hijos.
 * - Útil para sincronizar estado entre ShellLayout y componentes que necesitan saber el estado del sidebar.
 */
"use client"
import { createContext, useContext } from "react"

type LayoutUI = {
  esEscritorio: boolean
  sidebarAbierto: boolean
}

const Ctx = createContext<LayoutUI>({ esEscritorio: false, sidebarAbierto: false })

export function ProveedorLayoutUI({ value, children }: { value: LayoutUI; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useUsarLayoutUI() {
  return useContext(Ctx)
}

export { ProveedorLayoutUI as LayoutUIProvider, useUsarLayoutUI as useLayoutUI }
