"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function AssignmentForm() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulación de envío de formulario
    setTimeout(() => {
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="carga">Carga</Label>
        <Select>
          <SelectTrigger id="carga">
            <SelectValue placeholder="Seleccionar carga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CRG-1003">CRG-1003 - Mendoza a Buenos Aires</SelectItem>
            <SelectItem value="CRG-1005">CRG-1005 - Rosario a Córdoba</SelectItem>
            <SelectItem value="CRG-1006">CRG-1006 - Buenos Aires a Salta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Detalles de la Carga</Label>
        <div className="rounded-md border p-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Origen:</span>
              <span className="text-sm">Mendoza, Argentina</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Destino:</span>
              <span className="text-sm">Buenos Aires, Argentina</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Cliente:</span>
              <span className="text-sm">Viñedos Argentinos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Tipo:</span>
              <span className="text-sm">Nacional</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Peso:</span>
              <span className="text-sm">5,200 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Volumen:</span>
              <span className="text-sm">12 m³</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transporte">Empresa de Transporte</Label>
        <Select>
          <SelectTrigger id="transporte">
            <SelectValue placeholder="Seleccionar transporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TRP-1001">Transportes Rápidos S.A.</SelectItem>
            <SelectItem value="TRP-1002">Logística del Sur</SelectItem>
            <SelectItem value="TRP-1003">Transportes Andinos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chofer">Chofer</Label>
        <Select>
          <SelectTrigger id="chofer">
            <SelectValue placeholder="Seleccionar chofer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CHF-1001">Juan Pérez</SelectItem>
            <SelectItem value="CHF-1002">María González</SelectItem>
            <SelectItem value="CHF-1003">Carlos Rodríguez</SelectItem>
            <SelectItem value="CHF-1004">Ana Martínez</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehiculo">Vehículo</Label>
        <Select>
          <SelectTrigger id="vehiculo">
            <SelectValue placeholder="Seleccionar vehículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VEH-1001">Ford F-350 (AB123CD)</SelectItem>
            <SelectItem value="VEH-1002">Mercedes-Benz Actros (XY789ZW)</SelectItem>
            <SelectItem value="VEH-1003">Scania R450 (QR456ST)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="fecha-recogida">Fecha de Recogida</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hora-recogida">Hora de Recogida</Label>
        <Select>
          <SelectTrigger id="hora-recogida">
            <SelectValue placeholder="Seleccionar hora" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="08:00">08:00</SelectItem>
            <SelectItem value="09:00">09:00</SelectItem>
            <SelectItem value="10:00">10:00</SelectItem>
            <SelectItem value="11:00">11:00</SelectItem>
            <SelectItem value="12:00">12:00</SelectItem>
            <SelectItem value="13:00">13:00</SelectItem>
            <SelectItem value="14:00">14:00</SelectItem>
            <SelectItem value="15:00">15:00</SelectItem>
            <SelectItem value="16:00">16:00</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instrucciones">Instrucciones Especiales</Label>
        <Input id="instrucciones" placeholder="Instrucciones para el chofer o transporte" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="notificar" />
        <Label htmlFor="notificar">Notificar al cliente y transportista</Label>
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#00334a] hover:bg-[#004a6b]">
        {isSubmitting ? "Guardando..." : "Guardar Asignación"}
      </Button>
    </div>
  )
}
