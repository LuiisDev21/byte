import { MensajeChat } from "@/CapaPresentacion/componentes/mensaje-chat"
import { IndicadorCarga } from "@/CapaPresentacion/componentes/indicador-carga"
import { Mensaje } from "@/CapaDatos/tipos/mensaje"

interface PropiedadesMensajesChat {
    messages: Mensaje[]
    isLoading: boolean
}

export function MensajesChat({ messages, isLoading }: PropiedadesMensajesChat) {
    const ultimoMensaje = messages[messages.length - 1]
    const deberaMostrarIndicadorGlobal = isLoading && (!ultimoMensaje || ultimoMensaje.role !== "assistant")

    return (
        <div className="space-y-4">
            {messages.map((mensaje, indice) => (
                <MensajeChat
                    key={indice}
                    message={mensaje}
                    isLastMessage={indice === messages.length - 1}
                    isLoading={isLoading}
                />
            ))}

            {deberaMostrarIndicadorGlobal && <IndicadorCarga />}
        </div>
    )
}

export { MensajesChat as ChatMessages }
