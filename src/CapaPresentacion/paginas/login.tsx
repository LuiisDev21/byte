"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { Input } from "@/CapaPresentacion/componentes/ui/input"
import { Label } from "@/CapaPresentacion/componentes/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/CapaPresentacion/componentes/ui/card"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"

export default function PaginaLogin() {
  const router = useRouter()
  const { iniciarSesion, registrarse } = useAutenticacion()
  const [email, establecerEmail] = useState("")
  const [password, establecerPassword] = useState("")
  const [esRegistro, establecerEsRegistro] = useState(false)
  const [cargando, establecerCargando] = useState(false)
  const [error, establecerError] = useState("")

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    establecerError("")
    establecerCargando(true)

    try {
      if (esRegistro) {
        await registrarse(email, password)
        establecerError("Registro exitoso. Revisa tu email para confirmar tu cuenta.")
      } else {
        await iniciarSesion(email, password)
        router.push("/chat")
      }
    } catch (err) {
      const error = err as Error
      establecerError(error.message || "Error en la autenticación")
    } finally {
      establecerCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-secondary/60 p-3 border border-border shadow-xs">
              <ByteIcon className="size-full text-primary" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl md:text-3xl font-normal text-foreground">
            {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {esRegistro 
              ? "Crea una cuenta para guardar tus conversaciones" 
              : "Ingresa a tu cuenta para continuar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => establecerEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => establecerPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <div className={`p-3 rounded-2xl text-sm ${error.includes("exitoso") ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {error}
              </div>
            )}
            <Button type="submit" variant="default" size="lg" className="w-full mt-2" disabled={cargando}>
              {cargando ? "Cargando..." : esRegistro ? "Registrarse" : "Iniciar sesión"}
            </Button>
          </form>
          <div className="mt-5 text-center text-sm">
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                establecerEsRegistro(!esRegistro)
                establecerError("")
              }}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              {esRegistro 
                ? "¿Ya tienes cuenta? Inicia sesión" 
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
          <div className="mt-3 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/chat")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Continuar sin cuenta
            </Button>
          </div>
          <div className="mt-5 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos" className="text-primary hover:underline font-medium">
              Términos de Uso
            </Link>{" "}
            y nuestra{" "}
            <Link href="/privacidad" className="text-primary hover:underline font-medium">
              Política de Privacidad
            </Link>.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
