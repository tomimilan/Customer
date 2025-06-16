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
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Driver {
  id: string
  nombre: string
  empresa: string
  telefono: string
  email: string
  vencimiento: string
  estado: string
}

interface EditDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: Driver | null
}

export function EditDriverModal({ open, onOpenChange, driver }: EditDriverModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
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
            Chofer actualizado correctamente
          </div>
        ),
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el chofer",
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
          <DialogTitle>Editar Chofer</DialogTitle>
          <DialogDescription>Modifique la información del chofer</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombre">Nombre y Apellido</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre completo del chofer"
              />
            </div>

            <div className="space-y-2 col-span-2">
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
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                placeholder="Teléfono del chofer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email del chofer"
              />
            </div>

            <div className="space-y-2">
              <Label>Vencimiento Licencia</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !vtoLicencia && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vtoLicencia ? format(vtoLicencia, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={vtoLicencia} onSelect={setVtoLicencia} initialFocus />
                </PopoverContent>
              </Popover>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Comentarios adicionales sobre el chofer..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#00334a] hover:bg-[#004a6b]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Chofer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
