"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Driver {
  id: string
  nombre: string
  empresa: string
  telefono: string
  email: string
  vencimiento: string
  estado: string
}

interface ViewDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: Driver | null
}

export function ViewDriverModal({ open, onOpenChange, driver }: ViewDriverModalProps) {
  const [vtoLicencia, setVtoLicencia] = useState<Date>()
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    estado: "",
    observaciones: "",
  })

  useEffect(() => {
    if (driver) {
      setFormData({
        nombre: driver.nombre,
        empresa: driver.empresa,
        telefono: driver.telefono,
        email: driver.email,
        estado: driver.estado,
        observaciones: "",
      })
      // Convertir fecha de string a Date si existe
      if (driver.vencimiento) {
        const [day, month, year] = driver.vencimiento.split("/")
        setVtoLicencia(new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)))
      }
    }
  }, [driver])

  if (!driver) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ver Detalles del Chofer</DialogTitle>
          <DialogDescription>Información del chofer</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombre">Nombre y Apellido</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                placeholder="Nombre completo del chofer"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2 col-span-2">
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
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                placeholder="Teléfono del chofer"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="Email del chofer"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Vencimiento Licencia</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-50",
                      !vtoLicencia && "text-muted-foreground",
                    )}
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vtoLicencia ? format(vtoLicencia, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={vtoLicencia} onSelect={setVtoLicencia} initialFocus disabled />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En ruta">En ruta</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                placeholder="Observaciones adicionales sobre el chofer..."
                rows={3}
                disabled
                className="bg-gray-50"
              />
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