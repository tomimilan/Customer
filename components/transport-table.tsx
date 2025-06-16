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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Pencil } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Hash, Building, UserIcon, PhoneIcon, Mail, Users, CarIcon, CheckCircle } from "lucide-react"
import { EditTransportModal } from "@/components/edit-transport-modal"
import { ViewTransportModal } from "@/components/view-transport-modal"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TransportTableProps {
  searchTerm?: string
  statusFilter?: string
  tipoFilter?: string
}

export function TransportTable({ searchTerm = "", statusFilter = "todos", tipoFilter = "todos" }: TransportTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState<any>(null)
  const [empresaABaja, setEmpresaABaja] = useState<any>(null)
  const [transports, setTransports] = useState([
    {
      id: "TRP-1001",
      nombre: "Transportes Rápidos S.A.",
      contacto: "Roberto Gómez",
      telefono: "+54 11 4567-8901",
      email: "contacto@transportesrapidos.com",
      direccion: "Av. Corrientes 1234, Buenos Aires",
      choferes: 15,
      vehiculos: 12,
      estado: "Activo",
      tipo: "nacional",
    },
    {
      id: "TRP-1002",
      nombre: "Logística del Sur",
      contacto: "Laura Fernández",
      telefono: "+54 351 234-5678",
      email: "info@logisticadelsur.com",
      direccion: "Ruta 9 Km 695, Córdoba",
      choferes: 8,
      vehiculos: 6,
      estado: "Activo",
      tipo: "nacional",
    },
    {
      id: "TRP-1003",
      nombre: "Transportes Andinos",
      contacto: "Miguel Sánchez",
      telefono: "+54 261 876-5432",
      email: "contacto@transportesandinos.com",
      direccion: "Av. San Martín 567, Mendoza",
      choferes: 12,
      vehiculos: 10,
      estado: "Activo",
      tipo: "internacional",
    },
    {
      id: "TRP-1004",
      nombre: "Cargas Express",
      contacto: "Silvia Rodríguez",
      telefono: "+54 341 765-4321",
      email: "info@cargasexpress.com",
      direccion: "Bv. Oroño 890, Rosario",
      choferes: 6,
      vehiculos: 5,
      estado: "Inactivo",
      tipo: "nacional",
    },
    {
      id: "TRP-1005",
      nombre: "Transportes del Norte",
      contacto: "Javier López",
      telefono: "+54 387 123-4567",
      email: "contacto@transportesdelnorte.com",
      direccion: "Av. Belgrano 432, Salta",
      choferes: 9,
      vehiculos: 7,
      estado: "Activo",
      tipo: "internacional",
    },
  ])

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

  const sortedAndFilteredTransports = useMemo(() => {
    // Primero filtrar
    let filtered = transports.filter((transport) => {
      const matchesSearch =
        searchTerm === "" ||
        transport.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.telefono.includes(searchTerm)

      const matchesStatus = statusFilter === "todos" || transport.estado.toLowerCase() === statusFilter.toLowerCase()
      const matchesTipo = tipoFilter === "todos" || transport.tipo.toLowerCase() === tipoFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesTipo
    })

    // Luego ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a: any, b: any) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Convertir a números si es necesario
        if (sortConfig.key === "choferes" || sortConfig.key === "vehiculos") {
          aValue = Number(aValue)
          bValue = Number(bValue)
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [transports, searchTerm, statusFilter, tipoFilter, sortConfig])

  const handleEdit = (transport: any) => {
    setSelectedTransport(transport)
    setEditModalOpen(true)
  }

  const handleView = (transport: any) => {
    setSelectedTransport(transport)
    setViewModalOpen(true)
  }

  const handleDarDeBaja = (id: string) => {
    setTransports((prev: any) => prev.map((t: any) => t.id === id ? { ...t, estado: "Inactivo" } : t))
    setEmpresaABaja(null)
    toast({
      title: "Empresa dada de baja",
      description: "La empresa fue dada de baja exitosamente.",
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} className="text-center" />
            <SortableHeader
              label="Nombre"
              sortKey="nombre"
              icon={Building}
              sortConfig={sortConfig}
              onSort={setSortConfig}
              className="text-center"
            />
            <SortableHeader
              label="Chof"
              sortKey="choferes"
              icon={Users}
              sortConfig={sortConfig}
              onSort={setSortConfig}
              className="text-center"
            />
            <SortableHeader
              label="Vehículos"
              sortKey="vehiculos"
              icon={CarIcon}
              sortConfig={sortConfig}
              onSort={setSortConfig}
              className="text-center"
            />
            <SortableHeader
              label="Estado"
              sortKey="estado"
              icon={CheckCircle}
              sortConfig={sortConfig}
              onSort={setSortConfig}
              className="text-center"
            />
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredTransports.map((transport) => (
            <TableRow key={transport.id}>
              <TableCell className="text-center font-medium">{transport.id}</TableCell>
              <TableCell className="text-center">{transport.nombre}</TableCell>
              <TableCell className="text-center">{transport.choferes}</TableCell>
              <TableCell className="text-center">{transport.vehiculos}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getStatusBadgeStyle(transport.estado)}
                >
                  {transport.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(transport)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(transport)}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Dar de Baja
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción dará de baja a la empresa <strong>{transport.nombre}</strong>.
                            El registro cambiará su estado a inactivo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDarDeBaja(transport.id)}>
                            Dar de Baja
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditTransportModal open={editModalOpen} onOpenChange={setEditModalOpen} transport={selectedTransport} />
      <ViewTransportModal open={viewModalOpen} onOpenChange={setViewModalOpen} transport={selectedTransport} />
    </>
  )
}
