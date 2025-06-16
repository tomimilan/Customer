"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  TruckIcon,
  ShipIcon,
  PackageIcon,
  MapPinIcon,
  ClipboardIcon,
  UsersIcon,
  BarChartIcon,
  InfoIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ThermometerIcon,
  RulerIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Esquema de validación dinámico según tipo de carga
const createValidationSchema = (cargoType: string) => {
  const baseSchema: Record<string, z.ZodTypeAny> = {
    operacion: z.string().min(1, "Operación es requerida"),
    booking: z.string().min(1, "Booking/Referencia es requerido"),
    trader: z.string().min(1, "Trader es requerido"),
    commodity: z.string().min(1, "Commodity es requerido"),
    "cantidad-viajes": z.string().min(1, "Cantidad de viajes es requerida"),
    "tipo-carga": z.string().min(1, "Tipo de carga es requerido"),
    "lugar-carga": z.string().min(1, "Lugar de carga es requerido"),
    tarifa: z.string().min(1, "Tarifa de referencia es requerida"),
    "lugar-entrega": z.string().min(1, "Lugar de entrega es requerido"),
    "fecha-entrega-desde": z.string().min(1, "Fecha de Entrega Desde es requerida"),
    "fecha-entrega-hasta": z.string().min(1, "Fecha de Entrega Hasta es requerida"),
  }

  // Campos específicos según tipo de carga
  if (cargoType === "exportacion-maritima" || cargoType === "exportacion-terrestre" || cargoType === "puesta-fob") {
    baseSchema.shipper = z.string().min(1, "Shipper es requerido")
  }

  if (cargoType === "exportacion-terrestre") {
    baseSchema["lugar-aduana-impo"] = z.string().min(1, "Lugar de aduana Impo es requerido")
  }

  if (cargoType === "importacion-maritima") {
    baseSchema["bl-hbl"] = z.string().min(1, "BL/HBL es requerido")
    baseSchema.importador = z.string().min(1, "Importador es requerido")
    baseSchema["lugar-aduana-impo"] = z.string().min(1, "Lugar de aduana Impo es requerido")
  }

  if (cargoType === "importacion-terrestre") {
    baseSchema.consignee = z.string().min(1, "Consignee/Importador es requerido")
  }

  if (cargoType === "carga-nacional") {
    baseSchema.cliente = z.string().min(1, "Cliente es requerido")
  }

  return z.object(baseSchema)
}

export type CargoFormProps = {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
  isEditMode?: boolean
}

export function CargoForm({ onSubmit, onCancel, initialData, isEditMode }: CargoFormProps) {
  const [cargoType, setCargoType] = useState(initialData?.cargoType || "exportacion-maritima")
  const [fechaCarga, setFechaCarga] = useState<Date | undefined>(initialData?.fechaCarga ? new Date(initialData.fechaCarga) : undefined)
  const [fechaEntrega, setFechaEntrega] = useState<Date | undefined>(initialData?.fechaEntrega ? new Date(initialData.fechaEntrega) : undefined)
  const [fechaDescarga, setFechaDescarga] = useState<Date | undefined>(initialData?.fechaDescarga ? new Date(initialData.fechaDescarga) : undefined)
  const [senasaValue, setSenasaValue] = useState(initialData?.senasaValue || "NO")
  const [taraValue, setTaraValue] = useState(initialData?.taraValue || "NO")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>(initialData ? { ...initialData } : { "cantidad-viajes": "1" })
  const [formCompleted, setFormCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  })
  const [selectedContainerType, setSelectedContainerType] = useState(initialData?.selectedContainerType || "")
  const [isRefrigerada, setIsRefrigerada] = useState(initialData?.isRefrigerada || false)
  const [isIMO, setIsIMO] = useState(initialData?.isIMO || false)
  const [codigoOperacion, setCodigoOperacion] = useState(initialData?.codigoOperacion || "")
  const [correlativo, setCorrelativo] = useState(initialData?.correlativo || 1)
  const [puntosInteres, setPuntosInteres] = useState<string[]>(initialData?.puntosInteres || [])

  // Datos de ejemplo para los selects
  const traders = [
    { id: "trader-1", name: "Trader Ejemplo 1" },
    { id: "trader-2", name: "Trader Ejemplo 2" },
    { id: "trader-3", name: "Trader Ejemplo 3" },
  ]

  const shippers = [
    { id: "shipper-1", name: "Shipper Ejemplo 1" },
    { id: "shipper-2", name: "Shipper Ejemplo 2" },
    { id: "shipper-3", name: "Shipper Ejemplo 3" },
  ]

  const cargoTypes = [
    { id: "granos", name: "Granos" },
    { id: "contenedores", name: "Contenedores" },
    { id: "carga-general", name: "Carga General" },
    { id: "liquidos", name: "Líquidos" },
  ]

  const containerTypes = [
    { id: "20-dry", name: "20' Dry" },
    { id: "40-dry", name: "40' Dry" },
    { id: "40-hc", name: "40' HC" },
    { id: "20-reefer", name: "20' Reefer" },
    { id: "40-reefer", name: "40' Reefer" },
  ]

  const containerSpecs = {
    "20-dry": {
      dimensions: "5.90m x 2.35m x 2.39m",
      weight: "2,230 kg",
      capacity: "33.2 m³",
      maxLoad: "28,270 kg",
    },
    "40-dry": {
      dimensions: "12.03m x 2.35m x 2.39m",
      weight: "3,750 kg",
      capacity: "67.7 m³",
      maxLoad: "26,750 kg",
    },
    "40-hc": {
      dimensions: "12.03m x 2.35m x 2.69m",
      weight: "3,940 kg",
      capacity: "76.4 m³",
      maxLoad: "26,560 kg",
    },
    "20-reefer": {
      dimensions: "5.44m x 2.29m x 2.27m",
      weight: "3,080 kg",
      capacity: "28.3 m³",
      maxLoad: "27,420 kg",
    },
    "40-reefer": {
      dimensions: "11.56m x 2.29m x 2.27m",
      weight: "4,800 kg",
      capacity: "59.3 m³",
      maxLoad: "25,700 kg",
    },
  }

  const loadingPlaces = [
    { id: "puerto-buenos-aires", name: "Puerto de Buenos Aires" },
    { id: "puerto-rosario", name: "Puerto de Rosario" },
    { id: "terminal-zarate", name: "Terminal Zárate" },
    { id: "deposito-tigre", name: "Depósito Tigre" },
  ]

  const puntosInteresOptions = [
    { id: "zona-control-autopista", name: "Zona de Control Autopista" },
    { id: "puerto-buenos-aires", name: "Puerto de Buenos Aires" },
    { id: "centro-distribucion-norte", name: "Centro de Distribución Norte" },
    { id: "centro-distribucion-sur", name: "Centro de Distribución Sur" },
    { id: "terminal-portuaria-rosario", name: "Terminal Portuaria Rosario" },
    { id: "aduana-buenos-aires", name: "Aduana Buenos Aires" },
    { id: "aduana-rosario", name: "Aduana Rosario" }
  ]

  const handlePuntoInteresChange = (value: string) => {
    if (puntosInteres.length < 3 && !puntosInteres.includes(value)) {
      setPuntosInteres([...puntosInteres, value])
    }
  }

  const removePuntoInteres = (value: string) => {
    setPuntosInteres(puntosInteres.filter(punto => punto !== value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formDataObj = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formDataObj.entries())

    // Validaciones adicionales
    const validationErrors: Record<string, string> = {}

    // Validar fecha de carga
    if (!fechaCarga) {
      validationErrors.fechaCarga = "Fecha de carga es requerida"
    }

    // Validaciones específicas según tipo de carga
    if (
      (cargoType === "exportacion-terrestre" ||
        cargoType === "importacion-maritima" ||
        cargoType === "importacion-terrestre") &&
      !fechaDescarga
    ) {
      validationErrors.fechaDescarga = "Fecha de descarga/entrega es requerida"
    }

    if (cargoType === "carga-nacional" && !fechaEntrega) {
      validationErrors.fechaEntrega = "Fecha de entrega es requerida"
    }

    // Validar tarifa como número
    const tarifa = data.tarifa as string
    if (tarifa && (isNaN(Number(tarifa)) || Number(tarifa) < 0)) {
      validationErrors.tarifa = "Tarifa debe ser un número mayor o igual a 0"
    }

    // Validar cantidad de viajes como número
    const cantidadViajes = data["cantidad-viajes"] as string
    if (cantidadViajes && (isNaN(Number(cantidadViajes)) || Number(cantidadViajes) < 0)) {
      validationErrors["cantidad-viajes"] = "Cantidad debe ser un número mayor o igual a 0"
    }

    // Validar esquema base
    try {
      const schema = createValidationSchema(cargoType)
      schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message
          }
        })
      }
    }

    // Validaciones para carga refrigerada
    if (isRefrigerada) {
      const temperatura = data.temperatura as string
      const humedad = data.humedad as string
      const ventilacion = data.ventilacion as string

      if (!temperatura) {
        validationErrors.temperatura = "Temperatura es requerida para carga refrigerada"
      } else if (isNaN(Number(temperatura))) {
        validationErrors.temperatura = "Temperatura debe ser un número válido"
      }

      if (!humedad) {
        validationErrors.humedad = "Humedad es requerida para carga refrigerada"
      } else if (isNaN(Number(humedad)) || Number(humedad) < 0 || Number(humedad) > 100) {
        validationErrors.humedad = "Humedad debe ser un número entre 0 y 100"
      }

      if (!ventilacion) {
        validationErrors.ventilacion = "Ventilación es requerida para carga refrigerada"
      } else if (isNaN(Number(ventilacion)) || Number(ventilacion) < 0) {
        validationErrors.ventilacion = "Ventilación debe ser un número mayor o igual a 0"
      }
    }

    // Validaciones para carga extramedida
    if (formData.extramedida) {
      const alto = data["alto-extramedida"] as string
      const ancho = data["ancho-extramedida"] as string
      const largo = data["largo-extramedida"] as string

      if (!alto) {
        validationErrors["alto-extramedida"] = "Alto es requerido para carga extramedida"
      } else if (isNaN(Number(alto)) || Number(alto) <= 0) {
        validationErrors["alto-extramedida"] = "Alto debe ser un número mayor a 0"
      }

      if (!ancho) {
        validationErrors["ancho-extramedida"] = "Ancho es requerido para carga extramedida"
      } else if (isNaN(Number(ancho)) || Number(ancho) <= 0) {
        validationErrors["ancho-extramedida"] = "Ancho debe ser un número mayor a 0"
      }

      if (!largo) {
        validationErrors["largo-extramedida"] = "Largo es requerido para carga extramedida"
      } else if (isNaN(Number(largo)) || Number(largo) <= 0) {
        validationErrors["largo-extramedida"] = "Largo debe ser un número mayor a 0"
      }
    }

    // Validaciones para carga IMO
    if (isIMO) {
      const observacionesIMO = data["observaciones-imo"] as string
      if (!observacionesIMO || observacionesIMO.trim().length === 0) {
        validationErrors["observaciones-imo"] = "Observaciones IMO son requeridas para materiales peligrosos"
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    // Si no hay errores, enviar datos
    try {
      await onSubmit({
        ...data,
        cargoType,
        fechaCarga,
        fechaEntrega,
        fechaDescarga,
        imo: isIMO,
        refrigerada: isRefrigerada,
      })
    } catch (error) {
      console.error("Error al crear carga:", error)
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información General"
      case 2:
        return "Lugares y Fechas"
      case 3:
        return "Detalles Específicos"
      case 4:
        return "Características Adicionales"
      default:
        return "Información General"
    }
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 1:
        return <ClipboardIcon className="h-5 w-5" />
      case 2:
        return <MapPinIcon className="h-5 w-5" />
      case 3:
        return <PackageIcon className="h-5 w-5" />
      case 4:
        return <InfoIcon className="h-5 w-5" />
      default:
        return <ClipboardIcon className="h-5 w-5" />
    }
  }

  const getOperacionAbbr = (cargoType: string) => {
    switch (cargoType) {
      case "exportacion-maritima":
        return "EXM"
      case "exportacion-terrestre":
        return "EXT"
      case "importacion-maritima":
        return "IMM"
      case "importacion-terrestre":
        return "IMT"
      case "carga-nacional":
        return "NAC"
      case "puesta-fob":
        return "FOB"
      default:
        return ""
    }
  }

  useEffect(() => {
    const tipoCarga = formData.commodity ? cargoTypes.find(t => t.id === formData.commodity)?.name : "";
    const abbr = getOperacionAbbr(cargoType);
    const correlativoStr = correlativo.toString().padStart(6, "0");
    setCodigoOperacion(`${abbr}${tipoCarga ? '-' + tipoCarga : ''}-${correlativoStr}`);
  }, [cargoType, formData.commodity, correlativo]);

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Barra de progreso interactiva */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 ${
                currentStep === step ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
              }`}
              style={{ width: "25%" }}
              onClick={() => goToStep(step)}
            >
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 transition-all duration-200
            ${
              currentStep === step
                ? "bg-blue-100 border-2 border-blue-600 shadow-md"
                : currentStep > step
                  ? "bg-green-100 border-2 border-green-600 hover:bg-green-200"
                  : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
            }`}
              >
                {currentStep > step ? (
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
                {step === 1 && "Información General"}
                {step === 2 && "Lugares y Fechas"}
                {step === 3 && "Detalles Específicos"}
                {step === 4 && "Características"}
              </span>
              {/* Versión móvil del texto */}
              <span
                className={`text-xs text-center transition-all duration-200 ${
                  currentStep === step ? "font-medium" : "hover:font-medium"
                } block sm:hidden`}
              >
                {step === 1 && "Info"}
                {step === 2 && "Lugares"}
                {step === 3 && "Detalles"}
                {step === 4 && "Extra"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Encabezado del paso actual */}
      <div className="flex items-center mb-6">
        {getStepIcon()}
        <h2 className="text-xl font-semibold ml-2">{getStepTitle()}</h2>
      </div>

      {/* Paso 1: Información General */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageIcon className="h-5 w-5 mr-2" />
                Tipo de Operación Logística
              </CardTitle>
              <CardDescription>Seleccione el tipo de operación que desea realizar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="cargo-type">Tipo de Operación Logística</Label>
                <Select value={cargoType} onValueChange={setCargoType}>
                  <SelectTrigger id="cargo-type" className="flex items-center">
                    <SelectValue placeholder="Seleccionar tipo de operación logística" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exportacion-maritima">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Exportación Portuaria
                      </div>
                    </SelectItem>
                    <SelectItem value="exportacion-terrestre">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Exportación Terrestre
                      </div>
                    </SelectItem>
                    <SelectItem value="importacion-maritima">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Importación Portuaria
                      </div>
                    </SelectItem>
                    <SelectItem value="importacion-terrestre">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Importación Terrestre
                      </div>
                    </SelectItem>
                    <SelectItem value="puesta-fob">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Puesta FOB
                      </div>
                    </SelectItem>
                    <SelectItem value="carga-nacional">
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Carga Nacional
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="booking" className={errors.booking ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <ClipboardIcon className="h-4 w-4 mr-2" />
                      {cargoType === "importacion-maritima" ? "Booking" : "Booking / Referencia"} *
                    </div>
                  </Label>
                  <Input
                    id="booking"
                    name="booking"
                    placeholder="Referencia General de Carga"
                    value={formData.booking || ""}
                    onChange={e => setFormData({ ...formData, booking: e.target.value })}
                    className={getFieldClassName("booking")}
                    required
                  />
                  {errors.booking && <p className="text-sm text-red-600 mt-1">{errors.booking}</p>}
                </div>

                {/* Campo BL/HBL solo para Importación Marítima */}
                {cargoType === "importacion-maritima" && (
                  <div>
                    <Label htmlFor="bl-hbl">
                      <div className="flex items-center">
                        <ClipboardIcon className="h-4 w-4 mr-2" />
                        BL/HBL *
                      </div>
                    </Label>
                    <Input
                      id="bl-hbl"
                      name="bl-hbl"
                      placeholder="Número de BL/HBL"
                      value={formData["bl-hbl"] || ""}
                      onChange={e => setFormData({ ...formData, ["bl-hbl"]: e.target.value })}
                      className={getFieldClassName("bl-hbl")}
                      required
                    />
                    {errors["bl-hbl"] && <p className="text-sm text-red-600 mt-1">{errors["bl-hbl"]}</p>}
                  </div>
                )}

                {cargoType === "importacion-maritima" && (
                  <div>
                    <Label htmlFor="lugar-aduana-impo">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Lugar de Aduana Impo
                      </div>
                    </Label>
                    <Select name="lugar-aduana-impo" value={formData["lugar-aduana-impo"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-aduana-impo"]: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Lugar de Aduana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aduana-buenos-aires">Aduana Buenos Aires</SelectItem>
                        <SelectItem value="aduana-rosario">Aduana Rosario</SelectItem>
                        <SelectItem value="aduana-mendoza">Aduana Mendoza</SelectItem>
                        <SelectItem value="aduana-cordoba">Aduana Córdoba</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                Participantes
              </CardTitle>
              <CardDescription>Información sobre los participantes en la operación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trader" className={errors.trader ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Trader *
                    </div>
                  </Label>
                  <Select name="trader" value={formData.trader || ""} onValueChange={value => setFormData({ ...formData, trader: value })} required>
                    <SelectTrigger className={getFieldClassName("trader")}>
                      <SelectValue placeholder="Seleccionar Trader" />
                    </SelectTrigger>
                    <SelectContent>
                      {traders.map((trader) => (
                        <SelectItem key={trader.id} value={trader.id}>
                          {trader.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.trader && <p className="text-sm text-red-600 mt-1">{errors.trader}</p>}
                </div>

                {/* Campos específicos según tipo de carga */}
                {(cargoType === "exportacion-maritima" ||
                  cargoType === "exportacion-terrestre" ||
                  cargoType === "puesta-fob") && (
                  <div>
                    <Label htmlFor="shipper" className={errors.shipper ? "text-red-600" : ""}>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {cargoType === "exportacion-terrestre" ? "Shipper / Exportador" : "Shipper"} *
                      </div>
                    </Label>
                    <Select name="shipper" value={formData.shipper || ""} onValueChange={value => setFormData({ ...formData, shipper: value })} required>
                      <SelectTrigger className={getFieldClassName("shipper")}>
                        <SelectValue placeholder="Seleccionar Shipper" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippers.map((shipper) => (
                          <SelectItem key={shipper.id} value={shipper.id}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.shipper && <p className="text-sm text-red-600 mt-1">{errors.shipper}</p>}
                  </div>
                )}

                {cargoType === "importacion-maritima" && (
                  <div>
                    <Label htmlFor="importador" className={errors.importador ? "text-red-600" : ""}>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        Importador *
                      </div>
                    </Label>
                    <Select name="importador" value={formData.importador || ""} onValueChange={value => setFormData({ ...formData, importador: value })} required>
                      <SelectTrigger className={getFieldClassName("importador")}>
                        <SelectValue placeholder="Seleccionar Importador" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippers.map((shipper) => (
                          <SelectItem key={shipper.id} value={shipper.id}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.importador && <p className="text-sm text-red-600 mt-1">{errors.importador}</p>}
                  </div>
                )}

                {cargoType === "importacion-terrestre" && (
                  <div>
                    <Label htmlFor="consignee" className={errors.consignee ? "text-red-600" : ""}>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        Consignee / Importador *
                      </div>
                    </Label>
                    <Select name="consignee" value={formData.consignee || ""} onValueChange={value => setFormData({ ...formData, consignee: value })} required>
                      <SelectTrigger className={getFieldClassName("consignee")}>
                        <SelectValue placeholder="Seleccionar Importador" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippers.map((shipper) => (
                          <SelectItem key={shipper.id} value={shipper.id}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.consignee && <p className="text-sm text-red-600 mt-1">{errors.consignee}</p>}
                  </div>
                )}

                {cargoType === "carga-nacional" && (
                  <div>
                    <Label htmlFor="cliente" className={errors.cliente ? "text-red-600" : ""}>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        Cliente *
                      </div>
                    </Label>
                    <Select name="cliente" value={formData.cliente || ""} onValueChange={value => setFormData({ ...formData, cliente: value })} required>
                      <SelectTrigger className={getFieldClassName("cliente")}>
                        <SelectValue placeholder="Seleccionar Cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippers.map((shipper) => (
                          <SelectItem key={shipper.id} value={shipper.id}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cliente && <p className="text-sm text-red-600 mt-1">{errors.cliente}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageIcon className="h-5 w-5 mr-2" />
                Información de la Carga
              </CardTitle>
              <CardDescription>Detalles sobre el tipo y cantidad de carga</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="commodity" className={errors.commodity ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <PackageIcon className="h-4 w-4 mr-2" />
                      Tipo de Carga *
                    </div>
                  </Label>
                  <Select name="commodity" value={formData.commodity || ""} onValueChange={value => setFormData({ ...formData, commodity: value })} required>
                    <SelectTrigger className={getFieldClassName("commodity")}>
                      <SelectValue placeholder="Seleccionar Tipo de Carga" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargoTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.commodity && <p className="text-sm text-red-600 mt-1">{errors.commodity}</p>}
                </div>

                <div>
                  <Label htmlFor="cantidad-viajes" className={errors["cantidad-viajes"] ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Cantidad de Viajes *
                    </div>
                  </Label>
                  <Input
                    id="cantidad-viajes"
                    name="cantidad-viajes"
                    type="number"
                    min={1}
                    value={formData["cantidad-viajes"] || "1"}
                    onChange={e => setFormData({ ...formData, ["cantidad-viajes"]: e.target.value })}
                    className={getFieldClassName("cantidad-viajes")}
                  />
                  {errors["cantidad-viajes"] && <p className="text-sm text-red-600 mt-1">{errors["cantidad-viajes"]}</p>}
                </div>

                <div>
                  <Label htmlFor="tipo-carga" className={errors["tipo-carga"] ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <PackageIcon className="h-4 w-4 mr-2" />
                      Tipo de Contenedor *
                    </div>
                  </Label>
                  <Select
                    name="tipo-carga"
                    value={selectedContainerType}
                    onValueChange={setSelectedContainerType}
                    required
                  >
                    <SelectTrigger className={getFieldClassName("tipo-carga")}>
                      <SelectValue
                        placeholder={
                          cargoType === "puesta-fob" ? "Seleccionar tipo de CNTR" : "Seleccionar Tipo de Contenedor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {containerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors["tipo-carga"] && <p className="text-sm text-red-600 mt-1">{errors["tipo-carga"]}</p>}
                </div>

                <div>
                  <Label htmlFor="tarifa" className={errors.tarifa ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <BarChartIcon className="h-4 w-4 mr-2" />
                      Tarifa de Referencia *
                    </div>
                  </Label>
                  <Input
                    id="tarifa"
                    name="tarifa"
                    type="number"
                    min={0}
                    value={formData.tarifa || ""}
                    onChange={e => setFormData({ ...formData, tarifa: e.target.value })}
                    className={getFieldClassName("tarifa")}
                  />
                  {errors.tarifa && <p className="text-sm text-red-600 mt-1">{errors.tarifa}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paso 2: Lugares y Fechas */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Lugares
              </CardTitle>
              <CardDescription>Información sobre los lugares de carga, entrega y aduana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lugar-carga" className={errors["lugar-carga"] ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Lugar de Carga *
                    </div>
                  </Label>
                  <Select name="lugar-carga" value={formData["lugar-carga"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-carga"]: value })} required>
                    <SelectTrigger className={getFieldClassName("lugar-carga")}>
                      <SelectValue placeholder="Seleccionar Lugar de Carga" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingPlaces.map((place) => (
                        <SelectItem key={place.id} value={place.id}>
                          {place.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors["lugar-carga"] && <p className="text-sm text-red-600 mt-1">{errors["lugar-carga"]}</p>}
                </div>

                {(cargoType === "exportacion-maritima" ||
                  cargoType === "exportacion-terrestre" ||
                  cargoType === "importacion-maritima" ||
                  cargoType === "importacion-terrestre" ||
                  cargoType === "puesta-fob" ||
                  cargoType === "carga-nacional") && (
                  <div>
                    <Label htmlFor="lugar-entrega" className={errors["lugar-entrega"] ? "text-red-600" : ""}>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Lugar de Entrega <span className="text-black">*</span>
                      </div>
                    </Label>
                    <Select name="lugar-entrega" value={formData["lugar-entrega"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-entrega"]: value })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Lugar de Entrega" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPlaces.map((place) => (
                          <SelectItem key={place.id} value={place.id}>
                            {place.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(cargoType === "exportacion-maritima" ||
                  cargoType === "exportacion-terrestre" ||
                  cargoType === "puesta-fob") && (
                  <div>
                    <Label htmlFor="lugar-aduana-expo">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Lugar de Aduana Expo
                      </div>
                    </Label>
                    <Select name="lugar-aduana-expo" value={formData["lugar-aduana-expo"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-aduana-expo"]: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Lugar de Aduana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aduana-buenos-aires">Aduana Buenos Aires</SelectItem>
                        <SelectItem value="aduana-rosario">Aduana Rosario</SelectItem>
                        <SelectItem value="aduana-mendoza">Aduana Mendoza</SelectItem>
                        <SelectItem value="aduana-cordoba">Aduana Córdoba</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {cargoType === "exportacion-terrestre" && (
                  <div>
                    <Label htmlFor="lugar-aduana-impo">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Lugar de Aduana Impo
                      </div>
                    </Label>
                    <Select name="lugar-aduana-impo" value={formData["lugar-aduana-impo"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-aduana-impo"]: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Lugar de Aduana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aduana-buenos-aires">Aduana Buenos Aires</SelectItem>
                        <SelectItem value="aduana-rosario">Aduana Rosario</SelectItem>
                        <SelectItem value="aduana-mendoza">Aduana Mendoza</SelectItem>
                        <SelectItem value="aduana-cordoba">Aduana Córdoba</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Campos de aduana para importación terrestre */}
                {cargoType === "importacion-terrestre" && (
                  <>
                    <div>
                      <Label htmlFor="lugar-aduana-expo">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Lugar de Aduana Expo
                        </div>
                      </Label>
                      <Select name="lugar-aduana-expo" value={formData["lugar-aduana-expo"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-aduana-expo"]: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Lugar de Aduana" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aduana-buenos-aires">Aduana Buenos Aires</SelectItem>
                          <SelectItem value="aduana-rosario">Aduana Rosario</SelectItem>
                          <SelectItem value="aduana-mendoza">Aduana Mendoza</SelectItem>
                          <SelectItem value="aduana-cordoba">Aduana Córdoba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lugar-aduana-impo">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Lugar de Aduana Impo
                        </div>
                      </Label>
                      <Select name="lugar-aduana-impo" value={formData["lugar-aduana-impo"] || ""} onValueChange={value => setFormData({ ...formData, ["lugar-aduana-impo"]: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Lugar de Aduana" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aduana-buenos-aires">Aduana Buenos Aires</SelectItem>
                          <SelectItem value="aduana-rosario">Aduana Rosario</SelectItem>
                          <SelectItem value="aduana-mendoza">Aduana Mendoza</SelectItem>
                          <SelectItem value="aduana-cordoba">Aduana Córdoba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Campo Destino Final para exportación portuaria y puesta FOB en lugares y fechas */}
                {(cargoType === "exportacion-maritima" || cargoType === "puesta-fob") && (
                  <div>
                    <Label htmlFor="destino-final">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Destino Final
                      </div>
                    </Label>
                    <Select name="destino-final" value={formData["destino-final"] || ""} onValueChange={value => setFormData({ ...formData, ["destino-final"]: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Destino Final" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="santos-brasil">Santos, Brasil</SelectItem>
                        <SelectItem value="montevideo-uruguay">Montevideo, Uruguay</SelectItem>
                        <SelectItem value="valparaiso-chile">Valparaíso, Chile</SelectItem>
                        <SelectItem value="hamburg-alemania">Hamburg, Alemania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Puntos de Interés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Puntos de Interés
              </CardTitle>
              <CardDescription>Seleccione hasta 3 puntos de interés para la carga</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {puntosInteres.map((punto) => (
                    <Badge
                      key={punto}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {puntosInteresOptions.find(opt => opt.id === punto)?.name}
                      <button
                        type="button"
                        onClick={() => removePuntoInteres(punto)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {puntosInteres.length < 3 && (
                  <div className="space-y-2">
                    <Label htmlFor="punto-interes" className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Agregar Punto de Interés
                    </Label>
                    <Select
                      onValueChange={handlePuntoInteresChange}
                      value=""
                    >
                      <SelectTrigger id="punto-interes">
                        <SelectValue placeholder="Seleccionar punto de interés" />
                      </SelectTrigger>
                      <SelectContent>
                        {puntosInteresOptions
                          .filter(opt => !puntosInteres.includes(opt.id))
                          .map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Fechas
              </CardTitle>
              <CardDescription>Información sobre las fechas de carga, entrega y descarga</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mostrar siempre los tres campos alineados para todos los tipos de carga */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fecha de Carga */}
                <div>
                  <Label htmlFor="fecha-carga" className={errors.fechaCarga ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Fecha de Carga *
                    </div>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fechaCarga && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaCarga ? format(fechaCarga, "dd/MM/yyyy") : "dd/mm/aaaa"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fechaCarga} onSelect={setFechaCarga} locale={es} />
                    </PopoverContent>
                  </Popover>
                  {errors.fechaCarga && <p className="text-sm text-red-600 mt-1">{errors.fechaCarga}</p>}
                </div>
                {/* Fecha de Entrega Desde */}
                <div>
                  <Label htmlFor="fecha-entrega-desde" className={errors["fecha-entrega-desde"] ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      Fecha de Entrega Desde <span className="text-black">*</span>
                    </div>
                  </Label>
                  <Input
                    id="fecha-entrega-desde"
                    name="fecha-entrega-desde"
                    type="datetime-local"
                    value={formData["fecha-entrega-desde"] || ""}
                    onChange={e => setFormData({ ...formData, ["fecha-entrega-desde"]: e.target.value })}
                    className={getFieldClassName("fecha-entrega-desde")}
                    required
                  />
                  {errors["fecha-entrega-desde"] && <p className="text-sm text-red-600 mt-1">{errors["fecha-entrega-desde"]}</p>}
                </div>
                {/* Fecha de Entrega Hasta */}
                <div>
                  <Label htmlFor="fecha-entrega-hasta" className={errors["fecha-entrega-hasta"] ? "text-red-600" : ""}>
                    <div className="flex items-center">
                      Fecha de Entrega Hasta <span className="text-black">*</span>
                    </div>
                  </Label>
                  <Input
                    id="fecha-entrega-hasta"
                    name="fecha-entrega-hasta"
                    type="datetime-local"
                    value={formData["fecha-entrega-hasta"] || ""}
                    onChange={e => setFormData({ ...formData, ["fecha-entrega-hasta"]: e.target.value })}
                    className={getFieldClassName("fecha-entrega-hasta")}
                    required
                  />
                  {errors["fecha-entrega-hasta"] && <p className="text-sm text-red-600 mt-1">{errors["fecha-entrega-hasta"]}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paso 3: Detalles Específicos */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {(cargoType === "exportacion-maritima" || cargoType === "puesta-fob") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShipIcon className="h-5 w-5 mr-2" />
                  Información Marítima
                </CardTitle>
                <CardDescription>Detalles sobre el buque y viaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="armador">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Armador
                      </div>
                    </Label>
                    <Select name="armador" value={formData.armador || ""} onValueChange={value => setFormData({ ...formData, armador: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Armador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maersk">Maersk</SelectItem>
                        <SelectItem value="msc">MSC</SelectItem>
                        <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                        <SelectItem value="hapag-lloyd">Hapag-Lloyd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vessel">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Vessel
                      </div>
                    </Label>
                    <Input id="vessel" name="vessel" placeholder="Buque" value={formData.vessel || ""} onChange={e => setFormData({ ...formData, vessel: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="voyage">
                      <div className="flex items-center">
                        <ShipIcon className="h-4 w-4 mr-2" />
                        Voyage
                      </div>
                    </Label>
                    <Input id="voyage" name="voyage" placeholder="Viaje" value={formData.voyage || ""} onChange={e => setFormData({ ...formData, voyage: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información Marítima para importación portuaria */}
          {cargoType === "importacion-maritima" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShipIcon className="h-5 w-5 mr-2" />
                  Información Marítima
                </CardTitle>
                <CardDescription>Detalles sobre el armador</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="armador">
                    <div className="flex items-center">
                      <ShipIcon className="h-4 w-4 mr-2" />
                      Armador
                    </div>
                  </Label>
                  <Select name="armador" value={formData.armador || ""} onValueChange={value => setFormData({ ...formData, armador: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Armador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maersk">Maersk</SelectItem>
                      <SelectItem value="msc">MSC</SelectItem>
                      <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                      <SelectItem value="hapag-lloyd">Hapag-Lloyd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2" />
                Requisitos Especiales
              </CardTitle>
              <CardDescription>Información sobre requisitos SENASA y TARA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Fila TARA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="tara">
                      <div className="flex items-center">
                        <AlertCircleIcon className="h-4 w-4 mr-2" />
                        TARA
                      </div>
                    </Label>
                    <Select value={formData.tara || "NO"} onValueChange={value => setFormData({ ...formData, tara: value })}>
                      <SelectTrigger id="tara">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SI">SI</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.tara === "SI" ? (
                    <div>
                      <Label htmlFor="detalle-tara">
                        <div className="flex items-center">
                          <InfoIcon className="h-4 w-4 mr-2" />
                          Detalle Tara
                        </div>
                      </Label>
                      <Input id="detalle-tara" name="detalle-tara" placeholder="Acepta todo tipo de caracteres" value={formData["detalle-tara"] || ""} onChange={e => setFormData({ ...formData, ["detalle-tara"]: e.target.value })} />
                    </div>
                  ) : <div></div>}
                </div>
                {/* Fila SENASA */}
                {cargoType !== "carga-nacional" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label htmlFor="senasa">
                        <div className="flex items-center">
                          <AlertCircleIcon className="h-4 w-4 mr-2" />
                          SENASA
                        </div>
                      </Label>
                      <Select value={formData.senasa || "NO"} onValueChange={value => setFormData({ ...formData, senasa: value })}>
                        <SelectTrigger id="senasa">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SI">SI</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.senasa === "SI" ? (
                      <div>
                        <Label htmlFor="detalle-senasa">
                          <div className="flex items-center">
                            <InfoIcon className="h-4 w-4 mr-2" />
                            Detalle Senasa
                          </div>
                        </Label>
                        <Input id="detalle-senasa" name="detalle-senasa" placeholder="Acepta todo tipo de caracteres" value={formData["detalle-senasa"] || ""} onChange={e => setFormData({ ...formData, ["detalle-senasa"]: e.target.value })} />
                      </div>
                    ) : <div></div>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paso 4: Características Adicionales */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageIcon className="h-5 w-5 mr-2" />
                Características Especiales
              </CardTitle>
              <CardDescription>Información sobre características especiales de la carga</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Checkboxes especiales */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="extramedida" className="rounded" checked={formData.extramedida} onChange={e => setFormData({ ...formData, extramedida: e.target.checked })} />
                  <Label htmlFor="extramedida">Extramedida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="imo" className="rounded" checked={formData.imo} onChange={e => setFormData({ ...formData, imo: e.target.checked })} />
                  <Label htmlFor="imo">IMO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="refrigerada" className="rounded" checked={formData.refrigerada} onChange={e => setFormData({ ...formData, refrigerada: e.target.checked })} />
                  <Label htmlFor="refrigerada">Refrigerada</Label>
                </div>
              </div>
              {/* Campos de extramedida */}
              {formData.extramedida && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                    <RulerIcon className="h-4 w-4 mr-2 text-yellow-800" />
                    Dimensiones Extramedida
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="alto-extramedida">Alto (metros)</Label>
                      <Input
                        id="alto-extramedida"
                        name="alto-extramedida"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData["alto-extramedida"] || ""}
                        onChange={e => setFormData({ ...formData, ["alto-extramedida"]: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ancho-extramedida">Ancho (metros)</Label>
                      <Input
                        id="ancho-extramedida"
                        name="ancho-extramedida"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData["ancho-extramedida"] || ""}
                        onChange={e => setFormData({ ...formData, ["ancho-extramedida"]: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="largo-extramedida">Largo (metros)</Label>
                      <Input
                        id="largo-extramedida"
                        name="largo-extramedida"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData["largo-extramedida"] || ""}
                        onChange={e => setFormData({ ...formData, ["largo-extramedida"]: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Campos de refrigerada */}
              {formData.refrigerada && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <ThermometerIcon className="h-4 w-4 mr-2" />
                    Condiciones de Refrigeración
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temperatura" className={errors.temperatura ? "text-red-600" : ""}>
                        Temperatura (°C) *
                      </Label>
                      <Input
                        id="temperatura"
                        name="temperatura"
                        type="number"
                        step="0.1"
                        placeholder="-18.0"
                        value={formData.temperatura || ""}
                        onChange={e => setFormData({ ...formData, temperatura: e.target.value })}
                        className={getFieldClassName("temperatura")}
                      />
                      {errors.temperatura && <p className="text-sm text-red-600 mt-1">{errors.temperatura}</p>}
                    </div>
                    <div>
                      <Label htmlFor="humedad" className={errors.humedad ? "text-red-600" : ""}>
                        Humedad (%) *
                      </Label>
                      <Input
                        id="humedad"
                        name="humedad"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="85"
                        value={formData.humedad || ""}
                        onChange={e => setFormData({ ...formData, humedad: e.target.value })}
                        className={getFieldClassName("humedad")}
                      />
                      {errors.humedad && <p className="text-sm text-red-600 mt-1">{errors.humedad}</p>}
                    </div>
                    <div>
                      <Label htmlFor="ventilacion" className={errors.ventilacion ? "text-red-600" : ""}>
                        Ventilación (m³/h) *
                      </Label>
                      <Input
                        id="ventilacion"
                        name="ventilacion"
                        type="number"
                        step="0.1"
                        placeholder="25.0"
                        value={formData.ventilacion || ""}
                        onChange={e => setFormData({ ...formData, ventilacion: e.target.value })}
                        className={getFieldClassName("ventilacion")}
                      />
                      {errors.ventilacion && <p className="text-sm text-red-600 mt-1">{errors.ventilacion}</p>}
                    </div>
                  </div>
                </div>
              )}

              {formData.imo && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
                    <AlertCircleIcon className="h-4 w-4 mr-2" />
                    Información de Materiales Peligrosos
                  </h4>
                  <div>
                    <Label htmlFor="observaciones-imo" className={errors["observaciones-imo"] ? "text-red-600" : ""}>
                      Observaciones IMO *
                    </Label>
                    <Textarea
                      id="observaciones-imo"
                      name="observaciones-imo"
                      placeholder="Especifique el tipo de material peligroso, clase IMO, número UN, etc."
                      value={formData["observaciones-imo"] || ""}
                      onChange={e => setFormData({ ...formData, ["observaciones-imo"]: e.target.value })}
                      className={getFieldClassName("observaciones-imo")}
                      rows={3}
                    />
                    {errors["observaciones-imo"] && (
                      <p className="text-sm text-red-600 mt-1">{errors["observaciones-imo"]}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Label htmlFor="observaciones">
                  <div className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Observaciones Generales
                  </div>
                </Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="Comentarios adicionales sobre la carga"
                  value={formData.observaciones || ""}
                  onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Resumen
              </CardTitle>
              <CardDescription>Revise la información antes de crear la carga</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge className="mr-2">
                    {cargoType === "exportacion-maritima"
                      ? "Exportación Portuaria"
                      : cargoType === "exportacion-terrestre"
                        ? "Exportación Terrestre"
                        : cargoType === "importacion-maritima"
                          ? "Importación Portuaria"
                          : cargoType === "importacion-terrestre"
                            ? "Importación Terrestre"
                            : cargoType === "puesta-fob"
                              ? "Puesta FOB"
                              : "Carga Nacional"}
                  </Badge>
                  <span className="text-sm text-gray-600">Tipo de operación seleccionado</span>
                </div>
                <p className="text-sm text-gray-600">
                  Complete todos los campos requeridos y revise la información antes de crear la carga.
                </p>
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
            <Button type="submit" disabled={isSubmitting} className="bg-[#00334a] hover:bg-[#004a6b]">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Actualizar carga' : 'Crear carga'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
