"use client"

import type React from "react"

import { useState } from "react"
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

interface NewDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewDriverModal({ open, onOpenChange }: NewDriverModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    nombreApellido: "",
    empresa: "",
    documento: "",
    vtoLicencia: undefined as Date | undefined,
    celular: "",
    email: "",
    observaciones: "",
  })

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.nombreApellido.trim()) newErrors.nombreApellido = true
    if (!formData.empresa) newErrors.empresa = true
    if (!formData.documento.trim()) newErrors.documento = true

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true
    }

    // Validar celular si se proporciona
    if (formData.celular && !/^\d{10,15}$/.test(formData.celular.replace(/\s/g, ""))) {
      newErrors.celular = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

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
            Chofer agregado correctamente
          </div>
        ),
      })

      // Resetear formulario
      setFormData({
        nombreApellido: "",
        empresa: "",
        documento: "",
        vtoLicencia: undefined,
        celular: "",
        email: "",
        observaciones: "",
      })
      setErrors({})

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el chofer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentoChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, "")
    setFormData((prev) => ({ ...prev, documento: numericValue }))
    if (errors.documento && numericValue.trim()) {
      setErrors((prev) => ({ ...prev, documento: false }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field] && value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Chofer</DialogTitle>
          <DialogDescription>Complete la información del chofer para agregarlo a la flota</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombreApellido">Nombre y Apellido *</Label>
              <Input
                id="nombreApellido"
                value={formData.nombreApellido}
                onChange={(e) => handleInputChange("nombreApellido", e.target.value)}
                placeholder="Nombre completo del chofer"
                className={errors.nombreApellido ? "border-red-500" : ""}
              />
              {errors.nombreApellido && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Select
                value={formData.empresa}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, empresa: value }))
                  if (errors.empresa) {
                    setErrors((prev) => ({ ...prev, empresa: false }))
                  }
                }}
              >
                <SelectTrigger className={errors.empresa ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transportes-rapidos">Transportes Rápidos S.A.</SelectItem>
                  <SelectItem value="logistica-sur">Logística del Sur</SelectItem>
                  <SelectItem value="transportes-andinos">Transportes Andinos</SelectItem>
                  <SelectItem value="carga-express">Carga Express</SelectItem>
                </SelectContent>
              </Select>
              {errors.empresa && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento">Documento *</Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => handleDocumentoChange(e.target.value)}
                placeholder="DNI sin guiones"
                maxLength={8}
                className={errors.documento ? "border-red-500" : ""}
              />
              {errors.documento && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>

            <div className="space-y-2">
              <Label>Vencimiento Licencia</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.vtoLicencia && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.vtoLicencia
                      ? format(formData.vtoLicencia, "dd/MM/yyyy", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.vtoLicencia}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, vtoLicencia: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => handleInputChange("celular", e.target.value)}
                placeholder="Ej: 11 1234-5678"
                className={errors.celular ? "border-red-500" : ""}
              />
              {errors.celular && <p className="text-red-500 text-sm">Formato inválido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="chofer@empresa.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">Formato inválido</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
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
              Agregar Chofer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
