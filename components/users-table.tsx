"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Hash, User, Mail, ShieldIcon, Phone, Clock, CheckCircle } from "lucide-react"
import { EditUserModal } from "@/components/edit-user-modal"

interface UsersTableProps {
  searchTerm?: string
  roleFilter?: string
  statusFilter?: string
}

interface SortConfig {
  key: string
  direction: "asc" | "desc" | null
}

export interface UserType {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: string
  ultimoAcceso: string
  estado: string
}

export function UsersTable({ searchTerm = "", roleFilter = "todos", statusFilter = "todos" }: UsersTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: null })
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [users] = useState<UserType[]>([
    {
      id: "USR-1001",
      nombre: "Admin",
      email: "admin@logicarga.com",
      telefono: "+56 9 8765 4321",
      rol: "Master",
      ultimoAcceso: "Hoy, 10:23",
      estado: "Activo",
    },
    {
      id: "USR-1002",
      nombre: "Juan Pérez",
      email: "juan@transportesrapidos.com",
      telefono: "+56 9 1234 5678",
      rol: "Transporte",
      ultimoAcceso: "Hoy, 09:15",
      estado: "Activo",
    },
    {
      id: "USR-1003",
      nombre: "María González",
      email: "maria@logisticadelsur.com",
      telefono: "+56 9 9876 5432",
      rol: "Traffic",
      ultimoAcceso: "Ayer, 16:45",
      estado: "Activo",
    },
    {
      id: "USR-1004",
      nombre: "Carlos Rodríguez",
      email: "carlos@importadoraandina.com",
      telefono: "+56 9 5555 1234",
      rol: "Customer",
      ultimoAcceso: "15/07/2023",
      estado: "Bloqueado",
    },
    {
      id: "USR-1005",
      nombre: "Pedro Sánchez",
      email: "pedro@transportesdelnorte.com",
      telefono: "+56 9 7777 8888",
      rol: "Chofer",
      ultimoAcceso: "Hoy, 08:30",
      estado: "Activo",
    },
  ])

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      } else {
        direction = "asc"
      }
    }

    setSortConfig({ key, direction })
  }

  const handleEditUser = (user: UserType) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const getRoleBadgeStyle = (rol: string) => {
    switch (rol) {
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
      case "Bloqueado":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const filteredUsers = users
    .filter((user) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefono.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de rol
      const matchesRole = roleFilter === "todos" || user.rol.toLowerCase() === roleFilter.toLowerCase()

      // Filtro de estado
      const matchesStatus = statusFilter === "todos" || user.estado.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      if (!sortConfig.key || !sortConfig.direction) return 0

      const aValue = a[sortConfig.key as keyof typeof a]
      const bValue = b[sortConfig.key as keyof typeof b]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              column="id"
              label="ID"
              sortKey="id"
              icon={Hash}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="nombre"
              label="Nombre"
              sortKey="nombre"
              icon={User}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="email"
              label="Email"
              sortKey="email"
              icon={Mail}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="telefono"
              label="Teléfono"
              sortKey="telefono"
              icon={Phone}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="rol"
              label="Rol"
              sortKey="rol"
              icon={ShieldIcon}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="ultimoAcceso"
              label="Último Acceso"
              sortKey="ultimoAcceso"
              icon={Clock}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <SortableHeader
              column="estado"
              label="Estado"
              sortKey="estado"
              icon={CheckCircle}
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
            />
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telefono}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeStyle(user.rol)}>
                  {user.rol}
                </Badge>
              </TableCell>
              <TableCell>{user.ultimoAcceso}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeStyle(user.estado)}>
                  {user.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
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

      <EditUserModal open={showEditModal} onOpenChange={setShowEditModal} user={editingUser} />
    </>
  )
}
