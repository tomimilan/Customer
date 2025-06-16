"use client"
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
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
            {/* Títulos - Versión móvil y desktop */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
              <p className="mt-2 text-gray-600">Inicia sesión para acceder a tu cuenta</p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
