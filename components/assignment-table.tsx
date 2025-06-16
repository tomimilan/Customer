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
import {
  Calendar,
  Eye,
  Hash,
  MapPin,
  MoreHorizontal,
  Pencil,
  Truck,
  User,
  Package,
  Building,
  Clock,
} from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"

interface AssignmentTableProps {
  filter?: "pendientes" | "asignadas" | "all"
  searchTerm?: string
  statusFilter?: string
}

export function AssignmentTable({ filter = "all", searchTerm = "", statusFilter = "todos" }: AssignmentTableProps) {
  const [assignments, setAssignments] = useState([
    {
      id: "ASG-1001",
      carga: "CRG-1001",
      origen: "Buenos Aires, Argentina",
      destino: "Santiago, Chile",
      cliente: "Importadora Andina S.A.",
      transporte: "Transportes Rápidos S.A.",
      chofer: "Juan Pérez",
      vehiculo: "Ford F-350 (AB123CD)",
      fechaAsignacion: "12/07/2023",
      fechaRecogida: "14/07/2023",
      estado: "Asignada",
    },
    {
      id: "ASG-1002",
      carga: "CRG-1002",
      origen: "Córdoba, Argentina",
      destino: "Rosario, Argentina",
      cliente: "Distribuidora Central",
      transporte: "Logística del Sur",
      chofer: "María González",
      vehiculo: "Mercedes-Benz Actros (XY789ZW)",
      fechaAsignacion: "13/07/2023",
      fechaRecogida: "15/07/2023",
      estado: "Asignada",
    },
    {
      id: "ASG-1003",
      carga: "CRG-1003",
      origen: "Mendoza, Argentina",
      destino: "Buenos Aires, Argentina",
      cliente: "Viñedos Argentinos",
      transporte: "",
      chofer: "",
      vehiculo: "",
      fechaAsignacion: "",
      fechaRecogida: "16/07/2023",
      estado: "Pendiente",
    },
    {
      id: "ASG-1004",
      carga: "CRG-1004",
      origen: "Buenos Aires, Argentina",
      destino: "Montevideo, Uruguay",
      cliente: "Exportadora del Plata",
      transporte: "Transportes Andinos",
      chofer: "Carlos Rodríguez",
      vehiculo: "Scania R450 (QR456ST)",
      fechaAsignacion: "11/07/2023",
      fechaRecogida: "13/07/2023",
      estado: "Asignada",
    },
    {
      id: "ASG-1005",
      carga: "CRG-1005",
      origen: "Rosario, Argentina",
      destino: "Córdoba, Argentina",
      cliente: "Agroindustrias del Centro",
      transporte: "",
      chofer: "",
      vehiculo: "",
      fechaAsignacion: "",
      fechaRecogida: "17/07/2023",
      estado: "Pendiente",
    },
  ])

  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc" | null
  }>({
    key: null,
    direction: null,
  })

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  const getStatusBadgeStyle = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      case "Asignada":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      case "Finalizada":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const sortedAssignments = [...assignments].sort((a: any, b: any) => {
    if (!sortConfig.key || sortConfig.direction === null) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const filteredAssignments = sortedAssignments.filter((assignment) => {
    // Filtro de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.carga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.transporte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.chofer.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de estado
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "pendiente" && assignment.estado === "Pendiente") ||
      (statusFilter === "asignada" && assignment.estado === "Asignada")

    // Filtro original (si existe)
    const matchesOriginalFilter =
      filter === "all" ||
      (filter === "pendientes" && assignment.estado === "Pendiente") ||
      (filter === "asignadas" && assignment.estado === "Asignada")

    return matchesSearch && matchesStatus && matchesOriginalFilter
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader
            column="id"
            label="ID"
            icon={Hash}
            sortKey="id"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="carga"
            label="Carga"
            icon={Package}
            sortKey="carga"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="origen"
            label="Origen - Destino"
            icon={MapPin}
            sortKey="origen"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="cliente"
            label="Cliente"
            icon={Building}
            sortKey="cliente"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="transporte"
            label="Transporte"
            icon={Truck}
            sortKey="transporte"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="chofer"
            label="Chofer"
            icon={User}
            sortKey="chofer"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="fechaRecogida"
            label="Fecha Recogida"
            icon={Calendar}
            sortKey="fechaRecogida"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <SortableHeader
            column="estado"
            label="Estado"
            icon={Clock}
            sortKey="estado"
            currentSort={sortConfig.key}
            direction={sortConfig.direction}
            onSort={handleSort}
          />
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAssignments.map((assignment) => (
          <TableRow key={assignment.id}>
            <TableCell className="font-medium">{assignment.id}</TableCell>
            <TableCell>{assignment.carga}</TableCell>
            <TableCell>
              {assignment.origen} - {assignment.destino}
            </TableCell>
            <TableCell>{assignment.cliente}</TableCell>
            <TableCell>{assignment.transporte || "-"}</TableCell>
            <TableCell>{assignment.chofer || "-"}</TableCell>
            <TableCell>{assignment.fechaRecogida}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusBadgeStyle(assignment.estado)}>
                {assignment.estado}
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
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar asignación
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Truck className="mr-2 h-4 w-4" />
                    Asignar transporte
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Asignar chofer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Programar recogida
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
