"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function BackupSettings() {
  const [retentionDays, setRetentionDays] = useState([30])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Programación de Backups</h3>
        <p className="text-sm text-muted-foreground">
          Configure la frecuencia y horario de las copias de seguridad automáticas
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-backup">Backups automáticos</Label>
            <Switch id="auto-backup" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia</Label>
          <Select defaultValue="daily">
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Seleccionar frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Cada hora</SelectItem>
              <SelectItem value="daily">Diaria</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Hora del día</Label>
          <Select defaultValue="04:00">
            <SelectTrigger id="time">
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="00:00">00:00</SelectItem>
              <SelectItem value="01:00">01:00</SelectItem>
              <SelectItem value="02:00">02:00</SelectItem>
              <SelectItem value="03:00">03:00</SelectItem>
              <SelectItem value="04:00">04:00</SelectItem>
              <SelectItem value="05:00">05:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="day">Día de la semana (para backups semanales)</Label>
          <Select defaultValue="sunday">
            <SelectTrigger id="day">
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Lunes</SelectItem>
              <SelectItem value="tuesday">Martes</SelectItem>
              <SelectItem value="wednesday">Miércoles</SelectItem>
              <SelectItem value="thursday">Jueves</SelectItem>
              <SelectItem value="friday">Viernes</SelectItem>
              <SelectItem value="saturday">Sábado</SelectItem>
              <SelectItem value="sunday">Domingo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Retención y Almacenamiento</h3>
        <p className="text-sm text-muted-foreground">
          Configure por cuánto tiempo se conservan las copias de seguridad
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Días de retención: {retentionDays}</Label>
          </div>
          <Slider
            defaultValue={[30]}
            max={365}
            step={1}
            min={7}
            value={retentionDays}
            onValueChange={setRetentionDays}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación principal</Label>
          <Select defaultValue="local">
            <SelectTrigger id="location">
              <SelectValue placeholder="Seleccionar ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Servidor local</SelectItem>
              <SelectItem value="cloud">Nube</SelectItem>
              <SelectItem value="nas">NAS</SelectItem>
              <SelectItem value="external">Disco externo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="compression">Compresión</Label>
            <Switch id="compression" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="encryption">Cifrado</Label>
            <Switch id="encryption" defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Notificaciones</h3>
        <p className="text-sm text-muted-foreground">
          Configure las notificaciones relacionadas con las copias de seguridad
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="success-notification">Notificar backups exitosos</Label>
            <Switch id="success-notification" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="failure-notification">Notificar fallos</Label>
            <Switch id="failure-notification" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email para notificaciones</Label>
          <Input id="email" placeholder="admin@logicarga.com" />
        </div>
      </div>

      <Button className="bg-[#00334a] hover:bg-[#004a6b]">Guardar Configuración</Button>
    </div>
  )
}
