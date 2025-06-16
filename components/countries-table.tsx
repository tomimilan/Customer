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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Globe, Hash, Type, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Country {
  id: number
  name: string
  status: "activo" | "inactivo"
}

const mockCountries: Country[] = [
  { id: 1, name: "Argentina", status: "activo" },
  { id: 2, name: "Brasil", status: "activo" },
  { id: 3, name: "Chile", status: "activo" },
  { id: 4, name: "Uruguay", status: "activo" },
  { id: 5, name: "Paraguay", status: "inactivo" },
]

export function CountriesTable() {
  const [countries, setCountries] = useState<Country[]>(mockCountries)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewCountryOpen, setIsNewCountryOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [newCountry, setNewCountry] = useState<{ name: string; status: "activo" | "inactivo" }>({ name: "", status: "activo" })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    const aValue = a[sortField as keyof Country]
    const bValue = b[sortField as keyof Country]
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

  const validateCountry = (country: { name: string; status: string }) => {
    const newErrors: { [key: string]: string } = {}

    if (!country.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    return newErrors
  }

  const handleCreateCountry = () => {
    const validationErrors = validateCountry(newCountry)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check for duplicate code
    if (countries.some((c) => c.name === newCountry.name)) {
      setErrors({ name: "Ya existe un país con este nombre" })
      return
    }

    const country: Country = {
      id: Math.max(...countries.map((c) => c.id)) + 1,
      ...newCountry,
    }
    setCountries([...countries, country])
    setNewCountry({ name: "", status: "activo" })
    setErrors({})
    setIsNewCountryOpen(false)
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          País creado exitosamente
        </div>
      ),
    })
  }

  const handleEditCountry = () => {
    if (!editingCountry) return

    const validationErrors = validateCountry(editingCountry)
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      return
    }

    // Check for duplicate code (excluding current country)
    if (countries.some((c) => c.name === editingCountry.name && c.id !== editingCountry.id)) {
      setEditErrors({ name: "Ya existe un país con este nombre" })
      return
    }

    setCountries(countries.map((c) => (c.id === editingCountry.id ? editingCountry : c)))
    setEditingCountry(null)
    setEditErrors({})
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          País actualizado exitosamente
        </div>
      ),
    })
  }

  const handleDeleteCountry = (id: number) => {
    setCountries(countries.map((c) => (c.id === id ? { ...c, status: "inactivo" } : c)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          País dado de baja exitosamente
        </div>
      ),
    })
  }

  const initialFormData = {
    name: "",
    status: "activo" as const,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar países..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog
          open={isNewCountryOpen}
          onOpenChange={(open) => {
            setIsNewCountryOpen(open)
            if (!open) setErrors({})
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo País
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo País</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newCountry.name}
                  onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCountryOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCountry}>Crear País</Button>
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
                icon={Globe}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
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
            {sortedCountries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="text-center">{country.name}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      country.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {country.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => setEditingCountry(country)}>
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
                              Esta acción dará de baja al país <strong>{country.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCountry(country.id)}>
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
        open={!!editingCountry}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCountry(null)
            setEditErrors({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar País</DialogTitle>
            <DialogDescription>Modifica los datos del país</DialogDescription>
          </DialogHeader>
          {editingCountry && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingCountry.name}
                  onChange={(e) => {
                    setEditingCountry({ ...editingCountry, name: e.target.value })
                    if (editErrors.name) setEditErrors({ ...editErrors, name: "" })
                  }}
                  className={editErrors.name ? "border-red-500" : ""}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingCountry.status}
                  onValueChange={(value: "activo" | "inactivo") =>
                    setEditingCountry({ ...editingCountry, status: value })
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
            <Button variant="outline" onClick={() => setEditingCountry(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCountry}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
