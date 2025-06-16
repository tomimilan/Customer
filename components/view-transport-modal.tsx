"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface ViewTransportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transport: Transport | null
}

export function ViewTransportModal({ open, onOpenChange, transport }: ViewTransportModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [vencimientoPermiso, setVencimientoPermiso] = useState<Date>()

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
      setVencimientoPermiso(new Date())
    } else if (!open) {
      setCurrentStep(1)
      setVencimientoPermiso(undefined)
    }
  }, [open, transport])

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

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  if (!transport) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ver Detalles de Empresa de Transporte</DialogTitle>
          <DialogDescription>Información de la empresa {transport.nombre}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6">
          {/* Barra de progreso interactiva */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center transition-all duration-200 cursor-pointer hover:scale-105 ${
                    currentStep === step ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                  }`}
                  style={{ width: "25%" }}
                  onClick={() => goToStep(step)}
                >
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 transition-all duration-200
                ${
                  currentStep === step
                    ? "bg-blue-100 border-2 border-blue-600 shadow-md"
                    : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                }`}
                  >
                    <span className="text-sm font-medium">{step}</span>
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
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
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
                      <Label htmlFor="razonSocial">
                        Razón Social *
                      </Label>
                      <Input
                        id="razonSocial"
                        name="razonSocial"
                        defaultValue={transport.nombre}
                        placeholder="Nombre de la empresa"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cuit">
                        CUIT *
                      </Label>
                      <Input
                        id="cuit"
                        name="cuit"
                        defaultValue="20123456789"
                        placeholder="Solo números sin guiones"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="direccion">
                        Dirección *
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        defaultValue={transport.direccion}
                        placeholder="Dirección completa"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pais">
                        País *
                      </Label>
                      <Select name="pais" defaultValue="Argentina" disabled>
                        <SelectTrigger className="bg-gray-50">
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
                    </div>

                    <div>
                      <Label htmlFor="provincia">Provincia</Label>
                      <Select name="provincia" defaultValue="Buenos Aires" disabled>
                        <SelectTrigger className="bg-gray-50">
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
                      <Input id="ciudad" name="ciudad" defaultValue="Buenos Aires" placeholder="Ciudad" disabled className="bg-gray-50" />
                    </div>

                    <div>
                      <Label htmlFor="satelital">Empresa Satelital</Label>
                      <Input
                        id="satelital"
                        name="satelital"
                        defaultValue="Omnicomm Argentina"
                        placeholder="Nombre de la empresa satelital"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="paut">PAUT</Label>
                      <Input
                        id="paut"
                        name="paut"
                        defaultValue="PAUT123456"
                        placeholder="Padrón Único de Transportistas"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="permisoInternacional">Permiso Internacional</Label>
                      <Input
                        id="permisoInternacional"
                        name="permisoInternacional"
                        defaultValue="PI-2024-001"
                        placeholder="Número o descripción del permiso"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vencimientoPermiso">Vencimiento Permiso</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-50",
                              !vencimientoPermiso && "text-muted-foreground",
                            )}
                            disabled
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
                            disabled
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
                      <Label htmlFor="contactoLogisticaNombre">
                        Nombre *
                      </Label>
                      <Input
                        id="contactoLogisticaNombre"
                        name="contactoLogisticaNombre"
                        defaultValue={transport.contacto}
                        placeholder="Nombre del contacto"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactoLogisticaCelular">
                        Celular *
                      </Label>
                      <Input
                        id="contactoLogisticaCelular"
                        name="contactoLogisticaCelular"
                        defaultValue={transport.telefono}
                        placeholder="+54 9 11 1234-5678"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="contactoLogisticaEmail">Email</Label>
                      <Input
                        id="contactoLogisticaEmail"
                        name="contactoLogisticaEmail"
                        type="email"
                        defaultValue={transport.email}
                        placeholder="logistica@empresa.com"
                        disabled
                        className="bg-gray-50"
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
                      <Label htmlFor="contactoAdminNombre">Nombre *</Label>
                      <Input
                        id="contactoAdminNombre"
                        name="contactoAdminNombre"
                        defaultValue="María González"
                        placeholder="Nombre del contacto"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactoAdminCelular">Celular *</Label>
                      <Input
                        id="contactoAdminCelular"
                        name="contactoAdminCelular"
                        defaultValue="+54 11 9876-5432"
                        placeholder="+54 9 11 1234-5678"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="contactoAdminEmail">Email</Label>
                      <Input
                        id="contactoAdminEmail"
                        name="contactoAdminEmail"
                        type="email"
                        defaultValue="admin@transportesrapidos.com"
                        placeholder="admin@empresa.com"
                        disabled
                        className="bg-gray-50"
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
                      disabled
                      className="bg-gray-50"
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
                <Button type="button" onClick={() => onOpenChange(false)} className="flex items-center">
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 