"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  LogIn,
  Edit,
  AlertTriangle,
  Settings,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  User,
  Activity,
  Monitor,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react"

interface AuditEvent {
  id: string
  usuario: string
  accion: string
  modulo: string
  ip: string
  fecha: string
  estado: "exitoso" | "fallido"
  detalles?: string
}

interface SortConfig {
  key: keyof AuditEvent | null
  direction: "asc" | "desc" | null
}

export function AuditAccessTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventFilter, setEventFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState("todos")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })

  const auditEvents: AuditEvent[] = [
    {
      id: "AUD-001",
      usuario: "Carlos Mendoza",
      accion: "Inicio de sesión",
      modulo: "Sistema",
      ip: "192.168.1.45",
      fecha: "2024-01-15 09:30:15",
      estado: "exitoso",
    },
    {
      id: "AUD-002",
      usuario: "Ana García",
      accion: "Creó nueva carga",
      modulo: "Cargas",
      ip: "192.168.1.67",
      fecha: "2024-01-15 10:15:22",
      estado: "exitoso",
      detalles: "Carga #CRG-2024-001",
    },
    {
      id: "AUD-003",
      usuario: "Luis Torres",
      accion: "Intento de acceso fallido",
      modulo: "Sistema",
      ip: "203.45.67.89",
      fecha: "2024-01-15 11:45:33",
      estado: "fallido",
      detalles: "Contraseña incorrecta",
    },
    {
      id: "AUD-004",
      usuario: "María López",
      accion: "Asignó transporte",
      modulo: "Asignación",
      ip: "192.168.1.23",
      fecha: "2024-01-15 14:20:10",
      estado: "exitoso",
      detalles: "Vehículo VH-001 a Carga CRG-2024-001",
    },
    {
      id: "AUD-005",
      usuario: "Pedro Ruiz",
      accion: "Modificó permisos",
      modulo: "Usuarios",
      ip: "192.168.1.12",
      fecha: "2024-01-15 15:30:45",
      estado: "exitoso",
      detalles: "Usuario: Ana García",
    },
    {
      id: "AUD-006",
      usuario: "Sistema",
      accion: "Backup automático",
      modulo: "Sistema",
      ip: "127.0.0.1",
      fecha: "2024-01-15 02:00:00",
      estado: "exitoso",
    },
    {
      id: "AUD-007",
      usuario: "Carlos Mendoza",
      accion: "Exportó reporte",
      modulo: "Reportes",
      ip: "192.168.1.45",
      fecha: "2024-01-15 16:45:12",
      estado: "exitoso",
      detalles: "Reporte de cargas mensuales",
    },
    {
      id: "AUD-008",
      usuario: "Desconocido",
      accion: "Intento de acceso no autorizado",
      modulo: "Sistema",
      ip: "185.234.72.45",
      fecha: "2024-01-15 18:22:33",
      estado: "fallido",
      detalles: "IP bloqueada automáticamente",
    },
  ]

  const getActionIcon = (accion: string) => {
    if (accion.includes("Inicio de sesión")) return <LogIn className="h-4 w-4" />
    if (accion.includes("Creó") || accion.includes("Asignó")) return <Edit className="h-4 w-4" />
    if (accion.includes("Intento") || accion.includes("fallido")) return <AlertTriangle className="h-4 w-4" />
    if (accion.includes("Modificó") || accion.includes("permisos")) return <Settings className="h-4 w-4" />
    if (accion.includes("Backup") || accion.includes("automático")) return <Calendar className="h-4 w-4" />
    return <Eye className="h-4 w-4" />
  }

  const getStatusBadgeStyle = (estado: string) => {
    switch (estado) {
      case "exitoso":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      case "fallido":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const handleSort = (key: keyof AuditEvent) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key: direction ? key : null, direction })
  }

  const getSortIcon = (key: keyof AuditEvent) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-gray-300" />
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="h-3 w-3" />
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown className="h-3 w-3" />
    }
    return <ArrowUpDown className="h-3 w-3 text-gray-300" />
  }

  const filteredEvents = auditEvents.filter((event) => {
    const matchesSearch =
      event.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip.includes(searchTerm)

    let matchesEvent = true
    if (eventFilter !== "todos") {
      matchesEvent = event.accion === eventFilter
    }

    const matchesStatus = statusFilter === "todos" || event.estado === statusFilter

    let matchesDate = true
    if (dateFilter !== "todos") {
      const eventDate = new Date(event.fecha)
      const today = new Date()
      const diffInDays = Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 3600 * 24))

      if (dateFilter === "hoy") {
        matchesDate = diffInDays === 0
      } else if (dateFilter === "semana") {
        matchesDate = diffInDays <= 7
      } else if (dateFilter === "mes") {
        matchesDate = diffInDays <= 30
      }
    }

    return matchesSearch && matchesEvent && matchesStatus && matchesDate
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const uniqueActions = [...new Set(auditEvents.map((event) => event.accion))]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
        <div className="w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar en auditoría..."
              className="pl-10 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {uniqueActions.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="exitoso">Exitoso</SelectItem>
            <SelectItem value="fallido">Fallido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="hoy">Hoy</SelectItem>
            <SelectItem value="semana">Última semana</SelectItem>
            <SelectItem value="mes">Último mes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("id")}>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span>ID</span>
                  {getSortIcon("id")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("usuario")}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Usuario</span>
                  {getSortIcon("usuario")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("accion")}>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span>Acción</span>
                  {getSortIcon("accion")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("modulo")}>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-gray-500" />
                  <span>Módulo</span>
                  {getSortIcon("modulo")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("ip")}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>IP</span>
                  {getSortIcon("ip")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("fecha")}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Fecha y Hora</span>
                  {getSortIcon("fecha")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span>Estado</span>
                </div>
              </TableHead>
              <TableHead className="w-[50px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map((event) => (
              <TableRow key={event.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{event.id}</TableCell>
                <TableCell>{event.usuario}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionIcon(event.accion)}
                    <span>{event.accion}</span>
                  </div>
                </TableCell>
                <TableCell>{event.modulo}</TableCell>
                <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                <TableCell className="font-mono text-sm">{event.fecha}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeStyle(event.estado)}>
                    {event.estado === "exitoso" ? "Exitoso" : "Fallido"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
