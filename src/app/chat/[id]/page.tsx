import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Chat",
	robots: {
		index: false,
		follow: false,
	},
	alternates: {
		canonical: "/chat",
	},
}

export { default } from "@/CapaPresentacion/paginas/chat"
