"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function EstablecerContrasenaPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  // Validar que el token existe
  const isValidToken = token && token.length > 10

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envío a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">¡Contraseña establecida!</CardTitle>
            <CardDescription>
              Su contraseña ha sido configurada exitosamente. Ahora puede iniciar sesión en el sistema.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-[#00334a] hover:bg-[#004a6b]">
              <Link href="/sistema-abierto/login">Iniciar Sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Error al establecer contraseña</CardTitle>
            <CardDescription>
              Ha ocurrido un error al establecer su contraseña. El enlace puede haber expirado o ser inválido.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-[#00334a] hover:bg-[#004a6b]">
              <Link href="/sistema-abierto/login">Volver al inicio de sesión</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sistema-abierto/recuperar-contrasena">Solicitar nuevo enlace</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Enlace inválido</CardTitle>
            <CardDescription>El enlace para establecer la contraseña es inválido o ha expirado.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-[#00334a] hover:bg-[#004a6b]">
              <Link href="/sistema-abierto/login">Volver al inicio de sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image src="/aconcarga-logo.png" alt="AconCarga Logo" width={150} height={40} className="mx-auto" />
          </div>
          <CardTitle className="text-xl">Establecer Contraseña</CardTitle>
          <CardDescription>
            Bienvenido a AconCarga. Por favor establezca su contraseña para acceder al sistema.
            {email && <div className="mt-2 font-medium text-[#00334a]">{email}</div>}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita la contraseña"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#00334a] hover:bg-[#004a6b]" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Establecer Contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
