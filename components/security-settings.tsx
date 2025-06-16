"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function SecuritySettings() {
  const [passwordLength, setPasswordLength] = useState([12])
  const [sessionTimeout, setSessionTimeout] = useState([30])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Políticas de Contraseña</h3>
        <p className="text-sm text-muted-foreground">
          Configure los requisitos de seguridad para las contraseñas de los usuarios
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Longitud mínima: {passwordLength} caracteres</Label>
          </div>
          <Slider
            defaultValue={[12]}
            max={20}
            step={1}
            min={8}
            value={passwordLength}
            onValueChange={setPasswordLength}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="uppercase">Requerir mayúsculas</Label>
            <Switch id="uppercase" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers">Requerir números</Label>
            <Switch id="numbers" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="special">Requerir caracteres especiales</Label>
            <Switch id="special" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiration">Expiración de contraseña</Label>
          <Select defaultValue="90">
            <SelectTrigger id="expiration">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 días</SelectItem>
              <SelectItem value="60">60 días</SelectItem>
              <SelectItem value="90">90 días</SelectItem>
              <SelectItem value="180">180 días</SelectItem>
              <SelectItem value="never">Nunca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Autenticación</h3>
        <p className="text-sm text-muted-foreground">Configure los métodos de autenticación y seguridad de sesiones</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa">Requerir autenticación de dos factores (2FA)</Label>
            <Switch id="2fa" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ip-restriction">Restricción por IP</Label>
            <Switch id="ip-restriction" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="allowed-ips">IPs permitidas</Label>
          <Input id="allowed-ips" placeholder="Ej: 192.168.1.0/24, 10.0.0.0/8" />
          <p className="text-xs text-muted-foreground">Separar múltiples IPs o rangos con comas</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Tiempo de inactividad: {sessionTimeout} minutos</Label>
          </div>
          <Slider
            defaultValue={[30]}
            max={120}
            step={5}
            min={5}
            value={sessionTimeout}
            onValueChange={setSessionTimeout}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Auditoría</h3>
        <p className="text-sm text-muted-foreground">Configure las opciones de registro y auditoría</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-audit">Registrar intentos de inicio de sesión</Label>
            <Switch id="login-audit" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="action-audit">Registrar acciones de usuarios</Label>
            <Switch id="action-audit" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-audit">Registrar cambios en datos</Label>
            <Switch id="data-audit" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="retention">Retención de registros</Label>
          <Select defaultValue="365">
            <SelectTrigger id="retention">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 días</SelectItem>
              <SelectItem value="90">90 días</SelectItem>
              <SelectItem value="180">180 días</SelectItem>
              <SelectItem value="365">1 año</SelectItem>
              <SelectItem value="730">2 años</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="bg-[#00334a] hover:bg-[#004a6b]">Guardar Configuración</Button>
    </div>
  )
}
