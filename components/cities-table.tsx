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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Building2, Hash, MapPin, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface City {
  id: number
  name: string
  province: string
  status: "activo" | "inactivo"
}

const mockCities: City[] = [
  { id: 1, name: "Ciudad Autónoma de Buenos Aires", province: "Buenos Aires", status: "activo" },
  { id: 2, name: "La Plata", province: "Buenos Aires", status: "activo" },
  { id: 3, name: "Córdoba", province: "Córdoba", status: "activo" },
  { id: 4, name: "Rosario", province: "Santa Fe", status: "activo" },
  { id: 5, name: "Santa Fe", province: "Santa Fe", status: "activo" },
]

const provinces = ["Buenos Aires", "Córdoba", "Santa Fe", "São Paulo", "Rio de Janeiro"]

export function CitiesTable() {
  const [cities, setCities] = useState<City[]>(mockCities)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewCityOpen, setIsNewCityOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [newCity, setNewCity] = useState({ name: "", province: "", status: "activo" as const })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.province.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedCities = [...filteredCities].sort((a, b) => {
    const aValue = a[sortField as keyof City]
    const bValue = b[sortField as keyof City]
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

  const validateCity = (city: { name: string; province: string; status: string }) => {
    const newErrors: { [key: string]: string } = {}

    if (!city.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!city.province.trim()) {
      newErrors.province = "La provincia es requerida"
    }

    return newErrors
  }

  const handleCreateCity = () => {
    const validationErrors = validateCity(newCity)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check for duplicate name in same province
    if (cities.some((c) => c.name === newCity.name && c.province === newCity.province)) {
      setErrors({ name: "Ya existe una ciudad con este nombre en la provincia seleccionada" })
      return
    }

    const city: City = {
      id: Math.max(...cities.map((c) => c.id)) + 1,
      ...newCity,
    }
    setCities([...cities, city])
    setNewCity({ name: "", province: "", status: "activo" })
    setErrors({})
    setIsNewCityOpen(false)
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Ciudad creada exitosamente
        </div>
      ),
    })
  }

  const handleEditCity = () => {
    if (!editingCity) return

    const validationErrors = validateCity(editingCity)
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      return
    }

    // Check for duplicate name in same province (excluding current city)
    if (
      cities.some((c) => c.name === editingCity.name && c.province === editingCity.province && c.id !== editingCity.id)
    ) {
      setEditErrors({ name: "Ya existe una ciudad con este nombre en la provincia seleccionada" })
      return
    }

    setCities(cities.map((c) => (c.id === editingCity.id ? editingCity : c)))
    setEditingCity(null)
    setEditErrors({})
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Ciudad actualizada exitosamente
        </div>
      ),
    })
  }

  const handleDeleteCity = (id: number) => {
    setCities(cities.map((c) => (c.id === id ? { ...c, status: "inactivo" } : c)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Ciudad dada de baja exitosamente
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
              placeholder="Buscar ciudades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog
          open={isNewCityOpen}
          onOpenChange={(open) => {
            setIsNewCityOpen(open)
            if (!open) setErrors({})
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ciudad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Ciudad</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Provincia *</Label>
                <Select
                  value={newCity.province}
                  onValueChange={(value) => setNewCity({ ...newCity, province: value })}
                >
                  <SelectTrigger className={errors.province ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCityOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCity}>Crear Ciudad</Button>
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
                icon={Building2}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="province"
                label="Provincia"
                icon={MapPin}
                sortKey="province"
                currentSort={sortField}
                direction={sortField === "province" ? sortDirection : null}
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
            {sortedCities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="text-center">{city.name}</TableCell>
                <TableCell className="text-center">{city.province}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      city.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {city.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => setEditingCity(city)}>
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
                              Esta acción dará de baja a la ciudad <strong>{city.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCity(city.id)}>
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
        open={!!editingCity}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCity(null)
            setEditErrors({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ciudad</DialogTitle>
            <DialogDescription>Modifica los datos de la ciudad</DialogDescription>
          </DialogHeader>
          {editingCity && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingCity.name}
                  onChange={(e) => {
                    setEditingCity({ ...editingCity, name: e.target.value })
                    if (editErrors.name) setEditErrors({ ...editErrors, name: "" })
                  }}
                  className={editErrors.name ? "border-red-500" : ""}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-province">Provincia</Label>
                <Select
                  value={editingCity.province}
                  onValueChange={(value) => {
                    setEditingCity({ ...editingCity, province: value })
                    if (editErrors.province) setEditErrors({ ...editErrors, province: "" })
                  }}
                >
                  <SelectTrigger className={editErrors.province ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editErrors.province && <p className="text-sm text-red-500">{editErrors.province}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingCity.status}
                  onValueChange={(value: "activo" | "inactivo") => setEditingCity({ ...editingCity, status: value })}
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
            <Button variant="outline" onClick={() => setEditingCity(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCity}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
