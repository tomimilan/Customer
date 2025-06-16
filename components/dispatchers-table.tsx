"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Building2, Hash, Globe, MapPin, Phone, Mail, CheckCircle, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Dispatcher {
  id: number
  razonSocial: string
  cuitRutNic: string
  pais: string
  provincia: string
  celular?: string
  email?: string
  estado: "Activo" | "Inactivo"
}

interface DispatcherFormData {
  razonSocial: string
  cuitRutNic: string
  pais: string
  provincia: string
  celular: string
  email: string
}

interface FormErrors {
  razonSocial?: string
  cuitRutNic?: string
  pais?: string
  provincia?: string
  email?: string
}

const initialFormData: DispatcherFormData = {
  razonSocial: "",
  cuitRutNic: "",
  pais: "",
  provincia: "",
  celular: "",
  email: "",
}

const countries = [
  "Argentina",
  "Brasil",
  "Chile",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Colombia",
  "Perú",
  "Ecuador",
  "Venezuela",
  "México",
  "Estados Unidos",
]

const provinces = {
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Misiones"],
  Brasil: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
  Chile: ["Región Metropolitana", "Valparaíso", "Biobío", "Araucanía", "Los Lagos", "Antofagasta"],
  Uruguay: ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú", "Rivera"],
}

export function DispatchersTable() {
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([
    {
      id: 1,
      razonSocial: "Despachante Central S.A.",
      cuitRutNic: "20123456789",
      pais: "Argentina",
      provincia: "Buenos Aires",
      celular: "+54 9 11 1234-5678",
      email: "info@despachantecentral.com",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Logística Integral Ltda",
      cuitRutNic: "30987654321",
      pais: "Brasil",
      provincia: "São Paulo",
      celular: "+55 11 98765-4321",
      email: "contato@logisticaintegral.com.br",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDispatcher, setEditingDispatcher] = useState<Dispatcher | null>(null)
  const [formData, setFormData] = useState<DispatcherFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()

  const filteredDispatchers = dispatchers.filter((dispatcher) => {
    const matchesSearch =
      dispatcher.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatcher.cuitRutNic.includes(searchTerm) ||
      dispatcher.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatcher.provincia.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || dispatcher.estado === statusFilter
    const matchesCountry = countryFilter === "all" || dispatcher.pais === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const sortedDispatchers = [...filteredDispatchers].sort((a, b) => {
    const aValue = a[sortField as keyof Dispatcher] || ""
    const bValue = b[sortField as keyof Dispatcher] || ""
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

    if (!formData.cuitRutNic.trim()) {
      newErrors.cuitRutNic = "El CUIT/RUT/NIC/SP es obligatorio"
    } else if (!/^\d+$/.test(formData.cuitRutNic)) {
      newErrors.cuitRutNic = "Solo se permiten números sin guiones"
    } else if (formData.cuitRutNic.length < 8) {
      newErrors.cuitRutNic = "Debe tener al menos 8 dígitos"
    }

    if (!formData.pais.trim()) {
      newErrors.pais = "El país es obligatorio"
    }

    if (!formData.provincia.trim()) {
      newErrors.provincia = "La provincia es obligatoria"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar duplicados
    const isDuplicate = dispatchers.some(
      (dispatcher) =>
        dispatcher.id !== editingDispatcher?.id &&
        (dispatcher.cuitRutNic === formData.cuitRutNic ||
          dispatcher.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.cuitRutNic = "Ya existe un despachante con este CUIT/RUT/NIC/SP"
      newErrors.razonSocial = "Ya existe un despachante con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof DispatcherFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCountryChange = (country: string) => {
    setFormData((prev) => ({ ...prev, pais: country, provincia: "" }))
    if (errors.pais) {
      setErrors((prev) => ({ ...prev, pais: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingDispatcher) {
      setDispatchers((prev) =>
        prev.map((dispatcher) =>
          dispatcher.id === editingDispatcher.id
            ? {
                ...dispatcher,
                ...formData,
                celular: formData.celular || undefined,
                email: formData.email || undefined,
              }
            : dispatcher,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Despachante actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newDispatcher: Dispatcher = {
        id: Math.max(...dispatchers.map((d) => d.id), 0) + 1,
        ...formData,
        celular: formData.celular || undefined,
        email: formData.email || undefined,
        estado: "Activo",
      }
      setDispatchers((prev) => [...prev, newDispatcher])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Despachante creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (dispatcher: Dispatcher) => {
    setEditingDispatcher(dispatcher)
    setFormData({
      razonSocial: dispatcher.razonSocial,
      cuitRutNic: dispatcher.cuitRutNic,
      pais: dispatcher.pais,
      provincia: dispatcher.provincia,
      celular: dispatcher.celular || "",
      email: dispatcher.email || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setDispatchers((prev) =>
      prev.map((dispatcher) =>
        dispatcher.id === id ? { ...dispatcher, estado: "Inactivo" } : dispatcher,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Despachante dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingDispatcher(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setDispatchers((prev) =>
      prev.map((dispatcher) =>
        dispatcher.id === id
          ? { ...dispatcher, estado: dispatcher.estado === "Activo" ? "Inactivo" : "Activo" }
          : dispatcher,
      ),
    )
  }

  const availableProvinces = formData.pais ? provinces[formData.pais as keyof typeof provinces] || [] : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar despachantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los países</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDispatcher(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Despachante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDispatcher ? "Editar Despachante" : "Nuevo Despachante"}</DialogTitle>
              <DialogDescription>
                {editingDispatcher
                  ? "Modifica los datos del despachante seleccionado."
                  : "Completa los datos para crear un nuevo despachante."}
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
                  <Label htmlFor="cuitRutNic">CUIT/RUT/NIC/SP *</Label>
                  <Input
                    id="cuitRutNic"
                    value={formData.cuitRutNic}
                    onChange={(e) => handleInputChange("cuitRutNic", e.target.value.replace(/\D/g, ""))}
                    placeholder="Solo números sin guiones"
                    className={errors.cuitRutNic ? "border-red-500" : ""}
                  />
                  {errors.cuitRutNic && <p className="text-sm text-red-500">{errors.cuitRutNic}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pais">País *</Label>
                  <Select value={formData.pais} onValueChange={handleCountryChange}>
                    <SelectTrigger className={errors.pais ? "border-red-500" : ""}>
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
                  {errors.pais && <p className="text-sm text-red-500">{errors.pais}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select
                    value={formData.provincia}
                    onValueChange={(value) => handleInputChange("provincia", value)}
                    disabled={!formData.pais}
                  >
                    <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provincia && <p className="text-sm text-red-500">{errors.provincia}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@despachante.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingDispatcher ? "Actualizar" : "Crear"}</Button>
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
                column="cuitRutNic"
                label="CUIT/RUT/NIC/SP"
                icon={Hash}
                sortKey="cuitRutNic"
                currentSort={sortField}
                direction={sortField === "cuitRutNic" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="pais"
                label="País"
                icon={Globe}
                sortKey="pais"
                currentSort={sortField}
                direction={sortField === "pais" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="provincia"
                label="Provincia"
                icon={MapPin}
                sortKey="provincia"
                currentSort={sortField}
                direction={sortField === "provincia" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="celular"
                label="Celular"
                icon={Phone}
                sortKey="celular"
                currentSort={sortField}
                direction={sortField === "celular" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="email"
                label="Email"
                icon={Mail}
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
            {sortedDispatchers.map((dispatcher) => (
              <TableRow key={dispatcher.id}>
                <TableCell className="font-medium">{dispatcher.razonSocial}</TableCell>
                <TableCell>{dispatcher.cuitRutNic}</TableCell>
                <TableCell>{dispatcher.pais}</TableCell>
                <TableCell>{dispatcher.provincia}</TableCell>
                <TableCell>{dispatcher.celular || "-"}</TableCell>
                <TableCell>{dispatcher.email || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={dispatcher.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      dispatcher.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(dispatcher.id)}
                  >
                    {dispatcher.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(dispatcher)}>
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
                              Esta acción dará de baja al despachante <strong>{dispatcher.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(dispatcher.id)}>
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

      {sortedDispatchers.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron despachantes que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
