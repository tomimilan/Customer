"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface Trailer {
  id: string
  empresa: string
  año: string
  dominio: string
  chasis: string
  poliza: string
  vtoPoliza: string
  estado: string
}

interface EditTrailerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trailer: Trailer | null
}

export function EditTrailerModal({ open, onOpenChange, trailer }: EditTrailerModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [vtoPoliza, setVtoPoliza] = useState<Date>()
  const [formData, setFormData] = useState({
    empresa: "",
    año: "",
    dominio: "",
    chasis: "",
    poliza: "",
    estado: "",
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  useEffect(() => {
    if (trailer) {
      setFormData({
        empresa: trailer.empresa,
        año: trailer.año,
        dominio: trailer.dominio,
        chasis: trailer.chasis,
        poliza: trailer.poliza,
        estado: trailer.estado,
      })
      // Convertir fecha de string a Date si existe
      if (trailer.vtoPoliza) {
        const [day, month, year] = trailer.vtoPoliza.split("/")
        setVtoPoliza(new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)))
      }
    }
  }, [trailer])

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
            Acoplado actualizado correctamente
          </div>
        ),
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el acoplado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Acoplado</DialogTitle>
          <DialogDescription>Modifique la información del acoplado</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="año">Año</Label>
              <Select value={formData.año} onValueChange={(value) => setFormData((prev) => ({ ...prev, año: value }))}>
                <SelectTrigger>
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
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#00334a] hover:bg-[#004a6b]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Acoplado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
