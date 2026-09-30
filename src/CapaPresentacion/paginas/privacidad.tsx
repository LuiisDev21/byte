"use client"

import React from "react"
import { LayoutLegal } from "@/CapaPresentacion/componentes/layout-legal"

export function PaginaPrivacidad() {
  return (
    <LayoutLegal
      titulo="Política de Privacidad y Protección de Datos"
      subtitulo="En Byte Chat nos tomamos muy en serio la privacidad de tus datos personales y los de tus compañeros caninos. Aquí te explicamos con total transparencia cómo recopilamos, tratamos y protegemos tu información bajo normativas internacionales como RGPD (GDPR) y CCPA."
      ultimaActualizacion="30 de Septiembre de 2026"
    >
      <section className="space-y-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
          <strong>Resumen de nuestro compromiso:</strong> No vendemos tu información personal a terceros. Tus conversaciones e imágenes subidas son procesadas exclusivamente para ofrecerte recomendaciones de cuidado canino y no son utilizadas para entrenar modelos de Inteligencia Artificial públicos de terceros sin tu consentimiento expreso.
        </div>

        <h2>1. Responsable del Tratamiento de los Datos</h2>
        <p>
          El responsable del tratamiento de los datos personales recopilados a través del sitio web y la plataforma <strong>Byte Chat</strong> (en adelante, &quot;la Plataforma&quot;) es el equipo de desarrollo y operación de Byte Chat, accesible a través del canal oficial de privacidad en <a href="mailto:privacidad@bytechat.dev">privacidad@bytechat.dev</a>.
        </p>

        <h2>2. Marco Regulatorio Aplicable</h2>
        <p>
          Esta Política de Privacidad ha sido redactada de conformidad con las normativas internacionales más exigentes en materia de privacidad y tratamiento de datos personales:
        </p>
        <ul>
          <li><strong>Reglamento General de Protección de Datos (RGPD / GDPR)</strong> de la Unión Europea (Reglamento UE 2016/679).</li>
          <li><strong>Ley de Privacidad del Consumidor de California (CCPA / CPRA)</strong> de los Estados Unidos.</li>
          <li>Leyes nacionales de protección de datos personales vigentes en los países de América Latina y otras jurisdicciones donde la Plataforma esté disponible.</li>
        </ul>

        <h2>3. Datos que Recopilamos</h2>
        <p>Recopilamos las siguientes categorías de datos según la forma en que interactúes con la Plataforma:</p>

        <h3>3.1. Datos proporcionados directamente por el usuario</h3>
        <ul>
          <li><strong>Datos de Cuenta:</strong> Dirección de correo electrónico y credenciales de autenticación gestionadas mediante Supabase Authentication cuando decides crear una cuenta.</li>
          <li><strong>Consultas y Prompts del Chat:</strong> El texto de las consultas que envías sobre nutrición, salud preventiva, comportamiento o cuidados de tu perro.</li>
          <li><strong>Contenido Multimodal (Imágenes Caninas):</strong> Fotografías de perros que subes de forma voluntaria para análisis visual (identificación de raza, detección de posturas corporales o lesiones superficiales orientativas).</li>
        </ul>

        <h3>3.2. Datos recopilados de forma automática</h3>
        <ul>
          <li><strong>Metadatos Técnicos:</strong> Dirección IP anonimizada, tipo de navegador, sistema operativo, resolución de pantalla y marcas de tiempo de las peticiones.</li>
          <li><strong>Datos de Navegación y Rendimiento:</strong> Métricas anónimas recopiladas a través de herramientas de analítica (como Vercel Analytics) para medir la velocidad de carga y estabilidad del servicio.</li>
          <li><strong>Almacenamiento Local (Local Storage):</strong> Para usuarios en modo anónimo (sin cuenta), almacenamos temporalmente el historial de sesión en el almacenamiento local de tu propio navegador.</li>
        </ul>

        <h2>4. Finalidad del Tratamiento de Datos</h2>
        <p>Tratamos tu información para los siguientes propósitos legítimos:</p>
        <ol>
          <li><strong>Prestación del Servicio de Asistencia Canina:</strong> Procesar tus consultas en tiempo real y generar respuestas adaptadas sobre bienestar canino mediante modelos avanzados de lenguaje y visión por computador.</li>
          <li><strong>Persistencia de Conversaciones:</strong> Guardar tu historial de chat si has iniciado sesión para que puedas consultar consejos previos desde cualquier dispositivo.</li>
          <li><strong>Seguridad y Detección de Abusos:</strong> Prevenir ataques informáticos, denegaciones de servicio y usos indebidos contrarios a nuestros Términos de Servicio.</li>
          <li><strong>Mejora del Servicio y Soporte:</strong> Analizar errores del sistema y atender solicitudes de asistencia técnica.</li>
        </ol>

        <h2>5. Tratamiento Específico con Inteligencia Artificial (IA)</h2>
        <p>
          Byte Chat utiliza proveedores de infraestructura de Inteligencia Artificial (tales como OpenAI y Google Generative AI) para la inferencia de lenguaje natural y visión artificial:
        </p>
        <ul>
          <li><strong>No Entrenamiento de Modelos Públicos:</strong> Las consultas e imágenes remitidas a través de las APIs empresariales que utilizamos están protegidas por acuerdos de procesamiento de datos y <em>no son utilizadas por los proveedores de IA para entrenar o mejorar modelos públicos o comerciales</em>.</li>
          <li><strong>Transmisión Cifrada:</strong> Toda comunicación entre nuestros servidores y los endpoints de inferencia de IA se realiza mediante canales seguros con cifrado TLS 1.3.</li>
        </ul>

        <h2>6. Base Jurídica del Tratamiento (RGPD)</h2>
        <p>El tratamiento de tus datos se fundamenta en:</p>
        <ul>
          <li><strong>Ejecución del Servicio:</strong> Para responder a tus solicitudes de chat y mantener tu cuenta de usuario.</li>
          <li><strong>Consentimiento Expreso:</strong> Al subir voluntariamente imágenes o aceptar el almacenamiento de cookies no esenciales.</li>
          <li><strong>Interés Legítimo:</strong> Para garantizar la seguridad de la red y optimizar la experiencia de usuario.</li>
        </ul>

        <h2>7. Conservación y Seguridad de los Datos</h2>
        <p>
          Tus datos se almacenan en infraestructuras de alta seguridad provistas por Supabase (PostgreSQL) con cifrado en reposo (AES-256) y políticas estrictas de <strong>Seguridad a Nivel de Fila (Row Level Security - RLS)</strong>, lo que garantiza que solo tú puedas acceder a tus conversaciones privadas.
        </p>
        <ul>
          <li><strong>Cuentas Registradas:</strong> Los datos se conservan mientras mantengas tu cuenta activa. Puedes eliminar conversaciones individuales o solicitar el borrado íntegro de tu cuenta en cualquier momento.</li>
          <li><strong>Sesiones Anónimas:</strong> Los mensajes no se vinculan a ninguna identidad personal y pueden borrarse limpiando el almacenamiento local de tu navegador.</li>
        </ul>

        <h2>8. Tus Derechos (Derechos ARCO y RGPD)</h2>
        <p>Como usuario titular de los datos, tienes derecho a ejercer en cualquier momento y de forma gratuita:</p>
        <ul>
          <li><strong>Acceso:</strong> Saber qué datos personales conservamos sobre ti.</li>
          <li><strong>Rectificación:</strong> Corregir información inexacta o desactualizada.</li>
          <li><strong>Supresión (Derecho al Olvido):</strong> Solicitar la eliminación total de tu cuenta y todos los chats asociados de nuestros servidores.</li>
          <li><strong>Oposición y Limitación:</strong> Solicitar que restrinjamos el procesamiento de tus datos en determinadas circunstancias.</li>
          <li><strong>Portabilidad:</strong> Solicitar una copia de tus conversaciones en formato electrónico estructurado (JSON o texto plano).</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, envía un correo a <a href="mailto:privacidad@bytechat.dev">privacidad@bytechat.dev</a> indicando tu solicitud. Te responderemos en un plazo máximo de 30 días naturales.
        </p>

        <h2>9. Menores de Edad</h2>
        <p>
          La Plataforma está dirigida a personas mayores de 16 años (o la edad legal mínima para consentir en tu jurisdicción). Si eres menor de dicha edad, debes utilizar la Plataforma bajo la supervisión de un padre, madre o tutor legal. No recopilamos conscientemente datos de menores sin consentimiento parental.
        </p>

        <h2>10. Modificaciones a esta Política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios normativos o mejoras en las funcionalidades de la Plataforma. En caso de cambios significativos, lo notificaremos mediante un aviso destacado en la web o por correo electrónico a los usuarios registrados.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Si tienes preguntas, dudas o inquietudes sobre esta Política de Privacidad o sobre el tratamiento de tus datos, puedes contactarnos en:
        </p>
        <ul>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:privacidad@bytechat.dev">privacidad@bytechat.dev</a></li>
          <li><strong>Plataforma Web:</strong> <a href="https://bytechat.dev">bytechat.dev</a></li>
        </ul>
      </section>
    </LayoutLegal>
  )
}
