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
import { Hash, Building, Calendar, CreditCard, Truck, Shield, CalendarClock, CheckCircle } from "lucide-react"
import { EditTrailerModal } from "@/components/edit-trailer-modal"
import { ViewTrailerModal } from "@/components/view-trailer-modal"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TrailersTableProps {
  searchTerm?: string
  statusFilter?: string
  companyFilter?: string
}

export function TrailersTable({
  searchTerm = "",
  statusFilter = "todos",
  companyFilter = "todas",
}: TrailersTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState<any>(null)
  const [trailerABaja, setTrailerABaja] = useState<any>(null)
  const [trailers, setTrailers] = useState([
    {
      id: "ACO-1001",
      empresa: "Transportes Rápidos S.A.",
      año: "2020",
      dominio: "TR123AB",
      chasis: "CH2020001",
      poliza: "POL-2024-001",
      vtoPoliza: "15/03/2025",
      estado: "Activo",
    },
    {
      id: "ACO-1002",
      empresa: "Logística del Sur",
      año: "2019",
      dominio: "TR456CD",
      chasis: "CH2019002",
      poliza: "POL-2024-002",
      vtoPoliza: "22/04/2025",
      estado: "Activo",
    },
    {
      id: "ACO-1003",
      empresa: "Transportes Andinos",
      año: "2021",
      dominio: "TR789EF",
      chasis: "CH2021003",
      poliza: "",
      vtoPoliza: "",
      estado: "Activo",
    },
    {
      id: "ACO-1004",
      empresa: "Cargas Express",
      año: "2018",
      dominio: "TR012GH",
      chasis: "",
      poliza: "POL-2024-004",
      vtoPoliza: "10/06/2025",
      estado: "Inactivo",
    },
    {
      id: "ACO-1005",
      empresa: "Transportes del Norte",
      año: "2017",
      dominio: "TR345IJ",
      chasis: "CH2017005",
      poliza: "POL-2024-005",
      vtoPoliza: "05/02/2025",
      estado: "Activo",
    },
  ])

  const sortedAndFilteredTrailers = useMemo(() => {
    // Primero filtrar
    let filtered = trailers.filter((trailer) => {
      const matchesSearch =
        searchTerm === "" ||
        trailer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.dominio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.chasis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.poliza.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || trailer.estado.toLowerCase() === statusFilter

      const companyMap: { [key: string]: string } = {
        "transportes-rapidos": "Transportes Rápidos S.A.",
        "logistica-sur": "Logística del Sur",
        "transportes-andinos": "Transportes Andinos",
        "cargas-express": "Cargas Express",
        "transportes-norte": "Transportes del Norte",
      }

      const matchesCompany = companyFilter === "todas" || trailer.empresa === companyMap[companyFilter]

      return matchesSearch && matchesStatus && matchesCompany
    })

    // Luego ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a: any, b: any) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Convertir años a números
        if (sortConfig.key === "año") {
          aValue = Number(aValue)
          bValue = Number(bValue)
        } else if (sortConfig.key === "vtoPoliza") {
          // Manejar fechas de vencimiento de póliza
          if (!aValue || aValue === "") aValue = "31/12/2099"
          if (!bValue || bValue === "") bValue = "31/12/2099"

          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split("/")
            return new Date(Number(year), Number(month) - 1, Number(day))
          }
          aValue = parseDate(aValue)
          bValue = parseDate(bValue)
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
  }, [trailers, searchTerm, statusFilter, companyFilter, sortConfig])

  const handleEdit = (trailer: any) => {
    setSelectedTrailer(trailer)
    setEditModalOpen(true)
  }

  const handleView = (trailer: any) => {
    setSelectedTrailer(trailer)
    setViewModalOpen(true)
  }

  const handleDarDeBaja = (id: string) => {
    setTrailers((prev: any) => prev.map((t: any) => t.id === id ? { ...t, estado: "Inactivo" } : t))
    setTrailerABaja(null)
    toast({
      title: "Acoplado dado de baja",
      description: "El acoplado fue dado de baja exitosamente.",
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} />
            <SortableHeader
              label="Empresa"
              sortKey="empresa"
              icon={Building}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader label="Año" sortKey="año" icon={Calendar} sortConfig={sortConfig} onSort={setSortConfig} />
            <SortableHeader
              label="Dominio"
              sortKey="dominio"
              icon={CreditCard}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader
              label="Chasis"
              sortKey="chasis"
              icon={Truck}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader
              label="Póliza"
              sortKey="poliza"
              icon={Shield}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader
              label="Vto Póliza"
              sortKey="vtoPoliza"
              icon={CalendarClock}
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
          {sortedAndFilteredTrailers.map((trailer) => (
            <TableRow key={trailer.id}>
              <TableCell className="font-medium">{trailer.id}</TableCell>
              <TableCell>{trailer.empresa}</TableCell>
              <TableCell>{trailer.año}</TableCell>
              <TableCell className="font-mono">{trailer.dominio}</TableCell>
              <TableCell>{trailer.chasis || "No especificado"}</TableCell>
              <TableCell>{trailer.poliza || "No especificado"}</TableCell>
              <TableCell>{trailer.vtoPoliza || "No especificado"}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    trailer.estado === "Activo"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : trailer.estado === "Inactivo"
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {trailer.estado}
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
                    <DropdownMenuItem onClick={() => handleView(trailer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(trailer)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
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
                            Esta acción dará de baja al acoplado <strong>{trailer.id}</strong>.
                            El registro cambiará su estado a inactivo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDarDeBaja(trailer.id)}>
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

      <EditTrailerModal open={editModalOpen} onOpenChange={setEditModalOpen} trailer={selectedTrailer} />
      <ViewTrailerModal open={viewModalOpen} onOpenChange={setViewModalOpen} trailer={selectedTrailer} />
    </>
  )
}
