import type { Metadata } from "next"
import { PaginaTerminos } from "@/CapaPresentacion/paginas/terminos"

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | Byte Chat",
  description:
    "Términos y condiciones de uso de Byte Chat. Incluye el descargo de responsabilidad veterinaria fundamental y el compromiso ético de bienestar canino.",
  alternates: {
    canonical: "/terminos",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RutaTerminos() {
  return <PaginaTerminos />
}
