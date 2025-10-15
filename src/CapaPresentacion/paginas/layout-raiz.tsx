import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ShellLayout } from "@/CapaPresentacion/componentes/shell-layout"

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
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  )
}
