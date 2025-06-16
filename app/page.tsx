import Link from "next/link"
import { Building2, Globe, ArrowRight } from "lucide-react"

export default function SystemSelection() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden">
      {/* Lado izquierdo - Igual que en el login */}
      <div className="hidden w-full bg-[#00334a] md:flex md:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Logo centrado con tamaño original */}
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
              <div className="h-px flex-grow bg-[#F9F8F6]/30"></div>
              <div className="mx-4 h-2 w-2 rounded-full bg-[#F9F8F6]/60"></div>
              <div className="h-px flex-grow bg-[#F9F8F6]/30"></div>
            </div>

            {/* Descripción original */}
            <p className="text-[#F9F8F6]/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
              Soluciones integrales para optimizar sus operaciones logísticas con tecnología de vanguardia
            </p>
          </div>
        </div>
      </div>

      {/* Lado derecho optimizado */}
      <div className="flex w-full flex-col md:w-1/2 h-full">
        {/* Header móvil */}
        <div className="flex flex-col items-center bg-[#00334a] py-4 md:hidden">
          <img
            src="/aconcarga-logo.png"
            alt="Aconcarga Logo"
            className="h-16 w-auto mb-2"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h1 className="text-xl font-bold text-[#F9F8F6]">Aconcarga</h1>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-grow items-center justify-center bg-[#F9F8F6] p-6">
          <div className="w-full max-w-lg">
            {/* Título de selección */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#00334a] mb-2">Elige tu experiencia</h2>
              <p className="text-[#00334a]/70 text-base">Selecciona el sistema que mejor se adapte a tus necesidades</p>
            </div>

            {/* Cards de selección */}
            <div className="space-y-4">
              {/* Sistema Enterprise */}
              <Link href="/empresa/login" className="group block">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00334a] to-[#004a6b] p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#F9F8F6]/20 rounded-lg">
                          <Building2 className="h-6 w-6 text-[#F9F8F6]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#F9F8F6]">Enterprise</h3>
                          <p className="text-[#F9F8F6]/80 text-sm">Para empresas</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#F9F8F6] group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <p className="text-[#F9F8F6]/90 text-sm leading-relaxed">
                      Acceso completo con funcionalidades avanzadas, gestión de usuarios y soporte prioritario.
                    </p>
                  </div>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F9F8F6]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>

              {/* Sistema Abierto */}
              <Link href="/sistema-abierto/login" className="group block">
                <div className="relative overflow-hidden rounded-xl border-2 border-[#00334a]/20 bg-[#F9F8F6] p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#00334a]/40">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#00334a]/10 rounded-lg">
                          <Globe className="h-6 w-6 text-[#00334a]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#00334a]">Sistema Abierto</h3>
                          <p className="text-[#00334a]/70 text-sm">Acceso público</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#00334a] group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <p className="text-[#00334a]/80 text-sm leading-relaxed">
                      Funcionalidades básicas de seguimiento y gestión logística. Perfecto para comenzar.
                    </p>
                  </div>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00334a]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-[#00334a]/60 text-xs">¿Tienes dudas? Nuestro equipo está aquí para ayudarte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
