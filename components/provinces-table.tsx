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
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, MapPin, Hash, Globe, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Province {
  id: number
  name: string
  country: string
  status: "activo" | "inactivo"
}

const mockProvinces: Province[] = [
  { id: 1, name: "Buenos Aires", country: "Argentina", status: "activo" },
  { id: 2, name: "Córdoba", country: "Argentina", status: "activo" },
  { id: 3, name: "Santa Fe", country: "Argentina", status: "activo" },
  { id: 4, name: "São Paulo", country: "Brasil", status: "activo" },
  { id: 5, name: "Rio de Janeiro", country: "Brasil", status: "activo" },
]

const countries = ["Argentina", "Brasil", "Chile", "Uruguay", "Paraguay"]

export function ProvincesTable() {
  const [provinces, setProvinces] = useState<Province[]>(mockProvinces)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewProvinceOpen, setIsNewProvinceOpen] = useState(false)
  const [editingProvince, setEditingProvince] = useState<Province | null>(null)
  const [newProvince, setNewProvince] = useState<{ name: string; country: string; status: "activo" | "inactivo" }>({ name: "", country: "", status: "activo" })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

  const filteredProvinces = provinces.filter(
    (province) =>
      province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedProvinces = [...filteredProvinces].sort((a, b) => {
    const aValue = a[sortField as keyof Province]
    const bValue = b[sortField as keyof Province]
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

  const validateProvince = (province: { name: string; country: string; status: string }) => {
    const newErrors: { [key: string]: string } = {}

    if (!province.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!province.country.trim()) {
      newErrors.country = "El país es requerido"
    }

    return newErrors
  }

  const handleCreateProvince = () => {
    const validationErrors = validateProvince(newProvince)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check for duplicate name in same country
    if (provinces.some((p) => p.name === newProvince.name && p.country === newProvince.country)) {
      setErrors({ name: "Ya existe una provincia con este nombre en el país seleccionado" })
      return
    }

    const province: Province = {
      id: Math.max(...provinces.map((p) => p.id)) + 1,
      ...newProvince,
    }
    setProvinces([...provinces, province])
    setNewProvince({ name: "", country: "", status: "activo" })
    setErrors({})
    setIsNewProvinceOpen(false)
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Provincia creada exitosamente
        </div>
      ),
    })
  }

  const handleEditProvince = () => {
    if (!editingProvince) return

    const validationErrors = validateProvince(editingProvince)
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      return
    }

    // Check for duplicate name in same country (excluding current province)
    if (
      provinces.some(
        (p) => p.name === editingProvince.name && p.country === editingProvince.country && p.id !== editingProvince.id,
      )
    ) {
      setEditErrors({ name: "Ya existe una provincia con este nombre en el país seleccionado" })
      return
    }

    setProvinces(provinces.map((p) => (p.id === editingProvince.id ? editingProvince : p)))
    setEditingProvince(null)
    setEditErrors({})
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Provincia actualizada exitosamente
        </div>
      ),
    })
  }

  const handleDeleteProvince = (id: number) => {
    setProvinces(provinces.map((p) => (p.id === id ? { ...p, status: "inactivo" } : p)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Provincia dada de baja exitosamente
        </div>
      ),
    })
  }

  const initialFormData = {
    name: "",
    country: "",
    status: "activo" as const,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar provincias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog
          open={isNewProvinceOpen}
          onOpenChange={(open) => {
            setIsNewProvinceOpen(open)
            if (!open) setErrors({})
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Provincia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Provincia</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newProvince.name}
                  onChange={(e) => setNewProvince({ ...newProvince, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">País *</Label>
                <Select
                  value={newProvince.country}
                  onValueChange={(value) => setNewProvince({ ...newProvince, country: value })}
                >
                  <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewProvinceOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProvince}>Crear Provincia</Button>
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
                  icon={MapPin}
                  sortKey="name"
                  currentSort={sortField}
                  direction={sortField === "name" ? sortDirection : null}
                  onSort={handleSort}
                className="text-center"
                />
                <SortableHeader
                  column="country"
                  label="País"
                  icon={Globe}
                  sortKey="country"
                  currentSort={sortField}
                  direction={sortField === "country" ? sortDirection : null}
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
            {sortedProvinces.map((province) => (
              <TableRow key={province.id}>
                <TableCell className="text-center">{province.name}</TableCell>
                <TableCell className="text-center">{province.country}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      province.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {province.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => setEditingProvince(province)}>
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
                              Esta acción dará de baja a la provincia <strong>{province.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProvince(province.id)}>
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
        open={!!editingProvince}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProvince(null)
            setEditErrors({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Provincia</DialogTitle>
            <DialogDescription>Modifica los datos de la provincia</DialogDescription>
          </DialogHeader>
          {editingProvince && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingProvince.name}
                  onChange={(e) => {
                    setEditingProvince({ ...editingProvince, name: e.target.value })
                    if (editErrors.name) setEditErrors({ ...editErrors, name: "" })
                  }}
                  className={editErrors.name ? "border-red-500" : ""}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-country">País</Label>
                <Select
                  value={editingProvince.country}
                  onValueChange={(value) => {
                    setEditingProvince({ ...editingProvince, country: value })
                    if (editErrors.country) setEditErrors({ ...editErrors, country: "" })
                  }}
                >
                  <SelectTrigger className={editErrors.country ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editErrors.country && <p className="text-sm text-red-500">{editErrors.country}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingProvince.status}
                  onValueChange={(value: "activo" | "inactivo") =>
                    setEditingProvince({ ...editingProvince, status: value })
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
            <Button variant="outline" onClick={() => setEditingProvince(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProvince}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
