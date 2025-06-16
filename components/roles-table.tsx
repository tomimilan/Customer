"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Hash, User, FileText, Users, Shield } from "lucide-react"
import { EditRoleModal } from "./edit-role-modal"
import { RoleUsersModal } from "./role-users-modal"

interface Role {
  id: string
  nombre: string
  descripcion: string
  usuarios: number
  estado: string
}

interface RolesTableProps {
  onEditRole?: (role: Role) => void
}

export function RolesTable({ onEditRole }: RolesTableProps) {
  const [roles] = useState<Role[]>([
    {
      id: "ROL-1001",
      nombre: "Master",
      descripcion: "Supervisión general del sistema y administración de usuarios",
      usuarios: 3,
      estado: "Activo",
    },
    {
      id: "ROL-1002",
      nombre: "Customer",
      descripcion: "Enfocado en la generación y seguimiento de cargas propias",
      usuarios: 45,
      estado: "Activo",
    },
    {
      id: "ROL-1003",
      nombre: "Traffic",
      descripcion: "Coordinación operativa de cargas y recursos logísticos",
      usuarios: 12,
      estado: "Activo",
    },
    {
      id: "ROL-1004",
      nombre: "Transporte",
      descripcion: "Gestión de flotas, choferes y cargas asignadas",
      usuarios: 28,
      estado: "Activo",
    },
    {
      id: "ROL-1005",
      nombre: "Chofer",
      descripcion: "Ejecución del traslado y gestión de documentación asociada",
      usuarios: 40,
      estado: "Activo",
    },
  ])

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const handleRowClick = (role: Role) => {
    setSelectedRole(role)
    setShowUsersModal(true)
  }

  const getRoleBadgeStyle = (nombre: string) => {
    switch (nombre) {
      case "Master":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
      case "Customer":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      case "Traffic":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
      case "Transporte":
        return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
      case "Chofer":
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const getStatusBadgeStyle = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      case "Inactivo":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span>ID</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>Nombre</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>Descripción</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Usuarios</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>Estado</span>
              </div>
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleRowClick(role)}>
              <TableCell className="font-medium">{role.id}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeStyle(role.nombre)}>
                  {role.nombre}
                </Badge>
              </TableCell>
              <TableCell>{role.descripcion}</TableCell>
              <TableCell>
                <span className="font-medium text-blue-600">{role.usuarios}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeStyle(role.estado)}>
                  {role.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditRole(role)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRole && (
        <>
          <EditRoleModal role={selectedRole} open={showEditModal} onOpenChange={setShowEditModal} />
          <RoleUsersModal role={selectedRole} open={showUsersModal} onOpenChange={setShowUsersModal} />
        </>
      )}
    </>
  )
}
