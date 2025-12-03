/**
 * Componente de sidebar principal de la aplicación con gestión de conversaciones.
 * - Muestra lista de conversaciones con scroll, estado colapsado/expandido.
 * - Funcionalidades: crear nueva conversación, eliminar conversaciones, navegación.
 * - Integra autenticación: muestra opciones de login/logout según estado usuario.
 * - Modal de confirmación para eliminar conversaciones.
 * - Diseño responsivo: colapsado muestra solo iconos, expandido muestra títulos.
 * - Accesibilidad: aria-labels, navegación por teclado, estados visuales claros.
 */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquareText, PanelLeft, LogIn, LogOut, Trash2 } from "lucide-react"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"
import { Separator } from "@/CapaPresentacion/componentes/ui/separador"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { ScrollArea } from "@/CapaPresentacion/componentes/ui/area-desplazamiento"
import { ModalEliminarConversacion } from "@/CapaPresentacion/componentes/modal-eliminar-conversacion"
import { useState, useEffect } from "react"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import { useConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"

interface PropiedadesSidebarApp {
  isCollapsed?: boolean
  onToggle?: () => void
  onCollapse?: () => void
  isMobile?: boolean
}

export function SidebarApp({ isCollapsed = false, onToggle, onCollapse, isMobile = false }: PropiedadesSidebarApp) {
  const router = useRouter()
  const { usuario, cerrarSesion } = useAutenticacion()
  const { conversaciones, crearNuevaConversacion, eliminarConversacionPorId, conversacionActual, establecerConversacionActual } = useConversaciones()
  const [estaHover, establecerEstaHover] = useState(false)
  const [modalEliminarAbierto, establecerModalEliminarAbierto] = useState(false)
  const [conversacionAEliminar, establecerConversacionAEliminar] = useState<{ id: string; titulo: string } | null>(null)

  useEffect(() => {
    if (isCollapsed) {
      establecerEstaHover(false)
    }
  }, [isCollapsed])

  const manejarNuevoChat = async () => {
    if (!usuario) {
      router.push("/chat")
      return
    }
    
    try {
      const id = await crearNuevaConversacion()
      router.push(`/chat/${id}`)
    } catch (error) {
      console.error("Error creando conversación:", error)
    }
  }

  const manejarCerrarSesion = async () => {
    try {
      await cerrarSesion()
      router.push("/")
    } catch (error) {
      console.error("Error cerrando sesión:", error)
    }
  }

  const manejarEliminar = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const conversacion = conversaciones.find(c => c.id === id)
    if (conversacion) {
      establecerConversacionAEliminar({ id, titulo: conversacion.titulo })
      establecerModalEliminarAbierto(true)
    }
  }

  const confirmarEliminar = async () => {
    if (!conversacionAEliminar) return
    
    try {
      await eliminarConversacionPorId(conversacionAEliminar.id)
      if (conversacionActual === conversacionAEliminar.id) {
        router.push("/chat")
      }
      establecerModalEliminarAbierto(false)
      establecerConversacionAEliminar(null)
    } catch (error) {
      console.error("Error eliminando conversación:", error)
    }
  }

  const cancelarEliminar = () => {
    establecerModalEliminarAbierto(false)
    establecerConversacionAEliminar(null)
  }

  if (isCollapsed) {
    return (
      <nav aria-label="Menú lateral colapsado" className="flex w-full flex-col h-full items-center py-4">
        <div
          className="group relative mb-4 cursor-pointer"
          onMouseEnter={() => establecerEstaHover(true)}
          onMouseLeave={() => establecerEstaHover(false)}
          onClick={() => onToggle?.()}
        >
          <div className="p-2 rounded-lg hover:bg-accent transition-all duration-200">
            {estaHover ? (
              <PanelLeft className="size-6 text-primary" />
            ) : (
              <ByteIcon className="size-6 text-primary" />
            )}
          </div>
        </div>

        <Separator className="w-8" />

        <div className="mt-4 space-y-2">
          <Button size="icon" variant="ghost" className="size-10" title="Nuevo Chat" onClick={manejarNuevoChat}>
            <MessageSquareText className="size-5" />
          </Button>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label="Menú lateral" className="flex w-full flex-col h-full">
      <div className="p-4">
        {!isMobile && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ByteIcon className="size-5 text-primary" />
              <span className="font-semibold">Byte Chat</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 hover:bg-accent"
              onClick={() => onCollapse?.()}
              title="Colapsar menú"
            >
              <PanelLeft className="size-4" />
            </Button>
          </div>
        )}
        <Button onClick={manejarNuevoChat} className="w-full justify-start gap-2">
          <MessageSquareText className="size-4" />
          Nuevo Chat
        </Button>
      </div>
      <Separator />

      <div className="flex-1 min-h-0 p-4 pt-3">
        <ScrollArea className="size-full pr-2">
          {!usuario ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground px-2">
                Inicia sesión para guardar tus conversaciones
              </p>
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/login">
                  <LogIn className="size-4" />
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground px-2">Conversaciones</p>
              <ul className="space-y-1">
                {conversaciones.length === 0 ? (
                  <li className="text-sm text-muted-foreground px-2 py-2">
                    No hay conversaciones
                  </li>
                ) : (
                  conversaciones.map((conv) => {
                    const tituloLimitado = conv.titulo.length > 18 ? conv.titulo.slice(0, 18) + "..." : conv.titulo
                    return (
                      <li key={conv.id} className="group relative w-full" style={{ minWidth: 0 }}>
                        <div className="flex items-center gap-1 w-full min-w-0">
                          <Link
                            href={`/chat/${conv.id}`}
                            className={`flex-1 min-w-0 truncate rounded-md px-2 py-1.5 text-sm hover:bg-accent overflow-hidden ${
                              conversacionActual === conv.id ? "bg-accent" : ""
                            }`}
                            title={conv.titulo}
                            onClick={() => establecerConversacionActual(conv.id)}
                            style={{ maxWidth: 'calc(100% - 32px)' }}
                          >
                            <span className="block truncate">{tituloLimitado}</span>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`size-7 shrink-0 flex-shrink-0 z-10 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              manejarEliminar(conv.id, e)
                            }}
                            style={{ flexShrink: 0 }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          )}
        </ScrollArea>
      </div>

      {usuario && (
        <>
          <Separator />
          <div className="p-4">
            <div className="text-xs text-muted-foreground mb-2 px-2 truncate">
              {usuario.email}
            </div>
            <Button onClick={manejarCerrarSesion} variant="outline" className="w-full justify-start gap-2">
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </div>
        </>
      )}

      <ModalEliminarConversacion
        abierto={modalEliminarAbierto}
        tituloConversacion={conversacionAEliminar?.titulo || ""}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />
    </nav>
  )
}

export { SidebarApp as AppSidebar }
