"use client"

import React from "react"
import { LayoutLegal } from "@/CapaPresentacion/componentes/layout-legal"

export function PaginaCookies() {
  return (
    <LayoutLegal
      titulo="Política de Cookies y Almacenamiento Local"
      subtitulo="Te explicamos qué son las cookies, qué tecnologías de almacenamiento local utilizamos en Byte Chat para mantener tu sesión activa y cómo puedes administrarlas o desactivarlas en cualquier momento."
      ultimaActualizacion="30 de Septiembre de 2026"
    >
      <section className="space-y-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
          <strong>En resumen:</strong> Byte Chat no utiliza cookies publicitarias ni redes de seguimiento invasivas. Únicamente utilizamos tecnologías esenciales para recordar tu sesión y preferencias (como el tema visual), y analíticas anónimas para evaluar el rendimiento de la aplicación.
        </div>

        <h2>1. ¿Qué son las Cookies y el Almacenamiento Local?</h2>
        <p>
          Las <strong>cookies</strong> son pequeños archivos de texto que los sitios web descargan en tu navegador cuando los visitas. Permiten recordar acciones y preferencias del usuario (como inicio de sesión o idioma) durante un periodo de tiempo.
        </p>
        <p>
          El <strong>Almacenamiento Local (Local Storage / Session Storage)</strong> es una tecnología web estándar similar a las cookies, pero que permite almacenar información en tu navegador de forma segura con mayor capacidad y sin enviar esos datos en cada petición HTTP al servidor.
        </p>

        <h2>2. Tipos de Tecnologías que Utilizamos en Byte Chat</h2>

        <h3>2.1. Cookies Técnicas y Estrictamente Necesarias</h3>
        <p>
          Son esenciales para que la plataforma funcione de forma segura y adecuada. Sin ellas, los servicios básicos no pueden prestarse.
        </p>
        <ul>
          <li><strong>Autenticación y Sesión (Supabase):</strong> Gestiona los tokens de acceso cuando inicias sesión con tu cuenta, permitiendo que tu sesión permanezca activa mientras navegas entre páginas.</li>
          <li><strong>Preferencias de Interfaz:</strong> Almacena tu selección de tema visual (modo claro u oscuro) para no reiniciar la interfaz en cada visita.</li>
          <li><strong>Historial Temporal de Chat Anónimo:</strong> En modo sin cuenta, tus mensajes se guardan en el <code>localStorage</code> de tu navegador para que no pierdas la conversación activa al recargar la página.</li>
        </ul>

        <h3>2.2. Métricas y Analítica Anónima</h3>
        <p>
          Utilizamos servicios de medición como <strong>Vercel Analytics</strong> con fines exclusivamente estadísticos para comprender la velocidad de carga de la web, la tasa de errores y la estabilidad de la plataforma:
        </p>
        <ul>
          <li>No recopilan datos que te identifiquen personalmente.</li>
          <li>No realizan rastreo entre diferentes sitios web (cross-site tracking).</li>
          <li>No se comparten con redes de publicidad programática ni intermediarios comerciales.</li>
        </ul>

        <h2>3. Cuadro Detallado de Almacenamiento</h2>
        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-border/80 border border-border/80 rounded-2xl overflow-hidden text-sm">
            <thead className="bg-muted/40 font-heading">
              <tr>
                <th className="px-4 py-3 text-left">Elemento</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Finalidad</th>
                <th className="px-4 py-3 text-left">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">sb-*-auth-token</td>
                <td className="px-4 py-3">Técnica / Sesión</td>
                <td className="px-4 py-3">Mantiene la sesión de usuario autenticado</td>
                <td className="px-4 py-3">Persistente (hasta cierre de sesión)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">chat_local_messages</td>
                <td className="px-4 py-3">LocalStorage</td>
                <td className="px-4 py-3">Conserva temporalmente el chat anónimo</td>
                <td className="px-4 py-3">Hasta que el usuario limpie datos</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">theme</td>
                <td className="px-4 py-3">LocalStorage</td>
                <td className="px-4 py-3">Recuerda el modo visual (claro / oscuro)</td>
                <td className="px-4 py-3">1 año</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">_va / va_*</td>
                <td className="px-4 py-3">Analítica Anónima</td>
                <td className="px-4 py-3">Medición de latencia y velocidad del sitio</td>
                <td className="px-4 py-3">Sesión / Anónimo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>4. Cómo Gestionar o Desactivar las Cookies</h2>
        <p>
          Puedes restringir, bloquear o borrar las cookies y datos de almacenamiento local de Byte Chat en cualquier momento configurando las opciones de tu navegador web:
        </p>
        <ul>
          <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
          <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y Seguridad &gt; Cookies y datos del sitio.</li>
          <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Administrar datos de sitios web.</li>
          <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          <em>Nota: Si bloqueas las cookies técnicas esenciales, algunas funcionalidades (como el inicio de sesión o la recuperación de conversaciones guardadas) podrían dejar de funcionar adecuadamente.</em>
        </p>

        <h2>5. Actualizaciones de la Política de Cookies</h2>
        <p>
          Podemos modificar esta política en función de exigencias legislativas, jurisprudenciales o técnicas de la plataforma. Te recomendamos revisar esta página de forma periódica.
        </p>

        <h2>6. Dudas y Consultas</h2>
        <p>
          Si tienes alguna duda sobre nuestra política de cookies y tecnologías de almacenamiento, puedes escribirnos a <a href="mailto:privacidad@bytechat.dev">privacidad@bytechat.dev</a>.
        </p>
      </section>
    </LayoutLegal>
  )
}
