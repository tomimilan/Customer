"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Mail, Phone, Shield, User, CheckCircle } from "lucide-react"

interface UserType {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: string
  ultimoAcceso: string
  estado: string
}

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserType | null
}

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    estado: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        estado: user.estado,
      })
    }
  }, [user])

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

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido"
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
      // Simular actualización del usuario
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Usuario actualizado exitosamente
          </div>
        ),
        description: `Los datos de ${formData.nombre} han sido actualizados.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error al actualizar usuario",
        description: "No se pudieron guardar los cambios. Intente nuevamente.",
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

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifique los datos del usuario {user.nombre}. Los cambios se guardarán inmediatamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Traffic">Traffic</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Chofer">Chofer</SelectItem>
                </SelectContent>
              </Select>
              {errors.rol && <p className="text-sm text-red-500">{errors.rol}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
