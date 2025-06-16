"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Lock, MoreHorizontal, Pencil, Shield, Trash } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Hash, User, Mail, ShieldIcon, Clock, Key, CheckCircle } from "lucide-react"

export function SecurityUsers() {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [users] = useState([
    {
      id: "USR-1001",
      nombre: "Admin",
      email: "admin@logicarga.com",
      rol: "Master",
      ultimoAcceso: "Hoy, 10:23",
      autenticacion: "2FA",
      estado: "Activo",
    },
    {
      id: "USR-1002",
      nombre: "Juan Pérez",
      email: "juan@transportesrapidos.com",
      rol: "Transporte",
      ultimoAcceso: "Hoy, 09:15",
      autenticacion: "2FA",
      estado: "Activo",
    },
    {
      id: "USR-1003",
      nombre: "María González",
      email: "maria@logisticadelsur.com",
      rol: "Traffic",
      ultimoAcceso: "Ayer, 16:45",
      autenticacion: "Password",
      estado: "Activo",
    },
    {
      id: "USR-1004",
      nombre: "Carlos Rodríguez",
      email: "carlos@importadoraandina.com",
      rol: "Customer",
      ultimoAcceso: "15/07/2023",
      autenticacion: "Password",
      estado: "Bloqueado",
    },
    {
      id: "USR-1005",
      nombre: "Roberto Sánchez",
      email: "roberto@transportesandinos.com",
      rol: "Chofer",
      ultimoAcceso: "Hoy, 08:30",
      autenticacion: "Password",
      estado: "Activo",
    },
  ])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader label="Nombre" sortKey="nombre" icon={User} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader label="Email" sortKey="email" icon={Mail} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader label="Rol" sortKey="rol" icon={ShieldIcon} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader
            label="Último Acceso"
            sortKey="ultimoAcceso"
            icon={Clock}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <SortableHeader
            label="Autenticación"
            sortKey="autenticacion"
            icon={Key}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <SortableHeader
            label="Estado"
            sortKey="estado"
            icon={CheckCircle}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.nombre}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                className={
                  user.rol === "Master"
                    ? "bg-purple-500"
                    : user.rol === "Customer"
                      ? "bg-blue-500"
                      : user.rol === "Traffic"
                        ? "bg-green-500"
                        : user.rol === "Transporte"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                }
              >
                {user.rol}
              </Badge>
            </TableCell>
            <TableCell>{user.ultimoAcceso}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  user.autenticacion === "2FA" ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                }
              >
                {user.autenticacion}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={user.estado === "Activo" ? "bg-green-500" : "bg-red-500"}>{user.estado}</Badge>
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
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Permisos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.estado === "Activo" ? (
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" />
                      Bloquear
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" />
                      Desbloquear
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
