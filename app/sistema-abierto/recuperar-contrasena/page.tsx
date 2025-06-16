"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("El email es requerido")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido")
      return
    }

    setIsLoading(true)

    try {
      // Simulación de envío de correo
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Intenta de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
              <h2 className="text-3xl font-bold text-gray-900">Recuperar contraseña</h2>
              <p className="mt-2 text-gray-600">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              <Link
                href="/sistema-abierto/login"
                className="inline-flex items-center mt-4 text-sm font-medium text-[#00334a] hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </div>

            {isSubmitted ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Correo enviado</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Hemos enviado un correo a <strong>{email}</strong> con instrucciones para restablecer tu
                        contraseña.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button type="button" variant="outline" className="text-sm" onClick={() => setIsSubmitted(false)}>
                        Enviar a otro correo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-6">
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
                      className={`pl-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#00334a] hover:bg-[#004a6b] text-white py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
