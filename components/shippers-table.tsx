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
import { Plus, Search, MoreHorizontal, Building2, Hash, MapPin, Globe, Building, Mail, CheckCircle, Edit, Trash2, MessageSquare, Settings2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Exportador {
  id: number
  razonSocial: string
  cuitRutNic: string
  direccion?: string
  pais?: string
  provincia?: string
  ciudad?: string
  cp?: string
  comentarios?: string
  estado: "Activo" | "Inactivo"
}

interface ExportadorFormData {
  razonSocial: string
  cuitRutNic: string
  direccion: string
  pais: string
  provincia: string
  ciudad: string
  cp: string
  comentarios: string
}

interface FormErrors {
  razonSocial?: string
  cuitRutNic?: string
  pais?: string
  provincia?: string
  ciudad?: string
  cp?: string
  direccion?: string
}

const initialFormData: ExportadorFormData = {
  razonSocial: "",
  cuitRutNic: "",
  direccion: "",
  pais: "",
  provincia: "",
  ciudad: "",
  cp: "",
  comentarios: "",
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
] as const;

type Country = typeof countries[number];

const provinces: Record<Country, string[]> = {
  "Argentina": ["Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza"],
  "Brasil": ["São Paulo", "Río de Janeiro", "Minas Gerais", "Bahía", "Paraná"],
  "Chile": ["Región Metropolitana de Santiago", "Valparaíso", "Biobío", "La Araucanía", "Los Lagos"],
  "Uruguay": ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú"],
  "Paraguay": ["Asunción", "Alto Paraguay", "Alto Paraná", "Amambay", "Boquerón"],
  "Bolivia": ["Santa Cruz", "La Paz", "Cochabamba", "Potosí", "Oruro"],
  "Colombia": ["Antioquia", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá"],
  "Perú": ["Lima", "Arequipa", "La Libertad", "Piura", "Lambayeque"],
  "Ecuador": ["Guayas", "Pichincha", "Azuay", "Manabí", "El Oro"],
  "Venezuela": ["Zulia", "Miranda", "Carabobo", "Distrito Capital", "Aragua"],
  "México": ["Ciudad de México", "Estado de México", "Jalisco", "Nuevo León", "Veracruz"],
  "Estados Unidos": ["California", "Texas", "Florida", "Nueva York", "Illinois"]
};

const cities: Record<string, string[]> = {
  "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes"],
  "CABA": ["Buenos Aires", "Palermo", "Recoleta", "San Telmo", "Puerto Madero"],
  "Córdoba": ["Córdoba", "Villa María", "Río Cuarto", "Alta Gracia", "Villa Carlos Paz"],
  "Santa Fe": ["Rosario", "Santa Fe", "Rafaela", "Venado Tuerto", "Santo Tomé"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo"],
  "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarulhos", "São Bernardo do Campo"],
  "Río de Janeiro": ["Río de Janeiro", "Niterói", "Nova Iguaçu", "São Gonçalo", "Duque de Caxias"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Región Metropolitana de Santiago": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
  "Montevideo": ["Montevideo", "Punta del Este", "Piriápolis", "Atlántida", "Las Piedras"],
  "Canelones": ["Canelones", "Santa Lucía", "Las Piedras", "Pando", "Progreso"],
  "Maldonado": ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar"],
  "Salto": ["Salto", "Paysandú", "Artigas", "Rivera", "Tacuarembó"],
  "Paysandú": ["Paysandú", "Salto", "Artigas", "Rivera", "Tacuarembó"],
  "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Lapuente"]
};

export function ExportadoresTable() {
  const [exportadores, setExportadores] = useState<Exportador[]>([
    {
      id: 1,
      razonSocial: "Exportadora del Sur S.A.",
      cuitRutNic: "20123456789",
      direccion: "Av. Corrientes 1234",
      pais: "Argentina",
      provincia: "Buenos Aires",
      ciudad: "Buenos Aires",
      cp: "C1043AAZ",
      comentarios: "Cliente preferencial",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "International Shipping Corp",
      cuitRutNic: "30987654321",
      direccion: "Rua das Flores 567",
      pais: "Brasil",
      provincia: "São Paulo",
      ciudad: "São Paulo",
      cp: "01234-567",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExportador, setEditingExportador] = useState<Exportador | null>(null)
  const [formData, setFormData] = useState<ExportadorFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const { toast } = useToast()
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const filteredExportadores = exportadores.filter((exportador) => {
    const matchesSearch =
      exportador.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exportador.cuitRutNic.includes(searchTerm) ||
      (exportador.pais && exportador.pais.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exportador.ciudad && exportador.ciudad.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || exportador.estado === statusFilter
    const matchesCountry = countryFilter === "all" || exportador.pais === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const sortedExportadores = [...filteredExportadores].sort((a, b) => {
    const aValue = a[sortField as keyof Exportador] || ""
    const bValue = b[sortField as keyof Exportador] || ""
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

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
    }

    if (!formData.pais) {
      newErrors.pais = "El país es obligatorio"
    }
    if (!formData.provincia) {
      newErrors.provincia = "La provincia es obligatoria"
    }
    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria"
    }
    if (!formData.cp?.trim()) {
      newErrors.cp = "El código postal es obligatorio"
    }

    // Validar duplicados
    const isDuplicate = exportadores.some(
      (exportador) =>
        exportador.id !== editingExportador?.id &&
        (exportador.cuitRutNic === formData.cuitRutNic ||
          exportador.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.cuitRutNic = "Ya existe un exportador con este CUIT/RUT/NIC/SP"
      newErrors.razonSocial = "Ya existe un exportador con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ExportadorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingExportador) {
      setExportadores((prev) =>
        prev.map((exportador) =>
          exportador.id === editingExportador.id
            ? {
                ...exportador,
                ...formData,
                direccion: formData.direccion || undefined,
                pais: formData.pais || undefined,
                ciudad: formData.ciudad || undefined,
                cp: formData.cp || undefined,
                comentarios: formData.comentarios || undefined,
              }
            : exportador,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Exportador actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newExportador: Exportador = {
        id: Math.max(...exportadores.map((s) => s.id), 0) + 1,
        ...formData,
        direccion: formData.direccion || undefined,
        pais: formData.pais || undefined,
        ciudad: formData.ciudad || undefined,
        cp: formData.cp || undefined,
        comentarios: formData.comentarios || undefined,
        estado: "Activo",
      }
      setExportadores((prev) => [...prev, newExportador])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Exportador creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (exportador: Exportador) => {
    setEditingExportador(exportador)
    setFormData({
      razonSocial: exportador.razonSocial,
      cuitRutNic: exportador.cuitRutNic,
      direccion: exportador.direccion || "",
      pais: exportador.pais || "",
      provincia: exportador.provincia || "",
      ciudad: exportador.ciudad || "",
      cp: exportador.cp || "",
      comentarios: exportador.comentarios || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setExportadores((prev) =>
      prev.map((exportador) =>
        exportador.id === id ? { ...exportador, estado: "Inactivo" } : exportador,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Exportador dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingExportador(null)
    setFormData({
      razonSocial: "",
      cuitRutNic: "",
      direccion: "",
      pais: "",
      provincia: "",
      ciudad: "",
      cp: "",
      comentarios: "",
    })
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setExportadores((prev) =>
      prev.map((exportador) =>
        exportador.id === id ? { ...exportador, estado: exportador.estado === "Activo" ? "Inactivo" : "Activo" } : exportador,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exportadores..."
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
            <Button onClick={() => setEditingExportador(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Exportador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingExportador ? "Editar Exportador" : "Nuevo Exportador"}</DialogTitle>
              <DialogDescription>
                {editingExportador
                  ? "Modifica los datos del exportador seleccionado."
                  : "Completa los datos para crear un nuevo exportador."}
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
                  <Select value={formData.pais} onValueChange={(value) => { setSelectedCountry(value); setSelectedProvince(""); handleInputChange("pais", value); handleInputChange("provincia", ""); handleInputChange("ciudad", ""); }}>
                    <SelectTrigger className={errors.pais ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pais && <p className="text-sm text-red-500">{errors.pais}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select value={formData.provincia || ""} onValueChange={(value) => { setSelectedProvince(value); handleInputChange("provincia", value); handleInputChange("ciudad", ""); }} disabled={!selectedCountry}>
                    <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCountry && provinces[selectedCountry as Country]?.map((province: string) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provincia && <p className="text-sm text-red-500">{errors.provincia}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Select value={formData.ciudad || ""} onValueChange={(value) => handleInputChange("ciudad", value)} disabled={!selectedProvince}>
                    <SelectTrigger className={errors.ciudad ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvince && cities[selectedProvince as string]?.map((city: string) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ciudad && <p className="text-sm text-red-500">{errors.ciudad}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input 
                    id="direccion" 
                    value={formData.direccion || ""} 
                    onChange={(e) => handleInputChange("direccion", e.target.value)} 
                    placeholder="Dirección completa" 
                    className={errors.direccion ? "border-red-500" : ""}
                  />
                  {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp">CP *</Label>
                <Input
                  id="cp"
                  value={formData.cp}
                  onChange={(e) => handleInputChange("cp", e.target.value)}
                  placeholder="Código Postal"
                  className={errors.cp ? "border-red-500" : ""}
                />
                {errors.cp && <p className="text-sm text-red-500">{errors.cp}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Input
                  id="comentarios"
                  value={formData.comentarios || ""}
                  onChange={(e) => handleInputChange("comentarios", e.target.value)}
                  placeholder="Comentarios adicionales"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingExportador ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Razón Social
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Hash className="h-4 w-4" />
                  CUIT/RUT/NIC/SP
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4" />
                  País
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Building className="h-4 w-4" />
                  Provincia
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Building className="h-4 w-4" />
                  Ciudad
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Estado
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Acciones
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExportadores.map((exportador) => (
              <TableRow key={exportador.id}>
                <TableCell className="text-center">{exportador.razonSocial}</TableCell>
                <TableCell className="text-center">{exportador.cuitRutNic}</TableCell>
                <TableCell className="text-center">{exportador.pais}</TableCell>
                <TableCell className="text-center">{exportador.provincia}</TableCell>
                <TableCell className="text-center">{exportador.ciudad}</TableCell>
                <TableCell className="text-center">{exportador.direccion}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={exportador.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      exportador.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(exportador.id)}
                  >
                    {exportador.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(exportador)}>
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
                              Esta acción dará de baja al exportador <strong>{exportador.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(exportador.id)}>
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

      {filteredExportadores.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron exportadores que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
