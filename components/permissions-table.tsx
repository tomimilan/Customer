"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Edit,
  Trash2,
  Settings,
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  Truck,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PermissionsTable() {
  const { toast } = useToast()

  // Iconos separados de los datos
  const moduleIcons = {
    Dashboard: <LayoutDashboard className="h-4 w-4 mr-2" />,
    "Usuarios y Roles": <Users className="h-4 w-4 mr-2" />,
    "Gestión de Cargas": <Package className="h-4 w-4 mr-2" />,
    "Asignación Operativa": <Calendar className="h-4 w-4 mr-2" />,
    "Gestión de Transporte": <Truck className="h-4 w-4 mr-2" />,
  }

  const [originalPermissions] = useState([
    {
      modulo: "Dashboard",
      permisos: {
        Master: { ver: true, editar: true, eliminar: true, administrar: true },
        Customer: { ver: true, editar: false, eliminar: false, administrar: false },
        Traffic: { ver: true, editar: false, eliminar: false, administrar: false },
        Transporte: { ver: true, editar: false, eliminar: false, administrar: false },
        Chofer: { ver: true, editar: false, eliminar: false, administrar: false },
      },
    },
    {
      modulo: "Usuarios y Roles",
      permisos: {
        Master: { ver: true, editar: true, eliminar: true, administrar: true },
        Customer: { ver: false, editar: false, eliminar: false, administrar: false },
        Traffic: { ver: false, editar: false, eliminar: false, administrar: false },
        Transporte: { ver: false, editar: false, eliminar: false, administrar: false },
        Chofer: { ver: false, editar: false, eliminar: false, administrar: false },
      },
    },
    {
      modulo: "Gestión de Cargas",
      permisos: {
        Master: { ver: true, editar: true, eliminar: true, administrar: true },
        Customer: { ver: true, editar: true, eliminar: true, administrar: false },
        Traffic: { ver: true, editar: true, eliminar: false, administrar: false },
        Transporte: { ver: true, editar: false, eliminar: false, administrar: false },
        Chofer: { ver: true, editar: false, eliminar: false, administrar: false },
      },
    },
    {
      modulo: "Asignación Operativa",
      permisos: {
        Master: { ver: true, editar: true, eliminar: true, administrar: true },
        Customer: { ver: true, editar: false, eliminar: false, administrar: false },
        Traffic: { ver: true, editar: true, eliminar: false, administrar: false },
        Transporte: { ver: true, editar: true, eliminar: false, administrar: false },
        Chofer: { ver: true, editar: false, eliminar: false, administrar: false },
      },
    },
    {
      modulo: "Gestión de Transporte",
      permisos: {
        Master: { ver: true, editar: true, eliminar: true, administrar: true },
        Customer: { ver: true, editar: false, eliminar: false, administrar: false },
        Traffic: { ver: true, editar: true, eliminar: false, administrar: false },
        Transporte: { ver: true, editar: true, eliminar: true, administrar: false },
        Chofer: { ver: true, editar: false, eliminar: false, administrar: false },
      },
    },
  ])

  const [permissions, setPermissions] = useState(originalPermissions)
  const [isSaving, setIsSaving] = useState(false)

  const togglePermission = (moduloIndex: number, rol: string, permiso: string) => {
    setPermissions((prev) => {
      const newPermissions = [...prev]
      newPermissions[moduloIndex] = {
        ...newPermissions[moduloIndex],
        permisos: {
          ...newPermissions[moduloIndex].permisos,
          [rol]: {
            ...newPermissions[moduloIndex].permisos[rol],
            [permiso]: !newPermissions[moduloIndex].permisos[rol][permiso],
          },
        },
      }
      return newPermissions
    })
  }

  const isPermissionChanged = (moduloIndex: number, rol: string, permiso: string) => {
    const original = originalPermissions[moduloIndex].permisos[rol][permiso]
    const current = permissions[moduloIndex].permisos[rol][permiso]
    return original !== current
  }

  const hasChanges = () => {
    // Comparar solo los datos de permisos, sin los iconos
    for (let i = 0; i < originalPermissions.length; i++) {
      const original = originalPermissions[i].permisos
      const current = permissions[i].permisos

      for (const rol in original) {
        for (const permiso in original[rol]) {
          if (original[rol][permiso] !== current[rol][permiso]) {
            return true
          }
        }
      }
    }
    return false
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Actualizar los permisos originales con los nuevos
    for (let i = 0; i < originalPermissions.length; i++) {
      originalPermissions[i].permisos = { ...permissions[i].permisos }
    }

    setIsSaving(false)

    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Cambios guardados
        </div>
      ),
      description: "Los permisos han sido actualizados exitosamente.",
    })
  }

  const getButtonStyle = (isActive: boolean, isChanged: boolean) => {
    if (isChanged && isActive) {
      // Nuevo permiso activado (pendiente de guardar)
      return "border-blue-500 text-blue-600 bg-blue-50 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-200"
    } else if (isChanged && !isActive) {
      // Permiso desactivado (pendiente de guardar)
      return "border-red-300 text-red-400 bg-red-50 hover:border-red-400 hover:text-red-500 hover:bg-red-100 transition-all duration-200"
    } else if (isActive) {
      // Permiso activo guardado
      return "border-slate-700 text-slate-700 hover:border-slate-800 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200"
    } else {
      // Permiso inactivo
      return "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all duration-200"
    }
  }

  const getIconStyle = (isActive: boolean, isChanged: boolean) => {
    if (isChanged && isActive) {
      return "text-blue-600 group-hover:text-blue-700 transition-colors duration-200"
    } else if (isChanged && !isActive) {
      return "text-red-400 group-hover:text-red-500 transition-colors duration-200"
    } else if (isActive) {
      return "text-slate-700 group-hover:text-slate-800 transition-colors duration-200"
    } else {
      return "text-slate-400 group-hover:text-slate-500 transition-colors duration-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={handleSave} disabled={!hasChanges() || isSaving}>
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Módulo</TableHead>
              <TableHead className="text-center">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                  Master
                </Badge>
              </TableHead>
              <TableHead className="text-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  Customer
                </Badge>
              </TableHead>
              <TableHead className="text-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                >
                  Traffic
                </Badge>
              </TableHead>
              <TableHead className="text-center">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                  Transporte
                </Badge>
              </TableHead>
              <TableHead className="text-center">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
                  Chofer
                </Badge>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission, moduloIndex) => (
              <TableRow key={permission.modulo}>
                <TableCell className="font-medium flex items-center">
                  {moduleIcons[permission.modulo]}
                  {permission.modulo}
                </TableCell>
                {Object.entries(permission.permisos).map(([rol, permisos]) => (
                  <TableCell key={rol}>
                    <div className="flex flex-col items-center space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-20 h-8 text-xs group ${getButtonStyle(
                          permisos.ver,
                          isPermissionChanged(moduloIndex, rol, "ver"),
                        )}`}
                        onClick={() => togglePermission(moduloIndex, rol, "ver")}
                      >
                        <Eye
                          className={`h-3 w-3 mr-1 ${getIconStyle(
                            permisos.ver,
                            isPermissionChanged(moduloIndex, rol, "ver"),
                          )}`}
                        />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-20 h-8 text-xs group ${getButtonStyle(
                          permisos.editar,
                          isPermissionChanged(moduloIndex, rol, "editar"),
                        )}`}
                        onClick={() => togglePermission(moduloIndex, rol, "editar")}
                      >
                        <Edit
                          className={`h-3 w-3 mr-1 ${getIconStyle(
                            permisos.editar,
                            isPermissionChanged(moduloIndex, rol, "editar"),
                          )}`}
                        />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-20 h-8 text-xs group ${getButtonStyle(
                          permisos.eliminar,
                          isPermissionChanged(moduloIndex, rol, "eliminar"),
                        )}`}
                        onClick={() => togglePermission(moduloIndex, rol, "eliminar")}
                      >
                        <Trash2
                          className={`h-3 w-3 mr-1 ${getIconStyle(
                            permisos.eliminar,
                            isPermissionChanged(moduloIndex, rol, "eliminar"),
                          )}`}
                        />
                        Eliminar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-20 h-8 text-xs group ${getButtonStyle(
                          permisos.administrar,
                          isPermissionChanged(moduloIndex, rol, "administrar"),
                        )}`}
                        onClick={() => togglePermission(moduloIndex, rol, "administrar")}
                      >
                        <Settings
                          className={`h-3 w-3 mr-1 ${getIconStyle(
                            permisos.administrar,
                            isPermissionChanged(moduloIndex, rol, "administrar"),
                          )}`}
                        />
                        Admin
                      </Button>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
