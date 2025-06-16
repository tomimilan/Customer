"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, CheckCircle, Building2, Hash, MapPin, Globe, Building, Mail, FileText, MessageSquare, Settings2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
type ProvinceMap = Record<Country, string[]>;
const provinces: ProvinceMap = {
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Misiones", "Chaco", "Corrientes"],
  Brasil: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
  Chile: ["Región Metropolitana", "Valparaíso", "Biobío", "Araucanía", "Los Lagos", "Antofagasta"],
  Uruguay: ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú", "Rivera"],
  Paraguay: [],
  Bolivia: [],
  Colombia: [],
  Perú: [],
  Ecuador: [],
  Venezuela: [],
  México: [],
  "Estados Unidos": [],
};
type Province = string;
type CityMap = Record<Province, string[]>;
const cities: CityMap = {
  "Buenos Aires": ["Ciudad Autónoma de Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes"],
  "Córdoba": ["Córdoba", "Río Cuarto", "Villa María", "San Francisco", "Villa Carlos Paz"],
  "Santa Fe": ["Santa Fe", "Rosario", "Rafaela", "Venado Tuerto", "Santo Tomé"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Aguilares", "Banda del Río Salí"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay", "Victoria"],
  "Salta": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Metán", "Cafayate"],
  "Misiones": ["Posadas", "Oberá", "Eldorado", "Puerto Iguazú", "San Vicente"],
  "Chaco": ["Resistencia", "Barranqueras", "Villa Ángela", "Presidencia Roque Sáenz Peña", "Charata"],
  "Corrientes": ["Corrientes", "Goya", "Mercedes", "Curuzú Cuatiá", "Paso de los Libres"],
  "São Paulo": ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
  "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
  "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
  "Biobío": ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel"],
  "Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal"],
  "Montevideo": ["Montevideo", "Punta del Este", "Piriápolis", "Atlántida", "Las Piedras"],
  "Canelones": ["Canelones", "Santa Lucía", "Las Piedras", "Pando", "Progreso"],
  "Maldonado": ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar"],
  "Salto": ["Salto", "Paysandú", "Artigas", "Rivera", "Tacuarembó"],
  "Paysandú": ["Paysandú", "Salto", "Artigas", "Rivera", "Tacuarembó"],
  "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Lapuente"],
};

interface Importador {
  id: number
  razonSocial: string
  cuitRutNic: string
  direccion: string
  pais: string
  provincia: string
  ciudad: string
  cp: string
  comentarios?: string
  estado: "Activo" | "Inactivo"
}

interface ImportadorFormData {
  razonSocial: string
  cuitRutNic: string
  direccion: string
  pais: string
  provincia: string
  ciudad: string
  cp: string
  comentarios?: string
}

interface FormErrors {
  razonSocial?: string
  cuitRutNic?: string
  direccion?: string
  pais?: string
  provincia?: string
  ciudad?: string
  cp?: string
}

const initialFormData: ImportadorFormData = {
  razonSocial: "",
  cuitRutNic: "",
  direccion: "",
  pais: "",
  provincia: "",
  ciudad: "",
  cp: "",
  comentarios: "",
}

export function ImportadoresTable() {
  const [importadores, setImportadores] = useState<Importador[]>([
    {
      id: 1,
      razonSocial: "Importadora del Sur S.A.",
      cuitRutNic: "30712345678",
      direccion: "Av. Libertador 5678",
      pais: "Argentina",
      provincia: "Buenos Aires",
      ciudad: "Buenos Aires",
      cp: "C1426AAA",
      comentarios: "Cliente preferencial",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Comercio Exterior Brasil Ltda.",
      cuitRutNic: "12345678901234",
      direccion: "Rua Augusta 1234",
      pais: "Brasil",
      provincia: "São Paulo",
      ciudad: "São Paulo",
      cp: "01305-100",
      comentarios: "Importador frecuente",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImportador, setEditingImportador] = useState<Importador | null>(null)
  const [formData, setFormData] = useState<ImportadorFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedProvince, setSelectedProvince] = useState<string>("")

  const filteredImportadores = importadores.filter((importador) => {
    const matchesSearch =
      importador.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      importador.cuitRutNic.includes(searchTerm) ||
      (importador.pais && importador.pais.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (importador.provincia && importador.provincia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (importador.ciudad && importador.ciudad.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || importador.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedImportadores = [...filteredImportadores].sort((a, b) => {
    const aValue = a[sortField as keyof Importador] || ""
    const bValue = b[sortField as keyof Importador] || ""
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

    if (!formData.pais) {
      newErrors.pais = "El país es obligatorio"
    }

    if (!formData.provincia) {
      newErrors.provincia = "La provincia es obligatoria"
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria"
    }

    if (!formData.direccion?.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
    }

    if (!formData.cp?.trim()) {
      newErrors.cp = "El código postal es obligatorio"
    }

    // Validar duplicados
    const isDuplicate = importadores.some(
      (importador) =>
        importador.id !== editingImportador?.id &&
        (importador.cuitRutNic === formData.cuitRutNic ||
          importador.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.cuitRutNic = "Ya existe un importador con este CUIT/RUT/NIC/SP"
      newErrors.razonSocial = "Ya existe un importador con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ImportadorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingImportador) {
      setImportadores((prev) =>
        prev.map((importador) =>
          importador.id === editingImportador.id
            ? {
                ...importador,
                razonSocial: formData.razonSocial,
                cuitRutNic: formData.cuitRutNic,
                direccion: formData.direccion,
                pais: formData.pais,
                provincia: formData.provincia,
                ciudad: formData.ciudad,
                cp: formData.cp,
                comentarios: formData.comentarios || "",
              }
            : importador,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Importador actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newImportador: Importador = {
        id: Math.max(...importadores.map((c) => c.id), 0) + 1,
        razonSocial: formData.razonSocial,
        cuitRutNic: formData.cuitRutNic,
        direccion: formData.direccion,
        pais: formData.pais,
        provincia: formData.provincia,
        ciudad: formData.ciudad,
        cp: formData.cp,
        comentarios: formData.comentarios || "",
        estado: "Activo",
      }
      setImportadores((prev) => [...prev, newImportador])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Importador creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (importador: Importador) => {
    setEditingImportador(importador)
    setFormData({
      razonSocial: importador.razonSocial,
      cuitRutNic: importador.cuitRutNic,
      direccion: importador.direccion,
      pais: importador.pais,
      provincia: importador.provincia,
      ciudad: importador.ciudad,
      cp: importador.cp,
      comentarios: importador.comentarios,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setImportadores((prev) =>
      prev.map((importador) =>
        importador.id === id ? { ...importador, estado: "Inactivo" } : importador,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Importador dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingImportador(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setImportadores((prev) =>
      prev.map((importador) =>
        importador.id === id
          ? { ...importador, estado: importador.estado === "Activo" ? "Inactivo" : "Activo" }
          : importador,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar importadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
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
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingImportador(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Importador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingImportador ? "Editar Importador" : "Nuevo Importador"}</DialogTitle>
              <DialogDescription>
                {editingImportador
                  ? "Modifica los datos del importador seleccionado."
                  : "Completa los datos para crear un nuevo importador."}
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
                      {selectedProvince && cities[selectedProvince as Province]?.map((city: string) => (
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
              <Button onClick={handleSubmit}>{editingImportador ? "Actualizar" : "Crear"}</Button>
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
            {filteredImportadores.map((importador) => (
              <TableRow key={importador.id}>
                <TableCell className="text-center">{importador.razonSocial}</TableCell>
                <TableCell className="text-center">{importador.cuitRutNic}</TableCell>
                <TableCell className="text-center">{importador.pais}</TableCell>
                <TableCell className="text-center">{importador.provincia}</TableCell>
                <TableCell className="text-center">{importador.ciudad}</TableCell>
                <TableCell className="text-center">{importador.direccion}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      importador.estado === "Activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {importador.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(importador)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción dará de baja al importador <strong>{importador.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(importador.id)}>
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

      {filteredImportadores.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron importadores que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
