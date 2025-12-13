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
  metadataBase: new URL("https://bytechat.dev"),
  title: {
    default: "Byte Chat",
    template: "%s | Byte Chat",
  },
  description:
    "ByteChat: tu asistente con IA especializado en perros. Identifica razas con fotos y recibe consejos de salud, cuidado y entrenamiento canino.",
  applicationName: "Byte Chat",
  keywords: [
    "chatbot",
    "IA",
    "perros",
    "razas de perros",
    "cuidado canino",
    "entrenamiento canino",
    "salud canina",
    "Nicaragua",
    "ByteChat",
  ],
  alternates: {
    canonical: "/",
  },
  category: "technology",
  creator: "Byte Chat",
  authors: [{ name: "Byte Chat" }],
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/byte.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/bytti.png" }],
  },
  openGraph: {
    type: "website",
    url: "https://bytechat.dev",
    siteName: "Byte Chat",
    locale: "es_NI",
    title: "ByteChat - Tu experto AI en perros",
    description:
      "Identifica razas con una foto y recibe recomendaciones de cuidado, salud y entrenamiento. Disponible 24/7.",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "ByteChat - Tu experto AI en perros",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteChat - Tu experto AI en perros",
    description:
      "Identifica razas con una foto y recibe recomendaciones de cuidado, salud y entrenamiento.",
    images: ["/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "U_5WfgeIVVBJC8CSmiuw91fgkAbGxgHnGO3_fKc2psM",
  },
}

export default function LayoutRaiz({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Byte Chat",
      url: "https://bytechat.dev",
      logo: "https://bytechat.dev/byte.svg",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NI",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Byte Chat",
      url: "https://bytechat.dev",
    },
  ]

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
