"use client"

import React from "react"
import { LayoutLegal } from "@/CapaPresentacion/componentes/layout-legal"

export function PaginaTerminos() {
  return (
    <LayoutLegal
      titulo="Términos y Condiciones de Uso"
      subtitulo="Por favor, lee detenidamente estos Términos de Uso antes de utilizar Byte Chat. Al acceder o utilizar nuestra plataforma, aceptas quedar vinculado por estas condiciones, especialmente en lo relativo al descargo de responsabilidad veterinaria."
      ultimaActualizacion="30 de Septiembre de 2026"
    >
      <section className="space-y-6">
        {/* Descargo Veterinario Destacado */}
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 text-sm leading-relaxed text-foreground dark:border-amber-400/40 dark:bg-amber-400/10">
          <h3 className="font-heading text-base font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-2 flex items-center gap-2">
            ⚠️ DESCARGO DE RESPONSABILIDAD VETERINARIA ESENCIAL (IMPORTANTE)
          </h3>
          <p className="mb-2">
            <strong>Byte Chat es un sistema de asistencia por Inteligencia Artificial diseñado exclusivamente con fines informativos, de orientación general, bienestar y educación canina.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>NO ES UN SERVICIO VETERINARIO:</strong> Byte Chat no es una clínica veterinaria ni está facultado para emitir diagnósticos médicos definitivos, prescribir tratamientos farmacológicos sujetos a receta ni administrar terapias clínicas.</li>
            <li><strong>NO SUSTITUYE AL MÉDICO VETERINARIO:</strong> Ninguna respuesta emitida por la plataforma debe sustituir la evaluación clínica presencial, pruebas de laboratorio, radiografías o el criterio profesional de un <strong>Médico Veterinario Colegiado</strong>.</li>
            <li><strong>EMERGENCIAS VITALES:</strong> Si tu perro presenta síntomas críticos como dificultad respiratoria grave, hinchazón abdominal súbita con arcadas (posible torsión gástrica), convulsiones activas, ingesta de sustancias tóxicas (chocolate, xilitol, venenos), hemorragias profusas o traumatismos graves, <strong>NO esperes una respuesta en el chat: traslada a tu mascota de inmediato al hospital o clínica veterinaria de urgencias más cercano</strong>.</li>
          </ul>
        </div>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder, registrarte o interactuar con <strong>Byte Chat</strong> (en adelante, &quot;el Servicio&quot;), declaras haber leído, comprendido y aceptado en su totalidad estos Términos y Condiciones de Uso, así como nuestra <a href="/privacidad">Política de Privacidad</a>. Si no estás de acuerdo con alguna cláusula, debes abstenerte de utilizar el Servicio.
        </p>

        <h2>2. Descripción del Servicio</h2>
        <p>
          Byte Chat proporciona un entorno conversacional interactivo asistido por modelos de Inteligencia Artificial enfocado en:
        </p>
        <ul>
          <li>Orientación sobre cuidados preventivos, higiene, cepillado y bienestar diario de perros.</li>
          <li>Recomendaciones generales de nutrición básica y hábitos saludables según la etapa de vida (cachorro, adulto, senior).</li>
          <li>Identificación orientativa de razas y características morfológicas mediante imágenes.</li>
          <li>Pautas de educación básica y convivencia fundamentadas de manera estricta en el <strong>refuerzo positivo</strong>.</li>
        </ul>

        <h2>3. Compromiso Ético y Prohibición de Maltrato Animal</h2>
        <p>
          Byte Chat defiende y promueve exclusivamente el bienestar y la dignidad animal. Queda terminantemente prohibido utilizar la plataforma para:
        </p>
        <ul>
          <li>Solicitar o promover métodos de adiestramiento basados en el castigo físico, asfixia, collares de descargas eléctricas, collares de púas o cualquier técnica que cause dolor, miedo o estrés al perro.</li>
          <li>Promover peleas de perros, mutilaciones estéticas (corte de orejas o colas sin justificación médica) o cualquier acto constitutivo de maltrato o crueldad animal según la legislación aplicable.</li>
          <li>Intentar eludir las medidas de seguridad de la IA para obtener formulaciones de sustancias letales o perjudiciales para animales o personas.</li>
        </ul>

        <h2>4. Registro y Cuentas de Usuario</h2>
        <p>
          Puedes usar Byte Chat de forma anónima con funcionalidades básicas, o registrarte con tu correo electrónico para almacenar tu historial de conversaciones. Al registrarte:
        </p>
        <ul>
          <li>Garantizas que la información proporcionada es verídica y que eres el titular legítimo del correo electrónico registrado.</li>
          <li>Eres responsable de custodiar la confidencialidad de tu contraseña.</li>
          <li>Nos reservamos el derecho de suspender o cancelar cuentas que violen estos Términos de Uso o participen en actividades fraudulentas o abusivas.</li>
        </ul>

        <h2>5. Propiedad Intelectual y Licencia</h2>
        <ul>
          <li><strong>Propiedad de la Plataforma:</strong> El diseño, código fuente, logotipos, marcas, iconos, interfaz gráfica y arquitectura de Byte Chat son propiedad exclusiva de sus desarrolladores y están protegidos por las leyes de propiedad intelectual internacionales.</li>
          <li><strong>Tus Contenidos:</strong> Conservas todos los derechos de propiedad sobre los textos y fotografías caninas que subas a la plataforma. Nos concedes una licencia no exclusiva, revocable y limitada estrictamente a lo necesario para procesar y mostrar tus respuestas dentro del Servicio.</li>
        </ul>

        <h2>6. Limitación de Responsabilidad</h2>
        <p>
          En la máxima medida permitida por la legislación aplicable:
        </p>
        <ul>
          <li>El Servicio se proporciona <strong>&quot;tal cual&quot; (as is)</strong> y <strong>&quot;según disponibilidad&quot;</strong>, sin garantías de ningún tipo respecto a la infalibilidad o exactitud diagnóstica médica de las respuestas generadas por Inteligencia Artificial.</li>
          <li>Byte Chat y sus desarrolladores no asumen responsabilidad alguna por daños directos, indirectos, incidentales o consecuenciales derivados de decisiones de salud, dietas o tratamientos que el usuario decida implementar de forma autónoma sin la consulta previa a un veterinario colegiado.</li>
        </ul>

        <h2>7. Conducta Aceptable del Usuario</h2>
        <p>Al utilizar el Servicio, te comprometes a no:</p>
        <ul>
          <li>Realizar ataques de denegación de servicio (DoS/DDoS) o sobrecargar deliberadamente la infraestructura de la API.</li>
          <li>Descompilar, realizar ingeniería inversa o extraer código fuente del sistema.</li>
          <li>Subir imágenes que contengan material con derechos de autor de terceros sin autorización, contenido pornográfico, violento o ilegal.</li>
        </ul>

        <h2>8. Modificaciones al Servicio y a los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar, actualizar o discontinuar cualquier aspecto del Servicio en cualquier momento. Las modificaciones sustanciales a estos Términos serán publicadas en esta página con la fecha de última actualización correspondiente. El uso continuado del Servicio tras la publicación constituirá la aceptación de los nuevos términos.
        </p>

        <h2>9. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables al comercio electrónico y servicios de la sociedad de la información. Cualquier controversia será sometida preferentemente a resolución amistosa o a los tribunales competentes de acuerdo con la legislación de protección al consumidor aplicable.
        </p>

        <h2>10. Contacto Legal</h2>
        <p>
          Para consultas, notificaciones legales o aclaraciones sobre estos Términos y Condiciones, por favor contáctanos en <a href="mailto:legal@bytechat.dev">legal@bytechat.dev</a>.
        </p>
      </section>
    </LayoutLegal>
  )
}
