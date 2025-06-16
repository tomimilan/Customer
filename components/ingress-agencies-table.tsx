"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface IngressAgency {
  id: number
  descripcion: string
  razonSocial: string
  taxId: string
  puerto: string
  nombre: string
  celular?: string
  email?: string
  observaciones?: string
  estado: "Activo" | "Inactivo"
}

interface IngressAgencyFormData {
  descripcion: string
  razonSocial: string
  taxId: string
  puerto: string
  nombre: string
  celular: string
  email: string
  observaciones: string
}

interface FormErrors {
  descripcion?: string
  razonSocial?: string
  taxId?: string
  puerto?: string
  nombre?: string
  email?: string
}

const initialFormData: IngressAgencyFormData = {
  descripcion: "",
  razonSocial: "",
  taxId: "",
  puerto: "",
  nombre: "",
  celular: "",
  email: "",
  observaciones: "",
}

const ports = [
  "Puerto Buenos Aires",
  "Puerto de Santos",
  "Puerto de Valparaíso",
  "Puerto de Montevideo",
  "Puerto de Callao",
  "Puerto de Cartagena",
  "Puerto de Veracruz",
  "Puerto de Miami",
]

export function IngressAgenciesTable() {
  const [agencies, setAgencies] = useState<IngressAgency[]>([
    {
      id: 1,
      descripcion: "Agencia Marítima del Plata",
      razonSocial: "Agencia Marítima del Plata S.A.",
      taxId: "20123456789",
      puerto: "Puerto Buenos Aires",
      nombre: "Carlos Rodríguez",
      celular: "+54 9 11 1234-5678",
      email: "carlos.rodriguez@agenciaplata.com",
      observaciones: "Especializada en contenedores",
      estado: "Activo",
    },
    {
      id: 2,
      descripcion: "Santos Shipping Agency",
      razonSocial: "Santos Shipping Agency Ltda",
      taxId: "30987654321",
      puerto: "Puerto de Santos",
      nombre: "Ana Silva",
      celular: "+55 13 9876-5432",
      email: "ana.silva@santosshipping.com.br",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAgency, setEditingAgency] = useState<IngressAgency | null>(null)
  const [formData, setFormData] = useState<IngressAgencyFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sortField, setSortField] = useState<string>("descripcion")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.taxId.includes(searchTerm) ||
      agency.puerto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedAgencies = [...filteredAgencies].sort((a, b) => {
    const aValue = a[sortField as keyof IngressAgency]
    const bValue = b[sortField as keyof IngressAgency]

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

    if (!formData.puerto.trim()) {
      newErrors.puerto = "El puerto es obligatorio"
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del contacto es obligatorio"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar duplicados
    const isDuplicate = agencies.some(
      (agency) =>
        agency.id !== editingAgency?.id &&
        (agency.taxId === formData.taxId ||
          agency.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.taxId = "Ya existe una agencia con este Tax ID"
      newErrors.razonSocial = "Ya existe una agencia con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof IngressAgencyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingAgency) {
      setAgencies((prev) =>
        prev.map((agency) =>
          agency.id === editingAgency.id
            ? {
                ...agency,
                ...formData,
                celular: formData.celular || undefined,
                email: formData.email || undefined,
                observaciones: formData.observaciones || undefined,
              }
            : agency,
        ),
      )
    } else {
      const newAgency: IngressAgency = {
        id: Math.max(...agencies.map((a) => a.id), 0) + 1,
        ...formData,
        celular: formData.celular || undefined,
        email: formData.email || undefined,
        observaciones: formData.observaciones || undefined,
        estado: "Activo",
      }
      setAgencies((prev) => [...prev, newAgency])
    }

    handleCloseDialog()
    
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          {editingAgency ? "Agencia actualizada exitosamente" : "Agencia creada exitosamente"}
        </div>
      ),
    })
  }

  const handleEdit = (agency: IngressAgency) => {
    setEditingAgency(agency)
    setFormData({
      descripcion: agency.descripcion,
      razonSocial: agency.razonSocial,
      taxId: agency.taxId,
      puerto: agency.puerto,
      nombre: agency.nombre,
      celular: agency.celular || "",
      email: agency.email || "",
      observaciones: agency.observaciones || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setAgencies((prev) =>
      prev.map((agency) =>
        agency.id === id ? { ...agency, estado: "Inactivo" } : agency,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Agencia dada de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingAgency(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setAgencies((prev) =>
      prev.map((agency) =>
        agency.id === id ? { ...agency, estado: agency.estado === "Activo" ? "Inactivo" : "Activo" } : agency,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar agencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAgency(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Agencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingAgency ? "Editar Agencia de Ingreso" : "Nueva Agencia de Ingreso"}</DialogTitle>
              <DialogDescription>
                {editingAgency
                  ? "Modifica los datos de la agencia seleccionada."
                  : "Completa los datos para crear una nueva agencia de ingreso."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={formData.razonSocial}
                    onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                    className={errors.razonSocial ? "border-red-500" : ""}
                  />
                  {errors.razonSocial && <p className="text-xs text-red-500">{errors.razonSocial}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="taxId">Tax ID *</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value.replace(/\D/g, ""))}
                    placeholder="Solo números sin guiones"
                    className={errors.taxId ? "border-red-500" : ""}
                  />
                  {errors.taxId && <p className="text-xs text-red-500">{errors.taxId}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="puerto">Puerto *</Label>
                  <Select value={formData.puerto} onValueChange={(value) => handleInputChange("puerto", value)}>
                    <SelectTrigger className={errors.puerto ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar puerto" />
                    </SelectTrigger>
                    <SelectContent>
                      {ports.map((port) => (
                        <SelectItem key={port} value={port}>
                          {port}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.puerto && <p className="text-xs text-red-500">{errors.puerto}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="nombre">Nombre Contacto *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={errors.nombre ? "border-red-500" : ""}
                  />
                  {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="contacto@agencia.com"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingAgency ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="min-w-full">
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
                column="puerto"
                label="Puerto"
                icon={Building2}
                sortKey="puerto"
                currentSort={sortField}
                direction={sortField === "puerto" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="nombre"
                label="Contacto"
                icon={User}
                sortKey="nombre"
                currentSort={sortField}
                direction={sortField === "nombre" ? sortDirection : null}
                onSort={handleSort}
              />
              <TableHead>Celular</TableHead>
              <TableHead>Email</TableHead>
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
            {sortedAgencies.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell className="font-medium">{agency.razonSocial}</TableCell>
                <TableCell>{agency.taxId}</TableCell>
                <TableCell>{agency.puerto}</TableCell>
                <TableCell>{agency.nombre}</TableCell>
                <TableCell>{agency.celular || "-"}</TableCell>
                <TableCell>{agency.email || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      agency.estado === "Activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {agency.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(agency)}>
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
                              Esta acción dará de baja a la agencia <strong>{agency.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(agency.id)}>
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

      {filteredAgencies.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron agencias que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
