import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquareText, PanelLeft, LogIn, LogOut, Trash2 } from "lucide-react"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"
import { Separator } from "@/CapaPresentacion/componentes/ui/separador"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { ScrollArea } from "@/CapaPresentacion/componentes/ui/area-desplazamiento"
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

  const manejarEliminar = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm("¿Eliminar esta conversación?")) {
      try {
        await eliminarConversacionPorId(id)
        if (conversacionActual === id) {
          router.push("/chat")
        }
      } catch (error) {
        console.error("Error eliminando conversación:", error)
      }
    }
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
                  conversaciones.map((conv) => (
                    <li key={conv.id} className="group relative">
                      <Link
                        href={`/chat/${conv.id}`}
                        className={`block truncate rounded-md px-2 py-1.5 text-sm hover:bg-accent pr-8 ${
                          conversacionActual === conv.id ? "bg-accent" : ""
                        }`}
                        title={conv.titulo}
                        onClick={() => establecerConversacionActual(conv.id)}
                      >
                        {conv.titulo}
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 size-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => manejarEliminar(conv.id, e)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </li>
                  ))
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
    </nav>
  )
}

export { SidebarApp as AppSidebar }
