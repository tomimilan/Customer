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
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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

interface EditTruckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
}

export function EditTruckModal({ open, onOpenChange, vehicle }: EditTruckModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Camión actualizado correctamente
          </div>
        ),
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el camión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Camión</DialogTitle>
          <DialogDescription>Modifique la información del camión</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select
                value={formData.empresa}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, empresa: value }))}
              >
                <SelectTrigger>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, modelo: e.target.value }))}
                placeholder="Ej: Scania R450"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="año">Año</Label>
              <Input
                id="año"
                type="number"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                min={1900}
                max={3000}
                value={formData.año}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                  setFormData(prev => ({ ...prev, año: value }))
                }}
                placeholder="Año (4 dígitos)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, dominio: e.target.value.toUpperCase() }))}
                placeholder="ABC123 o AB123CD"
                maxLength={7}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, chasis: e.target.value }))}
                placeholder="Número de chasis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poliza">Póliza</Label>
              <Input
                id="poliza"
                value={formData.poliza}
                onChange={(e) => setFormData((prev) => ({ ...prev, poliza: e.target.value }))}
                placeholder="Número de póliza"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Vto Póliza</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !vtoPoliza && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vtoPoliza ? format(vtoPoliza, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={vtoPoliza} onSelect={setVtoPoliza} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensores"
                checked={formData.sensores}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sensores: checked as boolean }))}
              />
              <Label htmlFor="sensores">Sensores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rastreoSatelital"
                checked={formData.rastreoSatelital}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, rastreoSatelital: checked as boolean }))
                }
              />
              <Label htmlFor="rastreoSatelital">Rastreo Satelital</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#00334a] hover:bg-[#004a6b]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Camión
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
