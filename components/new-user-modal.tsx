"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Shield, Info, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewUserModal({ open, onOpenChange }: NewUserModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envío de correo (en un entorno real, esto sería una llamada a la API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Usuario creado exitosamente
          </div>
        ),
        description: `Se ha enviado un correo a ${formData.email} con instrucciones para establecer la contraseña.`,
      })

      // Resetear formulario
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        rol: "",
      })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error al crear usuario",
        description: "No se pudo enviar el correo de invitación. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Agregue un nuevo usuario al sistema. Se enviará un correo de invitación para establecer la contraseña.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Información de seguridad</AlertTitle>
            <AlertDescription className="text-blue-600">
              El usuario recibirá un correo con un enlace para establecer su propia contraseña. El enlace será válido
              por 24 horas.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre completo"
                  className="pl-10"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="telefono"
                  placeholder="+56 9 1234 5678"
                  className="pl-10"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                />
              </div>
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol *</Label>
            <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <SelectValue placeholder="Seleccione un rol" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="chofer">Chofer</SelectItem>
              </SelectContent>
            </Select>
            {errors.rol && <p className="text-sm text-red-500">{errors.rol}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]" disabled={isSubmitting}>
              {isSubmitting ? "Enviando invitación..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
