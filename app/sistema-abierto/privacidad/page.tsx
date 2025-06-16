"use client"
import Link from "next/link"
import { ChevronLeft, Shield, Eye, Lock, Database, UserCheck } from "lucide-react"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/sistema-abierto/registro"
              className="group flex items-center text-[#00334a] hover:text-[#002639] text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Volver al registro
            </Link>

            <div className="flex items-center space-x-3">
              <img src="/aconcarga-logo.png" alt="Aconcarga Logo" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#002639] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center space-x-6">
            <div className="flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
              <p className="text-white/80 text-lg">Última actualización: Enero 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Introducción */}
          <section className="mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-lg">Compromiso con tu privacidad</h3>
                  <p className="text-blue-800 leading-relaxed">
                    En Aconcarga, respetamos y protegemos tu privacidad. Esta política explica cómo recopilamos, usamos
                    y protegemos tu información personal.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-[#00334a] mb-6">1. Información que Recopilamos</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-[#00334a] mb-4">1.1 Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <UserCheck className="h-6 w-6 text-[#00334a]" />
                      <h4 className="font-semibold text-[#00334a] text-lg">Datos de Registro</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Nombre completo</li>
                      <li>• Correo electrónico</li>
                      <li>• Número de teléfono</li>
                      <li>• Información de verificación</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Database className="h-6 w-6 text-[#00334a]" />
                      <h4 className="font-semibold text-[#00334a] text-lg">Datos de Uso</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Historial de servicios</li>
                      <li>• Ubicaciones de origen y destino</li>
                      <li>• Preferencias de usuario</li>
                      <li>• Calificaciones y comentarios</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-[#00334a] mb-4">1.2 Información Técnica</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Recopilamos automáticamente cierta información cuando usa nuestra plataforma, incluyendo: dirección
                  IP, tipo de dispositivo, sistema operativo, navegador web, y datos de ubicación (cuando esté
                  habilitado).
                </p>
              </div>
            </div>
          </section>

          {/* Uso de la Información */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#00334a] mb-6">2. Cómo Usamos tu Información</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-4 text-lg">Prestación de Servicios</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• Conectar usuarios con choferes</li>
                  <li>• Procesar pagos y transacciones</li>
                  <li>• Proporcionar soporte al cliente</li>
                  <li>• Mejorar la experiencia del usuario</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4 text-lg">Comunicación</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Enviar confirmaciones de servicio</li>
                  <li>• Notificaciones importantes</li>
                  <li>• Actualizaciones de la plataforma</li>
                  <li>• Ofertas y promociones (opcional)</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4 text-lg">Seguridad y Cumplimiento</h4>
                <ul className="space-y-2 text-purple-800">
                  <li>• Verificar identidad de usuarios</li>
                  <li>• Prevenir fraudes y actividades ilegales</li>
                  <li>• Cumplir con obligaciones legales</li>
                  <li>• Resolver disputas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#00334a] mb-6">4. Seguridad de los Datos</h2>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <Lock className="h-8 w-8 text-[#00334a]" />
                <h3 className="text-2xl font-semibold text-[#00334a]">Medidas de Protección</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Técnicas</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Encriptación SSL/TLS</li>
                    <li>• Firewalls avanzados</li>
                    <li>• Monitoreo 24/7</li>
                    <li>• Copias de seguridad regulares</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Administrativas</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Acceso limitado a datos</li>
                    <li>• Capacitación del personal</li>
                    <li>• Auditorías de seguridad</li>
                    <li>• Políticas de privacidad estrictas</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mt-6">
              Aunque implementamos medidas de seguridad robustas, ningún sistema es 100% seguro. Le recomendamos
              mantener segura su información de acceso.
            </p>
          </section>

          {/* Derechos del Usuario */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#00334a] mb-6">5. Tus Derechos</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-[#00334a] mb-3 text-lg">Acceso y Portabilidad</h4>
                <p className="text-gray-600">
                  Puedes solicitar una copia de tus datos personales en un formato estructurado y legible.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-[#00334a] mb-3 text-lg">Rectificación</h4>
                <p className="text-gray-600">
                  Puedes actualizar o corregir tu información personal en cualquier momento desde tu perfil.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-[#00334a] mb-3 text-lg">Eliminación</h4>
                <p className="text-gray-600">
                  Puedes solicitar la eliminación de tu cuenta y datos personales, sujeto a obligaciones legales.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-[#00334a] mb-3 text-lg">Oposición</h4>
                <p className="text-gray-600">
                  Puedes oponerte al procesamiento de tus datos para marketing directo en cualquier momento.
                </p>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-[#00334a] mb-6">11. Contacto</h2>

            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 text-lg">
                Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, puede contactarnos:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong className="text-[#00334a]">Oficial de Protección de Datos:</strong> privacy@aconcarga.com
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-[#00334a]">Teléfono:</strong> +593 (02) 123-4567
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong className="text-[#00334a]">Dirección:</strong> Quito, Ecuador
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-[#00334a]">Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500">© 2024 Aconcarga. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <Link href="/sistema-abierto/terminos" className="text-[#00334a] hover:underline">
                Términos y Condiciones
              </Link>
              <Link href="/sistema-abierto/registro" className="text-[#00334a] hover:underline">
                Volver al Registro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
