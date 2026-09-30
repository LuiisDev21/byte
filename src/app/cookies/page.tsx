import type { Metadata } from "next"
import { PaginaCookies } from "@/CapaPresentacion/paginas/cookies"

export const metadata: Metadata = {
  title: "Política de Cookies y Almacenamiento Local | Byte Chat",
  description:
    "Información sobre las cookies técnicas y de almacenamiento local utilizadas en Byte Chat para la gestión de sesiones y analítica anónima.",
  alternates: {
    canonical: "/cookies",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RutaCookies() {
  return <PaginaCookies />
}
