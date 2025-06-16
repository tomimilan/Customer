"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, Hash, Type, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CargoType {
  id: number
  name: string
  description: string
  status: "activo" | "inactivo"
}

const mockCargoTypes: CargoType[] = [
  { id: 1, name: "Carga General", description: "Carga general en contenedor", status: "activo" },
  { id: 2, name: "Carga Peligrosa", description: "Materiales peligrosos", status: "activo" },
  { id: 3, name: "Carga Refrigerada", description: "Carga que requiere refrigeración", status: "activo" },
  { id: 4, name: "Carga a Granel", description: "Carga a granel en contenedor", status: "inactivo" },
  { id: 5, name: "Carga Sobredimensionada", description: "Carga que excede dimensiones estándar", status: "activo" },
]

export function CargoTypesTable() {
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>(mockCargoTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewCargoTypeOpen, setIsNewCargoTypeOpen] = useState(false)
  const [editingCargoType, setEditingCargoType] = useState<CargoType | null>(null)
  const [newCargoType, setNewCargoType] = useState<{
    name: string
    description: string
    status: "activo" | "inactivo"
  }>({
    name: "",
    description: "",
    status: "activo",
  })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

  const filteredCargoTypes = cargoTypes.filter(
    (cargoType) =>
      cargoType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargoType.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCargoTypes = [...filteredCargoTypes].sort((a, b) => {
    const aValue = a[sortField as keyof CargoType]
    const bValue = b[sortField as keyof CargoType]
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const validateCargoType = (cargoType: { name: string; description: string; status: string }) => {
    const newErrors: { [key: string]: string } = {}

    if (!cargoType.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!cargoType.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }

    return newErrors
  }

  const handleCreateCargoType = () => {
    const validationErrors = validateCargoType(newCargoType)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check for duplicate name
    if (cargoTypes.some((c) => c.name === newCargoType.name)) {
      setErrors({ name: "Ya existe un tipo de carga con este nombre" })
      return
    }

    const cargoType: CargoType = {
      id: Math.max(...cargoTypes.map((c) => c.id)) + 1,
      ...newCargoType,
    }
    setCargoTypes([...cargoTypes, cargoType])
    setNewCargoType({ name: "", description: "", status: "activo" })
    setErrors({})
    setIsNewCargoTypeOpen(false)
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de carga creado exitosamente
        </div>
      ),
    })
  }

  const handleEditCargoType = () => {
    if (!editingCargoType) return

    const validationErrors = validateCargoType(editingCargoType)
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      return
    }

    // Check for duplicate name (excluding current cargo type)
    if (cargoTypes.some((c) => c.name === editingCargoType.name && c.id !== editingCargoType.id)) {
      setEditErrors({ name: "Ya existe un tipo de carga con este nombre" })
      return
    }

    setCargoTypes(cargoTypes.map((c) => (c.id === editingCargoType.id ? editingCargoType : c)))
    setEditingCargoType(null)
    setEditErrors({})
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de carga actualizado exitosamente
        </div>
      ),
    })
  }

  const handleDeleteCargoType = (id: number) => {
    setCargoTypes(cargoTypes.map((c) => (c.id === id ? { ...c, status: "inactivo" } : c)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de carga dado de baja exitosamente
        </div>
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tipos de carga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog
          open={isNewCargoTypeOpen}
          onOpenChange={(open) => {
            setIsNewCargoTypeOpen(open)
            if (!open) setErrors({})
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Carga
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Tipo de Carga</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newCargoType.name}
                  onChange={(e) => setNewCargoType({ ...newCargoType, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción *</Label>
                <Input
                  id="description"
                  value={newCargoType.description}
                  onChange={(e) => setNewCargoType({ ...newCargoType, description: e.target.value })}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCargoTypeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCargoType}>Crear Tipo de Carga</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="name"
                label="Nombre"
                icon={Package}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="description"
                label="Descripción"
                icon={FileText}
                sortKey="description"
                currentSort={sortField}
                direction={sortField === "description" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="status"
                label="Estado"
                icon={CheckCircle}
                sortKey="status"
                currentSort={sortField}
                direction={sortField === "status" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCargoTypes.map((cargoType) => (
              <TableRow key={cargoType.id}>
                <TableCell className="text-center">{cargoType.name}</TableCell>
                <TableCell className="text-center">{cargoType.description}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      cargoType.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {cargoType.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => setEditingCargoType(cargoType)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Dar de Baja
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción dará de baja al tipo de carga <strong>{cargoType.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCargoType(cargoType.id)}>
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
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCargoType}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCargoType(null)
            setEditErrors({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Carga</DialogTitle>
            <DialogDescription>Modifica los datos del tipo de carga</DialogDescription>
          </DialogHeader>
          {editingCargoType && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  value={editingCargoType.name}
                  onChange={(e) => {
                    setEditingCargoType({ ...editingCargoType, name: e.target.value })
                    if (editErrors.name) setEditErrors({ ...editErrors, name: "" })
                  }}
                  className={editErrors.name ? "border-red-500" : ""}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descripción *</Label>
                <Input
                  id="edit-description"
                  value={editingCargoType.description}
                  onChange={(e) => {
                    setEditingCargoType({ ...editingCargoType, description: e.target.value })
                    if (editErrors.description) setEditErrors({ ...editErrors, description: "" })
                  }}
                  className={editErrors.description ? "border-red-500" : ""}
                />
                {editErrors.description && <p className="text-sm text-red-500">{editErrors.description}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingCargoType.status}
                  onValueChange={(value: "activo" | "inactivo") =>
                    setEditingCargoType({ ...editingCargoType, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCargoType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCargoType}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
