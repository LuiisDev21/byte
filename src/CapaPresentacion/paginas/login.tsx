"use client"

import { useState } from "react"
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <ByteIcon className="size-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
          </CardTitle>
          <CardDescription>
            {esRegistro 
              ? "Crea una cuenta para guardar tus conversaciones" 
              : "Ingresa a tu cuenta para continuar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => establecerEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
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
              <p className={`text-sm ${error.includes("exitoso") ? "text-green-600" : "text-red-600"}`}>
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? "Cargando..." : esRegistro ? "Registrarse" : "Iniciar sesión"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                establecerEsRegistro(!esRegistro)
                establecerError("")
              }}
              className="text-primary hover:underline"
            >
              {esRegistro 
                ? "¿Ya tienes cuenta? Inicia sesión" 
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/chat")}
              className="text-sm"
            >
              Continuar sin cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
