"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"
import {
  ProveedorPersonalizadoConfig,
  MODELOS_PREDETERMINADOS_SERVIDOR,
} from "@/CapaDatos/tipos/proveedor-personalizado"

const CLAVE_ALMACENAMIENTO = "byte_custom_provider"
const CLAVE_MODELO_SERVIDOR = "byte_server_model"

interface ContextoProveedorIAValor {
  configuracion: ProveedorPersonalizadoConfig | null
  modeloActivo: string
  usandoPersonalizado: boolean
  modelosDisponibles: string[]
  guardarConfiguracion: (config: ProveedorPersonalizadoConfig) => void
  seleccionarModelo: (modelo: string) => void
  activarProveedorPersonalizado: (activo: boolean) => void
  eliminarConfiguracion: () => void
  modalAbierto: boolean
  abrirModal: () => void
  cerrarModal: () => void
  obtenerPayloadSolicitud: () => {
    customProvider?: {
      name: string
      baseURL: string
      apiKey: string
    }
    model: string
  }
}

const ContextoProveedorIA = createContext<ContextoProveedorIAValor | null>(null)

export function ProveedorConfiguracionIA({
  children,
}: {
  children: React.ReactNode
}) {
  const [configuracion, setConfiguracion] = useState<ProveedorPersonalizadoConfig | null>(null)
  const [modeloServidor, setModeloServidor] = useState<string>(
    MODELOS_PREDETERMINADOS_SERVIDOR[0]
  )
  const [modalAbierto, setModalAbierto] = useState<boolean>(false)

  // Cargar configuración desde localStorage al montar en cliente
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO)
      if (guardado) {
        const parsed = JSON.parse(guardado) as ProveedorPersonalizadoConfig
        if (parsed.baseURL && parsed.apiKey) {
          setConfiguracion(parsed)
        }
      }

      const modeloServidorGuardado = localStorage.getItem(CLAVE_MODELO_SERVIDOR)
      if (
        modeloServidorGuardado &&
        MODELOS_PREDETERMINADOS_SERVIDOR.includes(modeloServidorGuardado)
      ) {
        setModeloServidor(modeloServidorGuardado)
      } else {
        setModeloServidor(MODELOS_PREDETERMINADOS_SERVIDOR[0])
      }
    } catch (e) {
      console.warn("No se pudo leer la configuración local del proveedor de IA:", e)
    }
  }, [])

  const usandoPersonalizado = Boolean(configuracion && configuracion.activo)

  const modeloActivo = useMemo(() => {
    if (usandoPersonalizado && configuracion?.modeloSeleccionado) {
      return configuracion.modeloSeleccionado
    }
    return modeloServidor
  }, [usandoPersonalizado, configuracion?.modeloSeleccionado, modeloServidor])

  const modelosDisponibles = useMemo(() => {
    if (usandoPersonalizado && configuracion?.modelosDisponibles?.length) {
      return configuracion.modelosDisponibles
    }
    return MODELOS_PREDETERMINADOS_SERVIDOR
  }, [usandoPersonalizado, configuracion?.modelosDisponibles])

  const guardarConfiguracion = useCallback((nuevaConfig: ProveedorPersonalizadoConfig) => {
    setConfiguracion(nuevaConfig)
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(nuevaConfig))
    } catch (e) {
      console.warn("No se pudo guardar la configuración en localStorage:", e)
    }
  }, [])

  const seleccionarModelo = useCallback(
    (nuevoModelo: string) => {
      if (usandoPersonalizado && configuracion) {
        const actualizada: ProveedorPersonalizadoConfig = {
          ...configuracion,
          modeloSeleccionado: nuevoModelo,
        }
        setConfiguracion(actualizada)
        try {
          localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(actualizada))
        } catch (e) {
          console.warn("No se pudo actualizar el modelo en localStorage:", e)
        }
      } else {
        setModeloServidor(nuevoModelo)
        try {
          localStorage.setItem(CLAVE_MODELO_SERVIDOR, nuevoModelo)
        } catch (e) {
          console.warn("No se pudo actualizar el modelo de servidor en localStorage:", e)
        }
      }
    },
    [usandoPersonalizado, configuracion]
  )

  const activarProveedorPersonalizado = useCallback(
    (activo: boolean) => {
      if (!configuracion) return
      const actualizada: ProveedorPersonalizadoConfig = {
        ...configuracion,
        activo,
      }
      setConfiguracion(actualizada)
      try {
        localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(actualizada))
      } catch (e) {
        console.warn("No se pudo actualizar el estado del proveedor en localStorage:", e)
      }
    },
    [configuracion]
  )

  const eliminarConfiguracion = useCallback(() => {
    setConfiguracion(null)
    try {
      localStorage.removeItem(CLAVE_ALMACENAMIENTO)
    } catch (e) {
      console.warn("No se pudo eliminar la configuración de localStorage:", e)
    }
  }, [])

  const abrirModal = useCallback(() => setModalAbierto(true), [])
  const cerrarModal = useCallback(() => setModalAbierto(false), [])

  const obtenerPayloadSolicitud = useCallback(() => {
    if (usandoPersonalizado && configuracion) {
      return {
        customProvider: {
          name: configuracion.nombre || "Personalizado",
          baseURL: configuracion.baseURL,
          apiKey: configuracion.apiKey,
        },
        model: configuracion.modeloSeleccionado,
      }
    }
    return {
      model: modeloServidor,
    }
  }, [usandoPersonalizado, configuracion, modeloServidor])

  const valor = useMemo<ContextoProveedorIAValor>(
    () => ({
      configuracion,
      modeloActivo,
      usandoPersonalizado,
      modelosDisponibles,
      guardarConfiguracion,
      seleccionarModelo,
      activarProveedorPersonalizado,
      eliminarConfiguracion,
      modalAbierto,
      abrirModal,
      cerrarModal,
      obtenerPayloadSolicitud,
    }),
    [
      configuracion,
      modeloActivo,
      usandoPersonalizado,
      modelosDisponibles,
      guardarConfiguracion,
      seleccionarModelo,
      activarProveedorPersonalizado,
      eliminarConfiguracion,
      modalAbierto,
      abrirModal,
      cerrarModal,
      obtenerPayloadSolicitud,
    ]
  )

  return (
    <ContextoProveedorIA.Provider value={valor}>
      {children}
    </ContextoProveedorIA.Provider>
  )
}

export function useConfiguracionProveedorIA(): ContextoProveedorIAValor {
  const contexto = useContext(ContextoProveedorIA)
  if (!contexto) {
    return {
      configuracion: null,
      modeloActivo: "gemini-2.5-flash",
      usandoPersonalizado: false,
      modelosDisponibles: MODELOS_PREDETERMINADOS_SERVIDOR,
      guardarConfiguracion: () => {},
      seleccionarModelo: () => {},
      activarProveedorPersonalizado: () => {},
      eliminarConfiguracion: () => {},
      modalAbierto: false,
      abrirModal: () => {},
      cerrarModal: () => {},
      obtenerPayloadSolicitud: () => ({ model: "gemini-2.5-flash" }),
    }
  }
  return contexto
}
