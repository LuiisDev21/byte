"use client"

import React, { useState, useEffect } from "react"
import {
  X,
  Key,
  Globe,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  Sparkles,
} from "lucide-react"
import { useConfiguracionProveedorIA } from "@/CapaNegocio/contextos/contexto-proveedor-ia"
import {
  PRESETS_PROVEEDORES,
  PresetProveedor,
  ProveedorPersonalizadoConfig,
} from "@/CapaDatos/tipos/proveedor-personalizado"
import { Boton } from "@/CapaPresentacion/componentes/ui/boton"
import { Entrada } from "@/CapaPresentacion/componentes/ui/entrada"
import { cn } from "@/CapaNegocio/utilidades"

export function DialogoProveedorIA() {
  const {
    configuracion,
    guardarConfiguracion,
    eliminarConfiguracion,
    modalAbierto,
    cerrarModal,
  } = useConfiguracionProveedorIA()

  const [presetSeleccionado, setPresetSeleccionado] = useState<string>("openrouter")
  const [nombre, setNombre] = useState("")
  const [baseURL, setBaseURL] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [mostrarClave, setMostrarClave] = useState(false)
  const [activo, setActivo] = useState(true)

  const [probando, setProbando] = useState(false)
  const [resultadoPrueba, setResultadoPrueba] = useState<{
    exito: boolean
    mensaje: string
    modelos?: string[]
  } | null>(null)
  const [modeloSeleccionado, setModeloSeleccionado] = useState("")

  // Sincronizar estado cuando se abre el modal con la configuración existente o preset
  useEffect(() => {
    if (modalAbierto) {
      if (configuracion) {
        setNombre(configuracion.nombre || "")
        setBaseURL(configuracion.baseURL || "")
        setApiKey(configuracion.apiKey || "")
        setActivo(configuracion.activo ?? true)
        setModeloSeleccionado(configuracion.modeloSeleccionado || "")
        if (configuracion.modelosDisponibles?.length) {
          setResultadoPrueba({
            exito: true,
            mensaje: `${configuracion.modelosDisponibles.length} modelos cargados previamente.`,
            modelos: configuracion.modelosDisponibles,
          })
        } else {
          setResultadoPrueba(null)
        }
      } else {
        const preset = PRESETS_PROVEEDORES[0]
        setPresetSeleccionado(preset.id)
        setNombre(preset.nombre)
        setBaseURL(preset.baseURL)
        setApiKey("")
        setActivo(true)
        setModeloSeleccionado("")
        setResultadoPrueba(null)
      }
    }
  }, [modalAbierto, configuracion])

  // Cerrar con Escape
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalAbierto) {
        cerrarModal()
      }
    }
    window.addEventListener("keydown", manejarTecla)
    return () => window.removeEventListener("keydown", manejarTecla)
  }, [modalAbierto, cerrarModal])

  if (!modalAbierto) return null

  const aplicarPreset = (preset: PresetProveedor) => {
    setPresetSeleccionado(preset.id)
    setNombre(preset.nombre)
    setBaseURL(preset.baseURL)
    setResultadoPrueba(null)
  }

  const manejarProbarConexion = async () => {
    if (!baseURL.trim()) {
      setResultadoPrueba({
        exito: false,
        mensaje: "Por favor ingresa la Base URL del proveedor.",
      })
      return
    }

    setProbando(true)
    setResultadoPrueba(null)

    try {
      const res = await fetch("/api/proveedor/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseURL: baseURL.trim(),
          apiKey: apiKey.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.ok && Array.isArray(data.modelos) && data.modelos.length > 0) {
        setResultadoPrueba({
          exito: true,
          mensaje: `Conexión exitosa. Se detectaron ${data.modelos.length} modelos disponibles.`,
          modelos: data.modelos,
        })
        // Seleccionar automáticamente el primer modelo o uno gratuito
        if (!modeloSeleccionado || !data.modelos.includes(modeloSeleccionado)) {
          setModeloSeleccionado(data.modelos[0])
        }
      } else {
        setResultadoPrueba({
          exito: false,
          mensaje: data.error || "No se pudieron obtener modelos del proveedor.",
        })
      }
    } catch (err) {
      setResultadoPrueba({
        exito: false,
        mensaje:
          err instanceof Error
            ? err.message
            : "Error de red al conectar con el servidor.",
      })
    } finally {
      setProbando(false)
    }
  }

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault()

    if (!baseURL.trim()) {
      alert("La Base URL es obligatoria.")
      return
    }

    if (!apiKey.trim()) {
      alert("La clave de API es obligatoria.")
      return
    }

    const modelos = resultadoPrueba?.modelos || (configuracion?.modelosDisponibles ?? [])
    const modeloFinal = modeloSeleccionado || modelos[0] || "gpt-4o-mini"

    const nuevaConfig: ProveedorPersonalizadoConfig = {
      nombre: nombre.trim() || "Personalizado",
      baseURL: baseURL.trim(),
      apiKey: apiKey.trim(),
      modelosDisponibles: modelos.length > 0 ? modelos : [modeloFinal],
      modeloSeleccionado: modeloFinal,
      activo,
    }

    guardarConfiguracion(nuevaConfig)
    cerrarModal()
  }

  const manejarEliminar = () => {
    if (confirm("¿Deseas eliminar la configuración de tu proveedor personalizado y volver al proveedor predeterminado del sistema?")) {
      eliminarConfiguracion()
      cerrarModal()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={cerrarModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/70 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Key className="size-5" />
            </div>
            <div>
              <h2
                id="dialog-title"
                className="font-heading text-lg sm:text-xl font-bold text-foreground leading-tight"
              >
                Configurar Proveedor de IA
              </h2>
              <p className="text-xs text-muted-foreground">
                Usa tu propia API Key y endpoint compatible con OpenAI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarModal}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <form onSubmit={manejarGuardar} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Presets rápidos */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Proveedores Recomendados
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS_PROVEEDORES.map((preset) => {
                const esActivo = presetSeleccionado === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => aplicarPreset(preset)}
                    className={cn(
                      "flex flex-col items-start p-2.5 rounded-2xl border text-left text-xs transition-all",
                      esActivo
                        ? "border-primary bg-primary/5 text-primary shadow-xs font-medium"
                        : "border-border/80 bg-background hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-semibold">{preset.nombre}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {preset.id === "personalizado" ? "Manual" : preset.id}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Campos del Formulario */}
          <div className="space-y-3.5">
            {/* Nombre del Proveedor */}
            <div>
              <label
                htmlFor="nombre-proveedor"
                className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"
              >
                <Tag className="size-3.5 text-muted-foreground" />
                Nombre del Proveedor
              </label>
              <Entrada
                id="nombre-proveedor"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej. OpenRouter, Groq, Mi Servidor Ollama"
                required
              />
            </div>

            {/* Base URL */}
            <div>
              <label
                htmlFor="base-url"
                className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"
              >
                <Globe className="size-3.5 text-muted-foreground" />
                Base URL (Endpoint API)
              </label>
              <Entrada
                id="base-url"
                type="url"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                placeholder="https://openrouter.ai/api/v1"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Debe soportar la especificación OpenAI en <code>/chat/completions</code> y <code>/models</code>.
              </p>
            </div>

            {/* API Key */}
            <div>
              <label
                htmlFor="api-key"
                className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"
              >
                <Key className="size-3.5 text-muted-foreground" />
                Clave de API (API Key)
              </label>
              <div className="relative">
                <Entrada
                  id="api-key"
                  type={mostrarClave ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10 font-mono text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarClave(!mostrarClave)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={mostrarClave ? "Ocultar clave" : "Mostrar clave"}
                >
                  {mostrarClave ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Botón de Test */}
          <div>
            <Boton
              type="button"
              variant="outline"
              onClick={manejarProbarConexion}
              disabled={probando || !baseURL.trim()}
              className="w-full text-xs font-medium py-2.5"
            >
              {probando ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-2" />
                  Probando conexión y cargando modelos...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 mr-2 text-primary" />
                  Probar conexión y cargar modelos disponibles
                </>
              )}
            </Boton>
          </div>

          {/* Resultado de la Prueba */}
          {resultadoPrueba && (
            <div
              className={cn(
                "p-3 rounded-2xl text-xs border transition-all animate-in fade-in",
                resultadoPrueba.exito
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                  : "bg-destructive/10 border-destructive/30 text-destructive dark:text-red-300"
              )}
            >
              <div className="flex items-start gap-2">
                {resultadoPrueba.exito ? (
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <p className="font-medium whitespace-pre-line">{resultadoPrueba.mensaje}</p>

                  {/* Selector de modelo inicial si la prueba fue exitosa */}
                  {resultadoPrueba.exito && resultadoPrueba.modelos && resultadoPrueba.modelos.length > 0 && (
                    <div className="pt-2 border-t border-emerald-500/20">
                      <label
                        htmlFor="modelo-inicial"
                        className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1"
                      >
                        Seleccionar modelo principal:
                      </label>
                      <select
                        id="modelo-inicial"
                        value={modeloSeleccionado}
                        onChange={(e) => setModeloSeleccionado(e.target.value)}
                        className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                      >
                        {resultadoPrueba.modelos.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle Activo */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Activar este proveedor para mis consultas
              </p>
              <p className="text-[11px] text-muted-foreground">
                Si está desactivado, se usará el proveedor predeterminado del sistema.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-muted-foreground/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Aviso de privacidad */}
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
            <p>
              Tus credenciales y claves se guardan <strong>únicamente en el almacenamiento local de este navegador</strong> (localStorage). Nunca se envían a bases de datos externas ni se almacenan en nuestros servidores.
            </p>
          </div>

          {/* Acciones Inferiores */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            {configuracion ? (
              <Boton
                type="button"
                variant="destructive"
                onClick={manejarEliminar}
                className="w-full sm:w-auto text-xs py-2 px-3"
              >
                <Trash2 className="size-3.5 mr-1.5" />
                Eliminar configuración
              </Boton>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Boton
                type="button"
                variant="outline"
                onClick={cerrarModal}
                className="w-full sm:w-auto text-xs py-2 px-4"
              >
                Cancelar
              </Boton>
              <Boton
                type="submit"
                variant="default"
                className="w-full sm:w-auto text-xs py-2 px-5 font-semibold"
              >
                Guardar configuración
              </Boton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
