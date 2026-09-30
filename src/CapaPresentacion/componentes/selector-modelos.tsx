"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import {
  Cpu,
  ChevronDown,
  Check,
  Settings,
  Search,
  Server,
  Zap,
} from "lucide-react"
import { useConfiguracionProveedorIA } from "@/CapaNegocio/contextos/contexto-proveedor-ia"
import { cn } from "@/CapaNegocio/utilidades"

export function SelectorModelos() {
  const {
    configuracion,
    modeloActivo,
    usandoPersonalizado,
    modelosDisponibles,
    seleccionarModelo,
    activarProveedorPersonalizado,
    abrirModal,
  } = useConfiguracionProveedorIA()

  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const refContenedor = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const manejarClicFuera = (e: MouseEvent) => {
      if (
        refContenedor.current &&
        !refContenedor.current.contains(e.target as Node)
      ) {
        setAbierto(false)
      }
    }
    document.addEventListener("mousedown", manejarClicFuera)
    return () => document.removeEventListener("mousedown", manejarClicFuera)
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && abierto) {
        setAbierto(false)
      }
    }
    window.addEventListener("keydown", manejarTecla)
    return () => window.removeEventListener("keydown", manejarTecla)
  }, [abierto])

  // Filtrar modelos según búsqueda
  const modelosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return modelosDisponibles
    return modelosDisponibles.filter((m) => m.toLowerCase().includes(termino))
  }, [modelosDisponibles, busqueda])

  // Formato de nombre corto para el botón
  const nombreCortoModelo = useMemo(() => {
    if (!modeloActivo) return "Modelo"
    const partes = modeloActivo.split("/")
    return partes[partes.length - 1]
  }, [modeloActivo])

  return (
    <div ref={refContenedor} className="relative inline-block text-left">
      {/* Botón activador en la barra de texto */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        title={`Modelo activo: ${modeloActivo} (${usandoPersonalizado ? configuracion?.nombre || "Personalizado" : "Sistema"})`}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border",
          "border-border/70 bg-card hover:bg-muted/70 text-foreground",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
          abierto && "ring-2 ring-primary/30 border-primary"
        )}
      >
        <Cpu className="size-3.5 text-primary shrink-0" />
        <span className="max-w-[110px] sm:max-w-[140px] truncate">
          {nombreCortoModelo}
        </span>
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            usandoPersonalizado ? "bg-emerald-500" : "bg-primary/70"
          )}
          title={usandoPersonalizado ? "Proveedor propio activo" : "Proveedor del sistema activo"}
        />
        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform duration-150 shrink-0",
            abierto && "rotate-180"
          )}
        />
      </button>

      {/* Popover / Menú desplegable */}
      {abierto && (
        <div
          role="listbox"
          className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[380px]"
        >
          {/* Cabecera del desplegable con toggle de modo */}
          <div className="p-3 border-b border-border/70 bg-muted/30">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Proveedor Activo
              </span>
              {configuracion && (
                <button
                  type="button"
                  onClick={() => activarProveedorPersonalizado(!usandoPersonalizado)}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  {usandoPersonalizado ? "Usar servidor" : "Usar mi clave"}
                </button>
              )}
            </div>

            <div className="mt-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                {usandoPersonalizado ? (
                  <>
                    <Zap className="size-3.5 text-emerald-500" />
                    <span>{configuracion?.nombre || "Proveedor Propio"}</span>
                  </>
                ) : (
                  <>
                    <Server className="size-3.5 text-primary" />
                    <span>Byte Chat (Servidor)</span>
                  </>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                  usandoPersonalizado
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-primary/10 text-primary"
                )}
              >
                {usandoPersonalizado ? "BYOK Activo" : "Predeterminado"}
              </span>
            </div>
          </div>

          {/* Buscador de modelos si hay más de 5 */}
          {modelosDisponibles.length > 5 && (
            <div className="p-2 border-b border-border/60">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar modelo..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-muted/40 border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Lista de Modelos */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 max-h-[220px]">
            {modelosFiltrados.length === 0 ? (
              <p className="p-3 text-center text-xs text-muted-foreground">
                No se encontraron modelos con &ldquo;{busqueda}&rdquo;
              </p>
            ) : (
              modelosFiltrados.map((modelo) => {
                const esSeleccionado = modelo === modeloActivo
                const esGratuito = modelo.toLowerCase().includes(":free")

                return (
                  <button
                    key={modelo}
                    type="button"
                    onClick={() => {
                      seleccionarModelo(modelo)
                      setAbierto(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors",
                      esSeleccionado
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted/70 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="truncate">{modelo}</span>
                      {esGratuito && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded-md shrink-0">
                          Gratis
                        </span>
                      )}
                    </div>
                    {esSeleccionado && (
                      <Check className="size-3.5 text-primary shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Pie del menú: acceso a la configuración */}
          <div className="p-2 border-t border-border/70 bg-muted/20">
            <button
              type="button"
              onClick={() => {
                setAbierto(false)
                abrirModal()
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-border/90 hover:border-primary/50 hover:bg-primary/5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Settings className="size-3.5" />
              {configuracion
                ? "Editar mi proveedor de IA..."
                : "Configurar mi propio proveedor..."}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
