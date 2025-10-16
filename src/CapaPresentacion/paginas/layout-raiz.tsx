import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ShellLayout } from "@/CapaPresentacion/componentes/shell-layout"
import { ProveedorAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import { ProveedorConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Byte Chat",
  description: "Tu asistente AI sobre perros",
}

export default function LayoutRaiz({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}> 
        <ProveedorAutenticacion>
          <ProveedorConversaciones>
            <ShellLayout>{children}</ShellLayout>
          </ProveedorConversaciones>
        </ProveedorAutenticacion>
      </body>
    </html>
  )
}
