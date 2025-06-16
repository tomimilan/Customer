"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
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
  razonSocial: z.string().min(1, "La razón social es requerida"),
  cuit: z.string().min(11, "El CUIT debe tener 11 dígitos").max(11, "El CUIT debe tener 11 dígitos"),
  direccion: z.string().min(1, "La dirección es requerida"),
  pais: z.string().min(1, "El país es requerido"),
  provincia: z.string().min(1, "La provincia es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
})

const step2Schema = z.object({
  contactoLogisticaNombre: z.string().min(1, "El nombre del contacto de logística es requerido"),
  contactoLogisticaCelular: z.string().min(1, "El celular del contacto de logística es requerido"),
  contactoLogisticaEmail: z.string().email("El email de logística no es válido").optional().or(z.literal("")),
})

const step3Schema = z.object({
  contactoAdminNombre: z.string().min(1, "El nombre del contacto administrativo es requerido"),
  contactoAdminCelular: z.string().min(1, "El celular del contacto administrativo es requerido"),
  contactoAdminEmail: z.string().email("El email administrativo no es válido").optional().or(z.literal("")),
})

// Esquema completo para el submit final
const transportCompanySchema = z.object({
  razonSocial: z.string().min(1, "Razón Social es requerida"),
  cuit: z.string().min(11, "CUIT debe tener 11 dígitos").max(11, "CUIT debe tener 11 dígitos"),
  direccion: z.string().min(1, "Dirección es requerida"),
  pais: z.string().min(1, "País es requerido"),
  contactoLogisticaNombre: z.string().min(1, "Nombre del contacto de logística es requerido"),
  contactoLogisticaCelular: z.string().min(1, "Celular del contacto de logística es requerido"),
  contactoLogisticaEmail: z.string().email("El email de logística no es válido").optional().or(z.literal("")),
  contactoAdminNombre: z.string().min(1, "Nombre del contacto administrativo es requerido"),
  contactoAdminCelular: z.string().min(1, "Celular del contacto administrativo es requerido"),
  contactoAdminEmail: z.string().email("El email administrativo no es válido").optional().or(z.literal("")),
})

export type TransportCompanyFormProps = {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TransportCompanyForm({ onSubmit, onCancel }: TransportCompanyFormProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [vencimientoPermiso, setVencimientoPermiso] = useState<Date>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")

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
  ] as const

  type Country = typeof countries[number]

  type ProvinceMap = Record<Country, string[]>

  const provinces: ProvinceMap = {
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
    Paraguay: [],
    Bolivia: [],
    Colombia: [],
    Perú: [],
    Ecuador: [],
    Venezuela: [],
    México: [],
    "Estados Unidos": [],
  }

  type Province = string
  type CityMap = Record<Province, string[]>

  const cities: CityMap = {
    "Buenos Aires": ["Ciudad Autónoma de Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes"],
    "Córdoba": ["Córdoba", "Río Cuarto", "Villa María", "San Francisco", "Villa Carlos Paz"],
    "Santa Fe": ["Santa Fe", "Rosario", "Rafaela", "Venado Tuerto", "Santo Tomé"],
    "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo"],
    "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Aguilares", "Banda del Río Salí"],
    "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay", "Victoria"],
    "Salta": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Metán", "Cafayate"],
    "Misiones": ["Posadas", "Oberá", "Eldorado", "Puerto Iguazú", "San Vicente"],
    "Chaco": ["Resistencia", "Barranqueras", "Villa Ángela", "Presidencia Roque Sáenz Peña", "Charata"],
    "Corrientes": ["Corrientes", "Goya", "Mercedes", "Curuzú Cuatiá", "Paso de los Libres"],
    "São Paulo": ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
    "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
    "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
    "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
    "Biobío": ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel"],
    "Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"],
    "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal"],
    "Montevideo": ["Montevideo", "Punta del Este", "Piriápolis", "Atlántida", "Las Piedras"],
    "Canelones": ["Canelones", "Santa Lucía", "Las Piedras", "Pando", "Progreso"],
    "Maldonado": ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar"],
    "Salto": ["Salto", "Paysandú", "Artigas", "Rivera", "Tacuarembó"],
    "Paysandú": ["Paysandú", "Salto", "Artigas", "Rivera", "Tacuarembó"],
    "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Lapuente"],
  }

  // Función para actualizar el estado del formulario
  const updateFormData = (data: Record<string, any>) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...data }
      return updatedData
    })
  }

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const validateCurrentStep = () => {
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
      schema.parse(formData)
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrors({})

    // Validación final con esquema completo
    const validationErrors: Record<string, string> = {}

    try {
      transportCompanySchema.parse(formData)
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
      await onSubmit({
        ...formData,
        vencimientoPermiso,
      })
      
      // Mostrar toast de éxito
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </div>
            Empresa creada exitosamente
          </div>
        ),
      })
    } catch (error) {
      console.error("Error al crear empresa:", error)
      
      // Mostrar toast de error
      toast({
        title: "Error al crear la empresa. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName]
  }

  const getFieldClassName = (fieldName: string, baseClassName = "") => {
    return errors[fieldName] ? `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500` : baseClassName
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

  // Función para validar que solo se ingresen números en los campos de celular
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permitir solo números, espacios, guiones y el símbolo +
    const phoneRegex = /^[+\d\s-]*$/;
    if (phoneRegex.test(value)) {
      updateFormData({ [name]: value });
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    setSelectedProvince("")
    updateFormData({ 
      pais: value, 
      provincia: "", 
      ciudad: "" 
    })
  }

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    updateFormData({ 
      provincia: value, 
      ciudad: "" 
    })
  }

  const handleCityChange = (value: string) => {
    updateFormData({ ciudad: value })
  }

  return (
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
                  currentStep === step ? "font-medium" : isStepAccessible(step) ? "hover:font-medium" : ""
                } hidden sm:block`}
              >
                {step === 1 && "Información del Transporte"}
                {step === 2 && "Contacto Logística"}
                {step === 3 && "Contacto Administración"}
                {step === 4 && "Otros"}
              </span>
              {/* Versión móvil del texto */}
              <span
                className={`text-xs text-center transition-all duration-200 ${
                  currentStep === step ? "font-medium" : isStepAccessible(step) ? "hover:font-medium" : ""
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
                    placeholder="Nombre de la empresa"
                    className={getFieldClassName("razonSocial")}
                    value={formData.razonSocial || ""}
                    onChange={handleInputChange}
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
                    placeholder="Solo números sin guiones"
                    className={getFieldClassName("cuit")}
                    value={formData.cuit || ""}
                    onChange={handleInputChange}
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
                    placeholder="Dirección completa"
                    className={getFieldClassName("direccion")}
                    value={formData.direccion || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.direccion && <p className="text-sm text-red-600 mt-1">{errors.direccion}</p>}
                </div>

                <div>
                  <Label htmlFor="pais" className={errors.pais ? "text-red-600" : ""}>
                    País *
                  </Label>
                  <Select
                    value={formData.pais || ""}
                    onValueChange={handleCountryChange}
                  >
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
                  <Label htmlFor="provincia" className={errors.provincia ? "text-red-600" : ""}>
                    Provincia *
                  </Label>
                  <Select
                    value={formData.provincia || ""}
                    onValueChange={handleProvinceChange}
                    disabled={!formData.pais}
                  >
                    <SelectTrigger className={getFieldClassName("provincia")}>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.pais && provinces[formData.pais as Country]?.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provincia && <p className="text-sm text-red-600 mt-1">{errors.provincia}</p>}
                </div>

                <div>
                  <Label htmlFor="ciudad" className={errors.ciudad ? "text-red-600" : ""}>
                    Ciudad *
                  </Label>
                  <Select
                    value={formData.ciudad || ""}
                    onValueChange={handleCityChange}
                    disabled={!formData.provincia}
                  >
                    <SelectTrigger className={getFieldClassName("ciudad")}>
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.provincia && cities[formData.provincia]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ciudad && <p className="text-sm text-red-600 mt-1">{errors.ciudad}</p>}
                </div>

                <div>
                  <Label htmlFor="satelital">Empresa Satelital</Label>
                  <Input id="satelital" name="satelital" placeholder="Nombre de la empresa satelital" value={formData.satelital || ""} onChange={handleInputChange} />
                </div>

                <div>
                  <Label htmlFor="paut">PAUT</Label>
                  <Input id="paut" name="paut" placeholder="Padrón Único de Transportistas" value={formData.paut || ""} onChange={handleInputChange} />
                </div>

                <div>
                  <Label htmlFor="permisoInternacional">Permiso Internacional</Label>
                  <Input
                    id="permisoInternacional"
                    name="permisoInternacional"
                    placeholder="Número o descripción del permiso"
                    value={formData.permisoInternacional || ""}
                    onChange={handleInputChange}
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
                    placeholder="Nombre del contacto"
                    className={getFieldClassName("contactoLogisticaNombre")}
                    value={formData.contactoLogisticaNombre || ""}
                    onChange={handleInputChange}
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
                    placeholder="+54 9 11 1234-5678"
                    className={getFieldClassName("contactoLogisticaCelular")}
                    value={formData.contactoLogisticaCelular || ""}
                    onChange={handlePhoneChange}
                    required
                  />
                  {errors.contactoLogisticaCelular && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactoLogisticaCelular}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactoLogisticaEmail">Email</Label>
                  <Input
                    id="contactoLogisticaEmail"
                    name="contactoLogisticaEmail"
                    type="email"
                    placeholder="logistica@empresa.com"
                    value={formData.contactoLogisticaEmail || ""}
                    onChange={handleInputChange}
                  />
                  {errors.contactoLogisticaEmail && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactoLogisticaEmail}</p>
                  )}
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
                    placeholder="Nombre del contacto"
                    className={getFieldClassName("contactoAdminNombre")}
                    value={formData.contactoAdminNombre || ""}
                    onChange={handleInputChange}
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
                    placeholder="+54 9 11 1234-5678" 
                    className={getFieldClassName("contactoAdminCelular")}
                    value={formData.contactoAdminCelular || ""}
                    onChange={handlePhoneChange}
                    required
                  />
                  {errors.contactoAdminCelular && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactoAdminCelular}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactoAdminEmail">Email</Label>
                  <Input
                    id="contactoAdminEmail"
                    name="contactoAdminEmail"
                    type="email"
                    placeholder="admin@empresa.com"
                    value={formData.contactoAdminEmail || ""}
                    onChange={handleInputChange}
                  />
                  {errors.contactoAdminEmail && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactoAdminEmail}</p>
                  )}
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
                  placeholder="Observaciones adicionales sobre la empresa..."
                  rows={4}
                  value={formData.observaciones || ""}
                  onChange={handleInputChange}
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
          <Button type="button" variant="outline" onClick={onCancel}>
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
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Crear Empresa
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
