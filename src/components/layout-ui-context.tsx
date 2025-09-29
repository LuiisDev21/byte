"use client"
import { createContext, useContext } from "react"

type LayoutUI = {
  isDesktop: boolean
  sidebarOpen: boolean
}

const Ctx = createContext<LayoutUI>({ isDesktop: false, sidebarOpen: false })

export function LayoutUIProvider({ value, children }: { value: LayoutUI; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLayoutUI() {
  return useContext(Ctx)
}
