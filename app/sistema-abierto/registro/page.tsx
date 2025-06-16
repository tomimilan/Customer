"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Truck,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  CreditCard,
  Mail,
  Clock,
  X,
  FileText,
  ImageIcon,
  RotateCcw,
  Phone,
  Lock,
} from "lucide-react"

type UserType = "usuario" | "chofer"
type ChoferStep = 1 | 2

interface DocumentUpload {
  name: string
  file: File | null
  uploaded: boolean
  required: boolean
  preview?: string
}

export default function RegistroPage() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [choferStep, setChoferStep] = useState<ChoferStep>(1)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  })

  // Documentos requeridos para chofer en el paso 2
  const [choferDocuments, setChoferDocuments] = useState<DocumentUpload[]>([
    { name: "DNI - Lado frontal", file: null, uploaded: false, required: true },
    { name: "DNI - Lado posterior", file: null, uploaded: false, required: true },
    { name: "Licencia de conducir - Lado frontal", file: null, uploaded: false, required: true },
    { name: "Licencia de conducir - Lado posterior", file: null, uploaded: false, required: true },
  ])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<{ index: number; preview: string } | null>(null)
  const [termsError, setTermsError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleChoferFileUpload = (docIndex: number, file: File) => {
    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert("Por favor, sube solo archivos JPG, PNG o PDF")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es muy grande. Máximo 5MB permitido.")
      return
    }

    // Crear preview para imágenes y PDFs
    let preview = ""
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file)
    } else if (file.type === "application/pdf") {
      preview = URL.createObjectURL(file)
    }

    setChoferDocuments((prev) =>
      prev.map((doc, index) => (index === docIndex ? { ...doc, file, uploaded: true, preview } : doc)),
    )
  }

  const handleRemoveDocument = (docIndex: number) => {
    setChoferDocuments((prev) =>
      prev.map((doc, index) => {
        if (index === docIndex) {
          // Limpiar URL del preview si existe
          if (doc.preview) {
            URL.revokeObjectURL(doc.preview)
          }
          return { ...doc, file: null, uploaded: false, preview: undefined }
        }
        return doc
      }),
    )
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validación de nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
      isValid = false
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
      isValid = false
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios"
      isValid = false
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
      isValid = false
    } else if (formData.email.toLowerCase() === "admin@aconcarga.com") {
      newErrors.email = "Este correo electrónico ya está registrado en el sistema"
      isValid = false
    }

    // Validación de teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
      isValid = false
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telefono.trim())) {
      newErrors.telefono = "El teléfono solo puede contener números, +, -, espacios y paréntesis"
      isValid = false
    } else if (formData.telefono.trim().length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos"
      isValid = false
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      isValid = false
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      isValid = false
    }

    // Validación de confirmación de contraseña
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

  const validateChoferDocuments = () => {
    return choferDocuments.every((doc) => doc.uploaded || !doc.required)
  }

  const getUploadedDocuments = () => {
    return choferDocuments.filter((doc) => doc.uploaded).length
  }

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-600" />
    }
    return <ImageIcon className="h-4 w-4 text-blue-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userType === "usuario") {
      const isFormValid = validateForm()

      // Validar términos y condiciones
      if (!acceptTerms) {
        setTermsError("Debes aceptar los términos y condiciones para continuar")
      } else {
        setTermsError("")
      }

      if (!isFormValid || !acceptTerms) {
        return
      }

      setIsSubmitting(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setRegisteredEmail(formData.email)
        setShowConfirmation(true)
      } catch (error) {
        console.error("Error al registrar:", error)
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Para chofer, validar documentos en paso 2
    if (userType === "chofer" && choferStep === 2) {
      if (!validateChoferDocuments()) {
        alert("Por favor, sube todos los documentos requeridos")
        return
      }

      setIsSubmitting(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setRegisteredEmail(formData.email)
        setShowConfirmation(true)
      } catch (error) {
        console.error("Error al registrar:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Modal de preview
  const PreviewModal = () => {
    if (!previewDocument) return null

    const doc = choferDocuments[previewDocument.index]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
            <button onClick={() => setPreviewDocument(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            {doc.file?.type === "application/pdf" ? (
              <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-gray-50 rounded">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Vista previa de PDF no disponible</p>
                <p className="text-sm text-gray-500 mb-4">Archivo: {doc.file.name}</p>
                <Button
                  onClick={() => {
                    const url = URL.createObjectURL(doc.file!)
                    window.open(url, "_blank")
                  }}
                  className="bg-[#00334a] hover:bg-[#00334a]/90"
                >
                  Abrir PDF en nueva pestaña
                </Button>
              </div>
            ) : (
              <img
                src={previewDocument.preview || "/placeholder.svg"}
                alt={doc.name}
                className="max-w-full max-h-[60vh] object-contain mx-auto"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
            <Button
              onClick={() => {
                handleRemoveDocument(previewDocument.index)
                setPreviewDocument(null)
              }}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cambiar archivo
            </Button>
            <Button onClick={() => setPreviewDocument(null)}>Cerrar</Button>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de selección de tipo de usuario
  if (!userType && !showRequirements) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
              <div>
                <img
                  src="/aconcarga-logo.png"
                  alt="Aconcarga Logo"
                  className="h-80 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <div className="mb-8 flex items-center w-full">
                <div className="h-px flex-grow bg-white/30"></div>
                <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
                <div className="h-px flex-grow bg-white/30"></div>
              </div>

              <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
                Únete a nuestra plataforma como usuario o chofer profesional
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex flex-col items-center bg-[#002639] md:hidden">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-48 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-grow items-center justify-center bg-white p-8">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-[#00334a]">Tipo de Registro</h2>
                <p className="mt-2 text-gray-600">Selecciona cómo quieres registrarte</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setUserType("usuario")}
                  className="w-full p-6 border-2 border-[#00334a]/20 rounded-lg hover:border-[#00334a] hover:bg-[#00334a]/5 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#00334a] rounded-full group-hover:scale-110 transition-transform">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-[#00334a]">Usuario</h3>
                      <p className="text-gray-600">Registro rápido para solicitar servicios</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowRequirements(true)}
                  className="w-full p-6 border-2 border-[#00334a]/20 rounded-lg hover:border-[#00334a] hover:bg-[#00334a]/5 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#00334a] rounded-full group-hover:scale-110 transition-transform">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-[#00334a]">Chofer</h3>
                      <p className="text-gray-600">Registro profesional en 2 pasos</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/sistema-abierto/login" className="font-medium text-[#00334a] hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de requisitos para chofer
  if (showRequirements && !userType) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
              <div>
                <img
                  src="/aconcarga-logo.png"
                  alt="Aconcarga Logo"
                  className="h-80 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <div className="mb-8 flex items-center w-full">
                <div className="h-px flex-grow bg-white/30"></div>
                <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
                <div className="h-px flex-grow bg-white/30"></div>
              </div>

              <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
                Registro profesional en 2 pasos simples
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex flex-col items-center bg-[#002639] md:hidden">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-48 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-grow items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8">
            <div className="w-full max-w-lg">
              <div className="mb-8">
                <button
                  onClick={() => setShowRequirements(false)}
                  className="group flex items-center text-[#00334a] hover:text-[#002639] text-sm mb-6 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  Volver a selección
                </button>
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-[#00334a] rounded-2xl">
                      <Clipboard className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#00334a] mb-2">Registro en 2 Pasos</h2>
                      <p className="text-gray-600">Proceso simple y rápido para choferes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pasos del proceso */}
              <div className="space-y-4 mb-8">
                <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#00334a]/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00334a] p-3 rounded-lg text-white group-hover:scale-110 transition-transform flex items-center justify-center min-w-[48px]">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#00334a] transition-colors">
                        Datos Personales
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00334a] rounded-full"></div>
                          <span className="text-sm text-gray-600">Nombre completo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00334a] rounded-full"></div>
                          <span className="text-sm text-gray-600">Correo electrónico</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00334a] rounded-full"></div>
                          <span className="text-sm text-gray-600">Teléfono y contraseña</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#00334a]/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00334a] p-3 rounded-lg text-white group-hover:scale-110 transition-transform flex items-center justify-center min-w-[48px]">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#00334a] transition-colors">
                        Documentos Básicos
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00334a] rounded-full"></div>
                          <span className="text-sm text-gray-600">DNI (ambos lados)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00334a] rounded-full"></div>
                          <span className="text-sm text-gray-600">Licencia de conducir (ambos lados)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proceso después del registro */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Después del registro</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">✓</span>
                        <span>Verificación de correo electrónico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">✓</span>
                        <span>Revisión de documentos (24-48 horas)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">✓</span>
                        <span>Habilitación de cuenta</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">✓</span>
                        <span>Completar documentos adicionales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setUserType("chofer")
                    setShowRequirements(false)
                  }}
                  className="w-full bg-gradient-to-r from-[#00334a] to-[#002639] hover:from-[#002639] hover:to-[#001a24] text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Comenzar registro</span>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowRequirements(false)}
                  variant="outline"
                  className="w-full border-2 border-gray-200 text-gray-700 hover:border-[#00334a] hover:text-[#00334a] hover:bg-[#00334a]/5 py-4 px-6 rounded-xl font-medium transition-all duration-300"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Volver a selección</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de confirmación de registro
  if (showConfirmation) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
              <div>
                <img
                  src="/aconcarga-logo.png"
                  alt="Aconcarga Logo"
                  className="h-80 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <div className="mb-8 flex items-center w-full">
                <div className="h-px flex-grow bg-white/30"></div>
                <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
                <div className="h-px flex-grow bg-white/30"></div>
              </div>

              <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
                {userType === "chofer"
                  ? "¡Registro enviado! Revisa tu correo y espera la habilitación"
                  : "¡Registro exitoso! Revisa tu correo electrónico para continuar"}
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex flex-col items-center bg-[#002639] md:hidden">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-48 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-grow items-center justify-center bg-white p-8">
            <div className="w-full max-w-md text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {userType === "chofer" ? (
                    <Clock className="h-10 w-10 text-orange-600" />
                  ) : (
                    <Check className="h-10 w-10 text-green-600" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-[#00334a] mb-4">
                  {userType === "chofer" ? "¡Registro Enviado!" : "¡Registro Exitoso!"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {userType === "chofer"
                    ? "Tu solicitud de registro como chofer ha sido enviada. Hemos enviado un correo de verificación a:"
                    : "Tu cuenta ha sido creada correctamente. Hemos enviado un correo de verificación a:"}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="font-semibold text-[#00334a] text-lg">{registeredEmail}</p>
                </div>
              </div>

              {userType === "chofer" ? (
                // Instrucciones para chofer
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Proceso de habilitación:
                    </h3>
                    <ol className="text-left text-orange-800 space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">1.</span>
                        <span>Verifica tu correo electrónico haciendo clic en el enlace</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">2.</span>
                        <span>Nuestro equipo revisará tus documentos (24-48 horas)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">3.</span>
                        <span>Recibirás un correo cuando tu cuenta sea habilitada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">4.</span>
                        <span>Podrás completar el resto de documentos en el sistema</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold text-blue-900 mb-1">Importante</h4>
                        <p className="text-sm text-blue-800">
                          Revisa tu bandeja de entrada y carpeta de spam. Te contactaremos si necesitamos información
                          adicional.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Instrucciones para usuario normal
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-3">Instrucciones para activar tu cuenta:</h3>
                  <ol className="text-left text-blue-800 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      <span>Revisa tu bandeja de entrada y la carpeta de spam</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      <span>Busca el correo de "Aconcarga - Verificación de cuenta"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      <span>Haz clic en el enlace de verificación</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">4.</span>
                      <span>Una vez verificado, podrás iniciar sesión</span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={() => (window.location.href = "/sistema-abierto/login")}
                  className="w-full bg-[#00334a] hover:bg-[#00334a]/90 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Ir a Iniciar Sesión
                </Button>

                <button
                  onClick={() => {
                    setShowConfirmation(false)
                    setUserType(null)
                    setChoferStep(1)
                    setFormData({
                      nombre: "",
                      email: "",
                      telefono: "",
                      password: "",
                      confirmPassword: "",
                    })
                    setErrors({
                      nombre: "",
                      email: "",
                      telefono: "",
                      password: "",
                      confirmPassword: "",
                    })
                    setChoferDocuments([
                      { name: "DNI - Lado frontal", file: null, uploaded: false, required: true },
                      { name: "DNI - Lado posterior", file: null, uploaded: false, required: true },
                      { name: "Licencia de conducir - Lado frontal", file: null, uploaded: false, required: true },
                      { name: "Licencia de conducir - Lado posterior", file: null, uploaded: false, required: true },
                    ])
                    setAcceptTerms(false)
                  }}
                  className="w-full text-[#00334a] hover:underline text-sm py-2"
                >
                  Registrar otra cuenta
                </button>
              </div>

              <div className="mt-8 text-xs text-gray-500">
                <p>¿No recibiste el correo? Revisa tu carpeta de spam o contacta a soporte.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Registro de usuario normal
  if (userType === "usuario") {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
              <div>
                <img
                  src="/aconcarga-logo.png"
                  alt="Aconcarga Logo"
                  className="h-80 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <div className="mb-8 flex items-center w-full">
                <div className="h-px flex-grow bg-white/30"></div>
                <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
                <div className="h-px flex-grow bg-white/30"></div>
              </div>

              <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
                Registro rápido para acceder a servicios de transporte
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex flex-col items-center bg-[#002639] md:hidden">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-48 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-grow items-center justify-center bg-white p-8">
            <div className="w-full max-w-md">
              <div className="mb-6">
                <button onClick={() => setUserType(null)} className="text-[#00334a] hover:underline text-sm mb-4">
                  ← Cambiar tipo de registro
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#00334a]">Registro Usuario</h2>
                  <p className="mt-2 text-gray-600">Completa el formulario para registrarte</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Ingresa tu nombre completo"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`pl-10 ${errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {errors.nombre && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="Ingresa tu número de teléfono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`pl-10 ${errors.telefono ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {errors.telefono && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.telefono}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crea una contraseña segura"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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

                <div className="flex items-start space-x-3 mt-4">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked)
                      if (e.target.checked) {
                        setTermsError("")
                      }
                    }}
                    className="mt-1 h-4 w-4 text-[#00334a] border-gray-300 rounded focus:ring-[#00334a]"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                    Acepto los{" "}
                    <Link href="/sistema-abierto/terminos" className="text-[#00334a] hover:underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/sistema-abierto/privacidad" className="text-[#00334a] hover:underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>
                {termsError && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{termsError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00334a] hover:bg-[#00334a]/90 text-white py-2 px-4 rounded-md transition-colors mt-6"
                >
                  {isSubmitting ? "Procesando..." : "Registrarse como Usuario"}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/sistema-abierto/login" className="font-medium text-[#00334a] hover:underline">
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

  // Registro de chofer en 2 pasos
  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="hidden w-full bg-[#002639] md:flex md:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
              <div>
                <img
                  src="/aconcarga-logo.png"
                  alt="Aconcarga Logo"
                  className="h-80 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <div className="mb-8 flex items-center w-full">
                <div className="h-px flex-grow bg-white/30"></div>
                <div className="mx-4 h-2 w-2 rounded-full bg-white/60"></div>
                <div className="h-px flex-grow bg-white/30"></div>
              </div>

              <p className="text-white/80 text-center text-lg font-light leading-relaxed mb-12 max-w-md">
                Registro profesional de chofer en 2 pasos simples
              </p>

              {/* Progreso */}
              <div className="w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60 text-sm">Progreso</span>
                  <span className="text-white text-sm font-medium">Paso {choferStep} de 2</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(choferStep / 2) * 100}%` }}
                  ></div>
                </div>
                {choferStep === 2 && (
                  <div className="mt-2 text-white/60 text-xs">Documentos: {getUploadedDocuments()}/4</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex flex-col items-center bg-[#002639] md:hidden">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-48 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-grow items-start justify-center bg-white p-8 overflow-y-auto">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="mb-6">
                <button onClick={() => setUserType(null)} className="text-[#00334a] hover:underline text-sm mb-4">
                  ← Cambiar tipo de registro
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#00334a]">Registro Chofer</h2>
                  <p className="mt-1 text-gray-600 text-sm">
                    {choferStep === 1 ? "Datos personales" : "Documentos básicos"}
                  </p>
                </div>
              </div>

              {/* Paso 1: Datos personales */}
              {choferStep === 1 && (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`pl-10 ${errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.nombre && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{errors.nombre}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        placeholder="Ingresa tu número de teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`pl-10 ${errors.telefono ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.telefono && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{errors.telefono}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crea una contraseña segura"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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

                  <div className="flex items-start space-x-3 mt-4">
                    <input
                      type="checkbox"
                      id="acceptTermsChofer"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked)
                        if (e.target.checked) {
                          setTermsError("")
                        }
                      }}
                      className="mt-1 h-4 w-4 text-[#00334a] border-gray-300 rounded focus:ring-[#00334a]"
                    />
                    <label htmlFor="acceptTermsChofer" className="text-sm text-gray-600">
                      Acepto los{" "}
                      <Link href="/sistema-abierto/terminos" className="text-[#00334a] hover:underline">
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/sistema-abierto/privacidad" className="text-[#00334a] hover:underline">
                        política de privacidad
                      </Link>
                    </label>
                  </div>
                  {termsError && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{termsError}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      const isFormValid = validateForm()

                      if (!acceptTerms) {
                        setTermsError("Debes aceptar los términos y condiciones para continuar")
                      } else {
                        setTermsError("")
                      }

                      if (isFormValid && acceptTerms) {
                        setChoferStep(2)
                      }
                    }}
                    className="w-full bg-[#00334a] hover:bg-[#00334a]/90 text-white py-2 px-4 rounded-md transition-colors mt-6"
                  >
                    Continuar a documentos
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              )}

              {/* Paso 2: Documentos */}
              {choferStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#00334a] mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Documentos Requeridos
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Sube las fotos de tus documentos. Asegúrate de que sean claras y legibles.
                    </p>

                    <div className="space-y-4">
                      {choferDocuments.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <span className="text-xs text-red-500">* Requerido</span>
                            </div>
                          </div>

                          {doc.uploaded && doc.file ? (
                            // Documento subido - mostrar preview
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  {getFileIcon(doc.file)}
                                  <div>
                                    <p className="text-sm font-medium text-green-800">{doc.file.name}</p>
                                    <p className="text-xs text-green-600">{formatFileSize(doc.file.size)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Check className="h-4 w-4 text-green-600" />
                                  <span className="text-xs text-green-600">Subido</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    if (doc.file?.type === "application/pdf") {
                                      // Para PDFs, abrir directamente en nueva pestaña
                                      const url = URL.createObjectURL(doc.file)
                                      window.open(url, "_blank")
                                    } else if (doc.preview) {
                                      // Para imágenes, mostrar modal de preview
                                      setPreviewDocument({ index, preview: doc.preview })
                                    }
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver
                                </Button>
                                <Button
                                  onClick={() => handleRemoveDocument(index)}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Cambiar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Sin documento - mostrar botón de subida
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleChoferFileUpload(index, file)
                                }}
                              />
                              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00334a] hover:bg-[#00334a]/5 transition-all">
                                <div className="text-center">
                                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Haz clic para subir archivo</p>
                                  <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF (máx. 5MB)</p>
                                </div>
                              </div>
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !validateChoferDocuments()}
                      className="w-full bg-[#00334a] hover:bg-[#00334a]/90 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Enviando registro..." : "Enviar Solicitud de Registro"}
                    </Button>
                  </form>

                  {/* Navegación */}
                  <div className="flex justify-between pt-4">
                    <Button onClick={() => setChoferStep(1)} variant="outline" className="flex items-center">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                  </div>
                </div>
              )}

              {/* Enlace a login */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/sistema-abierto/login" className="font-medium text-[#00334a] hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PreviewModal />
    </>
  )
}
