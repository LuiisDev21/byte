import type { Metadata } from "next"
import { PaginaPrivacidad } from "@/CapaPresentacion/paginas/privacidad"

export const metadata: Metadata = {
  title: "Política de Privacidad | Byte Chat",
  description:
    "Conoce cómo Byte Chat recopila, trata y protege tus datos personales y consultas de cuidado canino de acuerdo con el RGPD, CCPA y los más altos estándares de privacidad en Inteligencia Artificial.",
  alternates: {
    canonical: "/privacidad",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RutaPrivacidad() {
  return <PaginaPrivacidad />
}
