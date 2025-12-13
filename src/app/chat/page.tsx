import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Chat con IA para perros",
	description:
		"Chatea con ByteChat y obtén respuestas instantáneas sobre perros: razas, cuidado, salud y entrenamiento.",
	alternates: {
		canonical: "/chat",
	},
}

export { default } from "@/CapaPresentacion/paginas/chat"
