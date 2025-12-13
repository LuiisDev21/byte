import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "ByteChat - Tu experto AI en perros",
	description:
		"Identifica razas con una foto y obtén consejos de cuidado, salud y entrenamiento canino. Disponible 24/7 en Nicaragua.",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "ByteChat - Tu experto AI en perros",
		description:
			"Identifica razas con una foto y obtén consejos de cuidado, salud y entrenamiento canino. Disponible 24/7.",
		url: "https://bytechat.dev/",
	},
}

export { default } from "@/CapaPresentacion/paginas/inicio"
