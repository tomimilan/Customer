"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Eye, FileText, MapPin, MoreHorizontal, Pencil, Truck, Hash, User, Calendar, Clock, Ship } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CargoForm } from "@/components/cargo-form"

interface CardsTableProps {
  filter?: "activas" | "pendientes" | "finalizadas" | "all"
  searchTerm?: string
  statusFilter?: string
  typeFilter?: string
}

export function CardsTable({
  filter = "all",
  searchTerm = "",
  statusFilter = "todos",
  typeFilter = "todos",
}: CardsTableProps) {
  const router = useRouter()
  const [cards, setCards] = useState([
    {
      codigoOperacion: "EM-Aceite-000001",
      id: "CRG-1001",
      cantidadViajes: 3,
      origen: "Buenos Aires, Argentina",
      destino: "Santiago, Chile",
      cliente: "Importadora Andina S.A.",
      tipo: "Exportación Marítima",
      alcance: "Internacional",
      fechaCreacion: "12/07/2023",
      fechaEntrega: "18/07/2023",
      estado: "En tránsito",
    },
    {
      codigoOperacion: "ET-Granos-000002",
      id: "CRG-1002",
      cantidadViajes: 2,
      origen: "Córdoba, Argentina",
      destino: "Rosario, Argentina",
      cliente: "Distribuidora Central",
      tipo: "Exportación Terrestre",
      alcance: "Nacional",
      fechaCreacion: "13/07/2023",
      fechaEntrega: "16/07/2023",
      estado: "En tránsito",
    },
    {
      codigoOperacion: "CN-Contenedores-000003",
      id: "CRG-1003",
      cantidadViajes: 1,
      origen: "Mendoza, Argentina",
      destino: "Buenos Aires, Argentina",
      cliente: "Viñedos Argentinos",
      tipo: "Carga Nacional",
      alcance: "Nacional",
      fechaCreacion: "14/07/2023",
      fechaEntrega: "19/07/2023",
      estado: "Pendiente",
    },
    {
      codigoOperacion: "IM-Líquidos-000004",
      id: "CRG-1004",
      cantidadViajes: 4,
      origen: "Buenos Aires, Argentina",
      destino: "Montevideo, Uruguay",
      cliente: "Exportadora del Plata",
      tipo: "Importación Marítima",
      alcance: "Internacional",
      fechaCreacion: "10/07/2023",
      fechaEntrega: "15/07/2023",
      estado: "En aduana",
    },
    {
      codigoOperacion: "IT-Granos-000005",
      id: "CRG-1005",
      cantidadViajes: 2,
      origen: "Rosario, Argentina",
      destino: "Córdoba, Argentina",
      cliente: "Agroindustrias del Centro",
      tipo: "Importación Terrestre",
      alcance: "Nacional",
      fechaCreacion: "11/07/2023",
      fechaEntrega: "14/07/2023",
      estado: "Finalizada",
    },
  ])

  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc" | null
  }>({
    key: null,
    direction: null,
  })

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editCard, setEditCard] = useState<any | null>(null)

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

  const sortedCards = [...cards].sort((a: any, b: any) => {
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

  const filteredCards = sortedCards.filter((card) => {
    // Filtro de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cliente.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de estado
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "en-transito" && card.estado === "En tránsito") ||
      (statusFilter === "pendiente" && card.estado === "Pendiente") ||
      (statusFilter === "finalizada" && card.estado === "Finalizada") ||
      (statusFilter === "en-aduana" && card.estado === "En aduana")

    // Filtro de tipo
    const matchesType =
      typeFilter === "todos" ||
      (typeFilter === "exportacion-portuaria" && card.tipo === "Exportación Portuaria") ||
      (typeFilter === "exportacion-terrestre" && card.tipo === "Exportación Terrestre") ||
      (typeFilter === "importacion-portuaria" && card.tipo === "Importación Portuaria") ||
      (typeFilter === "importacion-terrestre" && card.tipo === "Importación Terrestre") ||
      (typeFilter === "puesta-fob" && card.tipo === "Puesta FOB") ||
      (typeFilter === "carga-nacional" && card.tipo === "Carga Nacional")

    // Filtro original (si existe)
    const matchesOriginalFilter =
      filter === "all" ||
      (filter === "activas" && (card.estado === "En tránsito" || card.estado === "En aduana")) ||
      (filter === "pendientes" && card.estado === "Pendiente") ||
      (filter === "finalizadas" && card.estado === "Finalizada")

    return matchesSearch && matchesStatus && matchesType && matchesOriginalFilter
  })

  const handleViewDetails = (cardId: string) => {
    router.push(`/modules/cargas/${cardId}`)
  }

  const handleEdit = (card: any) => {
    setEditCard(card)
    setEditModalOpen(true)
  }

  const handleEditSave = (data: any) => {
    setCards((prev) => prev.map((c) => (c.id === editCard.id ? { ...c, ...data } : c)))
    setEditModalOpen(false)
    setEditCard(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              column="codigoOperacion"
              label="Cod.Operación"
              icon={Hash}
              sortKey="codigoOperacion"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <SortableHeader
              column="cantidadViajes"
              label="Viajes"
              icon={Truck}
              sortKey="cantidadViajes"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <SortableHeader
              column="origen"
              label="Origen - Destino"
              icon={MapPin}
              sortKey="origen"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <SortableHeader
              column="tipo"
              label="Tipo"
              icon={Ship}
              sortKey="tipo"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <SortableHeader
              column="fechaEntrega"
              label="Fecha Entrega"
              icon={Calendar}
              sortKey="fechaEntrega"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <SortableHeader
              column="estado"
              label="Estado"
              icon={Clock}
              sortKey="estado"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={handleSort}
              className="text-center"
            />
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium text-center">{card.codigoOperacion || card.id}</TableCell>
              <TableCell className="text-center">{card.cantidadViajes}</TableCell>
              <TableCell className="text-center">
                {card.origen} - {card.destino}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={
                    card.tipo.includes("Portuaria")
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : card.tipo.includes("Terrestre")
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                  }
                >
                  {card.tipo}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{card.fechaEntrega}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={
                    card.estado === "En tránsito"
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : card.estado === "En aduana"
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : card.estado === "Pendiente"
                          ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  }
                >
                  {card.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(card.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(card)}>
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
      {/* Modal de edición de carga usando CargoForm */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto p-0 bg-white">
          <div className="p-6">
            <DialogTitle className="text-2xl font-bold mb-1">Editar Carga</DialogTitle>
            <p className="text-muted-foreground mb-6">Modifique la información de la carga seleccionada.</p>
            <CargoForm
              onSubmit={handleEditSave}
              onCancel={() => setEditModalOpen(false)}
              initialData={editCard}
              isEditMode={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
