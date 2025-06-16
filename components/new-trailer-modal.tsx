"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface NewTrailerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTrailerModal({ open, onOpenChange }: NewTrailerModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    empresa: "",
    año: "",
    dominio: "",
    chasis: "",
    poliza: "",
    vtoPoliza: undefined as Date | undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos obligatorios
    const newErrors: Record<string, string> = {}

    if (!formData.empresa) newErrors.empresa = "La empresa es obligatoria"
    if (!formData.año) newErrors.año = "El año es obligatorio"
    if (!formData.dominio) newErrors.dominio = "El dominio es obligatorio"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
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
            Acoplado agregado correctamente
          </div>
        ),
      })

      // Resetear formulario y errores
      setFormData({
        empresa: "",
        año: "",
        dominio: "",
        chasis: "",
        poliza: "",
        vtoPoliza: undefined,
      })
      setErrors({})

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el acoplado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDominioChange = (value: string) => {
    // Convertir a mayúsculas y validar formato
    const upperValue = value.toUpperCase()
    setFormData((prev) => ({ ...prev, dominio: upperValue }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Acoplado</DialogTitle>
          <DialogDescription>Complete la información del acoplado para agregarlo a la flota</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Select
                value={formData.empresa}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, empresa: value }))
                  if (errors.empresa) setErrors((prev) => ({ ...prev, empresa: "" }))
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
              {errors.empresa && <p className="text-sm text-red-500">{errors.empresa}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="año">Año *</Label>
              <Select
                value={formData.año}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, año: value }))
                  if (errors.año) setErrors((prev) => ({ ...prev, año: "" }))
                }}
              >
                <SelectTrigger className={errors.año ? "border-red-500" : ""}>
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
              {errors.año && <p className="text-sm text-red-500">{errors.año}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominio">Dominio *</Label>
              <Input
                id="dominio"
                value={formData.dominio}
                onChange={(e) => {
                  handleDominioChange(e.target.value)
                  if (errors.dominio) setErrors((prev) => ({ ...prev, dominio: "" }))
                }}
                placeholder="ABC123 o AB123CD"
                maxLength={7}
                className={errors.dominio ? "border-red-500" : ""}
              />
              {errors.dominio && <p className="text-sm text-red-500">{errors.dominio}</p>}
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
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.vtoPoliza && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.vtoPoliza
                      ? format(formData.vtoPoliza, "dd/MM/yyyy", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.vtoPoliza}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, vtoPoliza: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#00334a] hover:bg-[#004a6b]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar Acoplado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
