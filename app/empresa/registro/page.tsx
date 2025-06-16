"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error al editar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
      isValid = false
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
      isValid = false
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      isValid = false
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulación de registro
    try {
      // Aquí iría la lógica real de registro
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Actualizar la redirección después del registro exitoso
      // Redirección después del registro exitoso
      window.location.href = "/empresa/login"
    } catch (error) {
      console.error("Error al registrar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Lado izquierdo - Solo visible en desktop */}
      <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Logo centrado con tamaño aumentado */}
            <div>
              <img
                src="/aconcarga-logo.png"
                alt="Aconcarga Logo"
                className="h-80 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Separador horizontal con punto */}
            <div className="mb-8 flex items-center w-full">
              <div className="h-px flex-grow bg-white/30"></div>
              <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
              <div className="h-px flex-grow bg-white/30"></div>
            </div>

            {/* Descripción */}
            <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
              Soluciones integrales para optimizar sus operaciones logísticas con tecnología de vanguardia
            </p>
          </div>
        </div>
      </div>

      {/* Lado derecho y versión móvil */}
      <div className="flex w-full flex-col md:w-1/2">
        {/* Header móvil - Solo visible en móvil */}
        <div className="flex flex-col items-center bg-[#002639] md:hidden">
          <img
            src="/aconcarga-logo.png"
            alt="Aconcarga Logo"
            className="h-48 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Contenido del formulario */}
        <div className="flex flex-grow items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            {/* Títulos */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Crear cuenta</h2>
              <p className="mt-2 text-gray-600">Completa el formulario para registrarte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.nombre && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.nombre}</span>
                  </div>
                )}
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@aconcarga.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña segura"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Campo Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#002639] hover:bg-[#003a5c] text-white py-2 px-4 rounded-md transition-colors mt-6"
              >
                {isSubmitting ? "Procesando..." : "Crear cuenta"}
              </Button>

              {/* Enlace a login */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/empresa/login" className="font-medium text-[#002639] hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
