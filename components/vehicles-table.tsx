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
import { Hash, Truck, Building2, CreditCard, Calendar, Weight, Building, CheckCircle } from "lucide-react"
import { EditTruckModal } from "@/components/edit-truck-modal"
import { ViewTruckModal } from "@/components/view-truck-modal"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface VehiclesTableProps {
  searchTerm?: string
  statusFilter?: string
  companyFilter?: string
}

export function VehiclesTable({
  searchTerm = "",
  statusFilter = "todos",
  companyFilter = "todas",
}: VehiclesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [vehicleABaja, setVehicleABaja] = useState<any>(null)

  const [vehicles, setVehicles] = useState([
    {
      id: "VEH-1001",
      tipo: "Camión",
      marca: "Ford",
      modelo: "F-350",
      patente: "AB123CD",
      año: "2020",
      capacidad: "5,000 kg",
      empresa: "Transportes Rápidos S.A.",
      chofer: "Juan Pérez",
      estado: "Operativo",
    },
    {
      id: "VEH-1002",
      tipo: "Tractor",
      marca: "Mercedes-Benz",
      modelo: "Actros",
      patente: "XY789ZW",
      año: "2019",
      capacidad: "25,000 kg",
      empresa: "Logística del Sur",
      chofer: "María González",
      estado: "En ruta",
    },
    {
      id: "VEH-1003",
      tipo: "Tractor",
      marca: "Scania",
      modelo: "R450",
      patente: "QR456ST",
      año: "2021",
      capacidad: "28,000 kg",
      empresa: "Transportes Andinos",
      chofer: "Carlos Rodríguez",
      estado: "En ruta",
    },
    {
      id: "VEH-1004",
      tipo: "Tractor",
      marca: "Volvo",
      modelo: "FH16",
      patente: "MN789OP",
      año: "2018",
      capacidad: "30,000 kg",
      empresa: "Cargas Express",
      chofer: "Ana Martínez",
      estado: "Operativo",
    },
    {
      id: "VEH-1005",
      tipo: "Camión",
      marca: "Iveco",
      modelo: "Stralis",
      patente: "UV123WX",
      año: "2017",
      capacidad: "15,000 kg",
      empresa: "Transportes del Norte",
      chofer: "Pedro Sánchez",
      estado: "En mantenimiento",
    },
  ])

  const sortedAndFilteredVehicles = useMemo(() => {
    // Primero filtrar
    let filtered = vehicles.filter((vehicle) => {
      const matchesSearch =
        searchTerm === "" ||
        vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.empresa.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || vehicle.estado.toLowerCase().replace(" ", "-") === statusFilter

      const companyMap: { [key: string]: string } = {
        "transportes-rapidos": "Transportes Rápidos S.A.",
        "logistica-sur": "Logística del Sur",
        "transportes-andinos": "Transportes Andinos",
        "cargas-express": "Cargas Express",
        "transportes-norte": "Transportes del Norte",
      }

      const matchesCompany = companyFilter === "todas" || vehicle.empresa === companyMap[companyFilter]

      return matchesSearch && matchesStatus && matchesCompany
    })

    // Luego ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a: any, b: any) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Manejar campos especiales
        if (sortConfig.key === "marcaModelo") {
          aValue = `${a.marca} ${a.modelo}`.toLowerCase()
          bValue = `${b.marca} ${b.modelo}`.toLowerCase()
        } else if (sortConfig.key === "año") {
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
  }, [vehicles, searchTerm, statusFilter, companyFilter, sortConfig])

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setEditModalOpen(true)
  }

  const handleView = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setViewModalOpen(true)
  }

  const handleDarDeBaja = (id: string) => {
    setVehicles((prev: any) => prev.map((v: any) => v.id === id ? { ...v, estado: "Inactivo" } : v))
    setVehicleABaja(null)
    toast({
      title: "Camión dado de baja",
      description: "El camión fue dado de baja exitosamente.",
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} />
            <SortableHeader label="Tipo" sortKey="tipo" icon={Truck} sortConfig={sortConfig} onSort={setSortConfig} />
            <SortableHeader
              label="Marca/Modelo"
              sortKey="marcaModelo"
              icon={Building2}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader
              label="Patente"
              sortKey="patente"
              icon={CreditCard}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader label="Año" sortKey="año" icon={Calendar} sortConfig={sortConfig} onSort={setSortConfig} />
            <SortableHeader
              label="Capacidad"
              sortKey="capacidad"
              icon={Weight}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
            <SortableHeader
              label="Empresa"
              sortKey="empresa"
              icon={Building}
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
          {sortedAndFilteredVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.id}</TableCell>
              <TableCell>{vehicle.tipo}</TableCell>
              <TableCell>
                {vehicle.marca} {vehicle.modelo}
              </TableCell>
              <TableCell>{vehicle.patente}</TableCell>
              <TableCell>{vehicle.año}</TableCell>
              <TableCell>{vehicle.capacidad}</TableCell>
              <TableCell>{vehicle.empresa}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    vehicle.estado === "Operativo"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : vehicle.estado === "En ruta"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : vehicle.estado === "En mantenimiento"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : vehicle.estado === "Inactivo"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {vehicle.estado}
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
                    <DropdownMenuItem onClick={() => handleView(vehicle)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
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
                            Esta acción dará de baja al camión <strong>{vehicle.id}</strong>.
                            El registro cambiará su estado a inactivo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDarDeBaja(vehicle.id)}>
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

      <EditTruckModal open={editModalOpen} onOpenChange={setEditModalOpen} vehicle={selectedVehicle} />
      <ViewTruckModal open={viewModalOpen} onOpenChange={setViewModalOpen} vehicle={selectedVehicle} />
    </>
  )
}
