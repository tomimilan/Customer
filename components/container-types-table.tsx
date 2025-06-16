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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Container, Hash, Type, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

interface ContainerType {
  id: number
  name: string
  code: string
  status: "activo" | "inactivo"
}

const mockContainerTypes: ContainerType[] = [
  {
    id: 1,
    name: "Contenedor Estándar 20'",
    code: "20ST",
    status: "activo",
  },
  {
    id: 2,
    name: "Contenedor Estándar 40'",
    code: "40ST",
    status: "activo",
  },
]

export function ContainerTypesTable() {
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>(mockContainerTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewContainerTypeOpen, setIsNewContainerTypeOpen] = useState(false)
  const [editingContainerType, setEditingContainerType] = useState<ContainerType | null>(null)
  const [newContainerType, setNewContainerType] = useState({
    name: "",
    code: "",
    status: "activo" as const,
  })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

  const filteredContainerTypes = containerTypes.filter(
    (containerType) =>
      containerType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      containerType.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedContainerTypes = [...filteredContainerTypes].sort((a, b) => {
    const aValue = a[sortField as keyof ContainerType]
    const bValue = b[sortField as keyof ContainerType]
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

  const validateContainerType = (containerType: {
    name: string
    code: string
    status: string
  }) => {
    const newErrors: { [key: string]: string } = {}

    if (!containerType.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!containerType.code.trim()) {
      newErrors.code = "El código es requerido"
    } else if (containerType.code.length > 4) {
      newErrors.code = "El código no puede tener más de 4 caracteres"
    }

    return newErrors
  }

  const handleCreateContainerType = () => {
    const validationErrors = validateContainerType(newContainerType)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check for duplicate code or name
    if (containerTypes.some((c) => c.code === newContainerType.code)) {
      setErrors({ code: "Ya existe un tipo de contenedor con este código" })
      return
    }

    if (containerTypes.some((c) => c.name === newContainerType.name)) {
      setErrors({ name: "Ya existe un tipo de contenedor con este nombre" })
      return
    }

    const containerType: ContainerType = {
      id: Math.max(...containerTypes.map((c) => c.id)) + 1,
      ...newContainerType,
    }
    setContainerTypes([...containerTypes, containerType])
    setNewContainerType({
      name: "",
      code: "",
      status: "activo",
    })
    setErrors({})
    setIsNewContainerTypeOpen(false)
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de contenedor creado exitosamente
        </div>
      ),
    })
  }

  const handleEditContainerType = () => {
    if (!editingContainerType) return

    const validationErrors = validateContainerType(editingContainerType)
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      return
    }

    // Check for duplicate code or name (excluding current container type)
    if (containerTypes.some((c) => c.code === editingContainerType.code && c.id !== editingContainerType.id)) {
      setEditErrors({ code: "Ya existe un tipo de contenedor con este código" })
      return
    }

    if (containerTypes.some((c) => c.name === editingContainerType.name && c.id !== editingContainerType.id)) {
      setEditErrors({ name: "Ya existe un tipo de contenedor con este nombre" })
      return
    }

    setContainerTypes(containerTypes.map((c) => (c.id === editingContainerType.id ? editingContainerType : c)))
    setEditingContainerType(null)
    setEditErrors({})
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de contenedor actualizado exitosamente
        </div>
      ),
    })
  }

  const handleDeleteContainerType = (id: number) => {
    setContainerTypes(containerTypes.map((c) => (c.id === id ? { ...c, status: "inactivo" } : c)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Tipo de contenedor dado de baja exitosamente
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
              placeholder="Buscar tipos de contenedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog
          open={isNewContainerTypeOpen}
          onOpenChange={(open) => {
            setIsNewContainerTypeOpen(open)
            if (!open) setErrors({})
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Contenedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Tipo de Contenedor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newContainerType.name}
                  onChange={(e) => setNewContainerType({ ...newContainerType, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={newContainerType.code}
                  onChange={(e) => setNewContainerType({ ...newContainerType, code: e.target.value.toUpperCase() })}
                  maxLength={4}
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
              </div>
            </div>
            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsNewContainerTypeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateContainerType}>Crear Tipo de Contenedor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="name"
                label="Nombre"
                icon={Container}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="code"
                label="Código"
                icon={Type}
                sortKey="code"
                currentSort={sortField}
                direction={sortField === "code" ? sortDirection : null}
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
            {sortedContainerTypes.map((containerType) => (
              <TableRow key={containerType.id}>
                <TableCell className="text-center font-medium">{containerType.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    {containerType.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      containerType.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {containerType.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => setEditingContainerType(containerType)}>
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
                              Esta acción dará de baja al tipo de contenedor <strong>{containerType.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteContainerType(containerType.id)}>
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
        open={!!editingContainerType}
        onOpenChange={(open) => {
          if (!open) {
            setEditingContainerType(null)
            setEditErrors({})
          }
        }}
      >
        <DialogContent className="max-w-md h-auto flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle>Editar Tipo de Contenedor</DialogTitle>
            <DialogDescription>Modifica los datos del tipo de contenedor</DialogDescription>
          </DialogHeader>
          {editingContainerType && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    value={editingContainerType.name}
                    onChange={(e) => setEditingContainerType({ ...editingContainerType, name: e.target.value })}
                    className={editErrors.name ? "border-red-500" : ""}
                  />
                  {editErrors.name && <p className="text-sm text-red-500 mt-1">{editErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Código</Label>
                  <Input
                    id="edit-code"
                    value={editingContainerType.code}
                    onChange={(e) =>
                      setEditingContainerType({ ...editingContainerType, code: e.target.value.toUpperCase() })
                    }
                    maxLength={4}
                    className={editErrors.code ? "border-red-500" : ""}
                  />
                  {editErrors.code && <p className="text-sm text-red-500 mt-1">{editErrors.code}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select
                    value={editingContainerType.status}
                    onValueChange={(value: "activo" | "inactivo") =>
                      setEditingContainerType({ ...editingContainerType, status: value })
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
            </div>
          )}
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingContainerType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditContainerType}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
