"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  TruckIcon,
  BuildingIcon,
  UsersIcon,
  PhoneIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Esquemas de validación por paso
const step1Schema = z.object({
  razonSocial: z.string().min(1, "Razón Social es requerida"),
  cuit: z.string().min(11, "CUIT debe tener 11 dígitos").max(11, "CUIT debe tener 11 dígitos"),
  direccion: z.string().min(1, "Dirección es requerida"),
  pais: z.string().min(1, "País es requerido"),
})

const step2Schema = z.object({
  contactoLogisticaNombre: z.string().min(1, "Nombre del contacto de logística es requerido"),
  contactoLogisticaCelular: z.string().min(1, "Celular del contacto de logística es requerido"),
})

const step3Schema = z.object({
  contactoAdminNombre: z.string().min(1, "Nombre del contacto administrativo es requerido"),
  contactoAdminCelular: z.string().min(1, "Celular del contacto administrativo es requerido"),
})

// Esquema completo para el submit final
const transportCompanySchema = z.object({
  razonSocial: z.string().min(1, "Razón Social es requerida"),
  cuit: z.string().min(11, "CUIT debe tener 11 dígitos").max(11, "CUIT debe tener 11 dígitos"),
  direccion: z.string().min(1, "Dirección es requerida"),
  pais: z.string().min(1, "País es requerido"),
  contactoLogisticaNombre: z.string().min(1, "Nombre del contacto de logística es requerido"),
  contactoLogisticaCelular: z.string().min(1, "Celular del contacto de logística es requerido"),
  contactoAdminNombre: z.string().min(1, "Nombre del contacto administrativo es requerido"),
  contactoAdminCelular: z.string().min(1, "Celular del contacto administrativo es requerido"),
})

interface Transport {
  id: string
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  choferes: number
  vehiculos: number
  estado: string
}

interface EditTransportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transport: Transport | null
}

export function EditTransportModal({ open, onOpenChange, transport }: EditTransportModalProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [vencimientoPermiso, setVencimientoPermiso] = useState<Date>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})

  const countries = [
    "Argentina",
    "Brasil",
    "Chile",
    "Uruguay",
    "Paraguay",
    "Bolivia",
    "Colombia",
    "Perú",
    "Ecuador",
    "Venezuela",
    "México",
    "Estados Unidos",
  ]

  const provinces = {
    Argentina: [
      "Buenos Aires",
      "Córdoba",
      "Santa Fe",
      "Mendoza",
      "Tucumán",
      "Entre Ríos",
      "Salta",
      "Misiones",
      "Chaco",
      "Corrientes",
    ],
    Brasil: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
    Chile: ["Región Metropolitana", "Valparaíso", "Biobío", "Araucanía", "Los Lagos", "Antofagasta"],
    Uruguay: ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú", "Rivera"],
  }

  // Reset form when modal opens/closes or transport changes
  useEffect(() => {
    if (open && transport) {
      setCurrentStep(1)
      setErrors({})
      setCompletedSteps([])
      setFormData({})
      // Pre-poblar fecha si existe
      setVencimientoPermiso(new Date())
    } else if (!open) {
      setCurrentStep(1)
      setErrors({})
      setCompletedSteps([])
      setFormData({})
      setVencimientoPermiso(undefined)
    }
  }, [open, transport])

  const validateCurrentStep = () => {
    const form = document.querySelector('form') as HTMLFormElement
    if (!form) return false

    const formDataObj = new FormData(form)
    const data = Object.fromEntries(formDataObj.entries())
    
    // Actualizar formData con los datos actuales
    setFormData(prevData => ({ ...prevData, ...data }))

    let schema
    let validationErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        schema = step1Schema
        break
      case 2:
        schema = step2Schema
        break
      case 3:
        schema = step3Schema
        break
      case 4:
        // Paso 4 es opcional, no requiere validación
        return true
      default:
        return false
    }

    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message
          }
        })
      }
      setErrors(validationErrors)
      return false
    }
  }

  // Función para validar que solo se ingresen números en los campos de celular
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Permitir solo números, espacios, guiones y el símbolo +
    const phoneRegex = /^[+\d\s-]*$/
    
    if (!phoneRegex.test(value)) {
      // Si no cumple con el patrón, revertir al valor anterior
      const lastValidValue = value.slice(0, -1)
      e.target.value = lastValidValue
    }
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName]
  }

  const getFieldClassName = (fieldName: string, baseClassName = "") => {
    return errors[fieldName] ? `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500` : baseClassName
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrors({})

    const form = document.querySelector('form') as HTMLFormElement
    if (!form) return

    const formDataObj = new FormData(form)
    const data = Object.fromEntries(formDataObj.entries())
    const finalData = { ...formData, ...data }

    // Validación final con esquema completo
    const validationErrors: Record<string, string> = {}

    try {
      transportCompanySchema.parse(finalData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message
          }
        })
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mostrar toast de éxito con check verde
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </div>
            Empresa actualizada exitosamente
          </div>
        ),
      })

      onOpenChange(false)
    } catch (error) {
      // Mostrar toast de error
      toast({
        title: "Error al actualizar la empresa. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      // Marcar el paso actual como completado
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Limpiar errores al retroceder
      setErrors({})
    }
  }

  const goToStep = (step: number) => {
    // Solo permitir ir a pasos anteriores o al siguiente paso si el actual está validado
    if (step <= currentStep) {
      setCurrentStep(step)
      setErrors({})
    } else if (step === currentStep + 1 && validateCurrentStep()) {
      // Marcar el paso actual como completado
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(step)
    }
  }

  const isStepAccessible = (step: number) => {
    return step <= currentStep || completedSteps.includes(step - 1)
  }

  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step)
  }

  if (!transport) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Empresa de Transporte</DialogTitle>
          <DialogDescription>Modifique la información de la empresa {transport.nombre}</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Barra de progreso interactiva */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    isStepAccessible(step) 
                      ? "cursor-pointer hover:scale-105" 
                      : "cursor-not-allowed opacity-50"
                  } ${
                    currentStep === step ? "text-blue-600" : 
                    isStepCompleted(step) ? "text-green-600" :
                    isStepAccessible(step) ? "text-gray-600 hover:text-blue-500" : "text-gray-400"
                  }`}
                  style={{ width: "25%" }}
                  onClick={() => isStepAccessible(step) && goToStep(step)}
                >
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 transition-all duration-200
                ${
                  currentStep === step
                    ? "bg-blue-100 border-2 border-blue-600 shadow-md"
                    : isStepCompleted(step)
                      ? "bg-green-100 border-2 border-green-600"
                      : isStepAccessible(step)
                        ? "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                        : "bg-gray-50 border-2 border-gray-200"
                }`}
                  >
                    {isStepCompleted(step) ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs text-center transition-all duration-200 ${
                      currentStep === step ? "font-medium" : "hover:font-medium"
                    } hidden sm:block`}
                  >
                    {step === 1 && "Información del Transporte"}
                    {step === 2 && "Contacto Logística"}
                    {step === 3 && "Contacto Administración"}
                    {step === 4 && "Otros"}
                  </span>
                  <span
                    className={`text-xs text-center transition-all duration-200 ${
                      currentStep === step ? "font-medium" : "hover:font-medium"
                    } block sm:hidden`}
                  >
                    {step === 1 && "Info"}
                    {step === 2 && "Logística"}
                    {step === 3 && "Admin"}
                    {step === 4 && "Otros"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((completedSteps.length + (currentStep > completedSteps.length ? 1 : 0)) / 4) * 100}%` }}
              ></div>
            </div>

            {/* Mostrar errores de validación si los hay */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, complete todos los campos requeridos antes de continuar.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Paso 1: Información del Transporte */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BuildingIcon className="h-5 w-5 mr-2" />
                    Datos de la Empresa
                  </CardTitle>
                  <CardDescription>Información básica de la empresa de transporte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="razonSocial" className={errors.razonSocial ? "text-red-600" : ""}>
                        Razón Social *
                      </Label>
                      <Input
                        id="razonSocial"
                        name="razonSocial"
                        defaultValue={transport.nombre}
                        placeholder="Nombre de la empresa"
                        className={getFieldClassName("razonSocial")}
                        required
                      />
                      {errors.razonSocial && <p className="text-sm text-red-600 mt-1">{errors.razonSocial}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cuit" className={errors.cuit ? "text-red-600" : ""}>
                        CUIT *
                      </Label>
                      <Input
                        id="cuit"
                        name="cuit"
                        defaultValue="20123456789"
                        placeholder="Solo números sin guiones"
                        className={getFieldClassName("cuit")}
                        required
                      />
                      {errors.cuit && <p className="text-sm text-red-600 mt-1">{errors.cuit}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="direccion" className={errors.direccion ? "text-red-600" : ""}>
                        Dirección *
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        defaultValue={transport.direccion}
                        placeholder="Dirección completa"
                        className={getFieldClassName("direccion")}
                        required
                      />
                      {errors.direccion && <p className="text-sm text-red-600 mt-1">{errors.direccion}</p>}
                    </div>

                    <div>
                      <Label htmlFor="pais" className={errors.pais ? "text-red-600" : ""}>
                        País *
                      </Label>
                      <Select name="pais" defaultValue="Argentina" required>
                        <SelectTrigger className={getFieldClassName("pais")}>
                          <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.pais && <p className="text-sm text-red-600 mt-1">{errors.pais}</p>}
                    </div>

                    <div>
                      <Label htmlFor="provincia">Provincia</Label>
                      <Select name="provincia" defaultValue="Buenos Aires">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.Argentina.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input id="ciudad" name="ciudad" defaultValue="Buenos Aires" placeholder="Ciudad" />
                    </div>

                    <div>
                      <Label htmlFor="satelital">Empresa Satelital</Label>
                      <Input
                        id="satelital"
                        name="satelital"
                        defaultValue="Omnicomm Argentina"
                        placeholder="Nombre de la empresa satelital"
                      />
                    </div>

                    <div>
                      <Label htmlFor="paut">PAUT</Label>
                      <Input
                        id="paut"
                        name="paut"
                        defaultValue="PAUT123456"
                        placeholder="Padrón Único de Transportistas"
                      />
                    </div>

                    <div>
                      <Label htmlFor="permisoInternacional">Permiso Internacional</Label>
                      <Input
                        id="permisoInternacional"
                        name="permisoInternacional"
                        defaultValue="PI-2024-001"
                        placeholder="Número o descripción del permiso"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vencimientoPermiso">Vencimiento Permiso</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !vencimientoPermiso && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {vencimientoPermiso ? format(vencimientoPermiso, "dd/MM/yyyy") : "dd/mm/aaaa"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={vencimientoPermiso}
                            onSelect={setVencimientoPermiso}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Paso 2: Contacto Logística */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Contacto Logística
                  </CardTitle>
                  <CardDescription>Información del contacto de logística</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor="contactoLogisticaNombre"
                        className={errors.contactoLogisticaNombre ? "text-red-600" : ""}
                      >
                        Nombre *
                      </Label>
                      <Input
                        id="contactoLogisticaNombre"
                        name="contactoLogisticaNombre"
                        defaultValue={transport.contacto}
                        placeholder="Nombre del contacto"
                        className={getFieldClassName("contactoLogisticaNombre")}
                        required
                      />
                      {errors.contactoLogisticaNombre && (
                        <p className="text-sm text-red-600 mt-1">{errors.contactoLogisticaNombre}</p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="contactoLogisticaCelular"
                        className={errors.contactoLogisticaCelular ? "text-red-600" : ""}
                      >
                        Celular *
                      </Label>
                      <Input
                        id="contactoLogisticaCelular"
                        name="contactoLogisticaCelular"
                        defaultValue={transport.telefono}
                        placeholder="+54 9 11 1234-5678"
                        className={getFieldClassName("contactoLogisticaCelular")}
                        onChange={handlePhoneChange}
                        required
                      />
                      {errors.contactoLogisticaCelular && (
                        <p className="text-sm text-red-600 mt-1">{errors.contactoLogisticaCelular}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="contactoLogisticaEmail">Email</Label>
                      <Input
                        id="contactoLogisticaEmail"
                        name="contactoLogisticaEmail"
                        type="email"
                        defaultValue={transport.email}
                        placeholder="logistica@empresa.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Paso 3: Contacto Administración */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    Contacto Administración
                  </CardTitle>
                  <CardDescription>Información del contacto administrativo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contactoAdminNombre" className={errors.contactoAdminNombre ? "text-red-600" : ""}>
                        Nombre *
                      </Label>
                      <Input
                        id="contactoAdminNombre"
                        name="contactoAdminNombre"
                        defaultValue="María González"
                        placeholder="Nombre del contacto"
                        className={getFieldClassName("contactoAdminNombre")}
                        required
                      />
                      {errors.contactoAdminNombre && (
                        <p className="text-sm text-red-600 mt-1">{errors.contactoAdminNombre}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactoAdminCelular" className={errors.contactoAdminCelular ? "text-red-600" : ""}>
                        Celular *
                      </Label>
                      <Input
                        id="contactoAdminCelular"
                        name="contactoAdminCelular"
                        defaultValue="+54 11 9876-5432"
                        placeholder="+54 9 11 1234-5678"
                        className={getFieldClassName("contactoAdminCelular")}
                        onChange={handlePhoneChange}
                        required
                      />
                      {errors.contactoAdminCelular && (
                        <p className="text-sm text-red-600 mt-1">{errors.contactoAdminCelular}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="contactoAdminEmail">Email</Label>
                      <Input
                        id="contactoAdminEmail"
                        name="contactoAdminEmail"
                        type="email"
                        defaultValue="admin@transportesrapidos.com"
                        placeholder="admin@empresa.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Paso 4: Otros */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Información Adicional
                  </CardTitle>
                  <CardDescription>Observaciones y comentarios adicionales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      name="observaciones"
                      defaultValue="Empresa con amplia experiencia en transporte de cargas. Cuenta con flota propia y personal capacitado."
                      placeholder="Observaciones adicionales sobre la empresa..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex items-center">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} className="flex items-center">
                  Siguiente
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Actualizar Empresa
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
