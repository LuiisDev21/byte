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
