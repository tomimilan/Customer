"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { SortableHeader } from "@/components/ui/sortable-header"
import { User, Calendar, Shield, FileText } from "lucide-react"

interface AuditLogTableProps {
  searchTerm: string
  moduleFilter: string
  timeFilter: string
}

export function AuditLogTable({ searchTerm, moduleFilter, timeFilter }: AuditLogTableProps) {
  const [auditLogs] = useState([
    {
      id: "LOG-1001",
      usuario: "Admin",
      accion: "Inicio de sesión",
      modulo: "Autenticación",
      ip: "192.168.1.100",
      fecha: "14/07/2023 10:23:45",
      estado: "Exitoso",
    },
    {
      id: "LOG-1002",
      usuario: "Juan Pérez",
      accion: "Creación de carga",
      modulo: "Cargas",
      ip: "192.168.1.101",
      fecha: "14/07/2023 09:15:32",
      estado: "Exitoso",
    },
    {
      id: "LOG-1003",
      usuario: "María González",
      accion: "Asignación de transporte",
      modulo: "Asignación",
      ip: "192.168.1.102",
      fecha: "14/07/2023 08:45:18",
      estado: "Exitoso",
    },
    {
      id: "LOG-1004",
      usuario: "Carlos Rodríguez",
      accion: "Intento de acceso no autorizado",
      modulo: "Seguridad",
      ip: "192.168.1.103",
      fecha: "13/07/2023 16:30:22",
      estado: "Fallido",
    },
    {
      id: "LOG-1005",
      usuario: "Pedro Sánchez",
      accion: "Modificación de permisos",
      modulo: "Usuarios",
      ip: "192.168.1.104",
      fecha: "13/07/2023 15:12:05",
      estado: "Exitoso",
    },
  ])

  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedLogs = auditLogs
    .filter((log) => {
      const searchTermLower = (searchTerm || "").toLowerCase()
      const matchesSearch =
        (log.usuario || "").toLowerCase().includes(searchTermLower) ||
        (log.accion || "").toLowerCase().includes(searchTermLower) ||
        (log.modulo || "").toLowerCase().includes(searchTermLower)

      // Mapeo de filtros a valores exactos en los datos
      const moduleMapping: { [key: string]: string } = {
        autenticacion: "Autenticación",
        cargas: "Cargas",
        asignacion: "Asignación",
        auditoria: "Auditoría",
        usuarios: "Usuarios",
        flota: "Flota",
      }

      const matchesModule =
        !moduleFilter ||
        moduleFilter === "todos" ||
        log.modulo === moduleMapping[moduleFilter] ||
        log.modulo === moduleFilter

      const matchesTime =
        !timeFilter ||
        timeFilter === "todos" ||
        (timeFilter === "hoy" && (log.fecha || "").includes("14/07/2023")) ||
        (timeFilter === "semana" && (log.fecha || "").includes("2023")) ||
        (timeFilter === "mes" && (log.fecha || "").includes("07/2023"))

      return matchesSearch && matchesModule && matchesTime
    })
    .sort((a, b) => {
      if (!sortKey || !sortDirection) return 0

      let aValue = a[sortKey as keyof typeof a] || ""
      let bValue = b[sortKey as keyof typeof b] || ""

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader
            column="id"
            label="ID"
            icon={FileText}
            sortKey="id"
            currentSort={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            column="usuario"
            label="Usuario"
            icon={User}
            sortKey="usuario"
            currentSort={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            column="accion"
            label="Acción"
            icon={Shield}
            sortKey="accion"
            currentSort={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            column="modulo"
            label="Módulo"
            icon={FileText}
            sortKey="modulo"
            currentSort={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            column="fecha"
            label="Fecha"
            icon={Calendar}
            sortKey="fecha"
            currentSort={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAndSortedLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.id}</TableCell>
            <TableCell>{log.usuario}</TableCell>
            <TableCell>{log.accion}</TableCell>
            <TableCell>{log.modulo}</TableCell>
            <TableCell>{log.fecha}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
