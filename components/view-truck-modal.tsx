"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: string
  tipo: string
  marca: string
  modelo: string
  patente: string
  año: string
  capacidad: string
  empresa: string
  chofer: string
  estado: string
}

interface ViewTruckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
}

export function ViewTruckModal({ open, onOpenChange, vehicle }: ViewTruckModalProps) {
  const [vtoPoliza, setVtoPoliza] = useState<Date>()
  const [formData, setFormData] = useState({
    empresa: "",
    modelo: "",
    año: "",
    tipo: "",
    dominio: "",
    chasis: "",
    poliza: "",
    sensores: false,
    rastreoSatelital: false,
    estado: "",
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  useEffect(() => {
    if (vehicle) {
      setFormData({
        empresa: vehicle.empresa,
        modelo: `${vehicle.marca} ${vehicle.modelo}`,
        año: vehicle.año,
        tipo: vehicle.tipo,
        dominio: vehicle.patente,
        chasis: "",
        poliza: "",
        sensores: false,
        rastreoSatelital: false,
        estado: vehicle.estado,
      })
    }
  }, [vehicle])

  if (!vehicle) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ver Detalles del Camión</DialogTitle>
          <DialogDescription>Información del camión</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={formData.empresa} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transportes Rápidos S.A.">Transportes Rápidos S.A.</SelectItem>
                  <SelectItem value="Logística del Sur">Logística del Sur</SelectItem>
                  <SelectItem value="Transportes Andinos">Transportes Andinos</SelectItem>
                  <SelectItem value="Cargas Express">Cargas Express</SelectItem>
                  <SelectItem value="Transportes del Norte">Transportes del Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                placeholder="Ej: Scania R450"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="año">Año</Label>
              <Select value={formData.año} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Camión">Camión</SelectItem>
                  <SelectItem value="Tractor">Tractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominio">Dominio</Label>
              <Input
                id="dominio"
                value={formData.dominio}
                placeholder="ABC123 o AB123CD"
                maxLength={7}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operativo">Operativo</SelectItem>
                  <SelectItem value="En ruta">En ruta</SelectItem>
                  <SelectItem value="En mantenimiento">En mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chasis">Chasis</Label>
              <Input
                id="chasis"
                value={formData.chasis}
                placeholder="Número de chasis"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poliza">Póliza</Label>
              <Input
                id="poliza"
                value={formData.poliza}
                placeholder="Número de póliza"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Vto Póliza</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal bg-gray-50", !vtoPoliza && "text-muted-foreground")}
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vtoPoliza ? format(vtoPoliza, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={vtoPoliza} onSelect={setVtoPoliza} initialFocus disabled />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensores"
                checked={formData.sensores}
                disabled
              />
              <Label htmlFor="sensores">Sensores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rastreoSatelital"
                checked={formData.rastreoSatelital}
                disabled
              />
              <Label htmlFor="rastreoSatelital">Rastreo Satelital</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 