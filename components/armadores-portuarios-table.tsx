"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Building2, Hash, User, CheckCircle } from "lucide-react"
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

interface ArmadorPortuario {
  id: number
  razonSocial: string
  taxId: string
  nombre: string
  celular?: string
  email?: string
  observaciones?: string
  estado: "Activo" | "Inactivo"
}

interface ArmadorPortuarioFormData {
  razonSocial: string
  taxId: string
  nombre: string
  celular: string
  email: string
  observaciones: string
}

interface FormErrors {
  razonSocial?: string
  taxId?: string
  nombre?: string
  email?: string
}

const initialFormData: ArmadorPortuarioFormData = {
  razonSocial: "",
  taxId: "",
  nombre: "",
  celular: "",
  email: "",
  observaciones: "",
}

export function ArmadoresPortuariosTable() {
  const [armadores, setArmadores] = useState<ArmadorPortuario[]>([
    {
      id: 1,
      razonSocial: "Naviera Río de la Plata S.A.",
      taxId: "20123456789",
      nombre: "Juan Pérez",
      celular: "+54 9 11 1234-5678",
      email: "juan.perez@navierarioplata.com",
      observaciones: "Especialista en cargas a granel",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Oceanic Shipping Ltda",
      taxId: "30987654321",
      nombre: "María Gómez",
      celular: "+55 13 9876-5432",
      email: "maria.gomez@oceanicshipping.com",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArmador, setEditingArmador] = useState<ArmadorPortuario | null>(null)
  const [formData, setFormData] = useState<ArmadorPortuarioFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const filteredArmadores = armadores.filter(
    (a) =>
      a.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.taxId.includes(searchTerm) ||
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedArmadores = [...filteredArmadores].sort((a, b) => {
    const aValue = a[sortField as keyof ArmadorPortuario]
    const bValue = b[sortField as keyof ArmadorPortuario]

    if (aValue === undefined || bValue === undefined) return 0

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = "La razón social es obligatoria"
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = "El Tax ID es obligatorio"
    } else if (!/^\d+$/.test(formData.taxId)) {
      newErrors.taxId = "Solo se permiten números sin guiones"
    } else if (formData.taxId.length < 8) {
      newErrors.taxId = "Debe tener al menos 8 dígitos"
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del contacto es obligatorio"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar duplicados
    const isDuplicate = armadores.some(
      (a) =>
        a.id !== editingArmador?.id &&
        (a.taxId === formData.taxId || a.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase())
    )

    if (isDuplicate) {
      newErrors.taxId = "Ya existe un armador con este Tax ID"
      newErrors.razonSocial = "Ya existe un armador con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ArmadorPortuarioFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingArmador) {
      setArmadores((prev) =>
        prev.map((a) =>
          a.id === editingArmador.id
            ? { ...a, ...formData, celular: formData.celular || undefined, email: formData.email || undefined }
            : a
        )
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Armador portuario actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newArmador: ArmadorPortuario = {
        id: Math.max(...armadores.map((a) => a.id), 0) + 1,
        ...formData,
        celular: formData.celular || undefined,
        email: formData.email || undefined,
        estado: "Activo",
      }
      setArmadores((prev) => [...prev, newArmador])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Armador portuario creado exitosamente
          </div>
        ),
      })
    }
    handleCloseDialog()
  }

  const handleEdit = (a: ArmadorPortuario) => {
    setEditingArmador(a)
    setFormData({
      razonSocial: a.razonSocial,
      taxId: a.taxId,
      nombre: a.nombre,
      celular: a.celular || "",
      email: a.email || "",
      observaciones: a.observaciones || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setArmadores((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: "Inactivo" } : a))
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Armador portuario dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingArmador(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setArmadores((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: a.estado === "Activo" ? "Inactivo" : "Activo" } : a))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar armadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArmador(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Armador Portuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingArmador ? "Editar Armador Portuario" : "Nuevo Armador Portuario"}</DialogTitle>
              <DialogDescription>
                {editingArmador
                  ? "Modifica los datos del armador seleccionado."
                  : "Completa los datos para crear un nuevo armador portuario."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={formData.razonSocial}
                    onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                    className={errors.razonSocial ? "border-red-500" : ""}
                  />
                  {errors.razonSocial && <p className="text-sm text-red-500">{errors.razonSocial}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID *</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value.replace(/\D/g, ""))}
                    placeholder="Solo números sin guiones"
                    className={errors.taxId ? "border-red-500" : ""}
                  />
                  {errors.taxId && <p className="text-sm text-red-500">{errors.taxId}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Contacto *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={errors.nombre ? "border-red-500" : ""}
                  />
                  {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@armador.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingArmador ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="razonSocial"
                label="Razón Social"
                icon={Building2}
                sortKey="razonSocial"
                currentSort={sortField}
                direction={sortField === "razonSocial" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="taxId"
                label="Tax ID"
                icon={Hash}
                sortKey="taxId"
                currentSort={sortField}
                direction={sortField === "taxId" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="nombre"
                label="Nombre Contacto"
                icon={User}
                sortKey="nombre"
                currentSort={sortField}
                direction={sortField === "nombre" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="celular"
                label="Celular"
                icon={CheckCircle}
                sortKey="celular"
                currentSort={sortField}
                direction={sortField === "celular" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="email"
                label="Email"
                icon={CheckCircle}
                sortKey="email"
                currentSort={sortField}
                direction={sortField === "email" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="estado"
                label="Estado"
                icon={CheckCircle}
                sortKey="estado"
                currentSort={sortField}
                direction={sortField === "estado" ? sortDirection : null}
                onSort={handleSort}
              />
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedArmadores.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.razonSocial}</TableCell>
                <TableCell>{a.taxId}</TableCell>
                <TableCell>{a.nombre}</TableCell>
                <TableCell>{a.celular || "-"}</TableCell>
                <TableCell>{a.email || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={a.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      a.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(a.id)}
                  >
                    {a.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(a)}>
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
                              Esta acción dará de baja al armador portuario <strong>{a.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(a.id)}>
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

      {sortedArmadores.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron armadores portuarios que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
} 