"use client"

import { useState, useMemo } from "react"
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
import { Download, Eye, MoreHorizontal, RotateCcw, Trash } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Hash, Settings, Calendar, HardDrive, Clock, MapPin, CheckCircle } from "lucide-react"

interface BackupHistoryProps {
  searchTerm?: string
  typeFilter?: string
  statusFilter?: string
}

export function BackupHistory({ searchTerm = "", typeFilter = "todos", statusFilter = "todos" }: BackupHistoryProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [backups] = useState([
    {
      id: "BKP-1001",
      tipo: "Automático",
      fecha: "14/07/2023 04:00:00",
      tamaño: "45.2 GB",
      duracion: "12 minutos",
      ubicacion: "Servidor Principal",
      estado: "Completado",
    },
    {
      id: "BKP-1002",
      tipo: "Automático",
      fecha: "13/07/2023 04:00:00",
      tamaño: "44.8 GB",
      duracion: "11 minutos",
      ubicacion: "Servidor Principal",
      estado: "Completado",
    },
    {
      id: "BKP-1003",
      tipo: "Manual",
      fecha: "12/07/2023 15:30:00",
      tamaño: "45.0 GB",
      duracion: "12 minutos",
      ubicacion: "Servidor Principal",
      estado: "Completado",
    },
    {
      id: "BKP-1004",
      tipo: "Automático",
      fecha: "12/07/2023 04:00:00",
      tamaño: "44.5 GB",
      duracion: "11 minutos",
      ubicacion: "Servidor Principal",
      estado: "Completado",
    },
    {
      id: "BKP-1005",
      tipo: "Automático",
      fecha: "11/07/2023 04:00:00",
      tamaño: "44.3 GB",
      duracion: "15 minutos",
      ubicacion: "Servidor Principal",
      estado: "Con advertencias",
    },
  ])

  const filteredAndSortedBackups = useMemo(() => {
    const filtered = backups.filter((backup) => {
      const matchesSearch =
        !searchTerm ||
        backup.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backup.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backup.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType =
        typeFilter === "todos" ||
        backup.tipo.toLowerCase() === (typeFilter === "automatico" ? "automático" : typeFilter).toLowerCase()

      const statusMap: { [key: string]: string } = {
        exitoso: "Completado",
        fallido: "Fallido",
        "en-proceso": "En Proceso",
        "con-advertencias": "Con advertencias",
      }

      const matchesStatus = statusFilter === "todos" || backup.estado === (statusMap[statusFilter] || statusFilter)

      return matchesSearch && matchesType && matchesStatus
    })

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a] || ""
        const bValue = b[sortConfig.key as keyof typeof b] || ""

        if (sortConfig.direction === "asc") {
          return aValue.toString().localeCompare(bValue.toString())
        } else {
          return bValue.toString().localeCompare(aValue.toString())
        }
      })
    }

    return filtered
  }, [backups, searchTerm, typeFilter, statusFilter, sortConfig])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader label="Tipo" sortKey="tipo" icon={Settings} sortConfig={sortConfig} onSort={setSortConfig} />
          <SortableHeader
            label="Fecha"
            sortKey="fecha"
            icon={Calendar}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <SortableHeader
            label="Tamaño"
            sortKey="tamaño"
            icon={HardDrive}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <SortableHeader
            label="Duración"
            sortKey="duracion"
            icon={Clock}
            sortConfig={sortConfig}
            onSort={setSortConfig}
          />
          <SortableHeader
            label="Ubicación"
            sortKey="ubicacion"
            icon={MapPin}
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
        {filteredAndSortedBackups.map((backup) => (
          <TableRow key={backup.id}>
            <TableCell className="font-medium">{backup.id}</TableCell>
            <TableCell>{backup.tipo}</TableCell>
            <TableCell>{backup.fecha}</TableCell>
            <TableCell>{backup.tamaño}</TableCell>
            <TableCell>{backup.duracion}</TableCell>
            <TableCell>{backup.ubicacion}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  backup.estado === "Completado"
                    ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                    : backup.estado === "Con advertencias"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                }
              >
                {backup.estado}
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
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restaurar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
