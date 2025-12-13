import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Iniciar sesión",
	description:
		"Accede a tu cuenta de ByteChat para guardar conversaciones y continuar tu chat con IA sobre perros.",
	robots: {
		index: false,
		follow: false,
	},
	alternates: {
		canonical: "/login",
	},
}

export { default } from "@/CapaPresentacion/paginas/login"
