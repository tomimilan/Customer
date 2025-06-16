"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "El email es requerido"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulación de inicio de sesión
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Credenciales de prueba
      if (email === "admin@aconcarga.com" && password === "password") {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo al dashboard...",
        })
        router.push("/modules/dashboard")
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: "Credenciales incorrectas. Intenta de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Ha ocurrido un error. Intenta de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
              className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          <div className="flex justify-end">
            <Link href="/empresa/recuperar-contrasena" className="text-sm font-medium text-[#00334a] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00334a] hover:bg-[#004a6b] text-white py-2 px-4 rounded-md transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  )
}
