"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function CardsForm() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cargoType, setCargoType] = useState("")

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulación de envío de formulario
    setTimeout(() => {
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Información General</h3>
        <p className="text-sm text-muted-foreground">Datos básicos de la carga</p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select>
            <SelectTrigger id="cliente">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="importadora-andina">Importadora Andina S.A.</SelectItem>
              <SelectItem value="distribuidora-central">Distribuidora Central</SelectItem>
              <SelectItem value="vinedos-argentinos">Viñedos Argentinos</SelectItem>
              <SelectItem value="exportadora-plata">Exportadora del Plata</SelectItem>
              <SelectItem value="agroindustrias-centro">Agroindustrias del Centro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Carga</Label>
          <Select onValueChange={setCargoType}>
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Seleccionar tipo de carga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exportacion-maritima">Exportación Marítima</SelectItem>
              <SelectItem value="exportacion-terrestre">Exportación Terrestre</SelectItem>
              <SelectItem value="importacion-maritima">Importación Marítima</SelectItem>
              <SelectItem value="importacion-terrestre">Importación Terrestre</SelectItem>
              <SelectItem value="puesta-fob">Puesta FOB</SelectItem>
              <SelectItem value="carga-nacional">Carga Nacional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {cargoType && (
        <>
          <div>
            <h3 className="text-lg font-medium">
              {cargoType === "carga-nacional" ? "Ubicaciones" : "Datos Específicos"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {cargoType === "carga-nacional"
                ? "Lugares de carga y entrega"
                : "Información específica del tipo de carga"}
            </p>
          </div>
          <Separator />

          {/* Campos específicos por tipo de carga */}
          {(cargoType === "exportacion-maritima" || cargoType === "exportacion-terrestre") && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trader">Trader *</Label>
                <Select>
                  <SelectTrigger id="trader">
                    <SelectValue placeholder="Seleccionar Trader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader1">Trader 1</SelectItem>
                    <SelectItem value="trader2">Trader 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipper">
                  {cargoType === "exportacion-terrestre" ? "Shipper / Exportador" : "Shipper"} *
                </Label>
                <Select>
                  <SelectTrigger id="shipper">
                    <SelectValue placeholder="Seleccionar Shipper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipper1">Shipper 1</SelectItem>
                    <SelectItem value="shipper2">Shipper 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {(cargoType === "importacion-maritima" || cargoType === "importacion-terrestre") && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bl-hbl">{cargoType === "importacion-maritima" ? "BL/HBL" : "Referencia"}</Label>
                <Input id="bl-hbl" placeholder="Acepta números, letras y símbolos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trader">Trader *</Label>
                <Select>
                  <SelectTrigger id="trader">
                    <SelectValue placeholder="Seleccionar Trader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader1">Trader 1</SelectItem>
                    <SelectItem value="trader2">Trader 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="importador">
                  {cargoType === "importacion-terrestre" ? "Consignee / Importador" : "Importador"}
                </Label>
                <Select>
                  <SelectTrigger id="importador">
                    <SelectValue placeholder="Seleccionar Importador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="importador1">Importador 1</SelectItem>
                    <SelectItem value="importador2">Importador 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {cargoType === "puesta-fob" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trader">Trader *</Label>
                <Select>
                  <SelectTrigger id="trader">
                    <SelectValue placeholder="Seleccionar Trader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader1">Trader 1</SelectItem>
                    <SelectItem value="trader2">Trader 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipper">Shipper *</Label>
                <Select>
                  <SelectTrigger id="shipper">
                    <SelectValue placeholder="Seleccionar Shipper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipper1">Shipper 1</SelectItem>
                    <SelectItem value="shipper2">Shipper 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {cargoType === "carga-nacional" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trader">Trader *</Label>
                <Select>
                  <SelectTrigger id="trader">
                    <SelectValue placeholder="Seleccionar Trader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trader1">Trader 1</SelectItem>
                    <SelectItem value="trader2">Trader 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Seleccionar Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente1">Cliente 1</SelectItem>
                    <SelectItem value="cliente2">Cliente 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </>
      )}

      {cargoType && (
        <>
          <div>
            <h3 className="text-lg font-medium">Características Especiales</h3>
            <p className="text-sm text-muted-foreground">Condiciones especiales de la carga</p>
          </div>
          <Separator />

          {/* TARA/SENASA para importaciones terrestres */}
          {cargoType === "importacion-terrestre" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senasa">SENASA</Label>
                <Select>
                  <SelectTrigger id="senasa">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tara">TARA</Label>
                <Select>
                  <SelectTrigger id="tara">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* TARA para otros tipos */}
          {(cargoType === "exportacion-maritima" ||
            cargoType === "exportacion-terrestre" ||
            cargoType === "importacion-maritima" ||
            cargoType === "puesta-fob") && (
            <div className="space-y-2">
              <Label htmlFor="tara">TARA</Label>
              <Select>
                <SelectTrigger id="tara">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Checkboxes para tipos especiales */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="extramedida" className="rounded" />
              <Label htmlFor="extramedida">Extramedida</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="imo" className="rounded" />
              <Label htmlFor="imo">IMO</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="refrigerada" className="rounded" />
              <Label htmlFor="refrigerada">Refrigerada</Label>
            </div>
          </div>

          {/* Dimensiones para exportaciones marítimas */}
          {cargoType === "exportacion-maritima" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="alto">Alto</Label>
                <Input id="alto" type="number" step="0.01" placeholder="1.30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ancho">Ancho</Label>
                <Input id="ancho" type="number" step="0.01" placeholder="1.30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="largo">Largo</Label>
                <Input id="largo" type="number" step="0.01" placeholder="1.30" />
              </div>
            </div>
          )}

          {/* Condiciones ambientales para exportaciones marítimas */}
          {cargoType === "exportacion-maritima" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura</Label>
                <Input id="temperatura" type="number" step="0.01" placeholder="1.30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humedad">Humedad</Label>
                <Input id="humedad" type="number" step="0.01" placeholder="1.30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ventilacion">Ventilación</Label>
                <Input id="ventilacion" type="number" step="0.01" placeholder="1.30" />
              </div>
            </div>
          )}

          {/* Campos específicos para FOB */}
          {cargoType === "puesta-fob" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="armador">Armador</Label>
                <Select>
                  <SelectTrigger id="armador">
                    <SelectValue placeholder="Seleccionar Línea Oceánica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="armador1">Armador 1</SelectItem>
                    <SelectItem value="armador2">Armador 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vessel">Vessel</Label>
                <Input id="vessel" placeholder="Buque" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voyage">Voyage</Label>
                <Input id="voyage" placeholder="Viaje" />
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <h3 className="text-lg font-medium">Características de la Carga</h3>
        <p className="text-sm text-muted-foreground">Detalles físicos y logísticos</p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input id="peso" type="number" placeholder="Peso en kilogramos" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="volumen">Volumen (m³)</Label>
          <Input id="volumen" type="number" placeholder="Volumen en metros cúbicos" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bultos">Cantidad de Bultos</Label>
          <Input id="bultos" type="number" placeholder="Número de bultos" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción de la Carga</Label>
        <Textarea id="descripcion" placeholder="Descripción detallada de la mercadería" />
      </div>

      <div>
        <h3 className="text-lg font-medium">Fechas y Plazos</h3>
        <p className="text-sm text-muted-foreground">Programación temporal de la carga</p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
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
          <Label htmlFor="fecha-entrega">Fecha Estimada de Entrega</Label>
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
      </div>

      <div>
        <h3 className="text-lg font-medium">Información Adicional</h3>
        <p className="text-sm text-muted-foreground">Otros datos relevantes</p>
      </div>
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="instrucciones">Instrucciones Especiales</Label>
        <Textarea id="instrucciones" placeholder="Instrucciones para el manejo de la carga" />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#00334a] hover:bg-[#004a6b]">
        {isSubmitting ? "Guardando..." : "Crear Carga"}
      </Button>
    </div>
  )
}
