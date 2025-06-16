"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail, Phone, Clock } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  permissions: string
  status: string
  users: number
}

interface RoleUsersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

// Datos de ejemplo de usuarios por rol
const getUsersByRole = (roleName: string) => {
  const allUsers = [
    {
      id: "1",
      name: "Ana García",
      email: "ana.garcia@empresa.com",
      phone: "+56 9 8765 4321",
      lastAccess: "Hace 2 horas",
      status: "activo",
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos.lopez@empresa.com",
      phone: "+56 9 1234 5678",
      lastAccess: "Hace 1 día",
      status: "activo",
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria.rodriguez@empresa.com",
      phone: "+56 9 9876 5432",
      lastAccess: "Hace 3 horas",
      status: "activo",
    },
    {
      id: "4",
      name: "Juan Pérez",
      email: "juan.perez@empresa.com",
      phone: "+56 9 5555 1234",
      lastAccess: "Hace 5 días",
      status: "bloqueado",
    },
    {
      id: "5",
      name: "Laura Martínez",
      email: "laura.martinez@empresa.com",
      phone: "+56 9 7777 8888",
      lastAccess: "Hace 1 hora",
      status: "activo",
    },
  ]

  // Filtrar usuarios según el rol (simulación)
  switch (roleName?.toLowerCase()) {
    case "master":
      return allUsers.slice(0, 2)
    case "customer":
      return allUsers.slice(1, 4)
    case "traffic":
      return allUsers.slice(2, 5)
    case "transporte":
      return allUsers.slice(0, 3)
    case "chofer":
      return allUsers.slice(3, 5)
    default:
      return allUsers.slice(0, 3)
  }
}

export function RoleUsersModal({ open, onOpenChange, role }: RoleUsersModalProps) {
  const users = role ? getUsersByRole(role.name) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#00334a]" />
            Usuarios con rol: {role?.name}
          </DialogTitle>
          <DialogDescription>
            Lista de usuarios que tienen asignado este rol ({users.length} usuarios)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay usuarios asignados a este rol</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <Avatar>
                  <AvatarFallback className="bg-[#00334a] text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{user.name}</h4>
                    <Badge variant={user.status === "activo" ? "default" : "destructive"}>
                      {user.status === "activo" ? "Activo" : "Bloqueado"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Último acceso: {user.lastAccess}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
