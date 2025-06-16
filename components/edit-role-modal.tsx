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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Shield, FileText, CheckCircle } from "lucide-react"

interface Role {
  id: string
  nombre: string
  descripcion: string
  usuarios: number
  estado: string
}

interface EditRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export function EditRoleModal({ open, onOpenChange, role }: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "activo",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.nombre || "",
        description: role.descripcion || "",
        status: role.estado?.toLowerCase() || "activo",
      })
    }
  }, [role])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del rol es requerido"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simular actualización del rol
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Rol actualizado exitosamente
          </div>
        ),
        description: `El rol "${formData.name}" ha sido actualizado correctamente.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#00334a]" />
            Editar Rol
          </DialogTitle>
          <DialogDescription>
            Modifique la información del rol seleccionado. Los permisos se configuran en la matriz de permisos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="name"
                placeholder="Ej: Supervisor de Operaciones"
                className="pl-10"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="description"
                placeholder="Describe las responsabilidades y funciones de este rol..."
                className="pl-10 min-h-[80px]"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
